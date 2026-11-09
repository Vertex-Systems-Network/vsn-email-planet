# Backlog dashboard

The authoritative task records and legal status transitions are in `backlog/tasks.json`; phase exit criteria are in `backlog/phase-gates.json`. Validate structure with `npm run check:backlog` after edits.

## Current priority

| ID | Priority | Work | State | Next action |
|---|---|---|---|---|
| P0-01 | P0 | Repository and history audit | VERIFIED | Preserve existing commits; no repeat audit needed |
| P0-02 | P0 | Research bank | PARTIALLY_VERIFIED | Continue primary-source provider-policy review; buyer interviews remain separately authorized external validation |
| P0-05 | P0 | Synthetic feasibility workflow | VERIFIED | Review prototype and close remaining P0 evidence gates |
| P0-06 | P0 | Product screen, role, device and state inventory | VERIFIED | Revisit only when route or access requirements change; keep implementation status tied to UI evidence |
| P0-07 | P0 | Enforce autonomous execution and plan consistency | VERIFIED | Preserve guardrails and keep validator enforced |
| P0-03 | P0 | Stack decision and feasibility | TESTING | Confirm full CI for canonical Next/Nest/PostgreSQL baseline; benchmarks remain open |
| P0-04 | P0 | UX and screen foundation | PARTIALLY_VERIFIED | Add CI-runnable viewport/keyboard checks; manual browser review remains pending |
| P1-01 | P1 | Workspace, rules, CI | PARTIALLY_VERIFIED | Continue with the exact executable action in `docs/NEXT_ACTION.md` |
| P1-02 | P1 | Dashboard | PARTIALLY_VERIFIED | Run viewport and keyboard checks through a browser runner that can reach the app |
| P1-03 | P1 | API health process | VERIFIED | Extend beyond process health only after persistence increment |
| P1-09 | P1 | CI and verification evidence | PARTIALLY_VERIFIED | Upload uniquely named verification report with tested commit provenance |
| P1-04 | P0 | Tenant-keyed PostgreSQL schema/migrations | VERIFIED | Maintain immutable migrations; production rollout is a separate gate |
| P1-05 | P1 | Durable job lease/idempotency/outbox primitives | PARTIALLY_VERIFIED | Split broker adapter, crash recovery, and bounded-load work after P1-06 contract |
| P1-06 | P1 | Identity and tenant authorization | IN_PROGRESS | Resolve P0-03 stack choice, then implement and test contract in `docs/API_CONTRACTS.md` |

No product task is marked `DONE`; verified means only that the specific stated acceptance evidence is satisfied. Status changes must follow the transition map and include status history in `backlog/tasks.json`.
