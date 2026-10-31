# Données de la plateforme 2D (MongoDB)

Équipe Data & IA (Thomas, Lina, Belaid), 09/10/2026.

La plateforme 2D donne un personnage à chaque utilisateur. Pour qu'il le retrouve tel qu'il l'a laissé (même carte, même endroit, même apparence), son état est enregistré dans MongoDB, dans une base à part : `epiverse_world`. Elle est sur le même serveur que la base de l'IA (`epiverse_ai`) mais n'a ni le même usage ni les mêmes règles.

| | |
|---|---|
| Service | `mongo` dans `docker-compose.yml` |
| Base | `epiverse_world` |
| Collections | `maps`, `characters` |
| Création | `infra/mongo/init/02-world.js`, joué au premier démarrage, rejouable |
| Connexion locale | `mongodb://epiverse:epiverse_dev@localhost:27017/epiverse_world?authSource=admin` |

Sur une installation locale qui date d'avant ce script, le jouer une fois à la main (commande en tête du fichier).

## `characters` : un personnage par utilisateur

```json
{
  "user_public_id": "0261c87a-a15c-459a-af8c-a888b1f81ad9",
  "display_name": "Eva D.",
  "appearance": { "sprite": "student-02", "hair": "short-brown", "outfit": "hoodie-blue" },
  "position": { "map_id": "campus-hub", "x": 48.89, "y": 31.99, "direction": "right" },
  "last_seen_at": "2026-09-06T03:34:31Z",
  "created_at": "2025-11-26T18:40:11Z",
  "updated_at": "2026-09-06T03:34:31Z"
}
```

| Champ | Type | Règle |
|---|---|---|
| `user_public_id` | chaîne UUID, obligatoire, unique | `users.public_id` de PostgreSQL. Un seul personnage par utilisateur |
| `display_name` | chaîne de 2 à 30 caractères, obligatoire | Nom affiché au-dessus du personnage |
| `appearance.sprite` | chaîne, obligatoire | Identifiant du personnage de base |
| `appearance.hair`, `outfit`, `accessory` | chaînes, facultatives | Identifiants des éléments choisis. Les valeurs possibles sont définies par l'application |
| `position.map_id` | chaîne, obligatoire | `_id` d'une carte de `maps` |
| `position.x`, `position.y` | nombres ≥ 0, obligatoires | Dernière position connue, en tuiles, décimales autorisées. Origine en haut à gauche |
| `position.direction` | énuméré, obligatoire | `up`, `down`, `left`, `right` |
| `last_seen_at` | date, obligatoire | Date de la dernière position enregistrée |
| `created_at`, `updated_at` | dates, obligatoires | |

Index : `uq_user` (unique sur `user_public_id`) et `idx_map_last_seen` (`position.map_id`, `last_seen_at` décroissant) pour savoir qui était sur une carte récemment.

## `maps` : les cartes

```json
{
  "_id": "campus-hub",
  "name": "Hall du campus",
  "width": 60, "height": 40, "tile_size": 32,
  "spawn": { "x": 30, "y": 38, "direction": "up" },
  "is_active": true,
  "created_at": "2025-10-14T00:00:00Z"
}
```

`_id` est un identifiant lisible (minuscules, chiffres, tirets). `width` et `height` sont en tuiles, `tile_size` en pixels. `spawn` est l'endroit où apparaît un personnage qui arrive sur la carte. Le dessin de la carte (tuiles, décors, collisions) reste dans les fichiers de l'application : cette collection ne décrit que ce dont le serveur a besoin.

## Fonctionnement prévu

- **Première connexion** : l'API crée le personnage au point d'apparition de la carte par défaut.
- **Pendant la session** : les déplacements passent en temps réel (WebSocket, positions des connectés dans Redis). On n'écrit pas dans MongoDB à chaque pas.
- **Enregistrement** : la position est écrite dans `characters` à la déconnexion, au changement de carte, et toutes les 30 secondes environ pour ne rien perdre en cas de coupure.
- **Retour** : l'API relit le personnage et le replace à `position`. Si la carte n'existe plus ou est désactivée, il repart du point d'apparition de la carte par défaut.

MongoDB ne vérifie pas que `map_id` existe ni que la position est dans les limites de la carte : c'est à l'API de le faire.

## Données personnelles

- Le personnage est visible des autres utilisateurs : la clé est donc `users.public_id` (identifiant public), jamais `users.id`, l'e-mail ou `pseudonym_id`, qui est réservé à l'IA. Les deux bases MongoDB ne doivent pas pouvoir être recoupées.
- Seule la **dernière** position est gardée, pas l'historique des déplacements. Un historique serait du suivi d'activité : il demanderait un consentement et une durée de conservation.
- `display_name` : le choix du nom (prénom, pseudo libre) et le respect de `users.visibility` sont à décider avec le back et le front.
- Suppression du compte : l'API supprime le personnage (`db.characters.deleteOne({ user_public_id: "<uuid>" })`).

## Reste à faire

- Valider les champs `appearance` et l'unité des positions avec le front (Philimon, Julien).
- Staging et production : même point que pour la base de l'IA (service MongoDB et sauvegarde à ajouter côté serveur).
