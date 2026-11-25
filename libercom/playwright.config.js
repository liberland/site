const fs = require('fs');
const { defineConfig, devices } = require('@playwright/test');

// Use the preinstalled Chromium when present (cloud sessions), otherwise Playwright's own.
const CHROMIUM = '/opt/pw-browsers/chromium';

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '*.spec.js',
  timeout: 45000,
  use: {
    // The preview path. tests/site.spec.js also checks the domain root ("/").
    baseURL: 'http://localhost:3747/mobile/',
    trace: 'off',
    launchOptions: {
      executablePath: fs.existsSync(CHROMIUM) ? CHROMIUM : undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Behaves like GitHub Pages: /mobile -> /mobile/, real 404s, no SPA fallback.
    command: 'node tests/server.js 3747',
    url: 'http://localhost:3747/mobile/',
    timeout: 15000,
    reuseExistingServer: false,
  },
});
