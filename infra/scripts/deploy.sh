#!/usr/bin/env bash
# EpiVerse — déploie une version sur un environnement serveur.
#
# Usage : deploy.sh <staging|production> <tag-image>
#   ex. : deploy.sh staging sha-1a2b3c4
#
# Appelé par la CI (.github/workflows/deploy.yml). À la main, il sert au retour arrière :
#   deploy.sh staging <tag précédent>     (versions déployées : /opt/epiverse/<env>/deploy-history.log)
#
# Étapes : images → PostgreSQL et Redis → sauvegarde → migrations → nouveaux conteneurs
#          → contrôle de santé → retour automatique à la version précédente en cas d'échec.
set -euo pipefail

usage() { echo "Usage : $0 <staging|production> <tag-image>" >&2; exit 2; }
[ "$#" -eq 2 ] || usage
ENV_NAME="$1"
TAG="$2"
case "$ENV_NAME" in staging|production) ;; *) usage ;; esac
[[ "$TAG" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "Tag invalide : $TAG" >&2; exit 2; }

BASE_DIR="${EPIVERSE_BASE_DIR:-/opt/epiverse}"
ENV_DIR="$BASE_DIR/$ENV_NAME"
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}"
COMPOSE_FILE_NAME="docker-compose.server.yml"

log() { printf '[deploy %s %s] %s\n' "$ENV_NAME" "$(date -u +%H:%M:%S)" "$*"; }
compose() { docker compose -f "$COMPOSE_FILE_NAME" "$@"; }
set_tag() {
  if grep -q '^IMAGE_TAG=' .env; then
    sed -i "s|^IMAGE_TAG=.*|IMAGE_TAG=$1|" .env
  else
    printf 'IMAGE_TAG=%s\n' "$1" >> .env
  fi
}

cd "$ENV_DIR"
for f in .env api.env "$COMPOSE_FILE_NAME"; do
  [ -f "$f" ] || { echo "Fichier manquant : $ENV_DIR/$f (voir infra/README.md)" >&2; exit 1; }
done

PREVIOUS_TAG="$(sed -n 's/^IMAGE_TAG=//p' .env | tail -n 1)"
docker network inspect epiverse-edge >/dev/null 2>&1 || docker network create epiverse-edge >/dev/null

rollback() {
  log "ÉCHEC : $1"
  if [ -n "$PREVIOUS_TAG" ] && [ "$PREVIOUS_TAG" != "$TAG" ]; then
    log "Retour à la version $PREVIOUS_TAG…"
    set_tag "$PREVIOUS_TAG"
    compose up -d --remove-orphans || true
    log "Retour arrière fait. Si une migration a déjà modifié la base, restaurer la sauvegarde du jour :"
    log "  $SCRIPTS_DIR/restore-db.sh $ENV_NAME <fichier.dump.enc>"
  fi
  exit 1
}

log "Version demandée : $TAG (en service : ${PREVIOUS_TAG:-aucune})"
set_tag "$TAG"

log "Téléchargement des images…"
compose pull api web || rollback "images introuvables pour le tag $TAG"

log "Démarrage de PostgreSQL et Redis…"
compose up -d --wait postgres redis || rollback "PostgreSQL ou Redis ne démarre pas"

if [ "${SKIP_BACKUP:-false}" != "true" ]; then
  log "Sauvegarde de la base avant migration…"
  "$SCRIPTS_DIR/backup-db.sh" "$ENV_NAME" || rollback "sauvegarde impossible, migration annulée"
fi

log "Migrations de la base…"
compose run --rm --no-deps api migrate || rollback "migration refusée"

log "Mise à jour des conteneurs…"
if ! compose up -d --remove-orphans --wait --wait-timeout "$HEALTH_TIMEOUT"; then
  compose logs --tail 60 api web || true
  rollback "l'API ou le web n'est pas en bonne santé après ${HEALTH_TIMEOUT}s"
fi

printf '%s %s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$TAG" "${DEPLOY_SOURCE:-manuel}" >> deploy-history.log
docker image prune -af --filter "until=168h" >/dev/null 2>&1 || true
log "OK : $ENV_NAME tourne en version $TAG"
