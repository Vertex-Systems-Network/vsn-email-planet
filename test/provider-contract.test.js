import test from 'node:test';
import assert from 'node:assert/strict';
import { invokeProviderOperation, ProviderOperationError } from '../apps/api/src/capabilities.js';

const timestamp = '2026-11-09T19:00:00.000Z';
function capability(state, operation = 'list_mailboxes') {
  return {
    provider: 'fixture-cpanel',
    environment: 'LOCAL_SYNTHETIC',
    capabilities: [{ operation, resource_type: 'domain', state, reason: `Synthetic ${state.toLowerCase()} fixture.`, source: 'local adapter fixture', checked_at: timestamp, required_action: state === 'NEEDS_ADMIN' ? 'Ask a hosting administrator to grant the required API role.' : 'No action required.' }]
  };
}

test('connector execution returns provenance for allowed fixture operations', async () => {
  let received;
  const result = await invokeProviderOperation({
    connector: { name: 'fixture-cpanel', operations: { list_mailboxes: async value => { received = value; return [{ id: 'synthetic-mailbox-1' }]; } } },
    manifest: capability('READ_ONLY'), operation: 'list_mailboxes', resourceType: 'domain',
    context: { organizationId: 'demo-org-northstar' }, input: { domainId: 'synthetic-domain-1' }
  });
  assert.deepEqual(result.data, [{ id: 'synthetic-mailbox-1' }]);
  assert.deepEqual(received, { context: { organizationId: 'demo-org-northstar' }, input: { domainId: 'synthetic-domain-1' } });
  assert.deepEqual(result.meta, {
    provider: 'fixture-cpanel', environment: 'LOCAL_SYNTHETIC', operation: 'list_mailboxes',
    capability: { state: 'READ_ONLY', source: 'local adapter fixture', checked_at: timestamp }
  });
});

test('permission and provider-disabled outcomes prevent handler dispatch', async () => {
  for (const state of ['NEEDS_ADMIN', 'PROVIDER_DISABLED', 'RATE_LIMITED', 'UNSUPPORTED']) {
    let called = false;
    await assert.rejects(invokeProviderOperation({ connector: { operations: { list_mailboxes: async () => { called = true; return []; } } }, manifest: capability(state), operation: 'list_mailboxes', resourceType: 'domain' }), error => error instanceof ProviderOperationError && error.code === state);
    assert.equal(called, false, `${state} must not dispatch provider work`);
  }
});

test('declared support without a handler fails as broken instead of mock-success', async () => {
  await assert.rejects(invokeProviderOperation({ connector: { operations: {} }, manifest: capability('SUPPORTED'), operation: 'list_mailboxes', resourceType: 'domain' }), error => error instanceof ProviderOperationError && error.code === 'BROKEN' && error.message.includes('no operation handler'));
});

test('unclassified adapter exceptions are sanitized and classified as broken', async () => {
  await assert.rejects(invokeProviderOperation({ connector: { operations: { list_mailboxes: async () => { throw new Error('secret token value'); } } }, manifest: capability('SUPPORTED'), operation: 'list_mailboxes', resourceType: 'domain' }), error => error instanceof ProviderOperationError && error.code === 'BROKEN' && !error.message.includes('secret token value'));
});

test('typed transient adapter outcomes preserve their state', async () => {
  const throttled = new ProviderOperationError({ code: 'RATE_LIMITED', operation: 'list_mailboxes', message: 'Provider throttle fixture.', requiredAction: 'Retry after the provided delay.' });
  await assert.rejects(invokeProviderOperation({ connector: { operations: { list_mailboxes: async () => { throw throttled; } } }, manifest: capability('SUPPORTED'), operation: 'list_mailboxes', resourceType: 'domain' }), error => error === throttled);
});
