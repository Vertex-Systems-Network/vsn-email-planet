# Architecture (initial proposal)

The provisional MVP baseline is a portable TypeScript modular monolith: Next.js/React web, NestJS API and PostgreSQL, as recorded in `docs/DECISIONS/ADR-0001-STACK.md`. Deployment topology and optional queue, ORM and object-storage choices remain open pending workload, recovery and operational evidence. Keep identity/policy, provider adapters, durable jobs and persistence behind bounded contracts; do not split services without measured need.

The synthetic prototype is a Node-served dashboard plus a read-only same-origin fixture API. Its fixture tokens model tenant filtering only; they are not authentication. The repository also contains the Next.js web app, NestJS API, PostgreSQL migrations and durable job/worker/outbox primitives. These foundations do not establish production authentication, live provider connectivity, mailbox-content access, outbound mail or production readiness.

## Trust boundaries

1. Browser session and tenant-scoped UI.
2. Authenticated API and server-side policy enforcement.
3. Job queue/workers carrying tenant, connection, permission and idempotency context.
4. External provider APIs and user-supplied endpoints (SSRF-sensitive).
5. Encrypted database/object storage; email body and attachments are high-sensitivity data.
6. Optional model providers receive only explicitly approved, minimized and redacted input; email remains untrusted data.

## Diagram

See [architecture diagram](diagrams/architecture.mmd). It is a target architecture, not a claim that every component is implemented.

## Implementation boundaries

Business policy and provider operations live in the API/shared domain boundary; do not duplicate them in Next routes. The Node static server in `scripts/dev-server.mjs` is a temporary synthetic fixture harness, not a competing product stack. Redis, ORM, concrete object storage and microservice decomposition are not selected. See the stack ADR for tradeoffs and retirement steps.
