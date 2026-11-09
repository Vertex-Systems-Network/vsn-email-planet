import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(new URL('..', import.meta.url).pathname);
const inventory = JSON.parse(await readFile(resolve(root, 'knowledge/screens/screen-inventory.json'), 'utf8'));

test('screen inventory covers all product areas and records explicit states', async () => {
  assert.equal(inventory.screen_count, inventory.screens.length);
  assert.ok(inventory.screens.length >= 100);
  const areas = new Set(inventory.screens.map(screen => screen.area));
  for (const area of ['global','connections','admin','inbox','infrastructure','migration','recovery','automation_ai','reports_ops','installation']) assert.ok(areas.has(area), `missing ${area}`);
  assert.equal(new Set(inventory.screens.map(screen => screen.id)).size, inventory.screens.length);
  for (const screen of inventory.screens) {
    assert.ok(screen.title && screen.roles.length && screen.devices.length);
    assert.ok(screen.required_states.includes('permission_denied'));
    assert.ok(['NOT_STARTED','PROTOTYPE_PARTIAL','IMPLEMENTED_UNVERIFIED','VERIFIED','DONE'].includes(screen.implementation_status));
    if (screen.implementation_status === 'PROTOTYPE_PARTIAL') for (const path of screen.evidence_paths) await access(resolve(root, path));
  }
});
