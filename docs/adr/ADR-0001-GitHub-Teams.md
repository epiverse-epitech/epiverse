# ADR-0001 — GitHub comme source de travail, Teams pour les échanges

**Date :** 13/11/2026. **Statut :** décision actée par Estelle. **Décideuse :** Estelle.

## Problème
Jira a été abandonné, Notion n'est plus fiable et les anciennes issues GitHub n'indiquaient ni responsables, ni heures, ni jalons.

## Décision
- **GitHub Issues** pour exigences, tâches, responsables, heures, risques et preuves.
- **GitHub PR** pour relectures indépendantes, code et décisions de fusion.
- **GitHub Actions** pour CI, tests et contrôles.
- **GitHub Code / docs** pour CRAv, SMART, KPI, risques, décisions et écarts.
- **Microsoft Teams** pour réunions ; décisions finales reportées sur GitHub.

## Conséquences
Plus de double saisie Jira/Notion. Les **54 exigences historiques** restent ouvertes et sont reliées à **85 tâches** de réalisation, suivies en heures sans les compter deux fois. **19 doublons** sont archivés avec un renvoi explicite.

## Contrôle
[Issues](https://github.com/epiverse-epitech/epiverse/issues), [correspondance](../pilotage/migration-issues.md), [mode d'emploi](../pilotage/mode-emploi.md).
