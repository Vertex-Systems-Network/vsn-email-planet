# Current local API contract

This is a prototype contract, not a versioned production API. Server binds to `127.0.0.1`; records are hard-coded synthetic fixtures.

| Method/path | Auth | Behavior | State |
|---|---|---|---|
| `GET /api/health` | none | Returns `LOCAL_SYNTHETIC`, `persistent:false`, `providersConnected:false`. | Implemented |
| `GET /api/providers` | public fixture bearer token | Returns only resources matching the fixture actor's organization, with `no-store`. | Implemented for local fixtures |
| `GET /api/domains` | public fixture bearer token | Returns only the actor's synthetic domain metadata; DNS status is explicitly unverified. | Implemented locally |
| `GET /api/mailboxes` | public fixture bearer token | Returns only the actor's synthetic mailbox metadata; no message or credential fields exist. | Implemented locally |
| `GET /api/providers/{id}` | public fixture bearer token | Returns same-tenant resource or non-disclosing 404. | Implemented for local fixtures |
| `GET /api/providers/{id}/capabilities` | public fixture bearer token | Returns that tenant’s synthetic operation-level capability manifest or non-disclosing 404. Mutations are not supported. | Implemented for local fixtures |
| `POST/PUT/PATCH/DELETE /api/*` | fixture bearer token required | Returns 405; no provider mutation exists. | Explicitly unavailable |

Errors use `{error:{code,message}}`; success returns `{data,meta:{environment,organizationId,role}}`. Fixture actor tokens are public strings in source and are not a session, credential, or usable production authorization. No database, real authentication, OAuth, mailbox-content endpoint, sending or external service call is implemented.


## Provider capability manifest

The framework-neutral local helper in `apps/api/src/capabilities.js` defines operation-level states and fails closed for unknown, unsupported, permission-gated, stale/malformed or duplicate records. See `docs/CAPABILITY_CONTRACT.md`. The provider detail modal renders these records with state, reason, source, timestamp and next action. This is not provider connectivity or production authorization.
