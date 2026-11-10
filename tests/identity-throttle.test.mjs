import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { migrateDatabase } from '../apps/api/db/migrate.mjs';
import { clearIdentityAttempts, consumeIdentityAttempt, decodeIdentityThrottleKey } from '../apps/api/src/identity-throttle.js';

const key = randomBytes(32).toString('base64url');
const priorKey = randomBytes(32).toString('base64url');
function poolFor(db) { return { async connect() { return { query: db.query.bind(db), release() {} }; } }; }

test('identity throttle applies account and network budgets without storing identifiers', async () => {
  const db = new PGlite();
  try {
    await migrateDatabase(db, { executeSql: sql => db.exec(sql) });
    const pool = poolFor(db);
    const input = { purpose: 'login', accountIdentifier: ' Admin@Example.Test ', clientNetwork: '192.0.2.10/32', key, now: new Date('2026-11-10T23:00:00Z') };
    for (let i = 0; i < 10; i++) assert.equal((await consumeIdentityAttempt(pool, input)).allowed, true);
    const blocked = await consumeIdentityAttempt(pool, input);
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterSeconds > 0);
    const rows = await db.query('SELECT key_digest FROM platform_identity_attempt_throttles');
    assert.equal(rows.rows.length, 2);
    assert.ok(rows.rows.every(row => /^[a-f0-9]{64}$/.test(row.key_digest)));
    assert.equal(JSON.stringify(rows.rows).includes('admin@example.test'), false);
    await clearIdentityAttempts(pool, input);
    assert.equal((await db.query('SELECT count(*)::int AS count FROM platform_identity_attempt_throttles')).rows[0].count, 0);
  } finally { await db.close(); }
});

test('identity throttle reads and writes current and prior HMAC keys during rotation', async () => {
  const db = new PGlite();
  try {
    await migrateDatabase(db, { executeSql: sql => db.exec(sql) });
    const pool = poolFor(db);
    const input = { purpose: 'mfa', accountIdentifier: 'user-42', clientNetwork: '2001:db8::1/64', key, now: new Date('2026-11-10T23:00:00Z') };
    for (let i = 0; i < 5; i++) assert.equal((await consumeIdentityAttempt(pool, input)).allowed, true);
    const rotated = { ...input, key: randomBytes(32).toString('base64url'), previousKeys: [key] };
    assert.equal((await consumeIdentityAttempt(pool, rotated)).allowed, false);
    const rows = await db.query('SELECT DISTINCT key_digest FROM platform_identity_attempt_throttles');
    assert.equal(rows.rows.length, 4);
    await assert.rejects(consumeIdentityAttempt(pool, { ...input, previousKeys: [priorKey, key] }), /At most one distinct previous/);
  } finally { await db.close(); }
});

test('identity throttle validates secret and trust-boundary input', async () => {
  assert.throws(() => decodeIdentityThrottleKey('A'.repeat(42) + 'B'), /canonical/);
  assert.throws(() => decodeIdentityThrottleKey('short'), /canonical/);
  const pool = { async connect() { throw new Error('must not connect'); } };
  await assert.rejects(consumeIdentityAttempt(pool, { purpose: 'login', accountIdentifier: 'a@b.test', clientNetwork: 'bad\nheader', key }), /trusted client network/);
});

test('identity throttle fails closed when PostgreSQL is unavailable', async () => {
  const pool = { async connect() { throw new Error('database unavailable'); } };
  await assert.rejects(consumeIdentityAttempt(pool, { purpose: 'login', accountIdentifier: 'a@b.test', clientNetwork: '192.0.2.1/32', key }), /database unavailable/);
});
