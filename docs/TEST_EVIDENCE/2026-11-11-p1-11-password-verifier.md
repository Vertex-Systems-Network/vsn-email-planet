# P1-11 password verifier slice

Date: 2026-11-11  
Repository: `Vertex-Systems-Network/vsn-email-planet`  
Scope: versioned password verifier helper and credential schema only.

## Implementation

- `apps/api/src/password-auth.js` creates/verifies a versioned scrypt verifier with N=32768, r=8, p=3, 64 MiB max memory, 16-byte random salt and 32-byte derived key. Parsing accepts only that exact scheme/profile and canonical base64url fields; comparison is constant-time.
- Password creation enforces at least 15 and at most 1024 Unicode code points, a 4096-byte bound, a small common-password blocklist, and exact account-email context rejection. Input is not trimmed or normalized before hashing.
- `0006_platform_password_credentials.sql` stores one verifier row per platform user and constrains the stored verifier format. It is separate from provider credentials.
- No login, bootstrap, invitation, MFA, recovery, throttling, audit integration or session issuance is implemented by this slice.

## Runtime decision

OWASP prefers Argon2id and lists scrypt N=2^15, r=8, p=3 as a fallback profile. The repository supports Node 22.14–24.x; Node 24's built-in Argon2 API is still Release Candidate. ADR-0003 therefore selects stable Node `crypto.scrypt` for this increment and records the migration trigger. The work-factor still requires deployment benchmarking and shared request rate-limiting before login is exposed.

## Verification

GitHub Actions run/result and verified commit will be added only after the remote workflow completes. Do not report this increment as verified before that evidence is present.
