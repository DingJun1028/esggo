# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> DashboardShell Visual Regression >> metrics card grid snapshot
- Location: tests\vrt\dashboard.spec.ts:17:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3001/dashboard
Call log:
  - navigating to "http://localhost:3001/dashboard", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('DashboardShell Visual Regression', () => {
  4  |   test('full page snapshot', async ({ page }) => {
  5  |     await page.goto('http://localhost:3001/dashboard');
  6  |     await page.waitForSelector('text=全域數據金庫', { timeout: 10000 });
  7  |     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('dashboard-shell-full.png');
  8  |   });
  9  | 
  10 |   test('header component snapshot', async ({ page }) => {
  11 |     await page.goto('http://localhost:3001/dashboard');
  12 |     const header = page.locator('header').first();
  13 |     await header.waitFor({ state: 'visible' });
  14 |     expect(await header.screenshot()).toMatchSnapshot('dashboard-header.png');
  15 |   });
  16 | 
  17 |   test('metrics card grid snapshot', async ({ page }) => {
> 18 |     await page.goto('http://localhost:3001/dashboard');
     |                ^ Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3001/dashboard
  19 |     const grid = page.locator('.grid').first();
  20 |     await grid.waitFor({ state: 'visible' });
  21 |     expect(await grid.screenshot()).toMatchSnapshot('metrics-grid.png');
  22 |   });
  23 | });
  24 | 
```