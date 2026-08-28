# Session References: esggo-learning-center PR #3 Conflict Resolution

Date: 2026-07-20
Branch: learning-center-init → main

## Conflict Summary

Merging `origin/main` (which had PR #2: "統一 claims/roles/TA 命名") into `learning-center-init` produced **5 conflicted files, 19 conflict markers**:

- `src/App.jsx` — 9 conflicts ( navbar imports, auth refs, view branches )
- `src/db.js` — 2 conflicts ( initializeFirestore import, getCurrentRole fix )
- `src/i18n/translations.js` — 3 conflicts ( auth.anonymous, auth.profileTitle, auth.noPermission )
- `src/repositories/profile.repository.js` — 1 conflict ( missing db import )
- `src/repositories/supabase.adapter.js` — 4 conflicts ( require() → dynamic import() )

Resolution: all conflicts resolved with `git checkout --ours <file>` because the feature branch contained the corrected/newer versions of every conflicted region.

## CI Failure Root Cause

After conflict resolution, `learning-center-ci` failed with:

```
learning-center-ci / build-and-test (pull_request)   FAILED after 13s
learning-center-ci / build-and-test (push)            FAILED after 12s
```

**Root cause**: lockfile drift. CI uses **pnpm** on `ubuntu-latest` with Node 20, but local development had used `npm install`. The `pnpm-lock.yaml` on disk was stale relative to `package.json`, causing pnpm install to pull a different transitive dependency tree on CI.

**Fix applied**:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build   # 1524 modules, 0 errors
pnpm run test    # 8/8 passed
git add pnpm-lock.yaml
git commit -m "chore: sync pnpm lockfile with package.json (CI fix)"
```

After this commit + push, CI re-runs were expected to pass.

## Project-Specific CI Configuration

File: `.github/workflows/ci.yml`
- Runner: `ubuntu-latest`
- Node: 20 via `pnpm/action-setup@v4` + `actions/setup-node@v4`
- Package manager: **pnpm v9** (not npm, not yarn)
- Steps: `pnpm install` → `pnpm run build` → `pnpm run test`

## Commits in this PR

| Commit | Message |
|--------|---------|
| 308f83f | feat: TA panel with pairing management, profile setup modal, admin pairing CRUD |
| 86a297d | merge: resolve conflicts with main (PR #2), keep all auth/pairing/bugfix improvements |
| (pending) | chore: sync pnpm lockfile with package.json (CI fix) |

## Key Takeaway

When a repo mixes:
- npm locally
- pnpm in CI
- + merge conflicts mid-session

The merge fix alone is insufficient — lockfile drift must be resolved too. The correct sequence is:

```
resolve conflicts → commit merge → sync lockfile → commit → push → CI passes
```
