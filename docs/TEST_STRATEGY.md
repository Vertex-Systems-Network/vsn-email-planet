# Test strategy

Use Node built-in tests for the dependency-free prototype and ledger validation. As architecture matures, add unit/contract tests for authorization, capability manifests, MIME parsing, cursor recovery, idempotent jobs, send uncertainty and migrations; PostgreSQL/Redis/object-store integration; browser workflows; cross-tenant negative security tests; provider mocks; authorized live sandbox tests; accessibility and performance.

Mocks and fixtures prove only local contract behavior. They do not prove provider connectivity or live account capability. Every external test must record exact account type/scopes/environment with sanitized evidence.
