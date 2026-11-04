# syntax=docker/dockerfile:1
# EpiVerse — image web de l'app Expo : export statique servi par nginx (non-root, port 8080)
#
# Contexte de build : la racine du dépôt.
#   docker build -f infra/docker/web.Dockerfile --build-arg APP_DIR=apps/app -t epiverse-web .
#
# L'app appelle l'API en relatif (EXPO_PUBLIC_API_URL=/api) : le reverse proxy envoie /api vers l'API
# sur le même domaine. La même image sert donc en local, en staging et en production.

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app
ENV CI=1 \
    EXPO_NO_TELEMETRY=1
ARG APP_DIR=apps/app
COPY --chmod=755 infra/docker/install-deps.sh /usr/local/bin/install-deps
COPY ${APP_DIR}/ ./
RUN --mount=type=cache,target=/root/.npm install-deps
ARG EXPO_PUBLIC_API_URL=/api
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}
# EXPO_OFFLINE : l'export n'a besoin d'aucun service Expo en ligne, le build ne dépend donc pas du réseau.
RUN EXPO_OFFLINE=1 npx expo export --platform web --output-dir dist

FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime
COPY infra/docker/nginx-web.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# Make the unprivileged account explicit for IaC scanners and image review.
USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
