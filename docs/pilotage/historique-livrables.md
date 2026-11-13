# EpiVerse — historique réel des livraisons et du travail

**Référence : 13 novembre 2026.** Ce document distingue le code fusionné, le code proposé et le travail restant. Il sert au FU2 et aux CRAv. Source : GitHub, PR et branches du dépôt.

## Chronologie des étapes

| Date | Fait établi | Preuve | Interprétation correcte |
|---|---|---|---|
| 11/09/2026 | Kick-off pédagogique | Calendrier ESP | Démarrage du suivi, pas preuve de code |
| 09/10/2026 | FU1 | [CRAv reconstitué](FU1-2026-10-09.md) | Retour sur README, KPI, DoD, dépôt Tech |
| 30/10/2026 | Socle API NestJS et fixtures fusionnés | PR [#1](https://github.com/epiverse-epitech/epiverse/pull/1), [#2](https://github.com/epiverse-epitech/epiverse/pull/2) | Code dans `develop` |
| 04/11/2026 | DB Prisma, contrats API, hash mot de passe | PR [#3](https://github.com/epiverse-epitech/epiverse/pull/3), [#4](https://github.com/epiverse-epitech/epiverse/pull/4), [#5](https://github.com/epiverse-epitech/epiverse/pull/5) | Fondations backend, pas parcours utilisateur livré |
| 04/11/2026 | Correctifs sécurité, CI, sauvegardes et conservation des données | PR [#7](https://github.com/epiverse-epitech/epiverse/pull/7), [#8](https://github.com/epiverse-epitech/epiverse/pull/8), [#9](https://github.com/epiverse-epitech/epiverse/pull/9), [#10](https://github.com/epiverse-epitech/epiverse/pull/10), [#20](https://github.com/epiverse-epitech/epiverse/pull/20), [#24](https://github.com/epiverse-epitech/epiverse/pull/24), [#25](https://github.com/epiverse-epitech/epiverse/pull/25), [#27](https://github.com/epiverse-epitech/epiverse/pull/27), [#35](https://github.com/epiverse-epitech/epiverse/pull/35) | Correctifs fusionnés, ne signifient pas qu'un audit complet est réussi |
| 05/11/2026 | Limitation du débit API intégrée | [PR #39](https://github.com/epiverse-epitech/epiverse/pull/39) | Fusionnée et revue par Ousmane |
| 05–06/11/2026 | Deux exécutions CI backend réussies | [Actions 05/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42124966749), [06/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403) | Tests unitaires/E2E backend réussis ; frontend Expo encore ignoré |
| 06/11/2026 | Travail Data/IA sur les acceptations CGU | Commits Thomas PRADEAU dans l'historique `develop` | Code existant ; conformité à valider au niveau fonctionnel |
| Novembre 2026 | POC campus avatar/Phaser avec déplacement et personnalisation | [Branche de Julien](https://github.com/epiverse-epitech/epiverse/tree/feature/EPI-459-avatar-poc/packages/campus) | **Code en branche**, pas livré dans `develop` |
| 06/11/2026 | Inscription proposée | [PR #45](https://github.com/epiverse-epitech/epiverse/pull/45) | **Ouverte**, tests/revue/fusion encore requis |
| 13/11/2026 | Refonte du pilotage et du backlog | [PR #147](https://github.com/epiverse-epitech/epiverse/pull/147) | Documentation **en cours de revue**, non encore fusionnée |

## État des pull requests au dernier inventaire

| État | Nombre | À retenir |
|---|---:|---|
| **Fusionnées** | **15** | Code intégré à leur **branche de destination**, vérifier si `develop` ou `main` |
| **Ouvertes** | **12** | En attente de revue, tests, arbitrage ou fusion |
| **Closes sans fusion** | **3** | Historique conservé, aucun code considéré livré à ce titre |
| **Total** | **30** | Historique du dépôt au 13/11/2026 |

PR ouvertes importantes : **#26, #28, #29, #30, #36, #38, #40, #42, #43, #45, #102, #147**. Certaines se ciblent entre elles et pas directement `develop` : contrôler les dépendances avant de fusionner.

## Travail en branche à ne pas effacer

- `feature/EPI-42-student-path` : parcours étudiants/authentification ; **non fusionnée**.
- `feature/EPI-57-login-sessions` : login/sessions ; **non fusionnée**.
- `feature/EPI-459-avatar-poc` : moteur/avatars/carte et banc de test Phaser ; **non fusionnée**.

## Travaux sans preuve d'intégration

Au 13/11, ne sont **pas attestés comme livrés sur `develop`** : une application Expo utilisable, les parcours ressources/mentorat/recrutement de bout en bout, le monde multijoueur, la voix/vidéo de proximité, le staging final et le push du code sur le dépôt Tech académique.

## Heures : convention de preuve

Les **34 h rétrospectivement estimées** dans [le tableau des charges](reste-a-faire.md) sont une **hypothèse de temps pour certains livrables visibles**, et **non des temps enregistrés par leurs auteurs**. L'effort des PR déjà fusionnées n'est pas compté une seconde fois dans les 85 nouvelles tâches. Pour chaque nouvelle revue, les membres doivent confirmer les heures réellement travaillées et ré-estimer le reste.

**Ne jamais présenter** une PR fusionnée comme preuve que l'ensemble de la fonctionnalité a été validé de bout en bout.
