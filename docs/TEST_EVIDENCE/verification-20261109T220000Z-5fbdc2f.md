# Local verification evidence

Recorded: 2026-11-09T22:00:00.129Z
Node: v24.22.1
npm: 11.9.0
Git base revision at run: 5fbdc2f0e3a8922c97d71bc4f038b49084812b4f.
Working tree at verification start: clean.
Environment: local synthetic development environment; no external provider credentials or private mailbox data.

## npm ci

- Status: PASS
- Started: 2026-11-09T21:59:22.558Z
- Ended: 2026-11-09T21:59:29.963Z
- Exit code: 0

```text
added 151 packages in 7s
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run typecheck

- Status: PASS
- Started: 2026-11-09T21:59:29.964Z
- Ended: 2026-11-09T21:59:32.358Z
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
- Started: 2026-11-09T21:59:32.359Z
- Ended: 2026-11-09T21:59:39.642Z
- Exit code: 0

```text
✔ content grant is scoped to one mailbox and tenant (0.417287ms)
✔ read-only capability cannot be used for a mutation (0.272389ms)
✔ job enqueue is tenant-scoped and idempotent with an atomic outbox event (1472.273813ms)
✔ mailbox lease serializes active jobs and stale fencing tokens cannot complete (750.060192ms)
✔ expired read leases are reclaimed with a higher generation (693.292621ms)
✔ expired dispatched mutations become unknown and block automatic replay until reconciliation (878.291363ms)
✔ outbox claims are fenced and can be acknowledged exactly once (826.017812ms)
✔ worker claims require a tenant and do not cross organization boundaries (709.729837ms)
✔ transient retry is bounded and dispatched mutations cannot be blindly retried (697.141077ms)
✔ worker runs a handler with lease heartbeats and completes the claimed job (2625.075857ms)
✔ worker marks dispatched mutation failures unknown instead of retrying them (962.474504ms)
✔ worker shutdown aborts a safe handler and returns its job to bounded retry (932.335864ms)
✔ worker polling stops promptly on abort (789.507796ms)
✔ outbox publisher sends a minimal envelope and retries failed delivery after the lease (704.939555ms)
✔ outbox publisher polling stops promptly on abort (750.1087ms)
ℹ tests 46
ℹ suites 0
ℹ pass 46
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 7088.007674
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run check:backlog

- Status: PASS
- Started: 2026-11-09T21:59:39.642Z
- Ended: 2026-11-09T21:59:39.892Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 check:backlog
> node scripts/validate-backlog.mjs

Backlog valid: 35 tasks; no duplicate evidence, stale blocking state, or dependency cycles.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run build

- Status: PASS
- Started: 2026-11-09T21:59:39.893Z
- Ended: 2026-11-09T21:59:48.715Z
- Exit code: 0

```text

  Creating an optimized production build ...
✓ Compiled successfully in 137ms
  Running TypeScript ...
  Finished TypeScript in 1578ms ...
  Collecting page data using 4 workers ...
  Generating static pages using 4 workers (0/3) ...
✓ Generating static pages using 4 workers (3/3) in 409ms
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
- Started: 2026-11-09T21:59:48.715Z
- Ended: 2026-11-09T21:59:51.091Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:web
> node scripts/smoke-web.mjs

Web HTTP smoke passed: / returned 200 with persistent synthetic-data notice and inventory screen.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run smoke:api

- Status: PASS
- Started: 2026-11-09T21:59:51.091Z
- Ended: 2026-11-09T21:59:51.792Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:api
> node scripts/smoke-api.mjs

API HTTP smoke passed: /health confirms process status only; no provider/database health claimed.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm audit --audit-level=high

- Status: PASS
- Started: 2026-11-09T21:59:51.792Z
- Ended: 2026-11-09T22:00:00.129Z
- Exit code: 0

```text
found 0 vulnerabilities
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```
