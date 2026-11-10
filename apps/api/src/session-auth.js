import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const SESSION_SECRET_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const ACTIVE_ROLE_SET = new Set(['owner', 'admin', 'operator', 'auditor', 'viewer']);

/** Create an opaque 256-bit browser session secret. Store only its keyed digest. */
export function createSessionSecret() {
  return randomBytes(32).toString('base64url');
}

/** HMAC the opaque session secret with a server-held key before repository lookup. */
export function digestSessionSecret(secret, digestKey) {
  if (typeof secret !== 'string' || !SESSION_SECRET_PATTERN.test(secret)) return null;
  if (!(digestKey instanceof Uint8Array) || digestKey.byteLength < 32) {
    throw new TypeError('Session digest key must contain at least 32 bytes.');
  }
  return createHmac('sha256', digestKey).update(secret, 'utf8').digest();
}

/** Hash a synchronizer token with a distinct context before persistence/comparison. */
export function digestCsrfToken(token, digestKey) {
  if (typeof token !== 'string' || !SESSION_SECRET_PATTERN.test(token)) return null;
  if (!(digestKey instanceof Uint8Array) || digestKey.byteLength < 32) {
    throw new TypeError('Session digest key must contain at least 32 bytes.');
  }
  return createHmac('sha256', digestKey).update('vsn-csrf-v1:', 'utf8').update(token, 'utf8').digest();
}

function validDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

/**
 * Resolve an actor exclusively from server-side session, user, and active-membership records.
 * The repository must perform tenant predicates in storage queries; request claims are ignored.
 */
export async function resolveSessionActor({ sessionSecret, digestKey, repository, now = new Date() }) {
  const digest = digestSessionSecret(sessionSecret, digestKey);
  if (!digest || !repository || typeof repository.findSessionByDigest !== 'function') {
    return { ok: false, reason: 'invalid_session' };
  }

  const session = await repository.findSessionByDigest(digest);
  if (!session || session.revokedAt) return { ok: false, reason: 'invalid_session' };

  const instant = validDate(now);
  const absoluteExpiry = validDate(session.expiresAt);
  const idleExpiry = validDate(session.idleExpiresAt);
  if (!instant || !absoluteExpiry || !idleExpiry || absoluteExpiry <= instant || idleExpiry <= instant) {
    return { ok: false, reason: 'invalid_session' };
  }

  const [user, membership] = await Promise.all([
    repository.findUserById(session.userId),
    repository.findMembership(session.userId, session.organizationId),
  ]);
  if (user?.id !== session.userId || user.status !== 'active'
    || membership?.organizationId !== session.organizationId || membership.status !== 'active') {
    return { ok: false, reason: 'inactive_identity' };
  }
  if (!ACTIVE_ROLE_SET.has(membership.role)) return { ok: false, reason: 'inactive_identity' };
  if (membership.version !== session.membershipVersion) return { ok: false, reason: 'membership_changed' };

  return {
    ok: true,
    actor: Object.freeze({
      userId: user.id,
      sessionId: session.id,
      organizationId: membership.organizationId,
      membershipRole: membership.role,
      membershipVersion: membership.version,
    }),
  };
}

/** Compare a presented secret to a previously stored digest without early byte mismatch exit. */
export function matchesSessionDigest(secret, digestKey, storedDigest) {
  const candidate = digestSessionSecret(secret, digestKey);
  return Boolean(candidate && storedDigest instanceof Uint8Array
    && candidate.byteLength === storedDigest.byteLength
    && timingSafeEqual(candidate, storedDigest));
}
