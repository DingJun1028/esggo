import { test, expect } from '@playwright/test';

test.describe('OmniMap Visual Regression', () => {
  test('full page snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/map');
    await page.waitForSelector('text=全端全通因果律拓樸圖', { timeout: 10000 });

    // Wait a bit for SVG render & layout stability
    await page.waitForTimeout(1000);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('omnimap-full.png');
  });

  test('map svg topology snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/map');
    await page.waitForSelector('text=全端全通因果律拓樸圖', { timeout: 10000 });

    const svg = page.locator('svg').first();
    await svg.waitFor({ state: 'visible' });
    expect(await svg.screenshot()).toMatchSnapshot('omnimap-svg.png');
  });
});
