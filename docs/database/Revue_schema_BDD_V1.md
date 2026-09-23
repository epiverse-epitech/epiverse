# Revue du schéma BDD V1 (Epiverse_DB_ERP_V1)

Relecture plateforme, sécurité et exigences — Baye (DevOps / Sécurité), 22/09/2026.
Référentiels : DOC-007 (tableau MoSCoW v1.1), DOC-014 (architecture), DOC-013 (qualité).

Bonne base : topics hiérarchiques et tables de liaison propres, `TIMESTAMPTZ` partout, suppression logique sur `user`, mot de passe stocké haché, contenus avec statut, et une partie IA déjà pensée pour être mesurable (`model_version`, `feedback`).

## 1. À corriger avant la première migration

| Point | Problème | Proposition |
|---|---|---|
| Table `user` | Mot réservé de PostgreSQL : `CREATE TABLE user` échoue. Créée entre guillemets, `SELECT id FROM user` renvoie une erreur trompeuse (testé) | Renommer en `users` |
| Identifiants `BIGINT` | Prisma les renvoie en `BigInt` et NestJS plante à la conversion JSON (« Do not know how to serialize a BigInt », testé) | `INT` auto-incrémenté, ou UUID pour les identifiants visibles dans les URL (pas d'identifiants devinables) |
| Colonnes `VECTOR` | Demandent l'extension pgvector | Fait côté infra : l'image PostgreSQL du kit inclut pgvector. Première migration : `CREATE EXTENSION IF NOT EXISTS vector;`. Prisma ne gère pas ce type : `Unsupported("vector")` et requêtes SQL. Fixer la dimension, ou un index par modèle si plusieurs modèles |
| Types énumérés | `content_status`, `event_status`, `user_event_status`, `topic_source`, `target_type`, `interaction_action`, `reco_feedback` sont utilisés mais pas définis | Lister leurs valeurs (enums Prisma) |
| Contraintes | E-mail non unique ; tables de liaison sans clé | E-mail unique sans tenir compte de la casse ; clé primaire composée sur chaque table de liaison ; `UNIQUE(user_id, event_id)` ; `topic.slug` unique |
| Auteur des contenus | `event` et `resource` n'ont pas de créateur | Ajouter `created_by` : nécessaire pour « gérer son événement », la modération et le journal |

## 2. Exigences Must du S9 sans table (DOC-007)

| Exigence | À ajouter |
|---|---|
| FR-ASSO-001 à 003 (associations) | `association` et `association_member` avec le rôle de responsable ; lien organisateur entre `event` et l'association |
| FR-AUTH-003 et 004 (sessions, mot de passe oublié), 005 en Should | Sessions révocables, jetons de réinitialisation hachés et limités dans le temps, `email_verified_at`. En table ou dans Redis, à trancher avec Eckson (DOC-014 §04) |
| FR-ROLE-001 et 002 (rôles) | Un étudiant peut aussi gérer une association : table `user_role` plutôt qu'un seul `user_type` |
| FR-PRO-002 (visibilité du profil) | Champ `visibility` sur le profil, privé par défaut (NFR-PRIV-002) |
| FR-NOT-001 (notifications), 002 en Should | `notification` (lu/non lu, lien vers l'élément) et préférences |
| FR-MEN-001 et 002 (mentorat) | Profil mentor volontaire et `mentoring_request` |
| FR-CAR-001 et 002 (offres) | `job_offer` liée à `company` |
| FR-MOD-001 et 002 (signalements) | `report` : élément visé, motif, statut, décision |
| FR-ADM-003 (journal des décisions sensibles) | `audit_log` : qui, quelle action, sur quoi, quand |
| FR-SRC-001 (recherche) | Index de recherche plein texte (GIN) sur événements, associations et ressources |

## 3. Données personnelles (RGPD)

- `user_interaction` et `recommendation` relèvent du suivi et du profilage : consentement explicite (table `consent` : finalité, date, retrait), désactivés par défaut, identifiants pseudonymisés quand c'est possible (DOC-014 §08).
- Durée de conservation à fixer avec Estelle (NFR-PRIV-001), avec purge automatique des interactions. Limiter `context` (JSONB) à une liste de clés autorisées, sans contenu personnel.
- Droit à l'effacement : `deleted_at` suivi d'une anonymisation réelle après un délai. Préciser les règles `ON DELETE` (profil, préférences, interactions, recommandations).
- Données de démonstration fictives en dev et en staging (DOC-014 §04).

## 4. Index pour tenir l'objectif de performance (p95 < 300 ms)

PostgreSQL ne crée pas d'index sur les clés étrangères : les ajouter, ainsi que sur `event(datetime_start)`, `news(published_at)`, `user_interaction(user_id, created_at)` et `recommendation(user_id, generated_at)`.

## 5. Mise en place

- Déposer le fichier dans `docs/database/` du dépôt. Entourer le diagramme d'un bloc ```` ```mermaid ```` pour que GitHub l'affiche.
- Le schéma validé devient `schema.prisma` et ses migrations : une seule source, donc la même base en dev, en staging et en production.
- Pour l'essayer en local : `docker compose --profile tools up -d`, puis Adminer sur http://localhost:8082.
