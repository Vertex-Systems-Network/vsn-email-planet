# Repository instructions

This repository builds a provider-neutral, secure, multi-tenant Email Operations Control Platform. The canonical product and safety contract is `AI_Native_Central_Email_Platform_Master_Prompt.md` (read completely). Before editing, inspect Git status/history, `docs/PROJECT_STATE.md`, `docs/NEXT_ACTION.md`, `docs/HANDOFF.md`, backlog, and relevant ADRs.

## Required workflow
- Work one cohesive, authorized increment at a time. Preserve existing behavior and document decisions.
- Provider access is capability- and permission-specific. A hosting-panel credential does not imply mailbox-content consent. Never label mock fixtures as live integrations.
- Enforce tenant authorization at every API, worker, search, object, and AI boundary. Treat email content as untrusted input. Sending stays draft-only unless narrowly authorized by policy.
- Do not claim a test, feature, phase, integration, artifact, or remote push passed unless its evidence exists. `DONE` requires committed code, applicable passing tests, acceptance evidence and docs.
- Avoid secrets in files, logs, prompts, and commits. No destructive production actions, unauthorized mail access, DNS cutover, or unapproved external sending.
- On resume, inspect current branch/HEAD and exact task state; do not rerun valid checks or duplicate in-flight work. Use small checkpoint commits and update backlog/evidence/handoff.
- `design it` is design-only. Continue the highest-priority unblocked task otherwise. Record external validation blockers and proceed with synthetic fixtures.
- A user continuation signal (`...`, `continue`, `?`) means resume execution. Answer a direct question briefly, then work on a concrete repository task; do not send progress-only turns while unblocked work remains.
- A blocker pauses only the criterion that needs the unavailable resource. Record the observed failure and one fallback attempt, then move to the next independent task. Never make buyer interviews, live credentials, or browser access a prerequisite for unrelated authorized design, implementation, remote CI checks, or research.
- Phase gates are defined only by `backlog/phase-gates.json`. Do not add extra hard gates in prose. External validation remains visible as a blocker/risk on the affected task and cannot block unrelated work. Security prerequisites still block dependent data-plane/provider work.
- Active backlog tasks need a bounded outcome, dependencies, observable acceptance criteria, named tests/fixtures, evidence path, exact blockers, and executable next action. Split work that spans independent subsystems or failure modes.
- Before a checkpoint, validate task consistency and the exact Git tree. If CI detects a repository-state error, fix it in a direct GitHub follow-up commit, let GitHub Actions rerun the failing check, and preserve both failure and recovery evidence.
- Before ending a turn, continue the highest-priority unblocked task when possible. Otherwise state the exact next file/command and the concrete tool or authorization limit.

## Commands
- `node scripts/validate-state.mjs` validates backlog/state schemas.
- `node --test` runs the built-in Node test suite.
- `npm run dev` serves the dependency-free prototype on port 4173.

See `docs/PROJECT_STATE.md` and `docs/NEXT_ACTION.md` for current status. Model-specific files must defer to this file.


## Canonical repository and remote-only workflow

- This repository is exclusively **VSN Email Planet**: `Vertex-Systems-Network/vsn-email-planet`. Do not place code, plans, artifacts, or task records for VSN Orbicore, WooCommerce plugins, or other products here. Work for another product belongs in that product's own repository.
- VSN Email Planet may integrate with the separate Multi-Hosting Control Platform only through the documented, versioned API and scoped identity contract. Do not copy that product's source, backlog, or implementation into this repository.
- For Codex work on this project, GitHub's remote repository is the sole source of truth. Make repository changes directly through GitHub; do not create or edit a local clone, worktree, or scratch copy.
- Publish every authorized code or documentation change to this repository before reporting it as completed. Verify the resulting remote branch/ref and its GitHub Actions checks. Do not report local-only changes as project progress.
- Run verification through the repository's GitHub Actions workflow. If a required check cannot run remotely, record the exact missing check and leave its acceptance criterion open; do not substitute an unpushed local result.
- Before every change, resolve the live `main` SHA and inspect the target file at that ref. Preserve unrelated history and use a compare-and-swap ref update; if the remote head changes, reread and rebase the intended edit instead of overwriting it.
