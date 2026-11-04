#!/usr/bin/env bash
# Provision the restricted runtime role after running Prisma migrations.
# Password is consumed *inside* the PostgreSQL container from its environment.
set -euo pipefail

ENV_NAME="${1:?Usage : provision-app-db.sh <staging|production>}"
case "$ENV_NAME" in staging|production) ;; *) echo "Environnement inconnu : $ENV_NAME" >&2; exit 2 ;; esac
BASE_DIR="${EPIVERSE_BASE_DIR:-/opt/epiverse}"
cd "$BASE_DIR/$ENV_NAME"

docker compose -f docker-compose.server.yml exec -T postgres \
  sh -c 'psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
\getenv app_password APP_DB_PASSWORD
\getenv db_name POSTGRES_DB
SELECT format('CREATE ROLE epiverse_app LOGIN PASSWORD %L', :'app_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'epiverse_app')
\gexec
ALTER ROLE epiverse_app WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION PASSWORD :'app_password';
GRANT CONNECT ON DATABASE :"db_name" TO epiverse_app;
GRANT USAGE ON SCHEMA public TO epiverse_app;
REVOKE CREATE ON SCHEMA public FROM epiverse_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO epiverse_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO epiverse_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO epiverse_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO epiverse_app;
SQL
echo "[database $ENV_NAME] Rôle applicatif epiverse_app provisionné (DML uniquement)."
