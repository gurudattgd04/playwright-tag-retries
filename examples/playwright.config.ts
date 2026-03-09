/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import { tagRetryProjects } from '../dist';

/**
 * Example config: tag-based retries.
 * - Tests with @flaky or @retry in the title run with 2 retries (project: tagged-retry).
 * - All other tests run with 0 retries (project: default).
 */
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3123'
  }
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 3, // overridden per project below
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3123',
    trace: 'on-first-retry',
  },
  projects: [
    ...tagRetryProjects({
      tags: ['@flaky', '@retry'],
      retries: 2,
      retryProjectName: 'tagged-retry',
      defaultProjectName: 'default',
      use: { ...devices['Desktop Chrome'] },
    }),
  ],
  webServer: {
    command: 'npx serve sample-app/public -p 3123',
    url: 'http://localhost:3123',
    reuseExistingServer: !process.env.CI,
    cwd: __dirname,
  },
});
