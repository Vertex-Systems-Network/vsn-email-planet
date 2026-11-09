# Backlog dashboard

The authoritative task records and legal status transitions are in `backlog/tasks.json`; phase exit criteria are in `backlog/phase-gates.json`. Validate structure with `npm run check:backlog` after edits.

## Current priority

| ID | Priority | Work | State | Next action |
|---|---|---|---|---|
| P0-05 | P0 | Synthetic feasibility workflow | IMPLEMENTED_UNVERIFIED | Install and run local checks |
| P1-01 | P1 | Workspace, rules, CI | IMPLEMENTED_UNVERIFIED | Verify scripts and fresh install |
| P1-02 | P1 | Dashboard | IMPLEMENTED_UNVERIFIED | Build and inspect visual/accessibility behavior |
| P1-03 | P1 | API health process | IMPLEMENTED_UNVERIFIED | Run HTTP smoke test |
| P0-02 | P0 | Research bank | PARTIALLY_VERIFIED | Complete dated competitor/provider research |
| P1-06 | P0 | Auth and tenant authorization | READY | Design trusted identity/session model |

No task in this initial scaffold is marked `DONE`. Status changes must follow the transition map and include changed-by/changed-at history in task `notes` or evidence.
