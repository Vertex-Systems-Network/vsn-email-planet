import { randomBytes } from 'node:crypto';
import { createPasswordVerifier, verifyPassword } from './password-auth.js';

const ACTIVE_ROLES = new Set(['owner', 'admin', 'operator', 'auditor', 'viewer']);
const DUMMY_PASSWORD = randomBytes(48).toString('base64url');
const dummyVerifier = createPasswordVerifier(DUMMY_PASSWORD);

function normalizedEmail(value) {
  if (typeof value !== 'string' || value.length > 320) return null;
  const email = value.trim().toLowerCase();
  if (email.length < 6 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return null;
  return email;
}

function boundedPassword(value) {
  return typeof value === 'string' && Buffer.byteLength(value, 'utf8') <= 4096;
}

/**
 * Verify a local platform credential without exposing account state.
 * Returns current active memberships only after a valid password; never creates a session.
 */
export async function verifyLocalCredential(pool, emailInput, password) {
  const email = normalizedEmail(emailInput);
  if (!email || !boundedPassword(password)) {
    const dummy = await dummyVerifier;
    await verifyPassword(boundedPassword(password) ? password : '', dummy);
    return null;
  }

  const result = await pool.query(
    `SELECT u.id::text AS "userId",
            u.status AS "userStatus",
            c.password_verifier AS "passwordVerifier"
       FROM platform_users u
       LEFT JOIN platform_password_credentials c ON c.user_id = u.id
      WHERE u.email = $1
      LIMIT 1`,
    [email],
  );
  const user = result.rows[0] ?? null;
  const verifier = typeof user?.passwordVerifier === 'string'
    ? user.passwordVerifier
    : await dummyVerifier;
  const passwordMatches = await verifyPassword(password, verifier);
  if (!user || user.userStatus !== 'active' || !passwordMatches) return null;

  const memberships = await pool.query(
    `SELECT organization_id::text AS "organizationId",
            role,
            version
       FROM organization_memberships
      WHERE user_id = $1 AND status = 'active'
      ORDER BY organization_id`,
    [user.userId],
  );
  const activeMemberships = memberships.rows
    .filter(row => ACTIVE_ROLES.has(row.role))
    .map(row => Object.freeze({
      organizationId: row.organizationId,
      role: row.role,
      membershipVersion: row.version,
    }));
  if (activeMemberships.length === 0) return null;

  return Object.freeze({
    userId: user.userId,
    memberships: Object.freeze(activeMemberships),
  });
}
