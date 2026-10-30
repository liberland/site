import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { headTags, validateEvent } from './src/lib/head';

/** Injects title, description, social and (when confirmed) Event metadata from src/data/event.ts. */
function eventHead(): Plugin {
  return {
    name: 'event-head',
    transformIndexHtml(html) {
      validateEvent();
      return html.replace('<!--app-head-->', headTags());
    },
  };
}

// Served at https://liberlandlimited.com/christmas/ — override with BASE_PATH=/ for a root deploy.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/christmas/',
  plugins: [react(), eventHead()],
  build: { target: 'es2020', cssCodeSplit: false },
});
