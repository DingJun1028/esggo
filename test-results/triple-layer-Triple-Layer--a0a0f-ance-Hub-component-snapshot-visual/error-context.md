# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: triple-layer.spec.ts >> Triple Layer Ascension Visual Regression >> Alliance Hub component snapshot
- Location: tests\vrt\triple-layer.spec.ts:12:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('section').filter({ hasText: 'Alliance Hub' }) to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "Login to Omni System" [level=1] [ref=e4]
    - generic [ref=e5]:
      - img [ref=e7] [cursor=pointer]
      - heading "ESGGO 善向永續" [level=2] [ref=e16]
      - paragraph [ref=e17]: 5T Trust Protocol Enforcer
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]:
          - img [ref=e21]
          - textbox "識別位址 (Email)" [ref=e24]
        - generic [ref=e25]:
          - img [ref=e26]
          - textbox "存取金鑰 (Password)" [ref=e29]
      - button "Secure Login" [ref=e30]:
        - img [ref=e31]
        - text: Secure Login
      - generic [ref=e36]: 或
      - button "開發者專用通道" [ref=e38]
    - paragraph [ref=e39]: Secured by Zero Knowledge Proof & 5T Protocol
  - button "開啟除錯面板" [ref=e40]:
    - img [ref=e41]
  - button "Open Next.js Dev Tools" [ref=e55] [cursor=pointer]:
    - img [ref=e56]
  - alert [ref=e59]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Triple Layer Ascension Visual Regression', () => {
  4  |   test('full page snapshot', async ({ page }) => {
  5  |     await page.goto('http://localhost:3001/test-triple-v2');
  6  |     await page.waitForSelector('text=Triple Layer Ascension Validation', { timeout: 10000 });
  7  |     // Wait for the components to load
  8  |     await page.waitForTimeout(1000);
  9  |     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('triple-layer-full.png');
  10 |   });
  11 | 
  12 |   test('Alliance Hub component snapshot', async ({ page }) => {
  13 |     await page.goto('http://localhost:3001/test-triple-v2');
  14 |     const allianceHub = page.locator('section').filter({ hasText: 'Alliance Hub' });
> 15 |     await allianceHub.waitFor({ state: 'visible' });
     |                       ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  16 |     expect(await allianceHub.screenshot()).toMatchSnapshot('alliance-hub.png');
  17 |   });
  18 | });
  19 | 
```