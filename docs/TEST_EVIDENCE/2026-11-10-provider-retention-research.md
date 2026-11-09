# Provider permission and retention research checkpoint

- Date: 2026-11-10 (Asia/Karachi)
- Scope: documentation-only follow-up for P0-02; no live tenant or mailbox access.
- Sources: Google Workspace Directory API user deletion reference and guide; Google Vault overview and holds guide; Gmail API scope reference; cPanel API2 `Email::delpop` page (which directs users to UAPI `Email::delete_pop`).
- Findings: Directory API user deletion requires `admin.directory.user`; a Workspace user under Vault legal hold cannot be deleted; held mail can remain searchable/exportable by a Vault administrator after deletion from the user's view; a deleted account may be restorable for 20 days if conditions are met. cPanel documents account-data deletion for the legacy API2 method but does not establish backup/snapshot purge or server-level erasure timing; its current API recommendation is UAPI `Email::delete_pop`.
- Product boundary: identity deletion, visible message deletion, retention/hold preservation, and physical erasure are separate states. Record provider response as operation acceptance, never as a universal erasure guarantee. Keep unknown host backup retention explicitly unknown.
- Confidence: high for the cited API permissions and stated behavior; low for any tenant's actual hold, retention, backup, or cPanel host configuration without authorized discovery/testing.
- Verification: source claims were checked against primary documentation on the date above; no provider credentials, customer data, or sandbox were used. `npm run check` passed (34-task backlog/state; 42 tests, 0 failures); `npm run typecheck` passed for web and API; `npm run build` passed for web and API; `git diff --check` passed. Node/npm emitted a warning that the environment's `http-proxy` npm config is unknown; it did not affect these successful checks.
- Limits/open work: buyer interviews, hands-on competitor trial, tenant-specific policy discovery, cPanel version probe, browser-based accessibility review and live provider test remain unperformed.
- Source URLs:
  - https://developers.google.com/workspace/admin/directory/reference/rest/v1/users/delete
  - https://developers.google.com/workspace/admin/directory/v1/guides/manage-users
  - https://developers.google.com/workspace/vault/guides/holds
  - https://developers.google.com/workspace/vault/guides
  - https://api.docs.cpanel.net/cpanel-api-2/cpanel-api-2-modules-email/cpanel-api-2-functions-email-delpop
