// Playwright configuration.
// - Local (default): serves the repo with tests/serve.js on port 4173.
// - Published site: set BASE_URL, e.g. BASE_URL=https://emacba86.github.io/JuegoCapaIA/ npx playwright test
// - Browser: Microsoft Edge by default (no download needed on Windows). Set PW_CHANNEL=chromium to use
//   Playwright's bundled Chromium (requires `npx playwright install chromium`).
const { defineConfig, devices } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const channel = process.env.PW_CHANNEL === 'chromium' ? undefined : (process.env.PW_CHANNEL || 'msedge');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL || 'http://127.0.0.1:4173/',
    channel,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 860 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel }, grep: /@mobile/ },
  ],
  webServer: BASE_URL ? undefined : {
    command: 'node tests/serve.js',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: true,
  },
});
