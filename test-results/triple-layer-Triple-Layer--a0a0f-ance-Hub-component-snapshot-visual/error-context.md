# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: triple-layer.spec.ts >> Triple Layer Ascension Visual Regression >> Alliance Hub component snapshot
- Location: tests\vrt\triple-layer.spec.ts:12:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/test-triple-v2", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Triple Layer Ascension Visual Regression', () => {
  4  |   test('full page snapshot', async ({ page }) => {
  5  |     await page.goto('/test-triple-v2');
  6  |     await page.waitForSelector('text=Triple Layer Ascension Validation', { timeout: 10000 });
  7  |     // Wait for the components to load
  8  |     await page.waitForTimeout(1000);
  9  |     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('triple-layer-full.png');
  10 |   });
  11 | 
  12 |   test('Alliance Hub component snapshot', async ({ page }) => {
> 13 |     await page.goto('/test-triple-v2');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  14 |     const allianceHub = page.locator('section').filter({ hasText: 'Alliance Hub' });
  15 |     await allianceHub.waitFor({ state: 'visible' });
  16 |     expect(await allianceHub.screenshot()).toMatchSnapshot('alliance-hub.png');
  17 |   });
  18 | });
```