const test = require('node:test');
const assert = require('node:assert/strict');
const { applyStockPolicy, finalizeDeduction } = require('../src/domain/stock-engine');

test('reserve on order policy reserves stock', () => {
  const result = applyStockPolicy({ mode: 'RESERVE_ON_ORDER', stock: 10, qty: 2 });
  assert.equal(result.ok, true);
  assert.equal(result.action, 'RESERVE');
  assert.equal(result.reservation.qty, 2);
});

test('finalize deduction deducts quantity', () => {
  const result = finalizeDeduction({ stock: 10, qty: 3 });
  assert.equal(result.ok, true);
  assert.equal(result.remaining, 7);
});
