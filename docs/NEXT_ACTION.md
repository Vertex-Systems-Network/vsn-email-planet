# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; implementation and verification happen there.

## Verified increments

- P1-06 PostgreSQL session resolution, guarded actor endpoint, same-origin session-bound CSRF logout, atomic success audit and cookie clearing passed [run 42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243).
- P1-11 versioned scrypt verifier and PostgreSQL credential schema passed [run 42916848390](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42916848390) on commit `8b465df558fda26add9d95672d3feec76eb2e32c`. This is a partial verifier/schema slice, not login.

## Continue P1-11

Implement repository-backed credential creation/verification and single-use first-admin bootstrap/invitation without public registration, outbound mail or live provider credentials. Then add shared login throttling, privileged MFA/recovery, and login session+CSRF issuance in separately verified increments. P1-12 denial audit, P1-13 resource authorization and P1-14 queued-job reauthorization remain separate. Keep P1-06 PARTIALLY_VERIFIED until all aggregate acceptance criteria have evidence.

Continue P0-02 research and P0-04 UX evidence independently. P0 and P1 gates remain open; P2/P3 remain gated on P1 security prerequisites.

## Remote-only publication

Resolve live `main`, inspect exact paths, commit through GitHub with compare-and-swap, and use GitHub Actions evidence. Preserve failure/recovery history and leave unverified criteria open.
