# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH/HEAD: GitHub remote `main`; current verified code checkpoint `29e35a2dd3b8ef43c87f44cfe0070f652622f872`. Resolve live `main` before continuation.  
STATUS: P0/P1 gates open; P2–P12 gated and not started.

## Repository boundary

This repository contains only VSN Email Planet. Keep Orbicore, WooCommerce and unrelated products in their own repositories. Integrate with Multi-Hosting only through its versioned scoped API. GitHub remote is the source of truth; do not use local clones/worktrees for implementation or verification.

## Verified checkpoints

- P0-07 plan consistency passed [run 42743243063](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743243063); evidence follow-up passed [run 42743640435](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743640435).
- P1-06 session/actor guard plus CSRF-protected logout passed [run 42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243).
- P1-11 password verifier/schema passed [run 42916848390](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42916848390); repository-backed credential lookup passed [run 42917902168](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42917902168).
- P1-11 first-admin persistence slice passed [run 42919767918](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42919767918) on `29e35a2dd3b8ef43c87f44cfe0070f652622f872`. It includes migration 0007, atomic owner/credential/claim/success-audit writes and sequential replay rejection.

## Active work and limitations

P1-06 remains PARTIALLY_VERIFIED. P1-11 remains PARTIALLY_VERIFIED: verifier/schema, credential lookup and first-admin persistence are evidenced; HTTP bootstrap boundary, concurrent bootstrap race verification, login/session+CSRF issuance, throttling, invitations and MFA/recovery remain open. No session or privileged access is created by `bootstrapFirstAdmin`. CI uses synthetic data only; no mail was sent and no live provider credentials were used.

P1-12 denial audit, P1-13 tenant resource authorization and P1-14 queued-job reauthorization remain separate and open. First next action: implement and HTTP-test the protected `POST /api/auth/bootstrap` boundary specified in `docs/NEXT_ACTION.md`.
