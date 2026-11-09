# ADR-0001: Web-first stack direction

- Status: `PROPOSED` (foundation direction selected; production lock remains open)
- Originally recorded: 2026-11-09
- Reconciled with the implemented foundation: 2026-11-10

## Context

The product needs a self-hostable web control plane with explicit API, tenant policy, provider adapters and durable background work. No provider credentials or controlled mailbox are available, so this decision is limited to the local synthetic foundation and does not claim a live connector or production deployment.

The repository currently contains two runnable paths:

- A dependency-free Node synthetic prototype used for deterministic fixture and policy tests.
- A TypeScript workspace using Next.js 16.4.5 for the web app, NestJS 11.2.9 for the API, PostgreSQL SQL-first migrations with `pg` 8.16.3, and PGlite 0.3.15 for local migration/queue tests. Exact dependency resolutions are in `package-lock.json`; Node/npm engine ranges are pinned in `.nvmrc` and `package.json`.

Local verification on 2026-11-10 passed clean `npm ci`, tests, typecheck, web/API builds and HTTP smoke checks. Earlier GitHub Actions evidence includes a PostgreSQL 16 job. This is foundation evidence only; there is no production auth, provider access, deployed worker, queue broker, self-host resource benchmark, or hard-crash/load proof.

## Decision

Keep the **Next.js web + NestJS API + TypeScript modular monolith** as the implementation direction for the current foundation. Keep PostgreSQL as the relational store direction and SQL-first migrations for tenant-sensitive constraints. Preserve the separate API/worker contracts. Do not introduce Redis, an ORM, external search, or object storage until a measured requirement justifies the extra service or abstraction.

The separate Node synthetic prototype remains a test/demo harness, not a second production architecture. Do not rewrite the implemented Next.js foundation to React/Vite solely because an earlier unmeasured scorecard tied those alternatives.

## Alternatives and tradeoffs

| Direction | Benefit | Cost / reason not selected for this increment |
|---|---|---|
| Next.js web + NestJS API + PostgreSQL | Matches implemented web/API boundary; one TypeScript toolchain; local build and smoke evidence already exists; deployable as Node processes or containers. | Two frameworks add some runtime and operational surface; self-host footprint and load remain unmeasured. |
| React/Vite web + NestJS API + PostgreSQL | Static UI can be small and API separation is clear. | Would introduce a framework rewrite without current evidence of a user or operations benefit; API still needs a separate service. |
| Django + PostgreSQL | Mature integrated admin/data tooling and one main server runtime. | Would require replacing the current TypeScript API and duplicating frontend work; no product-specific benchmark supports the change. |
| Go API + React UI | Small API runtime and strong static deployment options. | Adds language/toolchain split and a larger rewrite before workload evidence exists. |
| Next.js full-stack only | Fewer services for a simpler product. | Provider adapters, durable jobs and separate worker lifecycle benefit from explicit API/worker contracts; keep backend boundary independently deployable. |

## Technology choices and open decisions

- Web/API direction: selected provisionally as above; exact packages are lockfile-pinned and locally built.
- Database: PostgreSQL direction selected. SQL-first, checksummed migrations are implemented. Native PostgreSQL 16 CI evidence exists in repository history; PGlite tests remain useful but are not equivalent to native server coverage.
- ORM: none selected. Raw parameterized SQL remains at the current security-sensitive boundary until query patterns justify a typed ORM.
- Queue: durable PostgreSQL lease/outbox primitives exist; a broker/managed worker is not installed. Revisit pg-boss vs Redis/BullMQ after bounded throughput, retention and contention tests.
- Object storage/search: interfaces and product requirements are future work; no implementation choice yet.
- Deployment: local Node processes and container/VPS target remain candidates. Restricted shared hosting is not a target. Documented install instructions are development-only, not a production-ready installer.

## Consequences and acceptance boundary

- Keep the current implementation and verification evidence; avoid an unsupported framework migration.
- Do not claim production readiness. Authentication, tenant persistence in API requests, secrets/key management, backup/restore, deployment hardening, queue process recovery and provider SDK support remain separate gates.
- Before closing P0-03, measure a representative self-host footprint and dependency-outage/recovery behavior, and keep the ADR aligned to measured results. Do not use synthetic local build success as a workload benchmark.

## Evidence and references

- Stack scorecard and primary references: [`docs/RESEARCH/OPTIONS.md`](../RESEARCH/OPTIONS.md), checked 2026-11-09.
- ORM/migration tradeoffs: [`docs/RESEARCH/ORM_MIGRATION_EVALUATION.md`](../RESEARCH/ORM_MIGRATION_EVALUATION.md).
- Fresh local verification: [`docs/TEST_EVIDENCE/verification-20261109T213909Z-f919245.md`](../TEST_EVIDENCE/verification-20261109T213909Z-f919245.md).
- PostgreSQL 16 integration and CI evidence: [`docs/TEST_EVIDENCE/2026-11-09-branch-integration.md`](../TEST_EVIDENCE/2026-11-09-branch-integration.md).

## Revisit when

Self-host footprint, dependency recovery, queue throughput/retention, database operations, provider SDK requirements, or security review provides evidence that changes the current cost/benefit balance.
