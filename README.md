# EpiVerse — campus social web, mobile et 2.5D

**EpiVerse** est un projet de réseau social pour la vie étudiante. Il réunit profils, événements, entraide et ressources dans une même application, avec un **campus virtuel 2.5D** inspiré des usages sociaux d'Habbo et VRChat : avatar personnalisable, déplacements et rencontres. Le MVP privilégie des parcours simples et fiables ; les 36 modules envisagés constituent la vision à long terme, pas la livraison immédiate.

## En un coup d'œil

| Sujet | Réponse |
|---|---|
| Public cible | Étudiants, associations et communauté campus |
| Support visé | Web et mobile (Expo / React Native Web) |
| Backend | NestJS, Prisma, PostgreSQL |
| Données de soutien | Redis, MongoDB et données fictives |
| Monde virtuel | POC Phaser en développement sur une branche séparée |
| Dépôt officiel de travail | **GitHub** ; réunions et échanges sur **Teams** |
| Pilotage et suivi pédagogique | [**Ouvrir le tableau de bord**](docs/pilotage/README.md) |
| Travail en cours | [Issues](https://github.com/epiverse-epitech/epiverse/issues) · [Pull requests](https://github.com/epiverse-epitech/epiverse/pulls) · [Actions](https://github.com/epiverse-epitech/epiverse/actions) |

## Ce qui fonctionne et ce qui manque

- **Intégré dans `develop`** : socle API NestJS/Prisma, configuration Docker, tests backend et CI GitHub Actions.
- **À intégrer** : inscription en [PR #45](https://github.com/epiverse-epitech/epiverse/pull/45), autres développements backend restés sur branches.
- **À réaliser** : application Expo web/mobile dans `apps/app/` (seul le README est intégré).
- **Prototype séparé** : [campus 2.5D Phaser](https://github.com/epiverse-epitech/epiverse/tree/feature/EPI-459-avatar-poc/packages/campus) ; ce POC n'est pas encore un monde multijoueur livré.

Le futur parcours MVP : **ouvrir l'app → créer un compte → compléter son profil → consulter un événement → s'inscrire**. Le POC 2.5D doit permettre de se déplacer avec un avatar sur une carte, puis d'accéder aux fonctionnalités du campus.

## Démarrer localement

**Pré-requis :** Docker / Docker Compose et Node.js 24.

```bash
git clone https://github.com/epiverse-epitech/epiverse.git
cd epiverse
git checkout develop
cp .env.example .env
docker compose up -d
cd apps/api
npm ci
npm run start:dev
```

La documentation d'infrastructure décrit les variables, les ports et l'exécution complète : [infra/README.md](infra/README.md).

**Important :** le frontend Expo n'est pas encore présent sur `develop` : ne pas prétendre que `npm run` dans `apps/app` lancera déjà un produit intégré.

## Équipe

- **Estelle** — cheffe de projet, sécurité, validation et suivi.
- **Eckson** — backend ; **Belaid** (Data/IA) en renfort temporaire.
- **Philimon** — frontend ; **Lina** (Data/IA) en renfort temporaire.
- **Thomas** — **Lead Data & IA**, renfort temporaire du campus 2.5D avec **Julien**.
- **Soumia** — UX/UI design.
- **Ousmane** — DevOps, CI/CD, participation aux revues de PR.

Répartition détaillée : [docs/pilotage/equipe.md](docs/pilotage/equipe.md).

## Comment contribuer

1. Choisir une **issue** prête et affectée.
2. Créer une branche `feature/numero-sujet` depuis `develop`.
3. Écrire le code et les tests ; ouvrir une **PR** vers `develop`.
4. Obtenir une revue indépendante et les résultats CI nécessaires.
5. Ajouter à l'issue : lien PR, heures prévues, heures faites, reste à faire, risques et preuve.
6. Terminer selon la [Definition of Done](docs/pilotage/DoD.md).

Consulter aussi [CONTRIBUTING.md](CONTRIBUTING.md) et [SECURITY.md](SECURITY.md).

## Suivis EPITECH

- **FU1 :** 09/10/2026 — [compte rendu reconstitué](docs/pilotage/FU1-2026-10-09.md)
- **FU2 :** 13/11/2026 — [dossier de préparation](docs/pilotage/FU2-2026-11-13.md)
- **FU3 :** 18/12/2026
- **Soutenance :** 05/02/2027

Les états et résultats déclarés sont distingués des objectifs prévus. Les preuves viennent de GitHub, des tests, des maquettes et des démonstrations vérifiées.
