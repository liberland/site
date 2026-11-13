import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { headTags, validateEvent } from './src/lib/head';
import { LANG, LANG_TAG } from './src/i18n/lang';

/** Injects title, description, social and (when confirmed) Event metadata from src/data/event.ts. */
function eventHead(): Plugin {
  return {
    name: 'event-head',
    transformIndexHtml(html) {
      validateEvent();
      return html.replace('<html lang="en">', `<html lang="${LANG_TAG[LANG]}">`).replace('<!--app-head-->', headTags());
    },
  };
}

/** The Chinese build has no public folder of its own: point its icon links at the root's files. */
function sharedPublicLinks(): Plugin {
  return {
    name: 'shared-public-links',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => (LANG === 'zh' ? html.replace(/href="\/(favicon-32\.png|apple-touch-icon\.png)"/g, `href="${root}$1"`) : html),
    },
  };
}

// The site root: https://liberlandlimited.com/christmas/ by default, BASE_PATH=/ for christmas.ll.land.
const root = process.env.BASE_PATH ?? '/christmas/';

// English is built at the root; Simplified Chinese (VITE_LANG=zh) in <root>zh/. The Chinese build shares
// the root's public files (photos, film, icons) instead of copying them, hence no publicDir there.
export default defineConfig({
  base: LANG === 'zh' ? `${root}zh/` : root,
  publicDir: LANG === 'zh' ? false : 'public',
  define: { 'import.meta.env.VITE_PUBLIC_BASE': JSON.stringify(root) },
  // The Chinese serif (Noto Serif SC) is part of the Chinese build only.
  resolve: {
    alias: {
      'zh-display-font': fileURLToPath(new URL(LANG === 'zh' ? './src/styles/noto-serif-sc.css' : './src/styles/no-zh-font.css', import.meta.url)),
    },
  },
  plugins: [react(), eventHead(), sharedPublicLinks()],
  build: { target: 'es2020', cssCodeSplit: false },
});
