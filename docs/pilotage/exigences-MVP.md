# Exigences testables et tickets associés

État au 13/11 : cette page décrit **ce qu'il faut vérifier**, pas les fonctions déjà livrées. Les ID issus de DOC-007 sont conservés quand ils correspondent.

| ID ou groupe | Attendu simple | Preuve attendue | Nouvelle issue |
|---|---|---|---|
| FR-AUTH-001 à 004 | Inscription, connexion, session et sortie | Tests auth négatifs + UI | [#115](https://github.com/epiverse-epitech/epiverse/issues/115), [#116](https://github.com/epiverse-epitech/epiverse/issues/116) |
| FR-PRO-001 à 004 | Profil modifiable, confidentialité, export/suppression selon périmètre | Test CRUD, contrôle des droits | [#118](https://github.com/epiverse-epitech/epiverse/issues/118), [#132](https://github.com/epiverse-epitech/epiverse/issues/132) |
| FR-ROLE-001 à 003 | Actions limitées selon les rôles | Tests d'accès interdit | [#131](https://github.com/epiverse-epitech/epiverse/issues/131) |
| FR-EVT-001 à 004 | Créer, voir, filtrer, rejoindre/quitter un événement, avertir | Tests API et démo UI | [#125](https://github.com/epiverse-epitech/epiverse/issues/125), [#126](https://github.com/epiverse-epitech/epiverse/issues/126), [#127](https://github.com/epiverse-epitech/epiverse/issues/127) |
| FR-C2D-001 à 003 | Carte, avatar, déplacements et accès alternatif | Démo Phaser, mobile/web, écran de secours | [#121](https://github.com/epiverse-epitech/epiverse/issues/121), [#122](https://github.com/epiverse-epitech/epiverse/issues/122) |
| NFR-SEC-001 | Sécurité des comptes et droits | Revue sécurité, tests négatifs | [#131](https://github.com/epiverse-epitech/epiverse/issues/131), [#141](https://github.com/epiverse-epitech/epiverse/issues/141), [#142](https://github.com/epiverse-epitech/epiverse/issues/142) |
| NFR-PRIV-001 | Données minimisées et protégées | Registre, tests de suppression, scans | [#132](https://github.com/epiverse-epitech/epiverse/issues/132), [#144](https://github.com/epiverse-epitech/epiverse/issues/144) |
| NFR-PERF-001 | Réactivité API quantifiée | p95, taux erreurs, charge définie | [#134](https://github.com/epiverse-epitech/epiverse/issues/134) |
| NFR-ACC-001 / NFR-C2D-002 | Navigation accessible | Clavier, lecteur d'écran, axe-core | [#133](https://github.com/epiverse-epitech/epiverse/issues/133) |
| NFR-COMP-001 | Web et mobile réellement testés | Matrice appareils et versions | [#113](https://github.com/epiverse-epitech/epiverse/issues/113), [#146](https://github.com/epiverse-epitech/epiverse/issues/146) |
| NFR-SCL-001 | Dégradation progressive sous charge | Tests et limites documentées | [#134](https://github.com/epiverse-epitech/epiverse/issues/134) |
| NFR-BACK-001 | Sauvegarde et restauration | Test de reprise | [#135](https://github.com/epiverse-epitech/epiverse/issues/135) |
| NFR-MNT-001 / NFR-OBS-001 | Maintenabilité et observabilité | CI, revue de code et logs | [#110](https://github.com/epiverse-epitech/epiverse/issues/110), [#119](https://github.com/epiverse-epitech/epiverse/issues/119) |

## Exigences différées mais conservées
- **Associations** FR-ASSO-001 à 003
- **Ressources** FR-RES-001 à 003
- **Recherche** FR-SRC-001 à 002
- **Notifications** FR-NOT-001 à 003
- **Mentorat** FR-MEN-001 à 003
- **Carrières** FR-CAR-001 à 003
- **Administration/modération avancée** FR-ADM-001 à 003 et FR-MOD-001 à 003
- **IA** AI-001 à 006 du backlog historique

Tous ces groupes sont conservés dans [l'issue de roadmap #145](https://github.com/epiverse-epitech/epiverse/issues/145) ; ils ne doivent pas rester en doublon dans les tâches actives du MVP.

## Règle
Chaque exigence est **acceptée** seulement avec résultat de test, capture/démo et lien PR ; une issue « fermée » sans preuve n'est pas une fonctionnalité livrée.
