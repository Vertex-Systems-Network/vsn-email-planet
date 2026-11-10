# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; do not implement or verify from a local clone/worktree.

## Current verified increment

P1-06 session persistence and guarded actor endpoint passed [GitHub Actions run 42909851019](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42909851019) on commit `2b27404889ecee50a7e2812a6399d7409050689d`. It remains PARTIALLY_VERIFIED; see the linked evidence in `docs/PROJECT_STATE.md`.

## Continue P1-06

1. Define and implement deliberate credential verification and session issuance; do not accept the synthetic CI fixture as a login path.
2. Add session rotation/logout/revocation and same-origin plus CSRF enforcement before any state-changing browser route.
3. Add append-only security audit events for session and membership changes without recording secrets.
4. Extend request authorization to tenant-owned resource queries and enforce membership/grant rechecks immediately before queued-job dispatch.
5. Use GitHub Actions/PostgreSQL CI for denial, revocation, audit and no-cross-tenant evidence. Keep P1-06 partial until every acceptance criterion has evidence.

Continue P0-02 research and P0-04 UX evidence independently. P0 and P1 gates stay open; P2/P3 remain gated on P1 security prerequisites.

## Remote-only publication

Read the live ref and target files before each edit. Create commits directly in GitHub with compare-and-swap ref updates. Use GitHub Actions for verification, record exact run/commit/result, and leave unverified criteria open.
