# Migration des 73 anciennes issues vers un backlog neuf (13/11/2026)

**Politique :** aucun commit, branche ou PR n'est supprimé. Les anciennes issues sont fermées « not planned » comme **doublons historiques remplacés**, pas comme travaux accomplis. Le texte original reste lisible et un lien pointe vers le ticket nouveau. **Fermer n'implique pas que le risque ou la fonctionnalité soit traité.**

## Correspondance ancien → nouveau
| Ancienne issue | Nouveau suivi | Lecture |
|---|---|---|
| [#11](https://github.com/epiverse-epitech/epiverse/issues/11) | [#110](https://github.com/epiverse-epitech/epiverse/issues/110) | [P0][GITHUB] Protéger main/develop, imposer CI et revues, durcir l'organisation |
| [#12](https://github.com/epiverse-epitech/epiverse/issues/12) | [#142](https://github.com/epiverse-epitech/epiverse/issues/142) | [P0][DATABASE] Séparer les privilèges PostgreSQL applicatif / migration / admin |
| [#13](https://github.com/epiverse-epitech/epiverse/issues/13) | [#136](https://github.com/epiverse-epitech/epiverse/issues/136) | [P0][RELEASE] Mettre en place le vrai gate de production G6 et les approbations |
| [#14](https://github.com/epiverse-epitech/epiverse/issues/14) | [#113](https://github.com/epiverse-epitech/epiverse/issues/113) | [P0][PRODUCT] Livrer une app Expo web minimale pour valider les déploiements bout en bout |
| [#15](https://github.com/epiverse-epitech/epiverse/issues/15) | [#144](https://github.com/epiverse-epitech/epiverse/issues/144) | [P1][DATA] Définir la source de vérité des interactions et la conformité RGPD |
| [#16](https://github.com/epiverse-epitech/epiverse/issues/16) | [#144](https://github.com/epiverse-epitech/epiverse/issues/144) | [P1][PLATFORM] Intégrer et sauvegarder MongoDB staging/prod, tester la restauration |
| [#17](https://github.com/epiverse-epitech/epiverse/issues/17) | [#143](https://github.com/epiverse-epitech/epiverse/issues/143) | [P1][SUPPLY CHAIN] Mettre en place SAST, scans images, SBOM et provenance |
| [#18](https://github.com/epiverse-epitech/epiverse/issues/18) | [#131](https://github.com/epiverse-epitech/epiverse/issues/131) | [P1][SECURITY] Finaliser l'authentification, les permissions et la sécurité API |
| [#19](https://github.com/epiverse-epitech/epiverse/issues/19) | [#119](https://github.com/epiverse-epitech/epiverse/issues/119) | [P1][SRE] Ajouter observabilité, disponibilité et tests de reprise |
| [#21](https://github.com/epiverse-epitech/epiverse/issues/21) | [#143](https://github.com/epiverse-epitech/epiverse/issues/143) | [P1][AGENTS] Encadrer les agents GitHub Copilot et les modifications automatisées |
| [#22](https://github.com/epiverse-epitech/epiverse/issues/22) | [#112](https://github.com/epiverse-epitech/epiverse/issues/112) | [P2][PROJECTS] Relier issues, PR, jalons et preuves EpiVerse |
| [#23](https://github.com/epiverse-epitech/epiverse/issues/23) | [#109](https://github.com/epiverse-epitech/epiverse/issues/109) | [P2][INSIGHTS] Assurer l'attribution des contributions et la traçabilité des releases |
| [#31](https://github.com/epiverse-epitech/epiverse/issues/31) | [#141](https://github.com/epiverse-epitech/epiverse/issues/141) | [P0][CVE] Corriger et qualifier les vulnérabilités Trivy de l'image API |
| [#32](https://github.com/epiverse-epitech/epiverse/issues/32) | [#144](https://github.com/epiverse-epitech/epiverse/issues/144) | [P1][REDIS] Éviter les secrets dans la ligne de commande Redis et définir la durabilité des tâches |
| [#33](https://github.com/epiverse-epitech/epiverse/issues/33) | [#142](https://github.com/epiverse-epitech/epiverse/issues/142) | [P0][HOST] Réduire les privilèges root équivalents du compte SSH de déploiement |
| [#34](https://github.com/epiverse-epitech/epiverse/issues/34) | [#144](https://github.com/epiverse-epitech/epiverse/issues/144) | [P1][MONGO] Valider les paramètres de TTL et le contrôle d'accès aux bases IA/monde |
| [#37](https://github.com/epiverse-epitech/epiverse/issues/37) | [#135](https://github.com/epiverse-epitech/epiverse/issues/135) | [P1][BACKUP] Authentifier cryptographiquement les archives chiffrées et éprouver le PRA |
| [#46](https://github.com/epiverse-epitech/epiverse/issues/46) | [#112](https://github.com/epiverse-epitech/epiverse/issues/112) | [P0][BACKLOG] Centraliser le pilotage EpiVerse dans GitHub Issues (remplacer Jira/Notion) |
| [#47](https://github.com/epiverse-epitech/epiverse/issues/47) | [#118](https://github.com/epiverse-epitech/epiverse/issues/118) | [P0][PROFIL] FR-PRO-001 — Créer et mettre à jour son profil utilisateur |
| [#48](https://github.com/epiverse-epitech/epiverse/issues/48) | [#132](https://github.com/epiverse-epitech/epiverse/issues/132) | [P0][PROFIL] FR-PRO-002 — Contrôler la visibilité et la confidentialité des profils |
| [#49](https://github.com/epiverse-epitech/epiverse/issues/49) | [#118](https://github.com/epiverse-epitech/epiverse/issues/118) | [P1][PROFIL] FR-PRO-003 — Ajouter ses compétences, expériences et projets |
| [#50](https://github.com/epiverse-epitech/epiverse/issues/50) | [#132](https://github.com/epiverse-epitech/epiverse/issues/132) | [P0][RGPD] FR-PRO-004 — Permettre la demande d'export et de suppression de données personnelles |
| [#51](https://github.com/epiverse-epitech/epiverse/issues/51) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][RBAC] FR-ROLE-003 — Attribuer et révoquer des gestionnaires d'association |
| [#52](https://github.com/epiverse-epitech/epiverse/issues/52) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][ASSOCIATIONS] FR-ASSO-001 — Créer, consulter et administrer les fiches d'association |
| [#53](https://github.com/epiverse-epitech/epiverse/issues/53) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][ASSOCIATIONS] FR-ASSO-002 — Publier et gérer les activités et recrutements associatifs |
| [#54](https://github.com/epiverse-epitech/epiverse/issues/54) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][ASSOCIATIONS] FR-ASSO-003 — Demander à rejoindre une association et suivre la décision |
| [#55](https://github.com/epiverse-epitech/epiverse/issues/55) | [#126](https://github.com/epiverse-epitech/epiverse/issues/126) | [P0][ÉVÉNEMENTS] FR-EVT-001 — Créer, publier, modifier et annuler un événement |
| [#56](https://github.com/epiverse-epitech/epiverse/issues/56) | [#125](https://github.com/epiverse-epitech/epiverse/issues/125) | [P0][ÉVÉNEMENTS] FR-EVT-002 — Lister, rechercher et filtrer les événements |
| [#57](https://github.com/epiverse-epitech/epiverse/issues/57) | [#127](https://github.com/epiverse-epitech/epiverse/issues/127) | [P0][ÉVÉNEMENTS] FR-EVT-003 — Inscrire et désinscrire les participants, gérer les capacités |
| [#58](https://github.com/epiverse-epitech/epiverse/issues/58) | [#127](https://github.com/epiverse-epitech/epiverse/issues/127) | [P1][ÉVÉNEMENTS] FR-EVT-004 — Informer des rappels, changements et annulations d'événements |
| [#59](https://github.com/epiverse-epitech/epiverse/issues/59) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][RESSOURCES] FR-RES-001 — Publier une ressource documentaire ou un lien externe |
| [#60](https://github.com/epiverse-epitech/epiverse/issues/60) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][RESSOURCES] FR-RES-002 — Rechercher et filtrer les ressources autorisées |
| [#61](https://github.com/epiverse-epitech/epiverse/issues/61) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][RESSOURCES] FR-RES-003 — Consulter une ressource et sa provenance |
| [#62](https://github.com/epiverse-epitech/epiverse/issues/62) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][RECHERCHE] FR-SRC-001 — Effectuer une recherche globale sur les contenus autorisés |
| [#63](https://github.com/epiverse-epitech/epiverse/issues/63) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][MENTORAT] FR-MEN-001 — Déclarer une disponibilité ou un besoin de mentorat |
| [#64](https://github.com/epiverse-epitech/epiverse/issues/64) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][MENTORAT] FR-MEN-002 — Découvrir et filtrer les profils de mentors |
| [#65](https://github.com/epiverse-epitech/epiverse/issues/65) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][MENTORAT] FR-MEN-003 — Envoyer et suivre les demandes de mentorat |
| [#66](https://github.com/epiverse-epitech/epiverse/issues/66) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][CARRIÈRES] FR-CAR-001 — Créer un profil talent distinct des données privées |
| [#67](https://github.com/epiverse-epitech/epiverse/issues/67) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][CARRIÈRES] FR-CAR-002 — Publier et administrer les offres professionnelles |
| [#68](https://github.com/epiverse-epitech/epiverse/issues/68) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][CARRIÈRES] FR-CAR-003 — Candidater ou manifester son intérêt pour une offre |
| [#69](https://github.com/epiverse-epitech/epiverse/issues/69) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][RECHERCHE] FR-SRC-002 — Filtrer et trier les résultats de recherche globale |
| [#70](https://github.com/epiverse-epitech/epiverse/issues/70) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][NOTIFICATIONS] FR-NOT-001 — Centre de notifications internes |
| [#71](https://github.com/epiverse-epitech/epiverse/issues/71) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P0][NOTIFICATIONS] FR-NOT-002 — Préférences et consentements des notifications |
| [#72](https://github.com/epiverse-epitech/epiverse/issues/72) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][MOBILE] FR-NOT-003 — Notifications push facultatives |
| [#73](https://github.com/epiverse-epitech/epiverse/issues/73) | [#131](https://github.com/epiverse-epitech/epiverse/issues/131) | [P0][ADMIN] FR-ADM-001 — Administration sécurisée des comptes et rôles |
| [#74](https://github.com/epiverse-epitech/epiverse/issues/74) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][ADMIN] FR-ADM-002 — Administration des contenus et de leurs statuts |
| [#75](https://github.com/epiverse-epitech/epiverse/issues/75) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P2][ADMIN] FR-ADM-003 — Tableau de suivi opérationnel respectueux de la vie privée |
| [#76](https://github.com/epiverse-epitech/epiverse/issues/76) | [#131](https://github.com/epiverse-epitech/epiverse/issues/131) | [P0][MODÉRATION] FR-MOD-001 — Signaler un profil ou un contenu |
| [#77](https://github.com/epiverse-epitech/epiverse/issues/77) | [#131](https://github.com/epiverse-epitech/epiverse/issues/131) | [P0][MODÉRATION] FR-MOD-002 — File de modération, décisions et audit |
| [#78](https://github.com/epiverse-epitech/epiverse/issues/78) | [#131](https://github.com/epiverse-epitech/epiverse/issues/131) | [P1][MODÉRATION] FR-MOD-003 — Notifier les décisions de modération selon la politique |
| [#79](https://github.com/epiverse-epitech/epiverse/issues/79) | [#121](https://github.com/epiverse-epitech/epiverse/issues/121) | [P2][CAMPUS 2D] FR-C2D-001 — Créer une carte 2D du campus servant d'accès aux services |
| [#80](https://github.com/epiverse-epitech/epiverse/issues/80) | [#122](https://github.com/epiverse-epitech/epiverse/issues/122) | [P2][CAMPUS 2D] FR-C2D-002 — Hotspots accessibles et liste alternative complète |
| [#81](https://github.com/epiverse-epitech/epiverse/issues/81) | [#122](https://github.com/epiverse-epitech/epiverse/issues/122) | [P2][CAMPUS 2D] FR-C2D-003 — Chargement progressif, erreurs et fallback du campus |
| [#82](https://github.com/epiverse-epitech/epiverse/issues/82) | [#124](https://github.com/epiverse-epitech/epiverse/issues/124) | [P2][CAMPUS 2D] NFR-C2D-001 — Définir et mesurer le budget de performance du campus |
| [#83](https://github.com/epiverse-epitech/epiverse/issues/83) | [#133](https://github.com/epiverse-epitech/epiverse/issues/133) | [P2][ACCESSIBILITÉ] NFR-C2D-002 — Rendre le campus navigable au clavier et lecteur d'écran |
| [#84](https://github.com/epiverse-epitech/epiverse/issues/84) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][PRODUIT] DEC-VISION-VIRTUAL-WORLD — Arbitrer la vision du monde social 2.5D/3D et la personnalisation |
| [#85](https://github.com/epiverse-epitech/epiverse/issues/85) | [#121](https://github.com/epiverse-epitech/epiverse/issues/121) | [P2][XR] POC-WORLD — Prototype jouable multiplateforme de campus social 2.5D |
| [#86](https://github.com/epiverse-epitech/epiverse/issues/86) | [#130](https://github.com/epiverse-epitech/epiverse/issues/130) | [P2][IA] AI-001 — Définir une baseline de recommandation explicable |
| [#87](https://github.com/epiverse-epitech/epiverse/issues/87) | [#130](https://github.com/epiverse-epitech/epiverse/issues/130) | [P2][IA] AI-002 — Expliquer chaque recommandation et matching |
| [#88](https://github.com/epiverse-epitech/epiverse/issues/88) | [#130](https://github.com/epiverse-epitech/epiverse/issues/130) | [P2][IA] AI-003 — Consentement et retrait des préférences IA personnalisées |
| [#89](https://github.com/epiverse-epitech/epiverse/issues/89) | [#130](https://github.com/epiverse-epitech/epiverse/issues/130) | [P2][IA] AI-004 — Mesurer la qualité, les biais et la dérive des fonctions IA |
| [#90](https://github.com/epiverse-epitech/epiverse/issues/90) | [#130](https://github.com/epiverse-epitech/epiverse/issues/130) | [P2][IA] AI-005 — Prévoir le fallback non IA de tous les parcours enrichis |
| [#91](https://github.com/epiverse-epitech/epiverse/issues/91) | [#130](https://github.com/epiverse-epitech/epiverse/issues/130) | [P2][IA] AI-006 — Interdire les décisions automatisées sensibles non validées |
| [#92](https://github.com/epiverse-epitech/epiverse/issues/92) | [#134](https://github.com/epiverse-epitech/epiverse/issues/134) | [P0][PERFORMANCE] NFR-PERF-001 — Mesurer la latence des parcours API critiques |
| [#93](https://github.com/epiverse-epitech/epiverse/issues/93) | [#133](https://github.com/epiverse-epitech/epiverse/issues/133) | [P0][ACCESSIBILITÉ] NFR-ACC-001 — Valider l'accessibilité WCAG 2.2 AA des parcours prioritaires |
| [#94](https://github.com/epiverse-epitech/epiverse/issues/94) | [#132](https://github.com/epiverse-epitech/epiverse/issues/132) | [P0][RGPD] NFR-PRIV-001 — Cartographier et contrôler les traitements de données personnelles |
| [#95](https://github.com/epiverse-epitech/epiverse/issues/95) | [#146](https://github.com/epiverse-epitech/epiverse/issues/146) | [P0][QUALITÉ] NFR-MNT-001 — Mettre en œuvre la maintenabilité et la traçabilité du code |
| [#96](https://github.com/epiverse-epitech/epiverse/issues/96) | [#113](https://github.com/epiverse-epitech/epiverse/issues/113) | [P1][COMPATIBILITÉ] NFR-COMP-001 — Définir la matrice de support web, mobile et systèmes d'exploitation |
| [#97](https://github.com/epiverse-epitech/epiverse/issues/97) | [#134](https://github.com/epiverse-epitech/epiverse/issues/134) | [P1][CAPACITÉ] NFR-SCL-001 — Vérifier la capacité et la dégradation contrôlée sous charge |
| [#98](https://github.com/epiverse-epitech/epiverse/issues/98) | [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][ROADMAP] ROADMAP-36 — Cartographier les 36 modules de la vision EpiVerse et les prioriser par release |
| [#99](https://github.com/epiverse-epitech/epiverse/issues/99) | [#114](https://github.com/epiverse-epitech/epiverse/issues/114) | [P0][UX/UI] UX-FIGMA — Rattacher Figma, consolider le design system et tracer les parcours MVP |
| [#100](https://github.com/epiverse-epitech/epiverse/issues/100) | [#120](https://github.com/epiverse-epitech/epiverse/issues/120) | [P0][QA] E2E-MVP — Démontrer les parcours métier MVP de bout en bout en staging |
| [#101](https://github.com/epiverse-epitech/epiverse/issues/101) | [#140](https://github.com/epiverse-epitech/epiverse/issues/140) | [P1][PILOTE] CAMPUS-PILOT — Préparer un pilote campus fermé, mesuré et réversible |

## Points importants
- Les fonctionnalités hors MVP sont regroupées dans [#145](https://github.com/epiverse-epitech/epiverse/issues/145) pour **priorisation différée** ; elles ne sont ni livrées ni annulées définitivement.
- Les écarts sécurité anciens ont des remplaçants **ouverts** : [#141](https://github.com/epiverse-epitech/epiverse/issues/141), [#142](https://github.com/epiverse-epitech/epiverse/issues/142), [#143](https://github.com/epiverse-epitech/epiverse/issues/143), [#144](https://github.com/epiverse-epitech/epiverse/issues/144).
- Les références Jira/Notion historiques ne sont pas reconstituées artificiellement.
- Les nouvelles issues [#103](https://github.com/epiverse-epitech/epiverse/issues/103) à [#146](https://github.com/epiverse-epitech/epiverse/issues/146) portent une estimation en heures, un responsable et les critères attendus.
