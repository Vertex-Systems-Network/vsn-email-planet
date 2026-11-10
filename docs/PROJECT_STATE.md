# Project state

Last updated: 2026-11-11

## Repository boundary and source of truth

- Canonical project: [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet), default branch `main`.
- This repository is exclusively VSN Email Planet. Orbicore, WooCommerce plugins and unrelated product code/plans belong in their own repositories. Multi-Hosting integration is limited to its documented, versioned and scoped API contract.
- Remote-only plan repair is on `main` through `a6f5268906993e671fa4244bc82078cabc9e607c`; resolve the live `main` SHA before every continuation.
- The governing master prompt remains the product contract. If it is unavailable in a future session, recover it from its original source before redefining scope; do not infer missing requirements from this handoff.

## Plan audit repairs

- Replaced the combined P4–P12 gate with one explicit gate per phase P0–P12, each carrying scope, observable exit criteria and task IDs.
- Rebuilt the phase epics from the task ledger. P1-07–10 and existing P2/P3 tasks are included; P2 correctly remains NOT_STARTED while its tasks are DISCOVERED.
- Added roadmap work for missing P2 inventory/fault coverage, P3 cursor recovery/search/E2E coverage and P4 administration. Added tasks remain DISCOVERED and are not implementation claims.
- Reconciled the architecture overview with ADR-0001: Next.js/React, NestJS and PostgreSQL are provisional; optional infrastructure and production topology remain open.
- Removed stale current-summary claims tied to deleted evidence files. Git history is preserved.

## Current delivery state

- P0: open. Research, feasibility review and UX evidence remain incomplete. P0-07 plan consistency is VERIFIED for the validated ledger and gates.
- P1: open. Foundation and selected persistence/worker increments exist. The PostgreSQL session/actor-guard slice is partially verified; login/issuance, logout/rotation, CSRF, audit writes, resource RBAC/ABAC and queued-job reauthorization remain open.
- P2–P12: NOT_STARTED. Backlog entries are plans only. No live provider connection, mailbox read/send, administration, DNS mutation, migration, client release or enterprise integration is claimed.
- Documentation research, simulation and live-provider validation are distinct evidence. API acceptance is not proof of data erasure or production behavior.

## Verification

Plan repair commit `9d67a3ef79c988e8f181e5ab8d276c800f0798fb` passed GitHub Actions run [42743243063](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743243063), and evidence follow-up `a6f5268906993e671fa4244bc82078cabc9e607c` passed run [42743640435](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743640435). P0-07 is VERIFIED for plan consistency only. P0 and P1 gates remain IN_PROGRESS.

## P1-06 runtime increment (2026-11-11)

A PostgreSQL session schema/repository and guarded `GET /api/session/me` are being added. The target CI integration proves synthetic stored-session resolution, tenant context cannot be changed by request claims, and membership changes invalidate the session. This remains an incomplete P1-06 slice: login/issuance, logout/rotation, CSRF, audit writes, resource-specific authorization and job-dispatch reauthorization remain open. Record commit-specific CI evidence before updating this status.

## P1-06 session/guard increment

Commit `2b27404889ecee50a7e2812a6399d7409050689d` passed [GitHub Actions run 42909851019](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42909851019). P1-06 is PARTIALLY_VERIFIED for PostgreSQL session persistence, active membership resolution, tenant-claim resistance and membership invalidation only. See `docs/TEST_EVIDENCE/2026-11-11-p1-06-session-runtime.md` for passing checks, failed-run recovery and remaining scope.
