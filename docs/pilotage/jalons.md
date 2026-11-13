# Calendrier EpiVerse et jalons

## Dates académiques communiquées
| Date | Activité | État |
|---|---|---|
| 11/09/2026 | Kick-off ESP | Passé |
| 09/10/2026 | FU1 | Passé : remarques à corriger |
| **13/11/2026, 14 h–16 h** | **FU2** | Revue à présenter, CRAv définitif après la séance |
| **18/12/2026** | **FU3** | Prévu |
| **05/02/2027, 14 h–17 h** | **Soutenance ESP** | Objectif de préproduction |

Les dates/interventions T-LAW devront rester conformes à la convocation officielle ; les anciennes notes ne concordent pas toutes sur cette partie.

## Cibles internes à valider (non garanties)
| Échéance | Résultat attendu | Critère objectif |
|---|---|---|
| 13/11 FU2 | Backlog réconcilié, CRAv FU1, KPI 2 mesures, risques, décisions, écarts, revue et CI | Liens GitHub consultables ; dépôt Tech à vérifier |
| 27/11 | Premier parcours intégré et POC campus/média testables isolément | Installation à froid, API + frontend et démonstration |
| 18/12 FU3 | 1re intégration des parcours de campus, mentorat/ressources et carrière ; monde social encore en validation | Scénarios E2E et risques requalifiés |
| 08/01/2027 | Gel fonctionnel cible | Aucun P0 non maîtrisé sur les chemins de démonstration |
| 22/01/2027 | Version candidate en préproduction | Déploiement, sécurité, permissions et tests critiques passés |
| 29/01/2027 | Répétition et plan B | Démo réelle, vidéo secours, données fictives, lien dépôt Tech |
| 05/02/2027 | Soutenance | Preuves versionnées et produit présenté |

## Dépendances
**Socle/auth/permissions → interface → parcours métier → présence campus/médias → staging → tests inter-utilisateurs → soutenance**.

Le monde et les médias peuvent être prototypés en parallèle ; la sécurité et l'identité restent des dépendances bloquantes pour les vrais échanges.

## Pilotage de capacité
- Le reste à faire est documenté dans [la consolidation](reste-a-faire.md) et dans les issues individuelles.
- Une cible inscrite au calendrier n'est jamais considérée atteinte sans démonstration/test.
- Les estimations restent provisoires tant que les membres n'ont pas communiqué leurs disponibilités et le temps déjà passé.
- Si le jalon devient irréaliste, **réviser explicitement le périmètre avec le pédagogue**, pas modifier silencieusement le statut des tâches.

## Audit des milestones **natifs** — 13/11/2026

L'index de remise [détaille les 6 milestones et les 163 issues](REMISE-PEDAGOGUE-FU2.md). **FU2 : 12 ouvertes, 0 fermée** ; **S9/FU3 : 108 ouvertes**, **FU3 : 1 ouverte**, **S10 : 11 ouvertes**, **Futur : 11 ouvertes**, **Archives : 1 ouverte, 19 doublons fermés**. Les anciennes PR fusionnées doivent être montrées séparément comme preuves de code intégré ; ne pas inventer d'issues « Done ».

Le suivi du **FU1 09/10/2026** figure dans le calendrier et le CRAv, mais **aucun milestone natif FU1** n'a été relevé : le recréer de façon historique avec son vrai périmètre après validation du relevé, sans requalifier les doublons archivés en réalisations. Suivi dans [#105](https://github.com/epiverse-epitech/epiverse/issues/105).
