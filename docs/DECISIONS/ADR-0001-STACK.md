# ADR-0001: Canonical application stack and prototype disposition

- Status: `PROVISIONAL_MVP_BASELINE`; exact deployment topology and optional infrastructure remain open.
- Date: 2026-11-09.
- Decision owners: project maintainers.

## Decision

Use the existing **Next.js App Router + React web application, NestJS API, PostgreSQL, and Node.js 24 LTS** as the canonical product implementation path. Keep the web and API as one TypeScript monorepo with separately buildable processes. All business rules, authorization, database access, provider operations, and durable job orchestration belong to the NestJS/API and shared domain packages. Next.js serves the UI and may provide narrowly scoped browser-facing routing; it must not become a second implementation of business policy.

Use PostgreSQL as the system of record and as the existing durable queue/outbox coordination store. Do not require Redis for the initial self-hosted installation: P1-05 already uses tenant-scoped PostgreSQL jobs, leases, and outbox rows. Add another broker only after measured load/availability evidence demonstrates PostgreSQL contention or a concrete operational need. Use parameterized SQL and immutable, checksummed SQL migrations for the current baseline; ORM selection remains deferred. Use PostgreSQL search first. Define an S3-compatible blob interface only when attachment/archive work is authorized; choose a concrete object store after deployment and licensing evaluation. Do not split into microservices before measured operational need.

The dependency-free Node server at `scripts/dev-server.mjs` and its root-level static dashboard remain a synthetic fixture harness. Keep them temporarily for fixtures and browser smoke tests; production features must not be added there. Once equivalent safe fixtures are available through the canonical app/API test harness, remove the duplicate UI/API path in a separately reviewed cleanup change. Its public fixture bearer values must never be accepted by the production API.

## Why this resolves the repository fork

The repository already has pinned Next.js, React, NestJS and PostgreSQL dependencies, a Next.js dashboard, a NestJS API, SQL migrations, shared domain policy and durable-job code. Fresh install, typecheck, production build, local tests and GitHub Actions have exercised this path. Selecting React/Vite would require an additional frontend migration without evidence of a required deployment or performance benefit. The dependency-free harness is useful for deterministic synthetic tests but is not a second product architecture.

## Alternatives and tradeoffs

| Candidate | Advantages | Costs/risks | Decision |
|---|---|---|---|
| Next.js + NestJS + PostgreSQL (current implementation) | Existing code and pinned dependencies; clear UI/API boundary; independently buildable API; supports Node self-host and container deployment | Two server processes; prevent duplicated business rules between Next and Nest; operational deployment needs reverse proxy/origin design | **Selected provisional MVP baseline** |
| React/Vite + NestJS + PostgreSQL | Lean static UI; explicit API split; simple static asset delivery | Requires replacing current Next frontend; separate static serving/reverse-proxy configuration; no measured gain for this product | Rejected for now; reconsider only with measured deployment/user need |
| Dependency-free Node app + PostgreSQL | Minimal dependencies; useful small deterministic fixture harness | Lacks production web framework, identity/session design and maintained UI system; repeats policy/API behavior | Retained only as temporary synthetic-test harness; no new product features |
| Next.js full-stack + PostgreSQL | Fewer processes and convenient UI routing | Blurs web and provider/job service boundaries; background worker lifecycle still separate; existing Nest API becomes redundant | Rejected; preserve Nest as the policy/data API boundary |
| Django or Go API + separate UI | Mature alternatives with good ecosystem/runtime properties | Language/runtime migration and no demonstrated advantage against already-built TypeScript foundation | Deferred |

## Runtime and implementation rules

- Node.js `24.15.0` is the repository baseline in `.nvmrc`; package manifests pin current direct dependencies and lockfile. CI must run against Node 24 and update to secure patches within the supported line.
- PostgreSQL is required for the product control plane. Keep migrations explicit, checksummed and backward-compatible; PGlite tests are useful unit coverage but do not replace native PostgreSQL integration tests.
- Run Next.js and NestJS behind one same-origin TLS reverse proxy in self-hosted deployments. The exact proxy, cookie/session settings, health/readiness, process supervision, backup/restore, key management and installation upgrade procedure require deployment evidence before production release.
- Start workers as a separately supervised process from the same API/shared packages. The current worker loops are primitives, not a claim of production process supervision or provider dispatch.
- Auth/provider SDK, ORM, object store and optional external broker choices remain deferred. Do not add them merely to complete a diagram.

## Migration and deprecation plan

1. Continue product UI development in `apps/web` and API/authorization/business logic in `apps/api` and `packages/domain` only.
2. Port any reusable synthetic fixtures and negative test cases from `scripts/dev-server.mjs` into canonical package/API tests before removing the harness.
3. Keep compatibility routes and test behavior stable while migrating; do not point real credentials or customer data at the harness.
4. After fixture equivalence and CI/browser smoke coverage exist, remove the duplicate Node HTTP server and static dashboard, then delete its obsolete tests and documentation in one reviewed cleanup checkpoint.

## Evidence and limits

The current baseline is buildable and tested, not production-ready. No production authentication, external provider connection, mailbox content access, mail delivery, operational deployment, load benchmark or disaster-recovery proof is claimed. Reopen this ADR if measured workload, self-host requirements, provider SDK support or security review changes the scorecard.
