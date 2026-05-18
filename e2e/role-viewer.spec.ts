import { test, expect } from '@playwright/test';

const BACKEND = 'http://localhost:8080';

test.describe('ROLE VIEWER — Access Restrictions', () => {
  let viewerToken: string;

  test.beforeAll(async ({ request }) => {
    const adminResp = await request.post(`${BACKEND}/api/auth/login`, {
      data: { email: 'nicolas@gmail.com', password: 'nicolas' },
    });
    const adminToken = (await adminResp.json()).token;
    const ts = Date.now();
    const viewerEmail = `viewer_e2e_${ts}@test.com`;

    await request.post(`${BACKEND}/api/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        name: 'Viewer',
        lastName: 'E2E',
        email: viewerEmail,
        password: 'viewer123',
        role: 'VIEWER',
      },
    });

    const viewerResp = await request.post(`${BACKEND}/api/auth/login`, {
      data: { email: viewerEmail, password: 'viewer123' },
    });
    viewerToken = (await viewerResp.json()).token;
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('token', token);
      localStorage.setItem('lang', 'es');
    }, viewerToken);
  });

  test('should not show Crops and Lots nav items in sidebar for VIEWER', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    const navLabels = page.locator('.sidebar-nav .nav-item .nav-label');
    const labelTexts = await navLabels.allTextContents();
    expect(labelTexts).not.toContain('Cultivos');
    expect(labelTexts).not.toContain('Lotes');
    expect(labelTexts.length).toBe(2);
  });

  test('should redirect VIEWER from /crops to /dashboard', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/dashboard');
  });

  test('should allow VIEWER to access /events page', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(2000);
    await expect(page.locator('sigma-card').first()).toBeVisible({ timeout: 5000 });
  });
});
