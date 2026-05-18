import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('ERROR STATES', () => {
  test('should redirect to login when token is removed on protected route', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/crops');
    await page.waitForTimeout(2000);

    expect(page.url()).toContain('/login');
  });

  test('should show error snackbar when crop creation fails', async ({ page }) => {
    await login(page);
    await page.goto('/crops');
    await page.waitForSelector('sigma-table', { timeout: 10000 });

    await page.route('**/api/crops', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Server error' }),
        });
      } else {
        await route.continue();
      }
    });

    const inputs = page.locator('sigma-input .sigma-input__el');
    await inputs.nth(0).fill('E2E Error Crop');
    await inputs.nth(2).fill('60');
    await inputs.nth(3).fill('10');

    const submitBtn = page.locator('sigma-card').first().locator('button[sigma-btn]').last();
    await submitBtn.click();

    await page.waitForTimeout(1500);

    const snackbar = page.locator(
      '.mat-mdc-snack-bar-container, snack-bar-container, .cdk-overlay-container .mat-mdc-snack-bar-container',
    );
    const hasSnackbar = (await snackbar.count()) > 0;
    expect(hasSnackbar).toBeTruthy();
  });
});
