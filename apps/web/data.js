export const DEMO_TOKEN = 'fixture-local-northstar';
export const demoDomains = Object.freeze([
  { domain: 'northstar.example', provider: 'Google Workspace fixture', state: 'Synthetic' },
  { domain: 'example-agency.test', provider: 'cPanel fixture', state: 'Synthetic' },
  { domain: 'fieldnotes.invalid', provider: 'No connection', state: 'Unverified' }
]);
export function filterProviders(records, query = '', status = 'all') {
  const q = query.trim().toLowerCase();
  return records.filter(row => (!q || [row.name,row.account,row.host,row.status,row.scope].some(v => v.toLowerCase().includes(q))) && (status === 'all' || row.status === status));
}
