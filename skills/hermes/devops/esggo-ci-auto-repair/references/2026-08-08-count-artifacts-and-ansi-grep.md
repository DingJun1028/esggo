# 2026-08-08 10:30 poll — count deltas that mean nothing, and ANSI-broken greps

Steady-state cron turn. Outcome: **0 issues, 1 comment, 1 Telegram digest** (`message_id: 25`).
Value of the turn is the two measurement traps it exposed, not the actions taken.

## Snapshot

| Item | Value |
| --- | --- |
| watcher | `action=none`, `new_failures: []`, `newest_run_id 31252137459` |
| state file | already `31252137459` (== newest) ⇒ **skip the write** |
| newest `main` sha | `0bd4c3a4` = `docs(soul): 第十九章` (docs-only) |
| main reds | OmniCore `31250979668`, Sacred `31250979702` — inherited, tracked (#471) |
| top 5 runs | all `event=pull_request` @ `22133547` = PR #470's new head |

Both standing provenance rules fired at once: `event=push` on main was a docs-only commit
(inherited reds), and every newer run was PR fan-out. Neither is an incident.

## Coverage decision (head-sha push time, never `createdAt`)

| PR | head | head pushed | newest comment | verdict |
| --- | --- | --- | --- | --- |
| #470 | `22133547` | **10:08:33** | 09:44:19 | **stale ⇒ supersede** |
| #468 | `ff9e9114` | 08:57:06 | 09:44:09 | covered ⇒ silence |
| #469 | `f25b2463` | 08:58:12 | 09:19:44 | covered ⇒ silence |

Only #470 got a comment. One supersede comment per head sha.

## TRAP 1 — a count delta that was pure log rendering

OmniCore, PR #470 vs main baseline `31250979668`:

```
grep -ohE "...|CLI build failed|..." r31252137447_omni_pr470.log   →  3 CLI build failed
grep -ohE "...|CLI build failed|..." r31250979668_omni_main.log    →  6 CLI build failed
```

Reads as "half the CLI failures fixed". It was **not**. The authoritative aggregate was identical:

```
main: Test Files  3 failed | 44 passed (47)
PR:   Test Files  3 failed | 44 passed (47)
```

De-ANSI'd inspection showed why — the pattern matches two different line kinds:

```
main: Error: CLI build failed                                        (×3)
main: 17|   if (build.status !== 0) throw new Error('CLI build failed')  (×3)   → 6 total
PR:   17|   if (build.status !== 0) ...                              (×3)   → 3 total
```

The two runs emitted different subsets of the code frame. The count measured **verbosity**, not
failures. Tracker #465 was unchanged. Reporting "6 → 3" would have fabricated a partial fix.

## TRAP 2 — ANSI codes made correct patterns return empty

Both of these returned **nothing at all**, on logs where the lines were plainly present:

```bash
grep -ohE "Test Files +[0-9]+ failed \| [0-9]+ passed \([0-9]+\)" <log>   # EMPTY
grep -ohE "FAIL cli/[a-z0-9/_.-]+" <log>                                  # EMPTY
```

Real bytes: `^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m...` — the colour
codes sit *between* the tokens, so any pattern with interior spaces/pipes/parens fails.

An empty grep is indistinguishable from "the failure is gone", so this fabricates a PASS exactly the
way the aborted-linter trap does. Working form:

```bash
grep -ah "Test Files" <log> | tail -3
grep -ah "CLI build failed" <log> | sed -e 's/\x1b\[[0-9;]*m//g' | cut -c1-150
```

Short literal to prove presence; de-ANSI only to read the number.

## The verdict, once measured correctly

Same-workflow vs same-workflow only:

| Workflow | main | PR #470 | ESLint |
| --- | --- | --- | --- |
| OmniCore CI | `31250979668` @ `0bd4c3a4` | `31252137447` | `205 (0 err)` → `196 (0 err)` |
| Sacred Pipeline | `31250979702` @ `0bd4c3a4` | `31252137431` | `140 (0 err)` → `131 (0 err)` |
| ESG-GO CI/CD | `31246837247` @ `845e74bd` | `31252137437` | `140 (0 err)` → `131 (0 err)` |

Consistent **−9 warnings, 0 errors** everywhere. Everything else flat:

- failing job/step sets identical in all three (`cut -f1,2 <log> | sort -u`)
- `Test Files 3 failed | 44 passed (47)` — flat
- `Possible secret detected` 2 → 2 — flat
- Trivy `Total:` — `1(C:1)`, `1(H:1)`, `4(H:4)`×2, `8(H:7,C:1)` identical **verified per file**
  (the combined two-file grep gave an even split `2/2/4/2`, which only *suggests* symmetry)
- `static-components` 0 → 0

Verdict: no regression, a −9 improvement, all reds inherited from #465 / #430 / #429 / #444.

## Reusable checklist

1. Watcher result is a hint — gap-scan by sha regardless of `action`.
2. Resolve provenance before triage: `event=pull_request` ⇒ PR noise; `event=push` ⇒ read the commit.
3. Coverage staleness = head-sha **push time** vs `comments[-1].createdAt`.
4. Prove presence with `grep -ah "<literal>"`; de-ANSI only to read values.
5. Never report a count delta without confirming it against a summary line or `--json jobs`.
6. Re-grep per file — combined greps lose attribution.
7. State file equal-to-newest ⇒ skip the write and say so.
