# Current API contract

This is a prototype contract, not a versioned production API. Fixture routes use synthetic records and the local server binds to `127.0.0.1`; the separate NestJS session routes use PostgreSQL and remain a partial identity foundation.

| Method/path | Auth | Behavior | State |
|---|---|---|---|
| `GET /api/health` | none | Returns `LOCAL_SYNTHETIC`, `persistent:false`, `providersConnected:false`. | Implemented |
| `GET /api/providers` | public fixture bearer token | Returns only resources matching the fixture actor's organization, with `no-store`. | Implemented for local fixtures |
| `GET /api/domains` | public fixture bearer token | Returns only the actor's synthetic domain metadata; DNS status is explicitly unverified. | Implemented locally |
| `GET /api/domains/{id}` | public fixture bearer token | Returns same-tenant synthetic domain metadata or non-disclosing 404. | Implemented locally |
| `GET /api/mailboxes` | public fixture bearer token | Returns only the actor's synthetic mailbox metadata; no message or credential fields exist. | Implemented locally |
| `GET /api/mailboxes/{id}` | public fixture bearer token | Returns same-tenant synthetic mailbox metadata or non-disclosing 404. | Implemented locally |
| `GET /api/providers/{id}` | public fixture bearer token | Returns same-tenant resource or non-disclosing 404. | Implemented for local fixtures |
| `GET /api/providers/{id}/capabilities` | public fixture bearer token | Returns that tenant’s synthetic operation-level capability manifest or non-disclosing 404. Mutations are not supported. | Implemented for local fixtures |
| `POST /api/session/logout` | PostgreSQL session cookie + same-origin CSRF proof | Revokes current session, atomically audits success and clears cookies. | Implemented as a limited session lifecycle route |
| Other `POST/PUT/PATCH/DELETE /api/*` | Not available | Returns 405; no provider mutation exists. | Explicitly unavailable |

Errors use `{error:{code,message}}`; fixture success returns `{data,meta:{environment,organizationId,role}}`. Fixture actor tokens are public strings and are not sessions, credentials, or production authorization. The separate NestJS session endpoints use PostgreSQL-backed session resolution and are only a partial lifecycle foundation. No login/credential verification, OAuth, mailbox-content endpoint, provider mutation, sending or external service call is implemented.


## Provider capability manifest

The framework-neutral local helper in `apps/api/src/capabilities.js` defines operation-level states and fails closed for unknown, unsupported, permission-gated, stale/malformed or duplicate records. See `docs/CAPABILITY_CONTRACT.md`. The provider detail modal renders these records with state, reason, source, timestamp and next action. This is not provider connectivity or production authorization.

## Production identity and tenant authorization contract (P1-06)

This is the implementation contract for the first authenticated API slice. It supersedes fixture bearer identities for any production path. It does not claim that authentication is implemented. The web prototype may continue using public synthetic fixtures only on explicitly local demo routes; those values must never be accepted by production middleware.

### Trust boundary and actor

- An unauthenticated request has no actor. A production actor is created only by server-side session resolution after validating an opaque session secret against its stored digest and checking that the session is active and unexpired.
- The actor is `{ userId, sessionId, organizationId, membershipRole, membershipVersion }`. It is an immutable request-scoped value, constructed from current database rows. No caller-supplied organization, role, user ID, or membership version is authoritative.
- A request with multiple memberships must select an organization through a dedicated session-context operation. The server verifies current active membership before changing the session context and rotates the session identifier/secret after the context change. Resource requests cannot switch tenant via a query, header, route, or body field.
- Disabled users, revoked/expired sessions, suspended or removed memberships, and stale membership versions fail closed before controller or job-handler dispatch.

### Session transport and lifecycle

- Browser sessions use a high-entropy, cryptographically random opaque secret in a `Secure; HttpOnly; SameSite=Lax; Path=/` cookie. Production cookies are host-only and do not specify `Domain`. State-changing browser requests require same-origin validation and a CSRF defense bound to the session. Tokens never appear in URLs, logs, analytics, or client-readable storage.
- Persist only a keyed digest of the session secret, never the raw secret. Persist user ID, active organization ID, creation/last-seen/absolute-expiry/idle-expiry timestamps, revocation timestamp/reason, and membership version. Secret hashing key rotation and session expiry policy are configuration requirements before deployment.
- Login and session-context changes rotate secrets; logout revokes the server-side session and clears the cookie with matching attributes. Password reset, user disablement, and security-sensitive membership changes revoke affected sessions. Expiry and revocation are checked on every request, not only when the session is created.
- Platform identity policy is selected in [ADR-0003](DECISIONS/ADR-0003-IDENTITY-AUTHENTICATION.md). Password verifier/schema and credential lookup are implemented; protected first-admin HTTP bootstrap passed [run 42922183396](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42922183396). Bootstrap creates no session. Login, shared throttling, MFA/recovery and invitations remain open. Cookie key rotation, deployment-specific expiry and measured hash work-factor tuning remain required before production. Do not claim login until implementation and tests pass.

