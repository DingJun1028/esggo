---
name: esggo-nextjs-approuter-verify
description: Verify esggo Next.js UI; dodge Browserbase submit click bug.
---

# ESG-GO Next.js App Router — Build & Verify

## When to use
Adding or extending a Next.js feature in `DingJun1028/esggo`: a route under `app/`, a
client component under `src/components/`, a Server Action, or a `DynamicFormEngine`-style
form with client-side Zod validation. The repo is a **pnpm monorepo + Next.js 16** with:
- root `app/` = App Router routes (NOT `src/app/`)
- `src/` shared code, `@/*` → `src/*` (tsconfig paths)
- React 19, framer-motion 12, lucide-react, zod 3.25, tailwind via postcss
- `app/globals.css` uses light/dark CSS vars; dark theme = deep-space look

## Repo mapping (fictional spec → real path)
Specs often ship fictional paths (`@file:/core/...`, `@file:/components/omni/...`). REMAP:
- core logic / validation / registry → `src/lib/<feature>/`
- UI components → `src/components/<feature>/`
- routes → `app/<feature>/` (or merge into existing hub like `app/omni-center`)
NEVER paste example code with unresolvable imports — explore the real tree first, then land
compiling code.

## Verification workflow (MANDATORY — user requires real evidence, not "verified")
1. **Unit test the pure logic** with vitest (zero-dep, no jsdom needed for logic):
   extract validation/state-derivation into a pure function (e.g. `computeFeedback(payload)`)
   and assert the exact UI state it produces (e.g. `status:'error'` + field errors).
   Run: `npx vitest run src/lib/<feature>/__tests__/x.test.ts` (or `.tsx`).
2. **Typecheck**: `npx tsc --noEmit -p tsconfig.json` — grep for your paths; must be clean.
3. **Production build**: `npx next build` — new routes must compile and appear in the route table.
4. **Deploy & visual proof**: push to `main` → `deploy-oracle.yml` runs `pnpm build` + `pm2`
   restart of `esggo-core` (port 3000). Then open the LIVE URL in the browser tool
   (`https://esggo.co/<route>`) to screenshot Grid/Board/DrThoth etc.

## CRITICAL PITFALL — Browserbase form-submit click defect
The `browser_click` / `browser_press(Enter)` tools report success but **do NOT trigger
React `onClick` / `onSubmit` on Next.js form submit buttons** (both `type="submit"` and
`type="button" onClick` fail to change React state; snapshot shows no DOM change). Page-level
buttons (e.g. a floating "428" key) DO fire correctly — the defect is specific to form submit.
Consequence: you CANNOT visually verify form-validation UI (error banners, field errors) via
Browserbase automation.
**RECOMMENDED fix — Playwright headless Chromium (free OSS, LIVE-TIER proof):**
Install once in a throwaway `e2e-<x>/` dir (NOT the pnpm monorepo root):
`npm i -D playwright@latest @playwright/test@latest && npx playwright install chromium`.
Then start `npx next dev -p 3000` (background), wait until `devserver.log` shows 200s, and run:
```js
import { test, expect } from '@playwright/test';
const BASE = process.env.E2E_BASE || 'http://localhost:3000';
test('submit >500% spike → Dr.Thoth warning banner visible', async ({ page }) => {
  await page.goto(`${BASE}/omni/reports/mod-env-carbon-0001/edit`, { waitUntil: 'networkidle' });
  const n = page.locator('input[type="number"]');
  await n.nth(0).fill('1000'); await n.nth(1).fill('10000'); await n.nth(2).fill('0.495');
  await page.getByRole('button', { name: /提交永恆刻印/ }).click();
  await expect(page.getByText(/【Dr\. Thoth 零幻覺警告】數據未通過果因引擎驗算/)).toBeVisible({ timeout: 3000 });
});
```
Run: `cd e2e-x && npx playwright test --reporter=line`. This session PROVED the banner renders
via Playwright (1 passed, 3.4s) — the prior "no banner" was 100% the Browserbase click defect, not
a code bug. **Gotchas:** use `@playwright/test` (the runner), not just `playwright`; `getByLabel`
fails (no aria-label) → use `input[type="number"].nth(k)`; strict-mode violation if regex matches 2
nodes (main banner + per-field error both contain the phrase) → anchor to the full banner sentence;
MSYS `curl localhost:3000` loop HANGS but Playwright connects fine — trust `devserver.log` 200s, not
curl "DOWN"; commit the spec as a permanent regression guard under `e2e-x/`.

