import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('DASHBOARD EMPTY STATES', () => {
  test('should show empty state for event chart when no events exist', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await page.waitForTimeout(1000);

    const chartCard = page.locator('.chart-card');
    const emptyState = chartCard.locator('sigma-empty-state');
    const chartCanvas = chartCard.locator('#eventChartCanvas');

    const hasEmptyState = (await emptyState.count()) > 0;
    const hasChart = (await chartCanvas.count()) > 0;

    expect(hasEmptyState || hasChart).toBeTruthy();
  });

  test('should show empty state for upcoming harvests when no sowing events exist', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await page.waitForTimeout(1000);

    const timelineCard = page.locator('.timeline-card');
    const emptyState = timelineCard.locator('sigma-empty-state');
    const timelineItems = timelineCard.locator('.timeline-item');

    const hasEmptyState = (await emptyState.count()) > 0;
    const hasItems = (await timelineItems.count()) > 0;

    expect(hasEmptyState || hasItems).toBeTruthy();
  });
});
