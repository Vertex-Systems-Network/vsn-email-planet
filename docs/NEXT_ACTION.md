# Exact next action

1. Continue P0-02: review the synthetic dashboard against the UI shortlist and perform keyboard/accessibility checks; map mailbox-wide retention/erasure and remaining provider permissions. Message deletion semantics are documented in `docs/RESEARCH/PROVIDER_LIMITS.md`, with provider-policy and live-account limitations called out. Keep buyer validation explicitly open.
2. Close remaining Phase 0 design and feasibility gates before implementing P1-06 authenticated identity and tenant authorization.
3. Keep provider credentials absent; use mocks/synthetic fixtures until a sandbox and controlled mailbox are authorized.
4. P1-05 is `PARTIALLY_VERIFIED`: PostgreSQL 16 concurrent mailbox claims and generic worker execution passed. The callback publisher is now in local testing; verify it on PostgreSQL 16, then add a broker adapter/provider-independent handlers and test multi-process interruption/recovery and bounded load. This is not a production queue selection.

First resume command: `git status --short --branch && git log --oneline -5 && sed -n '1,240p' docs/PROJECT_STATE.md && sed -n '1,160p' docs/NEXT_ACTION.md`.
