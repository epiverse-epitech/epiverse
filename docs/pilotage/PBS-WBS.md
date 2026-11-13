# PBS / WBS — EpiVerse, version corrigée du 13/11/2026

**PBS :** les parties du produit à livrer. **WBS :** le travail concret à réaliser. Les issues historiques `[EXIGENCE]` spécifient la réception ; les nouvelles issues `[P0/P1][PÔLE]` chiffrent le travail.

## PBS — livrables et niveau de preuve
| PBS | Livrable | Exigences originales | Travaux principaux |
|---|---|---|---|
| 01 | Identité étudiante multi-campus, profils, projets, confidentialité | #47–#50, #94 | #115–#118, #155, #156 |
| 02 | Événements et inscriptions | #55–#58 | #125–#127, #174, #175 |
| 03 | Associations et vie de campus | #51–#54 | #157, #158 |
| 04 | Ressources, recherche et filtrage | #59–#62, #69 | #159, #160, #176 |
| 05 | Mentorat étudiants/alumni/professionnels | #63–#65 | #161, #162 |
| 06 | Recrutement, offres, CV, candidatures, entretien | #66–#68 et exigences ajoutées | #163–#168 |
| 07 | Campus 2.5D social et personnalisable | #79–#85 | #121–#124, #148–#153, #169–#173 |
| 08 | Notifications, modération, administration | #70–#78 | #174, #175, #177, #178 |
| 09 | Accessibilité, compatibilité, charge et performance | #82, #83, #92, #93, #95–#97, #100 | #133, #134, #146, #153, #179, #181 |
| 10 | API, données, sécurité et exploitation | #94–#97 + contrôles historiques | #119, #131, #132, #135, #136, #141–#144, #182, #185 |
| 11 | Suivi EPITECH, dépôt Tech, KPI, CRAv, SMART, reporting | Retour FU1 / BUILD | #103–#112, #137, #139, #140, #180, #184, #186 |
| 12 | Data/IA préparatoire | #86–#91 (phase future) | #128–#130, #144 |
| 13 | Extensions post-soutenance | #72, #101 et 36 modules | #145, #187 et décisions futures |

## WBS — lots et responsabilités
| Lot | Réalisateurs et renforts | Preuve attendue |
|---|---|---|
| Pilotage | **Estelle** | Issues estimées, risques, décisions, CRAv, KPI et preuves |
| Backend / API | **Eckson** avec **Belaid** temporairement | PR, tests unitaires/E2E, rôles et droits |
| Frontend | **Philimon** avec **Lina** temporairement | Parcours réels sur navigateur desktop/mobile |
| Data/IA | **Thomas, lead** ; Belaid et Lina membres permanents | Contrats data, jeux synthétiques, qualité et évaluation |
| Monde 2.5D | **Julien**, Thomas en renfort temporaire | POC intégré, multijoueur, avatar/maison, tests réseaux/médias |
| UX/UI | **Soumia** (sans direction de projet) | Figma versionné, parcours et accessibilité |
| DevOps | **Ousmane** | CI, images, staging, restauration et dépôt Tech |
| Sécurité/validation | **Estelle** avec leads techniques | Tests négatifs, RGPD, sécurité du dépôt public et avis de revue |

## Chaîne de dépendances
Identité/roles + API + maquettes → frontend web/mobile → événements/ressources/mentorat/carrière → monde social et médias → staging → tests multi-utilisateurs → soutenance.

Les travaux parallèles doivent respecter l'ordre des dépendances. **Une branche ou une PR ouverte ne vaut pas livraison.**
