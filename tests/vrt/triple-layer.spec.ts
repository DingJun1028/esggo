import { test, expect } from '@playwright/test';

test.describe('Triple Layer Ascension Visual Regression', () => {
  test('full page snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/test-triple');
    await page.waitForSelector('text=Triple Layer Ascension Validation', { timeout: 10000 });
    // Wait for the components to load
    await page.waitForTimeout(1000);
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('triple-layer-full.png');
  });

  test('Alliance Hub component snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/test-triple');
    const allianceHub = page.locator('section').filter({ hasText: 'Alliance Hub' });
    await allianceHub.waitFor({ state: 'visible' });
    expect(await allianceHub.screenshot()).toMatchSnapshot('alliance-hub.png');
  });
});
