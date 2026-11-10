import type { Pool } from "pg";

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

/** PostgreSQL adapter used by the session resolver; all identity values come from stored rows. */
export function createSessionRepository(pool: Pick<Pool, "query">) {
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
  };
}
