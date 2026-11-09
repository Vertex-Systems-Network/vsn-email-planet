# ADR-0001: Initial web-first application stack

- Status: Accepted for the initial development baseline; subject to benchmark and security review.
- Date: 2026-11-09
- Context: the product requires a self-hostable web UI, typed modular API, long-running provider jobs, and future desktop/mobile reuse. Existing Git history contained only a README and the governing specification; no product code or stack constraints existed.
- Sources checked: Next.js App Router and self-hosting docs (Node/Docker supported, reverse proxy recommended); NestJS current docs (TypeScript/Node, modular API); npm registry reported Next.js 16.4.5 on 2026-11-09; workspace runtime has Node 24.22.1 and npm 11.9.0.

## Scorecard (1–5; weighted score / 5)

| Option | Security 25% | Coverage 20% | Maintenance 15% | Portability 15% | Cost 10% | UX/a11y 10% | License 5% | Score |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Next.js web + NestJS API + PostgreSQL/Redis workers | 4 | 5 | 4 | 5 | 3 | 4 | 4 | 4.25 |
| Single Next.js app with API routes and external workers later | 3 | 3 | 4 | 4 | 4 | 5 | 4 | 3.70 |
| Python/Django monolith with separate React UI | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 3.90 |

Scores are an explicit engineering hypothesis, not an independent audit. The selected modular split keeps UI rendering separate from provider/worker trust boundaries but adds operational cost; keep services in a monorepo and deploy together initially. Use npm workspaces and Node.js 24 LTS-compatible versions. Add PostgreSQL/Redis after the first domain contracts. Search remains PostgreSQL until measured need supports a dedicated engine.

## Consequences and rejected alternatives

- Start with Next.js App Router + React + TypeScript for UI and NestJS + TypeScript for API/worker module boundaries; PostgreSQL and Redis/BullMQ are planned, not yet installed.
- No microservices, desktop/mobile packages, external AI APIs, commercial UI kits or real provider SDKs in P0/P1.
- A single API/runtime would reduce deployment complexity but couples app rendering and jobs; revisit only with deployment evidence.
- Python stack remains feasible; no proof currently shows it materially improves integration correctness enough to outweigh shared TypeScript domain types.
- Use exact versions and lockfile once packages are installed. License selection remains owner decision (no license grant).

## Validation needed

Measure clean install/build, API/web process footprint, worker/database recovery, local Docker setup, accessibility and real connector SDK maturity. Revisit ADR if these tests invalidate assumptions.
