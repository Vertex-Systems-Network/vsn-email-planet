# Project state

- Product: VSN Email Operations Platform (`Vertex-Systems-Network/vsn-email-planet`).
- Phase: P0 pre-development and P1 prototype in progress; neither is complete.
- Repository audit: public repository, default branch `main`; it had no files, commits or branches before this work. Connected account has admin/maintain/push permissions. No earlier project history was overwritten.
- Governing spec: `AI_Native_Central_Email_Platform_Master_Prompt.md`, v1.0, 1,578 lines, SHA-256 `9fcd9418a6ee6d9774a8c292fb51642ea14e679b9ae7c7f8dc6843abe922d6ed`.
- Stack direction: provisional React/Vite UI + NestJS modular API/worker + PostgreSQL. ADR-0001 remains PROPOSED pending exact ORM, queue, object-store and tenant-context proof.
- Prototype: responsive dashboard plus read-only HTTP API with synthetic providers, two fixture tenant identities, tenant-filtered list/detail and content-consent policy primitive. Demo tokens are public test fixtures, not real auth. No live provider, mailbox content, persistence/DB, queue, send or admin mutation.
- Last functional code checkpoint: `2ba00f5d5db977d1845bdf5e7e500a007019834d`; latest verified remote checkpoint is `b1640660f866c9dc1ad804eff9348d8bea3cfd2e` (guarded connector invocation; run `42689186984` passed).
- Node 24 workflow passed in run `42684912974` for the API code and run `42685169153` for the state checkpoint and run `42685740925` for the prior research checkpoint and run `42686590951` for inventory and `42687240875` for capability policy; both were successful on their exact commits.
- Latest local `npm run check`: pass; 15 tasks, 5 epics, 5 gates and 20 bank records validate; latest local and CI check passes 17/17 Node tests (run `42689186984`). P1-04 is done only for the synthetic read-only API contract.
- Knowledge catalog now covers all 20 domains, with current-state and evidence links; seven operational diagrams specify consent/reconciliation/send/migration/install/incident/AI flows. Diagram/code parity is pending because product flows are not implemented.
- External validation: no provider credentials or customer mailbox data used. Browser visual/accessibility review remains pending: shared Chrome could not reach executor loopback (`net::ERR_CONNECTION_REFUSED`), while local in-process HTTP tests pass.
- Remaining P0 gates: provider/competitor coverage and agency validation; machine-validated 131-route screen/role/device/state inventory is complete; final architecture/stack selection with vertical-slice evidence. PostgreSQL/worker proof is currently blocked because the workspace has no Docker/Podman/PostgreSQL binary.

- Provider capability policy helper is implemented locally in `apps/api/src/capabilities.js`; nine capability/adapter contract tests pass locally and in CI run `42689186984`. Provider integrations remain unimplemented.

- P2-01 connector invocation boundary now enforces manifest decisions before handler dispatch; P2-02 synthetic cPanel-like mock outcomes cover permission, disabled, throttled and unsupported behavior. Both remain scoped away from live provider access; P2-02 needs an authorized sandbox for external verification.
