# UI library evaluation

**Reviewed:** 2026-11-09. This is a candidate/license/maintenance screen, not a final dependency selection. Public GitHub stars and push timestamps are noisy snapshots; they are not a quality or accessibility score.

| Candidate | Intended use | License snapshot | Trade-off / decision |
|---|---|---|---|
| [React Aria Components](https://react-spectrum.adobe.com/react-aria/) | Dialogs, menus, comboboxes, tables and keyboard/screen-reader interactions with custom styling | Apache-2.0 in [Adobe repository metadata](https://github.com/adobe/react-spectrum) | Strong accessibility-focused candidate and flexible visual styling; evaluate component coverage and React 19 integration on actual screens. |
| [Radix Primitives](https://www.radix-ui.com/primitives) | Unstyled interactive primitives | MIT in [repository metadata](https://github.com/radix-ui/primitives) | Mature composable alternative; do not mix with another primitive stack without clear ownership. |
| [shadcn/ui](https://ui.shadcn.com/) | Copyable/customizable component source and starter patterns | MIT in [repository metadata](https://github.com/shadcn-ui/ui) | Not a normal runtime component package: code is added to the application. Current public docs expose multiple primitive backends; audit each copied component and dependency/license separately. Its default Tailwind-oriented patterns do not automatically fit the current CSS-token baseline. |
| [TanStack Table](https://tanstack.com/table/latest) | Headless operations tables and filtering/sorting state | MIT in [repository metadata](https://github.com/TanStack/table) | Useful behavior layer for large inventories; table markup, keyboard interactions, empty/error states and responsive UX remain our responsibility. |
| [Lucide](https://lucide.dev/) | Consistent interface icons | MIT for listed icons on [official license page](https://lucide.dev/license) | React package is documented as tree-shakable; GitHub API license metadata returned `NOASSERTION`, so use the explicit official license page and review embedded/custom artwork separately. |
| [xyflow / React Flow](https://reactflow.dev/) | Later provider topology, workflow or migration graph canvas | MIT in [repository metadata](https://github.com/xyflow/xyflow) | Defer until a real graph interaction is specified; a diagram library is not an accessible map or a reason to add a canvas early. |

## Dated repository activity snapshot

GitHub repository metadata checked 2026-11-09: Adobe React Spectrum ~16.0k stars and pushed the same day; shadcn/ui ~127.7k and pushed the same day; Radix Primitives ~19.5k and most recent push 2026-10-14; TanStack Table ~28.6k and pushed 2026-11-02; xyflow ~38.9k and pushed the same day. These figures only show public repository metadata, can change, and do not prove package-level compatibility, security, support quality or user adoption.

## Selection gate

No UI dependencies are installed. Before selecting one primitive stack, implement one representative filterable inventory table and one dialog/menu screen; test keyboard-only flow, focus restoration, screen-reader semantics, reduced motion, localization/RTL, React/Next compatibility, bundle size and license notices. Prefer a single interaction primitive family plus standalone behavior libraries (for example, TanStack Table) only where a real screen needs them. Review chart and rich-text editor licensing separately when those features are designed.
