import { demoActors, demoProviders } from './fixtures.js';
import { getTenantResource, listTenantResources } from './policy.js';

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'vary': 'authorization',
    'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
    'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer',
    'cross-origin-resource-policy': 'same-origin'
  });
  response.end(JSON.stringify(payload));
  return true;
}

function actorFor(request) {
  const match = /^Bearer\s+(\S+)$/i.exec(request.headers.authorization ?? '');
  return match ? demoActors[match[1]] ?? null : null;
}

export function handleApi(request, response, url) {
  if (url.pathname === '/api/health' && request.method === 'GET') {
    return sendJson(response, 200, { status: 'ok', environment: 'LOCAL_SYNTHETIC', persistent: false, providersConnected: false });
  }
  if (!url.pathname.startsWith('/api/')) return false;
  const actor = actorFor(request);
  if (!actor) return sendJson(response, 401, { error: { code: 'AUTH_REQUIRED', message: 'Use a published local demo fixture identity.' } });
  if (url.pathname === '/api/providers' && request.method === 'GET') {
    const records = listTenantResources(actor, demoProviders).map(({ organizationId, ...safe }) => safe);
    return sendJson(response, 200, { data: records, meta: { environment: 'LOCAL_SYNTHETIC', organizationId: actor.organizationId, role: actor.role } });
  }
  const match = /^\/api\/providers\/([a-z0-9-]+)$/.exec(url.pathname);
  if (match && request.method === 'GET') {
    const resource = getTenantResource(actor, match[1], demoProviders);
    if (!resource) return sendJson(response, 404, { error: { code: 'RESOURCE_NOT_FOUND', message: 'Provider connection not found.' } });
    const { organizationId, ...safe } = resource;
    return sendJson(response, 200, { data: safe, meta: { environment: 'LOCAL_SYNTHETIC', organizationId: actor.organizationId, role: actor.role } });
  }
  if (['POST','PUT','PATCH','DELETE'].includes(request.method)) return sendJson(response, 405, { error: { code: 'MUTATION_NOT_IMPLEMENTED', message: 'Provider mutations are not implemented in this prototype.' } });
  return sendJson(response, 404, { error: { code: 'ROUTE_NOT_FOUND', message: 'API route not found.' } });
}
