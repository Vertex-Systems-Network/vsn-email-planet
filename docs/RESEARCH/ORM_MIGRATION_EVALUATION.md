# PostgreSQL ORM and migration workflow evaluation

**Reviewed:** 2026-11-09. **Scope:** P1-04 initial control-plane schema and migration path. This is a bounded first decision; revisit after application query patterns and data model stabilize.

## Options reviewed

| Option | Strengths | Costs / risks for this project | Decision |
|---|---|---|---|
| Drizzle ORM + Drizzle Kit | TypeScript schema can generate versioned SQL; migrations may be applied by Drizzle or an external release process; PostgreSQL and PGlite integrations exist. | Introduces a second schema representation if security-sensitive DDL uses hand-written SQL; its default history checks do not replace our desired project-level test of immutable, checksummed migration history. | Revisit for typed query layer after schema patterns settle. |
| Prisma ORM + Prisma Migrate | Generated client and mature schema/migration workflows; custom SQL can be authored in migrations. | Generated client and schema-to-SQL flow add code generation and runtime footprint; Prisma's current v7 migration workflows have recently changed and need a separate upgrade/operations evaluation. | Not selected for initial DDL baseline. |
| SQL-first migrations + PostgreSQL driver | Explicit SQL preserves composite tenant constraints, partial indexes, and provider-specific behavior; no ORM translation at the security boundary; simple runtime. | Application queries require careful parameterization and explicit result typing; hand-written migration runner needs focused correctness tests. | Selected for P1-04 only; thin runner is checksummed, transactional, locked, and tested. ORM choice remains open. |

## Validation approach

The migration SQL is executed by PGlite in Node tests. PGlite documents its runtime as a WASM PostgreSQL build; this gives real PostgreSQL parser/constraint behavior without provisioning a server, but does not replace native PostgreSQL, multi-process deployment, extension, backup, or upgrade testing. `pg` is the production network driver. Production migrations are forward-only and run as a single release step before app rollout; no automatic destructive rollback is provided.

## Primary sources

- Drizzle migration approaches and generated SQL: https://orm.drizzle.team/docs/migrations
- Drizzle migration log and migration operation: https://orm.drizzle.team/docs/drizzle-kit-migrate
- Prisma development/production migration workflow (v7): https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production
- PGlite runtime and Node setup: https://pglite.dev/docs/about and https://pglite.dev/docs/
- Drizzle with PGlite: https://orm.drizzle.team/docs/connect-pglite
