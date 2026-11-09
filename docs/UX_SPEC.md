# UX foundation and screen-state matrix

## Product direction options
1. Dense neutral operations console: high information density, status-first, restrained color. **Selected for prototype** because mail operations require triage and provenance.
2. Consumer-first unified inbox: approachable but underplays provider/admin diagnostics.
3. Graph-first infrastructure map: useful specialist view, poor default inbox/operations entry.

Selection applies to this prototype, not a final product design system. Keep readable surfaces, semantic statuses with text/icons, clear permission labels, and no decorative fake telemetry.

## IA (first navigation slice)
Overview → Providers → Domains → Mailboxes → Incidents → Migrations → Audit. The prototype implements overview/providers/domains/mailboxes navigation affordances and a synthetic provider inventory only. Unimplemented routes must be visibly unavailable, not pretend to be functional.

## Prototype acceptance
Responsive sidebar/header, keyboard reachable controls, search/filter over fixture rows, resource detail state, explicit synthetic-data banner, status legend and empty-result state. Contrast and full WCAG 2.2 AA audit remain pending.

## Future screen/state matrix
Use `knowledge/design/requirements.yaml` and `knowledge/screens/screen-matrix.csv`; include role × device × state dimensions as the feature scopes mature.

## Complete screen inventory

`knowledge/screens/screen-inventory.json` maps the required route inventory across global, connections, administration, inbox, infrastructure, migration, recovery, automation/AI, reports/operations and installation. Each route carries role, device, state coverage and implementation status. The inventory is scope, not completion evidence; only the current dashboard/provider prototype is marked `PROTOTYPE_PARTIAL`.


## Provider capability detail

The provider detail view loads the tenant-scoped synthetic capability endpoint and displays each operation’s state, reason, source, check time and required next action. `NEEDS_CONSENT` remains distinct from panel/admin access; unsupported and provider-disabled states are visible. All values are labeled synthetic. The endpoint has an integration test for same-tenant access, cross-tenant 404 and read-only behavior. Browser visual/accessibility review remains pending.


## Domain and mailbox inventory behavior

The Domains and Mailboxes navigation now loads distinct tenant-filtered API resources. Domain rows show domain/provider, unverified DNS status and synthetic mailbox count. Mailbox rows show mailbox/domain/provider, content-access state and fixture status. Search fields follow the resource type; status filters are reset to a valid value when switching views. The detail modal shows metadata only. These are synthetic examples, not DNS checks or mailbox connections. Local HTTP/filter tests pass; browser layout and accessibility checks remain pending.
