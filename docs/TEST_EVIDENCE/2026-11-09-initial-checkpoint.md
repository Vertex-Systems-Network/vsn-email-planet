# Local verification evidence

Recorded: 2026-11-09T20:33:40.170Z
Node: v24.22.1
npm: 11.9.0
Git base revision at run: 9b408f3a3bf5a31864d8b3274f14a34ab451a8a0.
Working tree at verification start: contains uncommitted changes.
Environment: local synthetic development environment; no external provider credentials or private mailbox data.

## npm ci

- Status: PASS
- Started: 2026-11-09T20:33:03.190Z
- Ended: 2026-11-09T20:33:10.353Z
- Exit code: 0

```text
added 151 packages in 7s
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run typecheck

- Status: PASS
- Started: 2026-11-09T20:33:10.354Z
- Ended: 2026-11-09T20:33:12.780Z
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
- Started: 2026-11-09T20:33:12.781Z
- Ended: 2026-11-09T20:33:18.662Z
- Exit code: 0

```text
✔ tenant-owned connection scopes reject cross-organization relationships (833.827158ms)
✔ migration source contains no seeded mail body or credentials (1.527936ms)
✔ migration checksum drift is rejected without applying changed source (735.127326ms)
✔ failed migrations roll back schema changes and migration records (594.318844ms)
✔ tenant scoping excludes resources owned by another organization (1.486814ms)
✔ admin or tenant context alone does not grant mailbox-content access (0.230557ms)
✔ content grant is scoped to one mailbox and tenant (0.105278ms)
✔ read-only capability cannot be used for a mutation (0.174492ms)
✔ job enqueue is tenant-scoped and idempotent with an atomic outbox event (1204.870123ms)
✔ mailbox lease serializes active jobs and stale fencing tokens cannot complete (855.212854ms)
✔ expired read leases are reclaimed with a higher generation (840.060338ms)
✔ expired dispatched mutations become unknown and block automatic replay until reconciliation (729.772121ms)
✔ outbox claims are fenced and can be acknowledged exactly once (642.742343ms)
✔ worker claims require a tenant and do not cross organization boundaries (614.726685ms)
✔ transient retry is bounded and dispatched mutations cannot be blindly retried (639.037656ms)
ℹ tests 18
ℹ suites 0
ℹ pass 18
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5685.590073
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run check:backlog

- Status: PASS
- Started: 2026-11-09T20:33:18.663Z
- Ended: 2026-11-09T20:33:18.885Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 check:backlog
> node scripts/validate-backlog.mjs

Backlog valid: 33 tasks, 33 unique IDs.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run build

- Status: PASS
- Started: 2026-11-09T20:33:18.885Z
- Ended: 2026-11-09T20:33:29.205Z
- Exit code: 0

```text

  Creating an optimized production build ...
✓ Compiled successfully in 118ms
  Running TypeScript ...
  Finished TypeScript in 1271ms ...
  Collecting page data using 4 workers ...
  Generating static pages using 4 workers (0/3) ...
✓ Generating static pages using 4 workers (3/3) in 373ms
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
- Started: 2026-11-09T20:33:29.205Z
- Ended: 2026-11-09T20:33:31.335Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:web
> node scripts/smoke-web.mjs

Web HTTP smoke passed: / returned 200 with persistent synthetic-data notice and inventory screen.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run smoke:api

- Status: PASS
- Started: 2026-11-09T20:33:31.336Z
- Ended: 2026-11-09T20:33:32.010Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:api
> node scripts/smoke-api.mjs

API HTTP smoke passed: /health confirms process status only; no provider/database health claimed.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm audit --audit-level=high

- Status: PASS
- Started: 2026-11-09T20:33:32.010Z
- Ended: 2026-11-09T20:33:40.170Z
- Exit code: 0

```text
found 0 vulnerabilities
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## Additional native PostgreSQL smoke syntax check

- Status: PASS (`node --check scripts/smoke-postgres.mjs`)
- The actual native PostgreSQL execution is delegated to GitHub Actions using its disposable PostgreSQL 16 service; no local disposable `vsn_test` target was configured during this run.
