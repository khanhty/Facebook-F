function createWebhookProcessor({ idempotencyStore, handler, maxRetries = 3 }) {
  const dlq = [];

  async function process(event) {
    if (!idempotencyStore.claim(event.idempotencyKey)) {
      return { status: 'duplicate' };
    }

    let attempt = 0;
    while (attempt < maxRetries) {
      attempt += 1;
      try {
        await handler(event);
        return { status: 'processed', attempt };
      } catch (err) {
        if (attempt >= maxRetries) {
          dlq.push({ event, error: err.message, attempt });
          return { status: 'dlq', attempt };
        }
      }
    }
  }

  return { process, dlq };
}

module.exports = { createWebhookProcessor };
