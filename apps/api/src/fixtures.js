export const demoActors = Object.freeze({
  'fixture-local-northstar': Object.freeze({ id: 'actor-northstar', organizationId: 'demo-org-northstar', role: 'operator', environment: 'LOCAL_SYNTHETIC' }),
  'fixture-local-fieldnotes': Object.freeze({ id: 'actor-fieldnotes', organizationId: 'demo-org-fieldnotes', role: 'viewer', environment: 'LOCAL_SYNTHETIC' })
});

export const demoProviders = Object.freeze([
  Object.freeze({ id: 'demo-google-1', organizationId: 'demo-org-northstar', name: 'Google Workspace', account: 'northstar.example', host: 'workspace.google.com', scope: 'Directory metadata', contentAccess: 'Not granted', status: 'connected', checked: 'Example fixture', icon: 'G', iconClass: 'google', note: 'Synthetic organization; no OAuth connection exists.' }),
  Object.freeze({ id: 'demo-cpanel-1', organizationId: 'demo-org-northstar', name: 'cPanel UAPI', account: 'mail.example-agency.test', host: 'cpanel.example.test', scope: 'Account inventory', contentAccess: 'Separate authorization required', status: 'attention', checked: 'Example fixture', icon: 'cP', iconClass: 'panel', note: 'Synthetic host; panel access does not imply message access.' }),
  Object.freeze({ id: 'demo-graph-1', organizationId: 'demo-org-fieldnotes', name: 'Microsoft Graph', account: 'fieldnotes.invalid', host: 'graph.microsoft.test', scope: 'No consent', contentAccess: 'Not granted', status: 'attention', checked: 'Example fixture', icon: 'M', iconClass: 'graph', note: 'Synthetic second tenant; no Graph tenant is connected.' })
]);

export const demoDomains = Object.freeze([
  Object.freeze({ id: 'domain-northstar-example', organizationId: 'demo-org-northstar', domain: 'northstar.example', provider: 'Google Workspace fixture', status: 'synthetic', dnsStatus: 'Unverified', mailboxCount: 3, checked: 'Example fixture' }),
  Object.freeze({ id: 'domain-agency-test', organizationId: 'demo-org-northstar', domain: 'example-agency.test', provider: 'cPanel fixture', status: 'attention', dnsStatus: 'Unverified', mailboxCount: 2, checked: 'Example fixture' }),
  Object.freeze({ id: 'domain-fieldnotes-invalid', organizationId: 'demo-org-fieldnotes', domain: 'fieldnotes.invalid', provider: 'No provider connection', status: 'attention', dnsStatus: 'Unverified', mailboxCount: 1, checked: 'Example fixture' })
]);

export const demoMailboxes = Object.freeze([
  Object.freeze({ id: 'mailbox-ops-northstar', organizationId: 'demo-org-northstar', email: 'ops@northstar.example', domain: 'northstar.example', provider: 'Google Workspace fixture', status: 'synthetic', contentAccess: 'Not granted', checked: 'Example fixture' }),
  Object.freeze({ id: 'mailbox-support-northstar', organizationId: 'demo-org-northstar', email: 'support@northstar.example', domain: 'northstar.example', provider: 'Google Workspace fixture', status: 'synthetic', contentAccess: 'Not granted', checked: 'Example fixture' }),
  Object.freeze({ id: 'mailbox-owner-northstar', organizationId: 'demo-org-northstar', email: 'owner@northstar.example', domain: 'northstar.example', provider: 'Google Workspace fixture', status: 'attention', contentAccess: 'Separate authorization required', checked: 'Example fixture' }),
  Object.freeze({ id: 'mailbox-sales-agency', organizationId: 'demo-org-northstar', email: 'sales@example-agency.test', domain: 'example-agency.test', provider: 'cPanel fixture', status: 'attention', contentAccess: 'Separate authorization required', checked: 'Example fixture' }),
  Object.freeze({ id: 'mailbox-admin-agency', organizationId: 'demo-org-northstar', email: 'admin@example-agency.test', domain: 'example-agency.test', provider: 'cPanel fixture', status: 'attention', contentAccess: 'Not granted', checked: 'Example fixture' }),
  Object.freeze({ id: 'mailbox-info-fieldnotes', organizationId: 'demo-org-fieldnotes', email: 'info@fieldnotes.invalid', domain: 'fieldnotes.invalid', provider: 'Microsoft Graph fixture', status: 'attention', contentAccess: 'Not granted', checked: 'Example fixture' })
]);

export const demoCapabilities = Object.freeze({
  'demo-google-1': Object.freeze({ provider: 'Google Workspace', environment: 'LOCAL_SYNTHETIC', capabilities: Object.freeze([
    Object.freeze({ operation: 'list_mailboxes', resource_type: 'connection', state: 'READ_ONLY', reason: 'The fixture includes mailbox metadata only.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'No action required for this demo listing.' }),
    Object.freeze({ operation: 'fetch_message', resource_type: 'mailbox', state: 'NEEDS_CONSENT', reason: 'Message content access is not granted by this fixture.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'Explicit mailbox-content consent and a supported provider authorization would be required.' }),
    Object.freeze({ operation: 'provision_mailbox', resource_type: 'domain', state: 'UNSUPPORTED', reason: 'No provider administration adapter is connected.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'Use a supported admin connector after implementation.' })
  ]) }),
  'demo-cpanel-1': Object.freeze({ provider: 'cPanel UAPI', environment: 'LOCAL_SYNTHETIC', capabilities: Object.freeze([
    Object.freeze({ operation: 'list_domains', resource_type: 'connection', state: 'READ_ONLY', reason: 'Synthetic account inventory can be listed.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'No action required for this demo listing.' }),
    Object.freeze({ operation: 'list_mailboxes', resource_type: 'domain', state: 'NEEDS_ADMIN', reason: 'The simulated cPanel role does not grant mailbox inventory access.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'Ask a hosting administrator to grant the required UAPI role.' }),
    Object.freeze({ operation: 'fetch_message', resource_type: 'mailbox', state: 'NEEDS_CONSENT', reason: 'Panel administration does not grant message-content access.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'Obtain separate mailbox authorization using an implemented access route.' }),
    Object.freeze({ operation: 'provision_mailbox', resource_type: 'domain', state: 'PROVIDER_DISABLED', reason: 'The simulated host has disabled the relevant provider function.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'Contact the hosting provider or choose an enabled management route.' })
  ]) }),
  'demo-graph-1': Object.freeze({ provider: 'Microsoft Graph', environment: 'LOCAL_SYNTHETIC', capabilities: Object.freeze([
    Object.freeze({ operation: 'list_mailboxes', resource_type: 'connection', state: 'NEEDS_CONSENT', reason: 'No Graph admin or delegated consent exists in this fixture.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'An authorized tenant admin would need to grant the applicable Graph permissions.' }),
    Object.freeze({ operation: 'fetch_message', resource_type: 'mailbox', state: 'NEEDS_CONSENT', reason: 'No mailbox-content permission exists in this fixture.', source: 'synthetic demo fixture', checked_at: '2026-11-10T00:00:00.000Z', required_action: 'Obtain explicit supported mailbox authorization.' })
  ]) })
});
