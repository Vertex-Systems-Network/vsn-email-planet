# Provider capability manifest contract

This framework-neutral first slice follows section 11 of the governing master specification. It is a local contract helper, not a provider adapter or a live capability probe.

## Required record

Every operation record declares an operation name, resource level, state, human-readable reason, source, check timestamp and required next action. Duplicate operation/resource pairs and malformed records fail closed.

The allowed states are `SUPPORTED`, `READ_ONLY`, `NEEDS_CONSENT`, `NEEDS_ADMIN`, `NEEDS_WHITELIST`, `NEEDS_LICENSE`, `PROVIDER_DISABLED`, `RATE_LIMITED`, `UNSUPPORTED`, `UNKNOWN` and `BROKEN`. Only `SUPPORTED` and `READ_ONLY` pass the policy decision helper. An undeclared operation is `UNKNOWN`; it is never inferred to be supported. A read-only operation must use `READ_ONLY` state.

## Local verification

`apps/api/src/capabilities.js` validates manifests and provides a fail-closed operation decision/assertion. `test/capabilities.test.js` covers metadata-only access, separate message consent, unsupported and undeclared operations, malformed/duplicate records, and inconsistent write/read-only claims.

All test data is synthetic. The helper does not authenticate a user, grant consent, call a provider, or implement the entire typed connector interface. The framework-neutral invocation contract and synthetic adapter boundary are verified locally. Concrete provider adapters remain unimplemented and must follow the final stack/auth decisions.
