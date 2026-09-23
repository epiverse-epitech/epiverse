#!/usr/bin/env bash
# EpiVerse — restaure une sauvegarde chiffrée dans la base d'un environnement serveur.
#
# Usage : restore-db.sh <staging|production> <fichier.dump.enc> [--yes]
# Cible DOC-014 : RTO 4 h ; la restauration doit être testée en staging avant le pilote (gate G6).
set -euo pipefail

usage() { echo "Usage : $0 <staging|production> <fichier.dump.enc> [--yes]" >&2; exit 2; }
[ "$#" -ge 2 ] || usage
ENV_NAME="$1"
FILE="$2"
CONFIRM="${3:-}"
case "$ENV_NAME" in staging|production) ;; *) usage ;; esac
[ -f "$FILE" ] || { echo "Fichier introuvable : $FILE" >&2; exit 1; }
FILE="$(cd "$(dirname "$FILE")" && pwd)/$(basename "$FILE")"

BASE_DIR="${EPIVERSE_BASE_DIR:-/opt/epiverse}"
cd "$BASE_DIR/$ENV_NAME"

env_value() { sed -n "s/^$1=//p" .env | tail -n 1; }
POSTGRES_USER="$(env_value POSTGRES_USER)"
POSTGRES_DB="$(env_value POSTGRES_DB)"
BACKUP_PASSPHRASE="$(env_value BACKUP_PASSPHRASE)"
export BACKUP_PASSPHRASE
compose() { docker compose -f docker-compose.server.yml "$@"; }

if [ "$CONFIRM" != "--yes" ]; then
  echo "ATTENTION : la base « $POSTGRES_DB » de $ENV_NAME va être remplacée par :"
  echo "  $FILE"
  read -r -p "Tape « $ENV_NAME » pour confirmer : " answer
  [ "$answer" = "$ENV_NAME" ] || { echo "Annulé."; exit 1; }
fi

echo "[restore $ENV_NAME] Arrêt de l'API pendant la restauration…"
compose stop api
restart_api() { echo "[restore $ENV_NAME] Redémarrage de l'API…"; compose start api; }
trap restart_api EXIT

openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -pass env:BACKUP_PASSPHRASE -in "$FILE" \
  | compose exec -T postgres \
      pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --single-transaction

echo "[restore $ENV_NAME] Restauration terminée."
