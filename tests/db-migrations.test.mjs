import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, copyFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { migrateDatabase } from "../apps/api/db/migrate.mjs";

const sourceMigrationsDirectory = new URL("../apps/api/db/migrations/", import.meta.url);
const sourceMigration = new URL("0001_control_plane.sql", sourceMigrationsDirectory);

test("control-plane migrations apply once and are idempotent", async () => {
  const db = new PGlite();
  try {
    const first = await migrateDatabase(db, { executeSql: (sql) => db.exec(sql) });
    const second = await migrateDatabase(db, { executeSql: (sql) => db.exec(sql) });
    assert.deepEqual(first.applied, ["0001_control_plane.sql", "0002_organization_updated_at.sql"]);
    assert.deepEqual(second.applied, []);
    const history = await db.query("SELECT migration_id, checksum_sha256 FROM app_meta.schema_migrations");
    assert.equal(history.rows.length, 2);
    assert.match(history.rows[0].checksum_sha256, /^[a-f0-9]{64}$/);
  } finally {
    await db.close();
  }
});

test("a later migration upgrades existing organization rows", async () => {
  const directory = await mkdtemp(join(tmpdir(), "vsn-migration-upgrade-"));
  const db = new PGlite();
  try {
    await copyFile(new URL("0001_control_plane.sql", sourceMigrationsDirectory), join(directory, "0001_control_plane.sql"));
    await migrateDatabase(db, { directory, executeSql: (sql) => db.exec(sql) });
    await db.query("INSERT INTO organizations (slug, display_name) VALUES ('upgrade-tenant', 'Upgrade tenant')");

    await copyFile(new URL("0002_organization_updated_at.sql", sourceMigrationsDirectory), join(directory, "0002_organization_updated_at.sql"));
    const upgrade = await migrateDatabase(db, { directory, executeSql: (sql) => db.exec(sql) });
    assert.deepEqual(upgrade.applied, ["0002_organization_updated_at.sql"]);
    const organization = await db.query("SELECT updated_at FROM organizations WHERE slug = 'upgrade-tenant'");
    assert.equal(organization.rows.length, 1);
    assert.ok(organization.rows[0].updated_at);
  } finally {
    await db.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test("tenant-owned connection scopes reject cross-organization relationships", async () => {
  const db = new PGlite();
  try {
    await migrateDatabase(db, { executeSql: (sql) => db.exec(sql) });
    const orgA = "00000000-0000-4000-8000-000000000001";
    const orgB = "00000000-0000-4000-8000-000000000002";
    const connection = "10000000-0000-4000-8000-000000000001";
    await db.query("INSERT INTO organizations (id, slug, display_name) VALUES ($1, 'tenant-a', 'Tenant A'), ($2, 'tenant-b', 'Tenant B')", [orgA, orgB]);
    await db.query(
      "INSERT INTO provider_connections (id, organization_id, provider_key, external_account_id, display_name) VALUES ($1, $2, 'imap', 'acct-a', 'Mailbox server A')",
      [connection, orgA],
    );

    await db.query(
      "INSERT INTO connection_scopes (organization_id, provider_connection_id, resource_type, resource_id, access_level) VALUES ($1, $2, 'mailbox', 'mbx-a', 'metadata_read')",
      [orgA, connection],
    );
    await assert.rejects(
      db.query(
        "INSERT INTO connection_scopes (organization_id, provider_connection_id, resource_type, resource_id, access_level) VALUES ($1, $2, 'mailbox', 'mbx-b', 'metadata_read')",
        [orgB, connection],
      ),
      /foreign key constraint/i,
    );
  } finally {
    await db.close();
  }
});

test("migration source contains no seeded mail body or credentials", async () => {
  const migration = await readFile(sourceMigration, "utf8");
  assert.doesNotMatch(migration, /message_body|raw_mime|access_token|refresh_token/i);
  assert.match(migration, /credential_reference text/);
  assert.doesNotMatch(migration, /credential_reference\s+text\s+NOT NULL/i);
});

test("migration checksum drift is rejected without applying changed source", async () => {
  const directory = await mkdtemp(join(tmpdir(), "vsn-migration-checksum-"));
  const db = new PGlite();
  const file = join(directory, "0001_control_plane.sql");
  try {
    await copyFile(sourceMigration, file);
    await migrateDatabase(db, { directory, executeSql: (sql) => db.exec(sql) });
    await writeFile(file, `${await readFile(file, "utf8")}\n-- modified applied migration\n`);
    await assert.rejects(migrateDatabase(db, { directory, executeSql: (sql) => db.exec(sql) }), /Checksum mismatch/);
    const history = await db.query("SELECT count(*)::int AS count FROM app_meta.schema_migrations");
    assert.equal(history.rows[0].count, 1);
  } finally {
    await db.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test("failed migrations roll back schema changes and migration records", async () => {
  const directory = await mkdtemp(join(tmpdir(), "vsn-migration-rollback-"));
  const db = new PGlite();
  try {
    await writeFile(join(directory, "0001_invalid_fixture.sql"), "CREATE TABLE migration_fixture (id integer);\nTHIS IS NOT VALID SQL;\n");
    await assert.rejects(migrateDatabase(db, { directory, executeSql: (sql) => db.exec(sql) }));
    const schema = await db.query("SELECT to_regclass('app_meta.schema_migrations') AS migration_table");
    const fixture = await db.query("SELECT to_regclass('public.migration_fixture') AS fixture_table");
    assert.equal(schema.rows[0].migration_table, null);
    assert.equal(fixture.rows[0].fixture_table, null);
  } finally {
    await db.close();
    await rm(directory, { recursive: true, force: true });
  }
});
