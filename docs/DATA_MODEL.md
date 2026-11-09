# Initial data model and handling

Canonical entities are specified in master section 31. The first persistent slice will use Organization, Membership, ProviderConnection, ConnectorCapability and AuditEvent before adding mailbox content. Any tenant-owned row must carry an authoritative organization key and provider provenance. Actor tenant scope is derived from a verified session; it must never be accepted from an untrusted browser field alone.

## Classification

| Class | Examples | Baseline handling |
|---|---|---|
| Public infrastructure | public MX observations | Source and observation time recorded |
| Organization-confidential | provider metadata, mailbox inventory, policy | Tenant-scoped access and audit |
| Private email | headers, message body, attachments | Separate consent, encryption, restrictive access and retention |
| Credentials | passwords, OAuth tokens, encryption keys | Never log/display; encrypt with managed key lifecycle |
| Security/audit | access events, policy decisions | Tamper-resistant storage, PII minimization |

No production persistence or mailbox-data schema migration has been implemented yet.
