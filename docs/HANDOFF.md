# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH: GitHub remote `main`; resolve its live SHA before continuation.  
STATUS: P0/P1 gates open; P2–P12 gated and not started.

## Repository boundary

This repository contains only VSN Email Planet. Keep Orbicore, WooCommerce and unrelated products in their own repositories. Integrate with Multi-Hosting only through its versioned scoped API. GitHub remote is the source of truth: make changes and run checks through GitHub; do not use local clones, worktrees or scratch copies for implementation/verification.

## Verified plan checkpoint

P0-07 plan consistency passed run [42743243063](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743243063); evidence follow-up passed run [42743640435](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743640435). This does not close P0.

## Active implementation: P1-06

- Session persistence and guarded `GET /api/session/me` passed on commit `2b27404889ecee50a7e2812a6399d7409050689d`, run [42909851019](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42909851019).
- Session-bound CSRF logout, exact `APP_ORIGIN` enforcement, atomic revocation plus successful-logout audit and cookie clearing passed on commit `64b2bb9cad2db69693141f790ddf2776d0c4d5bb`, run [42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243).
- Failure/recovery chain is documented in `docs/TEST_EVIDENCE/2026-11-11-p1-06-csrf-logout.md`; do not erase the failed checks or report full P1-06.
- Still open: credential verification/login and issuance, CSRF token delivery and session rotation/recovery, denied-event auditing, resource RBAC/ABAC, and queued-job reauthorization.
- Next: specify credential/login policy, then implement issuance and token delivery with synthetic-only CI; proceed to denial audit and tenant/resource/job authorization in separately bounded tasks.

Continue P0-02 research/P0-04 UX evidence independently. P2/P3 stay gated on P1 identity/tenant security criteria.

## Safety and reporting

Provider capabilities and permissions are operation-specific. Hosting credentials never imply content consent. Sending is policy-gated; uncertain sends require reconciliation. Never claim live integration, erasure, release, phase completion or test success without commit-specific evidence. If remote CI cannot exercise a criterion, record the limitation and leave it open.
