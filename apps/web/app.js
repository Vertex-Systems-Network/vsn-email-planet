import { DEMO_TOKEN, demoDomains, filterProviders } from './data.js';
const el = id => document.getElementById(id);
const safe = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let currentView = 'overview';
let demoProviders = [];
const viewCopy = {
  overview: ['Operations overview','A clear view of provider connections and mailbox inventory.','Provider connections'],
  providers: ['Provider connections','Inspect demo connection scope and explicit content access.','Provider connections'],
  domains: ['Domain inventory','Synthetic examples with unverified states clearly labeled.','Provider connections'],
  mailboxes: ['Mailbox inventory','Counts are synthetic fixtures; mailbox content is not available.','Provider connections']
};
function renderMetrics() {
  const metrics = [
    ['Provider connections','02','Synthetic examples only','◉'],['Domains in inventory','03','1 is unverified','◇'],['Mailbox records','06','Synthetic count · no content','▤'],['Attention items','01','Fixture status, not a live alert','!']
  ];
  el('metrics').innerHTML = metrics.map(([label,value,foot,icon]) => `<article class="metric"><div class="metric-top"><span>${safe(label)}</span><span class="metric-icon">${safe(icon)}</span></div><div class="metric-value">${safe(value)}</div><div class="metric-foot">${safe(foot)}</div></article>`).join('');
}
function renderRows() {
  const rows = filterProviders(demoProviders, el('search').value, el('statusFilter').value);
  el('providerRows').innerHTML = rows.map(p => `<tr data-id="${safe(p.id)}"><td><input type="checkbox" aria-label="Select ${safe(p.name)}"></td><td><div class="provider-cell"><div class="provider-icon ${safe(p.iconClass)}">${safe(p.icon)}</div><div><div class="provider-name">${safe(p.name)}</div><div class="provider-detail">${safe(p.account)} <span>·</span> ${safe(p.host)}</div></div></div></td><td><div class="scope"><span class="scope-dot"></span><span class="scope-pill">${safe(p.scope)}</span></div></td><td><span class="status-pill ${safe(p.status)}"><i></i>${p.status === 'connected' ? 'Fixture available' : 'Review access'}</span></td><td><span class="checked">${safe(p.checked)}</span></td><td><button class="row-more" data-detail="${safe(p.id)}" aria-label="View ${safe(p.name)} details">···</button></td></tr>`).join('');
  el('rowCount').textContent = String(rows.length);
  el('resultCount').textContent = `${rows.length} shown`;
  el('footerRange').textContent = rows.length ? `Showing ${rows.length} synthetic connection${rows.length === 1 ? '' : 's'}` : 'No results';
  el('emptyState').hidden = rows.length > 0;
  el('providerRows').hidden = rows.length === 0;
  el('selectAll').checked = false;
}
function renderDomains() {
  el('domainList').innerHTML = demoDomains.slice(0,2).map(d => `<div class="domain-row"><div class="domain-symbol">◇</div><div><div class="domain-name">${safe(d.domain)}</div><div class="domain-sub">${safe(d.provider)}</div></div><span class="domain-state"><i></i>${safe(d.state)}</span></div>`).join('');
}
function setView(view) {
  if (!viewCopy[view]) return;
  currentView = view;
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  const [title,subtitle,tableHeading] = viewCopy[view];
  el('crumb').textContent = title;
  el('title').textContent = title;
  el('subtitle').textContent = subtitle;
  el('tableHeading').textContent = tableHeading;
  renderRows();
  if (view !== 'overview') showToast(`${title}: local synthetic view`);
}
function showToast(text) {
  const toast = el('toast'); toast.textContent = text; toast.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2300);
}
const capabilityTone = state => ['SUPPORTED','READ_ONLY'].includes(state) ? 'available' : ['NEEDS_CONSENT','NEEDS_ADMIN','NEEDS_WHITELIST','NEEDS_LICENSE','RATE_LIMITED'].includes(state) ? 'gated' : 'unavailable';
function renderCapabilityRows(capabilities) {
  return capabilities.map(item => `<article class="capability-row"><div class="capability-top"><b>${safe(item.operation.replaceAll('_', ' '))}</b><span class="capability-state ${capabilityTone(item.state)}">${safe(item.state.replaceAll('_', ' '))}</span></div><p>${safe(item.reason)}</p><small><b>Next:</b> ${safe(item.required_action)}</small><small class="capability-source">${safe(item.source)} · checked ${safe(item.checked_at)}</small></article>`).join('');
}
function showDetails(id) {
  const p = demoProviders.find(item => item.id === id); if (!p) return;
  el('detailContent').innerHTML = `<div class="dialog-icon">${safe(p.icon)}</div><p class="eyebrow">SYNTHETIC CONNECTION DETAIL</p><h2>${safe(p.name)}</h2><p>${safe(p.note)}</p><p><b>Inventory scope:</b> ${safe(p.scope)}<br><b>Message content:</b> ${safe(p.contentAccess)}<br><b>Fixture status:</b> ${safe(p.checked)}</p><section class="capability-section" aria-labelledby="capabilityHeading"><div class="capability-heading"><h3 id="capabilityHeading">Operation capabilities</h3><span>Fixture only</span></div><div class="capability-list" id="capabilityList" aria-live="polite"><p class="capability-loading">Loading synthetic capability records…</p></div></section><span class="tag-muted">No real provider request was made</span>`;
  el('detailDialog').showModal();
  fetch(`/api/providers/${encodeURIComponent(id)}/capabilities`, { headers: { authorization: `Bearer ${DEMO_TOKEN}` } })
    .then(response => { if (!response.ok) throw new Error('Capability manifest unavailable'); return response.json(); })
    .then(payload => {
      const list = el('capabilityList');
      if (list) list.innerHTML = renderCapabilityRows(payload.data.capabilities);
    })
    .catch(() => { const list = el('capabilityList'); if (list) list.textContent = 'Synthetic capability records are unavailable.'; });
}
el('navigation').addEventListener('click', event => { const button = event.target.closest('[data-view]'); if (button) setView(button.dataset.view); });
document.addEventListener('click', event => { const detail = event.target.closest('[data-detail]'); if (detail) showDetails(detail.dataset.detail); const route = event.target.closest('[data-view]'); if (route && route.closest('.panel')) setView(route.dataset.view); });
el('search').addEventListener('input', renderRows);
el('statusFilter').addEventListener('change', renderRows);
el('resetFilters').addEventListener('click', () => { el('search').value = ''; el('statusFilter').value = 'all'; renderRows(); el('search').focus(); });
el('clearSearch').addEventListener('click', () => { el('search').value = ''; el('statusFilter').value = 'all'; renderRows(); });
el('dismissNotice').addEventListener('click', () => document.querySelector('.notice').remove());
el('connectButton').addEventListener('click', () => showToast('Provider setup is not implemented in this prototype.'));
el('exportButton').addEventListener('click', () => showToast('Export is disabled: these records are synthetic.'));
el('permissionInfo').addEventListener('click', () => el('infoDialog').showModal());
el('closeInfo').addEventListener('click', () => el('infoDialog').close());
el('selectAll').addEventListener('change', event => document.querySelectorAll('#providerRows input[type=checkbox]').forEach(input => input.checked = event.target.checked));
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); el('search').focus(); } });
renderDomains();
fetch('/api/providers', { headers: { authorization: `Bearer ${DEMO_TOKEN}` } })
  .then(response => { if (!response.ok) throw new Error('Demo inventory unavailable'); return response.json(); })
  .then(payload => { demoProviders = payload.data; renderMetrics(); renderRows(); })
  .catch(() => { renderMetrics(); renderRows(); showToast('Local synthetic API is unavailable.'); });