**Fast pre-check (when Playwright is overkill):** vitest unit test on the pure derivation fn
(`computeFeedback`) + Node probe (`node -e` with tsx) confirming validator error shape + `next build`
as compile proof. But Playwright is the ONLY method giving autonomous VISUAL proof — prefer it for
user-facing form validation.

Do NOT write "verification passed" from a Browserbase screenshot that shows no banner — the click
likely never fired, and `browser_vision` will confidently misreport "no banner". Do NOT fabricate
the visual result. If shipping without Playwright, tell the user to verify in a REAL browser.

See `references/playwright-e2e-form-validation.md` for the copy-paste Playwright setup, spec
pattern, and the 5 gotchas (incl. MSYS curl hang, strict-mode double-match, Windows :3000 kill).

## EdgeResearch framing (honest improvement measurement)
For proving a UI/feature change actually improved, apply the EdgeResearch 4-step loop: freeze the
metric (preflight) → mutate ONE surface → re-measure at the strongest tier (unit → runtime →
live/Playwright) → keep or revert with one-line justification; record to
`runs/exp-<id>/{preflight.md,post-run.md,results.tsv}`. This session used it to settle the K1
"no banner" dispute: froze "banner appears on >500% spike", ran Playwright → KEEP. Its value is
refusing to trust green unit tests as proof of UI behavior.

## Anti-patterns observed
- Don't leave a native `<form onSubmit>` relying on Browserbase Enter/click to prove it works.
- Don't assume `feedback.status` changed just because `browser_click` returned success.
- Don't add jsdom/RTL deps just for a logic test — extract a pure function and test it directly.
- Lint false-positives: the in-repo linter sandbox sometimes reports `TS6053 file not found`
  for valid files; trust `tsc --noEmit` instead.
- Don't make `handleSubmit` call an `async` API (`await ncbClient.insertDocument`) without marking the
  handler `async` — `tsc` flags `TS1308`, but it's easy to miss until typecheck.

## Server-side proof that complements (and beats) the Browserbase workaround
Browserbase can't trigger form submit, but you CAN prove the server-side half end-to-end with a
real HTTP call — this is the strongest available evidence for API-backed UI:
- For a Route Handler like `app/api/agentic-twin/route.ts`, `curl -s -m25 -X POST https://esggo.co/api/<route>`
  with a JSON body and `--compressed`. A 200 with the expected JSON proves the handler + its
  underlying logic (e.g. `AgenticTwin.autonomousAnalyze`) run live. This session confirmed
  `/api/agentic-twin` returns `CRITICAL_INTERVENTION` for an invalid `evidence` URL — exactly the
  zero-hallucination guard firing on the server.
- For a `DynamicFormEngine` submitting to NCB: prove `computeFeedback` via vitest (above) AND confirm
  `ncbClient.insertDocument` is reachable by checking the route/handler that calls it, since Browserbase
  can't press the Seal button.

## `pnpm run lint` / `pnpm run build` blockage (durable workaround)
`pnpm run lint` (celestial-gate) and `pnpm run build` both FAIL before doing anything because pnpm 11
runs a **deps-status check** and refuses when a build script is unapproved (seen: `tesseract.js@7.0.0`
`[ERR_PNPM_IGNORED_BUILDS]` → exit 1). This is NOT a code error and NOT fixed by editing your files.
**Dodge it for verification:**
- `npx next build` (bypasses pnpm's install gate; Next 16 runs its own ESLint during build anyway)
- `npx eslint <specific/files>` (single-file, no repo-wide scan, fast)
- `npx tsc --noEmit -p tsconfig.json` for typecheck
- `npx vitest run <path>` for tests
Only `pnpm approve-builds` (approve `tesseract.js`) makes `pnpm run lint/build` succeed again — but
that's a user environment decision, not required to verify your change.

## Task-board preference (reporting style)
The user likes progress tracked as a **Kanban-shaped todo**: In Progress / Pending / Completed /
Cancelled columns, with IDs (K1, K2, D1…). Use `todo` tool with that 4-column shape for multi-step
feature work, and update it as you finish each item. This doubles as the session's status report.

## VPS deploy notes
- `esggo-core` (cwd `/var/www/esggo`, script `pnpm`) serves Next on :3000.
- Push to `main` triggers `deploy-oracle.yml` (direct SSH): `pnpm build` + `pm2 start
  ecosystem.config.cjs --update-env`. New `app/` routes go live automatically.
- Kill stale `next dev` on :3000 via `cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -ano ^|
  findstr :3000 ^| findstr LISTENING') do taskkill /PID %a /F"` (git-bash `kill` can't reach
  Windows-native PIDs).
