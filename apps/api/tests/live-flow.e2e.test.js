const test = require('node:test');
const assert = require('node:assert/strict');
const { LiveOrderService } = require('../src/domain/live-order-service');

test('live session comment creates pending order and one safe reply', () => {
  const service = new LiveOrderService();
  const result = service.handleComment({
    liveSessionId: 'live_1',
    commentId: 'c_1',
    userId: 'u_1',
    text: 'F 12 x2',
    stockBySku: { '12': 10 },
  });

  assert.equal(result.order.status, 'NEW');
  assert.equal(result.reply.includes('ทักแชท'), true);
  assert.equal(service.replies.length, 1);
});
