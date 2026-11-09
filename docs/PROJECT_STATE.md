# Project state

- Product: VSN Email Operations Platform (repository: `vsn-email-planet`).
- Phase: P0 pre-development plus P1 foundation prototype in progress.
- Repository audit: GitHub repository is public and was empty at start; default branch `main`; no prior branches/commits/files existed. Permission check reported admin/maintain/push access for the connected user.
- Governing spec: `AI_Native_Central_Email_Platform_Master_Prompt.md`, v1.0, 1,578 lines, SHA-256 `9fcd9418a6ee6d9774a8c292fb51642ea14e679b9ae7c7f8dc6843abe922d6ed`.
- Stack direction: dependency-free Node.js web proof-of-concept first; production stack is not yet locked pending ADR and current-version/license review.
- Prototype truth: all UI records are synthetic; no live provider access, mail content, outbound sending, or admin mutation exists.
- Authorization: development and commits/pushes to the existing project repo/feature branch are authorized. New provider/customer actions, paid resources, public production deployment, and destructive operations are not.
- Current work branch: `feat/phase-0-foundation` (created from main after preserving initial repository/spec commits).
- Phase completion: P0 `IN_PROGRESS`; P1 `IN_PROGRESS`; later phases `NOT_STARTED`.
- External validation: no provider sandbox credentials were supplied or used.
