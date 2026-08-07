// Minimal static file server for local testing (no deps).
// Usage: node scripts/serve.mjs [dir] [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize } from 'node:path';

const dir = normalize(process.argv[2] ?? 'od-site');
const port = Number(process.argv[3] ?? 4173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  try {
    let path = normalize(join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    if (!path.startsWith(dir)) throw Object.assign(new Error('forbidden'), { code: 403 });
    const st = await stat(path);
    if (st.isDirectory()) path = join(path, 'index.html');
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[path.slice(path.lastIndexOf('.'))] ?? 'application/octet-stream' });
    res.end(body);
  } catch (e) {
    res.writeHead(e.code === 403 ? 403 : 404);
    res.end(e.code === 403 ? 'forbidden' : 'not found');
  }
}).listen(port, () => console.log(`Serving ${dir} at http://localhost:${port}`));