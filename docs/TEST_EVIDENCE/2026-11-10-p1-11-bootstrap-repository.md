# P1-11 — first-admin bootstrap repository evidence

**Scope:** transactional persistence helper and single-use claim schema only. No public HTTP bootstrap endpoint, login, invitation, session, MFA or outbound mail is included.

## Implementation

- Migration `0007_platform_bootstrap_claims.sql` records one singleton claim and ties it to the created owner membership. It stores no bootstrap token.
- `bootstrapFirstAdmin` serializes first-user creation with a PostgreSQL table lock, refuses bootstrap when any platform user or claim exists, and atomically creates the organization, active owner, versioned password verifier, claim and success audit event.
- Input validation rejects malformed identity fields and unsupported verifier formats before opening a database connection.
- PGlite tests cover successful creation, normalized email, owner role, credential persistence, success audit, singleton claim, replay rejection and invalid-input rejection.

## Verification and recovery history

| Commit | GitHub Actions | Result | Observed issue / scope |
|---|---:|---|---|
| `99eeec1025f5af01f53f9528a5d69da38e1c5a83` | [42919112964](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42919112964) | Failed | Initial test surfaced UUID/text parameter inference in the audit insert; migration expectation also needed the seventh migration. |
| `5cbdf7fc7bf443957a5fa1a01afe2643beebe4fa` | [42919441996](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42919441996) | Failed | Migration expectation passed; audit actor and target reused one parameter with incompatible types. |
| `29e35a2dd3b8ef43c87f44cfe0070f652622f872` | [42919767918](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42919767918) | Passed | Recovery commit separates UUID actor and text target parameters. Full CI, including tests, PostgreSQL 16 smoke, typecheck, build, API/web smoke, backlog validation and dependency audit, passed. |

## Acceptance still open

- Concurrent multi-connection bootstrap race needs a PostgreSQL test; current replay test is sequential.
- HTTP boundary must enforce a one-time high-entropy environment token, exact configured Origin, constant-time token comparison, no-store responses and generic denial.
- Login must require MFA enrollment before privileged access; no session is created by this repository helper.
- Invitation lifecycle, shared throttling, MFA/recovery, login session+CSRF issuance and denial audit remain open.
- No live provider, email delivery or external identity validation was exercised.
