# EpiVerse

Monorepo du projet EpiVerse (T-ESP-800).

```
apps/api/          API NestJS + Prisma            Eckson
apps/app/          App Expo (mobile et web)       Philimon, Julien
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
Générer des données fictives sans modifier les bases : `python3 data/fixtures/generate.py`.
Pour réinitialiser explicitement des bases **locales jetables uniquement** : `python3 data/fixtures/generate.py --load --confirm-local-reset` (voir `data/fixtures/README.md`). Cette commande détruit les données existantes des tables/collections ciblées.

## Règles Git (DOC-013)

- Jamais de push direct sur `main` ni `develop` : une branche, une pull request, CI verte, une relecture.
- Branches `feature/<ticket>-<sujet>`, `fix/…`, `docs/…`.
- Commits `type(scope): message`, ex. `feat(events): ajouter le filtre date`.


## Réalisation professionnelle et état du produit

Voir [le référentiel transversal](docs/programme/README.md) : audit, périmètre des 36 domaines, critères de livraison, outils, risques et preuves.
Le frontend et les parcours métier ne sont pas encore livrés dans cette baseline.
Valider les registres : `python3 scripts/check_programme.py`.
