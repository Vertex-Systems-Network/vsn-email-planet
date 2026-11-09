# Project state

Last updated: 2026-11-09

## Verified repository facts

- GitHub repository: `Vertex-Systems-Network/vsn-email-planet`, public, default branch `main`.
- History audit correction: the remote was **not** commit-empty. `main` contained a README initialization (`4758f49`), a zero-byte governing-spec placeholder (`ad2cf39`), and the complete 1,578-line specification (`9182b40`). There was no earlier product code, but all three commits are preserved in the current history. The first local clone had not fetched the current remote branch; this was detected and corrected before publishing implementation.
- The initial README called the project “VSN Orbicore Email Operations Platform”; the current requested product name, VSN Email Planet, is used in the maintained project docs and app.
- Current checkout is the authorized `main` branch. Development and push authorization are present in the project request.
- Governing spec: `AI_Native_Central_Email_Platform_Master_Prompt.md` (v1.0, 2026-11-09), 1,578 lines / 139,581 bytes; read in full.
- Initial stack decision: npm workspaces, Next.js App Router + React for web, NestJS API, TypeScript, future PostgreSQL/Redis integration. See ADR-0001.

## Delivery state

- P0: In progress. Repository/history audit is accurate and prior commits are preserved; research snapshots and a synthetic feasibility slice are recorded. Complete market/provider/security/design research and a feasibility prototype review remain open.
- P1: In progress. The repository foundation, synthetic responsive dashboard, process-only health route, tenant-keyed PostgreSQL control-plane schema and checksummed migration runner are implemented. API persistence is not wired into request handling; authentication, queue and live provider adapters remain open.
- Local verification: fresh `npm ci`, typecheck, 11 automated tests (including PGlite migrations), backlog validation, production build, HTTP smoke checks and high-severity npm audit passed. See `docs/TEST_EVIDENCE/2026-11-09-initial-checkpoint.md`.
- GitHub Actions passed for the bootstrap and PostgreSQL increments; native PostgreSQL 16 checks passed on `97582d1f8f5851c755141035b64d71104f364359`, including the real `pg` migration runner and cross-tenant foreign-key denial. Research checkpoint `720b912f6281ef2ce5ef8debf4dee665d4092fbe` also passed CI.
- Latest pre-checkpoint GitHub Actions run: current `main` at `f65f0efba54540492dd0f25ba97e597cc3810e2b`, run `42690403340`, completed successfully. The Phase 0 paper/standards register now includes scoped findings and limitations for distributed processing, CRDT synchronization, multi-tenant isolation and OAuth; it does not close P0.
- Provider deletion documentation now distinguishes Gmail permanent delete from trash, Microsoft Graph purge/hold behavior, and cPanel Exim queue deletion. These are documentation findings only; mailbox-wide retention and all live behavior remain unverified. Research/docs commit `44c027b9e310253a66887bb664f1b880fb46c199` passed GitHub Actions run `42690990759`.
- Visual browser review and accessibility audit remain pending. The dashboard is explicitly labeled synthetic and states that no providers are connected.
- Product runtime state: local synthetic demo only. No real provider connection, mail read/send, mailbox administration, migration or backup functionality is implemented.
- Security state: not production-ready; no production authentication or tenant persistence. The sample-domain policy functions are defense-in-depth examples, not a substitute for server authentication.
- License: proprietary notice retained; the owner has not selected a public license.

## Current blockers and limits

- No authorized provider sandbox credentials or controlled test mailbox; live provider validation is therefore unavailable. No secret values are recorded here.
- Pricing and differentiator claims require further primary-source market research and user validation.
- OAuth consent/verification, privacy/legal review and any provider app registrations are external release dependencies.

## Next action

Follow `docs/NEXT_ACTION.md`. Preserve the existing three-commit history; do not repeat the completed repository audit.
