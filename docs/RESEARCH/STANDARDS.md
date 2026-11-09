# Standards and provider source notes

Checked 2026-11-09. Primary source snippets are summarized; confirm again before implementation/release.

- **Gmail history:** [Synchronize clients](https://developers.google.com/workspace/gmail/api/guides/sync) and [history.list](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list). Incremental sync requires a recent history ID; if the ID is unavailable, HTTP 404 means perform a full sync. The history horizon is not guaranteed indefinitely.
- **Microsoft Graph messages:** [Delta query for messages](https://learn.microsoft.com/en-us/graph/delta-query-messages). Use per-folder delta flows and persist the returned delta link for the next round; supported options are constrained.
- **Next.js:** [App Router](https://nextjs.org/docs/app) and [self-hosting](https://nextjs.org/docs/app/guides/self-hosting). Current documented self-host options include Node.js server and Docker; reverse proxy is recommended.
- **NestJS:** [First steps](https://docs.nestjs.com/first-steps) documents TypeScript/Node support; version support and exact compatibility must be checked in the stack lockfile.
- **OAuth:** [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html) is a security BCP candidate; OAuth flow/scopes need provider-specific review before any live auth.

This initial check did not examine all relevant RFCs, provider policies, UI library licenses, pricing or competitors; backlog keeps those open.
