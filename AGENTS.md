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

## Commands
- `node scripts/validate-state.mjs` validates backlog/state schemas.
- `node --test` runs the built-in Node test suite.
- `npm run dev` serves the dependency-free prototype on port 4173.

See `docs/PROJECT_STATE.md` and `docs/NEXT_ACTION.md` for current status. Model-specific files must defer to this file.
