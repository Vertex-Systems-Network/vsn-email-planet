# Project state

- Product: VSN Email Operations Platform (`Vertex-Systems-Network/vsn-email-planet`).
- Phase: P0 pre-development and P1 prototype in progress; neither is complete.
- Repository audit: public repository, default branch `main`; it had no files, commits or branches before this work. Connected account has admin/maintain/push permissions. No earlier project history was overwritten.
- Governing spec: `AI_Native_Central_Email_Platform_Master_Prompt.md`, v1.0, 1,578 lines, SHA-256 `9fcd9418a6ee6d9774a8c292fb51642ea14e679b9ae7c7f8dc6843abe922d6ed`.
- Stack direction: provisional React/Vite UI + NestJS modular API/worker + PostgreSQL. ADR-0001 remains PROPOSED pending exact ORM, queue, object-store and tenant-context proof.
- Prototype: responsive static dashboard with search/filter/detail, synthetic provider/domain records and no live provider, mailbox content, auth, DB, queue, send or admin mutation.
- Latest confirmed remote checkpoint before current bank increment: `feat/phase-0-foundation` at `915f47423ecc74c0a2a4acde204a0077cc2c0856`. GitHub API ref updates use expected-head checks; shell GitHub network is blocked.
- Node 24 workflow last passed in GitHub Actions run `42683274565` on `915f47423ecc74c0a2a4acde204a0077cc2c0856`.
- Latest local `npm run check`: pass; 13 tasks, 5 epics, 5 gates and 20 bank records validated; 6/6 Node tests pass.
- Knowledge catalog now covers all 20 domains, with current-state and evidence links; seven operational diagrams specify consent/reconciliation/send/migration/install/incident/AI flows. Diagram/code parity is pending because product flows are not implemented.
- External validation: no provider credentials or customer mailbox data used. Browser visual and accessibility review remains pending.
- Remaining P0 gates: provider/competitor coverage and agency validation; full screen-role-device-state matrix; final architecture/stack selection with vertical-slice evidence.
