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

P1-05 has verified database job/outbox primitives but remains partially verified: no running worker/publisher, process-crash recovery, load/soak or production queue decision exists yet. Its local verification report is `verification-20261109T204411Z-e0544bc.md`.
