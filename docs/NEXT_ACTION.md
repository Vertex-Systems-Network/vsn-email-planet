# Exact next action

1. Commit the verified foundation on `main`, push it, and confirm the remote `main` ref and GitHub Actions run.
2. Continue P1-06 identity/session and tenant authorization design, starting with explicit threat cases and negative isolation tests.
3. Keep provider credentials absent; use mocks/synthetic fixtures until a sandbox and controlled mailbox are authorized.
4. Resume the highest-priority open backlog item and record implementation and test evidence before updating its status.

First resume command: `git status --short --branch && git log --oneline -5 && sed -n '1,240p' docs/PROJECT_STATE.md && sed -n '1,160p' docs/NEXT_ACTION.md`.
