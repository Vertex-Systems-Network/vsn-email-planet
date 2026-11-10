# ADR-0003: Self-hosted operator authentication and session issuance

- Status: `ACCEPTED_FOR_P1_BASELINE`
- Date: 2026-11-11
- Decision owners: project maintainers
- Scope: VSN Email Planet platform users only. Provider mailbox credentials and OAuth grants remain separate identities and authorization domains.

## Context

P1 needs a real, self-hostable first-admin and user-authentication path before tenant resource and worker authorization can be accepted. The existing PostgreSQL session guard and logout route deliberately have no session issuer. The governing prompt requires a safe single first-admin bootstrap, MFA/recovery options, no secrets in generated configuration, and a later SSO/SCIM capability. Do not confuse email-provider credentials with platform-user credentials.

## Decision

1. Use invite-only local platform accounts for the self-hosted P1 baseline. Disable public self-registration. Create exactly one initial administrator through a single-use, high-entropy bootstrap flow; never ship default credentials, store the bootstrap secret in generated files, or log it. Force the first administrator to set their own credential and enroll a second factor before privileged operations.
2. Argon2id remains the preferred target. For the current supported runtime (Node 22.14–24.x), use Node's stable built-in scrypt because Node 24's built-in Argon2 API is still Release Candidate and adding an unreviewed native dependency solely for hashing is not justified. Use OWASP's scrypt baseline N=2^15, r=8, p=3, 32-byte output, 16-byte random salt and 64 MiB maximum memory; encode an explicit verifier version and parameters. Benchmark under CI and deployment resource limits. Reconsider Argon2id when the supported runtime exposes it stably or a vetted dependency is approved and lockfile provenance is verified. Never use plaintext, reversible encryption, fast hashes or bcrypt for new credentials. Do not store an HMAC pepper in the database.
3. Require at least 15 characters, accept at least 64 characters and password-manager paste/autofill, reject common/compromised/context-specific passwords using a blocklist, and do not impose character-composition rules or periodic forced resets. Force reset only after compromise or authorized recovery.
4. Require MFA enrollment for the first administrator and privileged roles before access to privileged operations. Prefer WebAuthn/passkeys; allow TOTP only as an explicitly labeled fallback. Generate one-use recovery codes, store only salted hashes, rate-limit their use and audit issuance/use/revocation. Store TOTP seeds encrypted under an application key held outside PostgreSQL; never log authenticator secrets.
5. On a successful login, recheck active user and membership from PostgreSQL, create a fresh opaque 256-bit session secret and session-bound CSRF token, persist only their keyed digests, and issue the existing host-only secure cookies. Rotate the session on login, organization-context change, MFA/security change and recovery. Revoke affected sessions on password reset, account disablement, membership revocation or recovery.
6. Rate-limit failed login, MFA and recovery attempts using shared persistent state so limits apply across API replicas. Use generic responses for unknown users and bad credentials; perform a dummy password verification for unknown accounts to reduce account enumeration. Record allowlisted success and denial audit events without storing secrets or untrusted tenant claims.
7. Until a verified and authorized outbound mail channel exists, do not send password-reset or invitation links through a provider mailbox. Use the explicit bootstrap/invitation flow or audited operator-assisted recovery that revokes all active sessions. Email-based self-service recovery is a later decision.
8. Defer OIDC/enterprise SSO and SCIM to the enterprise phase. Do not silently accept provider OAuth tokens as platform login credentials.

## P1-15 throttling policy (implementation contract)

