# Deployment matrix (planned)

| Mode | Current state | Planned dependency |
|---|---|---|
| Local synthetic demo | Prototype | Node/npm; no provider credentials |
| Local integration development | Not implemented | PostgreSQL, Redis, mock provider fixtures |
| Self-hosted VPS / Docker Compose | Not implemented | Persistent PostgreSQL, queue workers, TLS/reverse proxy, backup/object storage |
| Managed cloud | Not implemented | Tenant/security model, operational SLOs and policy review |
| Desktop/mobile | Deferred | Web/API stability and platform-specific security/UX gates |

Do not claim ordinary restricted shared hosting can run the required persistent worker and storage services. Resource sizing requires measured workloads.
