# Infra EpiVerse — environnements dev, staging et production

Responsable : Baye Ousmane Beye (plateforme & qualité), avec Estelle Giroud (DevOps / sécurité).
Références : DOC-013 (plan qualité), DOC-014 (architecture technique), WBS WP3.2 et WP10.2, jalon G2 « Fondations » du 27/10/2026.

| Environnement | Où | Adresse | Données autorisées |
|---|---|---|---|
| Dev (local) | Ta machine, Docker Compose | `localhost` | Fictives |
| Staging | Serveur cloud européen (Scaleway DEV1-M prévu au budget DOC-009) | `https://staging.<domaine>` | Démonstration |
| Production / pilote | Même serveur ou un second, activée au gate G6 | `https://<domaine>` | Uniquement celles du pilote validé |

Contenu du kit :

```
docker-compose.yml            environnement local (PostgreSQL, Redis, Adminer, produit complet)
.env.example                  variables locales à copier en .env
.dockerignore / .gitignore    rien de sensible dans les images ni dans Git
infra/docker/                 images de l'API (NestJS) et du web (Expo), config nginx
infra/caddy/Caddyfile.dev     routage local identique au staging
infra/server/                 piles serveur (app + reverse proxy HTTPS), modèles de .env
infra/scripts/                déploiement, sauvegarde, restauration, préparation du serveur
.github/workflows/            CI (ci.yml), déploiement (deploy.yml), miroir vers le dépôt Epitech (mirror.yml)
.github/                      modèle de pull request (DoD), Dependabot, CODEOWNERS
```

---

## 1. Démarrer en local

Prérequis : Docker Desktop et Node.js 24 LTS (la version des images).

```bash
cp .env.example .env          # Windows (cmd) : copy .env.example .env
docker compose up -d          # PostgreSQL sur localhost:5432, Redis sur localhost:6379
```

| Besoin | Commande | Adresse |
|---|---|---|
| Voir la base dans le navigateur | `docker compose --profile tools up -d` | http://localhost:8082 (système PostgreSQL, serveur `postgres`, utilisateur `epiverse`, mot de passe `epiverse_dev`, base `epiverse`) |
| Tout le produit, comme en staging | `docker compose --profile full up -d --build` | http://localhost:8080 (l'API répond sous `/api`) |
| Arrêter (données conservées) | `docker compose down` | |
| Repartir d'une base vide | `docker compose down -v` | |

Par rôle :

