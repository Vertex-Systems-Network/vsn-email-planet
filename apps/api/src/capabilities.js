export const CAPABILITY_STATES = Object.freeze([
  'SUPPORTED',
  'READ_ONLY',
  'NEEDS_CONSENT',
  'NEEDS_ADMIN',
  'NEEDS_WHITELIST',
  'NEEDS_LICENSE',
  'PROVIDER_DISABLED',
  'RATE_LIMITED',
  'UNSUPPORTED',
  'UNKNOWN',
  'BROKEN'
]);

const EXECUTABLE_STATES = new Set(['SUPPORTED', 'READ_ONLY']);

export class ProviderOperationError extends Error {
  constructor({ code, operation, message, requiredAction = 'Review the provider capability and access policy.' }) {
    super(message);
    this.name = 'ProviderOperationError';
    this.code = code;
    this.operation = operation;
    this.requiredAction = requiredAction;
  }
}

export function validateCapabilityManifest(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return ['manifest must be an object'];
  }
  if (!Array.isArray(manifest.capabilities) || manifest.capabilities.length === 0) {
    errors.push('capabilities must be a non-empty array');
    return errors;
  }

  const seen = new Set();
  for (const [index, capability] of manifest.capabilities.entries()) {
    const prefix = `capabilities[${index}]`;
    if (!capability || typeof capability !== 'object' || Array.isArray(capability)) {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    if (!capability.operation || typeof capability.operation !== 'string') errors.push(`${prefix}.operation is required`);
    if (!CAPABILITY_STATES.includes(capability.state)) errors.push(`${prefix}.state is invalid`);
    if (!capability.reason || typeof capability.reason !== 'string') errors.push(`${prefix}.reason is required`);
    if (!capability.source || typeof capability.source !== 'string') errors.push(`${prefix}.source is required`);
    if (!capability.required_action || typeof capability.required_action !== 'string') errors.push(`${prefix}.required_action is required`);
    if (!capability.checked_at || Number.isNaN(Date.parse(capability.checked_at))) errors.push(`${prefix}.checked_at must be an ISO date`);
    const key = `${capability.resource_type ?? 'connection'}:${capability.operation}`;
    if (seen.has(key)) errors.push(`${prefix} duplicates ${key}`);
    seen.add(key);
    if (capability.state === 'SUPPORTED' && capability.mutability === 'read_only') {
      errors.push(`${prefix} read-only operations must use READ_ONLY state`);
    }
  }
  return errors;
}

export function capabilityDecision(manifest, operation, resourceType = 'connection') {
  const errors = validateCapabilityManifest(manifest);
  if (errors.length) return { allowed: false, state: 'UNKNOWN', reasons: errors, required_action: 'Correct the capability manifest.' };
  const capability = manifest.capabilities.find(item => item.operation === operation && (item.resource_type ?? 'connection') === resourceType);
  if (!capability) return { allowed: false, state: 'UNKNOWN', reasons: ['Operation was not declared by the provider.'], required_action: 'Probe the provider capability before offering this operation.' };
  return {
    allowed: EXECUTABLE_STATES.has(capability.state),
    state: capability.state,
    reasons: [capability.reason],
    required_action: capability.required_action,
    source: capability.source,
    checked_at: capability.checked_at
  };
}

export function assertCapabilityAllows(manifest, operation, resourceType = 'connection') {
  const decision = capabilityDecision(manifest, operation, resourceType);
  if (!decision.allowed) {
    throw new ProviderOperationError({
      code: decision.state,
      operation,
      message: `Provider operation ${operation} is ${decision.state.toLowerCase()}: ${decision.reasons.join(' ')}`,
      requiredAction: decision.required_action
    });
  }
  return decision;
}

export async function invokeProviderOperation({ connector, manifest, operation, resourceType = 'connection', context, input }) {
  const capability = assertCapabilityAllows(manifest, operation, resourceType);
  const handler = connector?.operations?.[operation];
  if (typeof handler !== 'function') {
    throw new ProviderOperationError({
      code: 'BROKEN',
      operation,
      message: `Provider declared ${operation} as available but supplied no operation handler.`,
      requiredAction: 'Repair the connector implementation and run its contract tests.'
    });
  }
  try {
    const data = await handler({ context, input });
    return {
      data,
      meta: {
        provider: manifest.provider ?? connector.name ?? 'unknown',
        environment: manifest.environment ?? 'UNSPECIFIED',
        operation,
        capability: { state: capability.state, source: capability.source, checked_at: capability.checked_at }
      }
    };
  } catch (error) {
    if (error instanceof ProviderOperationError) throw error;
    throw new ProviderOperationError({
      code: 'BROKEN',
      operation,
      message: 'Provider operation failed without a classified provider outcome.',
      requiredAction: 'Inspect sanitized connector diagnostics and retry only after the provider state is known.'
    });
  }
}
