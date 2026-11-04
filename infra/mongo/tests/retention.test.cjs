'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const initScript = fs.readFileSync(
  path.resolve(__dirname, '../init/01-user-interactions.js'),
  'utf8',
);

function initialize(retentionValue) {
  const indexes = [];
  const collection = {
    createIndex(keys, options) { indexes.push({keys, options}); },
    getIndexes() { return []; },
  };
  const db = {
    getCollectionNames() { return []; },
    createCollection() {},
    getCollection() { return collection; },
    getName() { return 'epiverse_ai'; },
  };
  const env = retentionValue === undefined
    ? {} : { INTERACTION_RETENTION_DAYS: retentionValue };
  vm.runInNewContext(initScript, {
    db,
    print() {},
    process: { env },
  });
  return indexes.find(x => x.options.name === 'ttl_created_at')?.options.expireAfterSeconds;
}

test('default retention is 395 days', () => {
  assert.equal(initialize(undefined), 395 * 24 * 60 * 60);
});
test('a valid shorter retention is applied', () => {
  assert.equal(initialize('30'), 30 * 24 * 60 * 60);
});
test('rejects dangerous, malformed or excessive TTL values', () => {
  for (const value of ['0', '-1', '-30', 'abc', '1.5', '', ' 20', '100000', '396', 'Infinity', '01']) {
    assert.throws(() => initialize(value), /INTERACTION_RETENTION_DAYS/);
  }
});
