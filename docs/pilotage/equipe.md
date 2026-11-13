# Organisation et responsabilités — 13/11/2026

| Membre | Rôle permanent | Mission du moment | Validation métier |
|---|---|---|---|
| Estelle | Cheffe de projet, produit, sécurité et qualité | Arbitrages, suivi, sécurité, critères de validation | Validation finale du périmètre et des risques |
| Eckson | Lead backend | API, authentification, contrats, intégration avec Belaid | Fonctionnement de l'API |
| Philimon | Lead frontend | Application Expo web/mobile avec Lina | Parcours utilisateur testables |
| Thomas | **Lead Data & IA** | Encadre Belaid et Lina ; renfort temporaire campus 2.5D avec Julien | Données, métriques, modèles |
| Belaid | Data & IA | Renfort temporaire backend avec Eckson | Retour Data/IA après déblocage |
| Lina | Data & IA | Renfort temporaire frontend avec Philimon | Retour Data/IA après déblocage |
| Julien | Réalisation du campus 2.5D | Phaser, avatars, carte, interactions avec Thomas | Démonstration du monde |
| Soumia | UX/UI design | Figma, parcours, design system, accessibilité visuelle | Maquettes et cohérence UX ; pas de management |
| Ousmane | DevOps, intégration | Docker, CI/CD, staging, miroir EPITECH et revues de PR | Chaîne de livraison |

## Règles simples
- **Un responsable unique par issue** ; les renforts sont indiqués séparément.
- **Estelle dirige le projet**, prend les décisions de périmètre et arbitre les priorités.
- **Thomas reste lead Data/IA**, même lorsque les trois membres dépannent d'autres pôles.
- **Soumia ne gère pas le projet** ; elle répond du design.
- **Ousmane n'est pas seul responsable de toutes les PR** : le lead technique vérifie le code de son domaine, Ousmane contrôle l'intégration et Estelle intervient sur les enjeux de sécurité/RGPD.
- Aucun auteur ne valide seul sa propre PR. Revue renforcée pour auth, sécurité, données et déploiement.

## Retour des renforts vers Data/IA
Le retour de Lina/Belaid/Thomas sur les objectifs Data/IA se déclenche quand les parcours de base produisent des événements de test, que le schéma est stable et que l'API/front sont intégrés. Les travaux préparatoires Data/IA (schéma d'événements, données synthétiques, métriques) continuent en parallèle.

## Matrice de responsabilités simplifiée
| Livrable | Pilote (R) | Validation (A) | Consultés |
|---|---|---|---|
| Planning, CRAv, risques, SMART, écarts | Estelle | Estelle | Tous les leads |
| API et DB | Eckson (+ Belaid) | Estelle | Thomas, Ousmane |
| Frontend web/mobile | Philimon (+ Lina) | Estelle | Soumia, Eckson |
| Monde 2.5D | Julien (+ Thomas) | Estelle | Philimon, Soumia |
| Data, tracking, IA | Thomas (+ Lina, Belaid) | Estelle | Eckson, Philimon |
| UX/UI | Soumia | Estelle | Philimon, Lina, Julien |
| CI, infrastructure, miroir EPITECH | Ousmane | Estelle | Eckson |
| RGPD, sécurité, gates | Estelle | Estelle | Tous les leads |

**Note :** R réalise ; A approuve. Les responsabilités historiques DOC-004/DOC-019 sont remplacées par cette organisation.
