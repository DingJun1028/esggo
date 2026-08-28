# EdgeResearch applied to UI verification (esggo omni-reports)

Methodology port from Karpathy's autoresearch, applied to UI surfaces.
4 steps: **Freeze → Mutate → Measure → Decide (keep/discard)**.

## Routing for UI work
- Bounded executable or running UI? → `edge-research-code` (needs runtime/browser evidence, not just green tests).
- No measurable incumbent? → `edge-research-harvest` (force a preflight + kill decision).

## exp-k1 (zero-hallucination banner) — worked example
- **Surface**: `DynamicFormEngine.tsx` Seal submit button trigger path.
- **Frozen metric**: submitting `currentYearUsage=10000 / previousYearUsage=1000` (>500% spike) → amber banner containing `【Dr. Thoth 零幻覺警告】數據未通過果因引擎驗算` becomes visible.
- **Mutation**: Seal button changed to `type="button" onClick={handleSubmit}` + `handleSubmit` wrapped in try/catch.
- **Measure (real, not Browserbase)**: Playwright headless Chromium `page.getByRole('button',{name:/提交永恆刻印/}).click()` → `expect(banner).toBeVisible()`. Result: **1 passed (3.4s)**, screenshot captured.
- **Decide: KEEP.** The earlier "banner doesn't appear" was a Browserbase click-dispatch artifact, NOT a code defect. Playwright disproved the false hypothesis.

## Reproduction recipe (per UI surface)
```bash
mkdir e2e-<name> && cd e2e-<name> && npm init -y
npm i -D @playwright/test playwright && npx playwright install chromium
# write <name>.spec.mjs:
#   const BASE = process.env.E2E_BASE || 'http://localhost:3000';
#   test('...', async ({page}) => {
#     await page.goto(`${BASE}/your/route`);
#     await page.getByRole('button',{name:/提交/}).click();
#     await expect(page.getByText(/expected text/)).toBeVisible({timeout:3000});
#   });
npx playwright test --reporter=line
```
Gotchas:
- Inputs in this repo often have no `aria-label`; locate by `getByPlaceholder` / `getByRole('spinbutton')` / `locator('input[type=number]').nth(k)`.
- Strict mode: if >1 element matches a text regex, narrow to the exact banner string.
- Dev server: start with `npx next dev -p 3000` (pnpm install is locked, see SKILL §2). MSYS `curl localhost:3000` may hang on the first call even though the server logs 200 — trust the log, not curl; Playwright's own HTTP client works.
- CI: GitHub runners can't reach `esggo.co` (30s timeout) → keep E2E opt-in (`vars.E2E_ENABLED`).

## Evidence tiers (ascending strength)
static → deterministic (unit) → runtime (Playwright click) → live (deployed) → real-user.
For UI, runtime (Playwright) is the minimum bar to claim "verified"; Browserbase click-with-no-DOM-change is NOT evidence.
