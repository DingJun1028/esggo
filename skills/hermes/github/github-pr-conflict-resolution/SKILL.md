---
name: github-pr-conflict-resolution
description: "GitHub PR merge conflict resolution and lockfile drift recovery for multi-package-manager repos."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [GitHub, Pull-Requests, Merge-Conflicts, CI/CD, pnpm, lockfile]
    related_skills: [github-pr-workflow, github-code-review]
---

# GitHub PR Conflict Resolution & Lockfile Drift

Covers resolving merge conflicts on feature branches and recovering from CI failures caused by lockfile drift when multiple package managers are used locally vs in CI.

## Prerequisites

- Feature branch pushed to origin
- `git` installed locally
- For lockfile recovery: `pnpm` installed (`npm install -g pnpm`)

---

## 1. Merge Conflict Resolution

### Symptoms
- GitHub PR page shows conflict markers or "This branch has conflicts"
- `git merge origin/main` produces `CONFLICT (content)` messages
- CI does not pass or is not triggered after merging

### Workflow

```bash
git checkout <feature-branch>
git merge origin/main
```

Edit all conflicted files to remove `<<<<<<< HEAD` / `=======` / `>>>>>>> origin/main` markers.

```bash
# Verify no markers remain
grep -r "^<<<<<<< " src/ && echo "RESOLVE THESE FIRST" || echo "clean"
```

Then stage, commit, and push:

```bash
git add -A
git commit -m "merge: resolve conflicts with main, keep <feature-name> improvements"
git push origin <feature-branch>
```

### Choosing Between `ours` and `theirs`

| Scenario | Command | Rationale |
|----------|---------|-----------|
| Feature branch has the intended logic | `git checkout --ours <file>` | Your changes are correct; main's version is outdated |
| Shared library/bug fix on main is correct | `git checkout --theirs <file>` | Main already fixed it; your branch should not revert |
| Both have value | Manual merge with `patch`/`write_file` | Combine both changes intentionally |

### Pitfall: Do Not Expect CI Without a New Commit

After resolving conflicts, **CI will not run until you commit and push**. A working tree with unstaged conflict resolutions does not trigger GitHub Actions.

Verify CI was queued:
```bash
gh pr checks                    # wait/poll
# or
git log --oneline -3            # confirm your merge commit is visible on origin
```

### Pitfall: Code review bots flag true runtime bugs after green CI
Bots like CodeRabbit/Gemini can miss import-survival bugs in PR time and surface them after merge, or flag new bug classes during review.
Examples from `esggo-learning-center`:
- `src/repositories/pairing.repository.js` used `getDoc` without importing it from `firebase/firestore`.
- `src/repositories/submission.repository.js` used `emitTelemetry` without importing it from `../db`.
- If CI is green but a bot flags missing imports/runtime crashes, treat them as follow-up work — file a follow-up commit, not a merge blocker.

### Pitfall: Runtime-crash bugs survive Vite build due to Firebase guards

---

## 2. Lockfile Drift (pnpm/npm/yarn Mismatch)

### Symptoms
- CI fails on `pnpm install` or `pnpm run build` even though it passes locally with `npm`
- CI error: `ERR_PNPM_LOCKFILE_MISMATCH` or missing dependencies
- PR shows failing checks immediately after push

### Workflow Diagnosis

1. Read the repo's CI workflow file (`.github/workflows/ci.yml`) to identify which package manager CI uses
2. Compare local lockfile (`pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock`) against `package.json` version ranges
3. If mismatch is found, rebuild the lockfile with the **same tool CI uses**

### Recovery Recipe

```bash
# Option A: rebuild from scratch (fastest)
rm -rf node_modules pnpm-lock.yaml package-lock.json
pnpm install
pnpm run build
pnpm run test

# Option B: update only lockfile (preserves node_modules)
pnpm install --lockfile-only
```

Commit the regenerated lockfile:

```bash
git add pnpm-lock.yaml
git commit -m "chore: sync pnpm lockfile with package.json (CI fix)"
git push
```

### Pitfall: npm Install Breaks pnpm Lockfiles

Using `npm install` on a repo whose CI uses `pnpm` silently diverges `package.json` from `pnpm-lock.yaml`. Even minor changes (e.g., adding a file) can desync the lockfile enough for CI to fail.

**Rule:** Always use the repo's canonical package manager when touching dependencies or lockfiles.

### Pitfall: Both package-lock.json and pnpm-lock.yaml Present

When both lockfiles exist (e.g., after a tooling migration), only the one matching the CI workflow matters. Do not delete the other — it may be used by contributors who rely on that tool. Regenerate only the CI-used lockfile.

---

## 3. Conflict + CI Failure Combo

When both merge conflicts and lockfile drift are present:

1. **First**: resolve all merge conflicts and commit the merge
2. **Then**: regenerate the lockfile with CI's tool and commit separately (or amend)
3. **Push both commits**: CI will run on the latest and should pass

```bash
git commit -m "merge: resolve conflicts with main"
pnpm install --lockfile-only
git add pnpm-lock.yaml
git commit -m "chore: sync pnpm lockfile (CI fix)"
git push
```

---

## 4. Verification Checklist Before Re-Pushing

```bash
# No conflict markers in source
grep -r "^<<<<<<< " src/ .github/ wrangler.toml || echo "conflict-clean"

# Confirm latest commit is reachable
git log --oneline -3

# Status is clean or contains only intentional changes
git status --short

# Remote is in sync
git push origin main
```

