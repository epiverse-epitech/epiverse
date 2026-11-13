# Dépôt Tech officiel — action P0 à finaliser

**Identifiant confirmé par la direction du projet :** `T-ESP-901-LYN-9-1-T-ESP-901-15`.

**Organisation probable selon le workflow déjà existant :** `EpitechMscProPromo2027`. **URL à vérifier** avec les droits GitHub du dépôt privé ; la recherche du connecteur ne retrouve aucun dépôt correspondant. Il serait faux de prétendre que le code y a été poussé.

Dépôt de développement accessible : [epiverse-epitech/epiverse](https://github.com/epiverse-epitech/epiverse). Il **ne remplace pas** la livraison au dépôt scolaire.

## Procédure sûre

1. Ouvrir le dépôt scolaire dans le compte GitHub ayant accès ; vérifier le propriétaire et l'URL SSH exacts.
2. Vérifier qu'il contient déjà des branches ou commits : `git ls-remote <URL_SSH> HEAD refs/heads/main refs/heads/develop`.
3. Sur une machine autorisée, cloner le dépôt d'équipe avec tout l'historique, puis ajouter un remote `epitech` ; **ne pas utiliser `--force`**.
4. Si le dépôt scolaire est vide ou les historiques compatibles, pousser `develop`, `main` et les tags. En cas d'historiques divergents, analyser avant toute écriture.
5. Configurer dans le dépôt d'équipe **Actions variable** `EPITECH_REPO` = URL SSH exacte et **Actions secret** `EPITECH_MIRROR_SSH_KEY` = clé de déploiement autorisée. Le workflow [mirror.yml](../../.github/workflows/mirror.yml) ne s'exécute que si la variable est renseignée.
6. Déclencher `Miroir Epitech`, relever URL du run **success** et SHA sur le dépôt scolaire, puis joindre les preuves à [#103](https://github.com/epiverse-epitech/epiverse/issues/103).

Exemple de commandes **à adapter après vérification** :

```bash
git clone git@github.com:epiverse-epitech/epiverse.git
cd epiverse
git remote add epitech git@github.com:EpitechMscProPromo2027/T-ESP-901-LYN-9-1-T-ESP-901-15.git
git ls-remote epitech
git push epitech develop
git push epitech main
git push epitech --tags
git ls-remote epitech refs/heads/develop refs/heads/main
```

**Important :** ces commandes ne sont **pas** la preuve d'une exécution. Un run `skipped` n'est pas un push réussi. Le travail documentaire de la [PR #147](https://github.com/epiverse-epitech/epiverse/pull/147) n'atteindra `develop` et le miroir qu'après revue et fusion.
