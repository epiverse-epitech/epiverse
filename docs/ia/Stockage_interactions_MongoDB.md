# Stockage des interactions pour l'IA (MongoDB)

Équipe Data & IA (Thomas, Lina, Belaid), 09/10/2026.

Les interactions des étudiants (vues, clics, enregistrements, partages, rejets) alimentent les recommandations. Elles arrivent en grand nombre, ne sont jamais modifiées et sont lues par lots : elles vont dans une base MongoDB séparée, pour que l'entraînement et les calculs de l'IA ne pèsent pas sur PostgreSQL, qui sert l'application.

| | |
|---|---|
| Service | `mongo` dans `docker-compose.yml` (image `mongo:8.0`) |
| Base | `epiverse_ai` |
| Collection | `user_interactions` |
| Création | `infra/mongo/init/01-user-interactions.js`, joué au premier démarrage, rejouable |
| Connexion locale | `mongodb://epiverse:epiverse_dev@localhost:27017/epiverse_ai?authSource=admin` (variable `MONGO_URL` côté API) |

Si le port 27017 est déjà pris sur ta machine, changer `MONGO_PORT` dans ton `.env`.

## Document

```json
{
  "user_pseudonym_id": "3f2b8c1e-9a4d-4e6f-8b1a-0c2d3e4f5a6b",
  "target_type": "event",
  "target_id": 12,
  "action": "click",
  "context": { "source": "recommendation", "position": 2, "recommendation_id": 40, "platform": "web" },
  "created_at": "2026-10-09T14:32:00Z"
}
```

| Champ | Type | Règle |
|---|---|---|
| `user_pseudonym_id` | chaîne UUID en minuscules, obligatoire | `users.pseudonym_id` de PostgreSQL. Jamais `users.id`, ni e-mail, ni nom |
| `target_type` | énuméré, obligatoire | `post`, `resource`, `event`, `company`, `association`, `job_offer`, `user`, `message` |
| `target_id` | entier, obligatoire | id PostgreSQL de l'élément |
| `action` | énuméré, obligatoire | `view`, `click`, `save`, `share`, `dismiss` |
| `context` | objet, facultatif | Clés autorisées uniquement : `source` (`feed`, `search`, `recommendation`, `notification`, `profile`, `direct`), `position`, `recommendation_id`, `model_version`, `platform` (`web`, `ios`, `android`), `dwell_ms` |
| `created_at` | date, obligatoire | Date de l'interaction |

La collection refuse tout document qui ne respecte pas ce format (champ inconnu, valeur hors liste, type incorrect). Les valeurs de `target_type` et `action` sont celles des types énumérés de `docs/database/schema.sql` : toute évolution se fait aux deux endroits.

## Index

| Index | Usage |
|---|---|
| `idx_user_time` (`user_pseudonym_id`, `created_at` décroissant) | Historique d'un étudiant, effacement |
| `idx_target_time` (`target_type`, `target_id`, `created_at` décroissant) | Popularité, éléments consultés ensemble |
| `ttl_created_at` (`created_at`) | Suppression automatique après la durée de conservation |

## Données personnelles

- **Consentement** : l'API n'écrit une interaction que si l'étudiant a un consentement `interaction_tracking` actif (table `consent`). MongoDB ne peut pas le vérifier.
- **Pseudonymisation** : la base de l'IA ne contient aucune donnée d'identité. Le lien entre `pseudonym_id` et l'étudiant reste dans PostgreSQL.
- **Conservation** : 395 jours par défaut (`INTERACTION_RETENTION_DAYS`), à confirmer avec Estelle (NFR-PRIV-001). Pour changer la durée sur une base existante : modifier la variable, recréer le conteneur (`docker compose up -d mongo`), puis rejouer le script de création.
- **Effacement et retrait du consentement** : il n'y a plus de `ON DELETE CASCADE`. L'API doit supprimer les documents de l'étudiant : `db.user_interactions.deleteMany({ user_pseudonym_id: "<uuid>" })`.

## Reste à faire

- Retirer la table `user_interaction` de `schema.sql` (et du futur schéma Prisma) pour ne garder qu'une source.
- Staging et production : ajouter le service à `infra/server/docker-compose.server.yml`, avec sa sauvegarde (`mongodump`) dans `backup-db.sh`, avec Baye et Estelle.
- Écriture des interactions par l'API (module NestJS, après vérification du consentement), avec Eckson.
