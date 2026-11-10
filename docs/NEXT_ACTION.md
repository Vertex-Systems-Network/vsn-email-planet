# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; do not implement or verify from a local clone/worktree.

## Current verified increment

P1-06 PostgreSQL session resolution, guarded actor endpoint, same-origin session-bound CSRF logout, atomic successful-logout audit and cookie clearing passed GitHub Actions run [42913312243](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42913312243) on commit `64b2bb9cad2db69693141f790ddf2776d0c4d5bb`. P1-06 remains PARTIALLY_VERIFIED; see `docs/TEST_EVIDENCE/2026-11-11-p1-06-csrf-logout.md`.

## Continue P1-06

1. Define the credential-verification and login/session-issuance mechanism. Keep it unimplemented until the selected mechanism, rate limits, recovery and MFA policy are specified; do not treat synthetic CI fixtures as login.
2. Implement issuance with a session-bound CSRF token digest and deliver its cookie with the documented security attributes; add rotation and recovery/revocation behavior.
3. Add denial-event audit coverage for authentication, CSRF and authorization failures without storing secrets or untrusted tenant identity.
4. Extend authorization to tenant-owned direct-ID/list/search/count/mutation requests and prove non-disclosing cross-tenant behavior.
5. Reauthorize user, membership, target ownership and required grants immediately before queued-job dispatch; prove revoked authorization prevents handler/provider dispatch.
6. Add PostgreSQL-backed acceptance evidence for each bounded slice. Keep P1-06 PARTIALLY_VERIFIED until every acceptance criterion is covered.

Continue P0-02 research and P0-04 UX evidence independently. P0 and P1 gates stay open; P2/P3 remain gated on P1 security prerequisites.

## Remote-only publication

Resolve live `main` and inspect edited paths before each update. Create commits directly in GitHub with compare-and-swap ref updates. Verify through GitHub Actions, preserve failure/recovery evidence and leave unverified criteria open.
