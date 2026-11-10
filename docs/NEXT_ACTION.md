# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; implementation and verification happen there.

## Verified P1-11 slices

- Versioned scrypt verifier and PostgreSQL credential schema passed [run 42916848390](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42916848390).
- Repository credential lookup and active-membership filtering passed [run 42917902168](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42917902168).
- First-admin database transaction, claim migration, credential/audit atomicity and sequential replay protection passed full [run 42919767918](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42919767918) on commit `29e35a2dd3b8ef43c87f44cfe0070f652622f872`. Failure and recovery history is recorded in `docs/TEST_EVIDENCE/2026-11-10-p1-11-bootstrap-repository.md`.

Persistence and the protected HTTP bootstrap boundary are implemented and verified. Login issuance, shared throttling, MFA/recovery and invitations remain open.

## Verified HTTP bootstrap boundary

`POST /api/auth/bootstrap` passed full GitHub Actions [run 42922183396](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42922183396) on commit `638b4af1f37341cd9a41965979f4950e23650eec`. Evidence: `docs/TEST_EVIDENCE/2026-11-10-p1-11-bootstrap-http.md`. It verifies origin/token denial, malformed input, atomic rollback on audit failure, concurrent first-admin race (one success, one conflict), and no session/cookie issuance.

## Next bounded task: shared identity-attempt throttling (P1-15)

First amend ADR-0003 with keying, limits/windows, retention, privacy, failure behavior and anti-lockout policy. Then implement migration `0008` and shared PostgreSQL state across API replicas. Throttle keys must use a keyed digest, never raw identifiers or secrets; document key rotation before implementation. Test concurrent attempts through two independent pools, expiry/reset boundaries, generic responses and fail-closed behavior if storage is unavailable. Add a narrow audited operator recovery procedure; no global bypass.

Then proceed in dependency order: P1-16 MFA enrollment/challenge and one-use recovery; P1-17 MFA-gated login with CSRF-bound session issuance; P1-18 invite-only membership activation with email delivery disabled. P1-12 denial audit, P1-13 resource authorization and P1-14 queued-job reauthorization remain separate. Keep P1-06 PARTIALLY_VERIFIED until aggregate criteria have evidence.

P0-02 research and P0-04 UX evidence continue independently. P0 and P1 remain open; P2/P3 remain gated on P1 security prerequisites.

## Remote-only publication

Resolve live `main`, inspect exact target paths, commit through GitHub with compare-and-swap, and use GitHub Actions for verification. Preserve failure/recovery history and leave unverified criteria open.
