# UI library evaluation — shortlist

Checked 2026-11-09 against official project documentation/repositories. No packages are installed in the prototype.

| Candidate | Evidence | Initial decision |
|---|---|---|
| React + Vite | React supports building an app without a full-stack framework; Vite production build emits optimized static assets. | Suitable UI candidate for an authenticated control console; serve the static bundle from same-origin app/API deployment. Confirm current React/Vite compatibility and security advisories before pinning. |
| Radix Primitives | Project describes low-level accessible primitives focused on accessibility, customization and DX; MIT. | Candidate for dialogs, dropdowns and popovers; still requires product-specific keyboard/contrast testing. |
| shadcn/ui | MIT and code-distribution approach; current package metadata shows v4.23.0. | Use only as a source/configuration approach if visual system is intentionally designed; avoid blindly copying defaults or mixing unrelated systems. |
| TanStack Table | Headless table library supporting typed JS frameworks. | Candidate for sorting/filter state, with real server-side semantics built by app code. |
| xyflow / React Flow | React Flow license is MIT and targets node-based editors. | Defer until workflow/topology canvas phase; not a dashboard dependency. |
| Lucide | 1,600+ vector icons, ISC license. | Candidate for consistent iconography; ship only used icons. |

Primary references:
- https://react.dev/learn/installation
- https://vite.dev/guide/
- https://github.com/radix-ui/primitives
- https://github.com/shadcn-ui/ui
- https://tanstack.com/table/v8/docs/introduction
- https://github.com/xyflow/xyflow
- https://github.com/lucide-icons/lucide

Confidence: medium for stated project scope/license snippets; low for current security/performance fit until versions and bundle behavior are tested in our app.
