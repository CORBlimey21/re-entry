import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Forbidden');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    res.writeHead(200, { 'Content-Type': `${types[extname(file)] || 'application/octet-stream'}${['.html', '.js', '.css'].includes(extname(file)) ? '; charset=utf-8' : ''}`, 'Cache-Control': 'no-cache' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`RE-ENTRY → http://127.0.0.1:${port}`));
