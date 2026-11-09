# Deployment matrix (initial)

| Mode | Status | Notes |
|---|---|---|
| Local synthetic demo | Supported | Node 22+, no external dependencies; no real mail |
| VPS/container self-host | Planned | Needs DB, queue, persistent storage, TLS, workers, measured sizing |
| Managed cloud | Future | Tenant/data region, operational controls and processor terms required |
| Shared cPanel hosting | Unsupported assumption | Long-running workers/queue/network egress not guaranteed |
| Desktop/mobile | Later phases | Only after web and sync security gates |

No production sizing or provider-endpoint allowlist is published yet.
