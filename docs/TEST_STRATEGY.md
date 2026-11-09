# Test strategy

For each change, identify unit, contract, integration, browser, security and live-provider checks applicable to the touched boundary. Prefer deterministic synthetic fixtures. Live-provider tests require a controlled account and separately documented authorization; mocked tests never count as live validation.

Current foundation checks: TypeScript typecheck for web/API; Node built-in tests for domain authorization/capability behavior and backlog schema; production builds for both applications. Future gates add Postgres/Redis integration, tenant ID adversarial checks, OAuth callback tests, SSRF, MIME sanitization, sync cursor recovery, send timeout ambiguity, and setup/upgrade E2E.

Every evidence record includes test/task ID, commit, environment, fixture, command, expected/actual result, status and limitations. See `docs/TEST_EVIDENCE/`.
