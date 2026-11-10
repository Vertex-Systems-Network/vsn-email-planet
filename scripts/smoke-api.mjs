import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { createSessionSecret, digestSessionSecret } from "../apps/api/src/session-auth.js";
import { migrateDatabase } from "../apps/api/db/migrate.mjs";

const databaseUrl = process.env.DATABASE_URL;
const integrationEnabled = process.env.VSN_TEST_DATABASE === "1";
if (integrationEnabled && (!databaseUrl || !new URL(databaseUrl).pathname.endsWith("/vsn_test"))) {
  throw new Error("Refusing session HTTP smoke test: set VSN_TEST_DATABASE=1 and use a disposable database named vsn_test.");
}
if (!integrationEnabled && databaseUrl) {
  throw new Error("Refusing to connect to DATABASE_URL without VSN_TEST_DATABASE=1.");
}

let pool;
let fixture;
let child;
let childOutput = "";
let childSpawnError;
const digestKey = Buffer.alloc(32, 41).toString("base64url");
try {
  if (integrationEnabled) {
    pool = new pg.Pool({ connectionString: databaseUrl, application_name: "vsn-email-planet-session-smoke" });
    const client = await pool.connect();
    try {
      await migrateDatabase(client);
    } finally {
      client.release();
    }
    const suffix = randomUUID();
    const user = await pool.query(
      "INSERT INTO platform_users (email, display_name) VALUES ($1, 'CI session actor') RETURNING id::text AS id",
      [`session-${suffix}@example.test`],
    );
    const orgA = await pool.query(
      "INSERT INTO organizations (slug, display_name) VALUES ($1, 'Session tenant A') RETURNING id::text AS id",
      [`session-a-${suffix}`],
    );
    const orgB = await pool.query(
      "INSERT INTO organizations (slug, display_name) VALUES ($1, 'Session tenant B') RETURNING id::text AS id",
      [`session-b-${suffix}`],
    );
    const userId = user.rows[0].id;
    const organizationA = orgA.rows[0].id;
    const organizationB = orgB.rows[0].id;
    await pool.query(
      "INSERT INTO organization_memberships (organization_id, user_id, role) VALUES ($1, $3, 'operator'), ($2, $3, 'viewer')",
      [organizationA, organizationB, userId],
    );
    const secret = createSessionSecret();
    const key = Buffer.from(digestKey, "base64url");
    const digest = digestSessionSecret(secret, key);
    await pool.query(
      `INSERT INTO auth_sessions
        (user_id, organization_id, secret_digest, membership_version, expires_at, idle_expires_at)
       VALUES ($1, $2, $3, 1, now() + interval '1 hour', now() + interval '15 minutes')`,
      [userId, organizationA, digest],
    );
    fixture = { userId, organizationA, organizationB, secret };
  }

  child = spawn(process.execPath, ["apps/api/dist/main.js"], {
    cwd: new URL("../", import.meta.url),
    env: {
      ...process.env,
      API_PORT: "4000",
      ...(integrationEnabled ? { SESSION_DIGEST_KEY: digestKey } : {}),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.setEncoding("utf8").on("data", chunk => { childOutput = (childOutput + chunk).slice(-4000); });
  child.stderr.setEncoding("utf8").on("data", chunk => { childOutput = (childOutput + chunk).slice(-4000); });
  child.on("error", error => { childSpawnError = error; });

  let response;
  let lastError;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (childSpawnError) throw new Error(`API process failed to start: ${childSpawnError.message}`);
    if (child.exitCode !== null) throw new Error(`API exited before responding (${child.exitCode}).\n${childOutput.trim()}`);
    try {
      response = await fetch("http://127.0.0.1:4000/health");
      break;
    } catch (error) {
      lastError = error;
      await delay(100);
    }
  }
  if (!response) throw new Error(`API health request did not connect: ${lastError}.\n${childOutput.trim()}`);
  const health = await response.json();
  assert.equal(response.ok, true);
  assert.equal(health.verification, "process-only");
  assert.equal(health.providerConnections, false);
  assert.equal(health.persistence, false);

  const unauthenticated = await fetch("http://127.0.0.1:4000/api/session/me");
  assert.equal(unauthenticated.status, 401);
  assert.equal((await unauthenticated.json()).error.code, "AUTH_REQUIRED");

  if (fixture) {
    const authenticated = await fetch("http://127.0.0.1:4000/api/session/me?organizationId=" + fixture.organizationB, {
      headers: {
        cookie: `__Host-vsn_session=${fixture.secret}`,
        "x-organization-id": fixture.organizationB,
      },
    });
    assert.equal(authenticated.status, 200);
    const actor = (await authenticated.json()).data;
    assert.equal(actor.userId, fixture.userId);
    assert.equal(actor.organizationId, fixture.organizationA);
    assert.equal(actor.membershipRole, "operator");

    await pool.query(
      "UPDATE organization_memberships SET status = 'suspended' WHERE organization_id = $1 AND user_id = $2",
      [fixture.organizationA, fixture.userId],
    );
    const revoked = await fetch("http://127.0.0.1:4000/api/session/me", {
      headers: { cookie: `__Host-vsn_session=${fixture.secret}` },
    });
    assert.equal(revoked.status, 401);
    assert.equal((await revoked.json()).error.code, "AUTH_REQUIRED");
  }

  console.log(fixture
    ? "API smoke passed: process-only health; unauthenticated denial; PostgreSQL-backed session actor scope; forged tenant context ignored; membership change denied."
    : "API smoke passed: process-only health and unauthenticated session-route denial; PostgreSQL integration not configured.");
} finally {
  child?.kill("SIGTERM");
  if (pool) {
    if (fixture) {
      await pool.query("DELETE FROM organization_memberships WHERE user_id = $1", [fixture.userId]);
      await pool.query("DELETE FROM platform_users WHERE id = $1", [fixture.userId]);
      await pool.query("DELETE FROM organizations WHERE id IN ($1, $2)", [fixture.organizationA, fixture.organizationB]);
    }
    await pool.end();
  }
}
