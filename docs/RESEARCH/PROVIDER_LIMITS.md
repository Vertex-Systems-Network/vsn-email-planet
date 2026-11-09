# Initial provider limits and evidence

Reviewed 2026-11-09 against official docs.

| Provider | Evidence-backed constraint | Product implication | Source |
|---|---|---|---|
| Gmail | Incremental `history.list` depends on a recent `startHistoryId`; 404 means unavailable history and requires full sync. Gmail labels do not map trivially to folders. | Durable cursor; transactional recovery; preserve labels; no cursor advance until reconciliation succeeds. | [Sync guide](https://developers.google.com/workspace/gmail/api/guides/sync), [history.list](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list) |
| Gmail OAuth | Restricted scopes need verification; server-side storage/transmission of restricted-scope data triggers security assessment requirements. | MVP scope minimization; launch verification/assessment is a major external gate. | [Scope guide](https://developers.google.com/workspace/gmail/api/auth/scopes) |
| Microsoft Graph | Mail delta is folder-scoped and uses pagination/delta state. | Track per-folder cursor and lifecycle/reconciliation; do not claim provider-wide exactly-once sync. | [Message delta](https://learn.microsoft.com/en-us/graph/api/message-delta) |
| OAuth | RFC 9700 updates BCP and deprecates insecure modes. | PKCE/state/nonce, safe redirects, modern token handling before provider auth. | [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html) |
| cPanel | UAPI and Email Accounts docs are operation-specific; actual API features and permissions depend on host/account. | Probe capability per connection/resource; never infer mailbox-content access from panel auth. | [UAPI docs](https://api.docs.cpanel.net/), [Email Accounts](https://docs.cpanel.net/cpanel/email/email-accounts/) |

Open: official docs and terms for provider delegated admin, IMAP OAuth/TLS behaviors, Google restricted-scope launch path, Graph mailbox application-access controls, cPanel host-specific UAPI support. No live provider tests performed.
