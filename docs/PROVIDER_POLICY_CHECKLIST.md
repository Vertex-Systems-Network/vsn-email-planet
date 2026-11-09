# Provider policy checklist

Before each connector launch:

- Document API endpoint/version, exact least-privilege scopes, mailbox resource semantics and applicable account/license tier.
- Review current provider acceptable-use, OAuth, data use/storage, restricted scope verification, security assessment, publisher verification and rate-limit requirements.
- Validate onboarding, revocation, reconsent, token rotation, error state, incremental sync recovery and webhook lifecycle with synthetic tests; live tests only on an authorized test tenant.
- Preserve `checked_at`, version, source link, confidence and open policy questions in `docs/RESEARCH/PROVIDER_LIMITS.md`.

No provider app is registered and no live validation has occurred.
