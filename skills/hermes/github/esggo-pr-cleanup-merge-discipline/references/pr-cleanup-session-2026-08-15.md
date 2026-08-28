# PR Cleanup Session Notes — 2026-08-15

## Merged PRs

- #743 — keyboard focus indicators (UX)
- #744 — tighten IComponentCore evidence typing (security/types)
- #494 — optimize OA-Summon fetch with Promise.any (perf)

## Closed duplicate PRs

- #601, #470 → superseded by #744
- #600, #472, #721 → superseded by #743
- #468 → superseded by #599
- #488 → superseded by #494
- #486 → superseded by #495
- #598, #599, #495 → superseded by clean rebase PR #778

## Closed stale tracker issues

- #758, #759, #760, #754, #753, #752, #751, #745, #747, #746, #738, #686, #634
- Background batch also closed: #767, #766, #765, #764, #763, #762, #756, #755, #754, #751, #121

## Lockfile findings

- Root cause of CI failures: `pnpm-workspace.yaml` overrides changed, `pnpm-lock.yaml` not regenerated.
- Fix: `pnpm install --lockfile-only --no-frozen-lockfile`
- Verified locally: `pnpm install --frozen-lockfile` passes after sync.

## Draft PR policy enforced

- All ready-for-review candidates marked ready: #743, #744, #494.
- Conflicting PRs left as draft with rebase guidance: #598, #599, #495.
- Never auto-merge DRAFT/CRITICAL PRs.

## Stale CONFLICTING PR recovery

- Closed #598/#599/#495 instead of interactive rebase.
- Created clean branch from `origin/main`.
- Cherry-picked only non-trivial commits; skipped empty commits.
- Resolved conflicts with `git checkout --theirs` for unrelated files.
- Opened clean rebase PR #778 from `sentinel-fail-secure-clean`.

## Deliverables

- `docs/PR_MERGE_REVIEW_CHECKLIST.md` committed and pushed to main.
- `firebase-service-account.json` confirmed removed from main history at `bb0d978dc`.
- Working tree cleaned; only untracked local artifacts remain outside repo.
- #778 CI was pending at end of session.
