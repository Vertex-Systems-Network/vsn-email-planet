# Exact next action

1. Checkpoint the P1-04 migration increment after local verification, then inspect its native PostgreSQL CI result and fix any failure before advancing.
2. Follow with P1-06 authenticated identity and tenant authorization after the persistence boundary is concretely designed; begin with explicit threat cases and negative isolation tests.
3. Keep provider credentials absent; use mocks/synthetic fixtures until a sandbox and controlled mailbox are authorized.
4. Resume the highest-priority open backlog item and record implementation and test evidence before updating its status.

First resume command: `git status --short --branch && git log --oneline -5 && sed -n '1,240p' docs/PROJECT_STATE.md && sed -n '1,160p' docs/NEXT_ACTION.md`.