---

## 5. Session-Specific Reference: esggo-learning-center PR #3, #5, and #6

### Project CI PITFALL: Dual Failure Modes Are Independent

On `esggo-learning-center` both failure modes appeared in sequence on different PRs:

1. **PR #3 conflict resolution** produced `src/App.jsx`, `src/db.js`, `src/i18n/translations.js`, `src/repositories/profile.repository.js`, `src/repositories/supabase.adapter.js` conflicts → fixed via `git checkout --ours`
2. **PR #3/5 CI**, after merge, failed with `ERROR packages field missing or empty` in pnpm → fixed by adding `packages: ['.']` to `pnpm-workspace.yaml`
3. **PR #3/5 CI** still sometimes showed stale lockfile → `rm -rf node_modules pnpm-lock.yaml && pnpm install`

Resolving (1) alone is insufficient; the correct sequence is:

```
resolve conflicts → commit merge → fix pnpm-workspace.yaml → commit → push → verify CI
```

### GitGuardian finding: missing `getDoc` import (pairing.repository.js)

A real runtime bug surfaced via code review — `getDoc` was imported in `db.js` but NOT in `src/repositories/pairing.repository.js`, even though `loadPairing` calls `getDoc(...)`. This is the same class of bug as the pitfall listed in `firebase-react-apps`: missing `db`-related imports pass Vite build but crash at runtime when Firebase is configured.

### Classification key: unresolved code review findings after green CI

When PR CI is green but a code review bot (CodeRabbit, Gemini Code Assist) flags runtime crashes, those findings are NOT "pre-merge blockers" in the strict sense — the reviewer should resolve them in a follow-up commit **after** merge. Do NOT block merge on eslint-style findings from bots if CI is green; instead, file a follow-up issue/commit.

### Windows dev gotcha: `gh` CLI not in PATH after winget install

On Windows, `winget install GitHub.cli` places `gh.exe` at `/c/Program Files/GitHub CLI/gh.exe` but does not append to user PATH. Fix:
```bash
export PATH="/c/Program Files/GitHub CLI:$PATH"
gh auth status
```

For this project (`esggo-learning-center`): CI uses `pnpm@9` on `ubuntu-latest` with Node 20. Always run `pnpm install` and `pnpm run build` locally before pushing to prevent lockfile drift. Also inspect `pnpm-workspace.yaml` after dependabot or migration tool edits — missing `packages:` field is a silent CI killer. Also inspect `pnpm-workspace.yaml` after dependabot or migration tool edits — missing `packages:` field is a silent CI killer.

---

## 6. Multi-Branch Merge Storm (Local Integration Before Push)

### When to use
- You need all feature branches integrated into `main` locally before pushing
- Many branches touch overlapping files (charts, configs, CI) and would create a long PR merge queue
- Same conflict class appears repeatedly across branches (e.g. chart memoization, wrangler.toml)

### Workflow

```bash
# 1. Clean tree first
git reset HEAD -- build_error_final.txt build_final_3_utf8.txt ...

# 2. First pass: explicit conflict resolution where needed
git merge --no-ff origin/feat/foo -m "merge: ..."

# 3. Subsequent branches: auto-favor HEAD for known recurring conflicts
for branch in $(git branch -r | grep -v '\->' | grep -v 'origin/main' | sed 's/origin\///'); do
  git merge --no-ff -X ours "origin/$branch" -m "merge: $branch into main" || echo "FAILED: $branch"
done
```

### Handling `refusing to merge unrelated histories`
Some branches are truly isolated snapshots. If `git merge` returns:
```
fatal: refusing to merge unrelated histories
```
skip them unless the user explicitly needs their contents:
```bash
git merge --no-ff -X ours origin/branch -m "merge: ..." || echo "SKIP unrelated: branch"
```

### Pitfall: rebase loop after pull
If `git pull` re-applies already-merged commits and re-creates identical conflicts:
1. Abort: `git rebase --abort`
2. Use merge instead: `git pull --no-rebase origin main`

### Pitfall: duplicate chart/memoization commits
If the same optimization exists in multiple branches, `-X ours` after the first resolution makes later merges `Already up to date.` without manual rework.

### Verification after merge storm
```bash
git status --short | head -20
grep -rn "^<<<<<<< " src/ .github/ wrangler.toml || echo "conflict-clean"
git log --oneline -5
```

## 7. Session-Specific Reference: esggo-learning-center Mass Merge (2026-08-06)

### Scope
- Merged 70+ branches into `main` locally, then pushed once
- Conflicts resolved: `dump-env.yml`, chart components, `materiality-matrix-view.tsx`, `wrangler.toml`, `ci.yml/sonar/async-task/oracle-sync`, `platform-architecture-reorg`
- Recurring chart conflicts used manual merge first, then `-X ours` for remaining branches

### Key lessons
- `git status --short` shows more than merge conflicts; unrelated build logs can be staged and block commits. Use `git reset HEAD -- <noise-files>` before finalizing merge commits.
- `git add -A` after a merge storm can stage thousands of unrelated workspace files. Prefer selective adds for conflict-resolution commits; only `git add -A` after reviewing the diff scope.
- Large repos with long histories make `git pull` fragile after a big local merge. `git pull --no-rebase` is safer when remote has only minor advances.
