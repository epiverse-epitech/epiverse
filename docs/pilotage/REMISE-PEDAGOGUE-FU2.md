# EpiVerse — remise pédagogique FU2 : index de contrôle vérifié

**Snapshot : 13 novembre 2026 — T-ESP-800 / suivi S9.** Ce document est un index de remise, pas le procès-verbal de la séance FU2. Il distingue **preuve vérifiée**, **travail préparé**, **action ouverte** et **hypothèse**. Référentiel de code : `epiverse-epitech/epiverse`; dossier préparé dans [PR #147](https://github.com/epiverse-epitech/epiverse/pull/147) vers `develop` et publié séparément comme documentation sur `main`.

## 1. Les dix demandes du pédagogue — preuve et verdict

| # | Exigence | Preuve directement consultable | Verdict et action bloquante |
|---|---|---|---|
| 1 | **Un CRAv par revue tenue**, six rubriques (état, tâches réalisées, KPI, jalons, prévu/réel, contraintes/risques) | [FU1 du 09/10 reconstitué](FU1-2026-10-09.md), [trame FU2](FU2-2026-11-13.md), [modèle](CRAv-modele.md), issue [#105](https://github.com/epiverse-epitech/epiverse/issues/105) | **Partiel** : FU1 reconstitution à confirmer ; FU2 est une préparation, à rédiger seulement après revue réellement tenue |
| 2 | **Reste à faire en heures**, estimation révisée par tâche | [85 tâches, responsable et heures](reste-a-faire.md), [issues de réalisation](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Atype%3Atache), issue [#107](https://github.com/epiverse-epitech/epiverse/issues/107) | **Structure disponible**, 1 212 h initiales, 943,5 h révisées **hypothétiques**, 34 h rétroestimées non pointées, 909,5 h ETC indicatives. Heures réalisées à obtenir auprès des auteurs |
| 3 | **Tendance d'au moins un KPI** sur deux mesures datées | [KPI](KPI.md) ; PR fusionnées : 30/10 = 2, 04/11 = 14, 05/11 = 15 ; [Actions 05/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42124966749) et [06/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403) | **Preuve disponible** de tendance de livraison et de deux runs API ; **pas** de mesure d'avancement fonctionnel, FPS ou d'accessibilité |
| 4 | **Clôture sans disparition de tous les SMART du FU1** (atteint/partiel/abandonné et justification) | [SMART-FU1](SMART-FU1.md), [retour pédagogique](retour-pedagogique-FU1.md), issue [#106](https://github.com/epiverse-epitech/epiverse/issues/106) | **Partiel** : les quatre SMART documentaires proposés ne sont pas attestés comme la liste réellement prononcée au FU1. Ne pas les déclarer définitivement clos |
| 5 | **Registre de risques vivant** : nouveaux, mitigés, survenus | [Registre](risques.md), [issue #109](https://github.com/epiverse-epitech/epiverse/issues/109) | **Documenté** ; R01 et R10 survenus d'après retour FU1, R07/R17 atténués par PR, risques nouveaux R09/R14/R15/R16 ; revalidation et preuves de clôture nécessaires |
| 6 | **Delta/Log d'écarts**, chaque correction avec **vrai SHA** de documentation source | [Écarts](ecarts.md), [Delta Log BUILD](../../reporting/Delta-Log.md), issue [#109](https://github.com/epiverse-epitech/epiverse/issues/109) | **Documenté** avec de vrais liens de commits ; un commit qui décrit le blocage dépôt Tech ne prouve **pas** sa résolution : [#103](https://github.com/epiverse-epitech/epiverse/issues/103) ouvert |
| 7 | **Journal de décisions** daté, motifs et impacts | [Journal](decisions.md), [ADR](../adr/) | **Documenté** ; distinguer décisions de périmètre et éléments encore soumis à arbitrage |
| 8 | **Code Review indépendante** | [PR #39](https://github.com/epiverse-epitech/epiverse/pull/39) : approbation par **bayeousmane1** le 05/11 ; [PR #147](https://github.com/epiverse-epitech/epiverse/pull/147), issue [#110](https://github.com/epiverse-epitech/epiverse/issues/110) | **Exemple réel vérifié (#39)** ; #147 requiert sa propre revue, ne pas simuler une approbation |
| 9 | **CI déclenchée à chaque PR** avec tests unitaires | [CI existante](https://github.com/epiverse-epitech/epiverse/blob/develop/.github/workflows/ci.yml), [run 05/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42124966749), [run 06/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403), issue [#111](https://github.com/epiverse-epitech/epiverse/issues/111) | **Tests backend unitaires + E2E observés** ; frontend ignoré sur ces runs. Ne pas présenter la CI d'exemple du pack #195 comme preuve de l'app |
| 10 | **Code poussé sur le dépôt Tech EPITECH** | [issue #103](https://github.com/epiverse-epitech/epiverse/issues/103), [miroir du 06/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615383) | **NON PROUVÉ** : run miroir `skipped`; pas de lien au commit équivalent dans le dépôt scolaire. L'identifiant officiel a été confirmé par la direction du projet : **`T-ESP-901-LYN-9-1-T-ESP-901-15`** ; la synchronisation est déléguée à un autre membre, preuve de push attendue |

## 2. Milestones GitHub : couverture réelle au snapshot

| Milestone natif GitHub | Issues ouvertes | Issues fermées | Lecture |
|---|---:|---:|---|
| **FU2 — 13 novembre 2026** | **12** | **0** | [#103–#112](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+milestone%3A%22FU2+%E2%80%94+13+novembre+2026%22) ainsi que [#180](https://github.com/epiverse-epitech/epiverse/issues/180) et [#186](https://github.com/epiverse-epitech/epiverse/issues/186). Aucun ticket marqué terminé sans DoD |
| **S9 — Première intégration / FU3** | **108** | **0** | Réalisations futures / en cours, non validation de fonctionnalités |
| **FU3 — 18 décembre 2026** | **1** | **0** | Prochain suivi |
| **S10 — Soutenance 5 février 2027** | **11** | **0** | Cible, non livrée |
| **Vision future — après février 2027** | **11** | **0** | Hors engagement court terme |
| **Archives historiques** | **1** | **19** | Les 19 issues **fermées sont des doublons archivés**, **pas 19 fonctionnalités Done** |

**FU1 (09/10/2026) :** le CRAv est disponible comme historique documentaire, mais aucun milestone natif FU1 n'a été identifié dans ce snapshot. Une création/association rétrospective du milestone dans GitHub nécessiterait une action GitHub dédiée, sans attribuer rétroactivement de faux statuts Done. Cette tâche de régularisation est rattachée au suivi [#105](https://github.com/epiverse-epitech/epiverse/issues/105).

## 3. Travail réellement intégré vs issues encore ouvertes

Les **15 PR fusionnées** constatées sur l'historique de code jusqu'au 05/11 sont [#1](https://github.com/epiverse-epitech/epiverse/pull/1), [#2](https://github.com/epiverse-epitech/epiverse/pull/2), [#3](https://github.com/epiverse-epitech/epiverse/pull/3), [#4](https://github.com/epiverse-epitech/epiverse/pull/4), [#5](https://github.com/epiverse-epitech/epiverse/pull/5), [#7](https://github.com/epiverse-epitech/epiverse/pull/7), [#8](https://github.com/epiverse-epitech/epiverse/pull/8), [#9](https://github.com/epiverse-epitech/epiverse/pull/9), [#10](https://github.com/epiverse-epitech/epiverse/pull/10), [#20](https://github.com/epiverse-epitech/epiverse/pull/20), [#24](https://github.com/epiverse-epitech/epiverse/pull/24), [#25](https://github.com/epiverse-epitech/epiverse/pull/25), [#27](https://github.com/epiverse-epitech/epiverse/pull/27), [#35](https://github.com/epiverse-epitech/epiverse/pull/35) et [#39](https://github.com/epiverse-epitech/epiverse/pull/39). **#20 visait `main`**, les autres `develop`. Fusion ne signifie pas validation E2E d'un parcours entier.

**Travail proposé ou non fusionné :** inscription [#45](https://github.com/epiverse-epitech/epiverse/pull/45), refonte du pilotage [#147](https://github.com/epiverse-epitech/epiverse/pull/147), frontend **React + Vite** [#194](https://github.com/epiverse-epitech/epiverse/pull/194). **Point d'architecture à trancher** : le référentiel fonctionnel privilégie Expo/React Native Web ([#113](https://github.com/epiverse-epitech/epiverse/issues/113)) tandis que la PR #194 propose React/Vite ; ne pas annoncer ces deux choix comme déjà unifiés.

## 4. Priorités de régularisation dans les vraies issues

| Priorité | Issue réelle | Résultat nécessaire |
|---|---|---|
| P0 | [#103 — dépôt Tech](https://github.com/epiverse-epitech/epiverse/issues/103) | URL officielle, droit d'accès, commit retrouvé sur dépôt scolaire |
| P0 | [#105 — CRAv](https://github.com/epiverse-epitech/epiverse/issues/105) | FU1 validé par sources, FU2 après séance, milestone FU1 historique |
| P0 | [#106 — SMART](https://github.com/epiverse-epitech/epiverse/issues/106) | Liste réellement fixée au FU1, statut motivé pour **chacun** |
| P0 | [#107 — heures](https://github.com/epiverse-epitech/epiverse/issues/107) | Chaque propriétaire renseigne temps réel et ETC mis à jour |
| P0 | [#108 — KPI](https://github.com/epiverse-epitech/epiverse/issues/108) | Graphique/tendance basé sur snapshots datés, puis mesures de réactivité, accessibilité, FPS |
| P0 | [#109 — risques / écarts](https://github.com/epiverse-epitech/epiverse/issues/109) | Mise à jour avec correction documentaire et SHA, validation des atténuations |
| P0 | [#110 — reviews](https://github.com/epiverse-epitech/epiverse/issues/110) | Approbations indépendantes + preuve de protection de branches |
| P0 | [#111 — CI](https://github.com/epiverse-epitech/epiverse/issues/111) | Runs sur PR et tests unitaires backend ; frontend dès intégration |
| P0 | [#113 — app web/mobile](https://github.com/epiverse-epitech/epiverse/issues/113) | Arbitrage Expo / React-Vite, install et tests reproductibles |

## 5. Limites et règles d'acceptation

- Les **SMART de FU1** sont préqualifiés, mais **non certifiés comme originaux** ; les verdicts restent provisoires.
- Les heures « passées » calculées par rétroestimation IA ne sont **pas** du temps pointé. Ne jamais les présenter comme réalisées par les membres.
- Les documents FU2 rédigés avant la séance ne sont pas une réunion tenue ; aucun participant ou avis pédagogique n'est inventé.
- Une PR ouverte prouve un travail soumis à revue, pas un code validé. Une CI `success` peut masquer des jobs `skipped` ; inspecter les jobs pertinents.
- [PR #147](https://github.com/epiverse-epitech/epiverse/pull/147) est le support canonique de la remise documentaire ; **le pack #195 a été fermé sans fusion**.

## Complément explicite aux remarques du pédagogue (13/11)

- **README et résumé :** [README racine](../../README.md) réécrit avec la finalité « réseau social de campus, Habbo/VRChat », l'expérience attendue, l'état prouvé et les limites.
- **KPI de réactivité, accessibilité et performance globale :** [définitions](KPI.md) et [protocole de mesure reproductible](PROTOCOLE-MESURES.md). **Aucune mesure produit réelle n'a été fabriquée** ; seuls les KPI de gestion ont des points historiques vérifiés.
- **60 FPS :** cible contextualisée avec machine, rafraîchissement, scène, avatars, résolution, durée, FPS p5 et frame-time p95. Pas de validation sans relevé.
- **DoD :** [fiche opérationnelle](DoD.md) intégrant estimation initiale, réel déclaré, ETC, EAC, écart, risques et preuve de clôture.
- **Revues tenues :** [chronologie source du planning](CHRONOLOGIE-REVUES-2026.md) et [CRAv](CRAv-modele.md), avec doublon 2D possible.
- **Dépôt Tech exact :** [T-ESP-901-LYN-9-1-T-ESP-901-15 — procédure](DEPOT-TECH-EPITECH.md). **Pas de push attesté** faute d'accès au dépôt scolaire dans la connexion actuelle.

## Pièces additionnelles de remise — commit du 13/11

- **CRAv de chaque ligne de réunion du planning :** [meeting 16/09](CRAv-2026-09-16-meeting.md) · [Sprint 01 24/09](CRAv-2026-09-24-sprint01.md) · [équipe 2D 02/10](CRAv-2026-10-02-equipe-2d.md) · [FU1](FU1-2026-10-09.md) · [Sprint Review 09/10](CRAv-2026-10-09-sprint-review.md) · [FU2](FU2-2026-11-13.md). Sources, incertitudes et absences de PV sont explicites.
- **Graphique de KPI daté :** [tendance PR fusionnées, 3 relevés](KPI-TENDANCE-PR.md) — indicateur gestion, pas % terminé.
- **Matrice complète d'analyse des SMART documentaires et six corrections pédagogiques :** [SMART FU1 — vérification](SMART-FU1-MATRICE-VALIDATION.md). Les SMART officiellement convenus au FU1 ne peuvent pas être garantis sans les notes originales.
- **Dépôt Tech :** le push sur `T-ESP-901-LYN-9-1-T-ESP-901-15` **est confié à une autre personne** par la cheffe de projet. Ce dossier n'en déclare pas l'exécution et ne l'utilise pas comme critère pour fusionner la correction *documentaire*.
