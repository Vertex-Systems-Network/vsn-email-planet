# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH: GitHub remote `main`; resolve its live SHA before continuation.  
STATUS: P0/P1 gates open; P2–P12 gated and not started.

## Repository boundary

This repository contains only VSN Email Planet. Keep Orbicore, WooCommerce and unrelated products in their own repositories. Integrate with Multi-Hosting only through its versioned scoped API. GitHub remote is the source of truth; do not use local clones/worktrees for implementation or verification.

## Verified checkpoints

- P0-07 plan consistency passed [run 42743243063](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743243063); evidence follow-up passed [run 42743640435](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743640435).
- P1-06 session/actor guard plus CSRF-protected logout passed [run 42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243).
- P1-11 password verifier/schema passed [run 42916848390](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42916848390).

## Active work

P1-06 remains PARTIALLY_VERIFIED. P1-11 is TESTING for repository-backed credential lookup: valid password is required before the helper returns current active memberships; unknown, disabled, wrong-password and membership-less cases return null. It creates no session and is not a login endpoint. After its CI passes, continue with single-use bootstrap/invitations and audit, then throttling, MFA/recovery and session+CSRF issuance. Keep CI synthetic; do not send mail or use live provider credentials.

P1-12 denial audit, P1-13 tenant resource authorization and P1-14 queued-job reauthorization remain separate and open.
