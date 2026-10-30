// Renders the page to static HTML so content, headings and links are present
// without JavaScript (search engines, link previews, slow devices). React then
// hydrates the same markup in the browser.
import { readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(resolve(root, 'dist-ssr/entry-server.js'));
const file = resolve(root, 'dist/index.html');
const html = await readFile(file, 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('dist/index.html has no <!--app-html--> placeholder');
// Preload the faces used above the fold (hero headline, labels) to avoid a late font swap.
const assets = await readdir(resolve(root, 'dist/assets'));
const base = html.match(/src="([^"]*)assets\/index-/)?.[1] ?? '/';
const critical = [/^cormorant-garamond-latin-300-normal-.*\.woff2$/, /^cormorant-garamond-latin-400-italic-.*\.woff2$/, /^cinzel-latin-wght-normal-.*\.woff2$/];
const preload = critical
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="${base}assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('\n    ');
await writeFile(file, html.replace('<!--app-html-->', render()).replace('</title>', `</title>\n    ${preload}`));
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true });
// Uncleared hotel photographs (local design reference) never leave this machine in a production build.
if (process.env.VITE_REFERENCE_IMAGES !== '1') await rm(resolve(root, 'dist/_reference'), { recursive: true, force: true });
console.log('prerendered dist/index.html');
