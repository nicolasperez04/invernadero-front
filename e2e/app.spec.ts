import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('FILTER BY CROP', () => {
  test('should filter dashboard by crop', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    const cropSelect = page.locator('select#cropFilter');
    await expect(cropSelect).toBeVisible({ timeout: 5000 });
    const options = await cropSelect.locator('option').allTextContents();
    expect(options.length).toBeGreaterThanOrEqual(1);
  });
});

test.describe('CROP DELETE', () => {
  test('should delete crop with confirm dialog', async ({ page }) => {
    await login(page);
    await page.goto('/crops');
    await page.waitForSelector('sigma-table', { timeout: 10000 });

    const firstRow = page.locator('sigma-table tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 5000 });
    const rowBefore = await firstRow.textContent();

    await firstRow.locator('button[title="Eliminar"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('.cdk-overlay-container h2')).toBeVisible({ timeout: 5000 });
    await page.locator('.cdk-overlay-container button', { hasText: 'Sí' }).click();
    await page.waitForTimeout(1000);

    const firstRowNow = page.locator('sigma-table tbody tr').first();
    const rowAfter = await firstRowNow.textContent();
    expect(rowAfter).not.toBe(rowBefore);
  });

  test('should cancel delete crop with confirm rejected', async ({ page }) => {
    await login(page);
    await page.goto('/crops');
    await page.waitForSelector('sigma-table', { timeout: 10000 });

    const firstRow = page.locator('sigma-table tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 5000 });
    const rowContent = await firstRow.textContent();

    await firstRow.locator('button[title="Eliminar"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('.cdk-overlay-container h2')).toBeVisible({ timeout: 5000 });
    await page.locator('.cdk-overlay-container button', { hasText: 'No' }).click();
    await page.waitForTimeout(500);

    await expect(page.locator('sigma-table tbody tr').first()).toBeVisible();
    expect(await page.locator('sigma-table tbody tr').first().textContent()).toBe(rowContent);
  });
});
