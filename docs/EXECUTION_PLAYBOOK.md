# Execution playbook

This document turns the master specification into a repeatable work loop. `AGENTS.md` and the master specification remain authoritative; this file closes execution gaps found during the 2026-11-09 plan audit.

## Root-cause findings

The master specification already says to continue autonomously, skip blocked tasks, test increments, and preserve exact checkpoints. The failure was in translating that intent into enforceable repository behavior:

- A user continuation signal could receive a status summary while the agent stopped instead of selecting another task.
- `docs/NEXT_ACTION.md` pointed first to manual browser work that the current environment could not perform, although independent work remained available.
- Several backlog entries combined multiple systems into one broad task, making progress appear tiny and leaving no clear acceptance-sized deliverable.
- The backlog validator checked basic fields and status history only. It accepted duplicate evidence paths and stale status/blocker claims; P1-01 still said remote CI was pending after successful remote runs.
- CI evidence caught an invalid JSON blob after publication, but no pre-push check verified the exact staged tree contents.
- The latest `docs/NEXT_ACTION.md` added buyer interviews and unavailable browser review as prerequisites to advancing P1, although neither appears in the machine-readable P0 exit criteria and the master prompt says to continue independent work. This contradiction could hold the project at P0 indefinitely without permission for outreach or a reachable browser.
- The repository now contains both the original Next.js/NestJS implementation and a dependency-free Node prototype; the active plan had not named an acceptance task to reconcile which path is canonical before more feature work.

These are workflow and plan-quality defects. They do not make test infrastructure unnecessary: local tests and GitHub Actions did run, but the plan did not require the agent to pivot promptly when one test environment was unreachable. The P0 gate is still real; the fix is to honor its explicit criteria without inventing extra hard gates and to allow safe foundational work with verified dependencies to proceed in parallel.

## Required execution loop

1. Read the exact task record and dependency status. Select the highest-priority task that is `READY`, `IN_PROGRESS`, or `PARTIALLY_VERIFIED` and has an executable next action.
2. If only one acceptance criterion is blocked, record its concrete cause and attempted workaround. Mark the criterion blocked, then continue other criteria or choose another unblocked task. Never let a browser, external interview, live account, credential, or user response hold unrelated local work.
3. Before implementation, define one reviewable output: a code path, tested behavior, reproducible script, design artifact, or a decision record with primary evidence. Split broad work until its tests and likely changed files are obvious.
4. Implement that output in the same work session. Run relevant tests; when changing shared infrastructure, backlog rules, auth, tenant boundaries, provider mutations, or release gates, run the full required local and CI suite.
5. Save command output and limits in a unique evidence report. Update task status, evidence paths, `last_verified_commit`, blockers, risks, and `next_action` together. A status update without new evidence cannot advance verification state.
6. Review the exact diff and staged tree, run validation, commit, push only to the authorized branch, confirm the remote ref and CI result, then update the handoff. Do not call an untested or unpushed change complete.
7. On `...`, `continue`, or a progress ping during active work, briefly answer any direct question and resume this loop. Do not end with a progress-only response while repository work remains unblocked and executable.

## Plan-quality gate

Every active task needs:

- A single outcome and a bounded scope. Split work across unrelated services or release gates.
- Explicit dependencies that match actual security and architecture prerequisites.
- Observable acceptance criteria, including negative/failure behavior where risk warrants it.
- A named test command/fixture and target environment.
- An evidence path and a concrete next action naming a file, command, test, or decision.
- Exact blockers separated from risks. A risk is not a blocker; an unavailable external environment blocks only tests that require it.

Before each checkpoint, reject stale contradictions: `BLOCKED_*` requires a blocker; `VERIFIED`/`DONE` cannot retain open blockers; evidence paths must be unique; dependencies must be valid and acyclic; remote CI state must not say pending after a verified pass. The validator and CI are the enforcement point, not an informal checklist.

## Phase and progress reporting

- Do not report an invented percentage. If the user asks for phase progress, count tasks in the phase by explicit status and separately list weighted verified acceptance criteria; preserve the denominator and caveats.
- A phase gate may prevent release or dependent security-sensitive work. It must not prevent independent, reversible implementation that can be tested locally.
- Close product work only when the specific acceptance criteria have evidence. Keep phase and product-release state open until every mandatory gate passes.
- Give the user working artifacts and verified outcomes first. Mention blockers only with the next workaround or independent task already selected.

## Anti-stall rule

When an environment tool fails, make at most one focused diagnosis and one reasonable fallback attempt. If the same capability remains unavailable, record the failure and move on. Do not repeat status messages, retries, or environment waits without new evidence.


## Remote-only rule for Codex project work

The user designated GitHub as the sole workspace/source of truth for this project. Codex must read and change files through GitHub, publish each authorized increment to `Vertex-Systems-Network/vsn-email-planet`, and verify the remote commit and GitHub Actions run before reporting completion. Do not use a local clone, worktree, or scratch copy for repository implementation or tests. If the remote CI environment cannot perform a required check, record the exact gap and leave that acceptance criterion open. Resolve the live remote ref before each edit and use a compare-and-swap update so concurrent work is never overwritten.
