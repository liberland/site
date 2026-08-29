const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 20000,
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
    // No -s: this is a multi-page site, and SPA-rewrite mode would serve
    // index.html for every path.
    command: 'npx --yes serve . -l 3738',
    url: 'http://localhost:3738',
    timeout: 20000,
    reuseExistingServer: false,
  },
});
