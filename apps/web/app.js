import { DEMO_TOKEN, filterDomains, filterMailboxes, filterProviders } from './data.js';
const el = id => document.getElementById(id);
const safe = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let currentView = 'overview';
let demoProviders = [];
let demoDomains = [];
let demoMailboxes = [];
let currentRecords = [];
const viewCopy = {
  overview: ['Operations overview','A clear view of provider connections and mailbox inventory.','Provider connections','Synthetic fixture data · Capability and permission are shown separately.'],
  providers: ['Provider connections','Inspect demo connection scope and explicit content access.','Provider connections','Synthetic fixture data · Capability and permission are shown separately.'],
  domains: ['Domain inventory','Synthetic domain records with DNS states clearly labeled.','Domains','DNS observations are not verified against public records.'],
  mailboxes: ['Mailbox inventory','Metadata examples only; mailbox content is not available.','Mailboxes','Synthetic mailbox metadata · No messages or credentials are exposed.']
};
function renderMetrics() {
  const reviewCount = [...demoProviders, ...demoDomains, ...demoMailboxes].filter(row => row.status === 'attention').length;
  const metrics = [
    ['Provider connections',String(demoProviders.length).padStart(2,'0'),'Synthetic examples only','◉'],['Domains in inventory',String(demoDomains.length).padStart(2,'0'),'DNS not verified','◇'],['Mailbox records',String(demoMailboxes.length).padStart(2,'0'),'Metadata only · no content','▤'],['Records to review',String(reviewCount).padStart(2,'0'),'Fixture status, not a live alert','!']
  ];
  el('metrics').innerHTML = metrics.map(([label,value,foot,icon]) => `<article class="metric"><div class="metric-top"><span>${safe(label)}</span><span class="metric-icon">${safe(icon)}</span></div><div class="metric-value">${safe(value)}</div><div class="metric-foot">${safe(foot)}</div></article>`).join('');
}
function renderRows() {
  const query = el('search').value, status = el('statusFilter').value;
  const providersView = currentView === 'overview' || currentView === 'providers';
  const rows = providersView ? filterProviders(demoProviders, query, status) : currentView === 'domains' ? filterDomains(demoDomains, query, status) : filterMailboxes(demoMailboxes, query, status);
  const entity = providersView ? 'connection' : currentView === 'domains' ? 'domain' : 'mailbox';
  currentRecords = rows;
  el('providerHeader').innerHTML = `<tr><th>${currentView === 'providers' || currentView === 'overview' ? 'PROVIDER / ACCOUNT' : entity.toUpperCase()}</th><th>${providersView ? 'ACCESS SCOPE' : currentView === 'domains' ? 'PROVIDER' : 'DOMAIN / PROVIDER'}</th><th>${providersView ? 'STATUS' : currentView === 'domains' ? 'DNS STATUS' : 'CONTENT ACCESS'}</th>${providersView ? '' : `<th>${currentView === 'domains' ? 'MAILBOXES' : 'INVENTORY STATUS'}</th>`}<th>LAST CHECKED</th><th></th></tr>`;
  el('providerRows').innerHTML = rows.map((p, index) => {
    if (providersView) return `<tr data-id="${safe(p.id)}"><td><div class="provider-cell"><div class="provider-icon ${safe(p.iconClass)}">${safe(p.icon)}</div><div><div class="provider-name">${safe(p.name)}</div><div class="provider-detail">${safe(p.account)} <span>·</span> ${safe(p.host)}</div></div></div></td><td><div class="scope"><span class="scope-dot"></span><span class="scope-pill">${safe(p.scope)}</span></div></td><td><span class="status-pill ${safe(p.status)}"><i></i>${p.status === 'connected' ? 'Fixture available' : 'Review access'}</span></td><td><span class="checked">${safe(p.checked)}</span></td><td><button class="row-more" data-detail="${safe(p.id)}" aria-label="View ${safe(p.name)} details">···</button></td></tr>`;
    if (currentView === 'domains') return `<tr data-id="${safe(p.id)}"><td><div class="provider-cell"><div class="domain-symbol">◇</div><div><div class="provider-name">${safe(p.domain)}</div><div class="provider-detail">Synthetic domain record ${String(index + 1).padStart(2,'0')}</div></div></div></td><td><span class="provider-detail">${safe(p.provider)}</span></td><td><span class="status-pill ${safe(p.status)}"><i></i>${safe(p.dnsStatus)}</span></td><td><span class="count-pill">${safe(p.mailboxCount)}</span></td><td><span class="checked">${safe(p.checked)}</span></td><td><button class="row-more" data-detail="${safe(p.id)}" aria-label="View ${safe(p.domain)} details">···</button></td></tr>`;
    return `<tr data-id="${safe(p.id)}"><td><div class="provider-cell"><div class="mailbox-symbol">▤</div><div><div class="provider-name">${safe(p.email)}</div><div class="provider-detail">Synthetic mailbox metadata</div></div></div></td><td><div class="provider-name">${safe(p.domain)}</div><div class="provider-detail">${safe(p.provider)}</div></td><td><span class="scope-pill">${safe(p.contentAccess)}</span></td><td><span class="status-pill ${safe(p.status)}"><i></i>${p.status === 'synthetic' ? 'Fixture record' : 'Review access'}</span></td><td><span class="checked">${safe(p.checked)}</span></td><td><button class="row-more" data-detail="${safe(p.id)}" aria-label="View ${safe(p.email)} details">···</button></td></tr>`;
  }).join('');
  el('rowCount').textContent = String(rows.length);
  el('resultCount').textContent = `${rows.length} shown`;
  el('footerRange').textContent = rows.length ? `Showing ${rows.length} synthetic ${entity}${rows.length === 1 ? '' : 's'}` : 'No results';
  el('emptyState').hidden = rows.length > 0;
  el('providerRows').hidden = rows.length === 0;
}
function renderDomains() {
  el('domainList').innerHTML = demoDomains.slice(0,2).map(d => `<div class="domain-row"><div class="domain-symbol">◇</div><div><div class="domain-name">${safe(d.domain)}</div><div class="domain-sub">${safe(d.provider)}</div></div><span class="domain-state"><i></i>${safe(d.dnsStatus)}</span></div>`).join('');
}
function setView(view) {
  if (!viewCopy[view]) return;
  currentView = view;
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  const [title,subtitle,tableHeading,description] = viewCopy[view];
  el('crumb').textContent = title;
  el('title').textContent = title;
  el('subtitle').textContent = subtitle;
  el('tableHeading').textContent = tableHeading;
  el('tableDescription').textContent = description;
  const statuses = view === 'providers' || view === 'overview' ? [['all','All states'],['connected','Fixture available'],['attention','Review access']] : [['all','All states'],['synthetic','Synthetic fixture'],['attention','Review access']];
  el('statusFilter').innerHTML = statuses.map(([value,label]) => `<option value="${value}">${label}</option>`).join('');
  el('statusFilter').value = 'all';
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
  const p = currentRecords.find(item => item.id === id); if (!p) return;
  const provider = currentView === 'overview' || currentView === 'providers';
  if (!provider) {
    const view = currentView;
    const title = view === 'domains' ? p.domain : p.email;
    el('detailContent').innerHTML = `<div class="dialog-icon">${view === 'domains' ? '◇' : '▤'}</div><p class="eyebrow">SYNTHETIC ${entityLabel(view)} DETAIL</p><h2>${safe(title)}</h2><p class="capability-loading" aria-live="polite">Loading tenant-scoped metadata…</p>`;
    el('detailDialog').showModal();
    const path = view === 'domains' ? `/api/domains/${encodeURIComponent(id)}` : `/api/mailboxes/${encodeURIComponent(id)}`;
    fetch(path, { headers: { authorization: `Bearer ${DEMO_TOKEN}` } })
      .then(response => { if (!response.ok) throw new Error('Resource detail unavailable'); return response.json(); })
      .then(payload => { if (el('detailDialog').open) el('detailContent').innerHTML = renderResourceDetail(view, payload.data); })
      .catch(() => { if (el('detailDialog').open) el('detailContent').textContent = 'Synthetic resource detail is unavailable.'; });
    return;
  }
  const title = p.name;
  const detail = `<p><b>Inventory scope:</b> ${safe(p.scope)}<br><b>Message content:</b> ${safe(p.contentAccess)}<br><b>Fixture status:</b> ${safe(p.checked)}</p><section class="capability-section" aria-labelledby="capabilityHeading"><div class="capability-heading"><h3 id="capabilityHeading">Operation capabilities</h3><span>Fixture only</span></div><div class="capability-list" id="capabilityList" aria-live="polite"><p class="capability-loading">Loading synthetic capability records…</p></div></section>`;
  el('detailContent').innerHTML = `<div class="dialog-icon">${safe(p.icon)}</div><p class="eyebrow">SYNTHETIC ${entityLabel(currentView)} DETAIL</p><h2>${safe(title)}</h2><p>${safe(p.note)}</p>${detail}<span class="tag-muted">No real provider request was made</span>`;
  el('detailDialog').showModal();
  if (!provider) return;
  fetch(`/api/providers/${encodeURIComponent(id)}/capabilities`, { headers: { authorization: `Bearer ${DEMO_TOKEN}` } })
    .then(response => { if (!response.ok) throw new Error('Capability manifest unavailable'); return response.json(); })
    .then(payload => {
      const list = el('capabilityList');
      if (list) list.innerHTML = renderCapabilityRows(payload.data.capabilities);
    })
    .catch(() => { const list = el('capabilityList'); if (list) list.textContent = 'Synthetic capability records are unavailable.'; });
}
function renderResourceDetail(view, p) {
  if (view === 'domains') return `<div class="dialog-icon">◇</div><p class="eyebrow">SYNTHETIC DOMAIN DETAIL</p><h2>${safe(p.domain)}</h2><p><b>Provider:</b> ${safe(p.provider)}<br><b>DNS state:</b> ${safe(p.dnsStatus)}<br><b>Synthetic mailbox count:</b> ${safe(p.mailboxCount)}<br><b>Observation:</b> ${safe(p.checked)}</p><span class="tag-muted">No DNS lookup was performed</span>`;
  return `<div class="dialog-icon">▤</div><p class="eyebrow">SYNTHETIC MAILBOX DETAIL</p><h2>${safe(p.email)}</h2><p><b>Domain:</b> ${safe(p.domain)}<br><b>Provider:</b> ${safe(p.provider)}<br><b>Content access:</b> ${safe(p.contentAccess)}<br><b>Record status:</b> ${safe(p.status)}<br><b>Observation:</b> ${safe(p.checked)}</p><span class="tag-muted">No mailbox content was accessed</span>`;
}
function entityLabel(view) { return view === 'domains' ? 'DOMAIN' : view === 'mailboxes' ? 'MAILBOX' : 'CONNECTION'; }
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
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); el('search').focus(); } });
fetch('/api/providers', { headers: { authorization: `Bearer ${DEMO_TOKEN}` } })
  .then(response => { if (!response.ok) throw new Error('Demo inventory unavailable'); return response.json(); })
  .then(async payload => {
    demoProviders = payload.data;
    const [domains, mailboxes] = await Promise.all(['/api/domains','/api/mailboxes'].map(async path => { const response = await fetch(path, { headers: { authorization: `Bearer ${DEMO_TOKEN}` } }); if (!response.ok) throw new Error('Synthetic inventory unavailable'); return response.json(); }));
    demoDomains = domains.data; demoMailboxes = mailboxes.data;
    renderDomains(); renderMetrics(); renderRows();
  })
  .catch(() => { renderMetrics(); renderRows(); showToast('Local synthetic API is unavailable.'); });
