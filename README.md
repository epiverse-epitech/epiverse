# EpiVerse — réseau social étudiant et campus virtuel 2.5D

**EpiVerse** est une plateforme sociale pour étudiants de plusieurs campus : profils, projets, événements, associations, ressources, mentorat et recrutement. Elle inclut un **monde virtuel isométrique 2.5D** inspiré des usages d'Habbo et VRChat, avec avatars, espaces personnalisables et échanges texte, audio/vidéo. Les mentors et recruteurs extérieurs ont des accès limités et vérifiés.

**Objectif académique : une préproduction démontrable et testée le 5 février 2027.** Ce n'est pas une version déjà terminée.

## Comprendre en 30 secondes

| Question | Réponse |
|---|---|
| Pour qui ? | Étudiants, associations, anciens élèves, mentors et recruteurs autorisés |
| Supports visés ? | Navigateurs desktop et mobile ; application Expo/React Native Web en cours |
| Quatre parcours principaux | Profil/entraide ; événements/vie de campus ; ressources/mentorat ; recrutement |
| Monde virtuel | Campus isométrique 2.5D social, maisons/avatars, salons et proximité |
| Technique | API NestJS + Prisma/PostgreSQL, Redis, MongoDB ; Phaser pour le campus |
| Situation réelle | Socle backend/CI intégré ; frontend Expo non intégré ; POC Phaser en branche |
| Suivi opérationnel | [Guide GitHub](docs/pilotage/README.md) · [Issues](https://github.com/epiverse-epitech/epiverse/issues) · [PR](https://github.com/epiverse-epitech/epiverse/pulls) · [Actions](https://github.com/epiverse-epitech/epiverse/actions) |

## Ce qui est fait, ce qui reste

**Observé dans `develop` :** backend NestJS et Prisma, modèles/migrations, tests API, Docker et workflows CI. [Preuve d'exécution CI API](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403).

**En développement mais pas encore intégré :** inscription [PR #45](https://github.com/epiverse-epitech/epiverse/pull/45), autres branches backend, campus [POC avatar Phaser](https://github.com/epiverse-epitech/epiverse/tree/feature/EPI-459-avatar-poc/packages/campus). La présence de branches ne démontre ni une application complète ni le multijoueur.

**À faire :** interface web/mobile connectée, parcours métier complets, gestion des droits, salons/communications, tests E2E, déploiement en préproduction et dépôt Tech EPITECH.

## Lancer la base de développement

Prérequis : Docker/Compose et Node.js 24.

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

Guide détaillé : [infra/README.md](infra/README.md). Le répertoire `apps/app` n'a encore **pas de squelette Expo intégré**, donc ne pas annoncer un lancement web/mobile complet.

## Organisation

**Estelle** dirige le projet, suit la sécurité, la qualité et les validations. **Eckson** pilote le backend avec **Belaid** en renfort ; **Philimon** pilote le frontend avec **Lina** en renfort. **Thomas est Lead Data & IA** et renforce temporairement **Julien** sur le campus 2.5D. **Soumia** assure exclusivement UX/UI. **Ousmane** assure DevOps et participe aux code reviews. [Rôles détaillés](docs/pilotage/equipe.md).

## Où suivre le travail

- **[Exigences](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Atype%3Aexigence)** : références historiques rouvertes, réception, critères de test.
- **[Tâches](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Atype%3Atache)** : travaux concrets, responsable, estimation initiale, heures réelles et reste estimé.
- **[Documents de pilotage](docs/pilotage/README.md)** : CRAv, SMART, risques, écarts, journal de décisions, KPI, PBS/WBS, jalons, preuves.
- **[Revue de refonte #147](https://github.com/epiverse-epitech/epiverse/pull/147)** : les changements documentaires sont proposés sur branche séparée et nécessitent revue avant fusion.

Le dépôt officiel de pilotage est GitHub ; Teams sert aux échanges et réunions. Jira est abandonné et Notion est obsolète. Règles de contribution : [CONTRIBUTING.md](CONTRIBUTING.md).

## Dates
FU1 : **09/10/2026** · FU2 : **13/11/2026** · FU3 : **18/12/2026** · Soutenance : **05/02/2027**.

**Règle :** une issue fermée ne prouve pas une fonctionnalité livrée ; seules les preuves de code, tests, revue, démo et validation le permettent.
