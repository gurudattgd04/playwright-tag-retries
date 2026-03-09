import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('can navigate to About and back', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="/about.html"]').click();
    await expect(page).toHaveURL(/\/about(\.html)?$/);
    await expect(page.locator('h1')).toHaveText('About');
    await page.locator('nav a[href="/"]').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('h1')).toHaveText('Sample App');
  });

  test('About page has correct title', { tag: '@flaky' }, async ({ page }) => {
    await page.goto('/about.html');
    await expect(page.locator('h1')).toHaveText('About');
  });
});
