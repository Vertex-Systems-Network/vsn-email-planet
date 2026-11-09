import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDomains, filterMailboxes, filterProviders } from '../apps/web/data.js';
import { demoDomains, demoMailboxes, demoProviders } from '../apps/api/src/fixtures.js';
import { canReadMailboxContent, getTenantResource, listTenantResources } from '../apps/api/src/policy.js';

test('demo provider inventory is clearly synthetic and does not contain message content', () => {
  assert.equal(demoProviders.length, 3);
  for (const provider of demoProviders) {
    assert.match(provider.id, /^demo-/);
    assert.ok(provider.note.includes('Synthetic') || provider.note.includes('Synthetic host'));
    assert.ok(provider.contentAccess);
    assert.equal('messages' in provider, false);
    assert.equal('credentials' in provider, false);
  }
});

test('filterProviders matches provider, account, host, and status case-insensitively', () => {
  const tenantRows = listTenantResources({ organizationId: 'demo-org-northstar' }, demoProviders);
  assert.equal(filterProviders(tenantRows, 'GOOGLE').length, 1);
  assert.equal(filterProviders(tenantRows, 'example.test').length, 1);
  assert.equal(filterProviders(tenantRows, '', 'attention')[0].id, 'demo-cpanel-1');
  assert.equal(filterProviders(tenantRows, 'missing').length, 0);
});

test('domain and mailbox views search their own synthetic metadata', () => {
  assert.equal(filterDomains(demoDomains, 'AGENCY').length, 1);
  assert.equal(filterDomains(demoDomains, '', 'attention').length, 2);
  assert.equal(filterMailboxes(demoMailboxes, 'SUPPORT').length, 1);
  assert.equal(filterMailboxes(demoMailboxes, 'example-agency.test').length, 2);
  assert.equal(filterMailboxes(demoMailboxes, '', 'synthetic').length, 2);
});

test('domain fixture never asserts verified public DNS state', () => {
  assert.equal(demoDomains.length, 3);
  assert.ok(demoDomains.every(domain => domain.dnsStatus === 'Unverified'));
  assert.ok(demoDomains.every(domain => domain.domain.endsWith('.example') || domain.domain.endsWith('.test') || domain.domain.endsWith('.invalid')));
  for (const mailbox of demoMailboxes) {
    assert.ok(mailbox.id.startsWith('mailbox-'));
    assert.equal('messages' in mailbox, false);
    assert.equal('credentials' in mailbox, false);
  }
});

