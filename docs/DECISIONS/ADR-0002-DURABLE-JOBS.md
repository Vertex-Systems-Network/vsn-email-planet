# ADR-0002: PostgreSQL queue-of-record and transactional outbox prototype

- Status: Accepted for the first job-primitives increment; production queue selection remains open.
- Date: 2026-11-09
- Context: asynchronous provider work needs tenant context, mailbox serialization, retries, crash recovery, deduplication and safe behavior when a provider mutation's response is lost. The existing PostgreSQL schema and migration runner are verified; no worker or broker is deployed.

## Decision

Use tenant-scoped PostgreSQL `operation_jobs` as the initial durable queue-of-record, claimed through `FOR UPDATE SKIP LOCKED`. Insert a minimal queued event into `event_outbox` within the same transaction as job creation. Scope every claim and acknowledgement to an explicit organization. Use `lease_generation` as a fencing token for worker acknowledgements and a partial unique index to permit only one running job per mailbox.

For an external mutation, persist `dispatch_started_at` before making the provider call. If its lease expires after this boundary or a response is ambiguous, move it to `unknown` and hold later mutations on that mailbox. A reconciler may release it only after confirming whether the effect applied. Never infer provider-side exactly-once behavior from database idempotency.

## Consequences

- The idempotency key is unique within its organization. Reusing a key for a different operation is rejected.
- Read and internal work may be retried within bounded attempts with capped exponential delay. An external mutation with a recorded dispatch is never automatically retried.
- Outbox delivery is at-least-once. Downstream consumers must deduplicate using stable tenant-scoped event identity.
- No message bodies, credentials, provider tokens or arbitrary payload JSON are stored in job/outbox rows.
- The implementation provides persistence primitives only. It does not run a poller, external broker publisher or provider adapter.

## Alternatives and limits

Redis/BullMQ remains the likely production candidate from the governing specification. A PostgreSQL queue keeps enqueue and event intent transactionally aligned and reduces early infrastructure, but may create lock contention and database load at scale. No benchmark or failure-injection result demonstrates production suitability; compare throughput, latency, backpressure, operational recovery and tenant fairness before locking a production choice.

Fencing protects database acknowledgements and subsequent code paths that verify the generation. It cannot prevent an already-running process from issuing a remote call after a lease expires unless the provider supports a corresponding idempotency/fencing primitive. The uncertain-effect state and manual reconciliation path address this limit conservatively.

## Verification plan

PGlite integration tests cover duplicate enqueue, tenant-scoped claiming, mailbox serialization, stale worker fencing, expired lease reclaim, unknown external mutation, bounded retries and outbox acknowledgement. CI's disposable PostgreSQL 16 smoke exercises migrations and the same queue/outbox API. Load tests, concurrent multi-process tests, publisher delivery duplication and chaos/recovery tests remain open release gates.
