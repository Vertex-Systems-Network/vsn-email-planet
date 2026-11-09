# Exact next action

P0 remains active and cannot be marked complete until every exit criterion in `backlog/phase-gates.json` has evidence. That gate controls phase completion and dependent provider/data-plane work; it does not suspend independent, reversible security-foundation work. Buyer interviews and manual browser checks are not additional phase gates unless they are explicitly added to `backlog/phase-gates.json`.

1. **Next implementation task: P1-06 identity/session contract.** Its declared dependencies P1-03 and P1-04 are verified. Define session, actor, membership, tenant-derived authorization context, revocation, audit, and unauthenticated/cross-tenant denial contracts before choosing an auth library. Keep this work synthetic/local and do not expose customer data.
2. **P0-03 stack reconciliation:** resolve the competing Next.js/NestJS and dependency-free Node prototype paths. Record one canonical runnable path and a migration/deprecation decision before expanding either implementation.
3. Continue P0-02 source-backed provider retention/permission research and P0-04 browser/accessibility evidence where tools allow. If browser access or buyer interviews remain unavailable, record those criteria as pending and proceed with independent work; do not add them as hard phase gates by prose.
4. Keep provider credentials absent. Use synthetic data and mocks until an authorized sandbox and controlled mailbox are available.
5. Keep P0 open until the actual criteria in `backlog/phase-gates.json` pass. Keep P1-05 partially verified until broker/process recovery and bounded-load evidence exists.
6. Do not start P2/P3 connector or mail-data-plane releases until the P1 exit criteria and authorization gates pass. Continue local contracts, safety infrastructure, and tests when independent and reversible.

First resume command: `git status --short --branch && git log --oneline -5 && sed -n '1,240p' docs/PROJECT_STATE.md && sed -n '1,160p' docs/NEXT_ACTION.md && cat docs/EXECUTION_PLAYBOOK.md`.
