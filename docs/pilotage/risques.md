# Registre vivant des risques — 13/11/2026

Échelle : probabilité (P) 1 à 5, impact (I) 1 à 5, **score P × I**. Priorité haute si ≥ 12. Les scores sont des **estimations de pilotage**, non des probabilités statistiques.

| ID | Risque / problème | P × I | État | Responsable | Prévention / action | Indicateur de clôture |
|---|---|---:|---|---|---|---|
| R01 | Dépôt Tech EPITECH sans code visible | 5 × 5 = 25 | **Survenu selon FU1**, non corrigé démontré | Ousmane | Configurer/vérifier miroir et pousser sans écraser le dépôt officiel | Commit commun visible sur 2 dépôts |
| R02 | Frontend absent de develop, bloque démonstration | 5 × 5 = 25 | **Survenu**, toujours bloquant | Philimon | Expo minimal, navigation, intégration auth | Démo web + mobile et CI |
| R03 | Campus 2.5D sur branche isolée | 4 × 4 = 16 | Ouvert | Julien | Tester POC, isoler package, PR vers develop | Démo reproductible + PR |
| R04 | MVP trop large, 36 modules confondus avec livraison | 4 × 5 = 20 | Ouvert, réduction décidée | Estelle | Garder 1 verticale métier complète, extensions hors chemin critique | Périmètre validé et suivi |
| R05 | Dépendance croisée Data/IA/front | 4 × 4 = 16 | Bloquant | Thomas | Renfort temporaire ; schéma événements et fixtures synthétiques en parallèle | Événements de test stables |
| R06 | Absence d'heures consommées et réestimées | 4 × 4 = 16 | **Survenu**, suivi insuffisant | Estelle | Renseigner heures issues et actualiser chaque revue | 100 % issues actives complètes |
| R07 | Documentation ancienne contredit rôles/outils | 4 × 3 = 12 | Survenu, correction proposée | Estelle | Nouvelle baseline GitHub/Teams + journal de décisions | Références corrigées et PR fusionnée |
| R08 | PR fusionnées sans contrôle indépendant | 3 × 5 = 15 | Risque, non généralisé | Ousmane | CODEOWNERS, protection de branche, CI et relecture | Règles actives et vérifiées |
| R09 | Données personnelles / sécurité dans dépôt devenu public | 3 × 5 = 15 | Nouveau risque | Estelle | Revue secrets, licences, droits, RGPD, données fictives | Scan et revue sécurité documentés |
| R10 | KPI FPS non mesurable/comparable | 4 × 3 = 12 | **Survenu dans retour FU1** | Julien | Scène, matériel, fenêtre, méthode, échantillons datés | 2 mesures comparables |
| R11 | Déploiement et staging non démontrés | 4 × 4 = 16 | Ouvert | Ousmane | Déployer environnement de démonstration fermé, smoke tests | URL, CI/CD, preuve d'accès |
| R12 | Maquettes Figma non reliées au MVP | 3 × 3 = 9 | Ouvert | Soumia | Export, liens versionnés, critères UX | Une maquette liée à chaque écran P0 |
| R13 | Tests mobile et accessibilité oubliés | 4 × 4 = 16 | Ouvert | Philimon + Soumia | Matrice de compatibilité, audit clavier/lecteur d'écran | Rapport avec 0 blocage critique |

## Historique des changements (états observés)
- **09/10 : R01 et R10 se matérialisent** dans le retour du pédagogue (pas de push Tech, KPI « 60 FPS » insuffisant).
- **06/11 : réduction du risque backend CI** — lint, tests unitaires, E2E et build réussissent sur develop ; ne réduit pas le risque frontend.
- **13/11 : R02/R05/R06/R07 confirmés** par audit GitHub et réorganisation ; R09 ajouté car dépôt devenu public.
- **13/11 : R04 mis sous mitigation** par choix d'un MVP restreint, sans prétendre que le risque est déjà clos.

## Revue
Chaque vendredi : modifier P, I, état, action et preuve ; quand un risque arrive, le marquer **survenu**, décrire son impact et ouvrir l'action corrective. Jamais de suppression silencieuse.
