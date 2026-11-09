# GitHub Actions verification history

Historical remote runs are preserved separately from local verification output so rerunning `npm run verify:local` cannot replace CI evidence.

| Commit | Scope | Result | Run |
|---|---|---|---|
| `315737ac1b46fc2b9a827bf70a929fa4319c32c1` | Repository/bootstrap baseline | PASS | [42685458941](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42685458941) |
| `97582d1f8f5851c755141035b64d71104f364359` | PostgreSQL control-plane migrations, including native PostgreSQL 16 smoke | PASS | [42688360871](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42688360871) |
| `82889744af107e8788abc9976023c4001ab7d7d0` | Provider/OAuth research checkpoint | PASS | [42689547230](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42689547230) |
| `720b912f6281ef2ce5ef8debf4dee665d4092fbe` | UI library research checkpoint | PASS | [42689994446](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42689994446) |
| `f65f0efba54540492dd0f25ba97e597cc3810e2b` | Phase 0 research evidence checkpoint | PASS | [42690403340](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42690403340) |
| `44c027b9e310253a66887bb664f1b880fb46c199` | Research papers and OAuth evidence | PASS | [42690990759](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42690990759) |
| `9b408f3a3bf5a31864d8b3274f14a34ab451a8a0` | Provider deletion semantics and Phase 0 checkpoint | PASS | [42691389648](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42691389648) |
| `e0544bc8afd16ca299a43a103390592600424501` | Tenant-scoped job/outbox primitives | PASS, including native PostgreSQL 16 API smoke | [42695093251](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42695093251) |
| `b6b7be32c3ea699da7ebdda7c6caa5f7e1df0259` | Concurrent mailbox claim fencing | PASS, including simultaneous worker claims on PostgreSQL 16 | [42695894564](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42695894564) |
| `22387bfa9f98f34e3a8b6b026a9be18a870311c6` | Queue concurrency evidence and partial-verification checkpoint | PASS | [42696371615](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42696371615) |
| `09ef29a3091188417cd95c988f3fbb2c0ab9efc1` | Handler-driven worker loop with PostgreSQL execution | PASS, including PostgreSQL 16 handler integration | [42697393221](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42697393221) |
| `c1d1652384db8d27b3bddbfbe222b7971ffc9f26` | Callback outbox publisher with PostgreSQL execution | PASS, including PostgreSQL 16 publisher callback integration | [42698327621](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42698327621) |
| `eadd7d8ce32778f9a5af589e2c590b9fd487ce89` | Dashboard mobile-nav keyboard accessibility follow-up | PASS, full CI including PostgreSQL 16 | [42699266795](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42699266795) |
| `3ed6cbada55595e21eedd7c9d48200b89723ea64` | Verification-state documentation checkpoint | FAIL: backlog validator found a corrupted JSON blob; corrected from passing parent in the next checkpoint | [42699887844](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42699887844) |
| `4526f0ff2ab4dda705ed3d1328be545a77662597` | Restore valid task ledger and record CI failure | PASS, full CI including PostgreSQL 16 | [42700469822](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42700469822) |
| `2cb7eb0b1eab9353651243a69c4377465f404191` | Synchronize resumable checkpoint after recovery | PASS, full CI including PostgreSQL 16 | [42700880201](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42700880201) |

P1-05 has verified job/outbox primitives, a generic handler-driven worker loop and callback publisher, but remains partially verified: broker adapter, process-crash recovery, load/soak and production queue decision remain open. Local publisher verification is recorded in `verification-20261109T205824Z-09ef29a.md`; later accessibility follow-up verification is `verification-20261109T210340Z-c1d1652.md`.
| `eac29b6a571f4a898320eb14a482b90ed499543a` | Execution-plan guardrails, backlog regression tests, and recovery checkpoint | PASS, full CI including PostgreSQL 16 | [42705339401](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42705339401) |
| `46afedbc9a14a50bb0c1ff15185251d687e828b4` | P1-06 identity/session and tenant-authorization contract | PASS, full CI including PostgreSQL 16 | [42706037041](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42706037041) |
