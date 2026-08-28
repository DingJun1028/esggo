# 25th class: `deleted_fixture_contract_drift` — a commit deletes an asset a test still asserts

**Date:** 2026-08-27 · **Repo:** DingJun1028/esggo · **Outcome:** fixed → PR #965 → merged → post-merge
`main` green, inside ONE cron turn.

## Signature

```
FAIL apps/ftg-3.0/tests/soul-dialogue.test.ts > ESG Impact Soul Dialogue Images > 4. soul-dialogue-m...
AssertionError: expected false to be true // Object.is equality
 - Expected: true
 + Received: false
 ❯ apps/ftg-3.0/tests/soul-dialogue.test.ts:51:30
Test Files  1 failed | 66 passed | 4 skipped (71)
```

The failing assertion is an existence check: `expect(existsSync(path)).toBe(true)`.

## One cause × N workflows — the identical-summary tell

| Workflow | Run | Failing job / step | `Test Files` |
| --- | --- | --- | --- |
| OmniCore CI | `33010659660` | `Vitest Tests / Run Vitest` | `1 failed \| 66 passed \| 4 skipped (71)` |
| 🌌 Sacred Pipeline | `33010659641` | `🛡️ 原罪煉金 / 🧪 神聖契約驗證 (Unit Tests)` | `1 failed \| 66 passed \| 4 skipped (71)` |

Byte-identical `Test Files` summaries across two workflows ⇒ ONE root cause. The tracker script had
filed one issue per run (#963, #964); the correct handling is one fix + evidence on both, not two fixes.

## Diagnose from the HEAD COMMIT, not the test source

Reading the test looking for a logic bug burns the turn. The cause is in the commit's file list:

```bash
git show --stat --oneline 0e57bc1a | head -25
```
```
0e57bc1aa feat: ftg ESG 图去重 + 自管 Ollama proxy (A/B) (#961)
 apps/ftg-3.0/index.html                        |  32 ++-----
 .../esg-impact-note/soul-dialogue-mapping.json |  64 --------------   <-- deletions only
 ... 11 new PNGs (Bin 0 -> ~2MB each) ...
 vps/ollama-proxy/app.py                        |  94 +++++++++++++++
```

A **deletions-only** line naming exactly the path the test asserts IS the root cause. Note the commit
subject reads as a *feature* ("图去重" = image dedup) — consistent with the standing rule
**judge by changed paths, never by commit type**.

## The decisive call: restore the file, or delete the test?

The **17th class** (orphaned mirror test) resolves the same-looking symptom the OPPOSITE way, so
never pattern-match "test references a missing file ⇒ delete the orphan test".

Discriminator — does anything ELSE still reference the deleted path?

```bash
git grep -n -I "soul-dialogue-mapping" origin/main -- .
```
```
origin/main:apps/ftg-3.0/DEPLOYMENT-STATUS.md:11:| **Trackable** | ✅ Complete | soul-dialogue-mapping.json records all replacements |
origin/main:apps/ftg-3.0/DEPLOYMENT-STATUS.md:29:- `soul-dialogue-mapping.json` - RWD mapping specification
origin/main:apps/ftg-3.0/DEPLOYMENT-STATUS.md:55:python3 -c "import json; d=json.load(open('.../soul-dialogue-mapping.json')); ..."
origin/main:apps/ftg-3.0/tests/soul-dialogue.test.ts:49,50
```

| Other references survive? | Verdict | Repair |
| --- | --- | --- |
| **yes** (docs / code / 5T contract still cite it) | deletion was **collateral damage** | **restore** from `<sha>^` |
| no (only the test mentions it) | the test is the orphan (17th-class shape) | delete the orphan test |

Here three surviving references — one of which **executes** `json.load` against the file — plus the
fact that the 3 PNGs it maps still existed (tests 1–3 green) ⇒ **restore**. Deleting the test would
have silently discarded a live 5T **Trackable** contract and its `deduplication_report` provenance.

Second corroborating check — the referenced assets still exist:

```bash
git ls-tree --name-only origin/main apps/ftg-3.0/public/images/esg-impact-note/ | grep soul-replacement
```

## Repair: byte-identical, purely additive

```bash
git worktree add -b auto-repair/restore-soul-dialogue-mapping-20260827 C:/Project/_verify_soulmap origin/main
git show 0e57bc1a^:apps/ftg-3.0/public/images/esg-impact-note/soul-dialogue-mapping.json > <worktree>/<path>
git show 0e57bc1a^:<path> > C:/Project/_ci_logs/orig_soulmap.json
diff C:/Project/_ci_logs/orig_soulmap.json <worktree>/<path>   # require DIFF_EXIT=0
git -C <worktree> add "<explicit path>"                        # NEVER git add -A
```

Result: `1 file changed, 64 insertions(+)` — the exact inverse of the 64 deletions. No lockfile, no
other paths. esggo's pre-commit hook also prints `[encoding-check] ✓ Staged files clean`.

## Verification without node_modules — and CALIBRATE it

The suite's contract is pure `fs` + JSON, so it ports exactly to python; this avoids installing
anything and never touches the shared clone's `node_modules`. Reproduce **all** assertions (27 here,
including that every `img.file_desktop` exists on disk), then calibrate:

