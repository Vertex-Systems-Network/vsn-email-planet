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

## Implemented first PostgreSQL slice

`apps/api/db/migrations/0001_control_plane.sql` creates the initial control-plane records: organizations, platform users, memberships, provider connections, resource scopes, connector capability observations and audit events. Every tenant-owned connection/scope/capability/audit row carries `organization_id`; composite foreign keys prevent a resource scope or capability from being attached to a connection owned by a different organization. Credential values are not stored: provider connections may hold only a future secret-manager reference. Audit attributes are constrained to JSON objects and must exclude content, credentials and tokens.

The database migration runner stores a SHA-256 checksum and application time for every migration, applies new migrations under a PostgreSQL transaction-scoped advisory lock, rejects checksum edits and missing applied migrations, and fails closed on migration errors. Schema changes are forward-only in production; destructive rollback is a restore/redeploy decision and must use a separately reviewed recovery plan. Local empty-database reset is acceptable only for disposable test data.

PGlite exercises real PostgreSQL SQL semantics for clean apply, idempotent rerun and tenant-key constraint behavior. Native PostgreSQL upgrade, multi-process lock behavior and production connection configuration remain unverified. No production persistence or mailbox-content tables/runtime are implemented yet.
