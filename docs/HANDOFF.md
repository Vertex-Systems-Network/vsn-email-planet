# Resumable handoff

PROJECT: VSN Email Planet — Universal Email Operations Control Platform  
REPOSITORY: `Vertex-Systems-Network/vsn-email-planet`  
BRANCH: GitHub remote `main`; resolve its live SHA before continuation.  
STATUS: P0 and P1 open; P2–P12 gated and not started.

## Repository boundary

This repository contains only VSN Email Planet. Keep Orbicore, WooCommerce and unrelated products in their own repositories. Integrate with Multi-Hosting only through its versioned scoped API. GitHub remote is the source of truth: make changes and run checks through GitHub; do not use local clones, worktrees or scratch copies for implementation/verification.

## Plan structure

- `backlog/phase-gates.json` is the single machine-readable source for P0–P12 criteria and task mapping.
- `backlog/epics.json` mirrors phase grouping; `backlog/tasks.json` is the status ledger.
- Roadmap-only tasks remain DISCOVERED. Do not report planned work as implemented or tested.
- Update project state only with evidence tied to a remote commit and Actions run.

## Next actions

1. Inspect the plan-repair commit's GitHub Actions result. Keep P0-07 IN_PROGRESS unless state/backlog validators and workflow pass.
2. Continue P0-02 primary-source research and P0-04 UX evidence independently where possible.
3. Continue P1-06 persistent sessions and API authorization guard; P1 remains open until tenant-isolation and revocation checks pass remotely.
4. Do not start P2/P3 implementation until P1 security prerequisites and phase criteria are met.

## Safety and reporting

Provider capabilities and permissions are operation-specific. Hosting credentials never imply content consent. Sending is policy-gated; uncertain sends require reconciliation. Never claim live integration, erasure, release, phase completion or test success without commit-specific evidence. If remote CI cannot exercise a criterion, record the limitation and leave it open.
