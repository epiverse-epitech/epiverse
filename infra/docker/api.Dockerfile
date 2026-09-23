# syntax=docker/dockerfile:1
# EpiVerse — image de l'API (NestJS + Prisma)
#
# Contexte de build : la racine du dépôt.
#   docker build -f infra/docker/api.Dockerfile --build-arg API_DIR=apps/api -t epiverse-api .
#
# Contrat attendu de l'API (voir infra/README.md) :
#   - écoute sur $PORT (3000) avec le préfixe global /api
#   - répond 200 sur GET /api/health
#   - lit DATABASE_URL et REDIS_URL

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm-slim AS base
# openssl : requis par Prisma. ca-certificates : appels HTTPS sortants (e-mail, stockage…).
# hadolint ignore=DL3008
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS build
ARG API_DIR=apps/api
COPY --chmod=755 infra/docker/install-deps.sh /usr/local/bin/install-deps
# Le code source est copié avant l'installation : un éventuel « postinstall: prisma generate »
# trouve ainsi le schéma. Les caches npm gardent l'installation rapide.
COPY ${API_DIR}/ ./
RUN --mount=type=cache,target=/root/.npm install-deps
RUN if [ -d prisma ] || [ -f prisma.config.ts ]; then node_modules/.bin/prisma generate; fi \
 && npm run build

FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000
# node_modules est conservé en entier : la CLI Prisma sert à appliquer les migrations au déploiement.
COPY --from=build --chown=node:node /app ./
COPY --chmod=755 infra/docker/api-entrypoint.sh /usr/local/bin/api-entrypoint
# 1000 = utilisateur « node » de l'image officielle : l'API ne tourne jamais en root.
USER 1000:1000
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=5 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+(process.env.HEALTH_PATH||'/api/health')).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
ENTRYPOINT ["api-entrypoint"]