- **Back (Eckson)** : dans `apps/api/.env`, mettre `DATABASE_URL=postgresql://epiverse:epiverse_dev@localhost:5432/epiverse?schema=public` et `REDIS_URL=redis://localhost:6379`, puis `npm run start:dev`.
- **App (Philimon, Julien)** : `npx expo start`, puis `w` pour le web (http://localhost:8081). Sur téléphone avec Expo Go, `localhost` désigne le téléphone : mettre `EXPO_PUBLIC_API_URL=http://<IP-du-PC>:3000/api` dans `apps/app/.env`.
- **Data / IA (Thomas, Lina, Belaid)** : Adminer ou DBeaver sur `localhost:5432`. Le schéma validé devient le schéma Prisma du back avec ses migrations : c'est ce qui garantit une base identique en dev, en staging et en production.

---

## 2. Contrat entre l'infra et les applications

Le kit fonctionne si les applications respectent ces points (vérifiés sur une app NestJS 12 et une app Expo SDK 57) :

| Application | Règle |
|---|---|
| API | Écoute sur `process.env.PORT` (3000 par défaut) avec `app.setGlobalPrefix('api')` |
| API | `GET /api/health` répond 200 : c'est le contrôle de santé des conteneurs et du déploiement |
| API | Lit `DATABASE_URL` et `REDIS_URL` ; `npm run build` produit `dist/main.js` ; schéma Prisma dans `apps/api/prisma/` |
| Base | PostgreSQL 17 avec pgvector disponible (colonnes `VECTOR` du schéma V1) : l'activer dans la première migration avec `CREATE EXTENSION IF NOT EXISTS vector;` |
| App | Appelle l'API via `process.env.EXPO_PUBLIC_API_URL` (vaut `/api` sur le web : même domaine, pas de CORS) |
| App | `npx expo export --platform web` passe ; lancer `npx expo lint` une fois en local et commiter `eslint.config.js` |
| Les deux | npm, avec `package-lock.json` commité |

Route de santé NestJS (5 lignes) :

```ts
// main.ts
app.setGlobalPrefix('api');

// app.controller.ts
@Get('health')
health() {
  return { status: 'ok' };
}
```

Dossiers : `apps/api` et `apps/app` par défaut. Si le squelette en utilise d'autres, changer `API_DIR` et `APP_DIR` dans `.env.example`, dans le bloc `env` de `ci.yml` et de `deploy.yml`, et le chemin npm de `dependabot.yml`.

---

## 3. CI/CD

**`ci.yml`** tourne à chaque pull request et à chaque push sur `main` et `develop`. Un job ne se lance que si l'application existe déjà.

| Job | Contrôles |
|---|---|
| Détection des applications | Repère l'API et l'app dans le dépôt |
| Recherche de secrets | gitleaks sur tout l'historique : un secret commité bloque la PR |
| API — lint, tests, build | Lint, tests unitaires, tests e2e sur un PostgreSQL et un Redis de test, build, audit (faille critique = bloquant) |
| App Expo — lint, types, tests, export web | Lint, TypeScript, tests, export web, audit |
| Images Docker (sur PR) | Construit les deux images pour détecter un Dockerfile cassé avant la fusion |

**`deploy.yml`** :

- push sur `develop` → images publiées sur GitHub Container Registry (tags `sha-xxxxxxx` et `staging`) → déploiement automatique en staging ;
- tag `vX.Y.Z` sur `main` → mêmes étapes vers la production, uniquement si la variable `PRODUCTION_HOST` est renseignée : elle reste vide jusqu'au gate pilote G6, c'est le verrou de la mise en production ;
- lancement manuel possible depuis l'onglet Actions.

Tant que le serveur n'est pas configuré, les images sont publiées et le déploiement est simplement sauté : le workflow reste vert. Le registre d'images de GitHub est gratuit, y compris pour des images privées (GitHub prévient un mois avant tout changement).

**`mirror.yml`** recopie `main`, `develop` et les tags vers le dépôt officiel Epitech à chaque push, historique compris (section 4).

Git (DOC-013) : `main` protégée, `develop` pour l'intégration, branches `feature/<ticket>-<sujet>`, `fix/…`, `docs/…`, commits `type(scope): message` (ex. `feat(events): ajouter le filtre date`).

---

## 4. Organisation GitHub et réglages (une fois, par un propriétaire)

L'organisation `EpitechMscProPromo2027` appartient à Epitech : on y a le droit d'écriture sur nos dépôts, pas l'administration (ni secrets, ni réglages). D'où ce montage :

1. **Une organisation GitHub dédiée, gratuite** (github.com/organizations/plan → Free), avec Estelle et Baye propriétaires et le reste de l'équipe membres. Le dépôt de développement y vit. Une organisation plutôt qu'un compte personnel : sur un compte personnel, les invités n'ont que le droit d'écriture.
2. **Le miroir vers le dépôt officiel Epitech** (`mirror.yml`) garde ce dépôt à jour en continu. Dans Settings → General → Pull Requests, garder « Allow merge commits » : les commits de chacun restent visibles dans le dépôt Epitech, ce qui compte pour l'évaluation individuelle.
3. **Limites de l'offre gratuite pour un dépôt privé** : ni protection de branches, ni environnements GitHub (documentation GitHub, vérifiée le 22/09/2026). Les règles passent donc par l'équipe : jamais de push direct sur `main` ou `develop`, une PR avec CI verte avant chaque fusion. La production est verrouillée par `PRODUCTION_HOST`. Si Epitech autorise un dépôt public, ces protections deviennent gratuites : les activer alors (Settings → Rules → Rulesets : PR obligatoire, pas de force push, contrôles requis `Détection des applications`, `Recherche de secrets`, `API — lint, tests, build`, `App Expo — lint, types, tests, export web`).
4. **Variables** (Settings → Secrets and variables → Actions → Variables) : `EPITECH_REPO` (URL SSH du dépôt officiel, ex. `git@github.com:EpitechMscProPromo2027/<dépôt>.git`), `STAGING_HOST` (IP du serveur), `STAGING_URL`, `DEPLOY_USER` (`deploy`). Au gate G6 seulement : `PRODUCTION_HOST`, `PRODUCTION_URL`.
5. **Secrets** : `DEPLOY_SSH_KEY` (clé privée de déploiement, section 5), `DEPLOY_KNOWN_HOSTS` (sortie de `ssh-keyscan -t ed25519 <IP>`) et `EPITECH_MIRROR_SSH_KEY`.

Mettre en place le miroir :

1. Vérifier que le dépôt Epitech est vide. Sinon, récupérer d'abord son contenu dans notre dépôt : le miroir remplace `main` et `develop`.
2. Créer une clé réservée au miroir : `ssh-keygen -t ed25519 -f epiverse_mirror -C "epiverse-mirror" -N ""`.
3. Donner à la clé publique le droit d'écrire sur le dépôt Epitech. Le mieux est de demander à Epitech (Guillaume) de l'ajouter en « deploy key » avec écriture sur ce seul dépôt. À défaut, l'ajouter au compte GitHub d'un membre de l'équipe (Settings → SSH and GPG keys) : elle a alors les mêmes droits que ce compte. Dans ce cas, la réserver à cet usage et la supprimer en fin de projet.
4. Mettre la clé privée dans le secret `EPITECH_MIRROR_SSH_KEY`, renseigner `EPITECH_REPO`, puis lancer Actions → Miroir Epitech → Run workflow.

Quota : 2 000 minutes d'Actions par mois pour les dépôts privés de l'offre gratuite, largement suffisant au rythme du projet (Settings → Billing pour suivre). Si la publication d'images échoue en 403 : Settings → Actions → General → Workflow permissions.

---

## 5. Mettre en service le staging (environ 1 h)

1. Créer un serveur Ubuntu 24.04 (Scaleway DEV1-M, région Paris) et noter son IP.
2. Créer la clé réservée au déploiement, sur ta machine :
   ```bash
   ssh-keygen -t ed25519 -f epiverse_deploy -C "epiverse-deploy" -N ""
   ```
3. Préparer le serveur (Docker, utilisateur `deploy`, pare-feu, dossiers `/opt/epiverse`) :
   ```bash
   scp infra/scripts/bootstrap-server.sh root@<IP>:
   ssh root@<IP> "bash bootstrap-server.sh '$(cat epiverse_deploy.pub)'"
   ```
4. Choisir le domaine. Sans nom de domaine, `staging.<IP-avec-des-tirets>.sslip.io` fonctionne avec HTTPS (ex. `staging.51-15-10-20.sslip.io`).
5. Installer le reverse proxy HTTPS :
   ```bash
   scp infra/server/docker-compose.edge.yml infra/server/Caddyfile deploy@<IP>:/opt/epiverse/edge/
   ssh deploy@<IP>
   cd /opt/epiverse/edge
   printf 'ACME_EMAIL=%s\nSTAGING_DOMAIN=%s\n' "ton.email@epitech.eu" "staging.51-15-10-20.sslip.io" > .env
   docker compose -f docker-compose.edge.yml up -d
   ```
6. Créer la configuration du staging sur le serveur (depuis ta machine) :
   ```bash
   scp infra/server/env.server.example deploy@<IP>:/opt/epiverse/staging/.env
   scp infra/server/api.env.example deploy@<IP>:/opt/epiverse/staging/api.env
   ```
   Puis sur le serveur : remplir `.env` (mots de passe via `openssl rand -hex 24`, `IMAGE_REGISTRY=ghcr.io/<organisation-en-minuscules>`, `BACKUP_PASSPHRASE`) et `api.env` (secrets via `openssl rand -hex 32`, `CORS_ORIGINS=https://<domaine du staging>`). Garder `BACKUP_PASSPHRASE` aussi dans un gestionnaire de mots de passe.
7. Renseigner les variables et secrets GitHub (section 4), puis pousser sur `develop` : le déploiement part tout seul. Vérifier `https://<domaine>/api/health`. Pour la suite, ajouter la clé publique de déploiement à `/home/deploy/.ssh/authorized_keys` suffit : aucun mot de passe serveur n'est partagé.
8. Planifier la sauvegarde quotidienne (`crontab -e` en tant que `deploy`) :
   ```
   15 3 * * * /opt/epiverse/scripts/backup-db.sh staging >> /opt/epiverse/backups/backup.log 2>&1
   ```

**Production (gate G6 uniquement)** : mêmes étapes avec le dossier `/opt/epiverse/production`, `COMPOSE_PROJECT_NAME=epiverse-production`, `ENV_NAME=production`, `BACKUP_DIR=/opt/epiverse/backups/production`, le bloc production décommenté dans le Caddyfile, `PRODUCTION_DOMAIN` dans `/opt/epiverse/edge/.env`, et enfin les variables `PRODUCTION_*` dans GitHub. Renseigner ces variables vaut feu vert pour la production : c'est la dernière étape, après validation d'Estelle.

---

## 6. Exploitation au quotidien

| Action | Commande (sur le serveur, utilisateur `deploy`) |
|---|---|
| Déployer | Automatique (push sur `develop`) ou Actions → Déploiement → Run workflow |
| Revenir à une version | `bash /opt/epiverse/scripts/deploy.sh staging <tag>` (versions listées dans `/opt/epiverse/staging/deploy-history.log`) |
| Voir les journaux | `cd /opt/epiverse/staging && docker compose -f docker-compose.server.yml logs -f api` |
| État des services | `docker compose -f docker-compose.server.yml ps` |
| Sauvegarder maintenant | `/opt/epiverse/scripts/backup-db.sh staging` |
| Restaurer | `/opt/epiverse/scripts/restore-db.sh staging <fichier.dump.enc>` (demande confirmation) |

Le déploiement fait, dans l'ordre : récupération des images, démarrage de PostgreSQL et Redis, sauvegarde, migrations, nouveaux conteneurs, contrôle de santé. Si l'API ou le web n'est pas sain, il revient seul à la version précédente.

Surveillance minimale (DOC-014 §07) : un contrôle de disponibilité gratuit (UptimeRobot ou équivalent) sur `/api/health` avec alerte e-mail. Sentry et OpenTelemetry viendront après le MVP.

Avant le pilote (gate G6), preuves à produire : une restauration testée en staging et chronométrée (objectif RTO 4 h), la copie des sauvegardes hors du serveur (`BACKUP_RCLONE_REMOTE`), et les règles de protection GitHub actives.

---

## 7. Sécurité en bref

- Aucun secret dans Git : gitleaks bloque la CI ; les `.env` restent sur les machines et le serveur ; `api.env` n'est donné qu'au conteneur de l'API.
- PostgreSQL et Redis ne publient aucun port et vivent sur un réseau interne sans accès à Internet.
- Seuls les ports 22, 80 et 443 sont ouverts ; HTTPS automatique (Let's Encrypt) avec HSTS ; le staging est exclu des moteurs de recherche.
- L'API tourne avec un utilisateur non-root et le web avec nginx non-root ; chaque image a son contrôle de santé.
- Sauvegardes chiffrées (AES-256, dérivation PBKDF2), lisibles seulement par `deploy`, gardées 14 jours.
- Dependabot propose les mises à jour de l'API, des actions GitHub et des images de base.

---

## 8. Décisions techniques à reporter dans le DOC-014

| ADR | Décision | Pourquoi |
|---|---|---|
| ADR-05 | Le web Expo est servi en fichiers statiques sur le même domaine que l'API (`/api`) | Pas de CORS pour le web, une seule image pour tous les environnements |
| ADR-06 | Caddy comme reverse proxy, partagé par staging et production | HTTPS automatique, un seul serveur au départ pour tenir le budget |
| ADR-07 | Images sur GitHub Container Registry avec tags immuables `sha-xxxxxxx`, déploiement par SSH | Chaque version est identifiable et un retour arrière prend une commande |
| ADR-08 | Sauvegarde chiffrée avant chaque migration et chaque nuit | Protège les données lors des déploiements (RPO 24 h) |
| ADR-09 | Développement dans une organisation GitHub dédiée, miroir automatique vers le dépôt officiel Epitech | Droits d'administration pour la CI/CD, dépôt officiel toujours à jour avec l'historique de chacun |
| ADR-10 | PostgreSQL avec pgvector dès le départ | Le schéma V1 stocke des embeddings (`VECTOR`) ; aucune migration d'image à prévoir plus tard |

À noter pour Estelle : le passage à Expo pour le web et le mobile modifie l'ADR-02 (web React/Vite d'abord), à mettre à jour.

---

## 9. Traçabilité

| Référence | Couvert par |
|---|---|
| WP3.2.1 Environnement Docker de développement | `docker-compose.yml`, `.env.example` |
| WP3.2.2 Variables et secrets | modèles `.env`, `api.env`, gitleaks, `.gitignore` |
| WP3.2.3 Intégration continue de base | `.github/workflows/ci.yml` |
| WP3.2.4 Règles Git et revue de code | modèle de PR, CODEOWNERS, section 4 |
| WP3.3.3 Sauvegarde, reprise et observation | `backup-db.sh`, `restore-db.sh`, section 6 |
| WP10.2.2 Gate de démonstration et de release | `deploy.yml`, verrou `PRODUCTION_HOST` |
| WP1.4.1 Registre de preuves | `mirror.yml` : historique complet dans le dépôt officiel Epitech |
| DOC-013 checklists PR et release | `.github/pull_request_template.md`, `deploy.sh` |
| DOC-014 §06, §06.1, §07 | environnements, pipeline, sauvegardes |

---

## 10. Vérifications effectuées (22/09/2026)

| Contrôle | Résultat |
|---|---|
| `docker compose config` : local (tous profils), serveur, reverse proxy | Valides |
| actionlint, shellcheck, hadolint | 0 alerte |
| Caddyfiles (Caddy 2.11) et config nginx (`nginx -t`) | Valides |
| Étapes CI rejouées sous Node 24 sur une app NestJS 12 et une app Expo SDK 57 | Toutes vertes après corrections |
| Point d'entrée de l'API, route `/api/health`, contrôle de santé de l'image | OK (200 ; 1 si la route manque) |
| Routage réel Caddy + nginx + API | `/`, `/explore`, repli sur l'app, `/api/health` OK ; en-têtes de sécurité présents ; bundle JS en cache 1 an et compressé (2,1 Mo → 0,54 Mo) |
| Sauvegarde puis restauration après effacement des données | 3 lignes sur 3 restaurées ; fichier illisible sans la phrase de chiffrement |
| Déploiement : succès, version malade, migration refusée, entrée invalide | Comportement attendu ; retour arrière automatique dans les deux cas d'échec |
| gitleaks sur le kit | Aucun faux positif ; un vrai jeton est bien bloqué |
| Miroir (même logique que `mirror.yml`, dépôts locaux) | `main`, `develop` et tags recopiés ; branches de travail non recopiées ; auteurs conservés ; réécriture de `develop` propagée |

Non vérifié : la construction des images Docker et le démarrage de l'image pgvector (Docker Hub inaccessible depuis l'environnement de test). Le premier passage de la CI sur GitHub les construira : surveiller le job « Images Docker » de la première pull request.
