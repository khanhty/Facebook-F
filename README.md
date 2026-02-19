# LiveOrder F (Scaffold)

LiveOrder F is a multi-tenant social-commerce SaaS scaffold for Laos/Thailand/SEA sellers. It captures Facebook Live comment orders, powers AI-assisted replies in Messenger/WhatsApp, and manages catalog + inventory + order workflows with compliant Meta API usage.

## Tech stack choice
- Frontend: **Next.js + Tailwind** (UI plan and route map documented)
- Backend: **NestJS-style module design in TypeScript/Node scaffold**
- DB: **PostgreSQL + Prisma schema**
- Queue: **Redis + BullMQ policy (documented)**
- Realtime: **Socket.IO (planned integration point)**
- Object storage: **S3-compatible / MinIO**
- AI: **Pluggable adapter pattern with rule-first intent and LLM fallback hooks**

## Compliance guardrails implemented in scaffold
- Official Meta channels only (Graph API, Messenger, WhatsApp Cloud API).
- Webhook signature verification utility (`apps/api/src/webhooks/signature.js`).
- Idempotency store and processor to avoid duplicate handling.
- Public-safe reply patterns for comments; sensitive data collection moved to private chat.

## Monorepo layout
- `apps/api/src/domain`: parser, stock logic, live order service
- `apps/api/src/ai`: intent detection (rule-first)
- `apps/api/src/webhooks`: signature verification, idempotency, processor
- `apps/api/tests`: unit/integration/e2e tests
- `prisma/schema.prisma`: complete MVP data model
- `samples/`: mock webhook payloads

## Data model coverage
Schema includes all requested entities:
- workspaces/tenants, users/roles
- connected channels (facebook page, messenger, whatsapp)
- live sessions
- products, variants, stock
- orders, order items
- stock reservations with expiration
- conversations, messages, customers
- ai session state
- outgoing logs
- audit logs
- webhook events with idempotency keys

## Local setup
1. Start infra:
   ```bash
   docker compose up -d
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   ```
3. Run tests:
   ```bash
   npm test
   ```

## Meta app setup (high-level)
1. Create Meta app with required products: Facebook Login, Webhooks, Messenger, WhatsApp.
2. Request required permissions/scopes for pages messaging and comments management.
3. Configure callback URLs for webhook endpoints.
4. Validate signatures using app secret per incoming event.
5. Encrypt channel/page tokens at rest and rotate periodically.

## Webhook verification setup
- Verify incoming signatures with `verifyMetaSignature`.
- Use `comment_id`, `mid`, or `wamid` as idempotency key.
- Push normalized events to BullMQ (implementation target) with retry and DLQ.

## Default business rules
- Keyword: `F`
- Reserve mode: `RESERVE_ON_ORDER`
- Reservation expiry: 2 hours
- Currency: `LAK`
- Business hours: `09:00-21:00`
- Payment defaults: COD + Bank transfer enabled

## Admin UI pages (route map for Next.js app)
- `/live-control-room`
- `/orders`
- `/products`
- `/inbox`
- `/auto-reply-settings`
- `/payments-shipping`
- `/ai-review-queue`
- `/users-roles`
- `/audit-logs`
- `/system-health`

## Test coverage in this scaffold
### Unit tests
- Comment parser (mixed syntax + messy patterns)
- Intent detection rules
- Stock reserve/deduct logic
- Idempotency claim behavior

### Integration tests
- Duplicate webhook protection
- Retry-to-DLQ flow simulation

### E2E simulation
- Live session comment `F 12 x2` creates a NEW order + one safe reply

## Roadmap to full productionization
1. Replace in-memory stores with Prisma repositories.
2. Add NestJS controllers/services and DTO validation.
3. Add BullMQ workers and Redis-backed DLQ UI.
4. Implement outbound adapters for comment reply, Messenger, WhatsApp.
5. Add Next.js frontend pages and Socket.IO real-time updates.
6. Add AI grounded tool-calls with strict function schema and confidence routing.
