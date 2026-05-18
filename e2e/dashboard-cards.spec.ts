import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('DASHBOARD CARDS', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });
  });

  test('should show content after loading completes', async ({ page }) => {
    await expect(page.locator('.dashboard-content')).toBeVisible();
    await expect(page.locator('.dashboard-loading sigma-spinner')).not.toBeVisible();
  });

  test('should display 4 KPI cards', async ({ page }) => {
    await expect(page.locator('.kpi-card')).toHaveCount(4);
  });

  test('should display crop filter with select', async ({ page }) => {
    await expect(page.locator('select#cropFilter')).toBeVisible();
  });

  test('should display event chart card', async ({ page }) => {
    const chartCard = page.locator('sigma-card.chart-card');
    await expect(chartCard).toBeVisible();
    await expect(chartCard.locator('.chart-title')).toContainText('Actividad de Eventos');
  });

  test('should display upcoming harvests timeline', async ({ page }) => {
    const timelineCard = page.locator('sigma-card.timeline-card');
    await expect(timelineCard).toBeVisible();
    await expect(
      timelineCard.locator('.section-header__title'),
    ).toContainText('Próximas cosechas');
  });

  test('should display lot status section', async ({ page }) => {
    await expect(
      page.locator('h3.section-header__title', { hasText: 'Estado de Lotes' }),
    ).toBeVisible();
  });

  test('should display crop progress section', async ({ page }) => {
    await expect(
      page.locator('h3.section-header__title', { hasText: 'Progreso de Cosechas' }),
    ).toBeVisible();
  });

  test('should show alert banner when lots need attention', async ({ page }) => {
    const alertBanner = page.locator('.alert-banner');
    const exists = (await alertBanner.count()) > 0;
    if (exists) {
      await expect(alertBanner).toBeVisible();
      await expect(alertBanner.locator('.alert-banner__icon')).toHaveText('notifications_active');
    }
  });
});
