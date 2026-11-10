# P1-11 password verifier slice

Date: 2026-11-11  
Repository: `Vertex-Systems-Network/vsn-email-planet`  
Verified commit: `8b465df558fda26add9d95672d3feec76eb2e32c`  
GitHub Actions: [run 42916848390](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42916848390) — **success**

## Implemented and verified

- `apps/api/src/password-auth.js` creates and verifies a versioned scrypt verifier with N=32768, r=8, p=3, 64 MiB maximum memory, a random 16-byte salt and a 32-byte derived key.
- Parsing accepts only the exact supported scheme and parameters, canonical base64url salt/key fields, and a constant-time key comparison.
- Password creation enforces at least 15 and at most 1024 Unicode code points, a 4096-byte bound, a small common-password blocklist, and exact account-email context rejection. Password input is not trimmed or normalized before hashing.
- `0006_platform_password_credentials.sql` adds a one-to-one platform-user credential table and constrains its verifier string format. Platform credentials remain separate from provider credentials.
- Full GitHub Actions run 42916848390 passed typecheck, Node tests, PostgreSQL/PGlite checks, backlog/state validation, build, web/API smoke and high-severity dependency audit.

## Runtime decision

OWASP prefers Argon2id and lists scrypt N=2^15, r=8, p=3 as an accepted fallback. The repository supports Node 22.14–24.x; the Node 24 built-in Argon2 API remains Release Candidate. ADR-0003 therefore selects stable Node `crypto.scrypt` for the current runtime and records the conditions for reconsidering Argon2id.

## Still open

This evidence does not verify login or any account creation flow. Bootstrap, invitation, full compromised-password blocklist provenance, shared rate limiting, MFA/recovery, authentication/denial audit integration, and session/CSRF issuance remain unimplemented. P1-11 is PARTIALLY_VERIFIED for the verifier/schema slice only; P1-06 remains PARTIALLY_VERIFIED.
