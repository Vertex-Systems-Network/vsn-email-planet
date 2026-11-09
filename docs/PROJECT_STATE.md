# Project state

- Product: VSN Email Operations Platform (`Vertex-Systems-Network/vsn-email-planet`).
- Phase: P0 pre-development and P1 foundation prototype in progress; neither phase is complete.
- Repository audit: public repository, default branch `main`; it had no files, commits or branches before this work. Connected account has admin/maintain/push permissions. No earlier project history was overwritten.
- Governing spec: `AI_Native_Central_Email_Platform_Master_Prompt.md`, v1.0, 1,578 lines, SHA-256 `9fcd9418a6ee6d9774a8c292fb51642ea14e679b9ae7c7f8dc6843abe922d6ed`.
- Stack direction: provisional React/Vite UI + NestJS modular API/worker + PostgreSQL. ADR-0001 is PROPOSED; ORM/queue/object store and vertical-slice proof remain open.
- Prototype: responsive static dashboard, search/filter/detail states, synthetic provider/domain records, no real provider access, message content, auth, DB, queue, send or admin mutation.
- Last research/code checkpoint before this state-only update: `feat/phase-0-foundation` at `de10775593ac60771a0b5cada7ea583a0ddd9b70`; update-ref was confirmed and branch files were fetched.
- GitHub Actions run `42683074539` passed for that commit on Node 24. The updated Node 24 workflow is now verified.
- Local `npm run check` passed: state ledger valid (12 tasks, 5 epics, 5 phase gates); 4/4 Node tests pass.
- Authorization: local development and authorized feature-branch pushes permitted. No provider/customer actions, paid resources, production deployment, destructive operation, or external send is authorized.
- External validation: no provider sandbox credentials or customer mailbox data used.
- Remaining P0 gates: finish provider/competitor evidence; complete detailed UX/role/device/state matrix and browser/accessibility review; test ORM/queue choice in a PostgreSQL vertical slice; finalize stack ADR.