### Tenant-scoped authorization

- Each protected request resolves the session and reloads user status and the active organization membership from authoritative storage. The actor's organization and role are derived from that row.
- Every organization-owned read, direct-ID lookup, search, pagination count, export, and mutation includes the actor organization predicate in the storage query. Post-fetch filtering or a UI-only check is not sufficient. Composite foreign keys should preserve same-tenant relationships where applicable.
- An unknown ID and an ID owned by another organization return the same non-disclosing `404 RESOURCE_NOT_FOUND` response. Unauthenticated/invalid sessions return `401 AUTH_REQUIRED`. Authenticated actors lacking an operation role return `403 PERMISSION_DENIED` only when disclosing existence is safe; otherwise use the non-disclosing 404 policy. No response includes another tenant's identifiers, counts, names, or timing-sensitive details.
- Mailbox-content access is a separate capability: an active tenant membership and provider-admin role do not imply content access. The request must also carry a current, mailbox-specific content grant with the required consent state and scope. Apply the same tenant predicate to the grant and mailbox.

### Queued work and revocation

- Enqueue records the initiating user, organization, operation, target IDs, required capability snapshot/version, and minimal audit correlation ID. It must not serialize a bearer/session secret or assume enqueue-time authorization remains valid.
- Immediately before handler dispatch, the worker reloads user status, current organization membership, target ownership, and required grants/capabilities. Revoked membership or grant yields a terminal `authorization_revoked` outcome and no provider call. A dispatched external mutation with uncertain outcome follows the existing unknown/reconciliation policy; it is never blindly replayed.
- Persisted queue payloads and retry/dead-letter records are tenant-scoped and redact mailbox content and credentials. Cross-tenant job IDs receive the same non-disclosing not-found behavior as other resources.

### Audit events

- Record successful and denied login/session creation, logout/revocation, organization-context changes, membership role/status changes, authorization denials, and privileged mutations with actor (nullable for pre-auth failures), organization (when known), action, outcome, target type/ID, timestamp, request correlation ID, and allowlisted safe attributes.
- Never record session secrets, passwords, OAuth tokens, message bodies, full request bodies, or raw authorization headers. Audit writes are append-only for application roles and must not fail open for security-critical authorization or membership mutations.
- Pre-authentication failures use a platform/security audit scope because no tenant can be trusted. A tenant ID inferred only from untrusted request data is not used as the audit organization.

### Required denial and recovery behavior

| Scenario | Required result | Side effects |
|---|---|---|
| Missing, malformed, expired, or revoked session | `401 AUTH_REQUIRED` | No controller/job dispatch; safe security audit event |
| Active session, disabled user, or inactive membership | `401 AUTH_REQUIRED` or `403 PERMISSION_DENIED` per non-disclosure policy | Revoke session where required; no protected read/write |
| Cross-tenant direct ID or search | Non-disclosing empty result/`404 RESOURCE_NOT_FOUND` | No foreign row/count/metadata leakage; audit denial |
| Membership revoked after queue enqueue | Job stops before handler dispatch as `authorization_revoked` | No provider side effect; audit correlation retained |
| Missing/revoked mailbox content grant | `403 PERMISSION_DENIED` or non-disclosing 404 | No content access; no provider call |
| Audit persistence unavailable for a security-critical write | Fail closed with service error | Do not perform the protected mutation |

### Acceptance evidence before P1-06 can be verified

1. Unit tests prove untrusted tenant/role fields cannot create or widen an actor.
2. Two-tenant API tests cover direct IDs, list/search/count/pagination, mutation, and non-disclosing responses.
3. Session tests cover rotation, expiry, logout/revocation, disabled user, and membership switch/revocation.
4. A queued-job test revokes membership after enqueue and proves no handler/provider dispatch occurs.
5. Audit tests prove required actions are recorded and secrets/content are excluded.
6. The selected identity implementation and the full test suite pass; local contract documentation alone is not production authentication evidence.


### Implemented runtime slice — 2026-11-11

