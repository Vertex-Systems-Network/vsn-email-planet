import type { Pool } from 'pg';

export type FirstAdminBootstrapInput = Readonly<{
  email: string;
  displayName: string;
  organizationSlug: string;
  organizationDisplayName: string;
  passwordVerifier: string;
}>;

/** Returns null once bootstrap is claimed or any platform user already exists. */
export function bootstrapFirstAdmin(
  pool: Pick<Pool, 'connect'>,
  input: FirstAdminBootstrapInput,
): Promise<Readonly<{ userId: string; organizationId: string }> | null>;
