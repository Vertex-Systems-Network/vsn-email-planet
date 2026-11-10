import type { Pool, PoolClient } from "pg";

export const SESSION_DATABASE_POOL = "SESSION_DATABASE_POOL";

type SessionRow = {
  id: string;
  userId: string;
  organizationId: string;
  membershipVersion: number;
  revokedAt: Date | null;
  expiresAt: Date;
  idleExpiresAt: Date;
};
type UserRow = { id: string; status: string };
type MembershipRow = {
  organizationId: string;
  role: string;
  status: string;
  version: number;
};
type DigestRow = { csrfDigest: Uint8Array | null };
type IdRow = { id: string };

type SessionActor = {
  sessionId: string;
  userId: string;
  organizationId: string;
};

async function revokeSessionTransaction(client: PoolClient, actor: SessionActor): Promise<boolean> {
  await client.query("BEGIN");
  try {
    const revoked = await client.query<IdRow>(
      `UPDATE auth_sessions
          SET revoked_at = now(), revocation_reason = 'user_logout'
        WHERE id = $1 AND user_id = $2 AND organization_id = $3 AND revoked_at IS NULL
        RETURNING id::text AS id`,
      [actor.sessionId, actor.userId, actor.organizationId],
    );
    if (revoked.rows.length === 0) {
      await client.query("ROLLBACK");
      return false;
    }
    await client.query(
      `INSERT INTO audit_events
        (organization_id, actor_user_id, action_key, outcome, target_type, target_id, safe_attributes)
       VALUES ($1, $2, 'session.logout', 'succeeded', 'session', $3, '{}'::jsonb)`,
      [actor.organizationId, actor.userId, actor.sessionId],
    );
    await client.query("COMMIT");
    return true;
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  }
}

/** PostgreSQL adapter used by the session resolver; identity values come from stored rows. */
export function createSessionRepository(pool: Pick<Pool, "query" | "connect">) {
  return {
    async findSessionByDigest(digest: Uint8Array) {
      const result = await pool.query<SessionRow>(
        `SELECT id::text AS id,
                user_id::text AS "userId",
                organization_id::text AS "organizationId",
                membership_version AS "membershipVersion",
                revoked_at AS "revokedAt",
                expires_at AS "expiresAt",
                idle_expires_at AS "idleExpiresAt"
           FROM auth_sessions
          WHERE secret_digest = $1
          LIMIT 1`,
        [Buffer.from(digest)],
      );
      return result.rows[0] ?? null;
    },

    async findUserById(userId: string) {
      const result = await pool.query<UserRow>(
        `SELECT id::text AS id, status
           FROM platform_users
          WHERE id = $1
          LIMIT 1`,
        [userId],
      );
      return result.rows[0] ?? null;
    },

    async findMembership(userId: string, organizationId: string) {
      const result = await pool.query<MembershipRow>(
        `SELECT organization_id::text AS "organizationId",
                role,
                status,
                version
           FROM organization_memberships
          WHERE user_id = $1 AND organization_id = $2
          LIMIT 1`,
        [userId, organizationId],
      );
      return result.rows[0] ?? null;
    },

    async findCsrfDigestForSession(sessionId: string, userId: string, organizationId: string) {
      const result = await pool.query<DigestRow>(
        `SELECT csrf_digest AS "csrfDigest"
           FROM auth_sessions
          WHERE id = $1 AND user_id = $2 AND organization_id = $3
            AND revoked_at IS NULL`,
        [sessionId, userId, organizationId],
      );
      return result.rows[0]?.csrfDigest ?? null;
    },

    async revokeSession(actor: SessionActor) {
      const client = await pool.connect();
      try {
        return await revokeSessionTransaction(client, actor);
      } finally {
        client.release();
      }
    },
  };
}
