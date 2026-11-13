# GitHub + Teams — mode d'emploi en 1 minute

**Deux types d'issues**, pour ne pas mélanger les besoins et le travail :

| Type | Question | Que mettre à jour ? |
|---|---|---|
| **Exigence** (`type:exigence`) | Qu'est-ce qui doit marcher ? | Critères, démo, tests, validations, liens vers tâches |
| **Tâche** (`type:tache`) | Qui fait quoi, quand et en combien d'heures ? | Responsable, heures prévues, **réelles**, ETC restant, risque, PR/CI |

En complément :
- **Code** : source + README + documents `docs/pilotage`.
- **Pull requests** : revue indépendante et fusion après tests.
- **Actions** : vérifier la réussite **effective** des unitaires/E2E (et pas seulement `success` global).
- **Teams** : échanges, réunions, puis report des décisions dans le journal GitHub.
- **Projects** : tableau d'équipe à créer/paramétrer dans l'interface ; les labels permettent déjà de filtrer sans Project.

## Statuts des tâches
**À faire → Prête → En cours → Bloquée (si problème) → En revue → À valider → Terminée.**

Ne jamais marquer une tâche « terminée » sans preuve de sa DoD.

## Chiffrage
- **Prévu** : estimation de départ.
- **Réel** : heures effectivement déclarées.
- **ETC / reste** : nouvelle estimation de ce qu'il reste.
- **Prévision totale = réel + ETC** ; écart = prévision totale − prévu.

## Chaque semaine
1. Chaque membre met à jour les heures et blocages.
2. Les leads font le point sur les PR et dépendances.
3. Estelle actualise CRAv, KPI, jalons, SMART, décisions et risques.
4. La tâche peut être fermée si la preuve est là ; l'exigence reste ouverte jusqu'à validation métier.

## Tickets d'origine
**54 exigences ont été rouvertes**, 19 doublons archivés avec leurs remplaçants. **85 tâches** suivent le travail. Aucun commit, branche ni PR supprimés. Voir [correspondance](migration-issues.md).
