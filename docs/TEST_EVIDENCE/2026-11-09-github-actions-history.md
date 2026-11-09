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

The P1-05 queue/outbox implementation is a later increment and has not yet completed remote CI. Its current local verification is recorded in `2026-11-09-initial-checkpoint.md`; the next CI run must cover the extended PostgreSQL 16 queue API smoke.
