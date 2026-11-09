export type CapabilityState =
  | "SUPPORTED" | "READ_ONLY" | "NEEDS_CONSENT" | "NEEDS_ADMIN"
  | "NEEDS_WHITELIST" | "NEEDS_LICENSE" | "PROVIDER_DISABLED"
  | "RATE_LIMITED" | "UNSUPPORTED" | "UNKNOWN" | "BROKEN";

export type TenantResource = {
  id: string;
  organizationId: string;
};

export type Capability = {
  action: string;
  state: CapabilityState;
  checkedAt: string;
  source: string;
  reason?: string;
  requiredAction?: string;
};

export type AuthorizationContext = {
  organizationId: string;
  /** Per-mailbox grants must be issued by the server after verified consent/delegation. */
  mailboxContentGrantIds: readonly string[];
};

/** Defense-in-depth scope helper. The tenant ID must come from verified server auth, never request input. */
export function scopeTenantResources<T extends TenantResource>(
  trustedOrganizationId: string,
  resources: readonly T[],
): T[] {
  return resources.filter((resource) => resource.organizationId === trustedOrganizationId);
}

/** Panel/admin visibility is deliberately not treated as permission to read message content. */
export function canReadMailboxContent(
  authorization: AuthorizationContext,
  mailbox: TenantResource,
): boolean {
  return mailbox.organizationId === authorization.organizationId
    && authorization.mailboxContentGrantIds.includes(mailbox.id);
}

export function canPerformCapability(capability: Capability | undefined, write = false): boolean {
  if (!capability) return false;
  if (capability.state === "SUPPORTED") return true;
  return !write && capability.state === "READ_ONLY";
}
