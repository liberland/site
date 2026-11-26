const fs = require('fs');
const { defineConfig, devices } = require('@playwright/test');

// Use the preinstalled Chromium when present (cloud sessions), otherwise Playwright's own.
const CHROMIUM = '/opt/pw-browsers/chromium';

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '*.spec.js',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3748/form/',
    trace: 'off',
    acceptDownloads: true,
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
    command: 'node tests/server.js 3748',
    url: 'http://localhost:3748/form/',
    timeout: 15000,
    reuseExistingServer: false,
  },
});
