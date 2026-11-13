# EpiVerse

**Réseau social étudiant et campus virtuel 2.5D — projet T-ESP-800, Epitech Lyon**

EpiVerse vise à réunir dans une même plateforme la vie étudiante et un **univers social multijoueur inspiré d'Habbo et de VRChat** : profils, avatars personnalisables, espaces virtuels, groupes, événements, associations, ressources, mentorat et opportunités professionnelles. L'expérience cible est accessible depuis un navigateur sur ordinateur et téléphone ; une application mobile dédiée est envisagée, mais sa réalisation et sa compatibilité restent à valider.

> **Statut au 13 novembre 2026 : projet en développement, non livré en production.** Le dépôt `main` ne doit pas être confondu avec `develop` ni avec les prototypes en branches. Les fonctions décrites comme cibles ne sont pas toutes opérationnelles.

## Sommaire

- [Vision et utilisateurs](#vision-et-utilisateurs)
- [Fonctionnalités et périmètre](#fonctionnalités-et-périmètre)
- [Architecture et état d'implémentation](#architecture-et-état-dimplémentation)
- [Structure du dépôt](#structure-du-dépôt)
- [Installation locale](#installation-locale)
- [Tests et qualité](#tests-et-qualité)
- [Gestion du projet et documents pédagogiques](#gestion-du-projet-et-documents-pédagogiques)
- [Contribuer et sécurité](#contribuer-et-sécurité)
- [Équipe et calendrier](#équipe-et-calendrier)

## Vision et utilisateurs

EpiVerse n'est **pas seulement une application de gestion scolaire** : son cœur est un **réseau social de campus**, complété par un monde 2.5D dans lequel les membres peuvent se rencontrer, interagir et participer à des activités. Les publics visés sont les étudiants, associations, anciens élèves, mentors et recruteurs vérifiés, avec des permissions adaptées.

**Parcours cible :** inscription → profil et avatar → découverte d'événements ou de groupes → entrée dans un espace virtuel → échanges avec d'autres utilisateurs. Les parcours carrière, mentorat et ressources sont complémentaires. Les services essentiels doivent rester accessibles sans utiliser le monde virtuel.

## Fonctionnalités et périmètre

| Domaine | Fonctionnalités visées | État attesté |
|---|---|---|
| Identité | Compte, profil, rôles, confidentialité, avatar | Socle API/BDD en développement ; parcours complet non prouvé |
| Réseau social | Groupes, événements, associations, ressources, échanges | Exigences et backlog ; intégration complète non démontrée |
| Campus virtuel | Monde isométrique 2.5D, déplacements, salons, personnalisation | Prototype Phaser en branche ; multijoueur non démontré |
| Communications | Chat, présence, puis voix/vidéo avec modération et consentement | Cible ; intégration RTC non démontrée |
| Carrière et mentorat | Mise en relation, opportunités, candidatures | Cible ; parcours E2E non démontré |
| Accessibilité et performance | Navigation clavier, alternatives au monde, réactivité, mesures FPS | Protocoles définis ; mesures produit non encore établies |

Le projet comporte une vision plus large que la préproduction académique. Les fonctionnalités futures ne sont **pas** des engagements de livraison immédiate : voir [périmètre et priorités](docs/pilotage/produit-et-perimetre.md).

## Architecture et état d'implémentation

```text
Navigateurs desktop / mobile
         |
Interface web/mobile (cible à arbitrer : Expo/React Native Web ou front React/Vite)
         |                          |
         |                    Monde 2.5D Phaser (prototype)
         |                          |
         +------ API NestJS --------+
                    |
             Prisma / PostgreSQL
                    |
             Redis et MongoDB (infrastructure / données spécifiques)
                    |
             Docker, GitHub Actions
```

**Technologies de référence :** TypeScript, NestJS, Prisma, PostgreSQL/pgvector, Redis, MongoDB, Docker et Phaser. Les choix d'interface ne sont **pas définitivement harmonisés** : [ADR web/mobile](docs/adr/ADR-0002-Web-mobile-campus.md), [issue #113](https://github.com/epiverse-epitech/epiverse/issues/113) et [PR #194 React/Vite](https://github.com/epiverse-epitech/epiverse/pull/194).

**Branches :** `main` = référence stable ; `develop` = intégration de développement ; `feature/*` = travaux en cours. L'API et sa CI disposent de preuves sur `develop` ; cela ne signifie pas que les fonctionnalités du monde social sont intégrées sur `main`.

Détails : [architecture et niveau de preuve](docs/pilotage/architecture.md) · [stratégie campus](docs/pilotage/strategie-campus-2.5D.md).

## Structure du dépôt

```text
apps/api/           API NestJS et tests
apps/app/           emplacement prévu pour l'interface web/mobile
docs/database/      schéma et documentation des données
docs/adr/           décisions d'architecture
docs/pilotage/      exigences, CRAv, SMART, KPI, DoD, risques, décisions
reporting/          tendances, écarts et éléments de suivi
infra/              Docker, environnements et déploiement
.github/workflows/  CI/CD et automatisations existantes
docker-compose.yml  services de développement local
```

Les fichiers présents varient selon la branche. Le répertoire `apps/app` ne prouve pas à lui seul l'existence d'une application exécutable.

## Installation locale

**Prérequis :** Git, Docker avec Compose, Node.js **24.9 ou plus** et npm. Les instructions ci-dessous ciblent la **branche `develop`**, qui contient le socle API testé ; elles ne lancent pas un monde virtuel multijoueur complet.

```bash
git clone https://github.com/epiverse-epitech/epiverse.git
cd epiverse
git switch develop
cp .env.example .env
docker compose up -d postgres redis mongo
cd apps/api
cp .env.example .env
npm ci
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

**Vérification :** `curl http://localhost:3000/api/health` doit retourner un statut de santé de l'API. Adapter `apps/api/.env` à la base locale comme indiqué dans [le guide API](apps/api/README.md) ; ne pas publier les fichiers `.env` ni de secrets. Le démarrage des services Docker ne démontre pas le fonctionnement du front.

Guides : [API](apps/api/README.md) · [infrastructure et variables](infra/README.md) · [application (état du squelette)](apps/app/README.md).

## Tests et qualité

La [CI GitHub Actions](.github/workflows/ci.yml) se déclenche sur les PR vers `main` et `develop` et sur les pushes vers ces branches. Elle exécute les tests des applications **lorsqu'elles sont présentes** : les jobs ignorés ne sont pas des validations. Les [exécutions backend du 5 novembre](https://github.com/epiverse-epitech/epiverse/actions/runs/42124966749) et du [6 novembre](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403) constituent des preuves historiques, non une garantie sur tous les changements futurs.

```bash
cd apps/api
npm ci
npm test
npm run test:e2e
npm run build
```

**Critères de qualité :** revue de code indépendante, tests, sécurité/RGPD, accessibilité et mesures contextualisées. L'objectif « 60 FPS » ne vaut que si appareil, résolution, fréquence d'écran, scène, nombre d'avatars et durée sont précisés ; aucune performance campus n'est revendiquée sans campagne de mesure.

Références : [Definition of Done](docs/pilotage/DoD.md) · [KPI et protocole](docs/pilotage/PROTOCOLE-MESURES.md).

## Gestion du projet et documents pédagogiques

**[Accéder à la remise pédagogique FU1/FU2 — dix exigences et preuves](docs/pilotage/REMISE-PEDAGOGUE-FU2.md)**

Le [tableau de bord documentaire](docs/pilotage/README.md) regroupe :

- [CRAv et chronologie](docs/pilotage/CHRONOLOGIE-REVUES-2026.md), [FU1](docs/pilotage/FU1-2026-10-09.md) et [FU2](docs/pilotage/FU2-2026-11-13.md) ;
- [85 tâches et reste à faire estimé](docs/pilotage/reste-a-faire.md) ; heures réellement travaillées **à confirmer par les membres** ;
- [graphique d'évolution des PR fusionnées](docs/pilotage/KPI-TENDANCE-PR.md) et [protocole KPI produit](docs/pilotage/PROTOCOLE-MESURES.md) ;
- [SMART FU1, qualification provisoire](docs/pilotage/SMART-FU1-MATRICE-VALIDATION.md) ;
- [risques](docs/pilotage/risques.md), [écarts et commits](reporting/Delta-Log.md), [journal de décisions](docs/pilotage/decisions.md) ;
- [preuves de revue de code](https://github.com/epiverse-epitech/epiverse/pull/39) et [CI](https://github.com/epiverse-epitech/epiverse/actions).

Les **SMART originaux du FU1**, les heures réellement pointées et certains PV de réunions ne sont pas disponibles dans les pièces examinées ; les documents le signalent. Le push vers le dépôt Tech `T-ESP-901-LYN-9-1-T-ESP-901-15` est pris en charge par un autre membre et ne doit pas être présenté comme réalisé sans preuve.

## Contribuer et sécurité

Ouvrir une issue, travailler sur une branche `feature/*`, `fix/*` ou `docs/*`, ouvrir une PR, faire vérifier les tests et demander une revue par une autre personne avant fusion. **Pas de push direct sur `main` ou `develop`.** Suivre [CONTRIBUTING.md](CONTRIBUTING.md), la [DoD](docs/pilotage/DoD.md) et les ADR.

Ne jamais versionner de clés, mots de passe, données personnelles réelles ou exports utilisateurs. Tester les autorisations, minimiser les données et documenter les risques.

## Équipe et calendrier

**Direction du projet : Estelle.** Coordination technique et responsabilités détaillées dans [l'équipe](docs/pilotage/equipe.md) ; Soumia intervient sur l'UX/UI. Le dépôt GitHub est la source de versionnement et de traçabilité, Teams sert aux échanges.

**Jalons documentés :** FU1 09/10/2026 ; FU2 13/11/2026 ; FU3 18/12/2026 ; soutenance prévue le 05/02/2027. Ces dates ne certifient pas la validation des livrables correspondants.

**Licence :** aucune licence de réutilisation n'est déclarée dans ce README ; ne pas présumer que le code est open source.
