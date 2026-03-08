import { test, expect } from '@playwright/test';

/**
 * Demonstrates that tagged tests run in the retry project.
 *
 * By default these tests pass on first run so the example suite stays green.
 * To see retries in action: set DEMO_FLAKY=1 and run:
 *   DEMO_FLAKY=1 npx playwright test -c examples/playwright.config.ts 04-retry-demo
 *
 * Run only this file: npx playwright test -c examples/playwright.config.ts 04-retry-demo
 */

const simulateFlaky = !!process.env.DEMO_FLAKY;

test.describe('Retry behavior demo', () => {
  test('fails once then passes on retry', { tag: '@flaky' }, async ({ page }, testInfo) => {
    await page.goto('/');
    if (simulateFlaky && testInfo.retry < 1) {
      throw new Error('Simulated flaky failure — will pass on retry (retry count: ' + testInfo.retry + ')');
    }
    await expect(page.locator('h1')).toHaveText('Sample App');
  });

  test('fails twice then passes on second retry', { tag: '@retry' }, async ({ page }, testInfo) => {
    await page.goto('/');
    if (simulateFlaky && testInfo.retry < 2) {
      throw new Error(
        'Simulated flaky failure (attempt ' + (testInfo.retry + 1) + '/3) — passes on 3rd run'
      );
    }
    await expect(page.locator('h1')).toHaveText('Sample App');
  });
});
