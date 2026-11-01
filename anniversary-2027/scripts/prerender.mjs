// Renders the page to static HTML so content, headings and links are present without JavaScript
// (search engines, link previews, slow devices). React then hydrates the same markup.
import { readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(resolve(root, 'dist-ssr/entry-server.js'));
const file = resolve(root, 'dist/index.html');
const html = await readFile(file, 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('dist/index.html has no <!--app-html--> placeholder');
const body = render();

// Preload the faces used above the fold (hero headline, labels, record type) to avoid a late font swap.
const assets = await readdir(resolve(root, 'dist/assets'));
const base = html.match(/src="([^"]*)assets\/index-/)?.[1] ?? '/';
const critical = [/^playfair-display-latin-400-normal-.*\.woff2$/, /^archivo-latin-wght-.*\.woff2$/, /^playfair-display-latin-400-italic-.*\.woff2$/];
const links = critical
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="${base}assets/${f}" as="font" type="font/woff2" crossorigin>`);
// Preload the hero photograph once one is published (none while IMG-01 is uncleared).
const hero = body.match(/<img class="hero-photo"[^>]*>/)?.[0];
if (hero) {
  const srcset = hero.match(/srcSet="([^"]+)"|srcset="([^"]+)"/i);
  const src = hero.match(/ src="([^"]+)"/)?.[1];
  links.push(`<link rel="preload" as="image" href="${src}" imagesrcset="${(srcset?.[1] ?? srcset?.[2] ?? '').replace(/&amp;/g, '&')}" imagesizes="100vw" fetchpriority="high">`);
}
await writeFile(file, html.replace('<!--app-html-->', body).replace('</title>', `</title>\n    ${links.join('\n    ')}`));
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true });
// Uncleared photographs (local design reference) never leave this machine in a production build.
if (process.env.VITE_REFERENCE_IMAGES !== '1') await rm(resolve(root, 'dist/_reference'), { recursive: true, force: true });
console.log('prerendered dist/index.html');
