# Journal des écarts — suivi des corrections documentaires

**Règle de validation :** chaque écart décrit la friction, son impact, le document source à corriger et le commit de correction. Le correctif n'est effectif sur `develop` qu'après fusion de la PR documentaire.

| ID | Écart réel | Conséquence | Correction versionnée / preuve | État |
|---|---|---|---|---|
| E01 | DOC-004 et DOC-019 attribuent le pilotage à Soumia, désormais refusé | Mauvaise affectation | [Référentiel équipe, commit 60b741f7](https://github.com/epiverse-epitech/epiverse/commit/60b741f7) | Correctif proposé, fusion à vérifier |
| E02 | Jira/Notion présentés comme outils actifs alors que Jira est abandonné et Notion obsolète | Informations dispersées | [Nouvel index, commit 27ca5e87](https://github.com/epiverse-epitech/epiverse/commit/27ca5e87) | Correctif proposé |
| E03 | DOC-019 ancien : Data/IA ne distingue pas renforts temporaires | Planning d'équipe faux | [Référentiel équipe, commit 60b741f7](https://github.com/epiverse-epitech/epiverse/commit/60b741f7) | Correctif proposé |
| E04 | Retour FU1 : aucun push sur dépôt Tech | Preuves académiques absentes | [Retour FU1 versionné](FU1-2026-10-09.md) ; **commit miroir de correction à produire** | Ouvert |
| E05 | Retour FU1 : README ne décrit pas assez clairement EpiVerse | Évaluateur ne comprend pas le produit | Réécriture README dans PR documentaire actuelle ; commit à enregistrer | En correction |
| E06 | Retour FU1 : 60 FPS sans protocole, manque KPI UX et accessibilité | KPI non évaluables | [Définition KPI, commit abaa4081](https://github.com/epiverse-epitech/epiverse/commit/abaa4081) | Définition corrigée, mesures réelles à produire |
| E07 | DoD sans heures prévues/faites/restantes ni risques | Manque de suivi | Nouvelle [DoD opérationnelle](DoD.md) ; commit à enregistrer | En correction |
| E08 | 73 issues anciennes sans propriétaire, labels ni jalons | Backlog inutilisable | Nouvelles issues et fermeture motivée des anciennes ; liens à ajouter après création | En cours |
| E09 | L'app Expo n'est pas intégrée alors que CI frontend existe | Job frontend ignoré | Issue frontend + PR et tests requis | Ouvert |
| E10 | POC campus sur une branche non intégrée | Démo risque de ne pas être reproductible | Issue campus + PR et script de lancement | Ouvert |

**État :** « correctif proposé » ne signifie ni PR approuvée ni déploiement effectif. Les commits vers la documentation ne corrigent pas une panne logicielle ; un bug exige aussi une correction technique vérifiable.
