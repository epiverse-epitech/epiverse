# Comment utiliser les onglets GitHub

| Onglet | Utilité pratique |
|---|---|
| **Code** | Produit et documents `README.md`, `docs/pilotage`, `docs/adr`, `reporting` |
| **Issues** | **54 exigences** (`type:exigence`) et **85 tâches** (`type:tache`) ; responsable, heures, statut, lien PR |
| **Pull requests** | Faire relire, tester et intégrer les changements |
| **Actions** | Montrer les tests unitaires/E2E et déploiements ; différencier `success` de `skipped` |
| **Projects** | Tableau commun à configurer dans l'interface, une fois la revue de la structure faite |
| **Security** | Dépendances, alertes, scans et règles si activés |
| **Insights** | Activité et contributions : **pas** un taux de réalisation produit |
| **Wiki** | Non utilisé : pages de référence déjà versionnées dans `docs/` |

## Filtres utilisables dès maintenant
- [Exigences ouvertes](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Atype%3Aexigence)
- [Tâches ouvertes](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Atype%3Atache)
- [Urgences P0](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Aprio%3AP0)
- [Pôle backend](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Apole%3Abackend)
- [Pôle frontend](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Apole%3Afrontend)
- [Campus 2.5D](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Apole%3Acampus)
- [En cours](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Aetat%3Aen-cours)
- [À relire](https://github.com/epiverse-epitech/epiverse/issues?q=is%3Aissue+is%3Aopen+label%3Aetat%3Aen-revue)

## GitHub Project à créer dans l'interface
**Nom :** `EpiVerse — Pilotage et Livraison`

**Statuts :** Backlog / Prête / En cours / Bloquée / En revue / À valider / Terminée.

**Champs :** responsable (Assignees), priorité, pôle, phase (FU2/S9/FU3/S10/Futur), estimation initiale (h), réel (h), reste (h), date cible. Les **exigences** peuvent être séparées de la **charge de travail** par type.

**Vues :** `Équipe/Kanban`, `Priorités P0`, `Par personne`, `Exigences à valider`, `Roadmap`, `FU2/FU3`, `Qualité et sécurité`.

**Limite technique :** la connexion GitHub disponible ici permet d'écrire dans le dépôt et les issues, mais n'expose pas la création des Projects V2. Le Project reste à créer depuis l'interface GitHub ; les labels sont déjà prêts.
