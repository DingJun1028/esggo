# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: omni-pencil.spec.ts >> OmniPencilCanvas Visual Regression >> layer panel snapshot
- Location: tests\vrt\omni-pencil.spec.ts:18:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/esggo-omnipencil
Call log:
  - navigating to "http://localhost:3001/esggo-omnipencil", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('OmniPencilCanvas Visual Regression', () => {
  4  |   test('canvas viewport snapshot', async ({ page }) => {
  5  |     await page.goto('http://localhost:3001/esggo-omnipencil');
  6  |     await page.waitForSelector('text=5T TRUST COMPLIANCE WORKSPACE', { timeout: 10000 });
  7  |     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('omni-pencil-canvas.png');
  8  |   });
  9  | 
  10 |   test('tool palette snapshot', async ({ page }) => {
  11 |     await page.goto('http://localhost:3001/esggo-omnipencil');
  12 |     await page.waitForSelector('text=5T TRUST COMPLIANCE WORKSPACE', { timeout: 10000 });
  13 |     const palette = page.locator('header').first();
  14 |     await palette.waitFor({ state: 'visible' });
  15 |     expect(await palette.screenshot()).toMatchSnapshot('omni-pencil-tools.png');
  16 |   });
  17 | 
  18 |   test('layer panel snapshot', async ({ page }) => {
> 19 |     await page.goto('http://localhost:3001/esggo-omnipencil');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/esggo-omnipencil
  20 |     await page.waitForSelector('text=5T TRUST COMPLIANCE WORKSPACE', { timeout: 10000 });
  21 |     const layers = page.locator('main').first();
  22 |     await layers.waitFor({ state: 'visible' });
  23 |     expect(await layers.screenshot()).toMatchSnapshot('omni-pencil-layers.png');
  24 |   });
  25 | });
  26 | 
```