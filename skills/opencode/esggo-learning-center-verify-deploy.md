---
name: esggo-learning-center-verify-deploy
description: Day-to-day verify-then-deploy ritual for the esggo-learning-center Vite/React/Firebase learning-center repo. Use when making code changes, i18n edits, or deploying to Firebase Hosting from this project. Encodes the 'modernity first' verify order, the 0/0 lint target, the combined deploy command, and the post-deploy build recheck.
---

# esggo-learning-center verify + deploy ritual

Reusable procedure for working in the `esggo-learning-center` repo
(Vite + React + Tailwind + Vitest, Firebase Hosting). This is the
day-to-day loop; full architecture/ops live in the repo's
`docs/ESGGO_PLATFORM_BEST_PRACTICES.md` and the `esggo-vps-toolkit` /
`esggo-learning-center-full` skills.

## When to use
- User asks to change code, i18n strings, components, routes, or Firebase mappings.
- User asks to deploy the learning center to Firebase Hosting.
- User asks to verify the repo is healthy before/after a change.

## Hard rules (from AGENTS.md — do not skip)
- **Language:** 繁體中文 only for UI copy, outputs, error messages. No English fallback.
- **Verify order (modernity first):** run BEFORE declaring any change done:
  ```bash
  npm run test
  npm run build
  ```
  Never skip for i18n/component/route/Firebase changes.
- **Lint target:** `pnpm run lint` → 0 errors / 0 warnings.
  - Do NOT delete `doc/setDoc/getDoc/query/where/getDocs/serverTimestamp/writeBatch`
    imports in `src/repositories/**` + `src/db.js` — they are intentionally kept
    for Firebase mode; ESLint disables `no-unused-vars` there on purpose.
  - `no-dupe-keys` is disabled inside `src/i18n/` by design (zh-TW/zh-CN are
    separate parent objects). Real dup keys are a separate cleanup task.
  - Fix code before tweaking ESLint config for `react-hooks/rules-of-hooks` etc.

## Deploy ritual
**Pre-flight (before any deploy):**
- Confirm `.firebaserc` (project `esggo-learning-center`), `firebase.json` (hosting `public: dist`, SPA rewrite to `/index.html`), `firestore.rules` are intact and git-clean.
- Ensure `dist/` is fresh: after any `node_modules` rebuild or code change, run `npm run build` first. A stale `dist/` ships old code.
- Login check: `firebase login:list` may HANG (browser/network) on some setups. If it times out, don't block — check `~/.config/configstore/firebase-tools.json` exists (token present) instead. The deploy itself will fail fast if truly unauthenticated.

1. **Safe default (combined):**
   ```bash
   firebase deploy --only hosting,firestore:rules
   ```
   This skips `functions` (source: `functions/` in firebase.json) — safe because functions aren't part of the learning-center frontend flow.
2. **hosting-only fast path** only if `.firebase.json`/`.firebaserc` are intact
   AND `firestore.rules` was NOT touched this change.
3. **Post-deploy verification (MANDATORY, full chain):**
   ```bash
   npm run build      # confirm dist still builds
   pnpm run lint      # 0 errors / 0 warnings
   npm run test       # 8/8 pass
   ```
   A green deploy is NOT sufficient — re-verify locally to catch regressions the upload didn't surface.
4. Never hardcode target URLs in components — `.env` is the single source of truth.
5. **Verify live:** optionally open `https://esggo-learning-center.web.app` (browser tool) to confirm the page renders (SPA + Firebase auth init).

## Gotchas
- **AGENTS.md is cwd-only.** It auto-loads only when Hermes's cwd is this repo.
  When invoked from elsewhere, read `C:\\Project\\esggo-learning-center\\AGENTS.md`
  or load this skill first.
- Windows CJK workspace: trust `read_file` read-back over write/patch "success"
  reports — builds won't catch leftover untranslated strings.
- Known runtime bugs listed in AGENTS.md (2026-07-20) were all confirmed FIXED on
  `main`. Re-verify against current code before "fixing" any of them.
- Current branch is `main` (AGENTS.md text saying `i18n-full-translation` is stale).

## Health check (cron)
- `scripts/esggo_healthcheck.sh` runs `npm test && npm build` daily at 09:00,
  emits `[esggo-health] ... OK` on pass or FAIL + tail on failure.
- Check results: `hermes cron list` (or `cronjob action=list`).
