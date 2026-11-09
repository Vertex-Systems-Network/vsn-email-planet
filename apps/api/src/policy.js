export function listTenantResources(actor, resources) {
  if (!actor?.organizationId || !Array.isArray(resources)) return [];
  return resources.filter(resource => resource.organizationId === actor.organizationId);
}

export function getTenantResource(actor, id, resources) {
  if (!actor?.organizationId || !id) return null;
  return resources.find(resource => resource.id === id && resource.organizationId === actor.organizationId) ?? null;
}

export function canReadMailboxContent(actor, mailboxGrant) {
  return Boolean(actor?.organizationId && mailboxGrant?.organizationId === actor.organizationId && mailboxGrant?.contentRead === true && mailboxGrant?.consentStatus === 'granted');
}
