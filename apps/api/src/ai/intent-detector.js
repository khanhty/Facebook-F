const RULES = [
  { intent: "order_status", pattern: /(tracking|สถานะ|order status|พัสดุ)/i },
  { intent: "payment_inquiry", pattern: /(ชำระ|payment|โอน|qr|cod)/i },
  { intent: "shipping_inquiry", pattern: /(shipping|ส่ง|ค่าส่ง|eta|delivery)/i },
  { intent: "order_placement", pattern: /(เอา|want|take|สั่ง|ขอซื้อ)/i },
  { intent: "product_inquiry", pattern: /(ราคา|price|size|ไซส์|สี|stock|มีไหม)/i },
  { intent: "complaint_refund", pattern: /(คืนเงิน|refund|complaint|เสียหาย)/i },
  { intent: "human_handoff", pattern: /(admin|คนจริง|พนักงาน|human)/i },
];

function detectIntent(message) {
  const matched = RULES.find((r) => r.pattern.test(message));
  if (matched) return { intent: matched.intent, source: "rule", confidence: 0.9 };
  return { intent: "unknown", source: "llm_fallback_required", confidence: 0.2 };
}

module.exports = { detectIntent };
