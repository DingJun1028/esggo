# 12th class, two new sub-cases: duplicate manifest keys, and drift that lives on the DEPLOY TARGET

Date: 2026-08-17. One cron turn, closed end-to-end: detect → classify from real logs → verify → merge → post-merge verify.
Snapshot: `oa-twins-tracker.py` returned `{"action": "none", "newest_run_id": "32022670924"}` while **three
workflows were red** on the newest main sha `e7830c33` (burying mechanism #1 — the `workflow_run`-triggered
`OA-TWINS Auto-Repair` run always takes the highest id, so the state pointer parked above the failures).

## Sub-case 12a — the drift is DUPLICATE KEYS, and CI's `manifest:` value is override-resolved

`ERR_PNPM_OUTDATED_LOCKFILE` on `<ROOT>/apps/learning-center/package.json`, 8 jobs across 3 workflows,
all dying at *install* so nothing downstream ran:

```
* 3 dependencies are mismatched:
  - postcss (lockfile: ^8.5.26, manifest: >=8.5.23)
  - vite    (lockfile: ^7.3.6,  manifest: >=7.0.0 <8)
  - vitest  (lockfile: ^4.1.10, manifest: >=4.1.10)
```

### Trap 1: the `manifest:` value matches nothing in the file

`apps/learning-center/package.json` @ `e7830c33` literally contained `^8.4.39` / `^8.5.25` / `^6.4.3` —
**none** of the `>=` forms CI reported. That is not a stale log. `pnpm-workspace.yaml overrides` rewrite the
effective specifier before the frozen-lockfile comparison, so the "manifest" side is override-resolved.

Tell that overrides are the mechanism: a regenerated lockfile writes `>=`-form specifiers, e.g. the fix PR's
lockfile hunk showed `-        specifier: ^14.0.1` → `+        specifier: '>=11.1.1'`.

So: **never dismiss the log because you cannot grep the reported specifier.** Check `overrides:` first.

### Trap 2: the real corruption was duplicate JSON keys from a bad merge

Reading the manifest *by line number* (not by grep-for-a-value) exposed it:

```
33:    "postcss": "^8.4.39",      ← stale duplicate set
34:    "tailwindcss": "^3.4.19",
35:    "vite": "^6.4.3",
36:    "postcss": "^8.5.25",      ← effective set (last key wins in JSON)
37:    "tailwindcss": "^3.4.19",
38:    "vite": "^6.4.3",
39:    "vitest": "^4.1.10"
```

`grep -nE '"(postcss|vite|vitest|tailwindcss)"' <manifest>` returning **two hits per dep** is the entire
diagnosis. Cheap read-only fetch, no clone touched:

```bash
gh api repos/DingJun1028/esggo/contents/apps/learning-center/package.json?ref=<sha> --jq '.content' \
  | base64 -d | grep -nE '"(postcss|vite|vitest|tailwindcss)"'
```

**Diff-shape trap:** the fix showed `apps/learning-center/package.json +0/-3`. A manifest losing 3 lines
reads like "dependencies were removed" and invites a block-warning. It was the *stale duplicate block*
being deleted. Always read which lines went before judging a `-N` manifest diff.

## Sub-case 12b — the drift lives on the DEPLOY TARGET, not in the repo

After the merge, CI went fully green on `a1d8deff` but `Deploy to Oracle VPS` (`32026951617`) still failed
with the *same class* pointing at a different app:

```
HEAD is now at a1d8deff fix(deps): ... (#823)
Scope: all 21 workspace projects
[ERR_PNPM_OUTDATED_LOCKFILE] ... not up to date with <ROOT>/apps/oa-swarm/package.json
  * 3 dependencies were added: typescript@^5.5.0, tsx@^4.19.0, vitest@>=4.1.10
```

A deploy failing this class on a sha whose CI workflows all pass is **not** a contradiction or a flake.

### The `Scope:` line is the cheap differential — it is already in both logs

pnpm prints `Scope: all N workspace projects` in every install, so you never need a new call:

| Evidence | Value | Meaning |
| --- | --- | --- |
| deploy-runner `Scope:` | `all 21 workspace projects` | one extra importer |
| CI `Scope:` (same sha) | `all 20 workspace projects` | CI cannot see it |
| `gh api .../contents/apps/oa-swarm?ref=a1d8deff` | **HTTP 404** | path is not on main at all |
| CI workflows on that sha | all `success` | committed lockfile is self-consistent |

