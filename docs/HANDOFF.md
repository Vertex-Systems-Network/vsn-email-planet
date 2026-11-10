# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH/HEAD: GitHub remote `main`; current verified code checkpoint `638b4af1f37341cd9a41965979f4950e23650eec`. Resolve live `main` before continuation.  
STATUS: P0/P1 gates open; P2–P12 gated and not started.

## Repository boundary

This repository contains only VSN Email Planet. Keep Orbicore, WooCommerce and unrelated products in their own repositories. Integrate with Multi-Hosting only through its versioned scoped API. GitHub remote is the source of truth; do not use local clones/worktrees for implementation or verification.

## Verified checkpoints

- P0-07 plan consistency passed [run 42743243063](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743243063); evidence follow-up passed [run 42743640435](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743640435).
- P1-06 session/actor guard plus CSRF-protected logout passed [run 42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243).
- P1-11 password verifier/schema passed [run 42916848390](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42916848390); repository-backed credential lookup passed [run 42917902168](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42917902168).
- P1-11 first-admin persistence passed [run 42919767918](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42919767918).
- Protected HTTP bootstrap and multi-connection race passed [run 42922183396](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42922183396) on `638b4af1f37341cd9a41965979f4950e23650eec`.

## Active work and limitations

P1-06 remains PARTIALLY_VERIFIED. P1-11 remains PARTIALLY_VERIFIED: verifier/schema, credential lookup, first-admin persistence and protected HTTP bootstrap are evidenced. Login/session+CSRF issuance, shared throttling, invitations and MFA/recovery remain open. Bootstrap creates no session/cookie. CI uses synthetic data only; no mail was sent and no live provider credentials were used.

The remaining P1-11 work is split into P1-15 shared throttling, P1-16 MFA/recovery, P1-17 MFA-gated login/session issuance and P1-18 invite-only activation.

P1-12 denial audit, P1-13 tenant resource authorization and P1-14 queued-job reauthorization remain separate and open. First next action: specify the P1-15 shared throttling policy in ADR-0003, then implement it with two-pool PostgreSQL tests.
