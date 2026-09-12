const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '*.spec.js',
  // Generous timeout: this sandbox's egress proxy is slow to fail the
  // render-blocking Google Fonts request (~13-16s) before Babel's
  // in-browser transform of the JSX scripts can proceed.
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3738',
    launchOptions: {
      executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npx --yes serve . -l 3738 -s',
    url: 'http://localhost:3738',
    timeout: 15000,
    reuseExistingServer: false,
  },
});
