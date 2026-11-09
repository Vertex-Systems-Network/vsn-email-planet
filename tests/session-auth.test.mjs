import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSessionSecret,
  digestSessionSecret,
  matchesSessionDigest,
  resolveSessionActor,
} from '../apps/api/src/session-auth.js';

const key = Buffer.alloc(32, 7);
const now = new Date('2026-11-09T22:00:00Z');
const sessionSecret = createSessionSecret();
const session = {
  id: 'session-1',
  userId: 'user-a',
  organizationId: 'org-a',
  membershipVersion: 3,
  revokedAt: null,
  expiresAt: '2026-11-10T22:00:00Z',
  idleExpiresAt: '2026-11-09T23:00:00Z',
};
const user = { id: 'user-a', status: 'active' };
const membership = { organizationId: 'org-a', role: 'operator', status: 'active', version: 3 };
function repository(overrides = {}) {
  const calls = [];
  return {
    calls,
    findSessionByDigest: async digest => { calls.push(['session', digest]); return Object.hasOwn(overrides, 'session') ? overrides.session : session; },
    findUserById: async id => { calls.push(['user', id]); return overrides.user ?? user; },
    findMembership: async (userId, orgId) => { calls.push(['membership', userId, orgId]); return overrides.membership ?? membership; },
  };
}

test('creates a high-entropy opaque secret and stores/compares only a keyed digest', () => {
  const first = createSessionSecret();
  const second = createSessionSecret();
  assert.match(first, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(first, second);
  const digest = digestSessionSecret(first, key);
  assert.equal(digest.length, 32);
  assert.equal(matchesSessionDigest(first, key, digest), true);
  assert.equal(matchesSessionDigest(second, key, digest), false);
  assert.equal(digestSessionSecret('short', key), null);
  assert.throws(() => digestSessionSecret(first, Buffer.alloc(16)), /at least 32 bytes/);
});

test('derives actor organization and role from current server-side records', async () => {
  const repo = repository();
  const result = await resolveSessionActor({ sessionSecret, digestKey: key, repository: repo, now });
  assert.deepEqual(result, {
    ok: true,
    actor: { userId: 'user-a', sessionId: 'session-1', organizationId: 'org-a', membershipRole: 'operator', membershipVersion: 3 },
  });
  assert.equal(Object.isFrozen(result.actor), true);
  assert.deepEqual(repo.calls.map(call => call[0]), ['session', 'user', 'membership']);
});

test('ignores forged request organization and role fields', async () => {
  const result = await resolveSessionActor({
    sessionSecret, digestKey: key, repository: repository(), now,
    organizationId: 'org-victim', role: 'owner', userId: 'attacker',
  });
  assert.equal(result.ok, true);
  assert.equal(result.actor.organizationId, 'org-a');
  assert.equal(result.actor.membershipRole, 'operator');
  assert.equal(result.actor.userId, 'user-a');
});

test('rejects missing, malformed, revoked, absolute-expired and idle-expired sessions before identity lookup', async () => {
  for (const change of [
    { sessionSecret: 'invalid' },
    { session: null },
    { session: { ...session, revokedAt: now } },
    { session: { ...session, expiresAt: now } },
    { session: { ...session, idleExpiresAt: now } },
  ]) {
    const repo = repository(change);
    const result = await resolveSessionActor({ sessionSecret: change.sessionSecret ?? sessionSecret, digestKey: key, repository: repo, now });
    assert.equal(result.ok, false);
    assert.equal(repo.calls.some(call => call[0] === 'user'), false);
  }
});

test('rejects disabled users, inactive memberships, invalid roles and stale membership versions', async () => {
  for (const overrides of [
    { user: { ...user, status: 'disabled' } },
    { membership: { ...membership, status: 'suspended' } },
    { membership: { ...membership, role: 'superuser' } },
    { membership: { ...membership, version: 4 } },
    { membership: { ...membership, organizationId: 'org-victim' } },
    { user: { ...user, id: 'user-victim' } },
  ]) {
    const result = await resolveSessionActor({ sessionSecret, digestKey: key, repository: repository(overrides), now });
    assert.equal(result.ok, false);
  }
});
