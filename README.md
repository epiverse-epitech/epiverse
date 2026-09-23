# EpiVerse

Monorepo du projet EpiVerse (T-ESP-800).

```
apps/api/          API NestJS + Prisma            Eckson
apps/app/          App Expo (mobile et web)       Philimon, Julien
docs/database/     schéma BDD et revues           Thomas, Lina, Belaid
infra/             Docker, serveurs, scripts      Baye, Estelle
.github/           CI/CD, modèle de PR            Baye, Estelle
docker-compose.yml environnement local
```

## Démarrer

```bash
cp .env.example .env
docker compose up -d        # PostgreSQL (pgvector) sur 5432, Redis sur 6379
```

Détails, rôles et déploiement : `infra/README.md`.

## Règles Git (DOC-013)

- Jamais de push direct sur `main` ni `develop` : une branche, une pull request, CI verte, une relecture.
- Branches `feature/<ticket>-<sujet>`, `fix/…`, `docs/…`.
- Commits `type(scope): message`, ex. `feat(events): ajouter le filtre date`.
