# EpiVerse — verrouillage de la chaîne GitHub Actions

## Objectif

Empêcher une mise à jour silencieuse de tags d'actions tierces et vérifier le binaire Gitleaks téléchargé par les runners.

## Références figées — 4 novembre 2026

| Dépendance | Tag vérifié | Commit épinglé |
|---|---|---|
| actions/checkout | v7 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| actions/setup-node | v7 | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| docker/setup-buildx-action | v4 | `f87e5991a6d7451dcb8d9637bfbc97413f497069` |
| docker/login-action | v4 | `81c6f93d4bc991e510b342a00b419b3bb4efc5c6` |
| docker/build-push-action | v7 | `c3c9e263c25d99ce0380d002d59b67737d91b0dc` |

Références vérifiées directement via `https://api.github.com/repos/OWNER/REPO/git/ref/tags/TAG`. Si un tag change, contrôler les notes de version et le commit cible, puis ouvrir une PR de mise à jour avec CI.

**Gitleaks :** version `8.30.1`, archive `gitleaks_8.30.1_linux_x64.tar.gz`, SHA-256
`551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`.
Ce digest a été vérifié auprès de l'API GitHub Release Assets officielle ; l'installation échoue si le contenu téléchargé diffère.

## Contrôles à maintenir

- Pour une mise à jour d'action ou de scanner : nouvelle version, commit SHA vérifié, revue du diff et tests exécutés.
- Toujours définir `permissions: contents: read` par défaut et `packages: write` sur le seul job publiant les images.
- Les PR non fiables ne doivent pas recevoir les clés de déploiement.
- Évaluer les *workflow dependency lockfiles* GitHub lorsque cette fonction est disponible ; ils couvrent mieux les dépendances transitives que le seul SHA pinning.
- Réévaluer les dépendances Docker, les bases Node/Redis/Postgres et les scans d'images (PR #26), puis produire SBOM et attestations pour les releases.
- Lors de la fusion des PR parallèles, épingler également les nouveaux fichiers de workflow introduits par #25, #29, #30 et #35.
