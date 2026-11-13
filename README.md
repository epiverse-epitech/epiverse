# EpiVerse — réseau social étudiant et campus virtuel 2.5D

**EpiVerse** est une plateforme sociale pour étudiants de plusieurs campus : profils, projets, événements, associations, ressources, mentorat et recrutement. Elle inclut un **monde virtuel isométrique 2.5D** inspiré des usages d'Habbo et VRChat, avec avatars, espaces personnalisables et échanges texte, audio/vidéo. Les mentors et recruteurs extérieurs ont des accès limités et vérifiés.

**Objectif académique : une préproduction démontrable et testée le 5 février 2027.** Ce n'est pas une version déjà terminée.

## Résumé du projet — présentation pédagogique (50 mots)

EpiVerse est un réseau social étudiant avec campus virtuel 2.5D, inspiré d'Habbo et de VRChat. Les utilisateurs disposent de profils et avatars, découvrent événements, associations, ressources et opportunités de carrière, rencontrent mentors et étudiants, puis interagissent dans des espaces virtuels. Web et mobile sont visés ; le multijoueur reste à développer.

## Expérience attendue et critères de démonstration

Le **cœur du produit** associe une plateforme de services étudiants et un **monde social interactif**, plutôt qu'une simple carte de navigation. La version cible doit permettre :

1. **Identité** : créer un compte, gérer son profil et les droits d'accès, choisir/personnaliser un avatar ;
2. **Vie étudiante** : découvrir un événement, s'y inscrire, rejoindre une association, consulter des ressources et contacter un mentor ;
3. **Carrière** : consulter des offres, candidater et échanger avec les acteurs autorisés ;
4. **Campus social 2.5D** : se déplacer, voir d'autres avatars en temps réel, rejoindre des espaces et utiliser des interactions textuelles ; audio/vidéo sous conditions de sécurité, de performance et de capacité.

**Ce qui est acquis** : fondations API, base de données, Docker, tests CI backend et premier POC Phaser en branche. **Ce qui reste à prouver** : application intégrée, multijoueur, performances du campus, accessibilité, déploiement, dépôt Tech Epitech. Des maquettes n'équivalent pas à une fonction implémentée.

**Attention technique — 13/11/2026 :** la [PR #194](https://github.com/epiverse-epitech/epiverse/pull/194) propose un front React/Vite, tandis que [#113](https://github.com/epiverse-epitech/epiverse/issues/113) prévoit Expo/React Native Web. La décision finale de compatibilité web/mobile doit être formalisée, non supposée.

**Dossier pédagogique direct :** [contrôle des dix exigences FU2](docs/pilotage/REMISE-PEDAGOGUE-FU2.md) · [protocole KPI produit](docs/pilotage/PROTOCOLE-MESURES.md) · [Definition of Done](docs/pilotage/DoD.md) · [code review indépendante #39](https://github.com/epiverse-epitech/epiverse/pull/39) · [CI backend](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403).

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
