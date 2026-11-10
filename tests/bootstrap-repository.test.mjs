import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { migrateDatabase } from '../apps/api/db/migrate.mjs';
import { createPasswordVerifier } from '../apps/api/src/password-auth.js';
import { bootstrapFirstAdmin } from '../apps/api/src/bootstrap-repository.js';

function poolFor(db) {
  return {
    async connect() {
      return { query: db.query.bind(db), release() {} };
    },
  };
}

test('first-admin bootstrap commits owner, credential and audit once and rejects replay', async () => {
  const db = new PGlite();
  try {
    await migrateDatabase(db, { executeSql: sql => db.exec(sql) });
    const verifier = await createPasswordVerifier('a unique secure password phrase 2026');
    const input = {
      email: '  FIRST.ADMIN@example.test ',
      displayName: 'First Admin',
      organizationSlug: 'first-org',
      organizationDisplayName: 'First Organization',
      passwordVerifier: verifier,
    };

    const created = await bootstrapFirstAdmin(poolFor(db), input);
    assert.ok(created?.userId);
    assert.ok(created?.organizationId);
    assert.equal(await bootstrapFirstAdmin(poolFor(db), input), null);

    const user = await db.query(
      "SELECT email, display_name FROM platform_users WHERE id = $1",
      [created.userId],
    );
    assert.deepEqual(user.rows, [{ email: 'first.admin@example.test', display_name: 'First Admin' }]);
    const membership = await db.query(
      "SELECT role, status FROM organization_memberships WHERE user_id = $1 AND organization_id = $2",
      [created.userId, created.organizationId],
    );
    assert.deepEqual(membership.rows, [{ role: 'owner', status: 'active' }]);
    const credential = await db.query(
      'SELECT password_verifier FROM platform_password_credentials WHERE user_id = $1',
      [created.userId],
    );
    assert.equal(credential.rows[0].password_verifier, verifier);
    const audit = await db.query(
      "SELECT action_key, outcome, safe_attributes FROM audit_events WHERE actor_user_id = $1",
      [created.userId],
    );
    assert.equal(audit.rows.length, 1);
    assert.equal(audit.rows[0].action_key, 'platform.bootstrap.completed');
    assert.equal(audit.rows[0].outcome, 'succeeded');
    assert.deepEqual(audit.rows[0].safe_attributes, { bootstrapVersion: 1 });
    const claim = await db.query('SELECT * FROM platform_bootstrap_claims');
    assert.equal(claim.rows.length, 1);
    assert.equal(JSON.stringify(claim.rows[0]).includes('password'), false);
  } finally {
    await db.close();
  }
});

test('bootstrap rejects malformed identity input before acquiring a database connection', async () => {
  let connections = 0;
  const pool = { async connect() { connections += 1; throw new Error('should not connect'); } };
  await assert.rejects(
    bootstrapFirstAdmin(pool, {
      email: 'admin@example.test',
      displayName: 'Admin',
      organizationSlug: 'Bad Slug',
      organizationDisplayName: 'Organization',
      passwordVerifier: 'not-a-verifier',
    }),
    /Invalid first-admin bootstrap input/,
  );
  assert.equal(connections, 0);
});
