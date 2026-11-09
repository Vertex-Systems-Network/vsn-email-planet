import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(new URL('..', import.meta.url).pathname);
const data = JSON.parse(await readFile(resolve(root, 'knowledge/banks.json'), 'utf8'));

test('knowledge bank catalog has 20 traceable, non-empty areas', async () => {
  assert.equal(data.banks.length, 20);
  assert.equal(new Set(data.banks.map(bank => bank.id)).size, data.banks.length);
  for (const bank of data.banks) {
    for (const key of ['id','topic','description','current_state','applicability','source','alternatives','tradeoffs','priority','dependencies','last_reviewed','decision_status','docs','tests']) assert.ok(key in bank, `${bank.id} lacks ${key}`);
    assert.ok(bank.current_state.length > 20, `${bank.id} needs a real state description`);
    for (const path of [...bank.docs,...bank.tests]) await access(resolve(root, path));
  }
});

test('operational flow diagrams exist and mark high-risk consent boundaries', async () => {
  const connection = await readFile(resolve(root, 'docs/diagrams/connection-flow.mmd'), 'utf8');
  const send = await readFile(resolve(root, 'docs/diagrams/safe-send-flow.mmd'), 'utf8');
  const migration = await readFile(resolve(root, 'docs/diagrams/migration-flow.mmd'), 'utf8');
  assert.match(connection, /Content separately authorized/);
  assert.match(send, /UNKNOWN/);
  assert.match(migration, /Cutover authorized/);
});
