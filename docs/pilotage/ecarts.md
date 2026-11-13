# Log des écarts — difficultés réelles et correctifs

Une friction = ce qui était demandé, la réalité constatée, le document ou script corrigé et le **commit qui corrige**. Un commit documentaire ne prouve pas que le code fonctionne. Les corrections ci-dessous sont **sur la branche de PR #147**, tant que celle-ci n'est pas fusionnée.

| Écart | Observation et impact | Correction de la documentation et commit | Reste à prouver |
|---|---|---|---|
| E01 | Anciennes attributions de management à Soumia | [equipe.md — 60b741f7](https://github.com/epiverse-epitech/epiverse/commit/60b741f7) | Revue/fusion PR #147 |
| E02 | Références Jira/Notion obsolètes | [index du pilotage — 27ca5e87](https://github.com/epiverse-epitech/epiverse/commit/27ca5e87) | Revue/fusion |
| E03 | Thomas/Belaid/Lina mal affectés | [Rôles corrigés — 60b741f7](https://github.com/epiverse-epitech/epiverse/commit/60b741f7) | Actualisation planning |
| E04 | FU1 : pas de push sur dépôt scolaire | [FU1 reconstitué — 2a9c8c18](https://github.com/epiverse-epitech/epiverse/commit/2a9c8c18) | **Correction technique toujours ouverte #103** |
| E05 | README ne présente pas correctement le produit | [README complet — 6c506826](https://github.com/epiverse-epitech/epiverse/commit/6c506826) | Installation testée par tiers |
| E06 | « 60 FPS » et KPI produit sans protocole | [KPI redéfinis — abaa4081](https://github.com/epiverse-epitech/epiverse/commit/abaa4081) | Relevés réels à faire |
| E07 | DoD sans heures réelles, risques et ETC | [DoD corrigée — ba7ebc4d](https://github.com/epiverse-epitech/epiverse/commit/ba7ebc4d) | Heures réellement renseignées |
| E08 | Ancien backlog fermé en bloc, perdant la visibilité de 54 exigences | [migration corrigée — 13d7da04](https://github.com/epiverse-epitech/epiverse/commit/13d7da04) | Revues et réception par exigence |
| E09 | Frontend Expo manquant bien que CI app décrite | [architecture révisée — 983abeee](https://github.com/epiverse-epitech/epiverse/commit/983abeee) | **Code à créer #113** |
| E10 | Campus réduit à une carte solo alors que cible multijoueur/médias | [Campus corrigé — 37897ef7](https://github.com/epiverse-epitech/epiverse/commit/37897ef7) | Multijoueur #148/#149 et RTC à réaliser |
| E11 | Ancien plan limitaient février à événements seulement | [Périmètre corrigé — 8d3167d3](https://github.com/epiverse-epitech/epiverse/commit/8d3167d3) | Validation de capacité et du périmètre |

## Vérification
- Sur chaque ligne : **action demandée → écart réel → correction versionnée → nouvel essai**.
- Les états sont ouverts jusqu'au contrôle du résultat.
- Ne pas remplacer l'absence d'essai réel par une phrase disant « corrigé ».
- Le dossier `/reporting` reprend ce journal dans le format attendu par BUILD.

## Écarts complémentaires détectés pendant l'audit du 13/11

| Écart | Observation et impact | Correction versionnée (documentation source) | État actuel |
|---|---|---|---|
| E12 | L'application cible était décrite comme Expo/React Native Web ; la nouvelle [PR #194](https://github.com/epiverse-epitech/epiverse/pull/194) prépare **React/Vite**. Le choix n'est pas harmonisé. | [FU2, clarification et renvoi vers #113 — commit f3fff91](https://github.com/epiverse-epitech/epiverse/commit/f3fff91bf26125d8d723dce90d7af93ed517e539) | **Écart d'architecture ouvert** jusqu'à ADR et validation des clients web/mobile. La correction ne concerne que le reporting |
| E13 | Le pack simulé de 34 tâches en [PR #195](https://github.com/epiverse-epitech/epiverse/pull/195) créait une seconde source de suivi alors que 163 issues sont déjà structurées. | [Index de remise unique — commit 8004ca9](https://github.com/epiverse-epitech/epiverse/commit/8004ca9616de341c8aa048b8817cbe1e278ad5da) ; [PR #195 fermée sans fusion](https://github.com/epiverse-epitech/epiverse/pull/195) | **Doublon documentaire neutralisé** ; relecture et fusion de #147 encore nécessaires |
| E14 | FU1 est présent au calendrier et en CRAv, mais absent des **milestones natifs** du dépôt. Les 19 issues closes appartiennent aux **archives**, non à des fonctionnalités terminées. | [Jalons corrigés — commit 1094fbf](https://github.com/epiverse-epitech/epiverse/commit/1094fbf4fc115eaadd4e499eb37a80140b977b14) | **À finaliser :** milestone historique FU1 à créer/associer via GitHub, sans fausse clôture ; suivi [#105](https://github.com/epiverse-epitech/epiverse/issues/105) |

**Attention** : les liens de commits ci-dessus modifient réellement la **documentation** ; ils ne sont pas des tests d'intégration ou des correctifs de l'application.
