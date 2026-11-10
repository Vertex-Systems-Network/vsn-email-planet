import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { migrateDatabase } from "../apps/api/db/migrate.mjs";

const databaseUrl = process.env.DATABASE_URL;
if (process.env.VSN_TEST_DATABASE !== "1" || !databaseUrl || !new URL(databaseUrl).pathname.endsWith("/vsn_test")) {
  throw new Error("Refusing bootstrap HTTP smoke test: set VSN_TEST_DATABASE=1 and use a disposable database named vsn_test.");
}

const pool = new pg.Pool({ connectionString: databaseUrl, application_name: "vsn-email-planet-bootstrap-smoke" });
const bootstrapToken = randomBytes(32).toString("base64url");
const origin = "http://127.0.0.1:4001";
let child;
let childOutput = "";
let childSpawnError;
let userId;
let organizationId;
let failureTriggerInstalled = false;

const payload = {
  email: `bootstrap-${randomUUID()}@example.test`,
  displayName: "Bootstrap Owner",
  organizationSlug: `bootstrap-${randomUUID().slice(0, 8)}`,
  organizationDisplayName: "Bootstrap Test Organization",
  password: "a unique secure bootstrap phrase 2026",
};

function request(body = payload, { requestOrigin = origin, token = bootstrapToken } = {}) {
  return fetch(`${origin}/api/auth/bootstrap`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: requestOrigin,
      "x-vsn-bootstrap-token": token,
    },
    body: JSON.stringify(body),
  });
}

