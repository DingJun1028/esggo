# Browser E2E Verification — Browserbase limitation & Playwright bypass

Verified 2026-08-11 during OMNI ESG Reports Center work (esggo monorepo, Next.js 16 / React 19).

## Critical finding: Browserbase click does NOT trigger React form events
- `browser_click` on a `<button type="submit">` or `<button type="button" onClick>` inside a Next.js client component reported `success` but the page state NEVER changed (no banner, no state update). Same for `browser_press` Enter.
- `browser_type` works (fills inputs), `browser_snapshot` works (reads DOM), but **event dispatch to React's root listener fails** for some buttons (the 428 floating button's onClick DID work, but the Seal submit button's did not — inconsistent, tool-internal).
- Conclusion: **Browserbase automated click is unreliable for verifying React form-submit / certain button onClick.** Do NOT trust "no banner appeared" from Browserbase as proof of a code bug.

## Fix: Playwright headless Chromium (free OSS, works on this Windows/MSYS box)
- Install: `npm i -D @playwright/test && npx playwright install chromium` (downloads ~114 MB chromium-headless-shell).
- Write a spec that does a REAL click and asserts the DOM:
  ```ts
  test('K1 零幻覺警告', async ({ page }) => {
    await page.goto(`${BASE}/omni/reports/mod-env-carbon-0001/edit`, { waitUntil: 'networkidle' });
    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill('1000'); await inputs.nth(1).fill('10000'); await inputs.nth(2).fill('0.495');
    await page.getByRole('button', { name: /提交永恆刻印/ }).click();
    await expect(page.getByText(/【Dr\. Thoth 零幻覺警告】數據未通過果因引擎驗算/)).toBeVisible({ timeout: 3000 });
  });
  ```
- Run: `npx playwright test` (needs `next dev -p 3000` running; curl loop to localhost:3000 may hang on MSYS but Playwright's own client connects fine).
- Result: **1 passed** — proves the banner DOES render. The earlier "Browserbase看不到" was a tool artifact, not a bug.

## Next.js server-route env gotcha
- `process.env.X` in a Next.js Route Handler does NOT inherit shell `X=val npx next dev` form. It reads `.env.local` (gitignored) or `next.config`.
- For local Ollama LLM wiring (`/api/agentic-twin`), put `AGENTIC_TWIN_OLLAMA_URL=http://localhost:11434` + `AGENTIC_TWIN_OLLAMA_MODEL=qwen2.5:3b-instruct-q4_K_M` in `.env.local`, then restart dev server. Verified `llmEnhanced:true` (real LLM insight returned).

## EdgeResearch framing (used for K1)
- Freeze metric → one mutation → measure (real browser) → keep/revert.
- For subjective/UI features, the evidence tier must be runtime/live (Playwright), NOT just green unit tests.
- CI: add a `playwright` job (needs chromium + a running preview/dev server) as a permanent regression gate.
