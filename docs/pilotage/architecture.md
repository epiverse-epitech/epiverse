# Architecture technique et état réel — 13/11/2026

## Architecture cible
```text
Étudiant (web / iOS / Android)
          |
     Expo / React Native Web       (à développer dans apps/app)
          |
      API NestJS                   (socle présent dans develop)
          |
    Prisma / PostgreSQL            (schéma et migrations présents)
       |           |
     Redis      MongoDB            (cache / interactions / monde)
          |
   Services de déploiement Docker (scripts et CI présents)
          |
  Module campus Phaser 2.5D        (branche POC, non intégré)
```

## Distinction entre prévu et disponible
| Composant | Constat GitHub | Prochaine action |
|---|---|---|
| API NestJS | Présente dans develop, `apps/api` | Finaliser auth et métier |
| Prisma/PostgreSQL | Présent, migrations versionnées | Revoir droits et évolution schéma |
| Redis/MongoDB | Docker + initialisation/fixtures | Confirmer conservation et rôles |
| App Expo | `apps/app/README.md` seulement | Générer et tester web/mobile |
| Campus Phaser | `feature/EPI-459-avatar-poc` | Tester, PR, intégrer au web |
| CI GitHub | Lint, tests unitaires et E2E backend réussis | Activer tests frontend quand présent |
| Staging | Configuration prévue | Prouver déploiement et accès |
| Dépôt Tech | Miroir prévu, exécution ignorée observée | Vérifier URL et synchronisation |

## Contrats entre équipes
- API : routes versionnées sous `/api`, validation des champs, réponses d'erreur stables et tests des permissions.
- Front : utilise `EXPO_PUBLIC_API_URL`, gère loading, erreurs, connexion et sortie.
- Data : propose l'instrumentation **avant** d'utiliser des données réelles ; événements versionnés, minimisation, consentement et suppression.
- Campus : moteur isolé et montable dans l'application, fonctionne au tactile et dispose d'une alternative accessible.
- Infra : secrets hors Git, environnements dev/staging séparés, sauvegardes testées.

## Choix explicitement reportés
- Aucun multijoueur ni présence temps réel n'est réputé livré.
- Aucune promesse de stockage illimité, crypto ou intégration XR Roblox.
- Les montées en charge devront être prouvées par mesures, non estimées par intuition.

Source de référence technique : [DOC-014 historique] et [infra/README](../../infra/README.md), **le code et les PR prévalent sur les plans anciens**.
