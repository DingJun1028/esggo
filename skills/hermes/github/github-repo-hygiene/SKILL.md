---
name: github-repo-hygiene
description: "Monorepo hygiene: PR triage, pnpm lockfix, auth fixes."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [GitHub, Maintenance, CI, pnpm, Auth]
    related_skills: [github-pr-workflow, github-issues, github-code-review]
---

# GitHub Repo Hygiene

Use this skill when cleaning up a repo's PR/issue backlog, fixing recurring CI install failures from dependency-manager drift, or hardening HMAC/webhook/cron auth patterns.

## 1. Stale PR Triage

Goal: reduce open-PR noise without losing work.

Rules:
- If two open PRs solve the same problem, pick the more complete/clean one as canonical and close the other with a comment naming it.
- Do not close a PR solely because it is old; close only when it is truly superseded or abandoned.
- When closing, include a short traceable reason: canonical PR number and why.

Example:

```bash
gh pr close 470 --comment "Superseded by #744；建議以 #744 為準合併。"
```

## 2. Issue / Tracker De-duplication

Many automation setups create duplicate tracker issues for the same CI failure. Cleanup policy:

- One canonical tracker per root cause.
- Close duplicates with a comment referencing the canonical issue/PR.
- If the root cause is already fixed on main, close the tracker instead of reopening work.

Bulk-close pattern:

```bash
for n in 758 759 760; do
  gh issue close "$n" --comment "歸檔：重複 tracker；根因已於 #757 / e0340efff 修復。" || true
done
```

## 3. pnpm Lockfile Drift / Overrides Mismatch

Symptom: CI fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` while local `pnpm install` succeeds.

Root cause: workspace overrides in `pnpm-workspace.yaml` were changed without regenerating `pnpm-lock.yaml`.

Fix:

```bash
pnpm install --lockfile-only --no-frozen-lockfile
git add pnpm-lock.yaml
git commit -m "fix(ci): sync lockfile overrides"
```

Verification:

```bash
pnpm install --frozen-lockfile
# must exit 0
```

Rules:
- Only `pnpm-lock.yaml` should change.
- Do not bump dependency versions while fixing this class of CI failure.
- Use the same pnpm major version as CI when regenerating.

## 4. Webhook / Cron Auth Hardening

Patterns that repeatedly show up in repo reviews:

### 4.1 HMAC timing-safe comparison

Always check length before `timingSafeEqual`; mismatched lengths must return false.

```ts
const sigBuf = Buffer.from(signatureHeader);
const expBuf = Buffer.from(expected);
if (sigBuf.length !== expBuf.length) return false;
return crypto.timingSafeEqual(sigBuf, expBuf);
```

### 4.2 Cron auth interface

Support both:
- `x-cron-secret`
- `Authorization: Bearer <secret>`

Fallback plaintext equality only if HMAC payload shape is unsuitable; otherwise keep constant-time comparison.

### 4.3 Fail-secure defaults

Missing gateway/cron/webhook secrets should fail closed: log at CRITICAL and exit/reject, not warn-and-continue.

## 5. Clean Working Tree Discipline

Before declaring cleanup complete:

- Close/clean untracked local artifacts that are not part of the repo: `.vercelignore`, `.zenrows/`, backup folders, stray skill installs.
- Restore any files that were accidentally modified outside the intended change set.
- Verify with `git status --short` that only intended changes remain.

## 6. Honest Reporting

- Report actual command output, including failures.
- Do not synthesize CI results; if a run is still pending, say so and wait or re-check.
- When something cannot be fixed automatically, name the blocker and the exact manual step required.
