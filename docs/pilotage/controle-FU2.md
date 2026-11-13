# Checklist FU2 — toutes les demandes du pédagogue

**[INDEX COMPLET DE REMISE ET PREUVES EN LIENS DIRECTS](REMISE-PEDAGOGUE-FU2.md)** — source de référence pour les dix points du pédagogue. Les 12 issues du milestone FU2 sont encore ouvertes et les 19 fermetures du milestone Archives sont des doublons, non des réalisations.

**Date de référence : 13/11/2026 (snapshot historique, non statut temps réel).** Ce tableau est un **dossier de préparation**. Les résultats de la séance FU2 ne seront ajoutés qu'après la réunion.

| Demande | Situation documentée | Où montrer la preuve |
|---|---|---|
| 1. CRAv pour chaque revue tenue | FU1 reconstitué sur retour écrit ; FU2 préparé, compte rendu définitif après séance | [FU1](FU1-2026-10-09.md), [FU2](FU2-2026-11-13.md), [modèle](CRAv-modele.md) |
| 2. Reste à faire en heures, tâche par tâche | **85 tâches et 1 212 h estimées**, heures réelles à recueillir ; 54 exigences sont liées sans double compte | [Reste à faire](reste-a-faire.md), [CSV](backlog-initial.csv) |
| 3. Tendance d'un KPI avec ≥2 mesures | Trois dates des PR fusionnées et deux exécutions API réussies ; ces KPI ne sont **pas** le % du MVP | [KPI](KPI.md) |
| 4. Clôture de tous les SMART du FU1 | Objectifs du DOC-019 préqualifiés, mais accord originel FU1 à confirmer | [SMART-FU1](SMART-FU1.md) |
| 5. Risques nouveaux/mitigés/survenus | Registre avec statut, propriétaire, action | [Risques](risques.md) |
| 6. Log d'écarts avec commit modifiant doc source | Écarts et commits de la refonte, actions encore ouvertes | [Écarts](ecarts.md) |
| 7. Journal de décisions | Décisions et arbitrages date/motif/impact | [Décisions](decisions.md) |
| 8. Code review | PR #39 validée par Ousmane ; PR #147 demandée en revue | [PR #39](https://github.com/epiverse-epitech/epiverse/pull/39) |
| 9. Tests unitaires automatiques sur PR | Tests API unitaires/E2E passés les 05/11 et 06/11 ; Expo encore non intégré | [GitHub Actions 06/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403) |
| 10. Code sur le dépôt Tech | **À vérifier** ; miroir du 06/11 `skipped` | [Issue #103](https://github.com/epiverse-epitech/epiverse/issues/103) |

## Retours FU1 corrigés au niveau documentaire
- **README** : nouveau résumé, quatre parcours, campus social et limites du code.
- **KPI** : réactivité, accessibilité, charge et FPS contextualisé par appareil/scène/nombre d'avatars.
- **DoD** : heures initiales, réalisées et restantes, risque et preuve.
- **Pilotage** : exigence ancienne et tâche nouvelle reliées ; aucune suppression de code.
- **BUILD** : ADR, Delta Log et reporting (voir dossier `/reporting` et `/docs/adr`).

## Point critique à expliciter devant le pédagogue
Le chiffrage de cadrage atteint **1 212 h** et la capacité des membres n'a pas encore été validée. C'est un risque réel de délai, pas une preuve d'achèvement. Les 36 modules ne sont pas engagés en février, contrairement aux quatre parcours fonctionnels confirmés.

## Avant clôture du FU2
- Recueillir la liste **réelle** des SMART décidés au FU1.
- Vérifier les commits sur le dépôt Tech demandé.
- Faire approuver la PR de documentation et ré-estimer le travail par pôle.
- Faire acter les nouveaux SMART et consigner les remarques de la réunion.

## Ajouts pour présentation immédiate

- [CRAv complémentaires par réunion de planning](CHRONOLOGIE-REVUES-2026.md) ; les séances sans PV sont identifiées.
- [Graphique réel de tendance KPI](KPI-TENDANCE-PR.md) : 2 → 14 → 15 PR fusionnées.
- [Matrice SMART FU1 avec raisons et preuves](SMART-FU1-MATRICE-VALIDATION.md) ; acceptation finale reste à confirmer.
- [Protocole KPI produit](PROTOCOLE-MESURES.md) : réactivité, accessibilité, performances du campus.
- [Dépôt Tech délégué](DEPOT-TECH-EPITECH.md) : preuve de push non recueillie.
