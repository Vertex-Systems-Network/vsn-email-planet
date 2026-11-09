import test from 'node:test';
import assert from 'node:assert/strict';
import { demoProviders, demoDomains, filterProviders } from '../apps/web/data.js';

test('demo provider inventory is clearly synthetic and does not contain message content', () => {
  assert.equal(demoProviders.length, 2);
  for (const provider of demoProviders) {
    assert.match(provider.id, /^demo-/);
    assert.ok(provider.note.includes('Synthetic') || provider.note.includes('Synthetic host'));
    assert.ok(provider.contentAccess);
    assert.equal('messages' in provider, false);
    assert.equal('credentials' in provider, false);
  }
});

test('filterProviders matches provider, account, host, and status case-insensitively', () => {
  assert.equal(filterProviders(demoProviders, 'GOOGLE').length, 1);
  assert.equal(filterProviders(demoProviders, 'example.test').length, 1);
  assert.equal(filterProviders(demoProviders, '', 'attention')[0].id, 'demo-cpanel-1');
  assert.equal(filterProviders(demoProviders, 'missing').length, 0);
});

test('domain fixture never asserts verified public DNS state', () => {
  assert.equal(demoDomains.length, 3);
  assert.ok(demoDomains.some(domain => domain.state === 'Unverified'));
  assert.ok(demoDomains.every(domain => domain.domain.endsWith('.example') || domain.domain.endsWith('.test') || domain.domain.endsWith('.invalid')));
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
});
