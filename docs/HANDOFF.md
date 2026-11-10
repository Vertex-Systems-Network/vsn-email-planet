# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH: GitHub remote `main`; resolve its live SHA before continuation.  
STATUS: P0/P1 gates open; P2–P12 gated and not started.

## Repository boundary

This repository contains only VSN Email Planet. Keep Orbicore, WooCommerce and unrelated products in their own repositories. Integrate with Multi-Hosting only through its versioned scoped API. GitHub remote is the source of truth: make changes and run checks through GitHub; do not use local clones, worktrees or scratch copies for implementation/verification.

## Verified plan checkpoint

P0-07 plan consistency passed CI on commit `9d67a3ef79c988e8f181e5ab8d276c800f0798fb` (run [42743243063](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743243063)). Its evidence follow-up passed on `a6f5268906993e671fa4244bc82078cabc9e607c` (run [42743640435](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743640435)). This does not close P0 or P1.

## Active work

- P1-06 next increment: digest-only PostgreSQL sessions, membership-version invalidation, repository adapter and guarded `GET /api/session/me`.
- Target remote CI: missing cookie gets 401; seeded synthetic PostgreSQL session resolves actor from authoritative rows; forged tenant header/query cannot change organization; revoked/suspended membership is denied.
- Login/issuance, logout/rotation, CSRF, audit writes, tenant-owned resource policy and job reauthorization remain open. Do not claim full authentication.
- Continue P0-02 research and P0-04 UX evidence independently. Keep P2/P3 gated until P1 security prerequisites pass.

## Safety and reporting

Provider capabilities and permissions are operation-specific. Hosting credentials never imply content consent. Sending is policy-gated; uncertain sends require reconciliation. Never claim live integration, erasure, release, phase completion or test success without commit-specific evidence. If remote CI cannot exercise a criterion, record the limitation and leave it open.
