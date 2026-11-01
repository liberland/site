import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { headTags } from './src/lib/head';
import { validate } from './src/lib/validate';

const root = fileURLToPath(new URL('.', import.meta.url));
/** TICKETING_FIXTURE=1 swaps in tests/fixtures/ticketing.ts (fake live-sales data) — for `npm run test:tickets` only. */
const FIXTURE = process.env.TICKETING_FIXTURE === '1';

/** Validates src/data/anniversary.ts and injects title, description, social and structured-data tags. */
function eventHead(): Plugin {
  return {
    name: 'anniversary-head',
    transformIndexHtml(html) {
      validate(root);
      return html.replace('<!--app-head-->', headTags());
    },
  };
}

// Production target: https://anniversary.ll.land/ (served at the domain root).
// For a sub-path preview, build with BASE_PATH=/anniversary-2027/ (must start and end with "/").
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), eventHead()],
  resolve: FIXTURE ? { alias: [{ find: /^(\.\.?\/)+config\/ticketing$/, replacement: fileURLToPath(new URL('./tests/fixtures/ticketing.ts', import.meta.url)) }] } : {},
  build: { target: 'es2020', cssCodeSplit: false },
});
