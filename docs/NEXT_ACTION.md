# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; do not implement or verify from a local clone/worktree.

## Active implementation: P1-06

Implement the bounded persistent-session/API-guard slice in the remote repository:

1. Add a checksummed PostgreSQL session table and membership-version invalidation.
2. Add a repository adapter that resolves the session digest, active user and exact active membership from PostgreSQL.
3. Guard `GET /api/session/me`; derive actor scope from server records only.
4. Verify missing-cookie denial, stored-session resolution, forged tenant-context rejection and membership-revocation denial through GitHub Actions/PostgreSQL CI.
5. Keep P1-06 IN_PROGRESS or PARTIALLY_VERIFIED only with exact evidence. Login/issuance, logout/rotation, CSRF, audit events and resource/job authorization are subsequent open criteria.

## Independent P0 work

- Continue P0-02 dated primary-source research and P0-04 UX evidence independently where possible.
- P0-07 plan consistency is VERIFIED; P0 and P1 gates remain open. Keep P2/P3 implementation gated on P1 identity/tenant security prerequisites.

## Remote-only publication

Read the live ref and target files before each edit. Create commits directly in GitHub with compare-and-swap ref updates. Use GitHub Actions for verification, record the exact run/commit/result, and leave unverified criteria open.
