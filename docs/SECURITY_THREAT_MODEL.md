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
- Production-blocking gaps: authenticated identity, server-derived membership, database row scope, worker authorization context, secret encryption/key rotation, SSRF/egress policy, audit persistence, MIME/attachment isolation and security testing.
- Future AI must treat message content as hostile instructions and must not grant itself tools, export content or send mail from message text.

No security certification, compliance status or production readiness is claimed.
