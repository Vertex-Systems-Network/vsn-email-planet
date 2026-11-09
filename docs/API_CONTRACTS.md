# Current local API contract

This is a prototype contract, not a versioned production API. Server binds to `127.0.0.1`; records are hard-coded synthetic fixtures.

| Method/path | Auth | Behavior | State |
|---|---|---|---|
| `GET /api/health` | none | Returns `LOCAL_SYNTHETIC`, `persistent:false`, `providersConnected:false`. | Implemented |
| `GET /api/providers` | public fixture bearer token | Returns only resources matching the fixture actor's organization, with `no-store`. | Implemented for local fixtures |
| `GET /api/providers/{id}` | public fixture bearer token | Returns same-tenant resource or non-disclosing 404. | Implemented for local fixtures |
| `POST/PUT/PATCH/DELETE /api/*` | fixture bearer token required | Returns 405; no provider mutation exists. | Explicitly unavailable |

Errors use `{error:{code,message}}`; success returns `{data,meta:{environment,organizationId,role}}`. Fixture actor tokens are public strings in source and are not a session, credential, or usable production authorization. No database, real authentication, OAuth, mailbox-content endpoint, sending or external service call is implemented.
