# Exact next action

The P0 gate remains open. Continue the current Phase 0 work and close P0 only when every exit criterion in `backlog/phase-gates.json` has evidence. P1 foundation code already exists, but do not advance to P1-06 or begin P2/P3 until the P0 gate is explicitly closed.

1. Continue P0-02: finish bounded competitor/standards and provider policy research from primary sources; record mailbox-wide retention/erasure and remaining provider permissions. Keep buyer validation open until actual agency/MSP workflows and pricing are validated.
2. Continue P0-03: reconcile the chosen web/API/database/worker stack with existing implementation; retain evidence from real PostgreSQL 16 CI, then complete clean-boot, self-host footprint and dependency-recovery proof before closing the architecture decision.
3. Continue P0-04: verify user journeys, viewport behavior, keyboard/focus states and screen-reader behavior against the running dashboard. The shared browser could not reach the local server, so manual visual/accessibility review is still pending.
4. Keep provider credentials absent. Use synthetic data and mocks until an authorized sandbox and controlled mailbox are available.
5. Keep P0 open while external buyer or browser evidence is missing. Update task evidence and phase-gates only from verified results; do not relabel missing evidence as complete.
6. After P0 passes its exit criteria, resume P1 in backlog dependency order, beginning with the remaining authenticated identity/tenant authorization work. Keep P1-05 partially verified until broker/process recovery and bounded-load evidence exists.
7. Do not report or start P2/P3 as the active phase until P1 exit criteria are verified and the P1 gate is closed.

First resume command: `git status --short --branch && git log --oneline -5 && sed -n '1,240p' docs/PROJECT_STATE.md && sed -n '1,160p' docs/NEXT_ACTION.md`.
