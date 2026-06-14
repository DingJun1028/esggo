import { test, expect } from '@playwright/test';

test.describe('OmniPencilCanvas Visual Regression', () => {
  test('canvas viewport snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/esggo-omnipencil');
    await page.waitForSelector('text=5T TRUST COMPLIANCE WORKSPACE', { timeout: 10000 });
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('omni-pencil-canvas.png');
  });

  test('tool palette snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/esggo-omnipencil');
    const palette = page.locator('header').first();
    await palette.waitFor({ state: 'visible' });
    expect(await palette.screenshot()).toMatchSnapshot('omni-pencil-tools.png');
  });

  test('layer panel snapshot', async ({ page }) => {
    await page.goto('http://localhost:3001/esggo-omnipencil');
    const layers = page.locator('main').first();
    await layers.waitFor({ state: 'visible' });
    expect(await layers.screenshot()).toMatchSnapshot('omni-pencil-layers.png');
  });
});
