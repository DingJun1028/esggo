# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: matrix.spec.ts >> OmniUltimateMatrix Visual Regression >> header component snapshot
- Location: tests\vrt\matrix.spec.ts:14:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3001/dashboard/matrix
Call log:
  - navigating to "http://localhost:3001/dashboard/matrix", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('OmniUltimateMatrix Visual Regression', () => {
  4  |   test('full page snapshot', async ({ page }) => {
  5  |     await page.goto('http://localhost:3001/dashboard/matrix');
  6  |     await page.waitForSelector('text=萬能元件。終極矩陣', { timeout: 10000 });
  7  | 
  8  |     // Matrix uses animations, let's wait a bit for stable state
  9  |     await page.waitForTimeout(1000);
  10 | 
  11 |     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('matrix-full.png');
  12 |   });
  13 | 
  14 |   test('header component snapshot', async ({ page }) => {
> 15 |     await page.goto('http://localhost:3001/dashboard/matrix');
     |                ^ Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3001/dashboard/matrix
  16 |     const header = page.locator('header').first();
  17 |     await header.waitFor({ state: 'visible' });
  18 |     expect(await header.screenshot()).toMatchSnapshot('matrix-header.png');
  19 |   });
  20 | 
  21 |   test('matrix table snapshot', async ({ page }) => {
  22 |     await page.goto('http://localhost:3001/dashboard/matrix');
  23 |     // We target the main matrix component. It should be a div containing the matrix.
  24 |     // The matrix contains cards for "OmniBaseCard" or "DashboardShell"
  25 |     await page.waitForSelector('text=OmniBaseCard', { timeout: 10000 });
  26 | 
  27 |     // We capture the main content wrapper below the header
  28 |     const matrixContent = page.locator('main, .grid, [class*="matrix"]').last();
  29 |     // Use fallback to the main container if a specific selector isn't perfect
  30 |     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('matrix-content.png');
  31 |   });
  32 | });
  33 | 
```