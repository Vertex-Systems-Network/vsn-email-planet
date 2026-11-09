import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../apps/web/', import.meta.url));
const port = Number(process.env.APP_PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = resolve(root, file);
    const rel = relative(root, target);
    if (rel === '..' || rel.startsWith(`..${sep}`) || resolve(target) === resolve(root, '..')) throw new Error('Path outside web root');
    const body = await readFile(target);
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', 'x-content-type-options': 'nosniff' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Synthetic VSN mail operations prototype: http://127.0.0.1:${port}`));