| State | Verifier | vs CI |
| --- | --- | --- |
| file removed (= `origin/main`) | `RESULT=FAIL violations=1`, sole failure `existsSync(...) === true` | matches CI `Failed Tests 1` @ line 51 ✅ |
| file restored (PR) | `RESULT=PASS`, 27/27 | — |

Tests 1–3 PASS in **both** states, proving the change is precisely scoped.

The negative control is free and fully reversible **because the file is staged in git's index**: `mv`
it aside, run the verifier, `mv` it back, re-run. A calibrated verifier is what separates this from the
five false-PASS traps — an uncalibrated checker cannot prove a fix.

## Post-merge `main` proof — expect UNBLOCKING, not just a colour flip

`gh run view <id> --json jobs --jq '.jobs[] | "\(.conclusion) \(.name)"'`, PR run vs main baseline,
then again on post-merge main (`407589f7`):

| Job | main `0e57bc1a` | main `407589f7` |
| --- | --- | --- |
| OmniCore / `Vitest Tests` | **failure** | **success** |
| OmniCore / `Build Check` | skipped (gated) | **success** |
| OmniCore / `Docker Build Test` | skipped (gated) | **success** |
| OmniCore / `Lighthouse CI` | skipped (gated) | **success** |
| Sacred / `🛡️ 原罪煉金` | **failure** | **success** |

Three jobs went `skipped → success` because they were gated behind the failing test. **Say so
explicitly** — otherwise the extra green jobs read as an unexplained diff, and the inverse
(`success → skipped`) would be a real regression worth catching.

## Cron-turn hygiene notes

- **A pre-existing worktree can hold STAGED work from an abandoned turn.** `git worktree list` showed
  `_verify_soulmap` already on this exact branch at `origin/main` with no commit;
  `git status --porcelain` revealed `A  <path>` (staged) and `git ls-remote origin '<branch>'` was
  **empty** (never pushed). Finishing it in place is correct — but `diff` the staged bytes against the
  intended source first, since a sibling may have staged something partial. Contrast the standing
  rule about *locked* worktrees: check status + remote before deciding reuse vs a suffixed branch.
- The tracker script's `Closes #963 / #964` auto-closed both issues **with no evidence**. A closed
  issue silently swallows `gh issue close -c`, so post with `gh issue comment <n> -F "C:/..."` and
  confirm the returned `issuecomment-<id>`.
- State pointer had parked at `33011978103` (an OA-TWINS **success**) above the three failures on the
  newest sha — burying mechanism #1/#3. `action=none` again meant "no new class", not "CI is green".
