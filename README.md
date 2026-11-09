# VSN Email Operations Platform

A secure, provider-neutral email operations control plane. The product specification distinguishes provider administration, separately authorized mailbox-content access, and external mail systems. The platform is in Phase 0/early foundation; no live provider operation or production readiness is claimed.

## Start the local synthetic prototype

Requires Node.js 24.15.0 or newer. Run `npm run dev`, then open http://localhost:4173. The UI calls a local read-only API using published fixture identities. All organizations, providers, accounts, and statuses are synthetic; these fixture tokens are not authentication credentials and the prototype performs no provider connections or mail access.

## Verify

Run `npm run check` for machine-readable state validation and the dependency-free test suite.

## Project memory

Start with [`AGENTS.md`](AGENTS.md), [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md), [`docs/NEXT_ACTION.md`](docs/NEXT_ACTION.md), [`docs/HANDOFF.md`](docs/HANDOFF.md), and [`backlog/tasks.json`](backlog/tasks.json). The complete governing specification is [`AI_Native_Central_Email_Platform_Master_Prompt.md`](AI_Native_Central_Email_Platform_Master_Prompt.md).
