# P1-11 repository-backed credential lookup evidence

Implementation commit: pending remote GitHub Actions  
Scope: platform credential verification and active membership lookup; no session issuance.

## Acceptance for this slice

- Query platform password credentials only; provider credentials are not used.
- Unknown, disabled, missing-credential, wrong-password, malformed-email and membership-less accounts return the same `null` result.
- Unknown/missing-credential cases perform one dummy scrypt verification to reduce timing-based account discovery.
- Return only current active memberships after a valid password. Suspended memberships are excluded; no session or actor is created.
- PostgreSQL PGlite test covers a valid user with one active and one suspended membership, wrong/unknown/disabled users and malformed short password.

Record the exact commit and Actions run here after the remote workflow completes. Bootstrap, invitation, audit, shared throttling, MFA/recovery and session issuance remain open.
