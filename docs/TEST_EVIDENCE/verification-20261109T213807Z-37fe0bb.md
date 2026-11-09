# Local verification evidence

Recorded: 2026-11-09T21:38:07.430Z
Node: v24.22.1
npm: 11.9.0
Git base revision at run: 37fe0bb123145811ab03858584f1eea42312cb20.
Working tree at verification start: contains uncommitted changes.
Environment: local synthetic development environment; no external provider credentials or private mailbox data.

## npm ci

- Status: PASS
- Started: 2026-11-09T21:37:27.432Z
- Ended: 2026-11-09T21:37:35.387Z
- Exit code: 0

```text
added 151 packages in 8s
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run typecheck

- Status: PASS
- Started: 2026-11-09T21:37:35.388Z
- Ended: 2026-11-09T21:37:37.851Z
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
- Started: 2026-11-09T21:37:37.851Z
- Ended: 2026-11-09T21:37:45.736Z
- Exit code: 0

```text
✔ content grant is scoped to one mailbox and tenant (0.15313ms)
✔ read-only capability cannot be used for a mutation (0.221624ms)
✔ job enqueue is tenant-scoped and idempotent with an atomic outbox event (1562.393519ms)
✔ mailbox lease serializes active jobs and stale fencing tokens cannot complete (882.5136ms)
✔ expired read leases are reclaimed with a higher generation (748.946258ms)
✔ expired dispatched mutations become unknown and block automatic replay until reconciliation (969.533375ms)
✔ outbox claims are fenced and can be acknowledged exactly once (898.23293ms)
✔ worker claims require a tenant and do not cross organization boundaries (869.736403ms)
✔ transient retry is bounded and dispatched mutations cannot be blindly retried (809.789072ms)
✔ worker runs a handler with lease heartbeats and completes the claimed job (2931.353775ms)
✔ worker marks dispatched mutation failures unknown instead of retrying them (997.379497ms)
✔ worker shutdown aborts a safe handler and returns its job to bounded retry (1015.312478ms)
✔ worker polling stops promptly on abort (897.318128ms)
✔ outbox publisher sends a minimal envelope and retries failed delivery after the lease (803.080943ms)
✔ outbox publisher polling stops promptly on abort (736.894417ms)
ℹ tests 46
ℹ suites 0
ℹ pass 46
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 7694.954568
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run check:backlog

- Status: PASS
- Started: 2026-11-09T21:37:45.736Z
- Ended: 2026-11-09T21:37:45.951Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 check:backlog
> node scripts/validate-backlog.mjs

Backlog valid: 35 tasks; no duplicate evidence, stale blocking state, or dependency cycles.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run build

- Status: PASS
- Started: 2026-11-09T21:37:45.951Z
- Ended: 2026-11-09T21:37:56.225Z
- Exit code: 0

```text

  Creating an optimized production build ...
✓ Compiled successfully in 111ms
  Running TypeScript ...
  Finished TypeScript in 1947ms ...
  Collecting page data using 4 workers ...
  Generating static pages using 4 workers (0/3) ...
✓ Generating static pages using 4 workers (3/3) in 442ms
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
- Started: 2026-11-09T21:37:56.226Z
- Ended: 2026-11-09T21:37:58.361Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:web
> node scripts/smoke-web.mjs

Web HTTP smoke passed: / returned 200 with persistent synthetic-data notice and inventory screen.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run smoke:api

- Status: PASS
- Started: 2026-11-09T21:37:58.361Z
- Ended: 2026-11-09T21:37:59.014Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:api
> node scripts/smoke-api.mjs

API HTTP smoke passed: /health confirms process status only; no provider/database health claimed.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm audit --audit-level=high

- Status: PASS
- Started: 2026-11-09T21:37:59.014Z
- Ended: 2026-11-09T21:38:07.430Z
- Exit code: 0

```text
found 0 vulnerabilities
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```
