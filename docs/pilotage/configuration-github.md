# GitHub — état des champs et configuration du tableau

**Révision : 13/11/2026.** Cette page sert à vérifier que le champ est **vraiment renseigné dans GitHub**, pas seulement cité dans le texte d'une issue.

## Où se trouve chaque information ?

| Zone de la colonne de droite | État de la reconstruction | Consigne |
|---|---|---|
| **Assignees** | Renseigné sur les issues par GitHub. Pour les tâches de Belaid, Eckson est **référent GitHub temporaire**, pas l'auteur du travail. | Vérifier les identifiants avant toute réattribution définitive. |
| **Labels** | `prio:P0/P1/P2`, `pole:...`, `phase:...`, `etat:...`, `type:exigence/tache/epic/archive` | Filtrer les tâches avec `type:tache` et les besoins avec `type:exigence`. |
| **Type** | Types GitHub **Feature**, **Task**, et éventuellement **Bug** configurés directement dans l'issue. | Le libellé `type:epic` désigne un regroupement, dont le type GitHub natif est `Feature`. |
| **Priority** (champ d'organisation) | **Non complété en natif** à ce jour : la connexion ne récupère pas l'identifiant du champ d'organisation. | En attendant, le label `prio:P0/P1/P2` est la source fiable. Pour renseigner Priority nativement, utiliser les paramètres du champ de l'organisation ou une connexion disposant de la permission `Issue Fields`. |
| **Projects** | Tableau GitHub Project V2 **non encore créé** depuis cette connexion. | Créer le Project commun dans l'interface de l'organisation, puis ajouter les issues. |
| **Milestone** | Six jalons créés et associés, dont FU2, S9/FU3, FU3, S10, Futur et Archives. | Ne pas confondre date du jalon et promesse de livraison. |
| **Relationships** | Hiérarchie parent/sous-issue native **vérifiée**, avec conservation des liens tâches → exigences déjà existants. | #189 préproduction → #192 exigences et #193 tâches ; #190 futur ; #191 archives. |
| **Development** | Ne peut montrer de PR que lorsqu'une PR existe et est réellement reliée. | Ne **pas inventer** de PR pour une tâche future. Références fiables : #45 pour inscription, #147 pour documents. |
| **Notifications** | Préférence **personnelle** du compte GitHub, pas un champ de pilotage. | Chaque utilisateur règle ses notifications ; aucune valeur d'équipe à renseigner. |

## Configurer le Project GitHub (action dans l'interface)
1. Ouvrir [Projects de l'organisation](https://github.com/orgs/epiverse-epitech/projects), puis **New project** → tableau.
2. Nom : **EpiVerse — Pilotage et livraison**.
3. Ajouter les issues de `epiverse-epitech/epiverse`. Dans la vue, filtrer `is:issue`, puis inclure les tâches et exigences.
4. Conserver `Status`, `Assignees`, `Milestone` et **Priority**. Ajouter **Initial (h)**, **Actual (h)**, **Remaining (h)** comme champs de nombre.
5. Vues utiles : **Équipe (Kanban par Status)**, **À faire (P0/P1)**, **Exigences à valider**, **Réalisations par personne**, **Risques et qualité**, **Calendrier**.
6. Automatiser « issue fermée → Done » seulement lorsque la Definition of Done est respectée ; une archive n'est pas un développement terminé.

## Méthode de suivi
- **Exigence** : critères métier + relation vers la ou les tâches. Charge = 0 h supplémentaires pour éviter un double comptage.
- **Tâche** : responsable unique, priorité, estimation, réalisé **déclaré ou reconstitué et identifié**, ETC, risque, preuve.
- **Epic** : regroupement sans heures additionnelles.
- **Archive** : ancien ticket fermé en doublon, avec historique consultable. Pas une réalisation achevée.

## Audit de complétude des métadonnées
Le 13/11 : **163 issues contrôlées, 163 avec responsable, labels, Type et Milestone natifs**. Les relations se répartissent sous #189 (préproduction), #190 (futur), #191 (archives), #192 (exigences) et #193 (tâches non déjà rattachées à une exigence). Les 3 regroupements racines n'ont pas de parent, ce qui est volontaire.

[Inventaire CSV des 163 issues](../../reporting/inventaire-issues-2026-11-13.csv).

## Chiffres de travail
- **85 tâches** de réalisation ; **54 exigences** historiques actives ; **19 archives**.
- **Estimation d'origine : 1 212 h** ; **réestimation indicative avec IA : 943,5 h** ; **34 h reconstituées** (pas de pointage) ; **reste prévisionnel : 909,5 h**.
- La fiabilité des estimations doit être améliorée par les équipes : les facteurs d'accélération IA sont des hypothèses, pas des économies mesurées.

## Règle de transparence
Une case affichant « No project », « Choose an option » ou une section **Development** sans PR n'est pas une preuve d'exécution. Signaler ce qui reste réellement à configurer, ne jamais annoncer une conformité totale sur la base de descriptions.
