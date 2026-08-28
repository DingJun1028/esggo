# Zenrows Browser SDK — Working Recipe + Zillow Bot-Wall Bypass

Condensed from the 2026-08-16 session (user pasted a real `@zenrows/browser-sdk` script with key; prior `@zenrows/cli` attempts all failed with `file not found`).

## Install (verified)
```bash
npm install @zenrows/browser-sdk playwright   # Node 22.23.2 used; 87 pkgs added clean
```

## Minimal working connector
```js
const { chromium } = require('playwright');
const { ScrapingBrowser } = require('@zenrows/browser-sdk');

const sb = new ScrapingBrowser({ apiKey: process.env.ZENROWS_API_KEY });
const browser = await chromium.connectOverCDP(sb.getConnectURL());
const page = await browser.newPage();
await page.goto('https://www.amazon.es/s?k=iphone+17', { waitUntil: 'domcontentloaded', timeout: 60000 });
console.log(await page.title());                                  // "Amazon.es : iphone 17"
console.log(await page.locator('div.s-result-item[data-asin]').count()); // 55
await browser.close();
```
Result: real Amazon.es search parsed → 55 product cards. ✅

## Zillow bot-wall bypass (the key technique)
- **Homepage `/san-francisco-ca/` → "Press & Hold to confirm you are a human"** (Reference ID wall). `networkidle` wait times out; `domcontentloaded` returns a 9.9KB block page.
- **Bypass**: hit the internal search JSON endpoint instead of the HTML page:
  ```
  https://www.zillow.com/<region>/_api/search?searchQueryState=<urlencoded JSON>
  ```
  where `searchQueryState = {"pagination":{},"usersSearchTerm":"San Francisco, CA","mapBounds":{},"regionSelection":[{"regionId":20330,"regionType":6}]}`
- This endpoint returns the **full 316KB–680KB page** with results embedded as a JSON blob inside a `<script>` tag (not blocked).
- Extract via regex on `page.content()`:
  - zpids: `/"zpid":(\d+)/g`
  - prices: `/"price":\s*"?\$?([\d,]+)"?/g` → strip non-digits → `parseInt`
  - addresses: `/"streetAddress":"([^"]+)"/g`
  - zips: `/"zipcode":"?(\d+)"?/g`
- Sample real output: `66 Buena Vista Ter` (94117) $1,295,000 · `2770 23rd St` (94110) $1,999,999. Price range observed: $998,888–$2,195,000.

## Notes / pitfalls
- `ScrapingBrowser.getConnectURL()` takes **no params** — anti-bot tier is fixed by the apiKey's plan; you can't upgrade bypass level at call time.
- `Object.freeze()` the parsed listings before persisting (5T Trustworthy).
- Free alternatives (Browser Use, Firecrawl) returned `HTTP 402` this session — exhausted quotas. Zenrows SDK (paid) was the only working path.
- Use `process.env.ZENROWS_API_KEY` (injected at runtime), never hardcode the key in source.
