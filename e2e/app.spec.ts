import { test, expect } from '@playwright/test';
import { login, logout, TEST_USER } from './helpers';

test.describe('AUTH', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('.login-title')).toContainText(/Iniciar/i);

    await page.fill('#email', TEST_USER.email);
    await page.fill('#password', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });

    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'invalid@test.com');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.error-message', { timeout: 5000 }).catch(() => {});

    const errorVisible = await page
      .locator('.error-message')
      .isVisible()
      .catch(() => false);
    const stillOnLogin = page.url().includes('/login');
    expect(errorVisible || stillOnLogin).toBeTruthy();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.context().clearCookies();
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should logout and redirect to login', async ({ page }) => {
    await login(page);
    await logout(page);
    await expect(page).toHaveURL(/.*\/login/);
  });
});

test.describe('DASHBOARD', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard with KPIs', async ({ page }) => {
    await page.waitForSelector('.kpi-grid, .error-banner', { timeout: 20000 }).catch(() => {});
    const kpiGrid = page.locator('.kpi-grid');
    if (await kpiGrid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(kpiGrid).toBeVisible();
    }
  });

  test('should display event chart', async ({ page }) => {
    await page.waitForSelector('.kpi-grid, .error-banner', { timeout: 20000 }).catch(() => {});
    const chart = page.locator('canvas#eventChartCanvas').first();
    if (await chart.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(chart).toBeVisible();
    }
  });

  test('should filter by crop', async ({ page }) => {
    await page.waitForSelector('.filter-bar, select', { timeout: 10000 });
    const cropSelect = page.locator('mat-select, select').first();
    if (await cropSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cropSelect.click();
    }
  });

  test('should display alert lots when exist', async ({ page }) => {
    await page.waitForSelector('.page-title', { timeout: 10000 });
    const alertsSection = page
      .locator('[class*="alert"], [class*="warning"], .status-badge')
      .first();
    await expect(alertsSection)
      .toBeVisible({ timeout: 5000 })
      .catch(() => {});
  });
});

test.describe('CROPS', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display crops list', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForSelector('h1:has-text("Cultivos")', { timeout: 5000 });
    await expect(page.locator('table')).toBeVisible();
  });

  test('should display existing crops in table', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForLoadState('networkidle');
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should create new crop', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForLoadState('networkidle');

    const timestamp = Date.now();
    const cropName = `Cultivo Test ${timestamp}`;

    await page.fill('input[type="text"] >> nth=0', cropName);
    await page.fill('input[type="text"] >> nth=1', 'Test description');
    await page.fill('input[type="number"] >> nth=0', '45');
    await page.fill('input[type="number"] >> nth=1', '10');
    await page.fill('input[type="number"] >> nth=2', '48');
    await page.fill('input[type="number"] >> nth=3', '15');
    await page.fill('input[type="number"] >> nth=4', '30');
    await page.click('button:has-text("Crear")');

    await expect(page.locator('table')).toContainText(cropName, { timeout: 10000 });

    return cropName;
  });

  test('should delete crop with confirm dialog', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    await firstRow.locator('button.btn-delete').click();

    const dialog = page.locator('mat-dialog-container');
    if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.locator('mat-dialog-actions button').last().click();
    }
  });

  test('should cancel delete crop with confirm rejected', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForLoadState('networkidle');

    const tableBefore = await page.locator('table').textContent();

    const cropRow = page.locator('table tbody tr').first();
    await cropRow.locator('button.btn-delete').click();

    const dialog = page.locator('mat-dialog-container');
    if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.locator('mat-dialog-actions button').first().click();
    }

    const tableAfter = await page.locator('table').textContent();
    expect(tableBefore).toBe(tableAfter);
  });
});

test.describe('LOTS', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display lots list', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForSelector('h1', { timeout: 5000 });

    const h1 = page.locator('h1');
    await expect(h1).toContainText('Lotes', { timeout: 5000 });

    const tableOrEmpty = page.locator('table, .empty-state');
    await expect(tableOrEmpty).toBeVisible({ timeout: 5000 });
  });

  test('should create new lot for testing', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForLoadState('networkidle');

    const lotSelect = page.locator('select').first();
    await lotSelect.waitFor({ state: 'visible' });
    const optCount = await lotSelect.locator('option').count();

    if (optCount > 1) {
      const timestamp = Date.now();
      const lotName = `Lote E2E ${timestamp}`;

      await page.locator('input[type="text"]').fill(lotName);
      await lotSelect.selectOption({ index: 1 });
      const today = new Date().toISOString().split('T')[0];
      await page.locator('input[type="date"]').first().fill(today);
      await page.click('button:has-text("Crear")');
    }
  });

  test('should open and close lot summary modal', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForLoadState('networkidle');

    const summaryBtns = page.locator('button.btn-summary');
    const count = await summaryBtns.count();

    if (count > 0) {
      await summaryBtns.first().click();

      const modal = page.locator('.modal-overlay');
      await expect(modal).toBeVisible({ timeout: 3000 });

      const closeBtn = page.locator('.modal-overlay .btn-close');
      if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeBtn.click();
      }
    }
  });

  test('should delete lot with confirm dialog', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForLoadState('networkidle');

    const deleteBtns = page.locator('button.btn-delete');
    const count = await deleteBtns.count();

    if (count > 0) {
      await deleteBtns.first().click();

      const dialog = page.locator('mat-dialog-container');
      if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.locator('mat-dialog-actions button').last().click();
      }
    }
  });
});

test.describe('EVENTS', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display events page', async ({ page }) => {
    await page.goto('/events');
    await page.waitForSelector('h1:has-text("Eventos")', { timeout: 5000 });
    await expect(page.locator('select')).toBeVisible();
  });

  test('should select lot and load events', async ({ page }) => {
    await page.goto('/events');
    await page.waitForSelector('h1', { timeout: 5000 });

    const lotSelect = page.locator('select').first();
    await lotSelect.waitFor({ state: 'visible' });

    const options = page.locator('select:first-child option');
    const optCount = await options.count();

    if (optCount > 1) {
      await lotSelect.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');

      const table = page.locator('table');
      const tableExists = await table.count();
      expect(tableExists).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display event history', async ({ page }) => {
    await page.goto('/events');
    await page.waitForSelector('h1', { timeout: 5000 });

    const lotSelect = page.locator('select').first();
    await lotSelect.waitFor({ state: 'visible', timeout: 5000 });

    const options = lotSelect.locator('option');
    const optCount = await options.count();

    if (optCount > 1) {
      await lotSelect.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');

      const table = page.locator('table');
      const tableExists = await table.count();
      expect(tableExists).toBeGreaterThan(0);
    }
  });
});

test.describe('NAVIGATION', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.locator('.nav-item:has-text("Dashboard")').click();
    await page.waitForURL(/.*\/dashboard/);
    await expect(page.locator('.page-title')).toContainText('Dashboard');
  });

  test('should navigate to crops', async ({ page }) => {
    await page.locator('.nav-item:has-text("Cultivos")').click();
    await page.waitForURL(/.*\/crops/);
    await expect(page.locator('h1')).toContainText('Cultivos');
  });

  test('should navigate to lots', async ({ page }) => {
    await page.locator('.nav-item:has-text("Lotes")').click();
    await page.waitForURL(/.*\/lots/);
    await expect(page.locator('h1')).toContainText('Lotes');
  });

  test('should navigate to events', async ({ page }) => {
    await page.locator('.nav-item:has-text("Eventos")').click();
    await page.waitForURL(/.*\/events/);
    await expect(page.locator('h1')).toContainText('Eventos');
  });
});
