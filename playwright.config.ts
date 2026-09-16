import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const isCI = !!process.env.CI;
const BASE_URL = process.env.BASE_URL || 'https://mb.io';

/**
 * Config decisions (documented for review, not just defaults):
 * - fullyParallel: true -> each spec file gets its own worker; critical for
 *   keeping a growing regression suite fast as flows are added.
 * - retries on CI only: local failures should surface immediately during
 *   dev; CI retries absorb network/environment flakiness without masking
 *   real bugs (a test that fails twice on CI still fails the build).
 * - trace/video/screenshot 'on-first-retry': avoids bloating CI artifacts
 *   on green runs, but guarantees a debuggable trace the moment something
 *   goes red.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,

  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }], // GitLab test report integration
    ['list'],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],

  outputDir: 'reports/test-results',
});
