# Test strategy

For each change, identify unit, contract, integration, browser, security and live-provider checks applicable to the touched boundary. Prefer deterministic synthetic fixtures. Live-provider tests require a controlled account and separately documented authorization; mocked tests never count as live validation.

Current foundation checks: TypeScript typecheck for web/API; Node built-in tests for domain authorization/capability behavior, migration apply/idempotency/checksum/rollback and backlog schema; PGlite executes the DDL with PostgreSQL semantics. GitHub Actions also provisions native PostgreSQL 16 and checks the real `pg` migration path and cross-tenant foreign-key denial. The native smoke requires an explicit disposable `vsn_test` database marker and refuses arbitrary database URLs. Future gates add PostgreSQL upgrade and multi-process behavior, Redis, full API tenant isolation, OAuth callback tests, SSRF, MIME sanitization, sync cursor recovery, send timeout ambiguity, and setup/upgrade E2E.

Every evidence record includes test/task ID, commit, environment, fixture, command, expected/actual result, status and limitations. See `docs/TEST_EVIDENCE/`.
