# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH/HEAD: GitHub remote `main`; resolve its live SHA before every continuation.  
CURRENT PHASE: P0 active; P1 foundation increment in progress.

## Verified remote checkpoint

- Audit baseline: `main` at `81e5a8552d3d51d51b37f5fbdb176c7f87bfe71c`; CI run `42710075852` passed.
- PR #5 is merged. Remote `feat/phase-0-foundation` is zero commits ahead and 11 behind `main`; no unique feature work is waiting there.
- This is the VSN Email Planet repository only. VSN Orbicore and WooCommerce projects remain in their own repositories. Any Multi-Hosting integration belongs behind the documented scoped API contract.
- The prior handoff's “local integration before publication” and “push pending” wording was stale and has been removed.

## Product status

- P0: open. P0-01/P0-03/P0-05/P0-06/P0-07 verified; P0-02 and P0-04 partially verified. Research, UX evidence, and the P0 gate remain open.
- P1: open. Workspace/dashboard/health/schema work exists. P1-05 durable queue/worker/outbox primitives are partially verified. P1-06 identity/session runtime is in progress; the persistent session repository and NestJS guard are not yet wired.
- No production authentication, live provider connection, mailbox read/send, provider administration, or production readiness is claimed.
- Latest integrated research and code checkpoints are recorded in `docs/PROJECT_STATE.md` and `docs/TEST_EVIDENCE/`.

## Next action

Implement P1-06: add the checksummed PostgreSQL session migration/repository, wire `resolveSessionActor` into a NestJS guard, and add remote CI coverage for unauthenticated and cross-tenant HTTP denials plus membership revocation on native PostgreSQL. Continue independent P0-02 research and P0-04 CI-capable accessibility checks.

## Work and verification rules

- GitHub remote is the only source of truth for Codex work on this repo. Do not use local clones, worktrees, or scratch copies for implementation or verification.
- Make changes directly in GitHub, publish them to this repository, then verify the remote ref and GitHub Actions result before reporting completion.
- If remote CI cannot provide a required check, document that exact limitation and keep its acceptance criterion open. Never report a local-only change or result as complete.
