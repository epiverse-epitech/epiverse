# EpiVerse — pack de suivi FU1/FU2 (13 novembre 2026)

> **STATUT : reconstruction documentaire / simulations identifiées, non attestations d'exécution.** Les références EPI-001 à EPI-034 dans les CSV sont des identifiants *locaux du pack*, non les numéros d'issues GitHub. Le dépôt contient déjà des issues réelles : ne pas créer de doublons ni clore des tâches sur cette seule base.

## Contenu
- `suivi-issues.csv` — 34 entrées proposées et charges indicatives (452 h de reste estimé dans le pack initial ; à rebaseliner face aux issues existantes)
- `risques.csv`, `ecarts.csv`, `decisions.csv`, `smart-fu1.csv` — pilotage prêt à réconcilier
- `CRAV_FU1_FU2.md` — CRAv, jalons, KPI, code review, CI et preuve
- `tools/followup-kpi/` — code exemple et tests, indépendants du code métier NestJS
- `.github/workflows/followup-kpi.yml` — tests du module exemple sur PR (ne remplace pas la CI Node déjà en place)

## Ce qui existe déjà
- Référentiel documentaire DOC-001 à DOC-019, rapport UI/UX ;
- Application GitHub déjà structurée, issues de suivi réelles et CI Node existante ;
- Les éléments précédents ne prouvent **pas** à eux seuls qu'une revue FU1/FU2 a été tenue ni quels SMART ont été acceptés.

## À rapprocher du réel
1. Vérifier dates et comptes rendus des réunions réellement tenues ;
2. Exporter les véritables objectifs SMART FU1 et les qualifier (atteint/partiel/abandonné avec preuves) ;
3. Mapper ces 34 propositions sur les issues GitHub existantes — **ne pas dédupliquer sur le numéro EPI-xxx seul** ;
4. Utiliser les milestones existants ou créer, si besoin et avec dates officielles : FU1, FU2, MVP-S9, PILOTE-S10, EXT-S10 ;
5. Remplacer charges et mesures simulées par relevés datés et sources ;
6. Liens SHA/PR/review/CI réels obligatoires avant toute déclaration de clôture.

## Livraison
Travail proposé par PR, respect de la règle Git du dépôt : pas de push direct sur main. Les binaires DOCX/XLSX restent téléchargeables dans la conversation ; le contenu pivot est versionné ici sous forme Markdown/CSV.
