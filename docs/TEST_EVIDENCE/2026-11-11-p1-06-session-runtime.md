# P1-06 PostgreSQL session and HTTP guard increment — 2026-11-11

## Scope

This checkpoint implements only one bounded P1-06 slice: digest-only PostgreSQL session persistence, membership-version invalidation, a server-backed session repository, and the guarded `GET /api/session/me` endpoint. It does not implement login or credential verification, session issuance/rotation/logout, MFA, CSRF for state-changing routes, security audit writes, resource-specific RBAC/ABAC, or queued-job reauthorization.

## Remote CI evidence

- Tested commit: `2b27404889ecee50a7e2812a6399d7409050689d`.
- GitHub Actions run: [42909851019 — PASS](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42909851019).
- Completed checks: dependency install, TypeScript typecheck, unit/PGlite tests, PostgreSQL 16 checks, backlog/state validators, build, web smoke, API HTTP smoke, and high-severity dependency audit.
- HTTP smoke proves: missing cookie returns 401; a seeded database session resolves actor ID/organization/role from server-side rows; forged organization header/query do not switch the actor tenant; changing membership status invalidates the session and returns 401.
- The test uses a disposable `vsn_test` database and generated synthetic account/session rows; fixture data is removed after the smoke run. It does not access customer mail or a live provider.

## Failed attempts and recovery trail

| Run | Result | Finding | Recovery |
|---|---|---|---|
| [42908433979](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42908433979) | Failed at typecheck | Type declarations were missing for `pg` and the existing JavaScript resolver. | Added explicit local declaration contracts. |
| [42908812118](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42908812118) | Failed at typecheck | Adapter queries inferred generic records that did not satisfy the resolver contract. | Added explicit row types for session, user and membership queries. |
| [42909066628](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42909066628) | Failed at API smoke | Compiled guard imported `session-auth.js`, but TypeScript build did not bundle the source JavaScript module. | Added a build asset-copy step and startup diagnostics in the smoke harness. |
| [42909434316](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42909434316) | Confirmed runtime cause | Captured API stderr identified missing `apps/api/dist/session-auth.js`. | The final build copies the framework-neutral resolver to the runtime bundle. |

All four are preserved as normal GitHub Actions history. The final run above passed the complete workflow.

## Status boundary

P1-06 is `PARTIALLY_VERIFIED`, not `VERIFIED` or `DONE`. This evidence closes only the persistent-session/actor-guard slice. Full authentication, audit coverage, protected resource access and queued-job reauthorization remain open. P1's phase gate remains `IN_PROGRESS`.
