import { test, expect } from '@playwright/test';

test('app launches and renders basic UI', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Electron/);
});
