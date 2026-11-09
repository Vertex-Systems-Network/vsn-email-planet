# Provider capability matrix

Capabilities are reported by action and resource with `state`, `reason`, `checked_at`, `source` and `required_action`. A list capability never implies message access. Real adapter results must distinguish `SUPPORTED`, `READ_ONLY`, `NEEDS_CONSENT`, `NEEDS_ADMIN`, `NEEDS_WHITELIST`, `NEEDS_LICENSE`, `PROVIDER_DISABLED`, `RATE_LIMITED`, `UNSUPPORTED`, `UNKNOWN` and `BROKEN`.

| Provider | Initial decision | Critical limitation |
|---|---|---|
| cPanel UAPI | Future P2 candidate | Account administration is separate from IMAP/SMTP mailbox-content permission; use UAPI and verify server/version/feature state |
| WHM | Future P2 candidate | Root/reseller capabilities differ; no automatic content access |
| Gmail / Workspace | Future P3 candidate | OAuth scopes and separate user mail/content authorization; Gmail history expiration requires controlled full sync |
| Microsoft Graph | Future P3 candidate | Delegated/application permissions differ; delta state is per-folder and must be reconciled |
| Generic IMAP/SMTP | Future P2/P3 candidate | TLS/auth/capability negotiation required; no insecure downgrade |
| Plesk / DirectAdmin / JMAP / others | Research backlog | No support claim until documented, implemented and tested |

All entries currently represent research/roadmap only. No provider adapter exists in this repository.
