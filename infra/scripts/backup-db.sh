#!/usr/bin/env bash
# EpiVerse — sauvegarde chiffrée de la base PostgreSQL d'un environnement serveur.
#
# Usage : backup-db.sh <staging|production>
# Tous les jours à 3 h 15 (crontab -e de l'utilisateur deploy) :
#   15 3 * * * /opt/epiverse/scripts/backup-db.sh production >> /opt/epiverse/backups/backup.log 2>&1
#
# Cible DOC-014 : sauvegarde quotidienne chiffrée (RPO 24 h), rétention définie, copie hors du serveur.
set -euo pipefail

ENV_NAME="${1:?Usage : backup-db.sh <staging|production>}"
case "$ENV_NAME" in staging|production) ;; *) echo "Environnement inconnu : $ENV_NAME" >&2; exit 2 ;; esac
BASE_DIR="${EPIVERSE_BASE_DIR:-/opt/epiverse}"
cd "$BASE_DIR/$ENV_NAME"

env_value() { sed -n "s/^$1=//p" .env | tail -n 1; }
POSTGRES_USER="$(env_value POSTGRES_USER)"
POSTGRES_DB="$(env_value POSTGRES_DB)"
BACKUP_DIR="$(env_value BACKUP_DIR)"
BACKUP_DIR="${BACKUP_DIR:-$BASE_DIR/backups/$ENV_NAME}"
RETENTION="$(env_value BACKUP_RETENTION_DAYS)"
RETENTION="${RETENTION:-14}"
RCLONE_REMOTE="$(env_value BACKUP_RCLONE_REMOTE)"
if [ "$ENV_NAME" = "production" ] && [ -z "$RCLONE_REMOTE" ]; then
  echo "[backup production] BACKUP_RCLONE_REMOTE obligatoire pour éviter une sauvegarde uniquement locale." >&2
  exit 1
fi
if [ -n "$RCLONE_REMOTE" ]; then
  if ! command -v rclone >/dev/null 2>&1; then
    echo "[backup $ENV_NAME] BACKUP_RCLONE_REMOTE est défini mais rclone n'est pas installé." >&2
    exit 1
  fi
  RCLONE_NAME="${RCLONE_REMOTE%%:*}"
  case "$RCLONE_REMOTE" in
    :*|/*|./*|../*|local:*|"$RCLONE_NAME")
      echo "[backup $ENV_NAME] BACKUP_RCLONE_REMOTE doit être un remote rclone distant au format remote:path (les destinations locales sont refusées)." >&2
      exit 1
      ;;
  esac
  if ! rclone listremotes | grep -Fxq "$RCLONE_NAME:"; then
    echo "[backup $ENV_NAME] Remote rclone inconnu : $RCLONE_NAME." >&2
    exit 1
  fi
  RCLONE_TYPE="$(rclone config show "$RCLONE_NAME" | sed -n 's/^type = //p' | tail -n 1)"
  if [ "$RCLONE_TYPE" = "local" ]; then
    echo "[backup $ENV_NAME] Le remote rclone local '$RCLONE_NAME' est refusé pour une copie hors serveur." >&2
    exit 1
  fi
fi
BACKUP_PASSPHRASE="$(env_value BACKUP_PASSPHRASE)"
export BACKUP_PASSPHRASE
[ -n "$BACKUP_PASSPHRASE" ] || { echo "BACKUP_PASSPHRASE vide dans .env : sauvegarde non chiffrée refusée." >&2; exit 1; }

umask 077
mkdir -p "$BACKUP_DIR"
FILE="$BACKUP_DIR/epiverse-$ENV_NAME-$(date -u +%Y%m%dT%H%M%SZ).dump.enc"
trap 'rm -f "$FILE.part"' EXIT

docker compose -f docker-compose.server.yml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner \
  | openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt -pass env:BACKUP_PASSPHRASE -out "$FILE.part"

[ -s "$FILE.part" ] || { echo "Sauvegarde vide : abandon." >&2; exit 1; }
mv "$FILE.part" "$FILE"
echo "[backup $ENV_NAME] $(date -u +%Y-%m-%dT%H:%M:%SZ) $FILE ($(du -h "$FILE" | cut -f1))"

find "$BACKUP_DIR" -name "epiverse-$ENV_NAME-*.dump.enc" -type f -mtime +"$RETENTION" -delete

if [ -n "$RCLONE_REMOTE" ]; then
  rclone copy "$FILE" "$RCLONE_REMOTE/$ENV_NAME/"
  echo "[backup $ENV_NAME] Copie hors serveur : $RCLONE_REMOTE/$ENV_NAME/"
fi
