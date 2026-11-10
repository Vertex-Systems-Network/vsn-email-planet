# P1-11 repository-backed credential lookup evidence

Verified commit: `a507f7f9c1553ff8710f2070f97f30e26e4d12a5`  
GitHub Actions: [run 42917902168](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42917902168) — **success**

## Verified

- Credential lookup reads only platform password credentials; provider connection secrets are not involved.
- Unknown/malformed email, missing credential, disabled user, incorrect password and no active membership return the same `null` result.
- The unknown/missing-credential path performs one dummy scrypt verification.
- Only current active memberships with recognized roles are returned after correct password verification. Suspended memberships are excluded.
- Returned user/membership data is immutable and contains no password verifier.
- Full GitHub Actions run 42917902168 passed typecheck, unit tests, PGlite/PostgreSQL checks, backlog/state validation, build, web/API smoke and high-severity dependency audit.

## Limits

This helper is not an HTTP login endpoint and does not issue a session. Bootstrap, invitation, shared throttling, auth/denial audit, MFA/recovery, CSRF/session issuance remain unimplemented. P1-11 and parent P1-06 remain PARTIALLY_VERIFIED.
