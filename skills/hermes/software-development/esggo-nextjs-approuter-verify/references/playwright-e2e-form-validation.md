# Playwright E2E recipe — proving Next.js form-validation UI (Browserbase replacement)

## Why this exists
Browserbase `browser_click` / `browser_press(Enter)` report success but NEVER dispatch React
`onClick`/`onSubmit` on Next.js form buttons (both `type="submit"` and `type="button" onClick`).
`browser_vision` then confidently reports "no banner" — a false negative. Playwright headless
Chromium triggers real clicks and asserts real DOM state. Free OSS, no token.

## One-time setup (per e2e dir, NOT the pnpm monorepo root)
```
mkdir e2e-x && cd e2e-x && npm init -y
npm i -D playwright@latest @playwright/test@latest
npx playwright install chromium   # downloads ~115MB headless shell
```

## playwright.config.mjs
```js
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.', timeout: 30000, retries: 0,
  use: { baseURL: process.env.E2E_BASE || 'http://localhost:3000', headless: true },
  reporter: [['line'], ['json', { outputFile: 'results.json' }]],
});
```

## Spec pattern
```js
import { test, expect } from '@playwright/test';
const BASE = process.env.E2E_BASE || 'http://localhost:3000';
test('submit >500% spike → Dr.Thoth warning banner visible', async ({ page }) => {
  await page.goto(`${BASE}/omni/reports/mod-env-carbon-0001/edit`, { waitUntil: 'networkidle' });
  const n = page.locator('input[type="number"]');
  await n.nth(0).fill('1000'); await n.nth(1).fill('10000'); await n.nth(2).fill('0.495');
  await page.getByRole('button', { name: /提交永恆刻印/ }).click();
  await expect(page.getByText(/【Dr\. Thoth 零幻覺警告】數據未通過果因引擎驗算/)).toBeVisible({ timeout: 3000 });
  await page.screenshot({ path: '../runs/exp-x/banner-proof.png' });
});
```

## Running
```
# terminal 1 (background): npx next dev -p 3000 > devserver.log 2>&1  (confirm 200 in log)
# terminal 2: cd e2e-x && npx playwright test --reporter=line
```

## Gotchas (all hit this session)
1. Install `@playwright/test` (the runner); `playwright` alone → "Cannot find package".
2. `getByLabel(...)` FAILS (no aria-label); use `input[type="number"].nth(k)`.
3. Strict-mode violation if regex matches 2 nodes (banner + field error both contain the phrase);
   anchor to the full distinct banner sentence.
4. MSYS `curl localhost:3000` loop HANGS even when server is up; Playwright connects fine. Trust
   `devserver.log` 200s, not curl "DOWN".
5. Free Windows :3000: cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :3000
   ^| findstr LISTENING') do taskkill /PID %a /F".

## EdgeResearch ledger (runs/exp-<id>/)
- preflight.md — 10-item freeze (hypothesis, one surface, evidence tier, blocking gate, keep/revert)
- post-run.md — close report (what improved, real-world still unverified, deployment-drift check)
- results.tsv — one row: id \t specialist \t mutation \t metric \t pass/fail \t tier \t keep/discard \t date \t note
