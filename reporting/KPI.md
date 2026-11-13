# KPI — historique comparatif et mesures futures

## KPI 1 — PR fusionnées cumulées (données GitHub)
| Date | Valeur |
|---|---:|
| 30/10/2026 | 2 |
| 04/11/2026 | 14 |
| 05/11/2026 | 15 |

Cette série mesure **l'activité d'intégration**, **pas** la réalisation du MVP. Source : dates `merged_at` des PR dans GitHub.

## KPI 2 — réussite CI backend
| Date | État | Preuve |
|---|---|---|
| 05/11/2026 | Tests unitaires + E2E API réussis | [Actions #42124966749](https://github.com/epiverse-epitech/epiverse/actions/runs/42124966749) |
| 06/11/2026 | Tests unitaires + E2E API réussis | [Actions #42202615403](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403) |

**Limite :** le job Expo était `skipped` : aucune déduction sur le frontend.

## KPI produit à instrumenter
| KPI | Cible de test proposée | Conditions à consigner |
|---|---|---|
| Réactivité interface | p95 ≤ 200 ms pour actions choisies | appareil, navigateur, scénario |
| API | p95 ≤ 500 ms sous charge définie | endpoint, simultanéité, erreurs et période |
| Accessibilité | 0 obstacle critique parcours MVP | clavier, zoom, lecteur d'écran, audit manuel |
| Campus | FPS p5 ≥ 30 mobile, ≥ 60 desktop **sous scène définie** | résolution, nombre avatars, appareil, média actif, fenêtre 60 s |
| Monde temps réel | latence, pertes et reconnexions mesurées | 2 puis 50 participants, région et réseau |
| Audio/vidéo | délai connexion, interruptions et coût / utilisateur-minute | route réseau/TURN, permission, nombre flux |
| Staging | 99 % cible sur fenêtre 7 jours | sondes et incidents, environnement réel |

Les cibles ne sont **pas** des résultats. Les métriques produit restent N/A tant que l'application et les bancs d'essai ne les produisent pas.

Le détail du protocole est dans [KPI du pilotage](../docs/pilotage/KPI.md).
