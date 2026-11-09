# Exact next action

P0 remains open until the explicit criteria in `backlog/phase-gates.json` have evidence. That gate controls phase completion and dependent provider/data-plane work; it does not suspend independent, reversible security-foundation work. Browser access and buyer validation are separate open evidence tasks, not prerequisites for P1-06.

1. **P1-06 identity/session implementation:** implement server-side session resolution and tenant authorization on the NestJS API using the rules in `docs/API_CONTRACTS.md`. Start with one bounded increment: derive the actor only from a verified server-side session and ignore caller-supplied organization/role fields. Add missing/invalid-session and forged-organization tests before adding routes.
2. Extend coverage for revoked membership, non-disclosing cross-tenant direct-ID reads, list/search scoping, and queued-job reauthorization. Audit events must exclude secrets and content. Keep unimplemented identity-provider selection, credential verification and production key management explicit.
3. Keep P0-03 evidence active: measure local self-host footprint and dependency-outage recovery; do not hold P1-06 on these measurements. Keep P0-02 buyer interviews/pricing and P0-04 browser/accessibility review open without inventing evidence.
4. Keep provider credentials absent. Use synthetic data and mocks until an authorized sandbox and controlled mailbox are available.
5. Update task evidence and the handoff from actual verification only. Do not start P2/P3 provider or mail-data-plane releases until the P1 authorization criteria pass.

First resume command: `git status --short --branch && git log --oneline -5 && sed -n '1,240p' docs/PROJECT_STATE.md && sed -n '1,160p' docs/NEXT_ACTION.md && cat docs/EXECUTION_PLAYBOOK.md`.
