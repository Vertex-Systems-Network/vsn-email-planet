# Competitor research — initial bounded pass

Checked 2026-11-09. This is not a complete market validation.

| Category | Product/source | Evidence found | Confidence / remaining |
|---|---|---|---|
| Shared inbox / customer operations | [Front plans](https://front.com/pricing) | Shared inbox, ticketing, tags, assignments, comments/shared drafts, rules and analytics; page showed Starter $25/seat/mo, Professional $65/seat/mo, Enterprise $105/seat/mo | High for public plan snapshot; prices change; customer-support workflow is its center |
| Collaborative inbox | [Missive features](https://missiveapp.com/features), [pricing](https://missiveapp.com/pricing) | Unified inbox, multiple accounts, team inbox, assignments, shared drafts/comments, audit trail, integrations and rules; page showed $14/$24/$36 per user/mo on yearly billing | High for vendor claims/prices shown; not independently tested |
| Desktop unified email | [Thunderbird](https://www.thunderbird.net/en-US/) | Vendor describes unified inbox, multiple accounts, cross-platform use and open-source/free distribution | High for vendor-stated scope; exact license/security review remains |
| Hosting-panel administration | [cPanel email accounts](https://docs.cpanel.net/cpanel/email/email-accounts/), [Plesk mail API](https://docs.plesk.com/en-US/obsidian/api-rpc/about-xml-api/reference/managing-mail.34477/) | cPanel manages domain mail accounts; Plesk XML API supports mail account operations with role-limited access | High for documented scope; no comparative UX or quality assessment |
| Web application framework | [Next.js App Router](https://nextjs.org/docs/app), [self-host](https://nextjs.org/docs/app/guides/self-hosting) | Node server and Docker are supported self-host routes; reverse proxy recommended | High for framework deployment; not an email-product competitor |
| Gmail synchronization | Google [sync guide](https://developers.google.com/workspace/gmail/api/guides/sync) | Partial sync uses history records; stale `startHistoryId` can return HTTP 404, requiring full sync | High; provider engineering fact, not competitor comparison |
| Microsoft mail synchronization | [Graph message delta](https://learn.microsoft.com/en-us/graph/delta-query-messages) | Folder delta supports initial sync plus incremental changes with `@odata.deltaLink` | High; exact behavior remains permission/endpoint dependent |

## Validated and unvalidated product hypotheses

- A unified inbox and team inbox are **existing** categories (Thunderbird, Missive, Front), not unique claims.
- Assignment, internal collaboration, audit, automation, analytics and multiple-account workflows also exist in competitor claims.
- Cross-provider infrastructure topology, scoped provider administration, per-resource capability provenance and migration parity may be a **combined opportunity**, not a validated gap. More product comparisons and interviews are needed before positioning these as unique.
- Prices are dated snapshots, not a proposed VSN price. The full comparisons for migration, archive, backup, DNS/deliverability and admin platforms remain open in P0.
