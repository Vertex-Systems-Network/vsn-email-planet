# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH: GitHub remote `main`; resolve its live SHA before continuation.  
STATUS: P0/P1 gates open; P2–P12 gated and not started.

## Repository boundary

This repository contains only VSN Email Planet. Keep Orbicore, WooCommerce and unrelated products in their own repositories. Integrate with Multi-Hosting only through its versioned scoped API. GitHub remote is the source of truth; do not use local clones/worktrees for implementation or verification.

## Verified checkpoints

- P0-07 plan consistency passed [run 42743243063](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743243063); evidence follow-up passed [run 42743640435](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42743640435).
- P1-06 session/actor guard plus CSRF-protected logout passed [run 42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243); evidence: `docs/TEST_EVIDENCE/2026-11-11-p1-06-csrf-logout.md`.

## Active work

P1-06 remains PARTIALLY_VERIFIED. P1-11 is TESTING for a narrow first slice: versioned scrypt password verifier plus one-to-one PostgreSQL credential table. CI result is pending. The use of scrypt is deliberate for the supported runtime: OWASP lists scrypt as fallback when Argon2id is unavailable, and Node 24's Argon2 API remains Release Candidate; see ADR-0003.

If that CI passes, continue P1-11 with repository-backed credential creation/verification and one-time bootstrap/invitation. Login throttling, admin MFA/recovery and session/CSRF issuance still need implementation and tests. Then complete P1-12 denial auditing, P1-13 tenant resource authorization and P1-14 queued-job reauthorization. Never use live provider credentials or send mail in CI.

