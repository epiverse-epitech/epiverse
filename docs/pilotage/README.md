# EpiVerse — tableau de bord et guide de pilotage

**Pour travailler : GitHub (source officielle) et Teams (réunions).** Jira supprimé, Notion obsolète.

## Remise au pédagogue — point d’entrée unique

**[Ouvrir la grille de contrôle des 10 exigences et les preuves FU2](REMISE-PEDAGOGUE-FU2.md)** : état réel des milestones, 12 issues FU2 encore ouvertes, 19 archives (non livrées), PR fusionnées, CRAv, KPI, SMART, écarts avec SHA, CI et dépôt Tech. Le dossier est préparé dans la **PR #147** pour `develop` ; une livraison documentaire séparée vers `main` permet sa consultation sans modifier le code.

## Accès en un clic

| Besoin | Ouvrir |
|---|---|
| Ce que le produit **doit faire** | [54 exigences historiques ouvertes](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Atype%3Aexigence) |
| Qui fait quoi et combien d'heures | [85 tâches](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Atype%3Atache) |
| Consolidation des heures | [1 212 h de cadrage : détail](reste-a-faire.md) |
| Bilan FU2 et retour FU1 | [Checklist FU2](controle-FU2.md) · [FU1](FU1-2026-10-09.md) · [Préparation FU2](FU2-2026-11-13.md) |
| KPI avec deux mesures | [KPI](KPI.md) |
| Objectifs SMART du FU1 | [Clôture à confirmer](SMART-FU1.md) |
| Risques et incidents | [Registre](risques.md) |
| Décisions et changements | [Décisions](decisions.md) · [Écarts](ecarts.md) |
| Équipe, tâches, jalons | [Rôles](equipe.md) · [PBS/WBS](PBS-WBS.md) · [Calendrier](jalons.md) |
| Prouver le code | [PR](https://github.com/epiverse-epitech/epiverse/pulls) · [Actions](https://github.com/epiverse-epitech/epiverse/actions) · [Preuves](preuves.md) |
| Où cliquer dans GitHub | [Guide des onglets](onglets-github.md) · [Mode d'emploi](mode-emploi.md) |

## Historique et utilisation de GitHub
- [**Historique des livraisons : 30 PR, ce qui a réellement été fait**](historique-livrables.md)
- [**Champs natifs GitHub, Project, Priority et Relationships : état et mode d'emploi**](configuration-github.md)

## Produit, conception et qualité
- [Périmètre préproduction 05/02/2027](produit-et-perimetre.md)
- [Architecture réelle](architecture.md) · [54 exigences et tickets](exigences-MVP.md)
- [Campus social 2.5D](strategie-campus-2.5D.md) · [Data/IA](strategie-data-IA.md)
- [Qualité et tests](qualite-et-tests.md) · [Definition of Done](DoD.md)
- [Budget](budget-et-moyens.md) · [Communication](marketing-et-communication.md)
- [Correspondance des 19 DOC historiques](index-documents.md) · [Anciennes issues et nouvelles tâches](migration-issues.md)

## Dossiers exigés par BUILD
- [Décisions techniques ADR](../adr/) — pourquoi nous avons choisi les outils et l'architecture.
- [Reporting](../../reporting/) — Delta Log, KPI, roadmap, rétrospective et preuves.

## Quatre règles pour l'équipe
1. **Une tâche = un responsable, une estimation en heures, un reste réestimé et un risque.** Chaque membre renseigne ses heures réellement effectuées.
2. **Une exigence n'est pas une seconde tâche** : elle décrit les critères d'acceptation et pointe vers la tâche qui porte les heures.
3. **Une PR ouverte n'est pas du code livré** : revue indépendante, CI, intégration et démo avant de déclarer « terminé ».
4. **Un CRAv décrit uniquement une revue réellement tenue** : FU1 reconstitué de manière explicite ; FU2 finalisé après la réunion.

## Attention
Ce référentiel a été préparé dans [la PR #147](https://github.com/epiverse-epitech/epiverse/pull/147) ; sa publication documentaire sur `main` est indépendante de sa future fusion dans `develop`. Les états des tickets restent ceux du snapshot du 13/11.

## Corrections pédagogiques du 13/11/2026

- [Résumé projet et README racine](../../README.md) : réseau social avec monde Habbo/VRChat, état réel de développement
- [Chronologie des réunions et sprints](CHRONOLOGIE-REVUES-2026.md) : 16/09, 24/09, 02/10, 09/10, sans déduire des réunions non prouvées
- [Protocole des KPI produit](PROTOCOLE-MESURES.md) : réactivité, accessibilité, performances, contexte FPS et méthode de mesure
- [DoD avec heures initiales, heures réelles, ETC, risques](DoD.md)
- [Dépôt Tech Epitech officiel](DEPOT-TECH-EPITECH.md) : procédure de synchronisation, preuves encore manquantes
- [Tableau des dix demandes pédagogiques](REMISE-PEDAGOGUE-FU2.md)

## Dossier de remise — liens directs du pédagogue

**[Index des dix points](REMISE-PEDAGOGUE-FU2.md)**

1. **CRAv** : [16/09](CRAv-2026-09-16-meeting.md), [24/09](CRAv-2026-09-24-sprint01.md), [02/10 équipe 2D](CRAv-2026-10-02-equipe-2d.md), [FU1 09/10](FU1-2026-10-09.md), [Sprint Review 09/10](CRAv-2026-10-09-sprint-review.md), [FU2](FU2-2026-11-13.md). Les CRAv sans PV original sont des reconstitutions signalées, pas des réunions certifiées.
2. **Reste chiffré** : [85 tâches, initial / rétro-estimé / ETC](reste-a-faire.md) et [CSV](backlog-IA.csv).
3. **KPI graphique** : [trois mesures PR fusionnées + diagramme](KPI-TENDANCE-PR.md), [mesures produit à réaliser](PROTOCOLE-MESURES.md).
4. **SMART FU1** : [matrice de clôture motivée et limites](SMART-FU1-MATRICE-VALIDATION.md).
5. **Risques** : [registre et mouvements](risques.md).
6. **Écarts** : [Delta Log avec commit](../../reporting/Delta-Log.md) et [registre](ecarts.md).
7. **Décisions** : [journal](decisions.md) et [ADR](../adr/).
8. **Code review** : [PR #39 approuvée](https://github.com/epiverse-epitech/epiverse/pull/39), [PR de remise #147 en revue](https://github.com/epiverse-epitech/epiverse/pull/147).
9. **CI** : [workflows existants](../../.github/workflows/ci.yml), [tests 05/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42124966749), [06/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403).
10. **Dépôt Epitech** : [procédure et preuves attendues](DEPOT-TECH-EPITECH.md) ; synchronisation **confiée à un autre membre**, non réalisée dans cette PR.
