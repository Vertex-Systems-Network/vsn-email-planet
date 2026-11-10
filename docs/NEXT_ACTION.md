# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; implementation and verification happen there.

## Current verified increment

P1-06 PostgreSQL session resolution, guarded actor endpoint, same-origin session-bound CSRF logout, atomic successful-logout audit and cookie clearing passed [GitHub Actions run 42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243) on commit `64b2bb9cad2db69693141f790ddf2776d0c4d5bb`. P1-06 remains PARTIALLY_VERIFIED. See `docs/TEST_EVIDENCE/2026-11-11-p1-06-csrf-logout.md`.

## Next task: P1-11

Implement the accepted invite-only local platform identity baseline in `docs/DECISIONS/ADR-0003-IDENTITY-AUTHENTICATION.md`: single-use first-admin bootstrap, Argon2id password verifier, throttled login, required MFA for privileged roles, one-use recovery codes, session+CSRF issuance and audit. Keep CI synthetic; do not send email or use provider credentials.

Then execute the decomposed tasks in dependency order: P1-12 auth/denial audit, P1-13 resource-level tenant authorization, and P1-14 worker dispatch reauthorization. Keep parent P1-06 partial until the aggregate acceptance criteria have evidence. Continue P0-02 research and P0-04 UX evidence independently; P0 and P1 remain open.

## Remote-only publication

Before each change resolve live `main`, inspect exact target paths, commit through GitHub with compare-and-swap, and use GitHub Actions evidence. Preserve failed-run recovery details and keep unverified criteria open.
