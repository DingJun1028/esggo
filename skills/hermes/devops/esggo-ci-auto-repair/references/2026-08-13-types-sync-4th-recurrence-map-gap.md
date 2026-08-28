# TYPES_OUT_OF_SYNC, 4th recurrence — the generator `map` gap (2026-08-13, PR #737)

Closed the full loop in one cron turn: triage → fix → PR → verify → merge → post-merge verify.
`learning-center-ci / check-types-sync` was the **only** red job on main; everything else was green.

## Correction to the 13th-class table: `mismatched:` is NOT automatically a contract conflict

The main SKILL.md table says "`mismatched:` present ⇒ do NOT blind-regenerate; reconcile canonical
first". That is too strict and would have blocked the correct mechanical fix here. The real question
is **which side moved last**:

```bash
git log origin/main --oneline -4 --pretty='%h %s' -- shared/types.ts
git log origin/main --oneline -4 --pretty='%h %s' -- apps/learning-center/types/generated/esggo-shared.d.ts
```

| Observation | Meaning | Action |
| --- | --- | --- |
| artifact's newest commit **predates** canonical's | nobody hand-edited the artifact; `mismatched:` is a canonical *body* change | regeneration is safe and correct |
| artifact touched **after** canonical | someone edited the generated file | reconcile canonical first (original rule) |

Evidence from this case — artifact last touched at `06ab320a2`, canonical moved twice after it
(`341c2213a` Zoom player, `4c79af851` vault/second-brain) ⇒ purely stale.

## TRAP: there are TWO `check-types-sync.js`, and only one prints the named lists

| Path | Output shape | SRC resolution |
| --- | --- | --- |
| `scripts/check-types-sync.js` (root) | whole-file line diff, `- ` / `+ ` lines | `cwd/../esggo/shared/types.ts` (sibling-repo checkout) |
| `apps/learning-center/scripts/check-types-sync.js` | **`missing:` / `extra:` / `mismatched:`** | `cwd/../../shared/types.ts` |

CI runs the **second** one (`working-directory: apps/learning-center`). Read
`.github/workflows/learning-center-ci.yml` before opening a script, or you diagnose the wrong file
and burn a call.

## The consumer checker requires EVERY canonical export ⇒ an un-mapped name is permanent drift

`apps/learning-center/scripts/check-types-sync.js` enumerates all `export (enum|interface|type)`
names in canonical and requires the artifact to carry each one. The generator
(`scripts/export-shared-types.js`) only emits what its `map` array lists. So **a canonical export
absent from `map` is out of sync forever, and regeneration alone cannot fix it.**

Two-step proof — cheap, and it tells you exactly how many gaps exist:

| Step | Command (from `apps/learning-center`) | Expected |
| --- | --- | --- |
| 1 | `node ../../scripts/export-shared-types.js` then `node scripts/check-types-sync.js` | `missing:` shrinks to only the **un-mapped** names |
| 2 | add those names to `map`, re-run both | `TYPES_IN_SYNC` + `EXIT=0` |

Observed here:

| Stage | Checker output | EXIT |
| --- | --- | --- |
| before (reproduced CI) | `missing:` 5 names / `mismatched: ISseTranslationEvent, ISpeechToSubtitleResult` | 1 |
| after regeneration only | `missing: ISecondBrainNote` | 1 |
| after adding `['ISecondBrainNote','interface']` to `map` | **`TYPES_IN_SYNC`** | **0** |

Neither script needs `node_modules` (pure `fs`/`path`), so both run directly in a fresh worktree with
no install — the whole verification costs seconds.

**Harness calibration:** the pre-fix local run reproduced CI's `missing:` list exactly. `mismatched:`
had one EXTRA name locally because `origin/main` had advanced (`ab3980af` → `c97ef9399`) mid-turn —
growing drift, not a harness fault. Say so explicitly rather than treating it as a mismatch.

## Diff shape check

`+42/-1` over exactly 2 files. The single deletion was a canonical **comment** line
(`/** 即時翻譯對向: zh-TW→en 或 en→zh-TW */`), not a type. Confirm with:

```bash
git diff -- apps/learning-center/types/generated/esggo-shared.d.ts | grep "^-" | head -5
git diff -- apps/learning-center/types/generated/esggo-shared.d.ts | grep "^+export"
```

Any *type* deletion means you regenerated against the wrong canonical. As the skill predicts, the
worktree also showed unrelated dirty `.Jules/palette.md` — `git add` the two explicit paths only.

## `patch` tool lint false-fail inside a worktree

Editing `C:/Project/_verify5/scripts/export-shared-types.js` returned
`Error: Cannot find module 'C:\c\Project\_verify5\scripts\export-shared-types.js'` with
`"status": "error"`. That is the MSYS `/c/` → `C:\c\` mangling, **not** a syntax error — the edit
applied fine. Verify by running the script; never trust the lint field for worktree paths.

## Verification chain (post-merge main is the authoritative surface)

PR run `31722863439`: `build-and-test` success + `check-types-sync` **success**.
Landability gate: `state=OPEN mergeable=MERGEABLE isDraft=false files=2` ⇒ merged (squash).

`learning-center-ci` on `main`:

| run_id | sha | conclusion |
| --- | --- | --- |
| `31722037528` | `cc97b6ed` | failure |
| `31722077047` | `e6dac740` | failure |
| **`31723342947`** | **`e5e727d0`** (merge commit) | **success** |

Whole repo on `e5e727d0`: OmniCore CI / Sacred Pipeline / Deploy to Oracle VPS / AI Station image /
learning-center-ci all `success`.

## The recurrence is the real finding

4th time this class has fired (#460, #556, #588, #737). Root defect: **changing canonical
`shared/types.ts` does not force a regeneration** — it relies on human discipline. Fixing only the
artifact guarantees a 5th recurrence. Recommend a pre-commit hook or a CI step that regenerates and
diffs whenever `shared/types.ts` changes, and write that into the tracker/PR body so a foreground
session can act on it.

## Backlog note

`auto-repair.yml` files one `(unknown)` issue **per run_id**; 30+ were open. Do not blanket-close them
from cron (they span many run_ids and causes). Post the authoritative re-classification on the newest
one and flag provenance-based pruning for a foreground session.
