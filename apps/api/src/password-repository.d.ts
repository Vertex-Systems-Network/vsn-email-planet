import type { Pool } from 'pg';

export type VerifiedCredentialMembership = Readonly<{
  organizationId: string;
  role: string;
  membershipVersion: number;
}>;

export type VerifiedLocalCredential = Readonly<{
  userId: string;
  memberships: readonly VerifiedCredentialMembership[];
}>;

/** Returns null for unknown, disabled, invalid-password, or membership-less accounts. */
export function verifyLocalCredential(
  pool: Pick<Pool, 'query'>,
  email: unknown,
  password: unknown,
): Promise<VerifiedLocalCredential | null>;
