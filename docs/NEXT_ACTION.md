# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote `main`; do not implement or verify from a local clone/worktree.

## Immediate checkpoint

1. Read live `main` and inspect the plan-repair commit.
2. Confirm GitHub Actions ran for that exact SHA and inspect required checks.
3. If it passes, record run URL and tested SHA in the audit evidence, then close P0-07 with legal status history. If it fails, fix that remote-state issue and keep P0-07 open.

## Active work after the checkpoint

- Continue P0-02 with dated primary-source provider research; distinguish documented behavior from tenant-specific validation.
- Continue P0-04 UX/screen-state evidence. Keep manual visual/screen-reader review open if no reachable remote browser runner exists.
- Continue P1-06 session persistence and NestJS authorization guard; prove unauthenticated denial, cross-tenant denial and membership-revocation denial in remote CI.
- Keep P2/P3 gated until P1 identity, tenant boundary and persistence prerequisites pass. Do not mark roadmap work implemented.

## Remote-only publication

Read current refs and target files before edits. Create cohesive GitHub commits with compare-and-swap ref updates. Use GitHub Actions for verification; record exact run, commit, result and unavailable checks. If `main` advances during an edit, reread and reapply only intended changes.
