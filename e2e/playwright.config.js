import { defineConfig, devices } from '@playwright/test';

/**
 * The server is started by hand (or by verify-clone.sh) rather than by
 * webServer here: it runs on Node 12, and Playwright runs on Node 24, so
 * letting Playwright spawn it would inherit the wrong runtime.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [['list']],
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
