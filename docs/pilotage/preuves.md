# Registre de preuves — à montrer au jury

| ID | Domaine | Preuve | Ce qu'elle démontre | Limite |
|---|---|---|---|---|
| P001 | API fondations | [PR #1](https://github.com/epiverse-epitech/epiverse/pull/1) | Socle NestJS fusionné | Pas d'interface utilisateur |
| P002 | Données et fixtures | [PR #2](https://github.com/epiverse-epitech/epiverse/pull/2) | Générateur fictif et MongoDB monde/IA fusionnés | Les fixtures ne sont pas des données utilisateurs |
| P003 | Base de données | [PR #3](https://github.com/epiverse-epitech/epiverse/pull/3) | Connexion Prisma fusionnée | Contrôler les migrations en staging |
| P004 | Contrat API | [PR #4](https://github.com/epiverse-epitech/epiverse/pull/4) | Conventions et interfaces backend fusionnées | Parcours de bout en bout pas encore prouvé |
| P005 | Hash de mots de passe | [PR #5](https://github.com/epiverse-epitech/epiverse/pull/5) | Travail de sécurité fusionné | Ne garantit pas tout le cycle d'auth |
| P006 | Limitation API | [PR #39](https://github.com/epiverse-epitech/epiverse/pull/39) | Code fusionné + approbation d'Ousmane le 05/11 | Pas de preuve de charge réelle à grande échelle |
| P007 | Inscription | [PR #45](https://github.com/epiverse-epitech/epiverse/pull/45) | Code et tests proposés par Eckson | **Ouverte, non livrée** |
| P008 | Tests CI | [Actions 05/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42124966749) | API : lint, tests unitaires, E2E, build passés | Frontend Expo ignoré |
| P009 | Tests CI | [Actions 06/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615403) | Deuxième exécution API réussie | Ne prouve pas la démo du produit |
| P010 | Campus 2.5D | [Branche POC](https://github.com/epiverse-epitech/epiverse/tree/feature/EPI-459-avatar-poc/packages/campus) | Code Phaser/avatar/caméra et banc d'essai présents | À tester et intégrer dans Expo |
| P011 | Infra | [infra/README](https://github.com/epiverse-epitech/epiverse/blob/develop/infra/README.md) | Procédure Docker et environnements documentés | Staging réel non confirmé |
| P012 | Dépôt EPITECH | [Miroir 06/11](https://github.com/epiverse-epitech/epiverse/actions/runs/42202615383) | Workflow existe, mais **skipped** | Aucun succès de synchronisation démontré |

## Preuves à ajouter
- Vidéo ou capture d'une démonstration Expo web/mobile (avec appareil/date).
- URL Figma et exports d'écrans validés (Soumia).
- Résultats de scénarios d'inscription, profil et événements.
- Mesures FPS p5 mobile et desktop, mesures réactivité p95 et audit accessibilité.
- Lien exact du dépôt Tech et commit commun visible.

**Principe :** une preuve cite son environnement, sa date et ce qu'elle **ne démontre pas**.
