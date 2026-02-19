const { parseLiveComment } = require('./comment-parser');

class LiveOrderService {
  constructor() {
    this.orders = [];
    this.replies = [];
  }

  handleComment({ liveSessionId, commentId, userId, text, stockBySku }) {
    const parsed = parseLiveComment(text, { keyword: 'F' });
    if (parsed.type !== 'order') {
      return { parsed, order: null, reply: null };
    }

    const available = stockBySku[parsed.sku] || 0;
    if (available < parsed.qty) {
      const reply = `ขออภัย สินค้า ${parsed.sku} หมดชั่วคราว ทักแชทเพื่อดูตัวเลือกใกล้เคียงได้เลยค่ะ`;
      this.replies.push({ commentId, reply });
      return { parsed, order: null, reply };
    }

    const order = {
      id: `ord_${this.orders.length + 1}`,
      liveSessionId,
      userId,
      status: 'NEW',
      items: [{ sku: parsed.sku, qty: parsed.qty }],
      sourceCommentId: commentId,
    };
    this.orders.push(order);
    const reply = `รับออเดอร์ ${parsed.sku} x${parsed.qty} แล้วค่ะ กรุณาทักแชทเพื่อยืนยันชื่อ/ที่อยู่`;
    this.replies.push({ commentId, reply });
    return { parsed, order, reply };
  }
}

module.exports = { LiveOrderService };
