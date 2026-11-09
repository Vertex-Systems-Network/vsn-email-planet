# Project state

- Product: VSN Email Operations Platform (`Vertex-Systems-Network/vsn-email-planet`).
- Phase: P0 pre-development and P1 foundation prototype in progress; neither phase is complete.
- Repository audit: public repository, default branch `main`; it had no files, commits or branches before this work. Connected account has admin/maintain/push permissions. No earlier project history was overwritten.
- Governing spec: `AI_Native_Central_Email_Platform_Master_Prompt.md`, v1.0, 1,578 lines, SHA-256 `9fcd9418a6ee6d9774a8c292fb51642ea14e679b9ae7c7f8dc6843abe922d6ed`.
- Stack direction: provisional React/Vite UI + NestJS modular API/worker + PostgreSQL; ADR remains PROPOSED. ORM, queue, blob store and production versions remain subject to a vertical-slice proof.
- Prototype: responsive static dashboard, search/filter/detail states, synthetic provider/domain records, no actual provider access, message content, auth, DB, queue, send or admin mutation.
- Latest last-confirmed remote checkpoint: `feat/phase-0-foundation` at `53d8e479bddaa6bcb82ae41c4828cdd7a8a6da7e`. Current research/runtime follow-up is locally checked and is being checkpointed next.
- Push route: connected GitHub API; shell network cannot reach GitHub. Previous ref update and file readback confirmed.
- CI evidence: run `42682210139` succeeded for commit `53d8e479bddaa6bcb82ae41c4828cdd7a8a6da7e` on Node 22. A workflow update now targets Node 24 and requires a fresh run.
- Local verification after current changes: `npm run check` passed; state ledger valid (12 tasks, 5 epics, 5 gates); 4/4 Node tests passed.
- Authorization: local development and authorized feature-branch pushes permitted. New provider/customer actions, paid resources, production deployment, destructive operations, or external sends are not.
- External validation: no provider sandbox credentials or customer mailbox data used.
- Remaining P0 gates: finish provider/competitor evidence, complete UX/role/device/state matrix, finalize exact ORM/queue decision through a small proof, and run usability/accessibility review.
