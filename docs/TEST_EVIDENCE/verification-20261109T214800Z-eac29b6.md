# P1-06 identity contract checkpoint

Recorded: 2026-11-09T21:48:00Z
Base commit: `eac29b6a571f4a898320eb14a482b90ed499543a`
Environment: local repository; synthetic-only. No production identity provider, customer data, or external credentials used.

## Contract increment

- Added the P1-06 production identity/tenant-authorization contract to `docs/API_CONTRACTS.md`.
- Defined server-verified actor derivation, tenant context switching, opaque session lifecycle, revocation, tenant-filtered reads/searches/mutations, queued-job reauthorization, content-grant separation, audit redaction/fail-closed behavior, denial semantics, and acceptance tests.
- Contract is a design artifact. No production session resolver or authentication endpoint is implemented or claimed.

## Local checks

- `npm run check`: PASS; backlog validator (35 tasks), state validator (35 tasks, 5 epics, 5 phase gates, 20 knowledge banks), 46 automated tests.
- `git diff --check`: PASS.

## Existing regression coverage relevant to contract

The existing suite verifies tenant-keyed resource isolation, separate mailbox-content grants, tenant foreign-key constraints, and queued-work tenant scoping. These tests do not verify session validation, login/logout, membership revocation at dispatch, or the newly specified contract as runtime behavior; those remain implementation acceptance criteria.

## Remote verification

The parent commit `eac29b6a571f4a898320eb14a482b90ed499543a` passed GitHub Actions run `42705339401`, including PostgreSQL 16. The contract was published in commit `46afedbc9a14a50bb0c1ff15185251d687e828b4`; GitHub Actions run `42706037041` passed, including PostgreSQL 16. Authentication is still only a contract, not runtime functionality.
