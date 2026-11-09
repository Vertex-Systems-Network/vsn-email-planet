import assert from "node:assert/strict";
import pg from "pg";
import { migrateDatabase } from "../apps/api/db/migrate.mjs";

const databaseUrl = process.env.DATABASE_URL;
if (process.env.VSN_TEST_DATABASE !== "1" || !databaseUrl || !new URL(databaseUrl).pathname.endsWith("/vsn_test")) {
  throw new Error("Refusing native PostgreSQL smoke test: set VSN_TEST_DATABASE=1 and use a disposable database named vsn_test.");
}

const client = new pg.Client({ connectionString: databaseUrl, application_name: "vsn-email-planet-migration-smoke" });
await client.connect();
try {
  const first = await migrateDatabase(client);
  const second = await migrateDatabase(client);
  assert.ok(first.checked >= 1);
  assert.equal(second.checked, first.checked);
  assert.deepEqual(second.applied, []);

  const organizationA = "00000000-0000-4000-8000-000000000011";
  const organizationB = "00000000-0000-4000-8000-000000000012";
  const connectionId = "10000000-0000-4000-8000-000000000011";
  await client.query("BEGIN");
  try {
    await client.query("INSERT INTO organizations (id, slug, display_name) VALUES ($1, 'ci-tenant-a', 'CI tenant A'), ($2, 'ci-tenant-b', 'CI tenant B')", [organizationA, organizationB]);
    await client.query(
      "INSERT INTO provider_connections (id, organization_id, provider_key, external_account_id, display_name) VALUES ($1, $2, 'imap', 'ci-acct-a', 'CI mailbox server A')",
      [connectionId, organizationA],
    );
    await client.query("SAVEPOINT cross_tenant_check");
    await assert.rejects(client.query(
      "INSERT INTO connection_scopes (organization_id, provider_connection_id, resource_type, resource_id, access_level) VALUES ($1, $2, 'mailbox', 'ci-mailbox-b', 'metadata_read')",
      [organizationB, connectionId],
    ), /foreign key constraint/i);
    await client.query("ROLLBACK TO SAVEPOINT cross_tenant_check");
  } finally {
    await client.query("ROLLBACK");
  }

  console.log("Native PostgreSQL migration smoke passed: migrations are idempotent and tenant-key constraints reject cross-organization links.");
} finally {
  await client.end();
}
