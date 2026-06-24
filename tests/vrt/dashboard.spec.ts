import { test, expect } from '@playwright/test';

test.describe('DashboardShell Visual Regression', () => {
  test('full page snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForSelector('text=全域數據金庫', { timeout: 10000 });
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('dashboard-shell-full.png');
  });

  test('header component snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard');
    const header = page.locator('header').first();
    await header.waitFor({ state: 'visible' });
    expect(await header.screenshot()).toMatchSnapshot('dashboard-header.png');
  });

  test('metrics card grid snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard');
    const grid = page.locator('.grid').first();
    await grid.waitFor({ state: 'visible' });
    expect(await grid.screenshot()).toMatchSnapshot('metrics-grid.png');
  });
});
