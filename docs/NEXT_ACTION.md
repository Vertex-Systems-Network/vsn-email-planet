# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; implementation and verification happen there.

## Verified P1-11 slices

- Versioned scrypt verifier and PostgreSQL credential schema passed [run 42916848390](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42916848390).
- Repository credential lookup and active-membership filtering passed [run 42917902168](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42917902168).
- First-admin database transaction, claim migration, credential/audit atomicity and sequential replay protection passed full [run 42919767918](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42919767918) on commit `29e35a2dd3b8ef43c87f44cfe0070f652622f872`. Failure and recovery history is recorded in `docs/TEST_EVIDENCE/2026-11-10-p1-11-bootstrap-repository.md`.

These are persistence and verification slices. There is still no HTTP bootstrap route or login/session issuance.

## Next bounded task: secured first-admin HTTP bootstrap

Implement `POST /api/auth/bootstrap` with an environment-only, single-use 256-bit base64url secret; exact `Origin === APP_ORIGIN`; constant-time secret comparison; input/password policy validation; no-store responses; and the transactional repository call. Do not persist/log the secret, expose public registration, send email, or issue a session. Return only opaque user/organization IDs and an MFA-enrollment-required state. Add HTTP-level tests proving wrong origin/token, malformed input, replay and database failure create no privileged session; add a PostgreSQL multi-connection race test.

After that bounded task, proceed in dependency order: login throttling and login/session+CSRF with mandatory MFA enrollment, then invite creation/activation (email delivery stays disabled), then MFA recovery. P1-12 denial audit, P1-13 resource authorization and P1-14 queued-job reauthorization remain separate open tasks. Keep P1-06 PARTIALLY_VERIFIED until its aggregate criteria have evidence.

P0-02 research and P0-04 UX evidence continue independently. P0 and P1 remain open; P2/P3 remain gated on P1 security prerequisites.

## Remote-only publication

Resolve live `main`, inspect exact target paths, commit through GitHub with compare-and-swap, and use GitHub Actions for verification. Preserve failure/recovery history and leave unverified criteria open.
