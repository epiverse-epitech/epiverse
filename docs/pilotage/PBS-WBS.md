# PBS et WBS — version opérationnelle courte

**PBS** = ce que l'on livre. **WBS** = le travail nécessaire. Les anciens DOC-005 et DOC-006 étaient des plans de départ, pas une preuve de code produit.

## PBS — éléments livrables
| PBS | Produit / fonction | Niveau | Preuve requise |
|---|---|---|---|
| PBS-01 | Application Expo web/mobile | P0 | Démarrage web+téléphone et CI |
| PBS-02 | Comptes, sessions, profils | P0 | Tests auth et UI |
| PBS-03 | Événements et inscriptions | P0 | Scénario complet |
| PBS-04 | Campus 2.5D jouable (POC) | P0/P1 | Prototype reproductible + perf contextualisée |
| PBS-05 | Sécurité, données, droits | P0 | Tests négatifs + revue |
| PBS-06 | Qualité, métriques, accessibilité | P0 | CI, mesures et audit |
| PBS-07 | Environnements, déploiement, dépôt Tech | P0 | Staging, lien commit académique |
| PBS-08 | Design system et parcours Figma | P0 | Maquettes reliées aux écrans |
| PBS-09 | Data/IA préparatoire | P1 | Contrats, jeux synthétiques, KPI |
| PBS-10 | Extensions post-MVP (association, mentorat, etc.) | P2 / différé | Roadmap et décision |

## WBS — lots, responsables et exemples d'issues
| WBS | Activité | Responsable | Tickets |
|---|---|---|---|
| WP1 | Infrastructure, tests automatiques, déploiement | Ousmane | [#103](https://github.com/epiverse-epitech/epiverse/issues/103), [#110](https://github.com/epiverse-epitech/epiverse/issues/110), [#119](https://github.com/epiverse-epitech/epiverse/issues/119), [#135](https://github.com/epiverse-epitech/epiverse/issues/135) |
| WP2 | API, base, authentification, événements | Eckson / Belaid | [#115](https://github.com/epiverse-epitech/epiverse/issues/115), [#116](https://github.com/epiverse-epitech/epiverse/issues/116), [#117](https://github.com/epiverse-epitech/epiverse/issues/117), [#126](https://github.com/epiverse-epitech/epiverse/issues/126) |
| WP3 | Frontend Expo web/mobile | Philimon / Lina | [#113](https://github.com/epiverse-epitech/epiverse/issues/113), [#118](https://github.com/epiverse-epitech/epiverse/issues/118), [#125](https://github.com/epiverse-epitech/epiverse/issues/125), [#127](https://github.com/epiverse-epitech/epiverse/issues/127) |
| WP4 | UX/UI et accessibilité | Soumia | [#114](https://github.com/epiverse-epitech/epiverse/issues/114), [#133](https://github.com/epiverse-epitech/epiverse/issues/133), [#138](https://github.com/epiverse-epitech/epiverse/issues/138) |
| WP5 | Data, modèles et analytics | Thomas (lead), Belaid, Lina | [#128](https://github.com/epiverse-epitech/epiverse/issues/128), [#129](https://github.com/epiverse-epitech/epiverse/issues/129), [#130](https://github.com/epiverse-epitech/epiverse/issues/130) |
| WP6 | Campus virtuel 2.5D | Julien, Thomas en renfort | [#121](https://github.com/epiverse-epitech/epiverse/issues/121) à [#124](https://github.com/epiverse-epitech/epiverse/issues/124) |
| WP7 | Sécurité, RGPD | Estelle + leads | [#131](https://github.com/epiverse-epitech/epiverse/issues/131), [#132](https://github.com/epiverse-epitech/epiverse/issues/132), [#141](https://github.com/epiverse-epitech/epiverse/issues/141) |
| WP8 | Assurance qualité et validation | Estelle + leads | [#120](https://github.com/epiverse-epitech/epiverse/issues/120), [#134](https://github.com/epiverse-epitech/epiverse/issues/134), [#146](https://github.com/epiverse-epitech/epiverse/issues/146) |
| WP9 | Pilotage, budget, preuves pédagogiques | Estelle | [#104](https://github.com/epiverse-epitech/epiverse/issues/104) à [#109](https://github.com/epiverse-epitech/epiverse/issues/109), [#137](https://github.com/epiverse-epitech/epiverse/issues/137) |
| WP10 | Communication, préparation FU3 et soutenance | Estelle + Soumia | [#139](https://github.com/epiverse-epitech/epiverse/issues/139), [#140](https://github.com/epiverse-epitech/epiverse/issues/140) |

## Chemin critique
`Design + contrat API → squelette Expo → auth intégrée → événements → tests E2E → staging → soutenance`.

Le campus POC se développe en parallèle ; son intégration ne doit pas bloquer les parcours classiques. Les renforts Data/IA retournent progressivement à leur pôle dès que les prérequis applicatifs sont prêts.
