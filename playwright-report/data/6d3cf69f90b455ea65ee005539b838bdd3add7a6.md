# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: map.spec.ts >> OmniMap Visual Regression >> full page snapshot
- Location: tests\vrt\map.spec.ts:4:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3001/map
Call log:
  - navigating to "http://localhost:3001/map", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('OmniMap Visual Regression', () => {
  4  |   test('full page snapshot', async ({ page }) => {
> 5  |     await page.goto('http://localhost:3001/map');
     |                ^ Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3001/map
  6  |     await page.waitForSelector('text=全端全通因果律拓樸圖', { timeout: 10000 });
  7  | 
  8  |     // Wait a bit for SVG render & layout stability
  9  |     await page.waitForTimeout(1000);
  10 | 
  11 |     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('omnimap-full.png');
  12 |   });
  13 | 
  14 |   test('map svg topology snapshot', async ({ page }) => {
  15 |     await page.goto('http://localhost:3001/map');
  16 |     await page.waitForSelector('text=全端全通因果律拓樸圖', { timeout: 10000 });
  17 | 
  18 |     const svg = page.locator('svg').first();
  19 |     await svg.waitFor({ state: 'visible' });
  20 |     expect(await svg.screenshot()).toMatchSnapshot('omnimap-svg.png');
  21 |   });
  22 | });
  23 | 
```