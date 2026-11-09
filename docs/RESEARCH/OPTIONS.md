# Initial stack options and scorecard

Checked 2026-11-09. This is a documented engineering judgment based on primary documentation, not a measured benchmark. The scorecard applies the master specification's weights: security/privacy 25%, correctness/coverage 20%, maintenance 15%, portability 15%, performance/ops cost 10%, UX/a11y fit 10%, licensing/vendor lock-in 5%. Scores are 1–5; rerun when prototype or provider evidence changes.

| Candidate direction | Security | Coverage | Maintenance | Portability | Cost | UX/a11y | License | Weighted score |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Next.js/React UI + NestJS API/worker + PostgreSQL (current repo) | 4 | 4 | 4 | 5 | 4 | 4 | 4 | 4.15 |
| React/Vite UI + NestJS API/worker + PostgreSQL | 4 | 4 | 4 | 5 | 4 | 4 | 4 | 4.15 |
| Next.js full-stack app + PostgreSQL, separate worker | 4 | 3 | 4 | 4 | 4 | 5 | 4 | 3.90 |
| Django web/API + PostgreSQL + separate frontend/worker | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 3.90 |

Scores remain qualitative hypotheses, not benchmark results. **ADR-0001 selects the existing Next.js/React + NestJS + PostgreSQL modular monolith as the provisional MVP baseline.** Next.js and Vite tie in this scorecard; the existing pinned, tested Next.js frontend breaks the tie by avoiding an unsubstantiated migration. Keep business policy and provider operations in NestJS. The dependency-free Node fixture harness is retained temporarily for synthetic tests only. Fresh-install, build, security/performance, deployment and workload evidence remain tracked separately; the selection is not production readiness.

## Decisions still open before locking exact production stack
- ORM: compare Prisma and Drizzle on generated migration clarity, PostgreSQL RLS/context, transaction control and team ergonomics. Prisma supports PostgreSQL and current repo shows Apache-2.0; add migration proof before selection.
- Queue: compare pg-boss (MIT, PostgreSQL-backed) with Redis/BullMQ. pg-boss can avoid a second required service, but worker throughput, job retention and DB contention must be tested before selection.
- Blob storage: keep an S3-compatible contract; choose a supported self-host implementation only after current license/maintenance review. No archive/blob store needed in current prototype.
- Search: start with PostgreSQL indexes/full text until workload and privacy bounds justify an external service.
- Runtime: Node.js 24.15+ proposal; current Nest docs list runtime 20.19+ or 22.12+ and CLI generators 22.22.3+, 24.15+ or 26+; Next.js current install docs list Node 20.9+. Node 24 line is the local/current-LTS direction; CI tracks latest secure patch in that line.

Primary evidence:
- Next.js deployment modes (Node server/Docker support all listed features; static export limited): https://nextjs.org/docs/app/getting-started/deploying
- Next.js system requirement: https://nextjs.org/docs/app/getting-started/installation
- NestJS runtime and CLI requirements: https://docs.nestjs.com/first-steps
- Vite static production output: https://vite.dev/guide/
- Prisma PostgreSQL support and license: https://docs.prisma.io/docs/orm/core-concepts/supported-databases ; https://github.com/prisma/orm/blob/main/LICENSE
- pg-boss PostgreSQL queue, MIT: https://github.com/timgit/pg-boss
- PostgreSQL license: https://www.postgresql.org/about/licence/
- Nest and Next licenses: https://github.com/nestjs/nest ; https://github.com/vercel/next.js

## Current decision
`ADR-0001` selects Next.js/React + NestJS + PostgreSQL + Node 24 as the provisional MVP baseline because the existing repo builds and the alternative would be a migration without demonstrated value. ORM, Redis/broker, concrete object storage, operational deployment and production readiness remain unselected or unverified.
