# Local verification evidence

Recorded: 2026-11-09T19:32:50.609Z
Node: v24.22.1
npm: 11.9.0
Git revision at run: no prior repository commit (first checkpoint pending).
Environment: local synthetic development environment; no external provider credentials or private mailbox data.

## npm ci

- Status: PASS
- Started: 2026-11-09T19:32:19.159Z
- Ended: 2026-11-09T19:32:26.849Z
- Exit code: 0

```text
added 136 packages in 8s
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run typecheck

- Status: PASS
- Started: 2026-11-09T19:32:26.851Z
- Ended: 2026-11-09T19:32:29.159Z
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
- Started: 2026-11-09T19:32:29.159Z
- Ended: 2026-11-09T19:32:29.478Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 test
> node --experimental-strip-types --test tests/*.test.mjs

✔ API health response claims process health only (1.672462ms)
✔ tenant scoping excludes resources owned by another organization (1.671961ms)
✔ admin or tenant context alone does not grant mailbox-content access (0.220471ms)
✔ content grant is scoped to one mailbox and tenant (0.151889ms)
✔ read-only capability cannot be used for a mutation (0.262023ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 141.406559
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run check:backlog

- Status: PASS
- Started: 2026-11-09T19:32:29.478Z
- Ended: 2026-11-09T19:32:29.677Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 check:backlog
> node scripts/validate-backlog.mjs

Backlog valid: 33 tasks, 33 unique IDs.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run build

- Status: PASS
- Started: 2026-11-09T19:32:29.677Z
- Ended: 2026-11-09T19:32:39.740Z
- Exit code: 0

```text

  Creating an optimized production build ...
✓ Compiled successfully in 138ms
  Running TypeScript ...
  Finished TypeScript in 1155ms ...
  Collecting page data using 4 workers ...
  Generating static pages using 4 workers (0/3) ...
✓ Generating static pages using 4 workers (3/3) in 319ms
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
- Started: 2026-11-09T19:32:39.741Z
- Ended: 2026-11-09T19:32:41.874Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:web
> node scripts/smoke-web.mjs

Web HTTP smoke passed: / returned 200 with persistent synthetic-data notice and inventory screen.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm run smoke:api

- Status: PASS
- Started: 2026-11-09T19:32:41.874Z
- Ended: 2026-11-09T19:32:42.536Z
- Exit code: 0

```text
> vsn-email-planet@0.1.0 smoke:api
> node scripts/smoke-api.mjs

API HTTP smoke passed: /health confirms process status only; no provider/database health claimed.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

## npm audit --audit-level=high

- Status: PASS
- Started: 2026-11-09T19:32:42.536Z
- Ended: 2026-11-09T19:32:50.609Z
- Exit code: 0

```text
found 0 vulnerabilities
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```


## Follow-up backlog-history validation

- Recorded: 2026-11-09T19:36:48Z
- Command: `npm run check:backlog`
- Status: PASS — 33 tasks, 33 unique IDs; status histories and dependencies valid.
- Exit code: 0
