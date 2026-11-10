import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { migrateDatabase } from '../apps/api/db/migrate.mjs';
import { createPasswordVerifier } from '../apps/api/src/password-auth.js';
import { verifyLocalCredential } from '../apps/api/src/password-repository.js';

test('credential lookup returns only the authenticated user and current active memberships', async () => {
  const db = new PGlite();
  try {
    await migrateDatabase(db, { executeSql: sql => db.exec(sql) });
    const orgA = '00000000-0000-4000-8000-000000000031';
    const orgB = '00000000-0000-4000-8000-000000000032';
    const activeUser = '20000000-0000-4000-8000-000000000031';
    const disabledUser = '20000000-0000-4000-8000-000000000032';
    const verifier = await createPasswordVerifier('correct horse battery staple');
    await db.query(
      "INSERT INTO organizations (id, slug, display_name) VALUES ($1, 'credential-a', 'Credential A'), ($2, 'credential-b', 'Credential B')",
      [orgA, orgB],
    );
    await db.query(
      "INSERT INTO platform_users (id, email, status) VALUES ($1, 'credential-user@example.test', 'active'), ($2, 'disabled-user@example.test', 'disabled')",
      [activeUser, disabledUser],
    );
    await db.query(
      "INSERT INTO organization_memberships (organization_id, user_id, role, status) VALUES ($1, $3, 'operator', 'active'), ($2, $3, 'viewer', 'suspended'), ($1, $4, 'admin', 'active')",
      [orgA, orgB, activeUser, disabledUser],
    );
    await db.query(
      "INSERT INTO platform_password_credentials (user_id, password_verifier) VALUES ($1, $3), ($2, $3)",
      [activeUser, disabledUser, verifier],
    );

    const valid = await verifyLocalCredential(db, 'CREDENTIAL-USER@example.test ', 'correct horse battery staple');
    assert.equal(valid.userId, activeUser);
    assert.deepEqual(valid.memberships, [{ organizationId: orgA, role: 'operator', membershipVersion: 1 }]);
    assert.equal(Object.isFrozen(valid), true);
    assert.equal(Object.isFrozen(valid.memberships), true);

    assert.equal(await verifyLocalCredential(db, 'credential-user@example.test', 'wrong long password phrase'), null);
    assert.equal(await verifyLocalCredential(db, 'unknown@example.test', 'wrong long password phrase'), null);
    assert.equal(await verifyLocalCredential(db, 'disabled-user@example.test', 'correct horse battery staple'), null);
    assert.equal(await verifyLocalCredential(db, 'credential-user@example.test', 'wrong'), null);
  } finally {
    await db.close();
  }
});
