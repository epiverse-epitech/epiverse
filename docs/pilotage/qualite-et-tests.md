# Plan qualité et tests — règles applicables dès maintenant

## Cycle de travail
1. Décrire l'issue avec critères précis, heures prévues, risque, dépendances.
2. Créer une branche depuis `develop` et coder le minimum qui satisfait ces critères.
3. Ajouter les tests adaptés ; exécuter lint, unitaires et E2E si applicables.
4. Ouvrir une PR, lier l'issue, demander une **relecture indépendante**.
5. Vérifier que les jobs requis sont **success**, jamais « skipped » sans justification.
6. Corriger les remarques, fusionner, mettre à jour heures et risques, puis faire une démo si nécessaire.
7. Valider la DoD et fermer l'issue.

## Contrôles minimaux par type
| Travail | Contrôles |
|---|---|
| API | Validation entrée, droits, test unitaire, E2E, build, logs sûrs |
| Front web/mobile | Tests écran, erreurs, clavier, mobile, types, export/build |
| Campus | Démarrage POC, déplacement clavier/tactile, FPS contextualisé, sortie accessible |
| Data/IA | Schéma, données fictives, qualité, provenance, consentement, fallback |
| Infrastructure | Scan secrets, Docker, audit dépendances, tests rollback/backup |
| Documentation | Relecture par responsable, dates, liens, cohérence avec le code |

## Gates
- **Gate entrée** : propriétaire, critères, estimation et dépendances.
- **Gate fusion** : revue par pair, CI, tests et risques acceptés.
- **Gate livraison** : parcours démontrable, sécurité, accessibilité et documentation, approbation Estelle.

## Critères mesurables proposés
- **API** p95 ≤ 500 ms sur endpoints de référence sous charge documentée.
- **App** réponse visible p95 ≤ 200 ms sur action simple définie.
- **Accessibilité** zéro blocage critique des parcours prioritaires.
- **Campus** FPS p5 ≥ 30 sur mobile cible, ≥ 60 sur desktop cible, scène et durée fixées.
- **Disponibilité staging** cible ≥ 99 % sur fenêtre de 7 jours, après installation de la sonde.

Ces valeurs sont **cibles à mesurer**, pas résultats annoncés. Voir [KPI](KPI.md) et [DoD](DoD.md).

## Gérer un bug
Issue avec étapes reproductibles, attendu/réel, environnement, gravité, propriétaire, temps et preuves. PR liée et test de non-régression avant clôture.
