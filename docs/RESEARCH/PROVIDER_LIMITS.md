# Initial provider limits and evidence

Reviewed 2026-11-09 against official docs. These sources do not replace account-specific capability probes or a live sandbox check.

| Provider | Evidence-backed constraint | Product implication | Source |
|---|---|---|---|
| Gmail sync | Initial sync or missing partial history needs full sync; history records are only retained for a limited period. An expired/out-of-date `startHistoryId` may return HTTP 404; Gmail says perform a full sync. | Per-mailbox durable cursor, controlled full reconcile, atomic merge/cursor advancement, duplicate-safe message identity. | https://developers.google.com/workspace/gmail/api/guides/sync ; https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list |
| Gmail OAuth | Choose narrow scopes; restricted scopes involve verification; server-side storage/transmission of restricted-scope user data requires security assessment. | Consent and launch gate must be surfaced; metadata-only scope is distinct from body access. | https://developers.google.com/workspace/gmail/api/auth/scopes |
| Microsoft Graph mail | Graph accesses a user's mail with appropriate delegated or application permission; shared mailboxes are supported; in-place archive mailboxes are not supported in Graph Mail API according to overview. | Model delegated/app permissions and shared mailbox routes; do not claim archive coverage without a distinct route. | https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview?view=graph-rest-1.0 |
| Microsoft Graph permissions | Shared mail scopes are permission- and account-type-specific; some application permissions require admin consent. | Capability manifest records exact permission type/admin consent; test shared mailbox boundaries. | https://learn.microsoft.com/en-us/graph/permissions-reference?view=graph-rest-1.0 |
| Graph lifecycle | Lifecycle events include `reauthorizationRequired`, `subscriptionRemoved`, and `missed`; ignoring them can break notification flow. | Handle lifecycle events and authoritative delta reconciliation; webhook receipt alone is not sync proof. | https://learn.microsoft.com/en-us/graph/change-notifications-lifecycle-events |
| cPanel UAPI | UAPI accesses cPanel account features; disabling roles can disable associated API functions. cPanel's docs recommend UAPI over deprecated cPanel API 2. API token calls can operate using account data. | Use operation-level UAPI only; discover host/account permissions and role disablement; avoid deprecated API2; token rights are not blanket mailbox content consent. | https://api.docs.cpanel.net/cpanel/introduction ; https://api.docs.cpanel.net/cpanel/tokens ; https://api.docs.cpanel.net/cpanel-api-2/cpanel-api-2-modules-email/cpanel-api-2-functions-email-addpop |
| OAuth | RFC 9700 is the current OAuth 2.0 Security BCP and deprecates insecure modes. | PKCE/state/nonce, exact redirects, modern token handling and documented threat review before provider auth. | https://www.rfc-editor.org/rfc/rfc9700.html |

Open: endpoint-level UAPI methods/role coverage, host-specific API restrictions, provider admin consent verification, IMAP OAuth/TLS matrix and live behavior. No sandbox credentials were supplied; no live provider test has occurred.

## Hosting-panel follow-up

- Plesk Obsidian XML API has mail account management operations; its docs describe administrator/customer contexts and versioned request packets. Do not assume every role or installation supports the same mutations. Official docs: https://docs.plesk.com/en-US/obsidian/api-rpc/about-xml-api/reference/managing-mail.34477/ and https://docs.plesk.com/en-US/obsidian/api-rpc/about-xml-api/reference/managing-mail/modifying-mail-account-settings.34506/.
- DirectAdmin current API docs say an OpenAPI 2.0 description is bundled with the server. Legacy docs list `CMD_API_POP` for list/quota/create/modify/delete. Treat old and current API surfaces separately and discover per host/version. Official docs: https://docs.directadmin.com/developer/api/index.html and https://docs.directadmin.com/developer/api/legacy-api.html.
- No panel sandbox was available; these are documentation findings only.
