export const demoProviders = Object.freeze([
  { id: 'demo-google-1', name: 'Google Workspace', account: 'northstar.example', host: 'workspace.google.com', scope: 'Directory metadata', contentAccess: 'Not granted', status: 'connected', checked: 'Example fixture', icon: 'G', iconClass: 'google', note: 'Synthetic organization; no OAuth connection exists.' },
  { id: 'demo-cpanel-1', name: 'cPanel UAPI', account: 'mail.example-agency.test', host: 'cpanel.example.test', scope: 'Account inventory', contentAccess: 'Separate authorization required', status: 'attention', checked: 'Example fixture', icon: 'cP', iconClass: 'panel', note: 'Synthetic host; panel access does not imply message access.' }
]);
export const demoDomains = Object.freeze([
  { domain: 'northstar.example', provider: 'Google Workspace fixture', state: 'Synthetic' },
  { domain: 'example-agency.test', provider: 'cPanel fixture', state: 'Synthetic' },
  { domain: 'fieldnotes.invalid', provider: 'No connection', state: 'Unverified' }
]);
export function filterProviders(records, query = '', status = 'all') {
  const q = query.trim().toLowerCase();
  return records.filter(row => (!q || [row.name,row.account,row.host,row.status,row.scope].some(v => v.toLowerCase().includes(q))) && (status === 'all' || row.status === status));
}
