// EpiVerse — base MongoDB de la plateforme 2D : collections maps et characters.
//
// Exécuté par l'image mongo au premier démarrage (volume vide). Rejouable sans risque :
//   docker compose exec mongo mongosh -u epiverse -p epiverse_dev --authenticationDatabase admin \
//     /docker-entrypoint-initdb.d/02-world.js
//
// Description complète : docs/database/Plateforme_2D_MongoDB.md

const world = db.getSiblingDB('epiverse_world');

const coordinate = { bsonType: ['int', 'long', 'double'], minimum: 0 };
const direction = { enum: ['up', 'down', 'left', 'right'] };
const mapId = { bsonType: 'string', pattern: '^[a-z0-9]+(-[a-z0-9]+)*$', maxLength: 50 };

const collections = {
  maps: {
    bsonType: 'object',
    required: ['_id', 'name', 'width', 'height', 'tile_size', 'spawn', 'is_active', 'created_at'],
    additionalProperties: false,
    properties: {
      _id: mapId,
      name: { bsonType: 'string', minLength: 1, maxLength: 100 },
      width: { bsonType: ['int', 'long'], minimum: 1, description: 'en tuiles' },
      height: { bsonType: ['int', 'long'], minimum: 1, description: 'en tuiles' },
      tile_size: { bsonType: ['int', 'long'], minimum: 1, description: 'côté d\'une tuile en pixels' },
      spawn: {
        bsonType: 'object',
        required: ['x', 'y', 'direction'],
        additionalProperties: false,
        properties: { x: coordinate, y: coordinate, direction },
        description: 'point d\'apparition d\'un personnage qui arrive sur la carte',
      },
      is_active: { bsonType: 'bool' },
      created_at: { bsonType: 'date' },
    },
  },
  characters: {
    bsonType: 'object',
    required: ['user_public_id', 'display_name', 'appearance', 'position', 'last_seen_at', 'created_at', 'updated_at'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      user_public_id: {
        bsonType: 'string',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        description: 'users.public_id (UUID en minuscules) : un seul personnage par utilisateur',
      },
      display_name: { bsonType: 'string', minLength: 2, maxLength: 30, description: 'nom affiché au-dessus du personnage' },
      appearance: {
        bsonType: 'object',
        required: ['sprite'],
        additionalProperties: false,
        properties: {
          sprite: { bsonType: 'string', maxLength: 50, description: 'identifiant du personnage de base' },
          hair: { bsonType: 'string', maxLength: 50 },
          outfit: { bsonType: 'string', maxLength: 50 },
          accessory: { bsonType: 'string', maxLength: 50 },
        },
      },
      position: {
        bsonType: 'object',
        required: ['map_id', 'x', 'y', 'direction'],
        additionalProperties: false,
        properties: { map_id: mapId, x: coordinate, y: coordinate, direction },
        description: 'dernière position connue, en tuiles (décimales autorisées)',
      },
      last_seen_at: { bsonType: 'date', description: 'date de la dernière position enregistrée' },
      created_at: { bsonType: 'date' },
      updated_at: { bsonType: 'date' },
    },
  },
};

const existing = world.getCollectionNames();
for (const [name, schema] of Object.entries(collections)) {
  const options = { validator: { $jsonSchema: schema }, validationLevel: 'strict', validationAction: 'error' };
  if (existing.includes(name)) {
    world.runCommand({ collMod: name, ...options });
  } else {
    world.createCollection(name, options);
  }
}

// Un personnage par utilisateur ; retrouver le sien à la connexion.
world.characters.createIndex({ user_public_id: 1 }, { name: 'uq_user', unique: true });
// Qui était sur une carte, du plus récent au plus ancien.
world.characters.createIndex({ 'position.map_id': 1, last_seen_at: -1 }, { name: 'idx_map_last_seen' });

print(`[epiverse] ${world.getName()} : collections ${Object.keys(collections).join(', ')} prêtes`);
