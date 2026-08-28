# Push scope beats commit type; and `Possible secret detected` counts the workflow's own echo

Cron poll, 2026-08-08 12:45 turn. Watcher returned `action=delegate` with 4 new failures — all
`event=push` on `main`, so the PR-noise filter did not fire and this looked like real production
breakage. It was 100% inherited. Two separate lessons came out of it.

---

## 1. The provenance question is CHANGED PATHS, not the commit type

The existing "`event=push` on main is NOT automatically an incident" rule was written around a
`docs(soul):` commit, which invites the shortcut *"conventional-commit type says `docs:` ⇒
inherited; anything else ⇒ real"*. That shortcut is wrong.

| sha | commit subject | changed files | delta |
| --- | --- | --- | --- |
| `36229367` | `fix(deploy): s2s 改用 transformers 直載 gemma4:e2b 省 RAM + nginx 路徑偵測` | `_tmp_vps/deploy_voice_agent.sh` | `+132 / -0` |
| `3333cd10` | `feat(watchdog): VPS OOM 看門狗 每10min探活+恢復自動deploy_voice_agent` | `_tmp_vps/watchdog_vps.sh` | `+40 / -0` |

Both are typed `feat` / `fix` — they read as production code — yet neither can move any gate,
because `_tmp_vps/` is outside every gated scope in the repo.

Command (one per sha; read the `N file(s) changed` footer):

```bash
git show --stat --oneline <sha> | head -12
```

Ask: **does any changed path fall inside a scope a failing job actually consumes?** In esggo:

| Gate | Scope it reads |
| --- | --- |
| ESLint | `src/`, `app/` (`pnpm exec eslint src/ app/ --max-warnings 50`) |
| Vitest | root vitest include globs (`tests/`, `cli/*/src/`, …) |
| Secret Scan | working-tree `grep -r` minus `node_modules` / `.next` |
| Validate VPS Scripts | `vps/**/*.sh` + other shell |

`_tmp_vps/*.sh` matched none of the first three, so identical counts were guaranteed *before*
fetching the baseline. Single-file, purely additive (`-0` deletions) is the easiest case to clear.

Baseline confirmation (OmniCore CI, same workflow both sides):

| Signal | main `36229367` (`31257405965`) | main `3333cd10` (`31257544563`) |
| --- | --- | --- |
| ESLint summary | `205 problems (0 errors, 205 warnings)` | `205 problems (0 errors, 205 warnings)` |
| `Test Files` | `3 failed \| 44 passed (47)` | `3 failed \| 44 passed (47)` |
| `Possible secret detected` | 2 | 2 |
| `CLI build failed` | 6 | 6 |
| `static-components` | 0 | 0 |
| `ERR_PNPM_*` | 0 | 0 |

### The positive half: match the changed file type to its gating job

Absence of new signals is weak evidence. The strong version is finding the job that **would** have
caught a regression from this specific commit and confirming it ran green. These commits added 172
lines of shell; `gh run view 31257544563 --json jobs` showed:

```
success  Validate VPS Scripts
```

That job runs `bash -n`, i.e. the `repair-shell` class gate. So the new scripts are positively
verified as syntactically clean, not merely "unchanged in colour". Two more freebies from the same
call: `learning-center-ci` green ⇒ 13th class (`TYPES_OUT_OF_SYNC`) still resolved;
`static-components` 0 ⇒ 14th class still resolved.

Full job table for that run:

| Job | Conclusion | Cause | Tracker |
| --- | --- | --- | --- |
| ESLint | failure | `205 (0 errors, 205 warnings)` vs `--max-warnings 50` | #444 |
| Vitest Tests | failure | `cli/*` unregistered workspace | #465 |
| Secret Scan | failure | `firebase-service-account.json` | #430 |
| agents.yaml Verification | success | — | — |
| Validate VPS Scripts | success | — | — |
| TypeScript Check | success | — | — |
| Worker Check | success | — | — |
| Build Check / Lighthouse CI / Docker Build Test | skipped | upstream job failed | — |

---

## 2. `Possible secret detected` = 2 is ONE detection — the workflow echoes its own source

Second mechanism for the "counts measure log verbosity, not failures" trap. The known cause is
vitest printing an error line **plus** the code frame quoting it (`CLI build failed` 6 = 3 real
failures × 2 lines). This one is different and applies to *any* signature that appears literally
inside the workflow's own shell:

```bash
grep -ah "Possible secret detected" r31257544563.log | sed -e 's/\x1b\[[0-9;]*m//g' | cut -c1-180
```

```
Secret Scan  Scan for committed secrets  ...Z ^[[36;1m  echo "::error::Possible secret detected in source code — aborting."^[[0m
Secret Scan  Scan for committed secrets  ...Z ##[error]Possible secret detected in source code — aborting.
```

Line 1 is GitHub Actions echoing the **`run:` script source** into the log (the `^[[36;1m` cyan
command echo). Line 2 is the actual `##[error]`. So the count is inflated by exactly the number of
times the phrase appears in the workflow YAML — here `2 → 1 real detection`.

This matters because the skill's own history quotes `Possible secret detected` as `2 → 2` and
`2 → 0`. Those transitions are still correct as *deltas*, but `2` was never two secrets.

**Disambiguate by anchoring on the annotation prefix, not the phrase:**

```bash
grep -c '##\[error\]Possible secret detected' <log>     # real detections
grep -c 'Possible secret detected'            <log>     # detections + YAML echo
```

General rule: when a signature is a string the workflow itself prints, `grep -c` counts
`real_hits + occurrences_in_the_run_script`. Anchor on `##[error]` / `##[warning]` , or fall back to
the authoritative aggregate (`Test Files`, `✖ N problems`) or `--json jobs`.

---

## Outcome of the turn

Three failing jobs, three root causes, all pre-existing and tracked (#444 / #465 / #430).

- **0** new issues (root-cause dedupe; every cause already had a tracker).
- **1** comment, posted to the one uncovered surface: `(unknown)` issue **#477**, confirmed via
  `gh issue view 477 --json comments --jq '.comments | length'` → `0`. (#465 had 3, #444 had 2,
  #430 had 5.) Landed as `issuecomment-5226176362`.
- **1** Telegram digest (`ok: True message_id: 32`).
- **0** state writes — state file already equalled the newest run id `31257593762`.
- Nothing landable: #472/#470/#469/#468 all `isDraft=true`; #449/#450 are the stale route-B
  lockfile PRs that must not be merged.

`#430` re-confirmed as still-live P0: `git cat-file -e origin/main:firebase-service-account.json`
→ present, repo `PUBLIC`, and esggo's Secret Scan is a working-tree grep, so deleting the file would
turn CI green while the key stays retrievable from history. Close only on provider-side revocation.
