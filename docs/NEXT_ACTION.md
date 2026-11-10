# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; implementation and verification happen there.

## Verified P1-06 increment

PostgreSQL session resolution, guarded actor endpoint, same-origin session-bound CSRF logout, atomic successful-logout audit and cookie clearing passed [run 42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243). Evidence: `docs/TEST_EVIDENCE/2026-11-11-p1-06-csrf-logout.md`.

## Active task: P1-11

Credential verifier/schema increment is on remote `main` and awaiting GitHub Actions. It uses a versioned scrypt verifier because the supported Node 24 built-in Argon2 API remains Release Candidate; see ADR-0003 for the OWASP-backed parameters and source links. No login or bootstrap endpoint is claimed yet.

After CI, continue P1-11 with repository-backed credential creation/verification and a single-use bootstrap/invitation path. Then implement shared throttling, privileged MFA/recovery, and login session+CSRF issuance. P1-12 denial audit, P1-13 resource authorization and P1-14 worker dispatch reauthorization remain separate dependent tasks. Keep P1-06 PARTIALLY_VERIFIED until all aggregate criteria have evidence.

Continue P0-02 research and P0-04 UX evidence independently. P0 and P1 gates remain open; P2/P3 remain gated on P1 security prerequisites.

## Remote-only publication

Inspect live `main` and exact targets before each edit; use GitHub compare-and-swap commits and record remote Actions evidence. Preserve failed-run recovery and leave unverified criteria open.
