// EpiVerse — base MongoDB de l'IA : collection user_interactions.
//
// Exécuté par l'image mongo au premier démarrage (volume vide). Rejouable sans risque :
//   docker compose exec mongo mongosh -u epiverse -p epiverse_dev --authenticationDatabase admin \
//     epiverse_ai /docker-entrypoint-initdb.d/01-user-interactions.js
//
// Les valeurs de target_type et action reprennent les types énumérés de docs/database/schema.sql :
// les modifier aux deux endroits. Description complète : docs/ia/Stockage_interactions_MongoDB.md

const COLLECTION = 'user_interactions';
// Default from the documented privacy policy. Reject zero (immediate purge),
// malformed and excessive durations before changing collections or TTL indexes.
const MAX_RETENTION_DAYS = 395;
const retentionInput = process.env.INTERACTION_RETENTION_DAYS ?? '395';
if (!/^[1-9][0-9]*$/.test(retentionInput)) {
  throw new Error('INTERACTION_RETENTION_DAYS must be a positive integer');
}
const retentionDays = Number(retentionInput);
if (!Number.isSafeInteger(retentionDays) || retentionDays > MAX_RETENTION_DAYS) {
  throw new Error(`INTERACTION_RETENTION_DAYS must be between 1 and ${MAX_RETENTION_DAYS}`);
}
const retentionSeconds = retentionDays * 24 * 60 * 60;

const validator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['user_pseudonym_id', 'target_type', 'target_id', 'action', 'created_at'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      user_pseudonym_id: {
        bsonType: 'string',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        description: 'users.pseudonym_id (UUID en minuscules) : jamais users.id ni l\'e-mail',
      },
      target_type: {
        enum: ['post', 'resource', 'event', 'company', 'association', 'job_offer', 'user', 'message'],
      },
      target_id: {
        bsonType: ['int', 'long'],
        minimum: 1,
        description: 'id PostgreSQL de l\'élément visé',
      },
      action: {
        enum: ['view', 'click', 'save', 'share', 'dismiss', 'register', 'apply', 'mentoring_request'],
      },
      context: {
        bsonType: 'object',
        additionalProperties: false,
        description: 'clés autorisées uniquement, aucun contenu personnel',
        properties: {
          source: { enum: ['feed', 'search', 'recommendation', 'notification', 'profile', 'direct'] },
          position: { bsonType: ['int', 'long'], minimum: 0 },
          recommendation_id: { bsonType: ['int', 'long'], minimum: 1 },
          model_version: { bsonType: 'string', maxLength: 50 },
          platform: { enum: ['web', 'ios', 'android'] },
          dwell_ms: { bsonType: ['int', 'long'], minimum: 0 },
        },
      },
      created_at: { bsonType: 'date' },
    },
  },
};

const exists = db.getCollectionNames().includes(COLLECTION);
if (exists) {
  db.runCommand({ collMod: COLLECTION, validator, validationLevel: 'strict', validationAction: 'error' });
} else {
  db.createCollection(COLLECTION, { validator, validationLevel: 'strict', validationAction: 'error' });
}

const interactions = db.getCollection(COLLECTION);

// Historique d'un étudiant (construction du profil, effacement RGPD).
interactions.createIndex({ user_pseudonym_id: 1, created_at: -1 }, { name: 'idx_user_time' });
// Popularité et co-occurrences par élément.
interactions.createIndex({ target_type: 1, target_id: 1, created_at: -1 }, { name: 'idx_target_time' });

// Purge automatique après la durée de conservation (NFR-PRIV-001).
const ttl = interactions.getIndexes().find((index) => index.name === 'ttl_created_at');
if (!ttl) {
  interactions.createIndex({ created_at: 1 }, { name: 'ttl_created_at', expireAfterSeconds: retentionSeconds });
} else if (ttl.expireAfterSeconds !== retentionSeconds) {
  db.runCommand({ collMod: COLLECTION, index: { name: 'ttl_created_at', expireAfterSeconds: retentionSeconds } });
}

print(`[epiverse] ${db.getName()}.${COLLECTION} ${exists ? 'mise à jour' : 'créée'} — conservation : ${retentionDays} jours`);
