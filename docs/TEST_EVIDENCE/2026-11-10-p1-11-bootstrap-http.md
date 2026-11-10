# P1-11 protected first-admin HTTP bootstrap evidence

- Commit: `638b4af1f37341cd9a41965979f4950e23650eec`
- GitHub Actions: [run 42922183396](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42922183396)
- Result: all workflow jobs passed, including typecheck, unit/PGlite, PostgreSQL 16, backlog/state validation, build, API/bootstrap HTTP smoke and high-severity dependency audit.

## Verified behavior

- Missing/invalid token and wrong Origin are denied without writes; malformed account/password data is rejected.
- Setup claim, organization, owner membership, password verifier and success audit are atomic. Injected audit failure rolls back all writes.
- Two concurrent bootstrap requests produce exactly one success and one conflict; replay cannot create a second administrator.
- Success returns opaque IDs and requires MFA enrollment. It creates no session or cookie, does not reveal the bootstrap secret and sends no email.
- Responses prevent caching and denial messages do not reveal internal setup state.

## Failure and recovery record

| Commit | Run | Result | Repair |
|---|---:|---|---|
| `4ce3068` | [42921685209](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42921685209) | Invalid-secret fixture was a valid canonical base64url value. | Replaced it with a non-canonical trailing-bits fixture. |
| `48cbbd9` | [42921900192](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42921900192) | HTTP smoke found runtime auth helpers missing from compiled bundle. | Added runtime asset manifest entries. |
| `638b4af` | [42922183396](https://github.com/Vertex-Systems-Network/vsn-email-planet/actions/runs/42922183396) | Full workflow passed. | Verified checkpoint. |

## Not verified

Login/session issuance, shared throttling, MFA/recovery, invitation lifecycle, live mail delivery and production deployment remain open. P1-06 remains PARTIALLY_VERIFIED.
