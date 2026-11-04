# EpiVerse — audit et durcissement de l'organisation GitHub

> État au 4 novembre 2026. Ce document n'atteste **pas** que les réglages sont actifs : les points marqués « à vérifier » doivent être contrôlés dans l'interface par un propriétaire de l'organisation. Ne pas coller de secrets ni d'exports de tokens dans les preuves.

## 1. Périmètre et preuve

- Organisation : `epiverse-epitech` — https://github.com/organizations/epiverse-epitech/settings
- Dépôt privé : https://github.com/epiverse-epitech/epiverse
- La GitHub App connectée à l'organisation peut lire et créer du code/PR, mais ne fournit pas la lecture des membres, équipes, secrets, paramètres Actions ou alertes natives ; ne pas présumer que ces contrôles sont actifs.
- La lecture des branches a retourné `protected: false` pour `main` et `develop` lors de l'audit. Les endpoints de protection/rulesets sont restreints ou non accessibles au connecteur.
- Responsable : propriétaire organisation ; conserver les captures de paramètres **sans jetons, clés, données personnelles ni secrets**.

## 2. Contrôles prioritaires (GitHub Settings)

| Priorité | Zone | Réglage recommandé | Validation attendue |
|---|---|---|---|
| P0 | Organization → Settings → Authentication security | Exiger une MFA forte (passkey, clé FIDO2 ou authenticator), vérifier les membres avant activation | Tous les comptes actifs possèdent une méthode sûre ; les collaborateurs externes ne perdent pas l'accès par surprise |
| P0 | Organization → People / Teams | Deux propriétaires de secours **au maximum nécessaire**, rôles minimaux, aucune identité partagée, revue des collaborateurs externes | Liste des comptes et raisons d'accès revue ; membres hors équipe supprimés après validation |
| P0 | Repository → Settings → Rules | Règles `main` et `develop` : PR, CI requise, interdiction des force-push/suppressions et résolutions de conversations | Tentative de push direct et PR avec gate rouge refusées ; configuration et éventuelle limite de forfait documentées |
| P0 | Organization → Settings → Actions | Jeton `GITHUB_TOKEN` en lecture par défaut ; liste d'actions autorisées ; aucune action non fiable avec secrets | Workflow non approuvé ne reçoit pas d'accès en écriture |
| P0 | Repository → Settings → Secrets and variables | Secrets de staging et production séparés, rotation SSH, secrets limités aux jobs nécessaires | Test du principe du moindre privilège ; aucune valeur sensible exposée |
| P1 | Organization → Third-party access / Installed GitHub Apps | Passer en revue les GitHub Apps, permissions, propriétaires et sélection de dépôts | Seules les applications nécessaires ont accès ; droits excessifs réduits |
| P1 | Repository → Settings → Security and analysis | Dépendances, code scanning, secret scanning/push protection si disponibles dans l'offre | Résultat lisible, outils alternatifs CI si une option native est indisponible |
| P1 | Organization → Settings → Member privileges | Empêcher création publique ou suppression des dépôts par membres ordinaires ; examiner les forks privés | Tests par compte non administrateur |
| P1 | Repository → Settings → Actions → General | Contrôler approbations des workflows de forks et permissions d'écriture ; vérifier workflows réutilisables | Une PR externe ne peut ni publier une image ni lire des secrets |
| P1 | Repository → Settings → General | Activer suppression automatique des branches fusionnées après décision d'équipe | Branches terminées nettoyées, `main`/`develop` protégées |
| P2 | Organization → Audit log | Examiner accès, installations d'applications, changements de rôles et de secrets périodiquement | Audit mensuel tracé dans un ticket interne sans PII |

**Attention MFA :** GitHub peut retirer immédiatement les collaborateurs externes qui ne satisfont pas la politique. Prévenir les personnes concernées et vérifier leur accès avant de la rendre obligatoire.

## 3. Protection des branches — critères techniques

- `main` : uniquement versions validées ; contrôle CI final obligatoire, revue indépendante, verrouillage des commits obsolètes, suppression/force-push interdits.
- `develop` : PR obligatoire ; `CI / Qualité — contrôle final obligatoire` + tests de sécurité pertinents ; ignorer uniquement les jobs justifiés par détection, pas un gate principal.
- Exiger aussi les scans des images et IaC lorsqu'ils sont activés ; s'assurer qu'un check à nom constant ne peut pas être remplacé par un faux job du même nom.
- Les règles sur les comptes administrateurs/bypass doivent faire l'objet d'une décision explicite et tracée.
- Tester les protections avec une branche de test, une PR de test avec contrôle rouge et une tentative de push direct **non destructrice**.
- Si le forfait privé interdit les rulesets : maintenir la discipline manuelle **sans présenter le dépôt comme protégé** ; évaluer une offre adaptée.

## 4. Agents IA et supply chain

- Garder la validation finale des modifications CI/CD, secrets, IAM, releases et SQL hors des agents autonomes.
- Interdire les tokens d'administration dans les environnements d'agents et PR ; revoir les permissions des GitHub Apps.
- Préférer l'épinglage des actions par SHA complet ou les workflow dependency lockfiles après vérification des références officielles.
- Gitleaks et tests sont déjà en place ; vérifier le déploiement de Trivy/IaC (PR #26), les règles de traitement des CVE, la génération des SBOM et la provenance.
- Un contrôle `skipped` peut satisfaire un required check GitHub : exiger un contrôle final **toujours exécuté** qui valide les résultats attendus.

## 5. Sécurité des releases, bases et sauvegardes

- Aucune production tant que gate G6, droits SQL minimum et restauration testée ne sont validés (#12 et #13).
- Releases : image issue du commit validé et promotion idéalement par digest immuable ; validation staging et approbations.
- Sauvegardes : vérifier contenu chiffré, restauration réelle isolée, copie externe, rétention distante, RPO/RTO (#16, PR #25).
- Isoler secrets de migration SQL et compte API, et limiter l'utilisateur de déploiement Docker (accès au démon = privilèges très élevés).

## 6. Registre des décisions

| Contrôle | État | Responsable | Preuve |
|---|---|---|---|
| MFA organisation | À vérifier | Propriétaire de l'organisation | Date et configuration sans données sensibles |
| Rôles équipes | À vérifier | Propriétaire de l'organisation | Revue des rôles |
| Branche `main` | Non protégée à la dernière lecture | Propriétaire du dépôt | Test de push refusé |
| Branche `develop` | Non protégée à la dernière lecture | Propriétaire du dépôt | Test de PR non conforme refusée |
| Policy Actions / GitHub Apps | À vérifier | Propriétaire de l'organisation | Revue des scopes |
| GitHub Advanced Security / scans | À vérifier | Responsable sécurité | Scans et notifications actifs |
| Staging, backup, migration et release G6 | À valider | Plateforme | Tests d'intégration et exercice de restauration |

Références : https://docs.github.com/en/actions/reference/security/secure-use ; https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization
