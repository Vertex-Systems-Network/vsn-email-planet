# Product specification — MVP boundary

The governing full feature catalog remains `AI_Native_Central_Email_Platform_Master_Prompt.md`. This document records the first product boundary, not a reduction of the longer roadmap.

## Product

VSN Email Planet is a web-first Email Operations Control Plane for individuals, agencies and operators managing multiple providers. It joins administration, health, routing, migration and authorized mail workflows while keeping the external provider as system of record. The Email Control Plane, Email Data Plane and External Provider Plane remain separate.

## Initial delivery boundary

1. Reproducible local web/API monorepo.
2. Authenticated users, organizations/workspaces, server-derived membership and audit.
3. Provider connection/capability catalog and metadata inventory; message content is separate and consent-gated.
4. Synthetic demonstration data before credentials exist; no fake integration-success path.
5. Provider adapters are introduced only with documented capabilities, typed errors, permissions and recovery semantics.

The current increment only delivers the local shell, a process-only health endpoint, sample-domain authorization helpers and tests. It does not deliver items 2–5 above.

## Non-goals for initial phases

No new public MTA/relay, universal provider support, provider-password-based private inbox access, unrestricted auto-send, automatic DNS cutover, source deletion after migration, guaranteed zero downtime, or compliance claim without evidence.

## Success evidence

First internal milestone: clean install/build, interactive labeled demo, process-only API health, cross-tenant exclusion and separate mailbox content grant tests. P1 release gate additionally requires real authenticated API sessions, persistence, workers, two-tenant adversarial tests and reproducible CI. Product launch requires P9 security, installation, restore, performance, provider and operational evidence.
