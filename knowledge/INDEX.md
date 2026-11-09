# Knowledge banks

The full bank taxonomy is defined in the master specification. Current active sources:

| Bank | Location | State |
|---|---|---|
| Product requirements | `knowledge/requirements/` + `backlog/tasks.json` | Initial index; scope comes from master spec |
| Ideas/opportunities | `docs/RESEARCH/MARKET_GAPS.md` | Hypotheses only |
| Provider capabilities | `knowledge/providers/`, `docs/RESEARCH/PROVIDER_LIMITS.md` | Partial official-source findings |
| Connector patterns | `docs/ARCHITECTURE.md` | Proposed; no adapter implemented |
| User flows | `docs/UX_SPEC.md`, `docs/diagrams/` | Initial states only |
| Systems/architecture | `knowledge/systems/`, `docs/ARCHITECTURE.md` | Proposal |
| Design/screens | `knowledge/design/`, `knowledge/screens/screen-matrix.csv` | Prototype slice |
| Data model | `docs/DATA_MODEL.md` | Draft |
| API/events | Backlog P2/P3 tasks | Not yet specified in detail |
| Security/abuse | `docs/SECURITY_THREAT_MODEL.md` | Initial threat boundary |
| Migration/recovery | `docs/PRODUCT_SPEC.md`, backlog P6 | Requirements only |
| AI | Master specification, backlog P8 | Policy requirement only |
| Operations | `docs/OPERATIONS_RUNBOOK.md` | Planned |
| Competitors/research/options | `docs/RESEARCH/` | Partial |
| Testing | `docs/TEST_STRATEGY.md`, `test/` | Local synthetic tests |
| Performance/cost | `docs/SLOS.md` | No measurements yet |
| Releases/compatibility | `docs/DEPLOYMENT_MATRIX.md` | Initial local demo only |

Do not create empty record files merely to make the bank list appear complete. Update these sources with dated evidence as work advances.

## Canonical machine-readable catalog

`knowledge/banks.json` contains 20 bank records with current state, evidence sources, alternatives/tradeoffs, priority, dependencies, review date, decision state, documentation links and existing verification paths. The validator checks uniqueness/completeness; future tests should link to focused tests rather than only strategy documents.
