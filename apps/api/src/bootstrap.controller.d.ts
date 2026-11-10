import type { Pool } from "pg";

export type FirstAdminBootstrapHttpResult = Readonly<{
  data: Readonly<{
    userId: string;
    organizationId: string;
    mfaEnrollmentRequired: true;
  }>;
}>;

export class BootstrapController {
  constructor(pool: Pool);
  bootstrap(request: unknown, response: unknown): Promise<FirstAdminBootstrapHttpResult>;
}
