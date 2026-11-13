# CRAv / Milestones — FU1 et FU2

**Projet :** EpiVerse · T-ESP-800 · **Création du document :** 2026-11-13 · **Statut :** scénario reconstitué, dates réelles et participants à confirmer.

## CRAv FU1 — compte rendu reconstitué (PAS un procès-verbal de réunion)
**État documenté :** cadrage, identité, PBS, WBS, OBS/RACI, exigences, DoD, architecture, risques et stratégie ; maquettes et rapport UX/UI. **Ne pas assimiler documents à du logiciel testé.**

**Réalisations documentaires :** DOC-001, DOC-002, DOC-004, DOC-005, DOC-006, DOC-007, DOC-008, DOC-010, DOC-011, DOC-012, DOC-013, DOC-014, DOC-015, DOC-016, DOC-017, rapport UI/UX.

**KPI :** valeur réelle à collecter depuis les PR / issues. Exemple **SIMULÉ** pour montrer la présentation : 30 % au point A, 60 % au point B ; ce n'est pas un avancement officiel.

**Jalons :** FU1 — conception et baseline ; FU2 — outillage et preuves. Dates de tenue à confirmer.

**Prévu / réel :** processus qualité et technique documentés ; l'application effective des contrôles ne peut être inférée de ces seuls documents.

**Contraintes et risques :** R-01 scope MVP trop vaste ; R-03 preuve code ; R-09 CI/staging ; R-14 RGPD. Voir registre.

**Objectifs SMART proposés (NON récupérés du PV FU1) :** cadrage/PBS-WBS-exigences (partiel à confirmer), gouvernance-planning-risques (partiel à confirmer), UX/UI/charte (partiel à confirmer), code-tests-CI (non démontré par les seules pièces du pack). Aucune clôture académique avant rapprochement avec les SMART réellement fixés.

## CRAv FU2 — trame de suivi (PAS une réunion certifiée)
**État :** dossier documentaire initial et nouvelles pièces de pilotage. Vérifier l'exécution réelle dans les issues, PR et workflows du dépôt.

**Tâches réalisées :** seule la présence de documents est avérée ; les issues GitHub ne doivent être annoncées Done qu'après vérification de leur DoD.

**Reste à faire :** tableau `suivi-issues.csv` (estimations de travail fictives à réviser) ; priorités intégration API, web, tests, démonstration et traçabilité.

**KPI à suivre avec >=2 relevés réels :** taux d'issues closes avec preuve = issues closes et vérifiées / issues prévues dans le périmètre choisi ; utiliser snapshots horodatés, dénominateur stable et URL source.

**Écarts :** EC-01 suivi des FU en milestones ; EC-02 documents non reliés aux issues ; EC-03 SMART non retrouvés ; EC-04 CI documentée ≠ CI exécutée. Pour chaque correction, créer un vrai commit, noter son SHA et le lien vers la PR.

**Risques :** réviser P/I, matérialisation et plan de réduction à chaque revue ; ne pas affirmer qu'un risque s'est produit sans événement daté.

**Décisions :** DEC-001 gouvernance produit/opérations distinctes ; DEC-002 stack cible ; DEC-003 scope MVP réduit ; DEC-004/005 propositions du 13 novembre à valider.

## Milestones / livrables / issues locales
| Milestone proposé | IDs du pack | Gate de preuve |
|---|---|---|
| FU1 | EPI-001 à EPI-015 | documents vérifiables et acceptation formelle |
| FU2 | EPI-016 à EPI-020 et EPI-032 à EPI-034 | tickets, PR, tests, KPI et CRAv |
| MVP-S9 | EPI-021 à EPI-028 | application démontrable, tests, sécurité |
| PILOTE-S10 | EPI-029 et EPI-031 | protocole pilote, retours, RGPD |
| EXT-S10 | EPI-030 | démo campus optionnel, sans blocage MVP |

**Attention :** ces identifiants EPI-xxx ne correspondent pas aux numéros GitHub ; utiliser le rapprochement manuel avec les tickets déjà ouverts.

## Code review et CI
- Code review prouvée seulement via approbation d'une personne différente de l'auteur sur une PR ;
- La CI existante du projet reste la référence Node/NestJS/Expo ;
- Le workflow `followup-kpi.yml` est un test auxiliaire du calculateur de KPI, pas une preuve de qualité globale de l'app ;
- La PR présente constitue une **demande de revue**, pas une revue approuvée ;
- Dépôt « Tech » académique à identifier : un push sur ce dépôt d'équipe n'atteste pas une livraison sur une autre plateforme.

## Conditions de finalisation
- [ ] PV FU1 et FU2 réels attachés ; dates et présents
- [ ] objectifs SMART originaux repris sans disparition
- [ ] 2 snapshots KPI réels avec sources
- [ ] liens issues fermées / PR revues / commits correctifs
- [ ] CI du code métier validée sur PR
- [ ] dépôt Tech explicitement demandé confirmé et mis à jour
