# LiveOrder F (Scaffold)

Yes — this scaffold is now completed as a **Docker-first one-command setup**.

## 🚀 Quick start (one file / one command)
Run everything (API + Postgres + Redis + MinIO) from the single `docker-compose.yml` file:

```bash
docker compose up --build
```

After boot:
- API root: `http://localhost:3000/`
- API health: `http://localhost:3000/health`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`
- MinIO: `http://localhost:9001`

## What is included
- Multi-tenant Prisma schema with workspaces, roles, channels, products, variants, stock, orders, conversations, AI state, webhook events, audit logs.
- SEA-friendly live comment parser (`F 12 x2`, Thai/Lao patterns).
- Rule-first intent detector with LLM fallback signaling.
- Stock policy engine (reserve / defer deduction).
- Idempotency primitives and retry-to-DLQ webhook processor.
- Sample webhook payloads for Facebook, Messenger, WhatsApp.
- Node test suite for unit + integration + e2e simulation.

## API endpoints (inside scaffold)
- `GET /` (defaults to HTML for browsers/`*/*`, returns JSON with `Accept: application/json`)
- `GET /health`
- `POST /parse-comment` with `{ "text": "F 12 x2" }`
- `POST /detect-intent` with `{ "message": "Do you have size L?" }`

## Local tests
```bash
npm test
```

## Example test payloads
- `samples/facebook-comment-webhook.json`
- `samples/messenger-webhook.json`
- `samples/whatsapp-webhook.json`

## Environment defaults
See `.env.example`.

## Notes
- Browser-friendly root page is available at `GET /` for quick visual verification.
- Container runs Node directly (not `npm start`) to avoid noisy npm SIGTERM shutdown errors when containers stop.
This is a production-oriented scaffold with core domain logic and tests. Next steps are wiring Prisma migrations, NestJS controllers/services, BullMQ workers, and full Next.js admin UI pages.
