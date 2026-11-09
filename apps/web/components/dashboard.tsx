"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, Archive, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, Check, ChevronDown, CircleHelp, Clock3, Command, FileClock, Filter,
  Globe2, Inbox, LayoutDashboard, Mail, Menu, MoreHorizontal, PanelLeftClose,
  Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Users,
} from "lucide-react";

type Mailbox = {
  id: string;
  address: string;
  client: string;
  provider: string;
  state: "Healthy" | "Attention" | "Needs review";
  detail: string;
  initials: string;
  tint: string;
};

// Synthetic, static sample data. It is intentionally not fetched from a provider.
const mailboxRows: Mailbox[] = [
  { id: "m1", address: "hello@northstar.studio", client: "Northstar Studio", provider: "Google Workspace", state: "Healthy", detail: "Checked 12 min ago", initials: "NS", tint: "lavender" },
  { id: "m2", address: "team@oakandstone.co", client: "Oak & Stone", provider: "Microsoft 365", state: "Attention", detail: "Token expires in 2 days", initials: "OS", tint: "sage" },
  { id: "m3", address: "support@meridianlabs.io", client: "Meridian Labs", provider: "cPanel UAPI", state: "Healthy", detail: "Checked 28 min ago", initials: "ML", tint: "peach" },
  { id: "m4", address: "contact@formandfield.com", client: "Form & Field", provider: "IMAP / SMTP", state: "Needs review", detail: "Mailbox access not granted", initials: "FF", tint: "blue" },
  { id: "m5", address: "accounts@solacewellness.co", client: "Solace Wellness", provider: "Google Workspace", state: "Healthy", detail: "Checked 1 hr ago", initials: "SW", tint: "rose" },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Connections", icon: Globe2 },
  { label: "Mailboxes", icon: Inbox },
  { label: "Incidents", icon: AlertTriangle, count: "3" },
  { label: "Migrations", icon: ArrowRight },
  { label: "Archive & recovery", icon: Archive },
];

function StatusBadge({ state }: { state: Mailbox["state"] }) {
  const icon = state === "Healthy" ? <Check size={12} /> : <AlertTriangle size={12} />;
  const cls = state === "Healthy" ? "good" : state === "Attention" ? "warning" : "neutral";
  return <span className={`status-badge ${cls}`}>{icon}{state}</span>;
}

