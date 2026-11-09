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
