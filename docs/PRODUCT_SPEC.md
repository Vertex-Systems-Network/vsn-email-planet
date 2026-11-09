# Product scope and MVP boundary

## Product
A self-hostable, multi-tenant email operations control plane combining mailbox workflows with authorized provider administration. External providers remain the mail system of record unless a separately configured archive policy applies.

## MVP sequencing
Web-first foundation; identity/tenant policy and audit; connection and capability inventory; synthetic local fixtures; then provider connectors and mail sync in dependency order. P0 research must identify feasibility, scopes, licensing, deployment constraints and UX before locking production dependencies.

## Non-negotiable behavior
- Separate control-plane administration from mailbox-content authorization.
- Show capability status, provenance, freshness and required permission for every connector action.
- Enforce tenant policy in APIs, workers, search, objects and AI tools.
- Persist uncertain outbound results as `UNKNOWN`; reconcile before retry.
- Treat email content as untrusted; AI starts draft-only and cannot grant itself privileges.
- Make unsupported and blocked states visible; no mock-success or fabricated metrics.
- Preserve original mailbox data by default during migration and restore.

See the master specification for full personas, scope, journeys, acceptance scenarios and phase gates.
