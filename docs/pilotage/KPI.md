# KPI — définitions, mesures et cibles

## 0. KPI produit demandés au FU1 : grille d'évaluation opérationnelle

**Deux mesures réelles comparables sont exigées** avant de déclarer une amélioration. Les seuils ci-dessous sont des **cibles à tester**, pas des performances observées. Protocole, jeux d'essai, appareils et méthode : [PROTOCOLE-MESURES.md](PROTOCOLE-MESURES.md).

| Dimension évaluée | Mesure et unité | Point de mesure | Cible de travail (non atteinte) | Statut |
|---|---|---|---|---|
| **Réactivité utilisateur** | Latence interaction → prochain affichage pertinent **p95 en ms** | Clic « voir événement », réponse inscription, recherche ; chronométrage navigateur, 30 itérations/scénario | p95 ≤ 200 ms sur interaction locale hors réseau lent ; ajuster après baseline | N/A, non mesuré |
| **Chargement de l'application** | **LCP p75 en secondes** + INP p75 en ms (données de terrain si disponibles) | Accueil, événements, campus ; desktop et mobile identifiés | LCP ≤ 2,5 s et INP ≤ 200 ms pour le suivi web, lorsque l'instrumentation le permet | N/A, non mesuré |
| **Accessibilité** | % de parcours sans défaut bloquant ; nombre de violations **WCAG 2.2 AA** (audit automatisé + manuel) | Connexion, événement, menu principal, fallback campus ; clavier + lecteur d'écran | 100 % des parcours critiques sans blocage ; 0 violation critique détectée | N/A, non audité |
| **Performance API** | Latence **p50 / p95 / p99**, taux erreurs et débit (req/s) | Auth, profil, événements, ressources ; charge et infra déclarées | p95 ≤ 500 ms et erreurs 5xx < 1 % dans scénario fixé | CI des tests disponible ; métriques charge N/A |
| **Fluidité campus 2.5D** | FPS médian et **p5**, frame time **p95 en ms**, taux d'images manquées | Marche + rotation/caméra/zoom ; 1, 10 et 50 avatars selon capacités ; 60 s ; PC/téléphone et scène consignés | Desktop FPS p5 ≥ 60 à 60 Hz, soit frame time p95 ≤ 16,7 ms ; mobile FPS p5 ≥ 30, soit ≤ 33,3 ms | POC en branche ; non mesuré |
| **Performance globale** | Démarrage, latence UI, erreurs JS, mémoire (Mo), stabilité et connexions simultanées | Parcours E2E nominal et test de 50 utilisateurs **au total** avec matériel/réseau fixés | Aucune erreur bloquante, critères de charge à valider selon capacités | N/A, non validé |

**Important** : « 60 FPS » sans plateforme, puissance matérielle, fréquence d'écran, résolution, état du monde, nombre d'avatars, charge réseau, durée, FPS p5 et mesure frame-time n'a aucune valeur comparative. Un écran 60 Hz rend une cible 60 FPS vérifiable ; sur mobile, définir une cible adaptée. Le p5 FPS et le p95 frame-time ne sont des approximations équivalentes que si mesurés sur les **mêmes frames**.

**Décision de reporting :** afficher baseline A et baseline B (date UTC, commit, environnement, scénario) avant d'indiquer `+/- X %`. La progression des PR reste un KPI de gestion **distinct** de la qualité produit.

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

## Protocole de collecte et de comparaison

[PROTOCOLE-MESURES.md](PROTOCOLE-MESURES.md) définit scénarios, appareils, outils, p95, p5, WCAG, deux relevés comparables et la contextualisation du FPS. Les cibles du présent document ne sont pas des résultats mesurés.
