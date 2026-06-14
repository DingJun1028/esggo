import { test, expect } from '@playwright/test';

test.describe('OmniUltimateMatrix Visual Regression', () => {
  test('full page snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard/matrix');
    await page.waitForSelector('text=萬能元件。終極矩陣', { timeout: 10000 });

    // Matrix uses animations, let's wait a bit for stable state
    await page.waitForTimeout(1000);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('matrix-full.png');
  });

  test('header component snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard/matrix');
    const header = page.locator('header').first();
    await header.waitFor({ state: 'visible' });
    expect(await header.screenshot()).toMatchSnapshot('matrix-header.png');
  });

  test('matrix table snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard/matrix');
    // We target the main matrix component. It should be a div containing the matrix.
    // The matrix contains cards for "OmniBaseCard" or "DashboardShell"
    await page.waitForSelector('text=OmniBaseCard', { timeout: 10000 });

    // We capture the main content wrapper below the header
    const matrixContent = page.locator('main, .grid, [class*="matrix"]').last();
    // Use fallback to the main container if a specific selector isn't perfect
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('matrix-content.png');
  });
});