test('development server serves app assets and refuses paths outside web root', async t => {
  const { spawn } = await import('node:child_process');
  const server = spawn(process.execPath, ['scripts/dev-server.mjs'], { env: { ...process.env, APP_PORT: '4188' }, stdio: 'ignore' });
  t.after(() => server.kill());
  const base = 'http://127.0.0.1:4188';
  let ready = false;
  for (let i = 0; i < 30 && !ready; i++) {
    try { ready = (await fetch(base)).status === 200; } catch { await new Promise(resolve => setTimeout(resolve, 50)); }
  }
  assert.equal(ready, true);
  const home = await fetch(base);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.match(await home.text(), /Synthetic prototype/);
  const js = await fetch(`${base}/app.js`);
  assert.equal(js.status, 200);
  const traversal = await fetch(`${base}/%2e%2e%2fREADME.md`);
  assert.equal(traversal.status, 404);
  const health = await fetch(`${base}/api/health`);
  assert.equal((await health.json()).environment, 'LOCAL_SYNTHETIC');
  const denied = await fetch(`${base}/api/providers`);
  assert.equal(denied.status, 401);
  const own = await fetch(`${base}/api/providers`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  const ownPayload = await own.json();
  assert.equal(ownPayload.data.length, 2);
  assert.equal(ownPayload.data.some(row => row.id === 'demo-graph-1'), false);
  assert.equal(ownPayload.meta.organizationId, 'demo-org-northstar');
  assert.equal(own.headers.get('cache-control'), 'no-store');
  assert.equal(own.headers.get('x-frame-options'), 'DENY');
  const ownDomainsResponse = await fetch(`${base}/api/domains`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  const ownDomains = await ownDomainsResponse.json();
  assert.equal(ownDomains.data.length, 2);
  assert.equal(ownDomains.data.some(row => row.domain.endsWith('.invalid')), false);
  assert.equal(ownDomains.data.some(row => 'organizationId' in row), false);
  assert.equal(ownDomains.meta.environment, 'LOCAL_SYNTHETIC');
  const ownDomainDetail = await fetch(`${base}/api/domains/domain-northstar-example`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  const ownDomainDetailPayload = await ownDomainDetail.json();
  assert.equal(ownDomainDetail.status, 200);
  assert.equal(ownDomainDetailPayload.data.domain, 'northstar.example');
  assert.equal('organizationId' in ownDomainDetailPayload.data, false);
  const hiddenDomainDetail = await fetch(`${base}/api/domains/domain-fieldnotes-invalid`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  assert.equal(hiddenDomainDetail.status, 404);
  const ownMailboxesResponse = await fetch(`${base}/api/mailboxes`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  const ownMailboxes = await ownMailboxesResponse.json();
  assert.equal(ownMailboxes.data.length, 5);
  assert.equal(ownMailboxes.data.some(row => 'messages' in row || 'credentials' in row), false);
  const ownMailboxDetail = await fetch(`${base}/api/mailboxes/mailbox-ops-northstar`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  const ownMailboxDetailPayload = await ownMailboxDetail.json();
  assert.equal(ownMailboxDetail.status, 200);
  assert.equal(ownMailboxDetailPayload.data.email, 'ops@northstar.example');
  assert.equal('organizationId' in ownMailboxDetailPayload.data, false);
  const hiddenMailboxDetail = await fetch(`${base}/api/mailboxes/mailbox-info-fieldnotes`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  assert.equal(hiddenMailboxDetail.status, 404);
  const otherDomains = await fetch(`${base}/api/domains`, { headers: { authorization: 'Bearer fixture-local-fieldnotes' } });
  assert.equal((await otherDomains.json()).data.length, 1);
  const mailboxMutation = await fetch(`${base}/api/mailboxes`, { method: 'POST', headers: { authorization: 'Bearer fixture-local-northstar' } });
  assert.equal(mailboxMutation.status, 405);
  const domainMutation = await fetch(`${base}/api/domains/domain-northstar-example`, { method: 'DELETE', headers: { authorization: 'Bearer fixture-local-northstar' } });
  assert.equal(domainMutation.status, 405);
  const hidden = await fetch(`${base}/api/providers/demo-graph-1`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  assert.equal(hidden.status, 404);
  const capabilityResponse = await fetch(`${base}/api/providers/demo-cpanel-1/capabilities`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  const capabilityPayload = await capabilityResponse.json();
  assert.equal(capabilityResponse.status, 200);
  assert.equal(capabilityPayload.data.environment, 'LOCAL_SYNTHETIC');
  assert.ok(capabilityPayload.data.capabilities.some(item => item.state === 'NEEDS_CONSENT' && item.operation === 'fetch_message'));
  assert.ok(capabilityPayload.data.capabilities.some(item => item.state === 'PROVIDER_DISABLED'));
  assert.ok(capabilityPayload.data.capabilities.every(item => item.reason && item.source && item.checked_at && item.required_action));
  const hiddenCapabilities = await fetch(`${base}/api/providers/demo-graph-1/capabilities`, { headers: { authorization: 'Bearer fixture-local-northstar' } });
  assert.equal(hiddenCapabilities.status, 404);
  const capabilityMutation = await fetch(`${base}/api/providers/demo-cpanel-1/capabilities`, { method: 'POST', headers: { authorization: 'Bearer fixture-local-northstar' } });
  assert.equal(capabilityMutation.status, 405);
  const mutation = await fetch(`${base}/api/providers`, { method: 'DELETE', headers: { authorization: 'Bearer fixture-local-northstar' } });
  assert.equal(mutation.status, 405);
});

test('tenant policy hides other organization resources and requires separate content grant', () => {
  const actor = { organizationId: 'demo-org-northstar', role: 'operator' };
  assert.equal(listTenantResources(actor, demoProviders).length, 2);
  assert.equal(getTenantResource(actor, 'demo-graph-1', demoProviders), null);
  assert.equal(canReadMailboxContent(actor, { organizationId: 'demo-org-northstar', contentRead: true, consentStatus: 'granted' }), true);
  assert.equal(canReadMailboxContent(actor, { organizationId: 'demo-org-northstar', contentRead: true, consentStatus: 'missing' }), false);
  assert.equal(canReadMailboxContent(actor, { organizationId: 'demo-org-fieldnotes', contentRead: true, consentStatus: 'granted' }), false);
});
