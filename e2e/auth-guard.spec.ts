import { test, expect } from '@playwright/test';

test.describe('AUTH GUARD', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.context().clearCookies();
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should redirect to login when accessing crops without auth', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.context().clearCookies();
    await page.goto('/crops');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should redirect to login when accessing lots without auth', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.context().clearCookies();
    await page.goto('/lots');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should redirect to login when accessing events without auth', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.context().clearCookies();
    await page.goto('/events');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
