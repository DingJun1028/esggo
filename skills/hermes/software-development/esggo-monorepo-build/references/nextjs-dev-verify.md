# Next.js 16 App Router `next dev` verification on Windows git-bash

Captured 2026-08-11 while landing the OMNI ESG Reports Center (`app/omni/reports`,
`src/components/omni/reports`, `src/lib/omni-reports`). Three traps bit real browser verification.

## Trap A — `(&)` subshell dev server dies when the tool call returns
`cd x && (npx next dev -p 3000 > log 2>&1 &)` looks backgrounded but the git-bash subshell is
reaped when the `terminal` tool returns → server gone, `curl :3000` refused, browser shows a
dead/stale page.
**Fix:** `terminal(background=true)` with the PLAIN command (no `&`, no subshell):
```
cd /c/Project/esggo && npx next dev -p 3000 > /c/Project/esggo/devserver.log 2>&1
```
The harness tracks it; it survives across tool calls.

## Trap B — zombie `next dev` holds :3000
A prior dev server (PID owned by Windows, invisible to git-bash `ps`/`kill`) keeps the port.
`netstat -ano | grep :3000` shows a Windows PID (e.g. 49724) that git-bash `kill -9` reports
"No such process".
**Fix:** `cmd.exe /c "taskkill /PID <N> /F"` — Windows-native taskkill reaches the PID git-bash
cannot. Then start the fresh tracked dev server.

## Trap C — Turbopack hot-reload + open tab = stale bundle
After editing a component, `browser_navigate` does a fresh load, but if the dev server hadn't
recompiled that route you get the OLD bundle → a real fix appears not to work.
**Verification order that proves the fix:**
1. `npx next build` → exit 0 (authoritative compile proof for the WHOLE app).
2. Node-side logic probe: `npx tsx` a script that imports the validator/function and asserts its
   return shape (e.g. `validateESGData({...spike})` → `success:false` with `errors.currentYearUsage`).
3. Only then `browser_navigate` to the route AND confirm the dev log shows `GET /route 200`
   recompiled, then `browser_type`/`browser_click`/`browser_vision`.

## React form native-submission pitfall (bit DynamicFormEngine)
A `<form onSubmit={async handleSubmit}>` with a `type="submit"` button can trigger a NATIVE form
navigation (page goes blank / "empty page" snapshot) instead of running the React handler —
especially across SSR hydration.
**Fix:** button `type="button"` + `onClick={handleSubmit}`, and make `handleSubmit` sync or call
`e?.preventDefault()` as its first line. The OMNI ESG Reports zero-hallucination warning banner
never showed because the page navigated away before `setFeedback` committed.

## browser_vision single-shot false-negative
The vision model sometimes reports 'no banner / no error' when the element IS present but the
screenshot caught a pre-paint frame or a stale tab.
**Always confirm via `browser_snapshot` (DOM text, not pixels) or a fresh `browser_navigate`
reload before concluding a UI fix failed.** A 'success' from `browser_vision` is evidence; a
'not visible' is NOT disproof.

## Proof points this session
- `next build` exit 0 with the new `/omni/reports` + `/omni/reports/[reportId]/edit` routes.
- `vitest` 14/14 (omni-reports zero-hallucination + Hash Lock + Agentic Twin + Tier).
- `node --test` 6/6 (universal-translator).
- Browser: Reports Center Grid/Board (3 OmniGlassChart) + 428 → Dr. Thoth side panel with 4950
  kg CO2e insight confirmed visible.
- Node probe: `validateESGData({currentYearUsage:10000, previousYearUsage:1000, ...})` →
  `success:false`, `errors` has `currentYearUsage` + `evidence`.
