# EpiVerse

Monorepo du projet EpiVerse (T-ESP-800).

```
apps/api/          API NestJS + Prisma            Eckson
apps/app/          App Expo (mobile et web)       Philimon, Julien
packages/campus/   Campus 2.5D (module Phaser)    Julien
docs/database/     schéma BDD et revues           Thomas, Lina, Belaid
docs/ia/           KPI et données de l'IA         Thomas, Lina, Belaid
data/fixtures/     données fictives (SQL + Mongo) Thomas, Lina, Belaid
infra/             Docker, serveurs, scripts      Baye, Estelle
.github/           CI/CD, modèle de PR            Baye, Estelle
docker-compose.yml environnement local
```

## Démarrer

```bash
cp .env.example .env
docker compose up -d        # PostgreSQL (pgvector) sur 5432, Redis sur 6379, MongoDB (IA) sur 27017
```

Détails, rôles et déploiement : `infra/README.md`.
Remplir les bases avec des données fictives : `python data/fixtures/generate.py --load` (voir `data/fixtures/README.md`).

## Règles Git (DOC-013)

- Jamais de push direct sur `main` ni `develop` : une branche, une pull request, CI verte, une relecture.
- Branches `feature/<ticket>-<sujet>`, `fix/…`, `docs/…`.
- Commits `type(scope): message`, ex. `feat(events): ajouter le filtre date`.
