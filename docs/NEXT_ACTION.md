# Next action

Phase gates are strict. P0 remains the active phase; do not advance the active phase to P1 or start P2/P3 work until every P0 exit criterion is verified and the gate is explicitly closed.

1. Run `npm run check`, `npm run typecheck`, `npm run build`, `npm run smoke:api`, and `npm run smoke:web` before recording a code checkpoint.
2. Continue P0-02: complete the primary-source Plesk and DirectAdmin endpoint, role, and scope map; keep live checks blocked without an authorized sandbox.
3. Continue P0-03: reconcile the selected stack and data/security decisions against the existing PostgreSQL migration and durable-job implementation; obtain and record a real PostgreSQL runtime proof. PGlite tests do not substitute for that proof.
4. Continue P0-04: record customer/agency interviews when available; keep market-demand gaps labeled as hypotheses until then.
5. Keep P0-03 and P0-04 open while their external evidence is unavailable. Update task evidence and phase-gates.json only from verified results.
6. Do not implement or report P1/P2/P3 work as the active priority until P0 exit criteria pass. Existing later-phase code remains exploratory and does not close those phase gates.
7. Browser-check the synthetic inventory and detail views when a shared preview route is available; do not claim visual/accessibility review from HTTP tests.
