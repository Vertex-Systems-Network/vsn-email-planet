# Backlog dashboard

The authoritative task records and legal status transitions are in `backlog/tasks.json`; phase exit criteria are in `backlog/phase-gates.json`. Validate structure with `npm run check:backlog` after edits.

## Current priority

| ID | Priority | Work | State | Next action |
|---|---|---|---|---|
| P0-01 | P0 | Repository and history audit | VERIFIED | Preserve existing commits; no repeat audit needed |
| P0-02 | P0 | Research bank | PARTIALLY_VERIFIED | Complete dated competitor/provider research |
| P0-05 | P0 | Synthetic feasibility workflow | VERIFIED | Review prototype and close remaining P0 evidence gates |
| P1-01 | P1 | Workspace, rules, CI | PARTIALLY_VERIFIED | Resolve remaining setup/documentation gaps |
| P1-02 | P1 | Dashboard | PARTIALLY_VERIFIED | Complete visual and accessibility review |
| P1-03 | P1 | API health process | VERIFIED | Extend beyond process health only after persistence increment |
| P1-09 | P1 | CI and verification evidence | PARTIALLY_VERIFIED | Add pending integration/browser/licensing gates |
| P1-04 | P0 | Tenant-keyed PostgreSQL schema/migrations | VERIFIED | Maintain immutable migrations; production rollout is a separate gate |

No product task is marked `DONE`; verified means only that the specific stated acceptance evidence is satisfied. Status changes must follow the transition map and include status history in `backlog/tasks.json`.