async function waitForApi() {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (childSpawnError) throw new Error(`API process failed to start: ${childSpawnError.message}`);
    if (child.exitCode !== null) throw new Error(`API exited before responding (${child.exitCode}).\n${childOutput.trim()}`);
    try {
      const response = await fetch(`${origin}/health`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw new Error(`API health request did not connect: ${lastError}.\n${childOutput.trim()}`);
}

try {
  const client = await pool.connect();
  try { await migrateDatabase(client); } finally { client.release(); }

  const existing = await pool.query(
    "SELECT (SELECT count(*) FROM platform_users)::int AS users, (SELECT count(*) FROM platform_bootstrap_claims)::int AS claims",
  );
  if (existing.rows[0].users !== 0 || existing.rows[0].claims !== 0) {
    throw new Error("Bootstrap smoke requires an empty disposable platform identity database.");
  }

  child = spawn(process.execPath, ["apps/api/dist/main.js"], {
    cwd: new URL("../", import.meta.url),
    env: {
      ...process.env,
      API_PORT: "4001",
      APP_ORIGIN: origin,
      PLATFORM_BOOTSTRAP_TOKEN: bootstrapToken,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.setEncoding("utf8").on("data", chunk => { childOutput = (childOutput + chunk).slice(-4000); });
  child.stderr.setEncoding("utf8").on("data", chunk => { childOutput = (childOutput + chunk).slice(-4000); });
  child.on("error", error => { childSpawnError = error; });
  await waitForApi();

  const badOrigin = await request(payload, { requestOrigin: "https://attacker.example" });
  assert.equal(badOrigin.status, 403);
  assert.equal((await badOrigin.json()).error.code, "BOOTSTRAP_FORBIDDEN");
  assert.equal(badOrigin.headers.get("cache-control"), "no-store");

  const badToken = await request(payload, { token: randomBytes(32).toString("base64url") });
  assert.equal(badToken.status, 403);
  assert.equal((await badToken.json()).error.code, "BOOTSTRAP_FORBIDDEN");

  const badPassword = await request({ ...payload, password: "too short" });
  assert.equal(badPassword.status, 400);
  assert.equal((await badPassword.json()).error.code, "BOOTSTRAP_INPUT_INVALID");

  const badEmail = await request({ ...payload, email: "not-an-email" });
  assert.equal(badEmail.status, 400);
  const badSlug = await request({ ...payload, organizationSlug: "Bad Slug" });
  assert.equal(badSlug.status, 400);

  const deniedState = await pool.query(
    "SELECT (SELECT count(*) FROM platform_users)::int AS users, (SELECT count(*) FROM platform_bootstrap_claims)::int AS claims, (SELECT count(*) FROM auth_sessions)::int AS sessions",
  );
  assert.deepEqual(deniedState.rows[0], { users: 0, claims: 0, sessions: 0 });

  await pool.query(`
    CREATE FUNCTION public.vsn_test_reject_bootstrap_audit() RETURNS trigger
    LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic bootstrap audit failure'; END $$;
  `);
  await pool.query(`
    CREATE TRIGGER vsn_test_reject_bootstrap_audit
    BEFORE INSERT ON audit_events
    FOR EACH ROW WHEN (NEW.action_key = 'platform.bootstrap.completed')
    EXECUTE FUNCTION public.vsn_test_reject_bootstrap_audit();
  `);
  failureTriggerInstalled = true;
  const dbFailure = await request();
  assert.equal(dbFailure.status, 503);
  assert.equal((await dbFailure.json()).error.code, "BOOTSTRAP_UNAVAILABLE");
  const rolledBack = await pool.query(
    "SELECT (SELECT count(*) FROM platform_users)::int AS users, (SELECT count(*) FROM organizations)::int AS organizations, (SELECT count(*) FROM platform_bootstrap_claims)::int AS claims, (SELECT count(*) FROM audit_events)::int AS audits",
  );
  assert.deepEqual(rolledBack.rows[0], { users: 0, organizations: 0, claims: 0, audits: 0 });
  await pool.query("DROP TRIGGER vsn_test_reject_bootstrap_audit ON audit_events");
  await pool.query("DROP FUNCTION public.vsn_test_reject_bootstrap_audit()");
  failureTriggerInstalled = false;

  const raced = await Promise.all([request(), request()]);
  const statuses = raced.map(response => response.status).sort();
  assert.deepEqual(statuses, [201, 409]);
  const winnerResponse = raced.find(response => response.status === 201);
  const winnerBody = await winnerResponse.json();
  userId = winnerBody.data.userId;
  organizationId = winnerBody.data.organizationId;
  assert.equal(winnerBody.data.mfaEnrollmentRequired, true);
  assert.equal(winnerResponse.headers.get("set-cookie"), null);
  assert.equal(winnerResponse.headers.get("cache-control"), "no-store");

  const owner = await pool.query(
    `SELECT u.email, m.role, m.status, c.password_verifier, b.claimed_at
       FROM platform_users u
       JOIN organization_memberships m ON m.user_id = u.id
       JOIN platform_password_credentials c ON c.user_id = u.id
       JOIN platform_bootstrap_claims b ON b.user_id = u.id
      WHERE u.id = $1 AND m.organization_id = $2`,
    [userId, organizationId],
  );
  assert.equal(owner.rows.length, 1);
  assert.equal(owner.rows[0].email, payload.email.toLowerCase());
  assert.equal(owner.rows[0].role, "owner");
  assert.equal(owner.rows[0].status, "active");
  assert.match(owner.rows[0].password_verifier, /^scrypt-v1\$32768\$8\$3\$/);
  assert.ok(owner.rows[0].claimed_at);

  const audits = await pool.query(
    "SELECT action_key, outcome, safe_attributes FROM audit_events WHERE actor_user_id = $1 AND organization_id = $2",
    [userId, organizationId],
  );
  assert.deepEqual(audits.rows, [{
    action_key: "platform.bootstrap.completed",
    outcome: "succeeded",
    safe_attributes: { bootstrapVersion: 1 },
  }]);
  const finalState = await pool.query(
    "SELECT (SELECT count(*) FROM platform_users)::int AS users, (SELECT count(*) FROM platform_bootstrap_claims)::int AS claims, (SELECT count(*) FROM auth_sessions)::int AS sessions",
  );
  assert.deepEqual(finalState.rows[0], { users: 1, claims: 1, sessions: 0 });
  assert.equal(JSON.stringify(audits.rows).includes(bootstrapToken), false);
  console.log("Bootstrap HTTP smoke passed: exact origin/token denials; invalid password rejection; audit failure rolls back all bootstrap writes; two concurrent requests yield one first admin; success audit and MFA enrollment requirement; no session/cookie; no secret persisted.");
} finally {
  child?.kill("SIGTERM");
  if (failureTriggerInstalled) {
    await pool.query("DROP TRIGGER IF EXISTS vsn_test_reject_bootstrap_audit ON audit_events");
    await pool.query("DROP FUNCTION IF EXISTS public.vsn_test_reject_bootstrap_audit()");
  }
  if (userId && organizationId) {
    await pool.query("DELETE FROM audit_events WHERE organization_id = $1", [organizationId]);
    await pool.query("DELETE FROM platform_bootstrap_claims WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM platform_password_credentials WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM organization_memberships WHERE organization_id = $1 AND user_id = $2", [organizationId, userId]);
    await pool.query("DELETE FROM platform_users WHERE id = $1", [userId]);
    await pool.query("DELETE FROM organizations WHERE id = $1", [organizationId]);
  }
  await pool.end();
}
