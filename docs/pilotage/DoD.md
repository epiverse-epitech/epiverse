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
