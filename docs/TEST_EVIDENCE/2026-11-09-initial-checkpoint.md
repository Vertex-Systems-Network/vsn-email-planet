# Local verification evidence

Recorded: 2026-11-09T19:55:59.878Z
Node: v24.22.1
npm: 11.9.0
Git base revision at run: 315737ac1b46fc2b9a827bf70a929fa4319c32c1.
Working tree at verification start: contains uncommitted changes.
Environment: local synthetic development environment; no external provider credentials or private mailbox data.

## npm ci

- Status: PASS
- Started: 2026-11-09T19:55:23.509Z
- Ended: 2026-11-09T19:55:31.260Z
- Exit code: 0

```text
added 151 packages in 8s
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run typecheck

- Status: PASS
- Started: 2026-11-09T19:55:31.261Z
- Ended: 2026-11-09T19:55:33.583Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 typecheck
> npm run typecheck --workspace @vsn/web && npm run typecheck --workspace @vsn/api


> @vsn/web@0.1.0 typecheck
> tsc --noEmit


> @vsn/api@0.1.0 typecheck
> tsc --noEmit -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm test

- Status: PASS
- Started: 2026-11-09T19:55:33.583Z
- Ended: 2026-11-09T19:55:37.318Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 test
> node --experimental-strip-types --test tests/*.test.mjs

✔ API health response claims process health only (1.786097ms)
✔ control-plane migrations apply once and are idempotent (903.3987ms)
✔ a later migration upgrades existing organization rows (629.266099ms)
✔ tenant-owned connection scopes reject cross-organization relationships (638.464017ms)
✔ migration source contains no seeded mail body or credentials (1.212815ms)
✔ migration checksum drift is rejected without applying changed source (674.749906ms)
✔ failed migrations roll back schema changes and migration records (581.71638ms)
✔ tenant scoping excludes resources owned by another organization (2.098948ms)
✔ admin or tenant context alone does not grant mailbox-content access (0.174392ms)
✔ content grant is scoped to one mailbox and tenant (0.170187ms)
✔ read-only capability cannot be used for a mutation (0.136886ms)
ℹ tests 11
ℹ suites 0
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3544.646198
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run check:backlog

- Status: PASS
- Started: 2026-11-09T19:55:37.318Z
- Ended: 2026-11-09T19:55:37.504Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 check:backlog
> node scripts/validate-backlog.mjs

Backlog valid: 33 tasks, 33 unique IDs.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run build

- Status: PASS
- Started: 2026-11-09T19:55:37.504Z
- Ended: 2026-11-09T19:55:48.294Z
- Exit code: 0

```text

  Creating an optimized production build ...
✓ Compiled successfully in 102ms
  Running TypeScript ...
  Finished TypeScript in 1162ms ...
  Collecting page data using 4 workers ...
  Generating static pages using 4 workers (0/3) ...
✓ Generating static pages using 4 workers (3/3) in 325ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content


> @vsn/api@0.1.0 build
> tsc -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run smoke:web

- Status: PASS
- Started: 2026-11-09T19:55:48.294Z
- Ended: 2026-11-09T19:55:50.371Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:web
> node scripts/smoke-web.mjs

Web HTTP smoke passed: / returned 200 with persistent synthetic-data notice and inventory screen.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run smoke:api

- Status: PASS
- Started: 2026-11-09T19:55:50.371Z
- Ended: 2026-11-09T19:55:50.902Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:api
> node scripts/smoke-api.mjs

API HTTP smoke passed: /health confirms process status only; no provider/database health claimed.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm audit --audit-level=high

- Status: PASS
- Started: 2026-11-09T19:55:50.902Z
- Ended: 2026-11-09T19:55:59.877Z
- Exit code: 0

```text
found 0 vulnerabilities
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## Preserved repository history and baseline remote CI

- Recorded: 2026-11-09T19:57:25Z
- Existing `main` history preserved: `4758f49` README initialization, `ad2cf39` empty spec placeholder, `9182b40` full specification. No prior application code was present.
- Bootstrap checkpoint `315737ac1b46fc2b9a827bf70a929fa4319c32c1` passed GitHub Actions CI (run `42685458941`, success): https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42685458941
- At the time of this baseline entry, native PostgreSQL smoke verification was still pending; the later successful PostgreSQL run is recorded below.

## Native PostgreSQL CI verification

- Recorded: 2026-11-09T20:00:07+00:00
- Commit: `97582d1f8f5851c755141035b64d71104f364359`
- GitHub Actions CI: PASS; all steps succeeded, including `npm run test:postgres` against PostgreSQL 16 (`pg` driver), `npm test`, typecheck, build, web/API smokes, backlog validation and high-severity npm audit.
- Workflow run: https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42688360871
- This verifies the schema/migration task acceptance. It does not indicate the Nest API has connected to the database or that production auth/persistence is implemented.


## Current Phase 0 research checkpoint CI

- Recorded: 2026-11-09T20:07:37+00:00
- Commit: `82889744af107e8788abc9976023c4001ab7d7d0`
- GitHub Actions CI: PASS, including native PostgreSQL 16 migration smoke; all job steps completed successfully.
- Workflow run: https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42689547230
- UI library findings in this checkpoint are research only; no UI dependencies were added.

## Research checkpoint CI

- Recorded: 2026-11-09T20:10:07.445Z
- Commit: `720b912f6281ef2ce5ef8debf4dee665d4092fbe`
- GitHub Actions CI: PASS; all steps completed, including native PostgreSQL 16 migration smoke.
- Workflow run: https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42689994446
- UI candidate licenses and maintenance signals were reviewed as research only; no UI packages were installed.
