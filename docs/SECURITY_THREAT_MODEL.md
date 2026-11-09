# Initial threat model

## Assets and trust boundaries

- Identity/session and tenant membership.
- Provider credentials/tokens and encryption keys.
- Mail metadata/content, attachments, archives and exports.
- Tenant policy, provider capability data and audit records.
- Boundaries: public browser ↔ API; tenant ↔ tenant; control-plane ↔ data-plane; API ↔ worker; application ↔ provider; trusted configuration ↔ untrusted email/attachment/AI input.

## Initial mitigations / gaps

- Synthetic dashboard data only; no real content, credentials, auth/session or external mutation exists.
- Tenant-scoping pure functions and negative tests are introduced as examples. They do not secure an unauthenticated API.
- The initial PostgreSQL control-plane DDL uses an authoritative `organization_id` on tenant-owned records and composite foreign keys to prevent mismatched tenant/connection links. This is relational integrity, not authentication or full query isolation; server-derived identity and policy checks are still required.
- Browser OAuth research (RFC 10017, August 2026) recommends BFF for business/sensitive personal-data apps; provider tokens should remain on the server. Any BFF proxy must use strict host/path allowlists, with separately hardened connector network egress for user-configured IMAP/SMTP endpoints. This is a requirement for future design, not implemented behavior.
- If JWT client assertions are added, RFC 10070 (November 2026) requires the JWT client-authentication assertion audience to be solely the authorization server issuer identifier. Provider-specific interop must be tested before choosing that method.
- Production-blocking gaps: authenticated identity, server-derived membership, database row scope, worker authorization context, secret encryption/key rotation, SSRF/egress policy, audit persistence, MIME/attachment isolation and security testing.
- RFC 10017 also recommends BFF for sensitive browser applications: application session cookies, server-side provider tokens, CSRF protection, and strict proxy destination/method allowlists. This is a required design review for P1-06 and provider integrations; the prototype has no OAuth/session yet.
- Future AI must treat message content as hostile instructions and must not grant itself tools, export content or send mail from message text.

No security certification, compliance status or production readiness is claimed.
