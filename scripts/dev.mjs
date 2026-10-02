#!/usr/bin/env node
/**
 * Servidor de desenvolvimento: gera o site, serve dist/ em http://localhost:5173
 * e refaz o build (recarregando a página) sempre que um arquivo de src/ mudar.
 *   npm run dev
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 5173;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
};
const clients = new Set();
const RELOAD = `<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>`;

function runBuild() {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [path.join(ROOT, 'scripts/build.mjs')], { stdio: 'inherit' });
    p.on('exit', resolve);
  });
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST)) return res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
  } catch {
    file = path.join(DIST, '404.html');
    res.statusCode = 404;
  }
  try {
    let body = await readFile(file);
    const ext = path.extname(file);
    if (ext === '.html') body = body.toString().replace('</body>', `${RELOAD}</body>`);
    res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  } catch {
    res.writeHead(404).end('Não encontrado');
  }
}).listen(PORT, async () => {
  await runBuild();
  console.log(`\n→ http://localhost:${PORT}\n`);
});

let timer;
watch(path.join(ROOT, 'src'), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    await runBuild();
    for (const c of clients) c.write('data: reload\n\n');
  }, 120);
});
