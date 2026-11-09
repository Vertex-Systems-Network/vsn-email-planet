# UX and design specification — initial slice

## Product principles

- Every view answers current verified state, allowed action, impact, verification/reversal, or next step.
- Show freshness and provenance. The first dashboard labels every metric as synthetic demo data.
- Keep dense operations readable, keyboard usable and status understandable without color alone.
- Use a neutral warm-gray surface, ink/navy navigation, restrained violet brand action and semantic green/amber/red status. Avoid fake real-time indicators.
- Build responsive layout, reduced-motion behavior, visible focus, semantic landmarks and accessible names from the start. RTL readiness is required before localization release.

## Visual direction scorecard

| Direction | Strength | Risk | Decision |
|---|---|---|---|
| A. Quiet operations console: warm neutral canvas, ink rail, violet action accent | Clear hierarchy, dense-data friendly, distinct without decoration | Requires disciplined spacing and contrast | Selected for prototype |
| B. High-contrast dark command center | Strong incident visibility | Poor long-session reading and chart density without a dedicated light mode | Deferred |
| C. Bright consumer mail client | Familiar inbox affordances | Hides admin provenance/risk hierarchy; weak differentiation for operators | Rejected for primary admin shell |

Selection is a design hypothesis, not a usability study result.

## Initial route and states

`/` — overview dashboard. Shows synthetic sample connection inventory, operational summary and mailbox list; no real provider activity. Initial viewport has navigation, workspace scope, persistent demo notice, operational KPI cards, provider health and recent mailbox table. Search filters the local sample dataset. All other navigation routes are future work and must not imply functionality.

Required next states: empty workspace, connection partial/offline, stale observation, filter no-results, permission denied, provider rate limited, narrow viewport, keyboard-only and screen-reader validation.
