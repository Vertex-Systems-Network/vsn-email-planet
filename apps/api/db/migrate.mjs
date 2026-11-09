import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const migrationsDirectory = join(dirname(fileURLToPath(import.meta.url)), "migrations");
const advisoryLockKey = 7210112026;

export async function migrateDatabase(client, { executeSql = (sql) => client.query(sql), directory = migrationsDirectory } = {}) {
  const files = (await readdir(directory)).filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name)).sort();
  const migrations = await Promise.all(files.map(async (name) => {
    const sql = await readFile(join(directory, name), "utf8");
    return { name, sql, checksum: createHash("sha256").update(sql).digest("hex") };
  }));
  if (migrations.length === 0) throw new Error("No database migrations found.");

  await client.query("BEGIN");
  try {
    await executeSql("CREATE SCHEMA IF NOT EXISTS app_meta;");
    await executeSql(`CREATE TABLE IF NOT EXISTS app_meta.schema_migrations (
      migration_id text PRIMARY KEY,
      checksum_sha256 text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    );`);
    await client.query("SELECT pg_advisory_xact_lock($1)", [advisoryLockKey]);

    const appliedResult = await client.query("SELECT migration_id, checksum_sha256 FROM app_meta.schema_migrations");
    const applied = new Map(appliedResult.rows.map((row) => [row.migration_id, row.checksum_sha256]));
    const availableNames = new Set(migrations.map((migration) => migration.name));
    for (const existingName of applied.keys()) {
      if (!availableNames.has(existingName)) throw new Error(`Applied migration ${existingName} is missing from the source tree.`);
    }

    const newlyApplied = [];
    for (const migration of migrations) {
      const existingChecksum = applied.get(migration.name);
      if (existingChecksum) {
        if (existingChecksum !== migration.checksum) throw new Error(`Checksum mismatch for applied migration ${migration.name}.`);
        continue;
      }
      await executeSql(migration.sql);
      await client.query(
        "INSERT INTO app_meta.schema_migrations (migration_id, checksum_sha256) VALUES ($1, $2)",
        [migration.name, migration.checksum],
      );
      newlyApplied.push(migration.name);
    }

    await client.query("COMMIT");
    return { applied: newlyApplied, checked: migrations.length };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function runCli() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to apply database migrations.");
  const { Pool } = await import("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, application_name: "vsn-email-planet-migrate" });
  const client = await pool.connect();
  try {
    const result = await migrateDatabase(client);
    console.log(JSON.stringify({ status: "success", ...result }));
  } finally {
    client.release();
    await pool.end();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runCli().catch((error) => {
    console.error(`Database migration failed: ${error.message}`);
    process.exitCode = 1;
  });
}
