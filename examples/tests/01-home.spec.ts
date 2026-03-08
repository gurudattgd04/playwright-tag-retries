import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Sample App');
  });

  test('loads and shows title (tagged)', { tag: '@flaky' }, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Sample App');
  });

  test('has counter starting at 0', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#count')).toHaveText('0');
  });

  test('increment button increases count', { tag: '@retry' }, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#count')).toHaveText('0');
    await page.locator('#increment').click();
    await expect(page.locator('#count')).toHaveText('1');
    await page.locator('#increment').click();
    await expect(page.locator('#count')).toHaveText('2');
  });

  test('shows list of items', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('#items li');
    await expect(items).toHaveCount(3);
    await expect(items.first()).toHaveText('Item 1');
  });
});
