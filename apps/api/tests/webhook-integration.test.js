const test = require('node:test');
const assert = require('node:assert/strict');
const { InMemoryIdempotencyStore } = require('../src/webhooks/idempotency-store');
const { createWebhookProcessor } = require('../src/webhooks/processor');

test('duplicate webhook is ignored', async () => {
  const store = new InMemoryIdempotencyStore();
  let count = 0;
  const processor = createWebhookProcessor({
    idempotencyStore: store,
    handler: async () => { count += 1; },
  });

  const event = { idempotencyKey: 'msg-1' };
  await processor.process(event);
  const second = await processor.process(event);

  assert.equal(count, 1);
  assert.equal(second.status, 'duplicate');
});

test('failed events go to dlq after retries', async () => {
  const store = new InMemoryIdempotencyStore();
  const processor = createWebhookProcessor({
    idempotencyStore: store,
    maxRetries: 2,
    handler: async () => { throw new Error('downstream failure'); },
  });

  const result = await processor.process({ idempotencyKey: 'msg-2' });
  assert.equal(result.status, 'dlq');
  assert.equal(processor.dlq.length, 1);
});