Throttle purpose is login, MFA challenge or recovery. Each purpose has independent keyed account and trusted-client-network buckets. The account key is the trimmed, lowercase platform identifier; the network key is a canonical network identifier derived from the direct socket peer, or from a forwarding header only when the deployment explicitly trusts that proxy. Never store those values.\n\n| Purpose | Account budget/window/block | Network budget/window/block |\n|---|---:|---:|\n| Login | 10 attempts / 15 min / 15 min | 60 attempts / 15 min / 5 min |\n| MFA | 5 attempts / 10 min / 15 min | 30 attempts / 10 min / 5 min |\n| Recovery | 5 attempts / 30 min / 30 min | 30 attempts / 30 min / 10 min |\n\nAn attempt is atomically consumed before expensive password or authenticator verification. The first N attempts are admitted; attempt N+1 and later are denied until the window/block expires. Verified successful authentication clears both dimensions for current and configured prior HMAC keys. Responses remain generic and may include Retry-After; they do not identify which bucket blocked a request. These values balance online-guessing resistance with self-hosted shared-network use; review them against deployment telemetry before production.\n\nEach row stores only purpose, dimension, SHA-256 HMAC digest, count, window/block timestamps and expiry. The HMAC key is a canonical 32-byte base64url secret held outside PostgreSQL. One prior key may be configured during rotation; both keys are written until records covered by the 24-hour maximum retention expire. Never abruptly replace a key. Expired rows are pruned in bounded batches during attempts. Throttle storage errors fail closed. Operator lockout recovery requires authenticated host/database access, scoped review of the affected hashed row and an audit record; there is no global bypass or public unlock route.

## Rationale and standards

Argon2id is OWASP's preferred password hashing choice, with the selected minimum work profile above. NIST SP 800-63B Revision 4 requires 15 characters for single-factor passwords, supports long passwords and password managers, rejects composition rules, calls for blocklists and rate limiting, and describes secure recovery authenticator handling. The selected MFA baseline keeps privileged access separate from mailbox-provider authorization. The policy is scoped to a self-hosted P1 baseline; deployment-specific assurance and regulatory needs may require stronger controls.

## Alternatives considered

| Option | Decision |
|---|---|
| Public self-signup and email reset | Rejected for P1: no verified outbound channel or abuse controls exist. |
| Provider mailbox password or OAuth token as platform login | Rejected: it crosses separate identity and consent boundaries. |
| Password-only first-admin access | Rejected: the product prompt requires MFA/recovery options for safe administrator bootstrap. |
| Enterprise OIDC/SCIM as the only login | Deferred: P12 enterprise capability; it cannot be a prerequisite for self-hosted initial setup. |
| Password + mandatory WebAuthn/TOTP for privileged roles | Selected: supports self-hosting while keeping MFA and recovery explicit. |

## Acceptance tests for implementation

- Bootstrap succeeds once, never reveals the bootstrap secret again, and refuses a second initial administrator.
- Invite-only account activation rejects expired, reused, malformed and unauthorized invitations without account enumeration.
- Password policy accepts long/passphrase and Unicode input, rejects blocklisted values, and stores only the versioned scrypt verifier selected in this ADR with unique salts and the selected parameters.
- Login rate limiting works across multiple API instances; unknown-user and wrong-password responses are equivalent and do not create sessions.
- Admin/privileged login cannot access privileged routes before required MFA enrollment and challenge completion; recovery codes are one-use, hashed, throttled and audited.
- Successful login persists only session and CSRF digests, issues correct cookies, writes the appropriate audit event and can immediately call `GET /api/session/me`.
- Rotation, logout, password reset, account disablement, membership revocation and recovery revoke or replace sessions as specified.
- CI never sends mail or uses real provider credentials; all fixtures are synthetic.

## Sources

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) — Argon2id preferred; scrypt fallback parameters and tradeoffs.
- [Node.js v24 crypto API](https://nodejs.org/download/release/v24.18.0/docs/api/crypto.html#cryptoargon2algorithm-parameters-callback) — built-in Argon2 remains Release Candidate in the supported Node 24 line.
- [NIST SP 800-63B Revision 4: Passwords](https://pages.nist.gov/800-63-4/sp800-63b/passwords/) — password length, blocklists, throttling and password-manager requirements.
- [NIST SP 800-63B Revision 4](https://pages.nist.gov/800-63-4/sp800-63b.html) — authenticators, MFA and recovery requirements.
