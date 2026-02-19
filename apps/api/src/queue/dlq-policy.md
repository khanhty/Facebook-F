# Dead-letter policy

- Queue engine target: BullMQ (Redis).
- Retries: exponential backoff, max 5 attempts for webhook processing.
- Move to DLQ when signature invalid, schema invalid, or repeated downstream 5xx after max retries.
- Admin UI should expose: event id, source, idempotency key, last error, next retry.
