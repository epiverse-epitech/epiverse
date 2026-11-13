# Definition of Done (DoD) — opérationnelle pour toutes les issues

Une tâche n'est « Done » que si **toutes les cases applicables sont vérifiées** :

- [ ] Résultat attendu décrit en langage simple, et critères d'acceptation vérifiés.
- [ ] Un responsable GitHub identifié ; collaborateurs précisés.
- [ ] Estimation initiale en **heures**, heures réellement effectuées, reste à faire réestimé.
- [ ] Dépendances et risques mis à jour, avec action si risque important.
- [ ] Code et documents versionnés, sans secrets ni données personnelles réelles.
- [ ] Tests ajoutés ou justification explicite si aucun test utile.
- [ ] PR reliée à l'issue, au moins **une revue indépendante** ; deux avis pour sujets sensibles selon DOC-013.
- [ ] CI exigée verte : lint, tests unitaires, E2E/build si applicables, sans « skipped » injustifié.
- [ ] Tests manuels ou démo reproductible sur appareil/environnement indiqué quand la tâche touche l'interface.
- [ ] Documentation et captures adaptées mises à jour.
- [ ] Vérification sécurité/RGPD/accessibilité sur les changements concernés.
- [ ] Approbation du lead technique et validation d'Estelle pour la fonctionnalité/périmètre.
- [ ] Issue fermée et preuve enregistrée (PR, commit, test, démo).

## Fiche obligatoire par issue — estimation, réel, ETC et risques

Une DoD qui décrit seulement l'organisation est insuffisante : il faut **la mesure à l'échelle du ticket**. Copier ce bloc dans chaque issue de réalisation (les exigences seules ne portent pas de double charge).

| Champ | Valeur à renseigner | Règle de preuve |
|---|---|---|
| Issue / lot / exigence | `#...` / `WP...` / `REQ...` | Lien vers les critères métier |
| Responsable | GitHub Assignee + binôme si nécessaire | Responsable de la réalisation et du reporting |
| Estimation initiale (h) | `…` | Valeur historisée, ne pas écraser |
| Temps réellement effectué (h) | `…` ou **NON DÉCLARÉ** | Pointage par la personne ayant travaillé, **jamais déduit des commits** |
| ETC / reste réestimé (h) | `…` | Recalcul à chaque revue |
| EAC / prévision totale (h) | `réel + ETC` si réel connu, sinon **N/A** | Comparer à l'initial |
| Écart prévisionnel (h) | `EAC − initial` si réel connu, sinon **N/A** | Justifier dépassement ou baisse |
| Risque principal | `R-xx`, probabilité 1–5, impact 1–5 | Propriétaire, action, échéance, risque résiduel |
| Dépendances | PR / issues / environnement | Blocages explicites |
| Preuves d'acceptation | PR, reviewer, run CI, test E2E, démo, lien SHA | DoD non validée en l'absence de preuve |

**Exemple strictement fictif** : 8 h initiales, 3 h réellement pointées et 6 h restant → EAC 9 h, écart +1 h. Cet exemple ne constitue aucune donnée EpiVerse.

**Seuil de clôture** : critères acceptés + revue de code indépendante + tests pertinents réussis + risque mis à jour + estimation/réel/ETC renseignés (ou `N/A` justifié pour un ticket sans développement). Aucun statut « Done » sur simple déclaration orale.

Voir [reste à faire par issue](reste-a-faire.md), [risques](risques.md), [preuve et revue](preuves.md), et [contrôle académique](REMISE-PEDAGOGUE-FU2.md).

## Règles sur les heures
- **Estimé initial** : hypothèse retenue au démarrage, non modifiée silencieusement.
- **Réel** : heures effectivement déclarées par le membre, jamais générées à partir de commits.
- **Reste** : estimation du travail restant, remise à jour après chaque revue.
- **Prévu / réel** : montrer l'écart, expliquer si le reste augmente.
- Un ticket non démarré peut avoir **0 h déclarée** si confirmé ; sinon indiquer « non renseigné » plutôt qu'inventer.

## Conditions de revue
- L'auteur ne s'approuve pas lui-même.
- Pour sécurité/auth/accès/données/déploiement : revue du lead + Estelle ou Ousmane selon domaine.
- Un pipeline vert n'implique pas automatiquement que le métier fonctionne.
- Si bug critique, restauration/sécurité non maîtrisée ou tests essentiels ignorés : ne pas fusionner.
