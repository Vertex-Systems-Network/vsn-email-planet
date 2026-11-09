# Standards and primary sources

Checked 2026-11-09. These references anchor requirements; implementation must revalidate version and applicability at release.

- OAuth 2.0 Security Best Current Practice, RFC 9700 (2025): https://www.rfc-editor.org/rfc/rfc9700.html — modern OAuth threat mitigations; primary IETF standard.
- Gmail sync guide: https://developers.google.com/workspace/gmail/api/guides/sync — full sync initially and when partial history is unavailable; history cursor can expire.
- Gmail `users.history.list`: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list — stale/out-of-date `startHistoryId` can return HTTP 404; perform full sync.
- Gmail OAuth scopes: https://developers.google.com/workspace/gmail/api/auth/scopes — choose narrow scopes; restricted server-side data storage/transmission can require security assessment.
- Microsoft Graph message delta: https://learn.microsoft.com/en-us/graph/api/message-delta — folder-scoped incremental changes with continuation/delta links.
- cPanel UAPI and account feature docs: https://api.docs.cpanel.net/ and https://docs.cpanel.net/cpanel/email/email-accounts/ — verify operation, release, authorization and host policy before coding.
- JMAP Core RFC 8620: https://www.rfc-editor.org/rfc/rfc8620.html.
- Internet Message Format RFC 5322: https://www.rfc-editor.org/rfc/rfc5322.

Source evidence and implications are summarized in `docs/RESEARCH/PROVIDER_LIMITS.md`. This is bounded initial research, not legal or provider approval.