- `0004_identity_sessions.sql` adds versioned organization memberships and digest-only session records with a composite membership foreign key. Role/status changes advance the membership version so an existing session fails closed.
- The NestJS `GET /api/session/me` route is guarded by `SessionAuthGuard`. It reads only the host-only `__Host-vsn_session` cookie and derives the immutable actor from `auth_sessions`, `platform_users` and the exact active organization membership. Query, header and body identity claims are ignored; actor responses are `Cache-Control: no-store`.
- `POST /api/session/logout` is guarded by both the session and CSRF guards. It requires an exact configured `APP_ORIGIN`, matching `__Host-vsn_csrf` cookie and `X-CSRF-Token` header, and a per-session stored CSRF digest. Session revocation and the `session.logout` audit event are committed atomically. It clears both host-only cookies with matching path/security attributes.
- Session creation must mint a new 256-bit CSRF token and store only `digestCsrfToken(token, SESSION_DIGEST_KEY)` in `csrf_digest`; that token must be delivered in a Secure, SameSite=Strict, JavaScript-readable host-only cookie. No session issuance endpoint exists yet, so current HTTP logout coverage seeds only synthetic CI sessions.
- Configure `DATABASE_URL` and `SESSION_DIGEST_KEY` (32 random bytes encoded as base64url) before this route can verify presented sessions. Missing/malformed cookies return `401 AUTH_REQUIRED`; missing runtime configuration or database failure fails closed with a service-unavailable response. Do not log the cookie or digest key.
- CI verifies missing-cookie denial and a PostgreSQL-backed synthetic session, forged tenant-context rejection and membership-revocation denial. The smoke fixture is test-only and creates no reusable credentials.
- This slice does not implement login/credential verification, MFA, session issuance/rotation or CSRF token delivery. Logout is implemented only for already-issued valid sessions; audit currently records successful logout, while denial-event auditing, resource-specific RBAC/ABAC and queued-job reauthorization remain open. The implementation plan is decomposed into P1-11 through P1-14. This is not production authentication or full P1-06 completion.

### Local credential verifier foundation — 2026-11-11

Migration `0006_platform_password_credentials.sql` adds a one-to-one platform-user credential row; it does not store provider credentials. The dependency-free helper `apps/api/src/password-auth.js` enforces the current length/context policy and produces a versioned scrypt verifier using N=32768, r=8, p=3, a random 16-byte salt and a 32-byte derived key. Only canonical verifier strings with the exact supported parameter set are accepted. The verifier helper and schema are foundations only: no login, bootstrap, invitation, MFA, recovery or session-issuance endpoint exists yet. See ADR-0003 and P1-11.

### Credential lookup foundation — 2026-11-11

`verifyLocalCredential(pool, email, password)` checks only platform password credentials, performs dummy scrypt work for unknown/malformed account lookups, and returns current active memberships only after a valid password. It returns one generic `null` result for unknown, disabled, invalid-password and membership-less accounts. This helper does not issue sessions, enforce shared rate limits or record audit events; there is still no login or bootstrap route.


## First-admin bootstrap

`POST /api/auth/bootstrap` is available only while the platform has no users and the database bootstrap claim is absent. The caller must provide the configured exact `Origin` and the environment-only `x-vsn-bootstrap-token`; both are required. The 32-byte base64url token is compared in constant time, is never stored or included in audit data, and deployment access logs must redact the header. Responses are `no-store`.

A successful call atomically creates the initial organization, active owner membership, versioned password verifier, one-time claim and success audit event. It returns opaque IDs plus `mfaEnrollmentRequired: true`; it does not create a session, set cookies, grant usable privileged access, or send email. Bootstrap cannot be retried after any platform user exists. Operators must configure a canonical `APP_ORIGIN`, inject a fresh random token through the deployment secret manager, and remove/rotate that secret after the claim is established.

Wrong origin/token and malformed input fail without identity writes. A database or required-audit failure rolls back the whole operation and returns a generic unavailable response. External account verification and mail delivery are not part of this boundary.


### First-admin bootstrap (verified; no session issuance)

`POST /api/auth/bootstrap` requires exact `Origin === APP_ORIGIN` and a canonical 32-byte base64url secret in `x-vsn-bootstrap-token`, compared in constant time. Input is validated against password policy; responses are non-cacheable and denial details generic. PostgreSQL atomically claims setup and writes organization, owner membership, password verifier and success audit. Replay conflicts; concurrent requests create at most one administrator; audit failure rolls back the full operation. Success returns opaque IDs and requires MFA enrollment; it creates no session/cookie and sends no email. Evidence: run [42922183396](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42922183396), `docs/TEST_EVIDENCE/2026-11-10-p1-11-bootstrap-http.md`.
