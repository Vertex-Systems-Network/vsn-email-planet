import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from '../apps/api/src/service.js';

const root = fileURLToPath(new URL('../apps/web/', import.meta.url));
const port = Number(process.env.APP_PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname.startsWith('/api/')) {
      if (handleApi(req, res, requestUrl)) return;
      res.writeHead(404, { 'content-type': 'application/json; charset=utf-8', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'", 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer', 'cross-origin-resource-policy': 'same-origin' });
      res.end(JSON.stringify({ error: { code: 'ROUTE_NOT_FOUND' } }));
      return;
    }
    const file = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = resolve(root, file);
    const rel = relative(root, target);
    if (rel === '..' || rel.startsWith(`..${sep}`) || resolve(target) === resolve(root, '..')) throw new Error('Path outside web root');
    const body = await readFile(target);
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'", 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer', 'cross-origin-resource-policy': 'same-origin' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'", 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer', 'cross-origin-resource-policy': 'same-origin' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Synthetic VSN mail operations prototype: http://127.0.0.1:${port}`));
