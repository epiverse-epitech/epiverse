# Où travailler dans GitHub — mode d'emploi en 1 minute

| Onglet | À quoi il sert | Ce que l'on y met |
|---|---|---|
| **Code** | Produit et documentation de référence | `apps/`, `packages/campus`, `infra/`, `docs/pilotage/` et README |
| **Issues** | Une tâche = un résultat et un responsable | 44 tâches [#103 à #146](https://github.com/epiverse-epitech/epiverse/issues), priorité, pôle, phase, état, heures et risques |
| **Pull requests** | Faire relire et intégrer le code | Une PR reliée à son issue ; tests, relecteur, heures et preuves |
| **Actions** | Lancer et consulter les tests automatiques | CI API ; CI Expo dès app présente ; miroir dépôt Tech |
| **Projects** | Tableau de bord de l'équipe | **À créer dans l'interface** : un Project commun, lié au dépôt |
| **Security** | Alertes et contrôles, si activés | Dependabot, scans, politiques de sécurité |
| **Insights** | Activité Git réelle | PR, commits et contributeurs ; **pas** un taux d'avancement produit |
| **Wiki** | Non nécessaire ici | Les pages `docs/pilotage` versionnées dans Code évitent la duplication |

## Les filtres rapides à utiliser dans Issues
- [Toutes les tâches ouvertes](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen)
- [Urgences P0](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Aprio%3AP0)
- [Frontend](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Apole%3Afrontend)
- [Backend](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Apole%3Abackend)
- [Campus 2.5D](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Apole%3Acampus)
- [Data/IA](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Apole%3Adata-ia)
- [En cours](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Aetat%3Aen-cours)
- [En revue](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Aetat%3Aen-revue)

## Project à créer (dans la page Projects de l'organisation)
**Titre :** `EpiVerse — Pilotage & Livraison`

**Champs :**
- Status : Backlog / Prête / En cours / Bloquée / En revue / À valider / Terminé.
- Priority : P0 / P1 / P2.
- Responsable : champ GitHub Assignee.
- Phase : FU2 / S9 / FU3 / S10.
- Pôle : Pilotage / Backend / Frontend / Data-IA / Campus / UX / DevOps / Sécurité / Qualité.
- Estimate (h), Actual (h), Remaining (h) : nombres.
- Date cible : date.

**Vues :**
1. **Vue équipe** : tableau Kanban, colonnes par Status, filtre issues ouvertes.
2. **FU2 / urgences** : filtre phase FU2 et P0.
3. **Par responsable** : tableau regroupé par Assignee.
4. **Roadmap** : calendrier/roadmap par dates et jalons.
5. **Qualité** : filtre sécurité + QA + PR en revue.

**Limite de l'automatisation actuelle :** le connecteur GitHub connecté permet de créer/modifier issues, PR et fichiers, mais ne fournit pas de commande de création des Projects V2. Le tableau ci-dessus est la configuration exacte à appliquer dans l'interface. Les labels et tickets sont déjà préparés.
