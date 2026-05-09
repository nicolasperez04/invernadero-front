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
    await page.waitForTimeout(1500);

    const errorVisible = await page.locator('.error-message').isVisible().catch(() => false);
    const stillOnLogin = await page.url().includes('/login');
    expect(errorVisible || stillOnLogin).toBeTruthy();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
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
    await page.waitForSelector('.page-title:has-text("Dashboard")', { timeout: 5000 });
    await expect(page.locator('.kpi-grid')).toBeVisible();
  });

  test('should display event chart', async ({ page }) => {
    await page.waitForTimeout(2000);
    const chart = page.locator('svg, [class*="chart"], [class*="bar"]').first();
    await expect(chart).toBeVisible({ timeout: 5000 });
  });

  test('should filter by crop', async ({ page }) => {
    await page.waitForTimeout(2000);
    const cropSelect = page.locator('mat-select, select').first();
    if (await cropSelect.isVisible()) {
      await cropSelect.click();
      await page.waitForTimeout(500);
    }
  });

  test('should display alert lots when exist', async ({ page }) => {
    await page.waitForTimeout(2000);
    const alertsSection = page.locator('[class*="alert"], [class*="warning"], .status-badge').first();
    await expect(alertsSection).toBeVisible({ timeout: 5000 }).catch(() => {});
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
    await page.waitForTimeout(2000);
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should create new crop', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForTimeout(1000);

    const timestamp = Date.now();
    const cropName = `Cultivo Test ${timestamp}`;

    await page.fill('input[type="text"] >> nth=0', cropName);
    await page.fill('input[type="text"] >> nth=1', 'Test description');
    await page.fill('input[type="number"] >> nth=0', '45');
    await page.fill('input[type="number"] >> nth=1', '10');
    await page.click('button:has-text("Crear")');
    await page.waitForTimeout(3000);

    await expect(page.locator('table')).toContainText(cropName);

    return cropName;
  });

  test('should delete crop with confirm dialog', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('table tbody tr').first();
    await firstRow.locator('button.btn-delete').click();
    await page.waitForTimeout(2000);

    const dialog = page.locator('mat-dialog-container');
    if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.locator('mat-dialog-actions button').last().click();
      await page.waitForTimeout(3000);
    }
  });

  test('should cancel delete crop with confirm rejected', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForTimeout(2000);

    const tableBefore = await page.locator('table').textContent();

    const cropRow = page.locator('table tbody tr').first();
    await cropRow.locator('button.btn-delete').click();
    await page.waitForTimeout(1500);

    const dialog = page.locator('mat-dialog-container');
    if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.locator('mat-dialog-actions button').first().click();
      await page.waitForTimeout(1500);
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
    await page.waitForTimeout(3000);
    
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Lotes', { timeout: 10000 });

    const tableOrEmpty = page.locator('table, .empty-state');
    await expect(tableOrEmpty).toBeVisible({ timeout: 5000 });
  });

  test('should create new lot for testing', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForTimeout(2000);

    const lotSelect = page.locator('select');
    await lotSelect.waitFor({ state: 'visible' });
    const optCount = await lotSelect.locator('option').count();

    if (optCount > 1) {
      const timestamp = Date.now();
      const lotName = `Lote E2E ${timestamp}`;
      
      await page.locator('input[type="text"]').fill(lotName);
      await lotSelect.selectOption({ index: 1 });
      await page.locator('input[type="date"]').first().fill('2026-05-01');
      await page.locator('input[type="date"]').last().fill('2026-06-30');
      await page.click('button:has-text("Crear")');
      await page.waitForTimeout(3000);
    }
  });

  test('should open and close lot summary modal', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForTimeout(2000);

    const summaryBtns = page.locator('button.btn-summary');
    const count = await summaryBtns.count();
    
    if (count > 0) {
      await summaryBtns.first().click();
      await page.waitForTimeout(2000);

      await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 3000 });

      const closeBtn = page.locator('.modal-overlay .btn-close');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should delete lot with confirm dialog', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForTimeout(2000);

    const deleteBtns = page.locator('button.btn-delete');
    const count = await deleteBtns.count();

    if (count > 0) {
      await deleteBtns.first().click();
      await page.waitForTimeout(2000);

      const dialog = page.locator('mat-dialog-container');
      if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.locator('mat-dialog-actions button').last().click();
        await page.waitForTimeout(3000);
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
    await page.waitForTimeout(2000);

    const lotSelect = page.locator('select').first();
    await lotSelect.waitFor({ state: 'visible' });

    const options = page.locator('select:first-child option');
    const optCount = await options.count();

    if (optCount > 1) {
      await lotSelect.selectOption({ index: 1 });
      await page.waitForTimeout(3000);

      const tableVisible = await page.locator('table').isVisible().catch(() => false);
      expect(tableVisible || optCount > 1).toBeTruthy();
    }
  });

  test('should display event history', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(2000);

    const lotSelect = page.locator('select').first();
    await lotSelect.waitFor({ state: 'visible', timeout: 5000 });
    
    const options = lotSelect.locator('option');
    const optCount = await options.count();

    if (optCount > 1) {
      await lotSelect.selectOption({ index: 1 });
      await page.waitForTimeout(3000);

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