⇒ a stale **untracked directory** on the target (`/var/www/esggo/apps/oa-swarm`, a leftover local
experiment) matches the `apps/*` glob, so pnpm counts it as a 21st workspace project whose deps are absent
from the committed lockfile, and `--frozen-lockfile` aborts.

### Classify NOT auto-repairable — and say WHY, because the reflex fix is harmful

Same family as `repair-ssh-deploy-key`: the fix is on the target filesystem and needs SSH. Write the
reasoning into the tracker explicitly, or the next poll "helpfully" regenerates the lockfile — which would
write the dependencies of a directory **that does not exist on main** into the committed lockfile, turning
a target-local mess into real repo pollution. `git pull` and re-running the workflow both leave it failing
forever, because the leftover directory never goes away on its own.

Acceptance criteria to record for a foreground session:
1. `Scope:` back to `all 20 workspace projects`;
2. `grep -c ERR_PNPM_OUTDATED_LOCKFILE` on a new Deploy log → `0`;
3. `Deploy to VPS / Deploy direct` conclusion → `success`.

## A single flaky test can be the ONLY red on an otherwise-verified fix PR

PR #823's own runs: `learning-center-ci`, `🌌 Sacred Pipeline`, `ESG-GO CI/CD Pipeline`,
`Build & publish AI Station image` = **success**; only `OmniCore CI` (`32020615890`) failed, at
`Vitest Tests / Run Vitest` — i.e. install had already passed and the job advanced into a *test*.

```
× tests/5t-protocol.test.ts > FiveTHashLock (T4 Trustworthy)
    > verifies a lock at any age inside the window (per-ms coverage)  50ms
  → expected false to be true // Object.is equality
Test Files  1 failed | 58 passed | 3 skipped
```

Two things marked it flaky rather than a regression:
1. **Every sibling assertion in the same group passed** — `verifies a lock created within the tolerance
   window` ✅, `verifies a lock with an explicit timestamp (exact match)` ✅, `rejects a lock created
   outside the tolerance window` ✅. The only failure was the one **per-millisecond loop** (50ms runtime).
2. The diff touched only manifest keys + lockfile specifiers, which cannot alter SHA-256 timing semantics.

Confirmed post-merge: the same test **passed** on `a1d8deff` (OmniCore CI = success).

**Rule:** when the sole failing test is the only time-boxed/looping one in its group and the diff cannot
reach it, land the P0 fix and verify that test on the post-merge run — do not let it block a fix that
unblocks 8 jobs.

## Post-merge verification table (the authoritative proof)

| Workflow | pre-merge `e7830c33` | post-merge `a1d8deff` |
| --- | --- | --- |
| OmniCore CI | ❌ failure (install) | ✅ **success** |
| learning-center-ci | ❌ failure (install) | ✅ **success** |
| 🌌 Sacred Pipeline | ❌ failure (install) | ✅ **success** |
| Build & publish AI Station image | ✅ success | ✅ success |
| ESG-GO CI/CD Pipeline | — | Validate VPS Scripts ✅ / Code Quality ✅ / Security Scan ✅ |
| Deploy to Oracle VPS | ❌ failure | ❌ failure (**sub-case 12b**, target-local) |
| Deploy to Vercel | ❌ failure | ❌ failure (`VERCEL_TOKEN` invalid, #784) |

`ERR_PNPM_OUTDATED_LOCKFILE` count: **8 → 0** across the three CI workflows. Residual-signature scan
`grep -l "ERR_PNPM" /c/Project/_ci_logs/r32026951*.log` returned **only** the VPS deploy log — one command
proving the CI-side class is gone and isolating the surviving instance.

## Tracker hygiene outcome

The whole 05:38 → 10:57 window was ONE root cause (spot-checked mid-window run `32000021252`: same
signature ×5, same 5 jobs). `auto-repair.yml` files one `(unknown)` issue **per run_id**, so 11 trackers
had accumulated for it — all with **0 comments**. Correct output: post the full before/after evidence to
the newest (`#826`), then close all 11 with a one-line cross-reference to it. Open issues 17 → 5.
Then post the *negative result* to `#810` (0 comments, and the one surface where the new 12b diagnosis
belonged). **0 new issues filed** — every surviving red already had a tracker.
