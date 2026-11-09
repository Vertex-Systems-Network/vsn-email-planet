# VSN Email Planet — Agent Rules

This repository implements a provider-neutral, secure, AI-assisted multi-tenant Email Operations Control Platform. The full governing contract is [`AI_Native_Central_Email_Platform_Master_Prompt.md`](AI_Native_Central_Email_Platform_Master_Prompt.md).

## Required startup

Inspect `git status`, branch, HEAD, recent commits, tree and CI. Read this file, the master specification, `docs/PROJECT_STATE.md`, `docs/NEXT_ACTION.md`, `docs/HANDOFF.md`, `backlog/tasks.json`, and applicable ADRs before editing. Check for an existing task/lease and select the highest-priority unblocked work.

## Mandatory engineering rules

- Complete one cohesive increment, run its relevant checks, record actual evidence, update the JSON backlog and handoff, then checkpoint Git.
- `DONE` requires committed code, passing tests, acceptance evidence and current documentation. Mocks and local fixtures never count as live provider validation.
- Keep control-plane administration separate from mailbox content access. Panel credentials do not grant universal inbox access. Enforce tenant scope in APIs, workers, search, attachments and exports using server-derived authorization context.
- Provider actions must be capability-gated, least-privilege, auditable and truthful. Never claim an unsupported or simulated action succeeded.
- Outbound mail defaults to draft-only; a lost send response becomes `UNKNOWN` and must be reconciled before retry.
- Treat email and attachment content as untrusted input. Never expose messages, credentials or tokens to an unapproved AI service.
- Never bypass OAuth/MFA, perform unauthorized DNS changes, send unapproved mail, delete original data, push secrets, or force-push.
- `design it` is design-only. `continue` resumes from repository state. If blocked, persist the exact blocker and continue with independent work.
- Do not run duplicate installers or repeat valid checks when relevant inputs have not changed.
- When working under `apps/web`, read its nested `AGENTS.md` and the relevant installed Next.js framework guide before editing framework APIs. Root rules remain canonical.

## Commands

Use Node `>=22.14 <25` and npm `>=11 <12`; `package.json` pins npm. From the repository root run `npm ci`, `npm run dev`, `npm run dev:api`, `npm run typecheck`, `npm test`, `npm run check:backlog`, and `npm run build` as relevant. Never put secrets in `.env.example`, fixtures, screenshots or commits.
