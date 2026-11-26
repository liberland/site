// Static server for the tests, behaving like GitHub Pages for this site:
//   /form    -> 301 /form/                (directory without a trailing slash)
//   /form/*  -> files from liberland-sign/ (the path on liberlandlimited.com)
//   /*       -> the same files            (the page also works at a domain root)
// Unknown files are 404s, so a broken relative path fails a test instead of
// being masked by an SPA fallback.
// Usage: node tests/server.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2] || process.env.PORT || 3748);
const BASE = '/form';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.pdf': 'application/pdf',
};

http.createServer((req, res) => {
  let url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (url === BASE) { res.writeHead(301, { Location: BASE + '/' }); return res.end(); }
  if (url.startsWith(BASE + '/')) url = url.slice(BASE.length);
  let file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.endsWith('/')) { res.writeHead(301, { Location: req.url.split('?')[0] + '/' }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file) || file.includes(`${path.sep}node_modules${path.sep}`)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Liberland eSignature test server on http://localhost:${PORT}${BASE}/`));
