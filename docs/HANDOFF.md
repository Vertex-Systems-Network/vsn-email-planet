# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH: GitHub remote `main`; resolve its live SHA before continuation.  
STATUS: P0/P1 gates open; P2–P12 gated and not started.

## Repository boundary

This repository contains only VSN Email Planet. Keep Orbicore, WooCommerce and unrelated products in their own repositories. Integrate with Multi-Hosting only through its versioned scoped API. GitHub remote is the source of truth: make changes and run checks through GitHub; do not use local clones, worktrees or scratch copies for implementation/verification.

## Verified checkpoints

- P0-07 plan consistency passed run [42743243063](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743243063); evidence follow-up passed run [42743640435](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743640435). This does not close P0.
- P1-06 PostgreSQL session/actor guard plus CSRF-protected logout passed run [42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243), code commit `64b2bb9cad2db69693141f790ddf2776d0c4d5bb`. Failure/fix history: `docs/TEST_EVIDENCE/2026-11-11-p1-06-csrf-logout.md`.

## Next work

P1-06 remains PARTIALLY_VERIFIED. It is now decomposed to prevent login, audit, resource authorization and job-dispatch checks from being reported as one vague increment:

1. **P1-11 READY:** invite-only first-admin bootstrap, local platform login, Argon2id password verifier, throttling, privileged-role MFA/recovery, session+CSRF issuance. Contract: `docs/DECISIONS/ADR-0003-IDENTITY-AUTHENTICATION.md`.
2. **P1-12 READY:** allowlisted success/denial audit events and fail-closed audit transactions.
3. **P1-13 READY:** tenant-scoped protected resource reads/search/count/mutations and non-disclosing responses.
4. **P1-14 READY:** reauthorize current user/membership/ownership/grants immediately before worker dispatch; prove no handler call after revocation.

CI must use synthetic fixtures only. Do not send mail or use live provider credentials. OIDC/SCIM remains later enterprise work. P0-02 research and P0-04 UX evidence continue independently; P2/P3 remain gated on P1 security prerequisites.

## Safety and reporting

Provider capabilities and permissions are operation-specific. Hosting credentials never imply content consent. Sending is policy-gated; uncertain sends require reconciliation. Never claim live integration, erasure, release, phase completion or test success without commit-specific evidence. Leave criteria open when remote CI cannot prove them.
