const test = require('node:test');
const assert = require('node:assert/strict');
const { detectIntent } = require('../src/ai/intent-detector');

test('maps payment inquiry', () => {
  const result = detectIntent('จ่าย QR ได้ไหม');
  assert.equal(result.intent, 'payment_inquiry');
});

test('fallbacks when unknown', () => {
  const result = detectIntent('hello there');
  assert.equal(result.intent, 'unknown');
  assert.equal(result.source, 'llm_fallback_required');
});
