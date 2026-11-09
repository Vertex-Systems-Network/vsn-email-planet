# Installation

## Local demo

Requires Node `>=22.14 <25` and npm `>=11 <12`. Run `npm ci`, then `npm run dev`; open `http://localhost:3000`. This launches a synthetic dashboard with no provider connectivity. `npm run dev:api` starts an independent health process at `http://localhost:4000/health`.

This is not a production installation. Database, Redis, authentication, TLS, secret management, backups, workers and provider connections are not implemented yet.
# Database migration baseline

For a configured PostgreSQL database, set `DATABASE_URL` in the process environment and run `npm run db:migrate` as a single deployment/release step. The runner applies immutable checksummed migrations under a transaction-scoped advisory lock. It refuses to run without a URL. The first migration creates control-plane metadata only; the HTTP API does not yet persist requests. Never point the migration smoke test at a production database.
