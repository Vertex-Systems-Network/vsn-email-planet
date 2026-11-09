# Known issues and validation gaps

- Prototype is static and has no identity, tenant database, provider adapter, inbox, mail content, persistent storage or live status.
- No browser visual/manual accessibility review has been performed; responsive behavior is specified in CSS but needs rendered checks.
- Production stack ADR, competitor/pricing study, complete provider policy matrix and full P0 exit evidence remain open.
- Only synthetic fixtures and local Node HTTP flow are tested. No authorized live-provider sandbox exists.
- Node package management emits a runner-level warning for inherited `http-proxy`; no dependency install is used by this repo.
- Local shell network access cannot reach GitHub; the connected GitHub API is used for authorized repository writes.
