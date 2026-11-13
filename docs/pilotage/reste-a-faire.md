# Charges EpiVerse — édition réestimée avec assistance IA (13/11/2026)

**85 tâches techniques/organisationnelles** distinctes des 54 exigences originales. Chaque ticket a un responsable, une estimation et des critères d'acceptation.

## Lecture correcte
- **Initiale :** 1 212 h, première baseline de cadrage conservée pour expliquer les écarts.
- **Charge révisée IA :** 943,5 h, hypothèse optimisée (gain sur génération et documentation, moins sur sécurité, médias, intégration et tests).
- **Travail déjà effectué rétroestimé :** 34 h sur **12 tâches avec des preuves de code ou de documentation**. **Ceci n'est pas un relevé d'heures réelles.**
- **ETC / reste réestimé :** 909,5 h. Les autres tâches sont sans heures consommées connues ; cela ne veut pas dire qu'aucun membre n'y a travaillé.
- **Prévision totale = passé estimé + reste estimé = 34 + 909,5 = 943,5 h.** Les 15 PR déjà fusionnées précédemment sont recensées séparément dans [l'historique des livraisons](historique-livrables.md) et ne sont pas additionnées à cette baseline.

## Vue par personne
| Responsable | Baseline historique | Charge IA | Passé rétroestimé* | ETC restant |
|---|---:|---:|---:|---:|
| Philimon | 186 h | 142 h | Non connu | 142 h |
| Ousmane | 158 h | 129,5 h | Non connu | 129,5 h |
| Eckson | 190 h | 142 h | 13 h | 129 h |
| Belaid | 156 h | 117,5 h | Non connu | 117,5 h |
| Estelle | 158 h | 118 h | 13,5 h | 104,5 h |
| Julien | 120 h | 106 h | 6 h | 100 h |
| Thomas | 114 h | 92,5 h | 1,5 h | 91 h |
| Lina | 98 h | 73,5 h | Non connu | 73,5 h |
| Soumia | 32 h | 22,5 h | Non connu | 22,5 h |
| **Total** | **1 212 h** | **943,5 h** | **34 h** | **909,5 h** |

\*Reconstruction d'effort indicatif à partir des livrables, jamais un pointage de durée observée.

## Vue tâche par tâche
| Issue | Tâche | Responsable | Phase | Initiale | Charge IA | Passé estimé (non pointé) | Reste IA |
|---|---|---|---|---:|---:|---:|---:|
| [#103](https://github.com/epiverse-epitech/epiverse/issues/103) | [P0][FU2] Vérifier et alimenter le dépôt Tech EPITECH | Ousmane | FU2 | 6 | 4 | Non connu | 4 |
| [#104](https://github.com/epiverse-epitech/epiverse/issues/104) | [P0][FU2] Finaliser le README et le résumé clair du produit | Estelle | FU2 | 3 | 2 | 1,5 | 0,5 |
| [#105](https://github.com/epiverse-epitech/epiverse/issues/105) | [P0][FU2] Reconstituer et valider les CRAv de FU1 et FU2 | Estelle | FU2 | 4 | 3 | 2 | 1 |
| [#106](https://github.com/epiverse-epitech/epiverse/issues/106) | [P0][FU2] Clore chaque objectif SMART du FU1 | Estelle | FU2 | 3 | 2 | Non connu | 2 |
| [#107](https://github.com/epiverse-epitech/epiverse/issues/107) | [P0][FU2] Publier le reste à faire en heures par personne et tâche | Estelle | FU2 | 5 | 3,5 | 1,5 | 2 |
| [#108](https://github.com/epiverse-epitech/epiverse/issues/108) | [P0][FU2] Afficher deux mesures datées d'un KPI avec une tendance | Thomas | FU2 | 4 | 3 | 1,5 | 1,5 |
| [#109](https://github.com/epiverse-epitech/epiverse/issues/109) | [P0][FU2] Mettre à jour le registre des risques et le journal d'écarts | Estelle | FU2 | 4 | 3 | 2 | 1 |
| [#110](https://github.com/epiverse-epitech/epiverse/issues/110) | [P0][FU2] Vérifier les revues de PR et les protections GitHub | Ousmane | FU2 | 7 | 5 | Non connu | 5 |
| [#111](https://github.com/epiverse-epitech/epiverse/issues/111) | [P0][FU2] Prouver les tests unitaires automatiques en PR | Ousmane | FU2 | 3 | 2 | Non connu | 2 |
| [#112](https://github.com/epiverse-epitech/epiverse/issues/112) | [P0][PILOTAGE] Créer un tableau de suivi simple par responsable et statut | Estelle | FU2 | 6 | 4 | Non connu | 4 |
| [#113](https://github.com/epiverse-epitech/epiverse/issues/113) | [P0][APP] Créer une vraie application Expo web/mobile minimale | Philimon | S9 | 16 | 12 | Non connu | 12 |
| [#114](https://github.com/epiverse-epitech/epiverse/issues/114) | [P0][UX] Fournir le design system et les maquettes MVP | Soumia | S9 | 12 | 8,5 | Non connu | 8,5 |
| [#115](https://github.com/epiverse-epitech/epiverse/issues/115) | [P0][API] Relire, corriger et intégrer l'inscription depuis la PR #45 | Eckson | S9 | 6 | 4,5 | 3 | 1,5 |
| [#116](https://github.com/epiverse-epitech/epiverse/issues/116) | [P0][API] Intégrer la connexion et les sessions depuis la branche EPI-57 | Eckson | S9 | 10 | 7,5 | 5 | 2,5 |
| [#117](https://github.com/epiverse-epitech/epiverse/issues/117) | [P0][API] Intégrer le parcours étudiant EPI-42 dans l'API | Eckson | S9 | 8 | 6 | 5 | 1 |
| [#118](https://github.com/epiverse-epitech/epiverse/issues/118) | [P0][APP] Intégrer inscription, connexion et profil au frontend | Philimon | S9 | 22 | 16,5 | Non connu | 16,5 |
| [#119](https://github.com/epiverse-epitech/epiverse/issues/119) | [P0][PLATFORM] Mettre en ligne un staging utilisable par l'équipe | Ousmane | S9 | 12 | 10,5 | Non connu | 10,5 |
| [#120](https://github.com/epiverse-epitech/epiverse/issues/120) | [P0][QA] Créer une démonstration E2E du parcours MVP | Estelle | S9 | 8 | 5,5 | Non connu | 5,5 |
| [#121](https://github.com/epiverse-epitech/epiverse/issues/121) | [P0][CAMPUS] Tester et préparer la PR du prototype 2.5D existant | Julien | S9 | 10 | 9 | 6 | 3 |
| [#122](https://github.com/epiverse-epitech/epiverse/issues/122) | [P0][CAMPUS] Intégrer le campus 2.5D dans l'application Expo web | Julien | S9 | 16 | 14 | Non connu | 14 |
| [#123](https://github.com/epiverse-epitech/epiverse/issues/123) | [P1][CAMPUS] Créer l'avatar personnalisable avec sauvegarde de ses choix | Thomas | S9 | 14 | 12,5 | Non connu | 12,5 |
| [#124](https://github.com/epiverse-epitech/epiverse/issues/124) | [P1][CAMPUS] Mesurer les FPS du campus avec un protocole précis | Julien | S9 | 8 | 7 | Non connu | 7 |
| [#125](https://github.com/epiverse-epitech/epiverse/issues/125) | [P0][APP] Créer la liste et le détail des événements | Lina | S9 | 14 | 10,5 | Non connu | 10,5 |
| [#126](https://github.com/epiverse-epitech/epiverse/issues/126) | [P0][API] Créer l'API des événements et inscriptions | Belaid | S9 | 22 | 16,5 | Non connu | 16,5 |
| [#127](https://github.com/epiverse-epitech/epiverse/issues/127) | [P0][APP] Créer la page d'inscription à un événement | Philimon | S9 | 10 | 7,5 | Non connu | 7,5 |
| [#128](https://github.com/epiverse-epitech/epiverse/issues/128) | [P1][DATA] Définir le contrat des événements de suivi du produit | Thomas | S9 | 10 | 7,5 | Non connu | 7,5 |
| [#129](https://github.com/epiverse-epitech/epiverse/issues/129) | [P1][DATA] Créer les jeux synthétiques et les tests qualité des données | Belaid | S9 | 10 | 7,5 | Non connu | 7,5 |
| [#130](https://github.com/epiverse-epitech/epiverse/issues/130) | [P2][IA] Créer un moteur de recommandation de base explicable | Thomas | FUTUR | 18 | 13,5 | Non connu | 13,5 |
| [#131](https://github.com/epiverse-epitech/epiverse/issues/131) | [P1][SEC] Vérifier l'authentification et les droits sur API et frontend | Estelle | S9 | 12 | 10,5 | Non connu | 10,5 |
| [#132](https://github.com/epiverse-epitech/epiverse/issues/132) | [P1][SEC] Vérifier RGPD et confidentialité du dépôt public | Estelle | S9 | 10 | 9 | Non connu | 9 |
| [#133](https://github.com/epiverse-epitech/epiverse/issues/133) | [P1][QA] Tester l'accessibilité des parcours web et mobile | Soumia | S9 | 12 | 8,5 | Non connu | 8,5 |
| [#134](https://github.com/epiverse-epitech/epiverse/issues/134) | [P1][QA] Mesurer réactivité et charge API avec deux campagnes | Eckson | S9 | 10 | 7 | Non connu | 7 |
| [#135](https://github.com/epiverse-epitech/epiverse/issues/135) | [P1][PLATFORM] Vérifier et sécuriser la restauration de sauvegarde | Ousmane | S9 | 8 | 7 | Non connu | 7 |
| [#136](https://github.com/epiverse-epitech/epiverse/issues/136) | [P1][PLATFORM] Finaliser les règles de release et la branche main | Ousmane | S9 | 10 | 9 | Non connu | 9 |
| [#137](https://github.com/epiverse-epitech/epiverse/issues/137) | [P1][PILOTAGE] Établir la correspondance PBS → WBS → exigences → issues | Estelle | S9 | 8 | 5,5 | 3 | 2,5 |
| [#138](https://github.com/epiverse-epitech/epiverse/issues/138) | [P1][UX] Rendre les maquettes accessibles et préparer la démonstration | Soumia | S9 | 8 | 5,5 | Non connu | 5,5 |
| [#139](https://github.com/epiverse-epitech/epiverse/issues/139) | [P1][FU3] Préparer le suivi FU3 du 18 décembre | Estelle | FU3 | 7 | 5 | Non connu | 5 |
| [#140](https://github.com/epiverse-epitech/epiverse/issues/140) | [P1][RELEASE] Préparer les livrables et la soutenance du 5 février 2027 | Estelle | S10 | 16 | 11 | Non connu | 11 |
| [#141](https://github.com/epiverse-epitech/epiverse/issues/141) | [P0][SEC] Corriger les vulnérabilités des images API détectées par Trivy | Estelle | S9 | 10 | 9 | Non connu | 9 |
| [#142](https://github.com/epiverse-epitech/epiverse/issues/142) | [P0][SEC] Séparer les droits DB et sécuriser les accès hôte | Ousmane | S9 | 14 | 12,5 | Non connu | 12,5 |
| [#143](https://github.com/epiverse-epitech/epiverse/issues/143) | [P1][SEC] Finaliser les contrôles de chaîne logicielle et les releases | Ousmane | S9 | 10 | 9 | Non connu | 9 |
| [#144](https://github.com/epiverse-epitech/epiverse/issues/144) | [P1][API] Réviser la conservation des données et la fiabilité MongoDB | Thomas | S9 | 10 | 7,5 | Non connu | 7,5 |
| [#145](https://github.com/epiverse-epitech/epiverse/issues/145) | [P1][PRODUCT] Décider quels anciens modules restent hors MVP et quand les reprendre | Estelle | S10 | 8 | 5,5 | Non connu | 5,5 |
| [#146](https://github.com/epiverse-epitech/epiverse/issues/146) | [P1][QA] Créer et suivre un registre des tests fonctionnels et anomalies | Philimon | S9 | 10 | 7 | Non connu | 7 |
| [#148](https://github.com/epiverse-epitech/epiverse/issues/148) | [P0][API] Créer le serveur temps réel des salons du campus | Eckson | S9 | 24 | 18 | Non connu | 18 |
| [#149](https://github.com/epiverse-epitech/epiverse/issues/149) | [P0][CAMPUS] Afficher plusieurs avatars en direct dans le même salon | Julien | S9 | 26 | 23 | Non connu | 23 |
| [#150](https://github.com/epiverse-epitech/epiverse/issues/150) | [P1][CAMPUS] Créer une maison visitable et personnalisable | Thomas | S9 | 20 | 17,5 | Non connu | 17,5 |
| [#151](https://github.com/epiverse-epitech/epiverse/issues/151) | [P1][APP] Ajouter interactions et échanges simples entre avatars | Lina | S9 | 18 | 13,5 | Non connu | 13,5 |
| [#152](https://github.com/epiverse-epitech/epiverse/issues/152) | [P1][SEC] Protéger les salons et interactions sociales | Estelle | S9 | 10 | 9 | Non connu | 9 |
| [#153](https://github.com/epiverse-epitech/epiverse/issues/153) | [P1][QA] Tester le monde multijoueur sur appareils distincts | Ousmane | S9 | 10 | 7 | Non connu | 7 |
| [#154](https://github.com/epiverse-epitech/epiverse/issues/154) | [P0][PRODUCT] Définir le périmètre de la préproduction complète et les 4 parcours | Estelle | S9 | 10 | 7 | Non connu | 7 |
| [#155](https://github.com/epiverse-epitech/epiverse/issues/155) | [P0][API] Gérer les établissements et vérifier l'appartenance des étudiants | Eckson | S9 | 22 | 16,5 | Non connu | 16,5 |
| [#156](https://github.com/epiverse-epitech/epiverse/issues/156) | [P1][APP] Compléter le profil étudiant, ses projets, ses compétences et sa confidentialité | Philimon | S9 | 20 | 15 | Non connu | 15 |
| [#157](https://github.com/epiverse-epitech/epiverse/issues/157) | [P1][API] Créer l'API des associations et des adhésions | Belaid | S9 | 24 | 18 | Non connu | 18 |
| [#158](https://github.com/epiverse-epitech/epiverse/issues/158) | [P1][APP] Créer les pages des associations | Lina | S9 | 18 | 13,5 | Non connu | 13,5 |
| [#159](https://github.com/epiverse-epitech/epiverse/issues/159) | [P0][API] Gérer les ressources et fichiers avec accès autorisés | Belaid | S9 | 24 | 18 | Non connu | 18 |
| [#160](https://github.com/epiverse-epitech/epiverse/issues/160) | [P0][APP] Permettre de publier, trouver et lire les ressources | Philimon | S9 | 18 | 13,5 | Non connu | 13,5 |
| [#161](https://github.com/epiverse-epitech/epiverse/issues/161) | [P0][API] Gérer les mentors et les demandes de mentorat | Eckson | S9 | 24 | 18 | Non connu | 18 |
| [#162](https://github.com/epiverse-epitech/epiverse/issues/162) | [P0][APP] Créer les écrans de recherche et demande de mentorat | Lina | S9 | 18 | 13,5 | Non connu | 13,5 |
| [#163](https://github.com/epiverse-epitech/epiverse/issues/163) | [P0][API] Créer les comptes recruteurs avec validation manuelle | Eckson | S9 | 24 | 18 | Non connu | 18 |
| [#164](https://github.com/epiverse-epitech/epiverse/issues/164) | [P0][API] Créer les offres, candidatures et leur suivi de statut | Belaid | S9 | 32 | 24,5 | Non connu | 24,5 |
| [#165](https://github.com/epiverse-epitech/epiverse/issues/165) | [P0][APP] Créer le parcours carrière et candidature web/mobile | Philimon | S9 | 30 | 23 | Non connu | 23 |
| [#166](https://github.com/epiverse-epitech/epiverse/issues/166) | [P0][API] Créer messages privés liés aux candidatures et aux entretiens | Eckson | S9 | 22 | 16,5 | Non connu | 16,5 |
| [#167](https://github.com/epiverse-epitech/epiverse/issues/167) | [P0][APP] Créer l'écran de messagerie et d'entretiens | Lina | S9 | 18 | 13,5 | Non connu | 13,5 |
| [#168](https://github.com/epiverse-epitech/epiverse/issues/168) | [P0][MEDIA] Ajouter une visio d'entretien sur invitation | Philimon | S9 | 26 | 23 | Non connu | 23 |
| [#169](https://github.com/epiverse-epitech/epiverse/issues/169) | [P1][MEDIA] Implémenter audio de proximité dans le campus 2.5D | Julien | S9 | 30 | 26,5 | Non connu | 26,5 |
| [#170](https://github.com/epiverse-epitech/epiverse/issues/170) | [P1][MEDIA] Implémenter vidéo de proximité dans le campus 2.5D | Julien | S10 | 30 | 26,5 | Non connu | 26,5 |
| [#171](https://github.com/epiverse-epitech/epiverse/issues/171) | [P0][DEVOPS] Préparer signalisation RTC, TURN et coûts médias | Ousmane | S9 | 24 | 21 | Non connu | 21 |
| [#172](https://github.com/epiverse-epitech/epiverse/issues/172) | [P0][API] Gérer accès aux salons, espaces privés et invitations externes | Eckson | S9 | 22 | 16,5 | Non connu | 16,5 |
| [#173](https://github.com/epiverse-epitech/epiverse/issues/173) | [P1][CAMPUS] Gérer les chambres, meubles et images personnelles avec permissions | Thomas | S10 | 24 | 21 | Non connu | 21 |
| [#174](https://github.com/epiverse-epitech/epiverse/issues/174) | [P1][API] Créer centre de notifications et préférences | Eckson | S9 | 18 | 13,5 | Non connu | 13,5 |
| [#175](https://github.com/epiverse-epitech/epiverse/issues/175) | [P1][APP] Créer le centre de notifications et réglages | Lina | S9 | 12 | 9 | Non connu | 9 |
| [#176](https://github.com/epiverse-epitech/epiverse/issues/176) | [P1][API] Créer recherche globale avec filtrage des droits | Belaid | S9 | 20 | 15 | Non connu | 15 |
| [#177](https://github.com/epiverse-epitech/epiverse/issues/177) | [P0][ADMIN] Créer gestion des utilisateurs, contenus et signalements | Philimon | S9 | 22 | 15,5 | Non connu | 15,5 |
| [#178](https://github.com/epiverse-epitech/epiverse/issues/178) | [P0][API] Créer l'API de modération et l'audit des décisions | Belaid | S9 | 24 | 18 | Non connu | 18 |
| [#179](https://github.com/epiverse-epitech/epiverse/issues/179) | [P0][QA] Faire installer la version v0.1 par un tiers et documenter les écarts | Ousmane | S9 | 14 | 10 | Non connu | 10 |
| [#180](https://github.com/epiverse-epitech/epiverse/issues/180) | [P1][FU2] Créer les ADR, le Delta Log et le dossier reporting du BUILD | Estelle | FU2 | 12 | 8,5 | 2 | 6,5 |
| [#181](https://github.com/epiverse-epitech/epiverse/issues/181) | [P1][QA] Mesurer la préproduction avec 50 utilisateurs simultanés | Ousmane | S10 | 16 | 11 | Non connu | 11 |
| [#182](https://github.com/epiverse-epitech/epiverse/issues/182) | [P1][DEVOPS] Sécuriser Redis et définir la fiabilité des tâches asynchrones | Ousmane | S9 | 10 | 9 | Non connu | 9 |
| [#183](https://github.com/epiverse-epitech/epiverse/issues/183) | [P1][GOV] Encadrer l'usage des agents IA et GitHub Copilot | Estelle | S9 | 6 | 4 | Non connu | 4 |
| [#184](https://github.com/epiverse-epitech/epiverse/issues/184) | [P1][GOV] Tracer les contributions individuelles et les versions livrées | Estelle | S9 | 8 | 5,5 | Non connu | 5,5 |
| [#185](https://github.com/epiverse-epitech/epiverse/issues/185) | [P1][DEVOPS] Mettre en place observabilité et alertes du staging | Ousmane | S9 | 14 | 12,5 | Non connu | 12,5 |
| [#186](https://github.com/epiverse-epitech/epiverse/issues/186) | [P1][FU2] Reconstituer les preuves de BUILD v0.1 et de deux Delta Logs | Estelle | FU2 | 8 | 5,5 | 1,5 | 4 |
| [#187](https://github.com/epiverse-epitech/epiverse/issues/187) | [P2][MOBILE] Ajouter les notifications push natives uniquement si les applications stores sont retenues | Philimon | FUTUR | 12 | 9 | Non connu | 9 |
| [#188](https://github.com/epiverse-epitech/epiverse/issues/188) | [P2][ADMIN] Créer un tableau de pilotage des usages sans exposer de données personnelles | Thomas | S10 | 14 | 10 | Non connu | 10 |
| **TOTAL** | | | | **1 212** | **943,5** | **34** | **909,5** |

## Règle hebdomadaire
Chaque membre relève ses **heures réellement travaillées à partir de maintenant** et réestime l'ETC. La prévision est recalculée, même si le reste augmente. Ce tableau est un cadrage, **pas** un enregistrement rétroactif exact des temps de travail.

**Risques :** pas de capacité hebdomadaire confirmée ; forte dépendance API → web/mobile → métier → campus/médias → tests de préproduction. Les dates ne sont garanties qu'après validation de capacité et des jalons.
