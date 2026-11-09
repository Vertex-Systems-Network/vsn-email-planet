# Known issues and release gaps

Last reviewed: 2026-11-09.

- No production authentication, verified session, tenant membership persistence, database, durable queue, audit store, secret encryption/key management or provider adapter exists. The dashboard is a labeled synthetic prototype and is not suitable for production use.
- The visual screen has only been checked through a production build and HTTP content smoke; keyboard interaction, responsive browser rendering, contrast and WCAG checks remain open.
- The npm advisory service returned HTTP 503 once; a subsequent `npm audit --audit-level=high` succeeded with 0 reported vulnerabilities. Treat the successful dated audit as the current result; rerun before releases.
- GitHub Actions has been configured but has not yet run on the remote repository. CI status and push confirmation must be recorded after checkpointing.
- No public license has been selected; `LICENSE` reserves rights and allows no reuse grant.
- Competitor/pricing/provider research remains incomplete and contains only a bounded initial comparison. No unique market gap or VSN price is validated.
