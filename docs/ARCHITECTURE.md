# Architecture (initial proposal)

Proposed MVP: portable TypeScript-oriented modular monolith. Web/API, identity and policy, connector adapters, durable worker jobs, PostgreSQL state, encrypted object storage and optional search are separated by bounded contracts. No microservice split before measured operational need. No production stack selection is final until `ADR-0001-STACK.md` is complete.

The prototype is static Node-served HTML with synthetic data only and deliberately has no provider credentials, mail content, persistent database, or operational integrations.

## Trust boundaries
1. Browser session and tenant-scoped UI.
2. Authenticated API and policy checks (not yet implemented in prototype).
3. Job queue/workers carrying tenant, connection, permission and idempotency context.
4. External provider APIs and user-supplied endpoints (SSRF-sensitive).
5. Encrypted database/object storage; email body/attachments classified as high sensitivity.
6. Optional model providers receive only approved, redacted input; email remains untrusted data.

## Diagram
See [`diagrams/architecture.mmd`](diagrams/architecture.mmd). It is a target architecture, not a claim that these components are implemented.
