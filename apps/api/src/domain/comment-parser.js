const TAKE_WORDS = ["เอา", "ขໍ", "รับ", "want", "take", "f", "F"];

function normalize(text) {
  return text
    .replace(/[#:,-]/g, " ")
    .replace(/เบอร์/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractQty(normalized) {
  const explicit = normalized.match(/[x*]\s*(\d+)\b/i);
  if (explicit) return Number(explicit[1]);

  const localUnit = normalized.match(/(\d+)\s*(?:ชิ้น|ໂຕ|ອັນ)/i);
  if (localUnit) return Number(localUnit[1]);

  return 1;
}

function parseLiveComment(text, options = {}) {
  const keyword = (options.keyword || "F").toLowerCase();
  const normalized = normalize(text);
  const lower = normalized.toLowerCase();

  const isQuestion = /\?|ไหม|ບໍ່|have|มี|size|ไซส์/i.test(text) && !/[x*]\s*\d+/i.test(text);
  const isOrder = TAKE_WORDS.some((w) => lower.includes(w.toLowerCase())) || lower.startsWith(keyword.toLowerCase());

  const skuMatch = normalized.match(/(?:^|\s)(?:f\s*)?(\d{1,5})(?:\s|$)/i);
  const qty = extractQty(normalized);

  const colorMatch = normalized.match(/\b(red|blue|black|white|แดง|ดำ|ขาว|น้ำเงิน)\b/i);
  const sizeMatch = normalized.match(/\b(xl|l|m|s|xxl|ไซส์\s*[smlx]+)\b/i);

  if (!isOrder && isQuestion) {
    return { type: "question", confidence: 0.95, raw: text };
  }

  if (isOrder && skuMatch) {
    return {
      type: "order",
      confidence: 0.9,
      sku: skuMatch[1],
      qty,
      color: colorMatch ? colorMatch[1] : null,
      size: sizeMatch ? sizeMatch[1].replace(/ไซส์\s*/i, "") : null,
      raw: text,
    };
  }

  return { type: "ambiguous", confidence: 0.35, raw: text };
}

module.exports = { parseLiveComment };
