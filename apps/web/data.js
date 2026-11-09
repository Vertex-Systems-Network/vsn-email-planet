export const DEMO_TOKEN = 'fixture-local-northstar';
function filterRows(records, query, status, fields) {
  const q = query.trim().toLowerCase();
  return records.filter(row => (!q || fields.map(field => row[field]).filter(value => typeof value === 'string').some(value => value.toLowerCase().includes(q))) && (status === 'all' || row.status === status));
}
export function filterProviders(records, query = '', status = 'all') { return filterRows(records, query, status, ['name','account','host','status','scope']); }
export function filterDomains(records, query = '', status = 'all') { return filterRows(records, query, status, ['domain','provider','dnsStatus','status']); }
export function filterMailboxes(records, query = '', status = 'all') { return filterRows(records, query, status, ['email','domain','provider','contentAccess','status']); }
