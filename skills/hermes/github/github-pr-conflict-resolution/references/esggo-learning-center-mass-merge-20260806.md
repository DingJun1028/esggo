# Session Reference: esggo-learning-center Mass Merge (2026-08-06)

Date: 2026-08-06
Branch: main → main (local integration storm)
Repo: DingJun1028/esggo
Workdir: C:\Project\esggo-learning-center

## Scope
- Integrated 70+ remote branches into local `main` in one session
- Resolved 6+ explicit conflict sets before switching to batch merge
- Final push succeeded to https://github.com/DingJun1028/esggo.git as commit `60eb533f`

## Conflict resolution chronology
1. `esggo-omni-center/.github/workflows/dump-env.yml` — remote deleted file; accept deletion
2. `src/components/charts/omni-bar-chart.tsx`, `omni-line-chart.tsx` — HEAD useMemo vs branch optimization; manual merge then `-X ours` for later duplicates
3. `components/views/trustful/materiality-matrix-view.tsx` — bolt optimization preserved; keep `sortedFilteredTopics` memoization
4. `wrangler.toml` — keep `name = "esggo"` from HEAD, merge branch assets/KV/build/observability
5. `.github/workflows/ci.yml`, `app/sonnar/page.tsx`, `src/core/services/async-task-manager.ts`, `src/core/tags/oracle-sync-matrix.ts` — keep HEAD strict typing
6. `feat/platform-architecture-reorg` — modify/delete conflicts for `Dockerfile` and `my-worker/src/index.ts`; keep HEAD versions

## Batch merge recipe that worked
```bash
# first pass: explicit merges with manual resolution where needed
git merge --no-ff origin/<branch> -m "merge: ..."

# after first few conflicts, automate remaining branches
for branch in $(git branch -r | grep -v '\->' | grep -v 'origin/main' | sed 's/origin\///'); do
  git merge --no-ff -X ours "origin/$branch" -m "merge: $branch into main" || echo "FAILED: $branch"
done
```

## Unrelated-history branches (skipped)
- `dependabot/npm_and_yarn/npm_and_yarn-01dc40a8c1`
- `fix/google-auth-provider-setup`
- `fix/replay-drive-link-and-ui-cleanup`
- `learning-center-new`
- `temp-dump-env`

## Push/pull gotcha after large local merge
After finalizing a big local merge, `git push` may be rejected because remote advanced:
```
! [rejected] main -> main (fetch first)
```
Do **not** run `git pull --rebase` on a long repo history after a merge storm; it will replay dozens of commits and recreate identical conflicts. Use:
```bash
git pull --no-rebase origin main
git push origin main
```

If you already started rebase and hit a loop:
```bash
git rebase --abort
git pull --no-rebase origin main
```

## Workspace noise that blocked commits
`git status --short` showed many staged build-log and temp-file deletions unrelated to merge work. Before committing merge resolutions:
```bash
git reset HEAD -- build_error_final.txt build_final_3_utf8.txt ...
```
Only stage the actual conflict-resolution files.

## Selective add lesson
After a merge storm, `git add -A` can stage ~30k unrelated files in one shot. Prefer explicit adds for merge-resolution commits, and only run `git add -A` after reviewing the staged diff scope.

## Outcome
- `main` pushed successfully as `60eb533f`
- GitHub reported 22 vulnerabilities on default branch post-merge; that is a follow-up Dependabot/pnpm-overrides task, not a merge blocker.
