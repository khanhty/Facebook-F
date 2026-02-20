const test = require('node:test');
const assert = require('node:assert/strict');
const { InMemoryIdempotencyStore } = require('../src/webhooks/idempotency-store');

test('idempotency claims key once', () => {
  const store = new InMemoryIdempotencyStore();
  assert.equal(store.claim('comment:123'), true);
  assert.equal(store.claim('comment:123'), false);
});
