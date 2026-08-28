---
name: esggo-learning-center-best-practices
description: "Hard-won operational best practices for the esggo-learning-center Vite/React/Firebase repo, distilled from real incidents (lint false-positives, deleteSubmission shadowing/recursion, firebase 10->12 upgrade, undici override breaking jsdom). Load whenever working in this repo — editing code, upgrading deps, or triaging vulnerabilities."
version: 1.0.0
author: Hermes Agent (DingJun1028)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [esggo, firebase, pnpm, best-practices, lint, dependencies, learning-center]
---

# esggo-learning-center best practices

Lessons from real work on this repo (Vite + React + Tailwind + Vitest + Firebase Hosting,
pnpm workspace, pnpm v11). Each rule came from an incident, not theory.

## 1. AGENTS.md is cwd-only — never add a root .hermes.md
Adding a root `.hermes.md` triggers first-match-wins discovery and will SHADOW the existing
AGENTS.md, silently dropping its rules. To extend project rules, edit AGENTS.md in place.

## 2. Verify order: test -> build -> lint (modernity first)
After ANY change, run before declaring done:
```bash
npm run test
npm run build
pnpm run lint
```
Never skip test+build for i18n/component/route/Firebase changes. Lint target is 0 errors / 0 warnings.

## 3. Before deleting "unused" code, grep the whole file
ESLint `no-unused-vars` can be a false positive. Example from this repo:
- `deleteSubmission` was reported unused, but a LOCAL `const deleteSubmission` inside a component
  shadowed the imported one, and its body did `await deleteSubmission(id)` — calling ITSELF
  (infinite recursion hazard). Fix: delete the local wrapper, let the UI call the imported one.
- `ErrorBoundary`, `AttachmentUploader`, `CalendarCheck`, etc. were genuinely unused dead code.
Rule: `grep -nw SYMBOL App.jsx` — confirm 0 reads before deleting. If it's a shadow, fix the shadow, don't just delete the import.

## 4. Back up pnpm-lock.yaml before any dependency change
Cross-major upgrades (e.g. firebase 10 -> 12) are high-risk. Copy the lockfile to a backup dir
first:
```bash
cp pnpm-lock.yaml ~/AppData/Local/hermes/backups/esggo/pnpm-lock-before-<change>-<ts>.yaml
```
Run full verify after. If it breaks, restore the lock + `pnpm install`.

## 5. pnpm overrides on transitive deps break internal paths
Adding `overrides: { undici: ^6.28.0 }` to satisfy an audit "fixed" nothing and BROKE the test
env: jsdom@29 hard-requires `undici/lib/handler/wrap-handler.js`, which moved in 6.28.0 →
`MODULE_NOT_FOUND` in vitest. NEVER override a transitive dep that other deps reach into by
internal file path. Recover by `pnpm clean --lockfile && pnpm install` to rebuild from package.json.

## 6. Use the right audit tool: `pnpm audit`, not `npm audit`
`npm audit` reads npm-format resolution and MISREPORTS in a pnpm project (showed 10 vulns that
pnpm's own resolution had already neutralized). For this pnpm repo, `pnpm audit` is authoritative.

## 7. Accept dev-only / non-deployed vulnerabilities
- `undici` advisories are Node-only (Node fetch impl); the browser-side Firebase SDK uses native
  fetch and never triggers them. No real exposure in the deployed artifact.
- `brace-expansion` (eslint -> minimatch chain) is a devDependency, never bundled into the build.
Do NOT force-upgrade to get a green dashboard — it risks breaking the toolchain (see rule 5).

## 8. One purpose per commit; commit+push promptly
This engagement split into: AGENTS.md conventions (c9c9439), lint 0/0 cleanup (4eb84ea),
firebase upgrade + pnpm allowBuilds fix (69922be). Don't pile unrelated changes into one commit.

## 9. cron monitoring = watchdog pattern
Health checks should be SILENT on success, alert only on failure. This repo's three jobs:
- esggo-healthcheck-daily (daily 09:00): `npm test && npm run build`
- esggo-envbackup-weekly (Sun 03:00): snapshot .env + config, mirror to OneDrive
- esggo-lintcheck-weekly (Mon 04:00): `pnpm run lint` (report warning count even if exit 0)
Scripts live in ~/AppData/Local/hermes/scripts/.

## 10. Secrets backup stays OUT of the repo + mirrors to OneDrive
`.env` is gitignored. Backup snapshots go to ~/AppData/Local/hermes/backups/esggo/ AND mirror to
~/OneDrive/esggo-backups/ for cross-machine survival. Never commit secrets.

## pnpm v11 specifics (gotchas hit here)
- `package.json`'s `pnpm` field is IGNORED — settings like `overrides`/`allowBuilds` belong in
  `pnpm-workspace.yaml` (this repo has one at root).
- `allowBuilds` entries must be literal `true`/`false`, not placeholder text. The repo had
  `'@firebase/util': set this to true or false` which made `pnpm run lint` fail the dep-status
  check with `ERR_PNPM_IGNORED_BUILDS`; fixed to `true`.
- Supply-chain policy (`minimumReleaseAge`) may auto-add entries to `minimumReleaseAgeExclude`
  when you install a very-recent package; that's expected, not an error.

## 11. After deleting code, clean up STALE references and comments too
Deleting an unused symbol isn't done until you check who *talks about* it. Incident:
`ErrorBoundary` was removed from `App.jsx` (genuinely unused there), but `main.jsx` still had a
comment "ErrorBoundary 定義在 App.jsx 內" — wrong, because `main.jsx` defines its own
`RootErrorBoundary`. The code ran fine (build/test green) but the comment misled future readers.
Rule: after a delete, grep for the symbol name repo-wide and fix/remove stale comments and any
cross-file references that no longer hold.

## 12. A green deploy is NOT the end — re-verify locally after upload
Deploying only proves the upload succeeded. After `firebase deploy --only hosting,firestore:rules`,
re-run the full chain to catch regressions the upload didn't surface:
```bash
npm run build && pnpm run lint && npm run test
```
Optional: open `https://esggo-learning-center.web.app` with the browser tool to confirm the SPA
renders and Firebase auth initializes. Pre-flight: rebuild `dist/` after any node_modules change
(a stale dist ships old code), and don't block on `firebase login:list` if it hangs — check
`~/.config/configstore/firebase-tools.json` for a token instead.

## Self-audit checklist (run before declaring "done")
- [ ] No root `.hermes.md` shadowing AGENTS.md (rule 1)
- [ ] `grep -nw` confirmed 0 reads before each delete (rule 3)
- [ ] `pnpm-lock.yaml` backed up before dep changes (rule 4)
- [ ] No `overrides` forcing transitive deps (rule 5)
- [ ] Used `pnpm audit`, not `npm audit` (rule 6)
- [ ] Accepted dev-only/non-deployed vulns, didn't force-upgrade (rule 7)
- [ ] One-purpose commits, pushed (rule 8)
- [ ] cron jobs watchdog (silent on success) (rule 9)
- [ ] `.env` snapshot out of repo + OneDrive mirror (rule 10)
- [ ] Stale comments/refs cleaned after deletes (rule 11)
- [ ] Post-deploy local re-verify passed (rule 12)
