#!/bin/sh
# Installe les dépendances selon le lockfile présent (npm par défaut).
set -eu

if [ -f package-lock.json ]; then
  npm ci
elif [ -f pnpm-lock.yaml ]; then
  corepack enable pnpm
  pnpm install --frozen-lockfile
elif [ -f yarn.lock ]; then
  corepack enable yarn
  if grep -q '__metadata' yarn.lock; then
    yarn install --immutable
  else
    yarn install --frozen-lockfile
  fi
else
  echo "[install] Aucun lockfile : npm install (build non reproductible, commitez package-lock.json)." >&2
  npm install
fi