export function Dashboard() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All status");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);
  const visibleRows = useMemo(() => mailboxRows.filter((row) => {
    const term = query.trim().toLowerCase();
    const matchesTerm = !term || `${row.address} ${row.client} ${row.provider}`.toLowerCase().includes(term);
    const matchesStatus = filter === "All status" || row.state === filter;
    return matchesTerm && matchesStatus;
  }), [query, filter]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`} aria-label="Primary navigation">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
          <div className="brand-copy"><strong>Email Planet</strong><span>by VSN</span></div>
          <button className="rail-collapse icon-button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}><PanelLeftClose size={17} /></button>
        </div>

        <button className="workspace-switcher" aria-label="Current workspace: Pella Global Agency" disabled title="Workspace switching is not implemented yet">
          <span className="workspace-avatar">PG</span>
          <span className="workspace-info"><strong>Pella Global</strong><small>Agency workspace</small></span>
          <ChevronDown size={15} />
        </button>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="main-nav">
          {navigation.map(({ label, icon: Icon, active, count }) => (
            <button key={label} className={`nav-item ${active ? "active" : ""}`} disabled={!active} aria-current={active ? "page" : undefined} title={active ? undefined : `${label} is not implemented yet`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              {count && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>

        <div className="nav-caption nav-caption-spaced">MANAGE</div>
        <nav className="main-nav">
          <button className="nav-item" disabled title="Team access is not implemented yet"><Users size={17} strokeWidth={1.8} /><span>Team access</span></button>
          <button className="nav-item" disabled title="Settings are not implemented yet"><Settings2 size={17} strokeWidth={1.8} /><span>Settings</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={15} /></div>
            <div><strong>Need a hand?</strong><small>Visit the help center</small></div>
            <ArrowUpRight size={14} className="help-arrow" />
          </div>
          <button className="profile-row" aria-label="Profile menu for Ayesha Khan" disabled title="Profile settings are not implemented yet">
            <span className="profile-avatar">AK</span>
            <span className="profile-copy"><strong>Ayesha Khan</strong><small>Workspace admin</small></span>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>

      {mobileNavOpen && <button className="nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileNavOpen(false)} />}

      <main id="main-content" className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={19} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-divider">/</span><strong>Overview</strong></div>
          <div className="topbar-actions">
            <label className="global-search">
              <Search size={15} />
            <input ref={searchRef} aria-label="Search sample mailboxes and clients" placeholder="Search sample mailboxes..." value={query} onChange={(event) => setQuery(event.target.value)} />
              <kbd><Command size={11} /> K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Sample notifications, 2 unread" disabled title="Notifications are not implemented yet"><Bell size={18} /><i /></button>
            <button className="topbar-help" aria-label="Help" disabled title="Help center is not implemented yet"><CircleHelp size={17} /></button>
          </div>
        </header>

        <div className="page-content">
          <div className="demo-banner" role="status">
            <span className="demo-indicator"><span /></span>
            <strong>Demo workspace</strong>
            <span className="demo-divider" />
            <span>All figures below are synthetic sample data. No providers are connected.</span>
          </div>

          <section className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> MONDAY, NOVEMBER 9, 2026</div>
              <h1>Operations overview</h1>
              <p className="subtitle">A clear picture of your email infrastructure, all in one place.</p>
            </div>
            <button className="primary-button" disabled title="Provider connections are not implemented yet"><Plus size={16} /> Add connection</button>
          </section>

          <section className="metrics-grid" aria-label="Sample workspace summary">
            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon violet"><Globe2 size={17} /></span><span className="metric-label">Connections</span><button className="metric-more" aria-label="More about connections" title="Synthetic example only"><MoreHorizontal size={17} /></button></div>
              <div className="metric-value-row"><strong>18</strong><span className="metric-trend positive"><ArrowUpRight size={13} /> 12.5%</span></div>
              <div className="metric-foot"><span>Across 6 providers</span><span className="metric-foot-note">vs. last month</span></div>
              <div className="metric-sparkline spark-violet" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
            </article>

            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon blue"><Inbox size={17} /></span><span className="metric-label">Mailboxes</span><button className="metric-more" aria-label="More about mailboxes" title="Synthetic example only"><MoreHorizontal size={17} /></button></div>
              <div className="metric-value-row"><strong>248</strong><span className="metric-trend positive"><ArrowUpRight size={13} /> 8.2%</span></div>
              <div className="metric-foot"><span>Across 32 client domains</span><span className="metric-foot-note">vs. last month</span></div>
              <div className="metric-sparkline spark-blue" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
            </article>

            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon amber"><AlertTriangle size={17} /></span><span className="metric-label">Needs attention</span><button className="metric-more" aria-label="More about alerts" title="Synthetic example only"><MoreHorizontal size={17} /></button></div>
              <div className="metric-value-row"><strong>6</strong><span className="metric-trend negative"><ArrowDownRight size={13} /> 2 new</span></div>
              <div className="metric-foot"><span>1 critical · 5 warnings</span><span className="metric-foot-note">in this workspace</span></div>
              <div className="metric-sparkline spark-amber" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
            </article>

            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon green"><Activity size={17} /></span><span className="metric-label">Sync health</span><button className="metric-more" aria-label="More about sync health" title="Synthetic example only"><MoreHorizontal size={17} /></button></div>
              <div className="metric-value-row"><strong>96.4<span className="metric-percent">%</span></strong><span className="metric-trend positive"><ArrowUpRight size={13} /> 1.8%</span></div>
              <div className="metric-foot"><span>17 of 18 connections healthy</span><span className="metric-foot-note">sample status</span></div>
              <div className="metric-sparkline spark-green" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
            </article>
          </section>

          <section className="overview-grid">
            <article className="panel provider-panel">
              <div className="panel-header">
                <div><h2>Provider health</h2><p>Sample status across connected services</p></div>
                <button className="text-action" disabled title="Provider list is not implemented yet">View all <ArrowRight size={14} /></button>
              </div>
              <div className="provider-list">
                <div className="provider-row"><span className="provider-logo google-logo">G</span><span className="provider-name"><strong>Google Workspace</strong><small>7 connections</small></span><span className="provider-state"><i className="dot green-dot" />Healthy</span><span className="provider-rate">100%</span></div>
                <div className="provider-row"><span className="provider-logo microsoft-logo"><span>▦</span></span><span className="provider-name"><strong>Microsoft 365</strong><small>5 connections</small></span><span className="provider-state"><i className="dot amber-dot" />Attention</span><span className="provider-rate">92%</span></div>
                <div className="provider-row"><span className="provider-logo cpanel-logo">cP</span><span className="provider-name"><strong>cPanel / WHM</strong><small>4 connections</small></span><span className="provider-state"><i className="dot green-dot" />Healthy</span><span className="provider-rate">98%</span></div>
                <div className="provider-row"><span className="provider-logo imap-logo"><Mail size={15} /></span><span className="provider-name"><strong>IMAP / SMTP</strong><small>2 connections</small></span><span className="provider-state"><i className="dot gray-dot" />Mixed</span><span className="provider-rate">84%</span></div>
              </div>
              <div className="panel-footer-note"><ShieldCheck size={14} /><span>Provider capabilities are checked per connection in a live deployment.</span></div>
            </article>

            <article className="panel attention-panel">
              <div className="panel-header">
                <div><h2>Needs your attention</h2><p>Prioritized sample issues</p></div>
                <span className="issue-total">3</span>
              </div>
              <div className="issue-list">
                <div className="issue-row"><span className="issue-mark critical"><AlertTriangle size={14}/></span><div className="issue-copy"><strong>OAuth token expiring soon</strong><span>Oak & Stone · Microsoft 365</span></div><span className="issue-age">2d</span></div>
                <div className="issue-row"><span className="issue-mark warning"><Clock3 size={14}/></span><div className="issue-copy"><strong>Sync running behind</strong><span>Meridian Labs · 4 mailboxes</span></div><span className="issue-age">18m</span></div>
                <div className="issue-row"><span className="issue-mark neutral-issue"><FileClock size={14}/></span><div className="issue-copy"><strong>Mailbox access not approved</strong><span>Form & Field · IMAP / SMTP</span></div><span className="issue-age">1d</span></div>
              </div>
              <button className="panel-bottom-action" disabled title="Incident workflow is not implemented yet">Review sample issues <ArrowRight size={14} /></button>
            </article>
          </section>

          <section className="panel mailbox-panel">
            <div className="panel-header mailbox-header">
              <div><h2>Mailbox inventory</h2><p>Sample mailboxes across your client workspaces</p></div>
              <div className="table-actions">
                <label className="table-search"><Search size={14}/><input aria-label="Filter mailbox inventory" placeholder="Filter mailboxes" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
                <label className="select-wrap"><Filter size={14}/><select aria-label="Filter by mailbox status" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All status</option><option>Healthy</option><option>Attention</option><option>Needs review</option></select><ChevronDown size={13}/></label>
                <button className="table-icon-button" aria-label="More table filters" title="Sample data only"><SlidersHorizontal size={16}/></button>
              </div>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th scope="col"><input aria-label="Select all visible sample mailboxes" type="checkbox" disabled /></th><th scope="col">MAILBOX</th><th scope="col">CLIENT</th><th scope="col">PROVIDER</th><th scope="col">STATUS</th><th scope="col">LAST CHECKED</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {visibleRows.map((row) => <tr key={row.id}>
                    <td><input aria-label={`Select ${row.address}`} type="checkbox" disabled /></td>
                    <td><div className="mailbox-cell"><span className={`client-avatar ${row.tint}`}>{row.initials}</span><strong>{row.address}</strong></div></td>
                    <td className="client-cell">{row.client}</td>
                    <td><span className="provider-cell"><span className={`tiny-provider ${row.tint}`} />{row.provider}</span></td>
                    <td><StatusBadge state={row.state} /></td>
                    <td className="checked-cell"><span>{row.detail}</span></td>
                    <td><button className="row-menu" aria-label={`More actions for ${row.address}`} title="Actions unavailable in this prototype"><MoreHorizontal size={16}/></button></td>
                  </tr>)}
                  {visibleRows.length === 0 && <tr><td colSpan={7} className="empty-row"><Search size={17}/><strong>No sample mailboxes match</strong><span>Try another search term or status.</span></td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{visibleRows.length}</strong> of <strong>248</strong> sample mailboxes</span><button disabled>View inventory <ArrowRight size={14}/></button></div>
          </section>

          <footer className="page-footer"><span>VSN Email Planet <span>·</span> Local prototype</span><span><Sparkles size={13}/>Built for clearer email operations</span></footer>
        </div>
      </main>
    </div>
  );
}
