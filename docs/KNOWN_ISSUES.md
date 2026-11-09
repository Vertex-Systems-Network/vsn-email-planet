# Known issues and validation gaps

- Prototype has a static dashboard and read-only synthetic API; demo tokens are public fixture values, not identity/authentication. It has no persistent tenant database, provider adapter, inbox data, mail content, storage or live provider status.
- No browser visual/manual accessibility review has been performed; responsive behavior is specified in CSS but needs rendered checks.
- Production stack ADR, competitor/pricing study, complete provider policy matrix and full P0 exit evidence remain open.
- Only synthetic fixtures and local Node HTTP flow are tested. No authorized live-provider sandbox exists.
- Node package management emits a runner-level warning for inherited `http-proxy`; no dependency install is used by this repo.
- Local shell network access cannot reach GitHub; the connected GitHub API is used for authorized repository writes.
