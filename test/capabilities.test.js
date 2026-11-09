import test from 'node:test';
import assert from 'node:assert/strict';
import { assertCapabilityAllows, capabilityDecision, validateCapabilityManifest } from '../apps/api/src/capabilities.js';

const checkedAt = '2026-11-09T19:00:00.000Z';
const manifest = {
  provider: 'fixture-cpanel',
  environment: 'LOCAL_SYNTHETIC',
  capabilities: [
    { operation: 'list_mailboxes', resource_type: 'domain', state: 'READ_ONLY', reason: 'Synthetic fixture allows metadata listing.', source: 'local fixture', checked_at: checkedAt, required_action: 'No action required.', mutability: 'read_only' },
    { operation: 'fetch_message', resource_type: 'mailbox', state: 'NEEDS_CONSENT', reason: 'Mailbox content has not been separately authorized.', source: 'local fixture', checked_at: checkedAt, required_action: 'Obtain explicit mailbox-content consent.' },
    { operation: 'provision_mailbox', resource_type: 'domain', state: 'UNSUPPORTED', reason: 'This connector fixture does not implement provisioning.', source: 'local fixture', checked_at: checkedAt, required_action: 'Choose a supported provider operation.' }
  ]
};

test('valid manifest preserves operation-level source, timestamp and next action', () => {
  assert.deepEqual(validateCapabilityManifest(manifest), []);
  assert.deepEqual(capabilityDecision(manifest, 'list_mailboxes', 'domain'), {
    allowed: true,
    state: 'READ_ONLY',
    reasons: ['Synthetic fixture allows metadata listing.'],
    required_action: 'No action required.',
    source: 'local fixture',
    checked_at: checkedAt
  });
});

test('consent, unsupported and undeclared operations cannot be executed', () => {
  for (const [operation, resource] of [['fetch_message', 'mailbox'], ['provision_mailbox', 'domain'], ['send_message', 'mailbox']]) {
    const decision = capabilityDecision(manifest, operation, resource);
    assert.equal(decision.allowed, false);
    assert.throws(() => assertCapabilityAllows(manifest, operation, resource), error => error.code === decision.state);
  }
});

test('invalid and duplicate records fail closed', () => {
  const bad = { capabilities: [
    { operation: 'send_message', state: 'SUPPORTED', reason: 'fixture', source: 'fixture', checked_at: 'not-a-date', required_action: '' },
    { operation: 'send_message', state: 'SUPPORTED', reason: 'fixture', source: 'fixture', checked_at: checkedAt, required_action: 'none' }
  ] };
  assert.ok(validateCapabilityManifest(bad).some(error => error.includes('checked_at')));
  assert.ok(validateCapabilityManifest(bad).some(error => error.includes('duplicates')));
  assert.equal(capabilityDecision(bad, 'send_message').allowed, false);
});

test('write operations cannot be represented as read-only support', () => {
  const inconsistent = { capabilities: [{ operation: 'send_message', state: 'SUPPORTED', reason: 'fixture', source: 'fixture', checked_at: checkedAt, required_action: 'none', mutability: 'read_only' }] };
  assert.ok(validateCapabilityManifest(inconsistent).some(error => error.includes('must use READ_ONLY')));
});
