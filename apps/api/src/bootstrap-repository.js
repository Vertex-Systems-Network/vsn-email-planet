const BOOTSTRAP_VERIFIER = /^scrypt-v1\$32768\$8\$3\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{43}$/;

function validBootstrapInput(input) {
  if (!input || typeof input !== 'object') return false;
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const slug = input.organizationSlug;
  const displayName = input.organizationDisplayName;
  return email.length >= 6 && email.length <= 320
    && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
    && typeof slug === 'string' && slug.length >= 2 && slug.length <= 63
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    && typeof displayName === 'string' && displayName.trim().length > 0
    && displayName.trim().length <= 160
    && typeof input.displayName === 'string'
    && input.displayName.trim().length > 0 && input.displayName.trim().length <= 160
    && typeof input.passwordVerifier === 'string' && BOOTSTRAP_VERIFIER.test(input.passwordVerifier);
}

async function createBootstrapTransaction(client, input) {
  await client.query('BEGIN');
  try {
    // Serialize bootstrap with all account creation paths; this table lock also prevents
    // a concurrent user insert from racing the initial-user check.
    await client.query('LOCK TABLE platform_users IN SHARE ROW EXCLUSIVE MODE');
    const existing = await client.query(
      'SELECT EXISTS (SELECT 1 FROM platform_users) AS "hasUsers", EXISTS (SELECT 1 FROM platform_bootstrap_claims) AS "isClaimed"',
    );
    if (existing.rows[0]?.hasUsers || existing.rows[0]?.isClaimed) {
      await client.query('ROLLBACK');
      return null;
    }

    const organization = await client.query(
      'INSERT INTO organizations (slug, display_name) VALUES ($1, $2) RETURNING id::text AS id',
      [input.organizationSlug, input.organizationDisplayName.trim()],
    );
    const user = await client.query(
      "INSERT INTO platform_users (email, display_name, status) VALUES ($1, $2, 'active') RETURNING id::text AS id",
      [input.email.trim().toLowerCase(), input.displayName.trim()],
    );
    await client.query(
      "INSERT INTO organization_memberships (organization_id, user_id, role, status) VALUES ($1, $2, 'owner', 'active')",
      [organization.rows[0].id, user.rows[0].id],
    );
    await client.query(
      'INSERT INTO platform_password_credentials (user_id, password_verifier) VALUES ($1, $2)',
      [user.rows[0].id, input.passwordVerifier],
    );
    await client.query(
      'INSERT INTO platform_bootstrap_claims (id, organization_id, user_id) VALUES (1, $1, $2)',
      [organization.rows[0].id, user.rows[0].id],
    );
    await client.query(
      `INSERT INTO audit_events
        (organization_id, actor_user_id, action_key, outcome, target_type, target_id, safe_attributes)
       VALUES ($1, $2, 'platform.bootstrap.completed', 'succeeded', 'platform_user', $2, $3::jsonb)`,
      [organization.rows[0].id, user.rows[0].id, JSON.stringify({ bootstrapVersion: 1 })],
    );
    await client.query('COMMIT');
    return Object.freeze({ userId: user.rows[0].id, organizationId: organization.rows[0].id });
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    throw error;
  }
}

/**
 * Atomically creates the only first platform owner. Bootstrap secrets are validated
 * by the HTTP boundary and are deliberately neither accepted nor persisted here.
 */
export async function bootstrapFirstAdmin(pool, input) {
  if (!validBootstrapInput(input)) throw new TypeError('Invalid first-admin bootstrap input.');
  const client = await pool.connect();
  try {
    return await createBootstrapTransaction(client, input);
  } finally {
    client.release();
  }
}
