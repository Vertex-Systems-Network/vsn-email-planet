export const demoActors = Object.freeze({
  'fixture-local-northstar': Object.freeze({ id: 'actor-northstar', organizationId: 'demo-org-northstar', role: 'operator', environment: 'LOCAL_SYNTHETIC' }),
  'fixture-local-fieldnotes': Object.freeze({ id: 'actor-fieldnotes', organizationId: 'demo-org-fieldnotes', role: 'viewer', environment: 'LOCAL_SYNTHETIC' })
});

export const demoProviders = Object.freeze([
  Object.freeze({ id: 'demo-google-1', organizationId: 'demo-org-northstar', name: 'Google Workspace', account: 'northstar.example', host: 'workspace.google.com', scope: 'Directory metadata', contentAccess: 'Not granted', status: 'connected', checked: 'Example fixture', icon: 'G', iconClass: 'google', note: 'Synthetic organization; no OAuth connection exists.' }),
  Object.freeze({ id: 'demo-cpanel-1', organizationId: 'demo-org-northstar', name: 'cPanel UAPI', account: 'mail.example-agency.test', host: 'cpanel.example.test', scope: 'Account inventory', contentAccess: 'Separate authorization required', status: 'attention', checked: 'Example fixture', icon: 'cP', iconClass: 'panel', note: 'Synthetic host; panel access does not imply message access.' }),
  Object.freeze({ id: 'demo-graph-1', organizationId: 'demo-org-fieldnotes', name: 'Microsoft Graph', account: 'fieldnotes.invalid', host: 'graph.microsoft.test', scope: 'No consent', contentAccess: 'Not granted', status: 'attention', checked: 'Example fixture', icon: 'M', iconClass: 'graph', note: 'Synthetic second tenant; no Graph tenant is connected.' })
]);
