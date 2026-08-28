---
name: esggo-pr-cleanup-merge-discipline
description: "ESGGO PR cleanup and merge discipline."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [GitHub, PR, cleanup, merge, 5T, security]
    related_skills: [github-pr-workflow, github-auth]
---

# ESGGO PR Cleanup & Merge Discipline

Repo-specific rules for `DingJun1028/esggo`.

## When to use

- Triage open PRs/issues and close duplicates
- Decide whether a PR is ready for merge
- Enforce lockfile/CI/security constraints before merge

## DRAFT / CRITICAL PR policy

- **Never auto-merge a DRAFT PR.** Mark ready first: `gh pr ready N`.
- **CRITICAL/security PRs** still require human confirmation before merge.
- If multiple PRs target the same fix, **close duplicates** with `Superseded by #N`.

## Duplicate cleanup workflow

1. Group open PRs by topic.
2. Keep the single most complete/current PR per topic.
3. Close superseded PRs/issues with a clear comment.
4. Preserve one canonical tracker per root cause.

## Stale CONFLICTING PR recovery

- If a PR is DRAFT + CONFLICTING and its commits are small and still useful, **do not rebase interactively in the stale branch**.
- Instead:
  1. Close the stale PR with a `Superseded by #new` comment.
  2. Create a clean branch from current `origin/main`.
  3. Cherry-pick only the non-trivial commits; skip empty/duplicate commits.
  4. Push and open a new PR from the clean branch.

## Conflict resolution policy for backport commits

- When resolving conflicts during cherry-pick/rebase, prefer `git checkout --theirs <path>` for files that are not part of the current task scope.
- This prevents unrelated local changes from polluting the merge result.

## 5T merge checklist

- [ ] `pnpm run check` passes
- [ ] CI workflows green
- [ ] No secrets/keys committed
- [ ] `source_origin`, `evidence`, `hash_lock` present if required
- [ ] Working tree clean

## Lockfile sync rule

If `pnpm-workspace.yaml` overrides change, **regenerate `pnpm-lock.yaml`** before pushing.

```bash
pnpm install --lockfile-only --no-frozen-lockfile
git add pnpm-lock.yaml
```

## References

- `references/pr-cleanup-session-2026-08-15.md` — Session notes: merged #743/#744/#494, duplicate cleanup, lockfile findings.
- `references/merge-audit-template.md` — Template for recording merged PR evidence.