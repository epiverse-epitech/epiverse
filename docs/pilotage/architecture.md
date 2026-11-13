# Architecture technique — conception et code réellement présent

## Cible
```text
Navigateurs desktop / mobile
        |
Application Expo + React Native Web
        |                         \
API REST NestJS                   Campus 2.5D Phaser
  |   |   \                         |
  |   |    \------ API temps réel / sessions et salons
  |   |
Prisma/PostgreSQL                  WebRTC voix/vidéo + TURN
Redis, MongoDB                     Permissions et modération
        \___________________________/
                   |
         Docker / staging / CI GitHub
```

## Réalité vérifiée dans le dépôt
| Élément | État | Suite |
|---|---|---|
| NestJS, Prisma, migrations PostgreSQL | Socle intégré dans `develop` | Auth, métier, RBAC et contrats |
| Redis/Mongo, données fictives | Initialisation et scripts présents | Droits, conservation, sauvegarde |
| Expo web/mobile | `apps/app/README.md` seulement sur `develop` | Créer et tester application |
| Campus Phaser | Branche `feature/EPI-459-avatar-poc` | Tester, PR et intégrer |
| Salons temps réel / RTC | Pas démontrés comme livrés | #148, #169–#172 |
| CI API | Tests unitaires, E2E, build réussis sur Actions | Étendre à app et intégration |
| Staging | Configuration prévue, déploiement non prouvé | #119, #185 |
| Dépôt Tech EPITECH | Workflow miroir présent mais observé skipped | #103 |

## Contrats et décisions
- Première cible d'usage : **navigateur ordinateur et mobile**. Les stores natifs ne sont pas obligatoires.
- API : réponses d'erreur stables et codes HTTP corrects, comptes/établissements/rôles et permissions testés.
- Frontend : gestion des sessions, chargement, erreurs, accessibilité et compatibilité.
- Monde : moteur Phaser découplé, présence avec plusieurs utilisateurs, chambres et salons, accès privés.
- Médias : signalisation/connexion RTC, coût réseau, permissions caméra/micro, coupure et mécanisme de repli.
- Data/IA : événements minimisés, durée, consentements, données synthétiques avant données réelles.
- Infra : secrets jamais dans Git public, sauvegardes restaurées en test, branche et CI, staging isolé.

## Capacité et sécurité
**Objectif de test : 50 utilisateurs simultanés au total.** Mesurer latence API, FPS p5, bande passante RTC, coût, erreurs, mémoire et comportements en cas de perte réseau. Pas de promesse de tenue de charge sans campagne mesurée.

## Risques de choix
WebRTC nécessite HTTPS et souvent TURN ; la vidéo de proximité multiplie les flux et les coûts. Le monde 2.5D doit garder une interface alternative pour les services essentiels. La mise en public du dépôt impose des contrôles actifs sur l'historique et les secrets.

**Référence :** code sur `develop`, branches/PR, plan historique DOC-014 et compte rendu consolidé du 04/11/2026.
