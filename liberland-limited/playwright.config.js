const fs = require('fs');
const { defineConfig, devices } = require('@playwright/test');

// Use the preinstalled Chromium when present (cloud sessions), otherwise Playwright's own.
const CHROMIUM = '/opt/pw-browsers/chromium';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 20000,
  use: {
    baseURL: 'http://localhost:3737',
    launchOptions: {
      executablePath: fs.existsSync(CHROMIUM) ? CHROMIUM : undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // No -s: /privacy/ and /terms/ are real pages, and SPA-rewrite mode would serve
    // index.html for every path and hide a missing page.
    command: 'npx --yes serve . -l 3737',
    url: 'http://localhost:3737',
    timeout: 20000,
    reuseExistingServer: false,
  },
});
