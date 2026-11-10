# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; implementation and verification happen there.

## Verified P1-11 slice

The versioned scrypt verifier and PostgreSQL credential schema passed [run 42916848390](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42916848390). Repository-backed lookup and active membership filtering passed [run 42917902168](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42917902168) on commit `a507f7f9c1553ff8710f2070f97f30e26e4d12a5`. It verifies platform credentials only; it does not issue sessions or expose a login endpoint.

## Continue P1-11

After CI, implement the single-use first-admin bootstrap and invite activation with transactional credential and audit writes. Keep registration closed, use no outbound mail or live provider credentials, and make bootstrap non-replayable. Then continue with shared login throttling, privileged MFA/recovery and login session+CSRF issuance. P1-12 denial audit, P1-13 resource authorization and P1-14 queued-job reauthorization remain separate tasks. Keep P1-06 PARTIALLY_VERIFIED until all aggregate criteria have evidence.

P0-02 research and P0-04 UX evidence continue independently. P0 and P1 remain open; P2/P3 remain gated on P1 security prerequisites.

## Remote-only publication

Resolve live `main`, inspect exact paths, commit through GitHub with compare-and-swap, and use GitHub Actions evidence. Preserve failure/recovery history and leave unverified criteria open.
