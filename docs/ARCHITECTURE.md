# Architecture (initial proposal)

Proposed MVP: portable TypeScript-oriented modular monolith. Web/API, identity and policy, connector adapters, durable worker jobs, PostgreSQL state, encrypted object storage and optional search are separated by bounded contracts. No microservice split before measured operational need. No production stack selection is final until `ADR-0001-STACK.md` is complete.

The synthetic prototype is a Node-served dashboard plus a read-only same-origin fixture API with two synthetic organizations. Published fixture bearer tokens model tenant filtering in tests; they are not authentication. Separately, the repository contains a Next.js web app, NestJS API, PostgreSQL migrations, and durable job/worker/outbox primitives with PGlite tests. Those foundations do not establish production authentication, a real PostgreSQL runtime proof, provider connectivity, mailbox-content access, or outbound mail.

## Trust boundaries
1. Browser session and tenant-scoped UI.
2. Authenticated API and policy checks (not yet implemented in prototype).
3. Job queue/workers carrying tenant, connection, permission and idempotency context.
4. External provider APIs and user-supplied endpoints (SSRF-sensitive).
5. Encrypted database/object storage; email body/attachments classified as high sensitivity.
6. Optional model providers receive only approved, redacted input; email remains untrusted data.

## Diagram
See [`diagrams/architecture.mmd`](diagrams/architecture.mmd). It is a target architecture, not a claim that these components are implemented.
