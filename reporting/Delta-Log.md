# Delta Log — écarts réels et retours vers le code/document

**Période couverte :** retour FU1 09/10 → reconstruction 13/11/2026. Ces écarts sont documentés à partir du feedback pédago et des divergences GitHub constatées. Il s'agit de corrections versionnées, pas de sessions de test inventées.

| ID | Prescrit | Réalité / friction | Modification corrective et commit | Nouvel essai / résultat |
|---|---|---|---|---|
| DL-01 | Une responsabilité de direction claire | DOC-004/DOC-019 attribuaient un rôle de pilotage qui n'est plus retenu | [equipe.md — 60b741f7](https://github.com/epiverse-epitech/epiverse/commit/60b741f7) | RACI mise à jour **en PR** ; adoption après revue |
| DL-02 | README compréhensible et fidèle à l'application | Feedback FU1 : présentation insuffisante ; ancien README presque uniquement monorepo | [README — 6c506826](https://github.com/epiverse-epitech/epiverse/commit/6c506826) | Nouveau résumé et état réel ; test par tiers encore requis |
| DL-03 | KPI produit interprétables | Feedback FU1 : cible « 60 FPS » sans contexte ; manque réactivité/accessibilité | [KPI — abaa4081](https://github.com/epiverse-epitech/epiverse/commit/abaa4081) | Mesure décrite ; campagne réelle non encore effectuée |
| DL-04 | DoD avec effort et risques | Feedback FU1 : heures estimées, réelles et risques absents | [DoD — ba7ebc4d](https://github.com/epiverse-epitech/epiverse/commit/ba7ebc4d) | Champs définis ; heures réellement effectuées à recueillir |
| DL-05 | Backlog traçable | Ancienne opération : 73 tickets fermés en bloc, dont de vraies exigences | [migration-issues.md — 13d7da04](https://github.com/epiverse-epitech/epiverse/commit/13d7da04) | **54 exigences rouvertes / 19 doublons archivés** ; liens vérifiables |
| DL-06 | Périmètre fidèle aux décisions du produit | Une version trop courte ne couvrait ni recrutement ni communications médias | [produit-et-perimetre.md — 8d3167d3](https://github.com/epiverse-epitech/epiverse/commit/8d3167d3) | Périmètre corrigé ; capacité de livraison à confirmer |
| DL-07 | Preuve de dépôt Tech visible | Retour FU1 : pas de push observé au dépôt officiel ; miroir GitHub skipped | [FU1 — 2a9c8c18](https://github.com/epiverse-epitech/epiverse/commit/2a9c8c18) + [issue #103](https://github.com/epiverse-epitech/epiverse/issues/103) | **Écart ouvert : pas de SHA académique vérifié** |

## Convention pour toute nouvelle friction
1. **Prescrit** : action ou commande attendue.
2. **Réel** : résultat mesuré, erreur, impact.
3. **Correction** : chemin du document ou script et raison.
4. **Commit** : lien exact de la modification.
5. **Nouvel essai** : date/environnement et résultat réel, même si échec.

**Ne pas inventer d'erreur technique ou de ré-exécution.** Les écarts documentaires ci-dessus sont réels et les limites de validation restent visibles.

Registre complet : [écarts pilotage](../docs/pilotage/ecarts.md).

## Complément d'audit daté du 13/11/2026

| ID | Prescrit | Réel / friction | Document corrigé, vrai commit | Résultat après action |
|---|---|---|---|---|
| DL-08 | Un seul suivi et une seule liste de tâches | La PR #195 introduisait 34 identifiants fictifs concurrents aux issues réelles | [Index unifié — 8004ca9](https://github.com/epiverse-epitech/epiverse/commit/8004ca9616de341c8aa048b8817cbe1e278ad5da) | **PR #195 fermée sans merge**. La #147 reste en revue |
| DL-09 | Le milestone représente les suivis et les tâches réellement achevées | FU1 historique absent des milestones natifs ; 19 anciennes issues fermées étaient des **archives**, non des features validées | [Jalons — 1094fbf](https://github.com/epiverse-epitech/epiverse/commit/1094fbf4fc115eaadd4e499eb37a80140b977b14) | Faits corrigés en documentation ; création du milestone FU1 encore à faire |
| DL-10 | Architecture front cohérente | La PR #194 propose Vite alors que l'issue #113 demande Expo/React Native Web | [CRAv FU2 — f3fff91](https://github.com/epiverse-epitech/epiverse/commit/f3fff91bf26125d8d723dce90d7af93ed517e539) | Divergence signalée ; aucun arbitrage technique ne peut être déduit du seul log |
