# EpiVerse — registre de contrôle de sécurité (état au 04/11/2026)

**Périmètre** : dépôt privé `epiverse-epitech/epiverse`, `main`, `develop`, GitHub Actions, NestJS, PostgreSQL/Prisma, Redis, MongoDB, Expo et serveur Docker/Caddy.

**Statuts** :
- `VÉRIFIÉ` : code, métadonnées GitHub ou journal CI directement contrôlés.
- `PR` : correction proposée et non fusionnée.
- `À CONFIGURER` : action de propriétaire GitHub/serveur indispensable.
- `À TESTER` : preuve d'exécution ou de sécurité encore absente.

| ID | Contrôle | État | Preuve, action ou ticket |
|---|---|---|---|
| GH-01 | Main/develop : PR obligatoire et checks requis | À CONFIGURER | À activer dans les règles GitHub avant toute fusion ou déploiement |
| GH-02 | Protection force-push et suppression de branches | À CONFIGURER | À activer dans les règles GitHub avant toute fusion ou déploiement |
| GH-03 | CODEOWNERS avec comptes valides | PR | #9 |
| GH-04 | Revue indépendante sécurité et données | À CONFIGURER | #11 ; règles dans CONTRIBUTING.md |
| GH-05 | MFA, permissions des membres et GitHub Apps | À CONFIGURER | #11 |
| GH-06 | Secret scanning / push protection natifs | À CONFIGURER | Vérifier disponibilité du forfait dans Security and quality |
| GH-07 | CodeQL ou SAST équivalent | À CONFIGURER | #17 ; GitHub Code Security peut nécessiter une licence |
| GH-08 | Dependabot updates | VÉRIFIÉ | .github/dependabot.yml (API/Actions/Docker) |
| GH-09 | Projets, jalons et traçabilité exigences | À TESTER | GitHub Projects non inspectable via le connecteur utilisé |
| CI-01 | Tests unitaires, e2e, lint, build | VÉRIFIÉ | .github/workflows/ci.yml, runs réussis |
| CI-02 | Gitleaks sur l'historique | VÉRIFIÉ | .github/workflows/ci.yml |
| CI-03 | Publication après succès de la CI | PR | #8 |
| CI-04 | Audit npm élevé et critique | PR | #8 |
| CI-05 | Validation Bash, Python, Docker Compose | PR | #8 |
| CI-06 | Scans images, IaC, SBOM, provenance | À CONFIGURER | #17 |
| CI-07 | Actions et images épinglées à des digests | À CONFIGURER | #17 |
| CD-01 | Production non déclenchable par un tag | PR | #20 vers main, #8 vers develop |
| CD-02 | Approbation gate G6 | À CONFIGURER | #13 |
| CD-03 | Déploiement de la version testée | PR | #8 ; staging à vérifier sur serveur |
| CD-04 | Miroir Epitech sans force-push | PR | #8 |
| CD-05 | Test rollback application + migration | À TESTER | #13 |
| API-01 | Masquage HTTP 5xx et format d'erreur | PR | #7 |
| API-02 | Validation requêtes et rejets champs inconnus | VÉRIFIÉ | PR #4 fusionnée |
| API-03 | Authentification et vérification des rôles | À CONFIGURER | #18 |
| API-04 | Rate limiting, sessions, MFA | À CONFIGURER | #18 |
| API-05 | Swagger prod et en-têtes HTTP | À TESTER | #18 et revue du front |
| DB-01 | Schéma Prisma et migration 0_init | VÉRIFIÉ | 42 tables ; journal CI |
| DB-02 | Utilisateur applicatif sans DDL | À CONFIGURER | #12 |
| DB-03 | Dérive du schéma et migration non destructrice | À TESTER | #12, #13 |
| DATA-01 | Import destructif protégé | PR | #10 |
| DATA-02 | Source de vérité unique interactions | À CONFIGURER | #15 |
| DATA-03 | Consentement/effacement audités | À CONFIGURER | #15 |
| DATA-04 | MongoDB et sa sauvegarde serveur | À CONFIGURER | #16 |
| BACKUP-01 | Chiffrement sauvegarde PostgreSQL | VÉRIFIÉ | infra/scripts/backup-db.sh |
| BACKUP-02 | Copie distante obligatoire en production | PR | #10 |
| BACKUP-03 | Restauration vérifiée (RTO/RPO) | À TESTER | #16 et #19 |
| INFRA-01 | Docker non-root et réseau DB non exposé | VÉRIFIÉ dans la configuration | infra/docker et infra/server |
| INFRA-02 | Images minimales et scan vulnérabilités | À CONFIGURER | #17 |
| INFRA-03 | Monitoring, traces, alertes et readiness | À CONFIGURER | #19 |
| FRONT-01 | Web/mobile fonctionnels et testés | À CONFIGURER | #14 |
| FRONT-02 | Politique CSP, permissions navigateur et UX auth | À TESTER | Après intégration de l'application |

## Ordre de validation

1. Revoir les PR #20, #7, #8, #9 et #10 ; ne pas confondre CI verte et preuve de déploiement.
2. Configurer les protections GitHub et l'IAM organisation ; ne pas rendre le dépôt public pour contourner un forfait.
3. Déployer le client web minimum, séparer les rôles SQL et vérifier le staging.
4. Compléter sauvegardes, restauration, consentements/RGPD, SAST et supervision.
5. Lever la désactivation de production uniquement après le gate G6 avec approbations traçables.

Les fonctionnalités GitHub non accessibles au connecteur ne sont **pas** considérées activées ou désactivées sans preuve.
