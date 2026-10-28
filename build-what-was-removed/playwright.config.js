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
      // The stable symlink, not a pinned build directory. The container image
      // bumps its Chromium periodically (1194 -> 1243 ...), and a pinned path
      // fails every test at launch the first time that happens.
      executablePath: '/opt/pw-browsers/chromium',
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
