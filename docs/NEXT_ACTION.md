# Exact next action

1. Continue P0-02/P1-02: run visual browser, narrow viewport, keyboard and screen-reader review of the synthetic dashboard, including the mobile navigation changes. Map mailbox-wide retention/erasure and remaining provider permissions. Keep buyer validation explicitly open.
2. Close remaining Phase 0 design and feasibility gates before implementing P1-06 authenticated identity and tenant authorization.
3. Keep provider credentials absent; use mocks/synthetic fixtures until a sandbox and controlled mailbox are authorized.
4. P1-05 is `PARTIALLY_VERIFIED`: concurrent claims, worker execution and callback publisher passed PostgreSQL 16 CI. Implement a broker adapter/provider-independent handlers and test multi-process interruption/recovery and bounded load before any production queue decision.

First resume command: `git status --short --branch && git log --oneline -5 && sed -n '1,240p' docs/PROJECT_STATE.md && sed -n '1,160p' docs/NEXT_ACTION.md`.
