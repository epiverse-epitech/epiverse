# Registre vivant des risques — 13/11/2026

Échelle de pilotage : probabilité **P** (1 à 5), impact **I** (1 à 5), criticité **P × I**. Ce sont des estimations, pas des statistiques.

| ID | Risque ou problème | P×I | État | Responsable | Action et preuve de clôture |
|---|---|---:|---|---|---|
| R01 | Aucun code visible sur dépôt Tech au FU1 | 5×5=25 | **Survenu** au FU1, correction non prouvée | Ousmane | #103, lien dépôt et SHA commun |
| R02 | Application Expo absente de develop | 5×5=25 | **Survenu** | Philimon | #113, démarrage web/mobile et CI |
| R03 | Campus Phaser encore en branche POC | 4×4=16 | Ouvert | Julien | #121/#122, PR revue et démo intégrée |
| R04 | **Périmètre confirmé trop large face au calendrier** | 5×5=25 | Nouveau risque majeur | Estelle | #154, capacité, priorités, jalons et validation du compromis |
| R05 | Dépendances et renforts Data/IA sur autres pôles | 4×4=16 | Blocage constaté | Thomas | Contrats données synthétiques + retour planifié du pôle |
| R06 | Heures réellement consommées non déclarées | 5×4=20 | Survenu | Estelle | Mise à jour hebdomadaire, ETC vérifié sur chaque tâche |
| R07 | Documents/rôles périmés | 4×3=12 | Atténuation en PR #147, **non fusionnée** | Estelle | Correction fusionnée et relue |
| R08 | Protections de branche/CODEOWNERS non démontrées | 4×5=20 | Ouvert | Ousmane | #110 ; preuve réglages et revue indépendante |
| R09 | Dépôt devenu public et secrets/licences/données | 3×5=15 | Nouveau | Estelle | #132, scan et vérification droits |
| R10 | 60 FPS sans appareil, scène, durée ou nombre d'avatars | 4×3=12 | **Survenu** dans retour FU1 | Julien | #124, deux relevés comparables et protocole |
| R11 | Staging réel non démontré | 4×5=20 | Ouvert | Ousmane | #119, URL, tests de santé, accès tiers |
| R12 | Figma non relié aux écrans de démonstration | 3×4=12 | Ouvert | Soumia | #114/#138, maquettes et lien revus |
| R13 | Incompatibilité mobile ou accessibilité du monde | 4×4=16 | Ouvert | Philimon + Soumia | #133, #146, scénarios appareils/clavier |
| R14 | **1 212 h estimées sans capacité nominative validée** | 5×5=25 | Nouveau, critique | Estelle | Heures disponibles/personne, ETC actualisé, choix de réduction si nécessaire |
| R15 | WebRTC et vidéo de proximité : réseau, charge et coût | 4×5=20 | Nouveau | Julien + Ousmane | #169–#171/#181 ; test 50 utilisateurs et coût |
| R16 | Fuite CV, candidatures, profil et accès externes | 4×5=20 | Nouveau | Estelle + Eckson | #163–#168, #131, tests droits négatifs |
| R17 | Issues d'exigence et réalisation confondues | 4×3=12 | Atténué par reclassification GitHub | Estelle | 54 exigences + 85 tâches, une seule charge par travail |

## Historique et mouvements
- **09/10 :** R01 et R10 se matérialisent selon le retour écrit du pédagogue.
- **05–06/11 :** tests unitaires/E2E backend réussis ; le risque de tests du socle baisse, **pas** celui du frontend ni des médias.
- **13/11 :** R04 et R14 aggravés par le périmètre complet et le chiffrage ; R09, R15, R16 ajoutés.
- **13/11 :** R07 et R17 en mitigation par la PR #147 et la nouvelle structuration ; **pas clos** avant validation.

## Rituel
Chaque revue : signaler risques **nouveaux, survenus, atténués et clos**, noter propriétaire, probabilité/impact et preuve. Un risque survenu devient incident/écart avec issue corrective, pas une ligne supprimée.
