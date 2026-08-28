# 2026-08-08 — `TYPES_OUT_OF_SYNC`: stale generated artifact, fixed and merged inside one cron turn

First cron poll to complete the **full** loop: detect → re-classify → fix → PR → verify on PR head →
merge → verify on post-merge `main` → close tracker with evidence. Kept as the template for any
mechanically-verifiable single-file cause.

## Snapshot

Watcher reported **7 new failures**, `action=delegate`, and classified them as
`unknown` / `dependency` / `typescript`. **All wrong** — as usual, treat it purely as a change
detector. Re-derived from `gh run view <id> --log-failed`, the 7 runs collapsed to **6 root causes**:

| Root cause (real log signal) | Runs | Existing tracker |
| --- | --- | --- |
| `TYPES_OUT_OF_SYNC` missing 7 | 31242789901, 31242757449 | #442 #443 |
| `static-components` ×20 (×3 workflows) | …789905 / …789898 / …789889 | #441 |
| `Possible secret detected` ×2 | …789905 | #430 |
| `syntax error near` (VPS shell) | …789905 | #433 |
| Trivy `HIGH: 7` / `CRITICAL: 1` | …789889 | #429 |
| `Permission denied (publickey)` | …790051 | #434 #439 |

Every cause already had a tracker ⇒ **0 new issues filed**. Filing per-run would have produced 7
duplicates. `ERR_PNPM_*` grepped **0** across all logs, confirming the earlier install-stage P0 stayed
fixed and these were the unmasked pre-existing reds.

## The chosen repair — why this one

Picked on leverage ÷ risk, not on noise:

- `static-components` ×20 was the LOUDEST (3 workflows) but needs cross-file React refactoring —
  `eslint --fix` cannot resolve an error-level `react-hooks/static-components`. Left for foreground.
- `TYPES_OUT_OF_SYNC` blocked only one workflow but was **one regenerated file** with a deterministic
  checker. Ideal cron work.

## Diagnosis

Log printed only `missing:` — **no** `extra:`, **no** `mismatched:`:

```
missing: TranslateEngine, LanguageCode, ITranslateRequest, ITranslateResult,
         ISpeakPayload, ISseTranslationEvent, IOmniTypeMatrix
```

That triple tells you it is pure staleness, not a contract conflict.

The 7 names are the **last 7 exported blocks** of canonical `shared/types.ts` (line 223→EOF), and the
consumer `apps/learning-center/types/generated/esggo-shared.d.ts` still ended at `IApiResult<T>`.

Decisive check: `scripts/export-shared-types.js`'s `map` array **already contained all 7**, under a
comment `--- Universal Translator (萬能即時翻譯) Domain — 雙向 TS 矩陣新納入 ---`. So canonical and
generator were both correct; only the committed artifact was never regenerated.

Read-only inspection commands used (no checkout, no install, shared clone untouched):

```bash
git fetch origin --quiet
git show origin/main:apps/learning-center/scripts/check-types-sync.js
git show origin/main:scripts/export-shared-types.js
git show origin/main:shared/types.ts | grep -nE "^export (interface|type|enum)"
git show origin/main:apps/learning-center/types/generated/esggo-shared.d.ts | tail -25
git show origin/main:.github/workflows/learning-center-ci.yml   # confirms working-directory
```

The workflow's gate — judge by this, never by run conclusion:

```yaml
- name: Verify sync
  working-directory: apps/learning-center
  run: |
    GENERATED="$(node scripts/check-types-sync.js)"
    if [ "$GENERATED" != "TYPES_IN_SYNC" ]; then exit 1; fi
```

## Repair

Isolated worktree (a stale sibling worktree already occupied `C:/Project/_verify2`, so used `_verify3`):

```bash
git worktree add -b auto-repair/types-sync-20260808 C:/Project/_verify3 origin/main
cd C:/Project/_verify3/apps/learning-center
node ../../scripts/export-shared-types.js    # -> OK types\generated\esggo-shared.d.ts
node scripts/check-types-sync.js             # -> TYPES_IN_SYNC   EXIT=0
git add apps/learning-center/types/generated/esggo-shared.d.ts
git diff --cached --name-only                # exactly one path
```

`60 insertions(+)`, **0 deletions**, 1 file. Zero deletions is the signal you regenerated against the
right canonical.

Node emitted `MODULE_TYPELESS_PACKAGE_JSON` (root `package.json` has no `"type": "module"`) but ran
the ESM script fine on Node 24 via syntax auto-detection. Not a defect; do not "fix" it here.

## Verification chain

| Stage | Evidence |
| --- | --- |
| Local | `check-types-sync.js` → `TYPES_IN_SYNC`, `EXIT=0` |
| PR head (`4717a1c`) | run `31243328390` `learning-center-ci` → **SUCCESS** |
| Post-merge `main` | run `31243477064` `learning-center-ci` → **SUCCESS** |

No-regression proof — the other 3 PR runs were red with **identical counts** to `main`:

| Workflow | main run | PR run | `static-components` | other |
| --- | --- | --- | --- | --- |
| OmniCore CI | 31242789905 | 31243328357 | 20 → 20 | secret 2→2, `syntax error near` 1→1 |
| ESG-GO CI/CD | 31242789889 | 31243328377 | 20 → 20 | Trivy `HIGH: 7` / `CRITICAL: 1` unchanged |
| Sacred Pipeline | 31242789898 | 31243328384 | 20 → 20 | — |

Plus `grep -icE "cannot find module|command not found|MODULE_NOT_FOUND"` → **0** on both PR logs.

PR #460 merged `06:14:38Z`; #442/#443 auto-closed `06:14:39Z` via `Closes`.

## Traps hit

1. **Gap scan surfaced 3 "new" failures that were my own PR's runs.** `31243328357/377/384` all
   returned `event=pull_request`, `branch=auto-repair/types-sync-20260808`. Without checking
   `headBranch`/`event` they would have been triaged as fresh `main` breakage. They became the
   no-regression table instead.
2. **`Closes` auto-closed the trackers with no evidence.** Posted the before/after table as a comment
   on the already-closed #442 so the closure is auditable.
3. **Stale PRs #449/#450 had already been block-warned three times.** Checked `--json comments`
   before posting and deliberately added none — reported "already warned" instead.
4. **Sibling-subagent writes** hit both `C:/Project/_ci_logs/c459.md` and the watcher state file.
   Used a suffixed filename for the body; state advance is safe because monotonic (re-read to confirm).
5. **`git worktree remove --force` returned `Permission denied`** yet `git worktree list` no longer
   showed `_verify3` — de-registration succeeded. `rmdir` then failed `Device or resource busy`.
   Left the inert empty dir for a foreground session rather than fighting it mid-flight.

## Outcome

- 1 P0 fixed, merged, verified on `main`; `learning-center-ci` red → green.
- 0 new issues (all causes pre-tracked); 2 trackers closed with evidence.
- Watcher state advanced to `31243529465`.
- Left explicitly for foreground: `static-components` ×20 ×3 workflows (#441) — highest remaining
  leverage; and `Permission denied (publickey)` (#434/#439), which is not auto-repairable.
