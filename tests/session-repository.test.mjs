import assert from "node:assert/strict";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { migrateDatabase } from "../apps/api/db/migrate.mjs";
import { createSessionRepository } from "../apps/api/src/session-repository.ts";
import {
  createSessionSecret,
  digestSessionSecret,
  digestCsrfToken,
  resolveSessionActor,
} from "../apps/api/src/session-auth.js";

test("PostgreSQL session repository derives tenant actor and rejects changed membership version", async () => {
  const db = new PGlite();
  const key = Buffer.alloc(32, 29);
  const secret = createSessionSecret();
  const digest = digestSessionSecret(secret, key);
  const csrfToken = createSessionSecret();
  const csrfDigest = digestCsrfToken(csrfToken, key);
  const now = new Date("2026-11-11T00:00:00Z");
  try {
    await migrateDatabase(db, { executeSql: sql => db.exec(sql) });
    const organizationA = "00000000-0000-4000-8000-000000000021";
    const organizationB = "00000000-0000-4000-8000-000000000022";
    const userId = "20000000-0000-4000-8000-000000000021";
    await db.query(
      "INSERT INTO organizations (id, slug, display_name) VALUES ($1, 'session-a', 'Session A'), ($2, 'session-b', 'Session B')",
      [organizationA, organizationB],
    );
    await db.query("INSERT INTO platform_users (id, email) VALUES ($1, 'session-user@example.test')", [userId]);
    await db.query(
      "INSERT INTO organization_memberships (organization_id, user_id, role) VALUES ($1, $3, 'operator'), ($2, $3, 'viewer')",
      [organizationA, organizationB, userId],
    );
    await db.query(
      `INSERT INTO auth_sessions
        (user_id, organization_id, secret_digest, csrf_digest, membership_version, created_at, expires_at, idle_expires_at)
       VALUES ($1, $2, $3, $4, 1, $5, $6, $7)`,
      [userId, organizationA, digest, csrfDigest, now, "2026-11-12T00:00:00Z", "2026-11-11T12:00:00Z"],
    );

    const sessionId = (await db.query("SELECT id::text AS id FROM auth_sessions WHERE user_id = $1", [userId])).rows[0].id;
    const repository = createSessionRepository(db);
    const storedCsrfDigest = await repository.findCsrfDigestForSession(sessionId, userId, organizationA);
    assert.deepEqual(Buffer.from(storedCsrfDigest), csrfDigest);
    const result = await resolveSessionActor({ sessionSecret: secret, digestKey: key, repository, now });
    assert.equal(result.ok, true);
    assert.equal(result.actor.userId, userId);
    assert.equal(result.actor.organizationId, organizationA);
    assert.equal(result.actor.membershipRole, "operator");
    assert.equal(Object.isFrozen(result.actor), true);

    const stored = await db.query("SELECT secret_digest, csrf_digest, membership_version WHERE organization_id = $1", [organizationA]);
    assert.deepEqual(Buffer.from(stored.rows[0].secret_digest), digest);
    assert.deepEqual(Buffer.from(stored.rows[0].csrf_digest), csrfDigest);
    assert.notDeepEqual(stored.rows[0].secret_digest, Buffer.from(secret));
    await db.query("UPDATE organization_memberships SET role = 'admin' WHERE organization_id = $1 AND user_id = $2", [organizationA, userId]);
    const changedMembership = await db.query("SELECT version FROM organization_memberships WHERE organization_id = $1 AND user_id = $2", [organizationA, userId]);
    assert.equal(changedMembership.rows[0].version, 2);

    const stale = await resolveSessionActor({ sessionSecret: secret, digestKey: key, repository, now });
    assert.deepEqual(stale, { ok: false, reason: "membership_changed" });
  } finally {
    await db.close();
  }
});
