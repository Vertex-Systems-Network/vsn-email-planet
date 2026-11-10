# Backlog dashboard

Authoritative tasks and legal status transitions: `backlog/tasks.json`. Per-phase scope and exit criteria: `backlog/phase-gates.json`. Epic grouping: `backlog/epics.json`. GitHub Actions validates the state and backlog.

## Phase status

| Phase | State | Summary |
|---|---|---|
| P0 | IN_PROGRESS | Research, feasibility and UX evidence remain open; plan consistency is verified. |
| P1 | IN_PROGRESS | Foundation exists; session/actor guard is partly verified; full login, audit, resource authorization and job reauthorization remain open. |
| P2 | NOT_STARTED | Connector, inventory and permission-boundary work is roadmap only. |
| P3 | NOT_STARTED | Sync, inbox, search and safe-send work is roadmap only. |
| P4–P12 | NOT_STARTED | Separate gates and task mappings exist; no implementation is claimed. |

## Highest-priority open work

| ID | State | Next action |
|---|---|---|
| P0-02 | PARTIALLY_VERIFIED | Continue dated primary-source research; buyer validation remains separate. |
| P0-04 | PARTIALLY_VERIFIED | Complete route/state coverage and available CI viewport/keyboard checks. |
| P0-07 | VERIFIED | Keep plan coverage and validator guardrails enforced; reopen on drift. |
| P1-06 | PARTIALLY_VERIFIED | Umbrella outcome; remaining auth work is split into P1-11–14. |
| P1-11 | READY | Implement invite-only local bootstrap/login, MFA/recovery and session/CSRF issuance from ADR-0003. |
| P1-12 | READY | Add append-only authentication/authorization denial auditing and redaction/fail-closed tests. |
| P1-13 | READY | Enforce tenant scope and non-disclosing behavior on protected resource queries. |
| P1-14 | READY | Reauthorize membership, ownership and grants immediately before queued-job dispatch. |

P2–P12 remain planned unless task records later show evidence-backed progress. VERIFIED satisfies only the exact task acceptance criteria; DONE also requires committed implementation and applicable acceptance evidence. Follow `backlog/tasks.json` transitions.
