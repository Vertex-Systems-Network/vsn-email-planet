# VSN Email Planet

VSN Email Planet is a provider-neutral email operations control plane. The repository currently contains a Next.js web app, NestJS API, PostgreSQL migrations and durable job/outbox foundation, plus a read-only synthetic inventory prototype. The active plan phase is P0; no live provider operation or production readiness is claimed.

## Run locally

Requires Node.js 24.15.0 or newer and npm 11.

- Main web app: `npm run dev`, then open http://localhost:3000.
- API health service: `npm run dev:api`, then open http://localhost:4000/health.
- Synthetic provider/domain/mailbox prototype: `node scripts/dev-server.mjs`, then open http://localhost:4173.

The prototype uses public synthetic fixture identities and mock data only. It does not connect to providers or access mailbox content. Its fixture tokens are not authentication credentials.

## Verify

Run `npm ci`, then `npm run check`, `npm run typecheck`, `npm run build`, `npm run smoke:api`, and `npm run smoke:web`. PostgreSQL server integration uses `npm run test:postgres` with `DATABASE_URL` configured; PGlite tests do not substitute for a real PostgreSQL runtime proof.

## Project memory

Start with [`AGENTS.md`](AGENTS.md), [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md), [`docs/NEXT_ACTION.md`](docs/NEXT_ACTION.md), [`docs/HANDOFF.md`](docs/HANDOFF.md), and [`backlog/tasks.json`](backlog/tasks.json). The complete governing specification is [`AI_Native_Central_Email_Platform_Master_Prompt.md`](AI_Native_Central_Email_Platform_Master_Prompt.md).
