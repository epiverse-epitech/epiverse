#!/bin/sh
# Point d'entrée de l'image API EpiVerse.
#   (sans argument)  démarre l'API (dist/main.js)
#   migrate          applique les migrations Prisma puis s'arrête (utilisé par deploy.sh)
#   <commande>       exécute la commande donnée (ex. : sh)
set -eu

run_migrations() {
  if [ -x node_modules/.bin/prisma ] && { [ -d prisma ] || [ -f prisma.config.ts ]; }; then
    echo "[api] Migrations Prisma : prisma migrate deploy"
    node_modules/.bin/prisma migrate deploy
  else
    echo "[api] Pas de Prisma dans l'image : aucune migration à appliquer."
  fi
}

if [ "${1:-}" = "migrate" ]; then
  run_migrations
  exit 0
fi

if [ "$#" -gt 0 ]; then
  exec "$@"
fi

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  run_migrations
fi

for entry in "${API_ENTRY:-}" dist/main.js dist/src/main.js; do
  if [ -n "$entry" ] && [ -f "$entry" ]; then
    echo "[api] Démarrage : node $entry"
    exec node "$entry"
  fi
done

echo "[api] Point d'entrée introuvable (dist/main.js). Vérifie que « npm run build » produit bien dist/." >&2
exit 1
