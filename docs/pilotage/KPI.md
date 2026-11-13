# KPI — définitions, mesures et cibles

## 1. Tendance réelle : PR fusionnées
Les nombres sont tirés des dates de fusion GitHub et servent de **mesures historiques comparables** ; ils ne mesurent pas la part de fonctionnalités terminées.

| Date de mesure | PR fusionnées, cumul | Source |
|---|---:|---|
| 30/10/2026 | 2 | Historique des PR du dépôt |
| 04/11/2026 | 14 | Historique des PR du dépôt |
| 05/11/2026 | 15 | Historique des PR du dépôt |

Mini-frise : `30/10  ██ 2  →  04/11  ██████████████ 14  →  05/11  ███████████████ 15`

## 2. Tendance réelle : CI backend
| Date | Statut API (lint, unitaires, E2E, build) | Preuve |
|---|---|---|
| 05/11/2026 | Succès | [GitHub Actions](https://github.com/epiverse-epitech/epiverse/actions/runs/42124966749) |
| 06/11/2026 | Succès | [GitHub Actions](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403) |

**Limite :** le job Expo a été ignoré sur ces deux exécutions. Ces résultats ne démontrent ni l'intégration mobile/web ni l'accessibilité.

## 3. KPI produit à mesurer (cibles proposées)
| KPI | Cible | Comment et où mesurer | Responsable |
|---|---|---|---|
| Réactivité des contrôles p95 | ≤ 200 ms | Mesurer clic → retour visible sur parcours de référence, appareil et navigateur fixés | Philimon |
| API p95 | ≤ 500 ms | Tester les routes critiques sous charge spécifiée, exclure les erreurs de la distribution de latence et mesurer leur taux séparément | Eckson |
| Accessibilité | 0 blocage critique des parcours prioritaires | Clavier, lecteur d'écran, axe-core, WCAG 2.2 AA | Soumia + Lina |
| Fluidité campus desktop | ≥ 60 FPS au 5e percentile | 60 s sur scène de référence avec 1 avatar, 10 avatars simulés, zoom + déplacement ; PC et navigateur identifiés | Julien |
| Fluidité campus mobile | ≥ 30 FPS au 5e percentile | Même protocole sur téléphone de référence identifié | Julien |
| Taux de réussite E2E | 100 % des scénarios MVP critiques | GitHub Actions / staging | Ousmane + leads |
| Revues indépendantes | 100 % des PR fusionnées après activation de la règle | GitHub PR Reviews | Ousmane |
| Complétude de suivi | 100 % issues actives : owner, heures prévues, faites, restantes, risques | Vérification des issues GitHub | Estelle |
| Disponibilité staging | ≥ 99 % sur une fenêtre de 7 jours | Sondes actives et période documentée | Ousmane |

### Conditions de comparabilité des FPS
Résolution, modèle de téléphone / CPU-GPU, navigateur/version, scène, nombre d'avatars, taux de rafraîchissement, durée, fenêtre visible et méthode de collecte doivent être enregistrés. Une cible sans mesure reste `N/A`, **pas 0 FPS**.

### Pourquoi plusieurs KPI ?
Les KPI de management suivent l'organisation ; les KPI techniques suivent qualité, réactivité, accessibilité et performance globale. Les deux catégories sont nécessaires pour répondre au retour pédagogique.
