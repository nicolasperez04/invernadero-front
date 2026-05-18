import { Page, request, expect } from '@playwright/test';

export const TEST_USER = {
  email: 'nicolas@gmail.com',
  password: 'nicolas',
};

export async function login(
  page: Page,
  email: string = TEST_USER.email,
  password: string = TEST_USER.password,
): Promise<void> {
  await page.goto('/login');
  await page.locator('sigma-input[name="email"] .sigma-input__el').fill(email);
  await page.locator('sigma-input[name="password"] .sigma-input__el').fill(password);
  await page.click('button[sigma-btn]');
  await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
}

export async function logout(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
  await page.goto('/login');
}

export async function waitForAngular(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

export async function dismissToast(page: Page): Promise<void> {
  const toast = page.locator('.mat-mdc-snack-bar-container, .snack-bar-container');
  if (await toast.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.waitForTimeout(500);
  }
}

export async function seedTestData(token: string, baseApi: string): Promise<void> {
  const ctx = await request.newContext({
    baseURL: baseApi,
    extraHTTPHeaders: { Authorization: `Bearer ${token}` },
  });

  const ts = Date.now();

  const cropResp = await ctx.post('/api/crops', {
    data: {
      name: `E2E Crop ${ts}`,
      description: 'Cultivo de prueba E2E',
      estimatedGrowthDays: 60,
      inactivityDaysThreshold: 10,
      irrigationFrequencyHours: 48,
      recommendedFertilizationDays: 15,
      recommendedPestControlDays: 30,
    },
  });
  const crop = await cropResp.json();

  await ctx.post('/api/lots', {
    data: {
      name: `Lote E2E ${ts}`,
      cropId: crop.id,
      startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
  });
}

export function toErrorName(status: number): string {
  const map: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Server Error',
  };
  return map[status] || `Error ${status}`;
}
