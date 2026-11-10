import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPasswordVerifier, isPasswordAllowed, verifyPassword } from '../apps/api/src/password-auth.js';

test('password policy preserves exact input while enforcing length, blocklist and account context', () => {
  assert.equal(isPasswordAllowed('correct horse battery staple'), true);
  assert.equal(isPasswordAllowed('é'.repeat(15)), true);
  assert.equal(isPasswordAllowed('short'), false);
  assert.equal(isPasswordAllowed('123456789012345'), false);
  assert.equal(isPasswordAllowed('my-secure-admin-passphrase', { email: 'my-secure-admin-passphrase@example.test' }), false);
  assert.equal(isPasswordAllowed('a'.repeat(1025)), false);
  assert.equal(isPasswordAllowed(null), false);
});

test('scrypt verifier encodes a random salt and accepts only the exact supported profile', async () => {
  const first = await createPasswordVerifier('correct horse battery staple');
  const second = await createPasswordVerifier('correct horse battery staple');
  assert.match(first, /^scrypt-v1\$32768\$8\$3\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{43}$/);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword('correct horse battery staple', first), true);
  assert.equal(await verifyPassword('a different long passphrase', first), false);
  assert.equal(await verifyPassword('correct horse battery staple', first.replace('32768', '16384')), false);
  assert.equal(await verifyPassword('correct horse battery staple', 'plaintext'), false);
});
