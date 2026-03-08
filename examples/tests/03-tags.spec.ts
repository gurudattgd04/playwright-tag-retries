import { test, expect } from '@playwright/test';

/**
 * These tests demonstrate tag-based retry behavior using Playwright's native tag API.
 * - Tests with @flaky or @retry run in project "tagged-retry" (2 retries).
 * - Tests without those tags run in project "default" (0 retries).
 *
 * Run with: npm run example:test
 * Run only tagged: npx playwright test --project=tagged-retry
 * Run only untagged: npx playwright test --project=default
 */

test.describe('Tag examples', () => {
  test('no tag — runs in default project, 0 retries', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Sample');
  });

  test('with @flaky — runs in tagged-retry project, 2 retries', { tag: '@flaky' }, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main p')).toContainText('Playwright');
  });

  test('with @retry — runs in tagged-retry project, 2 retries', { tag: '@retry' }, async ({ page }) => {
    await page.goto('/about.html');
    await expect(page.locator('p')).toContainText('about page');
  });

  test('tagged test inside untagged describe', { tag: '@flaky' }, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#count')).toBeVisible();
  });
});

test.describe('Describe-level tag', { tag: '@flaky' }, () => {
  test('inherits @flaky from describe', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toHaveCount(1);
  });
});
