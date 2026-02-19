function applyStockPolicy({ mode, stock, qty, reservationTtlMin = 120 }) {
  if (qty <= 0) throw new Error("qty must be > 0");
  if (stock < qty) return { ok: false, reason: "OUT_OF_STOCK" };

  if (mode === "RESERVE_ON_ORDER") {
    return {
      ok: true,
      action: "RESERVE",
      remaining: stock,
      reservation: {
        qty,
        expiresAt: new Date(Date.now() + reservationTtlMin * 60 * 1000),
      },
    };
  }

  if (mode === "DEDUCT_ON_CONFIRM" || mode === "DEDUCT_ON_PAYMENT") {
    return { ok: true, action: "DEFER_DEDUCT", remaining: stock };
  }

  throw new Error(`Unknown stock mode: ${mode}`);
}

function finalizeDeduction({ stock, qty }) {
  if (stock < qty) return { ok: false, reason: "OUT_OF_STOCK" };
  return { ok: true, remaining: stock - qty };
}

module.exports = { applyStockPolicy, finalizeDeduction };
