const test = require('node:test');
const assert = require('node:assert/strict');
const { parseLiveComment } = require('../src/domain/comment-parser');

test('parses basic F syntax', () => {
  const result = parseLiveComment('F 12 x2');
  assert.equal(result.type, 'order');
  assert.equal(result.sku, '12');
  assert.equal(result.qty, 2);
});

test('parses thai quantity syntax', () => {
  const result = parseLiveComment('เอา 12 2ชิ้น');
  assert.equal(result.type, 'order');
  assert.equal(result.qty, 2);
});

test('detects question', () => {
  const result = parseLiveComment('มีไซส์ L ไหม');
  assert.equal(result.type, 'question');
});
