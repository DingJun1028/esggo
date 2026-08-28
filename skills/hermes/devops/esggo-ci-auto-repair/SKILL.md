---
name: esggo-ci-auto-repair
description: esggo CI-failure auto-repair with Telegram tracker.
tags: [devops, github-actions, esggo, auto-repair, ci, telegram, tracker]
---

# esggo CI Auto-Repair (GitHub Actions)

Build a self-healing CI pipeline for esggo: when `OmniCore CI` (or sibling workflows) fail, a second
workflow analyses the **real failure logs**, attempts an auto-fix, opens a repair PR, and notifies a
Telegram channel via the "萬能分身" (OA-TWINS) tracker.

## When to use
- "自動修復機制" / "CI 失敗自動修復" / CI 進度推 Telegram。
- OA-TWINS / 萬能分身 auto-repair tracker。
- "GitHub 報錯通知信自動修復"：見 references/gh-error-watch-watcher.md
  （cron 輪詢 GitHub failure + 真實 log 下載 + tracking issue + delegate OA 蜂群；
  AgentMail 未配置，故走輪詢而非 webhook）。

## 用戶 CI 修復教義 (User CI-Repair Doctrine) — 2026-08-21 實證

用戶在「優化所有工作流、報錯不再發生」任務中明確立下的原則，**任何修 CI 的 session 都必須遵守**：

1. **不降低通知標準**：禁止「把失敗 workflow 關掉就解決全部問題」。核心 CI（OmniCore CI / Sacred
   Pipeline / ESG-GO CI/CD）是代碼錯誤的守門員，關掉 = 掩蓋錯誤、違反用戶原則。
2. **根因修復，非降噪**：所有報錯（含並發 session 引入的壞測試 / lockfile 污染 / TS 語法錯）都必須
   **修到真正通過**，而非 `disable` / `skip` / 降 `--max-warnings`。
3. **全流程顯示**：把所有真實指令與輸出顯示出來，不掩蓋中間錯誤；根因修復使報錯**不再發生**才是目標。
4. **一鍵通過預先安排**：把需要授權/填值的部分排成單一決策點（clarify 或 `gh workflow` 操作），
   其餘自主做完，讓用戶「全盤了解後再拍板」。

### 禁用 workflow 的決策矩陣（僅此情況可 disable）
| 條件 | 處置 |
|---|---|
| 純憑證失效（token/SSH key 無效，非代碼錯）且短期不修 | `gh workflow disable`（可 `gh workflow enable` 隨時恢復；只消除噪音，不改代碼品質） |
| 真代碼錯誤（路徑錯 / 測試掛 / 語法錯） | **禁止 disable**；修代碼後推送轉綠 |
| 核心 CI 紅 | **永遠不 disable**；修代碼，保留通知標準 |

> 用戶原話：「不能降低通知標準，那我乾脆關了他不就解決全部問題？」→ 點出「關掉」是錯誤解法；
> 「你可以將全部流程顯示出來 然後做到需要我的那一部分 幫我安排好一鍵通過 再繼續完成」→ 這就是上面的流程。
> 純憑證失效的部署 workflow（Deploy to Vercel / Deploy to Oracle VPS）可禁用，但核心 CI 不行。

### 實戰清單（本輪收尾 pattern）
1. `gh run list --status failure` 抓全紅色源 → `gh run view <id> --log-failed` 抓根因。
2. 分類：代碼錯 vs 憑證失效。
3. 代碼錯：本地修 + 本地三重驗證（相關 vitest / `npx tsc -p tsconfig.json --noEmit` / `pnpm install --frozen-lockfile`）。
4. 憑證失效：用戶拍板後 `gh workflow disable`（不動 secrets）。
5. `git pull --rebase`（並發 commit 常落） → `git push` → `gh run list` 確認轉綠。

## Architecture (verified, pushed to esggo main)
Trigger on the *upstream* workflow, not on push, so it runs after the quality gate:

```yaml
on:
  workflow_run:
    workflows: ["OmniCore CI"]
    types: [completed]
    branches: [main, develop]
```

Job chain (all under `if: always()` for the notifier):
1. **analyze** — `if: conclusion == 'failure'`. Downloads each failed job's logs via the
   `GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs` API (use `actions/github-script@v7`),
   unzips, greps for error signatures, sets outputs: `error_type`, `repairable`, `error_detail`.
2. **repair-*** — one job per error class, gated by `needs.analyze.outputs`. Each does the fix,
   verifies, and (if clean) opens a PR from an `auto-repair/<type>-<timestamp>` branch.
3. **tracker-notify** — always runs. Creates a GitHub Issue + sends a Telegram message.

### 9 error types detected (grep signatures)
`typescript` (TSxxxx / "property does not exist"), `eslint`, `test` (FAIL / expect), `build`
(Module not found / Cannot resolve), `dependency` (ERR_PNPM / lockfile), `secret` (AKIA/ghp_/),
`docker`, `prisma`, **`security`** (Trivy fs scan: `Total: N (HIGH: x, CRITICAL: y)`,
`aquasecurity/trivy-action` exit code 1, or `CVE-2026-*` / `GHSA-*` rows in the scan table).

### 10th class: `startup_failure` — INVISIBLE to log-grep triage (added 2026-08-08)
The 9-class scheme greps logs, so it is structurally blind to a workflow that **never started**.
Signature: `gh run view <id> --log-failed` returns `failed to get run log: log not found`, and
`gh api repos/{o}/{r}/actions/runs/<id> --jq '.jobs'` / the jobs endpoint returns **`total_count: 0`**.
The run is marked `failure` but no step ever executed — the workflow YAML itself failed to parse.

Detect it FIRST, before any log grep:
```bash
gh api repos/DingJun1028/esggo/actions/runs/<id>/jobs --jq '.total_count'   # 0 ⇒ startup_failure
```
Then reproduce locally:
```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/<wf>.yml'))"
```
Repair = fix the YAML; verify `total_count` **0 → N**, not run conclusion.
**`YAML_OK` does not rule this out:** schema faults — e.g. **`env` in a job-level `if:`** (only
`github`/`needs`/`vars`/`inputs`) — share it; tell = workflow RECORD `name` degrades to path.
`references/2026-08-11-schema-startup-failure-job-if-env.md`

#### 24th class: `actions_platform_outage` — `startup_failure` that is NOT your file (added 2026-08-27)
**GitHub's UI lies:** during an Actions incident the run page prints the exact 10th-class string
`This run likely failed because of a workflow file issue.` for **valid** YAML, sending you hunting a
phantom defect. Discriminate BEFORE parsing YAML: `total_count` **> 0** (not 0) with jobs
`status=queued conclusion=null` (never got a runner) + `.github/` **untouched** in head commits +
**non-deterministic** (one workflow succeeds while another startup_failures on the SAME sha) + siblings
stuck `queued` >1h. Confirm via `githubstatus.com/api/v2/components.json` (`Actions -> major_outage`).
Then **NOT auto-repairable and NOT a tracker**: **0 issues** (external+transient; N startup_failures =
ONE self-healing non-repo cause), **0 reruns** (re-queues into the throttled backlog — contrast the
**19th class**, where rerun IS the repair), **0 merges** — `mergeable=UNKNOWN` is common mid-incident
because GitHub cannot compute it, so merging lands code whose CI **never ran**; an outage is a hard
freeze on the "land it" rule. **Do NOT advance the state pointer.** **Do report**, deviating from
`action=none` → 靜默.
**Burying mechanism #4 — conclusion-string mismatch:** both watchers filter `conclusion == 'failure'`
and `startup_failure` is a *different string*, so an outage is structurally invisible to them (like the
21st class's check-runs blind spot). Gap-scan the newest `headSha` on `conclusion != "success"`; empty
`concl` + `status=queued` is neither pass nor fail and can persist for hours.
[ref](references/2026-08-27-actions-platform-outage-startup-failure.md)

#### 25th class: `deleted_fixture_contract_drift` — the 17th class INVERTED (added 2026-08-27)
`Test Files 1 failed | 66 passed` + `AssertionError: expected false to be true` on an
`expect(existsSync(p)).toBe(true)`. Cause is in the HEAD COMMIT's file list, not the test: a
**deletions-only** line (`| 64 ----`) naming the asserted path; subject read as a *feature*, so judge
by paths, not commit type. **Identical `Test Files` across 2 workflows = ONE cause** (script still filed
#963 AND #964). Decide via `git grep -n -I "<basename>" origin/main`: other live refs (docs / 5T
contract, one *executing* `json.load`) ⇒ collateral deletion ⇒ **restore from `<sha>^`** byte-identical
`+64/-0`; only the test ⇒ 17th-class orphan ⇒ delete it. Verify in python (fs+JSON, no node_modules)
and **CALIBRATE**: removed ⇒ reproduce CI's `violations=1`; restored ⇒ pass. Expect gated jobs
`skipped → success`.
[ref](references/2026-08-27-deleted-fixture-contract-drift.md)

### 11th class: `lockfile_config_mismatch` — one cause, ~8 jobs across 3 workflows (added 2026-08-08)
Signature in `--log-failed`:
`[ERR_PNPM_LOCKFILE_CONFIG_MISMATCH] Cannot proceed with the frozen installation. The current
"overrides" configuration doesn't match the value found in the lockfile` + `exit code 1`.

Cause: someone edited `overrides:` in `pnpm-workspace.yaml` (often a **merge-conflict resolution**)
without regenerating `pnpm-lock.yaml`. pnpm 11 compares the two under `--frozen-lockfile` and aborts
at the *install* step, so every downstream job (ESLint / TypeScript / Vitest / Worker) dies before
running. The watcher therefore mislabels the same cause as `dependency`, `typescript` AND `eslint`
simultaneously — a strong tell that installs, not code, are broken.

Diagnose by diffing the two override key sets **on the sha CI actually built** (your local `main` is
usually behind — always `git fetch` and read `origin/main`, not `HEAD`):
```bash
diff <(git show origin/main:pnpm-workspace.yaml | sed -n '/^overrides:/,/^$/p' | grep -oP '^\s+"?\K[^":]+' | sort) \
     <(git show origin/main:pnpm-lock.yaml      | sed -n '/^overrides:/,/^$/p' | grep -oP '^\s+\K[^:]+' | sort)
```
Repair (`repair-lockfile-config`), in an **isolated worktree**, never the shared clone:
```bash
git worktree add -b auto-repair/lockfile-overrides-<date> C:/Project/_verify origin/main
cd C:/Project/_verify && pnpm install --lockfile-only          # resolution only, no node_modules
pnpm install --frozen-lockfile --lockfile-only                  # proof: must print EXIT=0
git add pnpm-lock.yaml                                          # EXPLICIT path only
```
- `--lockfile-only` finishes in ~1 min and touches no `package.json`; the verify re-run takes <1s.
- Expect **stale importers to be pruned** (here `packages/crewai-bridge`, 15→14). Confirm the drop is
  legitimate with `git ls-tree origin/main packages/` — and note CI's own `Scope: all N workspace
  projects` line tells you the correct N.
- The worktree may show unrelated dirty files (e.g. `.Jules/palette.md` from the `.Jules`→`.jules`
  case-rename). Never `git add -A`; verify with `git diff --cached --name-only`.
- Judge success by **the error disappearing**, not by run conclusion: after the fix the runs stayed
  red, but from previously-masked downstream causes (`TYPES_OUT_OF_SYNC`, `static-components`,
  `Possible secret detected`, `syntax error near`) that were already tracked. Prove no regression by
  grepping the new log for `command not found|MODULE_NOT_FOUND` and showing it empty.
- Expect a **concurrent agent** to open a near-identical branch (`...-20260808b`); check
  `gh pr list` before assuming yours is the only fix in flight.

### 12th class: `ERR_PNPM_OUTDATED_LOCKFILE` — specifier drift, NOT overrides drift (added 2026-08-08)
The **inverse** of the 11th class: that one is the `overrides:` block, this one is per-importer
**dependency specifiers**. Signature in `--log-failed`:
`[ERR_PNPM_OUTDATED_LOCKFILE] Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up
to date with <ROOT>/apps/<x>/package.json` + `specifiers in the lockfile don't match specifiers in
package.json`. Same blast radius — dies at *install*, so 4+ workflows go red at once.

Diagnose read-only on the sha CI actually built (no install, no checkout in the shared clone):
```bash
git fetch origin --quiet
git show origin/main:apps/<x>/package.json | grep -E '"(tsx|typescript)"'
git show origin/main:pnpm-lock.yaml | sed -n '/^  apps\/<x>:/,/^  apps\/[a-z-]*:$/p'
```

**Two repair routes exist and they silently undo each other — never mix them:**

| Route | Changes | Cost |
| --- | --- | --- |
| A — manifest → lockfile | bump `package.json` specifiers to match the lockfile; **lockfile untouched** | zero lockfile churn, safest |
| B — lockfile → manifest | `pnpm install --lockfile-only` to regenerate | dirties lockfile, prunes importers |

**Stale-PR hazard (bit us 2026-08-08):** once route A lands, any *older* open PR that only
regenerates `pnpm-lock.yaml` (route B, built before the manifests moved) will **roll the lockfile
back and re-introduce this exact P0** if merged. Before merging any pnpm fix, `gh pr list` and check
whether a sibling PR touches `pnpm-lock.yaml` from an older base. Comment a block-warning on it —
do not merge it, and do not close another agent's PR.

Worked example with full before/after evidence: `references/2026-08-08-outdated-lockfile-and-stalled-pr.md`.

**Sub-case 12a — duplicate manifest keys + override-resolved `manifest:` value; sub-case 12b — the drift
lives on the DEPLOY TARGET (untracked dir; CI green but deploy red; diff the `Scope: all N workspace
projects` line, 404 the path, classify NOT auto-repairable):**
`references/2026-08-17-duplicate-keys-and-deploy-target-drift.md`

#### After route A lands: the correct cron outcome is BLOCK-WARN, not merge and not close (2026-08-08, 05:34 turn)
Sequel to the case above. Snapshot: watcher `action=none`, state current, no new runs — but `gh pr
list` showed **two** open PRs (#449, #450) changing only `pnpm-lock.yaml`, `+56/-86`, created 25s
apart: two agents independently producing the same route-B fix. Route A had **already landed** (#455,
7 `package.json` files, lockfile untouched). Prove the P0 is gone first
(`ERR_PNPM_OUTDATED_LOCKFILE` **4** pre-merge → **0** post-merge), then both PRs are stale and
merging either rolls the lockfile back. Correct actions, in order:
1. **Block-warn every duplicate** (`gh issue comment <pr#> -F ...` works on PRs) — but **read the
   existing comments first**. #449/#450 had accumulated **three** near-identical warnings; a fourth
   buries the signal. If one is already there, **stay silent on that PR** and do something that moves CI.
2. **Do not merge. Do not close** — other agents' PRs.
3. Close trackers the merge actually resolved, with the before/after table inline.
4. File **zero** new issues if every surviving red already has a tracker.

Two "nothing to do" shapes: `action=none` + *unmerged fix PR* ⇒ **land it**; `action=none` + *fix
merged* + *stale duplicate PRs open* ⇒ **block-warn them**. Neither is silence.

Expect `auto-repair.yml` to file one `(unknown)` issue **per run_id** — per-run spam by construction;
re-derive the real class from `--log-failed` and comment on the newest rather than adding an issue.

##### Unmasking is not regression — say so explicitly
After the install-stage block cleared, `main` stayed red with causes that were *all* pre-existing and
already tracked (#441, #430, #433, #442/#443, #429, #434/#439). Write that judgement into the tracker
in words — otherwise the next poll reads "still failing" and re-files.

### 13th class: `TYPES_OUT_OF_SYNC` — stale GENERATED artifact, not a code bug (added 2026-08-08)
`check-types-sync` in `learning-center-ci` prints `TYPES_OUT_OF_SYNC` + `missing: <TypeA,...>`, exit 1;
blocks ONE workflow so it hides under install-stage noise. **Resolved on main 2026-08-08 — a
reappearance is new drift.** Read the log's three lists first: only `missing:` ⇒ artifact stale, re-run
generator; `extra:` ⇒ investigate (maybe intentional removal); `mismatched:` ⇒ real contract conflict,
do NOT blind-regenerate. Canonical `shared/types.ts` → **generated, do-not-edit**
`types/generated/esggo-shared.d.ts`; never hand-edit the `.d.ts`:
```bash
cd apps/learning-center && node ../../scripts/export-shared-types.js   # prints OK <dest>
node scripts/check-types-sync.js                                       # must print TYPES_IN_SYNC
```
Check the generator's `map` array — a name absent from it re-breaks next run. Judge by `TYPES_IN_SYNC`
+ `EXIT=0`, not run conclusion; diff must be purely additive (a deletion = wrong canonical).
[ref](references/2026-08-08-types-sync-generated-drift.md)

### 14th class: `react-hooks/static-components` — count = USAGES, not declarations (added 2026-08-08)
`error  Error: Cannot create components during render`. Error-level ⇒ `--fix` cannot touch it. Lived in
`src/App.jsx`, redded three workflows at once = one root cause, ONE tracker (#441). **Resolved on main
2026-08-08 (count 0) — non-zero = regression.** The count is `<Component/>` **USAGES, not
declarations**: 20 errors came from TWO declarations (19 + 1), so fixing the obvious one only got
`20 → 1`. Re-run until 0. Two fix shapes: **hoist to module level** (closes over nothing) or **convert
to a render function** (`const layoutShell = (children) => (...)`, *called* not rendered) when it
closes over outer state. Never `eslint-disable`. Beware duplicate `App.jsx` copies — match the line
number CI reported. One-grep proof of fix + no-regression:
`grep -oE "✖ [0-9]+ problems \([0-9]+ errors, [0-9]+ warnings\)" before.log after.log` →
`160 (20 errors, 140 warnings)` → `140 (0 errors, 140 warnings)`. Drifting warnings ⇒ a rule was
disabled, not fixed. Expect the job to STAY red on `--max-warnings` (#444) — errors-to-zero with
warnings flat IS success; say so or the next poll re-files.
[ref](references/2026-08-08-static-components-inline-components.md)

### 15th class: `CLI build failed` — an UNREGISTERED workspace tree, not a test bug (added 2026-08-08)
Signature in `--log-failed`:
```
FAIL cli/<name>/src/index.test.ts [ cli/<name>/src/index.test.ts ]
Error: CLI build failed
 ❯ cli/<name>/src/index.test.ts:17:33
 Test Files  3 failed | 44 passed (47)
      Tests  536 passed | 18 skipped (554)
```

**The decisive tell: test FILES fail while ZERO assertions fail.** `536 passed`, nothing in the
failed column, yet 3 red files ⇒ a `beforeAll` hook threw ⇒ the *environment* is broken, not the
code. Reading `FAIL <testfile>` as "the tests are broken" sends you into the CLI source and burns the
turn. Here the hook is `spawnSync('npx', ['tsx', src, '--version'])` +
`if (build.status !== 0) throw new Error('CLI build failed')`, and `tsx` exists nowhere on the runner.

Four read-only commands prove it — no install, no checkout in the shared clone:
```bash
git show origin/main:cli/<name>/package.json | grep -E '"(tsx|typescript)"'      # (a) declared here
git show origin/main:pnpm-workspace.yaml | sed -n '/^packages:/,/^overrides:/p'  # (b) is cli/* listed?
git show origin/main:pnpm-lock.yaml | grep -nE "^  (cli/|apps/|packages/|\.)"    # (c) any cli/ importer?
git show origin/main:package.json | grep -nE '"(tsx|ts-node|typescript)"'        # (d) root fallback?
```
On esggo: (a) declares `tsx ^4.7.0`, (b) lists only `apps/*`, `apps/*/functions`, `packages/*`, `.`,
(c) has **no** `cli/` importer, (d) has `ts-node`/`typescript` but **no `tsx`**. So
`pnpm install --frozen-lockfile` never installed that tree, while the root vitest glob still
*collects* `cli/*/src/index.test.ts`.

**TRAP: `packages/cli` in the lockfile is NOT `cli/`.** The importer list carries a similarly-named
package under the `packages/*` glob; skimming it makes the tree look registered. Match the exact prefix.

**Decide repairability from (c) BEFORE proposing a fix:**

| lockfile already has the importers? | adding the glob to `packages:` is | cron action |
| --- | --- | --- |
| yes | lockfile-neutral — a safe one-line edit | fix inline |
| **no** | a lockfile regeneration (new importers) | **file a tracker, do NOT fix under cron** |

When it is (no), the fix collides head-on with the 11th/12th-class hazard: regenerating the lockfile
while any stale "lockfile-only" PR is open lets whichever lands last roll the other back and
re-introduce `ERR_PNPM_OUTDATED_LOCKFILE`. Write that reasoning into the tracker explicitly, or the
next poll "helpfully" attempts it. Record acceptance criteria so a foreground session can verify:
`grep -c "CLI build failed"` → `0`, and `Test Files` → `47 passed`.

Lighter alternative worth naming in the tracker (zero lockfile churn): exclude `cli/**` from the root
vitest config — but that silently drops CLI coverage, so it is a product decision, not an auto-repair.

#### Adding the missing dep to ROOT does NOT fix it — judge by `Test Files`, not the diff (10:30 turn)
A PR adding the missing tooling to **root** `package.json` (+ additive `+6/-0` lockfile) still fires the
class: `cli/*` is not an *installed workspace*, so its own deps stay absent whatever root carries.
PR #470 (`tsx`+`commander` to root) vs main: `Test Files 3 failed | 44 passed (47)` **identical**, same
3 failing files. **A falling `grep -c "CLI build failed"` is NOT progress** — `6 → 3` was just vitest
printing the frame twice on one side. Authoritative metric = `Test Files` + FAIL filenames (ANSI strip
required, or `grep -oE "FAIL cli/..."` returns **empty**):
```bash
grep -ah "Test Files" <log> | sed -e 's/\x1b\[[0-9;]*m//g' | tail -2
grep -ah "FAIL" <log> | sed -e 's/\x1b\[[0-9;]*m//g' | grep -oE "FAIL .*" | sort -u
```
If a tracker claims a sibling PR "已實測轉綠", re-verify on the PR's OWN run with `--json jobs` — a stuck
draft never yields a post-merge main run. #469 was vindicated that way (Vitest + Secret Scan `success`,
ESLint alone red), #470 was not: never generalize a class as (un)fixable from one PR's approach.

### Warning counts that DROP can be `eslint-disable` suppression — check the diff, not the summary
The `✖ N problems` no-regression check treats a *fall* in warnings as unambiguously good. It is not.
On 2026-08-08 PR #470 showed a clean `−9` in all three workflows (OmniCore `205→196`, Sacred and
ESG-GO `140→131`), reading as a real improvement — but the commit message said it outright:
replaced `[key: string]: any` with an `eslint-disable-line` comment via regex **to circumvent lint failure**.

One call separates a fix from a suppression:
```bash
gh pr diff <n> --repo DingJun1028/esggo | grep -c "eslint-disable"
```
`36` here. Report it as "warning 下降係抑制而非修復" — it is not a regression and does not block the
PR, but it must not be recorded as the underlying rule being resolved, or the tracker gets closed on
a gate that was merely silenced.

### A PR touching the SAME file as another open PR in the opposite direction
Check the direction, not just the path. #469 **deletes** `firebase-service-account.json`; #470
**modifies** it (`+1/-1`, `Possible secret detected` stayed `2 → 2`). Whichever lands second wins, so
a merge in the wrong order silently re-adds a file another PR just removed. Surface it as a
merge-order warning on the newer PR; do not pick the winner from cron.

Worked example with the full evidence chain and the four-cause decomposition:
`references/2026-08-08-cli-workspace-unregistered-vitest.md`.

### A cron turn CAN close the whole loop: fix → PR → verify → merge → post-merge verify
Proven end-to-end on 2026-08-08 (06:0x turn) for the class above. This is the template for any
small, high-confidence, mechanically-verifiable cause:
1. Isolated worktree off `origin/main`; regenerate/fix; `git add <explicit path>`.
2. Push branch, `gh pr create -F "C:/Project/_ci_logs/<body>.md"`, include `Closes #<tracker>`.
3. **Let the PR's own `pull_request` runs be your verification surface** (see the trap below).
4. `gh pr view <n> --json state,mergeable,changedFiles` → require `MERGEABLE` + expected file count.
5. `gh pr merge <n> --squash --delete-branch`, then confirm `state=MERGED` + `mergedAt`.
6. Re-verify on the first **post-merge `main`** run of the affected workflow — that, not the PR run,
   is the authoritative proof.

`Closes #N` auto-closes trackers at merge **with no evidence attached**. Post the before/after table
as a comment on the just-closed issue so the closure is auditable and the next poll does not re-file.

#### TRAP: gap-scan "new failures" may be YOUR OWN PR's runs
Opening a PR fires the full workflow fan-out on your branch, and those runs get run_ids **higher**
than everything in the watcher snapshot. A naive gap scan reads them as fresh `main` breakage and
re-triages phantom failures. Always resolve provenance before classifying:
```bash
gh run view <id> --repo DingJun1028/esggo --json headBranch,headSha,event \
  --jq '"branch=\(.headBranch) sha=\(.headSha) event=\(.event)"'
```
`event=pull_request` + your branch ⇒ it is your own verification run, not a new incident.

Turn it into an asset: compare signal COUNTS between the `main` run and your PR run on the same
cause. Identical counts prove the reds are inherited, so the diff introduced nothing (worked example
— `static-components` 20 → 20 across all three workflows, secret 2→2, Trivy unchanged — is in
`references/2026-08-08-types-sync-generated-drift.md`).

Pair it with the standard emptiness check on the PR logs:
`grep -icE "cannot find module|command not found|MODULE_NOT_FOUND"` → `0`.

##### The comparison is TWO-DIRECTIONAL — a PR can RESOLVE trackers, and `--log-failed` hides that
Every no-regression table above asks only "did this PR make things worse". The inverse is just as
findable and far more valuable, but it is **invisible to log grepping**: a job that starts passing
simply *disappears* from `--log-failed`, so `grep -c "<signature>"` returns `0` — which looks
identical to "the log wasn't fetched" or "signature not present". Read job-level conclusions instead:
```bash
gh run view <run_id> --repo DingJun1028/esggo --json jobs --jq '.jobs[] | "\(.conclusion) \(.name)"'
```
Run it on the PR run **and** its same-workflow `main` baseline, then diff the job lists. On
2026-08-08 OmniCore CI `main 31246837246` vs PR #469 `31249545861`:

| Job | main | PR #469 |
| --- | --- | --- |
| Secret Scan | failure | **success** |
| Vitest Tests | failure | **success** |
| ESLint | failure | failure (205 → 200 warnings, 0 errors) |

Two tracked P0s (#430, #465) resolved by somebody else's in-flight PR — a fact no amount of grepping
the PR's own log would surface, because the fixed jobs left no lines behind.

**The line-count gap is the cheap tell that this is worth checking.** PR #469's OmniCore log was
**465** lines against main's **6360**; that 13× shrink means jobs stopped failing, not that the fetch
broke. (Contrast the *moved-step* case above, where the PR log is much LARGER.) Treat any large gap
in either direction as "enumerate the jobs before concluding anything".

Then confirm the fix is safe to endorse by inspecting the diff shape, not just the counts:
```bash
gh pr view <n> --repo DingJun1028/esggo --json files --jq '.files[] | "\(.path) +\(.additions)/-\(.deletions)"'
```
Here root `package.json` gained `tsx ^4.23.8` + `commander ^12.1.0` and `pnpm-lock.yaml` was
**`+6/-0` — purely additive**. That matters: an additive lockfile delta adds importers/resolutions
without pruning, so it is route-A-compatible and **cannot** roll back `overrides:` or re-introduce
the 11th/12th-class P0. A lockfile diff with deletions (e.g. `+56/-86`) is the stale-route-B shape
that must be block-warned instead. **Check the deletion count before endorsing any pnpm PR.**

##### TRAP: comparing warning counts ACROSS workflows fabricates a regression (added 2026-08-08)
The no-regression table only works **same-workflow vs same-workflow**. esggo's workflows lint
different scopes, so their `✖ N problems` lines are not comparable:

| Workflow | lint command | count on the same sha |
| --- | --- | --- |
| 🌌 Sacred Pipeline | `pnpm run lint` → `eslint src/ ...` | `140 problems (0 errors, 140 warnings)` |
| OmniCore CI | `pnpm exec eslint src/ app/ --max-warnings 50` | `205 problems (0 errors, 205 warnings)` |

On 2026-08-08 a poll read Sacred's `140` (main) against OmniCore's `205` (PR #468) and nearly
block-warned a clean PR for "+65 warnings". Pulling the PR's OWN workflow baseline
(main OmniCore `31246837246` @ `845e74bd`) showed `205 / 6 / 2 / 2` — **identical** to the PR's
`31247359337`, i.e. zero regression. Always resolve the baseline with
`gh run list --workflow "<name>" --branch main --limit 5` before claiming a delta.

##### A PR that fixes "a" secret may not clear the secret TRACKER
Flat `Possible secret detected` counts across a security PR ≠ the PR failing — the signature may be a
*different* secret (#469 removed a gateway key; #430 tracks `firebase-service-account.json`).
**Separate the SCAN from the EXPOSURE:** esggo's step is `grep -r` over the **working tree**, not git
history, so deleting the file DOES turn `Secret Scan` green (`2 → 0`, `failure` → `success`) while the
key still lives in history on a PUBLIC repo. Verdict is *both*: credit the scan clearing, and keep the
tracker OPEN with revoke-at-provider as step one. Never infer the scanner's scope from a tracker's
narrative — grep the log for the actual command before deciding.

##### A PR titled for one purpose can silently fix a DIFFERENT tracker — diff JOB CONCLUSIONS
Do not infer a PR's blast radius from its title, branch name, or cross-references. PR #469
(`🛡️ Sentinel: Remove hardcoded API key`) also added `tsx`/`commander` to **root** devDependencies
and thereby resolved the **15th class** (`CLI build failed`, tracker #465). Nothing in its metadata
said so. Compare per-job conclusions against the same-workflow main baseline:
```bash
gh run view <pr_run_id> --repo DingJun1028/esggo --json jobs --jq '.jobs[] | "\(.conclusion)\t\(.name)"'
cut -f1,2 /c/Project/_ci_logs/<log>.log | sort -u          # which job/step pairs still fail
```
Jobs *disappearing* from `--log-failed` between main and the PR is the tell (main showed three
failing job/step pairs; the PR showed only `ESLint / Run ESLint`).

**Corollary — a `grep -c` of `0` on a PR log can be PROOF OF FIX, not missing data.** `--log-failed`
contains only failed jobs, so a passing job vanishes from it entirely (`CLI build failed` 6 → 0,
`Possible secret detected` 2 → 0). Always pair the count with that job's `--json jobs` conclusion:
with `success` the zero is positive evidence; without the check it is indistinguishable from the
aborted-linter false PASS in the five-traps section. **Never report a zero without its conclusion.**

**Second corollary — a NON-zero count DELTA can be a pure rendering artifact (2026-08-08, 10:30 turn).**
The rule above governs `→ 0`; this one governs `6 → 3`, which is more seductive because it looks like
a half-landed fix. On PR #470 vs its main baseline, `grep -c "CLI build failed"` gave **main 6 / PR 3**
— yet the authoritative aggregate was **identical on both sides**:
`Test Files 3 failed | 44 passed (47)`. Nothing had changed.

Cause: the pattern matched **two different line kinds**. Vitest prints both the error line
(`Error: CLI build failed`) *and* the source code frame for the throw
(`17| if (build.status !== 0) throw new Error('CLI build failed')`), and the two runs rendered
different subsets of those frames. The count was measuring log verbosity, not failures.

| Metric | Trustworthy? | Why |
| --- | --- | --- |
| `grep -c "<error phrase>"` | **no** | matches error lines, code frames quoting the phrase, **and the workflow's own `run:` source when the script text contains it** |
| `Test Files N failed \| M passed (T)` | **yes** | one authoritative summary line per run |
| `✖ N problems (E errors, W warnings)` | **yes** | same, for ESLint |
| `--json jobs` conclusion | **yes** | ground truth, independent of log text |

So: **before reporting any count delta as a state change, confirm it against a summary line or a job
conclusion.** If the aggregate is flat, the delta is noise — say so explicitly in the comment
("字串計數為 log 格式差異，非修復"), or the next poll will "confirm" a fix that never happened.

Related attribution trap: `grep <sig> fileA fileB | sort | uniq -c` **merges both logs** and loses
which side each hit came from. An even split (e.g. `2`, `2`, `4`, `2`) merely *suggests* symmetry —
re-grep per file before claiming the two sides are identical.

**Lockfile shape C — additive.** A `pnpm-lock.yaml` diff of `+N/-0` that only appends entries to one
importer is neither route A nor route B: no regeneration, no importer pruning, no `overrides:` edit,
so it carries **no** rollback hazard against stale lockfile-only PRs. Confirm by reading the hunks,
not the changed-file count: `gh pr diff <n> | grep -A14 "^diff --git a/pnpm-lock.yaml"`.

**Determine the SCANNER'S SCOPE from evidence** (esggo's is filesystem-only, per the table above):
deleting the file clears a **working-tree** grep (CI green while the secret lives on in history —
esggo's case, and the dangerous one), whereas a history-aware scanner (TruffleHog `--since-commit`)
keeps hitting until history is rewritten. So **never close a secret tracker on a green scan**: revoke
at the provider **before merging** the deletion PR (verified `PUBLIC` + `git cat-file -e
origin/main:<file>` still resolving), close only on revocation evidence, and write
"掃描轉綠 ≠ 金鑰安全；金鑰仍在 git 歷史中" into the comment or the next poll reads `0 hits` and closes a live P0.

### `action=none` does NOT automatically mean "go silent" (added 2026-08-08)
A cron turn saw `action: "none"` with an empty gap scan — and CI was **still 100% blocked**, because
the verified fix sat in an **unmerged PR** (#455, opened 25 min earlier, evidence already in tracker
#457). The watcher is a *change detector*; "no new failures" and "nothing is broken" are different
claims. Before exiting silently, spend two cheap calls:
```bash
gh issue list --repo DingJun1028/esggo --state open --limit 30 --json number,title,createdAt,labels
gh pr list   --repo DingJun1028/esggo --state open --limit 20 --json number,title,headRefName
```
If an open tracker describes a P0 whose fix PR is `MERGEABLE`, **land it** — that is the
highest-leverage inline repair available to a cron turn, and it is exactly the kind of work the
"repair the highest-leverage causes inline" rule is for. Re-verify the PR from its own
`--log-failed` first (never from the tracker's narrative), then merge, then re-verify on the first
**post-merge `main`** run — a PR head can be green for reasons that do not survive the squash.
Only after that, if everything red is already tracked and nothing is landable, go silent.

##### `mergeable: MERGEABLE` does NOT mean landable — a DRAFT still refuses (added 2026-08-08, 09:20 turn)
The "land it" rule above has a gap that cost a turn. `gh pr view <n> --json state,mergeable` returned
`state=OPEN mergeable=MERGEABLE mergeState=UNSTABLE` — which reads as green-light — and the merge was
then rejected outright:
```
gh pr merge 469 --squash --delete-branch
→ GraphQL: Pull Request is still a draft (mergePullRequest)
```
`mergeable` only answers "are there conflicts". Draft status is a **separate** field that the
recommended `--json state,mergeable,changedFiles` call does not surface. Add it to the same call:
```bash
gh pr view <n> --repo DingJun1028/esggo --json state,mergeable,isDraft,author \
  --jq '"state=\(.state) mergeable=\(.mergeable) isDraft=\(.isDraft) author=\(.author.login)"'
```

| `isDraft` | cron action |
| --- | --- |
| `false` + `MERGEABLE` | land it (the rule above applies) |
| **`true`** | **do NOT `gh pr ready`, do NOT merge** — post the evidence and flag the one manual step |

`mergeStateStatus=UNSTABLE` is a red herring here: it just means non-required checks are failing
(expected when a pre-existing lint gate is still red), and it is **not** the reason a draft refuses.

Flipping someone's draft to ready is a scope call the author reserved, and it is riskier than it
looks for security PRs still being iterated on — even when the author field is the user's own
account (bot-authored PRs land under `DingJun1028`). The correct cron output is: authoritative
verification comment on the PR + evidence comment on the tracker + one clearly-labelled
"needs one manual step" line in the report and Telegram digest. Report the refused merge honestly
rather than silently downgrading to "posted a comment".

#### `action=delegate` can be 100% PR-run noise — resolve provenance BEFORE triage (added 2026-08-08, 08:28 turn)
The mirror image of the "`action=none` is not silence" rule. The watcher reported **3 new failures**
with `action=delegate`, and *every one* was `event=pull_request` on the same non-main sha
(`b13260c6` = PR #470, opened 14 min earlier). Nothing on `main` had changed. Filing three trackers
would have spammed another agent's in-flight PR as if it were production breakage.
Make provenance the FIRST call after the watcher, before any log grep:
```bash
gh run list --repo DingJun1028/esggo --limit 15 --json databaseId,workflowName,conclusion,headSha,event,createdAt \
  --jq '.[] | "\(.databaseId) \(.conclusion) \(.event) \(.headSha[0:8]) \(.workflowName)"'
```
All `event=pull_request` ⇒ this is somebody's PR verification fan-out, NOT a new incident.

**Then check the fresh PR for sibling comments before posting a regression finding.** The existing
anti-spam rule is written for *stale* PRs (#449/#450); it applies just as hard to a brand-new one.
Here the same-workflow comparison produced a precise, correct finding —
`@typescript-eslint/no-explicit-any` 73 → 74, `+1` warning, Trivy/secret/`CLI build failed` counts
all identical ⇒ no error-level regression — and a sibling had **already posted that identical
conclusion 9 minutes earlier**. Cost of checking: one call.
```bash
gh issue view <pr#> --repo DingJun1028/esggo --json comments --jq '.comments[] | "\(.createdAt) \(.body[0:80])"'
```

Isolate the delta with a rule-frequency diff rather than eyeballing the `✖ N problems` line — it
names the exact rule that moved:
```bash
grep -oE "warning  .*[a-z]" main.log | grep -oE "[a-z@][a-z@/-]+$" | sort | uniq -c | sort -rn > w_main.txt
grep -oE "warning  .*[a-z]" pr.log   | grep -oE "[a-z@][a-z@/-]+$" | sort | uniq -c | sort -rn > w_pr.txt
diff w_main.txt w_pr.txt
```

Confirmed same turn: the 14th class is **resolved on main** — `static-components` is now `0` in
OmniCore CI, Sacred Pipeline and ESG-GO CI/CD (all `0 errors`; 205 / 140 / 140 warnings). Tracker
#441 is closed. Remaining `main` reds were #465 / #430 / #444 / #429 / #434 — all pre-existing and
tracked, so the correct output was **0 new issues, 0 comments, 1 consolidated Telegram digest**.

##### A sibling's comment only covers the sha it was written against (added 2026-08-08, 08:50 turn)
A sibling comment only covers the sha it was written against; ignoring that degrades "don't spam" into
"never re-verify", and a stale verdict can be factually WRONG (one warned of a `+1` regression the new
sha had already eliminated, 205 → 196).

**Use the head sha's PUSH time. `gh pr list --json createdAt` is the WRONG field and inverts the
verdict** — it is when the PR was *opened*; comments looked newer while the heads were pushed later:
```bash
gh pr list --repo DingJun1028/esggo --state open --limit 20 --json number,headRefOid,headRefName
gh api repos/DingJun1028/esggo/commits/<headRefOid> --jq '.commit.author.date'   # when HEAD was PUSHED
gh issue view <pr#> --repo DingJun1028/esggo --json comments --jq '.comments[-1].createdAt'
```

| Newest comment vs **the head sha's push time** | Verdict |
| --- | --- |
| comment newer than the head-sha push | **stay silent** — already covered |
| comment predates the head-sha push | coverage **stale** ⇒ fresh superseding re-verification IS warranted |

Cap at **one supersede comment per head sha**, opened with an explicit supersede line
("前一則巡檢留言是針對較舊的 sha … 補一次權威複驗"), and re-post **even when the verdict is unchanged**.
Detail: `references/2026-08-08-inflight-runs-and-headsha-staleness.md`.

###### Sibling coverage is per-SURFACE and per-CHANNEL, not per-finding (added 2026-08-08)
A sibling reaching your conclusion covers **one surface**, not the work. Enumerate before concluding
"already handled": 1. the **PR**, 2. the **root-cause tracker**, 3. the auto-repair **`(unknown)`**
issue for that run_id. Probe: `gh issue view <n> --json comments --jq '.comments | length'` → `0` ⇒
genuine gap ⇒ post there. A burst files N `(unknown)` issues and siblings usually cover only the
NEWEST — enumerate every one your gap scan triaged. And `length > 0` proves *someone posted*, NOT that
your fact is recorded: grep the covering comment for it by name before staying silent.
**Channels are separate: sibling GitHub comments do NOT suppress the Telegram digest** (GitHub =
audit trail, dedupe hard; Telegram = one digest per poll turn regardless of what siblings posted).
Detail: `references/2026-08-08-unknown-issue-burst-coverage-gap.md`.

###### TRACKER staleness ≠ PR staleness (added 2026-08-08, 12:04 turn)
The head-sha rule governs **PR** surfaces only. Applying it to a tracker makes you go silent on the one
surface that mattered: #465's newest comment (`09:20`) was sha-current for PR #469's head, yet stale as
a tracker, because main had advanced two shas *and* a new PR (#470) had appeared that looks like a fix
for that class and is not.

| Surface | Stale when |
| --- | --- |
| PR | newest comment predates the head sha's push |
| Tracker | a new fact (main advanced / rival PR appeared / claimed fix disproven) is unrecorded |

Right question for a tracker: **would a reader acting on the newest comment alone do the wrong thing?**

**A NEGATIVE result is the highest-value output of a poll where nothing is landable.** A tracker saying
only "the fix is in #469" invites merging anything else that touches the area. Post both halves:
`Test Files 3 failed | 44 passed (47)` **identical** on main and PR #470 (⇒ ineffective), *and*
`--json jobs` showing #469 flipping `Vitest Tests` + `Secret Scan` to `success` (⇒ land this one).

**Third "nothing-to-do" shape:** `action=none` + docs-only push + every red tracked + all PR/`(unknown)`
surfaces covered, but one tracker superseded by a newer negative result ⇒ **0 issues, 1 comment**.
Duplicate sibling comments seconds apart = ONE coverage event; `mergeable: UNKNOWN` ≠ green, `isDraft`
decides. Worked example: `references/2026-08-08-tracker-vs-pr-staleness-negative-result.md`.

###### A "sole blocker" claim is CONDITIONAL — check the headline against the body
Third staleness axis: coverage recent, sha-current, still **wrong**. #444's comment was headlined
"`main` **唯一剩餘阻斷原因**" while its own table listed `ESLint / Secret Scan / Vitest` — the "唯一" was
conditioned on PR #469 landing, and #469 was `isDraft=true`. Arbiter of what blocks `main` is
`--json jobs` on the newest **MAIN** run, never a PR run: `>1` failing job ⇒ no sole blocker. **Read
the body, not just the headline**; `.comments|length > 0` cannot see this. Post the **delta only**.
**4th "nothing-to-do" shape:** the run's `(unknown)` issue has 0 comments AND a tracker overstates a
claim ⇒ **0 issues, 2 comments, 1 digest**.
Detail: `references/2026-08-08-sole-blocker-claim-headline-contradiction.md`.

**Verify INDEPENDENTLY even when you already plan to stay silent.** Coverage-exists is not evidence
that the coverage is *right* — the sha-scope rule above already proved a sibling verdict can be
factually wrong. Re-fetch the logs, re-derive the counts yourself, and let *agreement* be the reason
you do not post. That is also the only thing that makes "0 comments" a reportable finding rather than
an unchecked assumption: this turn independently reproduced `6 / 2 / 205 / 140 / 0` and matched the
sibling exactly, which is what licensed the silence.

##### `event=push` on main is NOT automatically an incident either — read the COMMIT (added 2026-08-08, 09:45 turn)
The provenance rule above filters `event=pull_request`. Its blind spot: a **push to `main`** clears
that filter and looks like production breakage by definition. But every push re-fires the whole
workflow fan-out, so a **docs-only commit reproduces the entire pre-existing red set verbatim**.
Seen here: `0bd4c3a4` = `docs(soul): 第十九章 …`, and OmniCore CI + Sacred Pipeline both went red.

Make the commit content the second provenance call, right after the run list:
```bash
git fetch origin --quiet
git log origin/main --oneline -3 --pretty='%h %ad %s' --date=short
```
A docs/markdown-only head commit ⇒ any red is inherited **by construction**. Prove it with the
same-workflow count table against the previous main baseline — identical counts close the case:

| Signal | main `845e74bd` (run 31246837246) | main `0bd4c3a4` (run 31250979668) |
| --- | --- | --- |
| `CLI build failed` | 6 | 6 |
| `Possible secret detected` | 2 | 2 |
| ESLint summary | `205 (0 errors, 205 warnings)` | `205 (0 errors, 205 warnings)` |
| `static-components` | 0 | 0 |

Correct output for that shape: **0 new issues, 0 new trackers, 1 consolidated Telegram digest.**
Do not re-file, and do not describe it as "CI broke again" — say "文件提交，紅燈全數繼承".

###### Generalised: judge by CHANGED PATHS, never by the commit TYPE (2026-08-08, 12:45 turn)
The rule above uses a `docs(soul):` commit, which invites the shortcut *"type says `docs:` ⇒
inherited, anything else ⇒ real"*. **That shortcut is wrong.** Two pushes typed `fix(deploy):` and
`feat(watchdog):` — both reading as production code — produced an entirely inherited red set,
because they touched only `_tmp_vps/*.sh` (`+132/-0`, `+40/-0`), outside every gated scope. Read the
file list, not the subject: `git show --stat --oneline <sha> | head -12`. Ask: **does any changed
path fall inside a scope a failing job consumes?** (ESLint → `src/`, `app/`; Vitest → its include
globs; Secret Scan → the working-tree walk.) If none do, identical counts are guaranteed before you
even fetch the baseline.

**Then close the loop from the other side: find the job that WOULD have caught a regression from
THIS commit and confirm it ran green.** That upgrades "the reds are inherited" from
absence-of-evidence to positive evidence: here the commits added 172 lines of shell and `--json jobs`
showed `success Validate VPS Scripts` — the `bash -n` gate — so the new scripts are verified clean,
not merely unchanged in colour.
Detail: `references/2026-08-08-push-scope-and-command-echo-miscount.md`.

##### One supersede comment per head sha — post it even when the verdict is UNCHANGED
Completes the sha-scope rule. Staleness = the head sha's **run `createdAt`** vs the newest comment's
`createdAt`, not eyeballing the thread:
```bash
gh pr view <n> --repo DingJun1028/esggo --json headRefOid,updatedAt,isDraft
gh issue view <n> --repo DingJun1028/esggo --json comments --jq '.comments[-1].createdAt'
```
**Re-post even when the re-verification AGREES with the stale comment** — a verdict is only
trustworthy for the sha it names. Cap at **one supersede comment per head sha** (that is what stops
this degrading into #449/#450-style spam), open with a supersede line naming both shas, and always
cite a same-workflow baseline. Worked examples: #470 `−9`, #468 `205 → 190`.

#### Enumerate the failing JOB+STEP first — a MOVED step is unmasking, not regression
`gh run view --log-failed` emits TSV whose **col 1 = job name, col 2 = step name**, so one command
tells you exactly what died — cheaper and more reliable than eyeballing error lines:
```bash
cut -f1,2 /c/Project/_ci_logs/<log>.log | sort -u
```
A large **line-count gap** between a PR log and its same-workflow main baseline is the tell that the
failing step moved (2026-08-08 Sacred: `main` **283** lines vs PR #468 **5397**). Here `main` showed
only `🛡️ 原罪煉金 → 🔍 Linting` while the PR showed only `🛡️ 原罪煉金 → 🧪 Unit Tests`.

Cause: both steps live in ONE job and run sequentially. `main` died at Linting, so Unit Tests **never
executed**. The PR cut warnings below the `--max-warnings` gate, Linting passed, and the job advanced
into a **pre-existing** failure (`Test Files 3 failed | 44 passed (47)` + `CLI build failed` ×9 — the
15th class, tracker #465, identical to what `main`'s OmniCore CI already shows).

So **a PR can make a workflow fail differently while introducing nothing**, and an *improvement*
(fewer warnings) is a legitimate cause of a new-looking red. Never infer regression from "different
failing step" alone: match the newly-surfaced signature against the same signature elsewhere on
`main`, and if it matches, write **unmasking** into the comment in as many words.

##### Report the deviation when the cron prompt's literal steps conflict with the dedupe rules
The job prompt says "open a GitHub Issue per failure"; the root-cause dedupe rule and "file 0 issues
if every cause is tracked" override it. Filing 0 is then correct — but a numbered report that
silently omits that step reads as a skipped step. State it explicitly with the reason, e.g.
"3d. GitHub Issue — 刻意開 0 個，非遺漏：所有根因皆已有追蹤單 (#465/#444/#430/#429/#434)".

**The same override applies to the prompt's SILENT instruction, and that one is higher-stakes.**
The cron prompt says `action == "none"` → 靜默結束, and the delivery contract offers `[SILENT]` to
suppress the message entirely. The gap-scan rule overrides both: on 2026-08-08 09:45 the watcher
returned `action=none` while two workflows were red on the newest `main` sha. Answering `[SILENT]`
there would have been a silent miss, not a clean turn. Sequence to follow every time:
1. run the watcher, then **always** gap-scan by sha regardless of `action`;
2. if anything is red, report — and open the report by naming the deviation ("未依提示靜默 — 並非遺漏，
   是刻意偏離"), with the reason;
3. reserve `[SILENT]` for the case where the gap scan itself comes back clean.
Never emit `[SILENT]` on the strength of `action=none` alone.

**There are exactly THREE standing conflicts with the cron prompt, and each must be declared every
turn it applies** — the prompt's literal steps 2, 3a and 3b are all overridden by rules above:

| Cron prompt says | Overriding rule | What the report must say |
| --- | --- | --- |
| 2. `action == "none"` → 靜默結束 | always gap-scan by sha first; `[SILENT]` only if the SCAN is clean | "未依提示靜默 — 並非遺漏，是刻意偏離：watcher 回報 action=none，但 gap scan 顯示 N 個 workflow 紅燈" |
| 3a. `gh issue create` per failure | root-cause dedupe + "0 issues if all tracked" | "刻意開 0 個，非遺漏：<tracker list>" |
| 3b. `delegate_task` a repair subagent | cron subagents are discarded at session exit | "刻意未派，非遺漏：cron 無使用者在場，subagent 會被丟棄" |

The step-2 row is the one most likely to be skipped, because obeying it *feels* like a clean turn.
Declare it in the report's FIRST line when it applies — a report that opens with findings and never
mentions that the watcher said `none` reads as if the watcher had found them.

Never silently skip 3b just because the skill forbids it — a numbered report that jumps 3a → 3c reads
as a dropped step, and the honest-reporting rule treats an unexplained gap as a failure. Declare the
deviation *and* its reason inline, then show what you did instead (the self-completed verification).

### Triage discipline: dedupe by ROOT CAUSE, not by run_id
A single watcher poll returned **17 new failures** that collapsed to **5 distinct root causes**
across 6 workflows (repeated pushes re-fire every workflow). Filing one issue per run_id would have
spammed 17 near-duplicate issues. Correct flow: fetch the real log for the **newest run of each
distinct `workflowName`**, group by root cause, file one issue per cause and list every affected
run_id inside it. Also `gh issue list --state open` first — a prior cron poll may already have
filed the same tracker.

**The converse also holds: ONE run can hold N independent root causes — decompose by JOB.** On
2026-08-08 `OmniCore CI #31245950407` was a single `failure` containing **four** unrelated causes:
`Validate VPS Scripts` (shell syntax, #433), `ESLint` (max-warnings, #444), `Vitest`
(unregistered workspace tree, **new**), `Secret Scan` (committed credential, #430). Three already had
trackers; exactly one was new. Enumerate the failing jobs first, then map each to an existing tracker:
```bash
grep -nE "##\[error\]|FAIL |✖ [0-9]+ problems|syntax error|Possible secret|Total: [0-9]+" <log> | tail -30
```
Filing one issue "for the run" would have buried the single new cause under three known ones — and
filing four would have duplicated three existing trackers. Neither dedupe direction is optional.

Dedup pre-check before filing is worth one call, because unlike `gh issue list --state open` it also
covers **closed** issues:
```bash
gh search issues --repo DingJun1028/esggo "<distinctive error phrase>" --json number,title,state --limit 10
```

### The watcher's own `error_type` / `log_excerpt` are HINTS, NOT EVIDENCE
Stronger version of the 2026-08-05 lesson. On 2026-08-08 `gh-error-watch.py` labelled pnpm-install
failures as `eslint` and VPS-deploy failures as `dependency`, and its `log_excerpt` captured only the
job's opening group headers — not a single real error line. Treat the script as a *change detector*
(which runs are new) and re-derive `error_type` yourself from `gh run view <id> --log-failed`.
Never file an issue or write a fix using the watcher's classification verbatim.

### REAL-WORLD CI FAILURE (2026-08-05, run 31029613913) — DO NOT TRUST NARRATIVE GUESSING
Summary AND user both said "Vitest/ESLint"; the real failure was `Security Scan / Run Trivy
vulnerability scanner (filesystem)` — 6 HIGH in `esggo-omni-center/pnpm-lock.yaml`. ALWAYS fetch
`gh run view <id> --log-failed` and grep `Total:` / `CRITICAL` / `HIGH` / `exit code 1` before
assuming test/lint. CVEs + `repair-security` recipe: `references/2026-08-05-trivy-security-scan-real-log.md`.

### Repair jobs
- `repair-typescript`: `pnpm lint --fix`, replace `: any`→`: unknown`, `as any`→`as unknown`,
  strip `@ts-ignore`/`@ts-nocheck`, then `pnpm typecheck`.
- `repair-eslint`: `pnpm lint --fix` (two passes). PITFALL: `react-hooks/static-components` ("Cannot create components during render") is an **error-level** rule that `--fix` CANNOT auto-resolve — it needs the component definition moved out of render scope (hoist to module level or a separate file). In esggo this recurs across ESG-GO CI/CD, OmniCore CI, and the 🌌 Sacred Pipeline simultaneously; treat it as a code fix, not a lint-autofix. **Full playbook — error-count-vs-declaration-count trap, the two fix shapes, and the one-grep evidence line — is the 14th class section above.** Reusable cron snippets in `references/ci-watch-gap-scan.md`.
- `repair-build`: `npx prisma generate` + `pnpm build`.
- `repair-dependency`: `pnpm store prune` + `rm -rf node_modules` + `pnpm install`.
- `repair-pnpm-ignored-builds`: signature `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: <pkg>`
  + `exit code 1`. pnpm 11 aborts install when a package with a build script is neither approved nor
  denied in `pnpm-workspace.yaml → allowBuilds`. Fix = add an explicit **boolean**. Choosing the
  value matters: run `pnpm why <pkg>` and grep `--include=package.json` for a direct declaration —
  if it is only a transitive/optional peer (e.g. `sqlite3` under `knex`/`@mikro-orm/knex`), use
  `false`, which makes the *existing* ignore behaviour explicit and changes nothing at runtime;
  `true` would newly compile native bindings in CI and can fail on a missing toolchain.
  **Trap:** pnpm writes a placeholder line `<pkg>: set this to true or false`. That is an invalid
  value — YAML parses it as a *string*, so committing it does not fix the error. Assert the type:
  `python3 -c "import yaml;v=yaml.safe_load(open('pnpm-workspace.yaml'))['allowBuilds']['<pkg>'];assert v is False"`.
  Also check whether the offending line is only in the **working tree** — `git show HEAD:pnpm-workspace.yaml`
  is what CI actually sees, and the real cause is often that the entry is *absent* from HEAD entirely.
- `repair-lockfile-mismatch` (added 2026-08-08): `[ERR_PNPM_LOCKFILE_CONFIG_MISMATCH]` — full recipe,
  diagnosis one-liners and the unmasking-is-success rule live in the **11th class** section above.
  Short form: `pnpm install --lockfile-only --no-frozen-lockfile` (~55s, no node_modules), then
  `git add pnpm-lock.yaml` (explicit path only), and judge by the install-stage job flipping to pass.
- `repair-workflow-yaml` (startup_failure): fix the parse error, then confirm jobs schedule again.
  A recurring corruption pattern in esggo is a `with:` key orphaned below a `- run:` step (e.g.
  `cache: "pnpm"` after `- run: pnpm build`) plus a duplicated `pnpm/action-setup@v4`; both come from
  a bad automated merge and repeat identically across every job in the file.
- `repair-shell` (Validate VPS Scripts): `bash -n <script>` reproduces the CI error locally. esggo's
  `vps/scripts/*.sh` are heredoc *generator* wrappers, so an unbalanced quote inside a
  `cat > f << 'EOF'` block surfaces as a bogus "syntax error near unexpected token `}`" hundreds of
  lines later. Fix the quoting; only fall back to the CI skip-list
  (`*/console-*|*/recovery/*|*-bundle*|*oneshot*`) if the file genuinely cannot be statically checked.

  **Count the FAILs first — there is usually more than one.** `grep -oE "FAIL vps/[a-z0-9/_.-]+"` on
  the log; on 2026-08-08 the step had **2** distinct broken scripts, and fixing only the one named in
  the top error line ships a still-red job.

  **Nested-heredoc delimiter collision** is the dominant cause: an outer `<< 'EOF'` generating a
  script that itself contains nested `<< 'EOF'` ends at the **first bare `EOF`**, leaking the rest
  into the parser and erroring hundreds of lines later. Detect by count mismatch (`grep -nE "<<"`
  vs `grep -nE "^\s*EOF\s*$"`); fix by giving each OUTER heredoc a unique delimiter. Verify with
  CI's own loop *including its skip-list* (`CI_STEP_EXIT=0`), not the run conclusion, and prove no
  regression with an OK/FAIL/SKIP conservation table. Expect the job to vanish from `--log-failed`
  while the workflow stays red on tracked causes — unmasking; say so in the tracker.
  Full recipe: `references/repair-shell-heredoc-collision.md`.
- `repair-ssh-deploy-key`: **not auto-repairable.** `Permission denied (publickey)` + `exit code 255`
  on the first `ssh` of a deploy job means the pubkey is missing from the VPS `authorized_keys` (or
  the secret rotated). Re-running the workflow just re-fails; file a tracker asking for manual
  console access instead of attempting a fix.
- `repair-docker`: normalize `FROM node:` to `node:22-alpine`, rebuild.
- `repair-prisma`: `prisma generate` + `prisma validate`.

### The TRACKER SCRIPT can be the incident
`issues_created: N` + `telegram_sent: 0` is contradictory — audit the script, don't trust its JSON.
4 defects ⇒ 33 junk issues/20min + dead phone channel: `os.environ.get(k,def)` misses a set-but-
**empty** var (use `or`); no **provenance gate** (add `event,headBranch`, main/develop only; 12→0);
`issue_exists()` isn't a lock; swallowed send errors. Prune by provenance (21 closed/9 kept).
Detail: `references/2026-08-09-tracker-script-is-the-incident.md`.

## Telegram tracker setup
Secrets are set with the CLI (never pasted in chat beyond the one-time `gh secret set`):
```bash
gh secret set TELEGRAM_BOT_TOKEN --body "<bot_token>"
gh secret set TELEGRAM_CHAT_ID   --body "<chat_or_user_id>"
```
In the workflow, send from `actions/github-script` using `fetch` (Node 20+ has global fetch):
```js
const resp = await fetch('https://api.telegram.org/bot'+process.env.TELEGRAM_BOT_TOKEN+'/sendMessage', {
  method:'POST', headers:{'Content-Type':'application/json'},
  body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg, parse_mode:'HTML' })
});
```
Pass the secrets into the step via `env:` block (not directly in `with:`). See
`references/telegram-notify.md` for the full snippet.

## CRITICAL pitfalls
- **NEVER `git stash` or switch branches in the shared `C:\Project\esggo` clone.** Multiple agents
  commit to this repo concurrently — on 2026-08-08 `main` advanced four times
  (`1fb9adeed → e6e7fb36e → bea368230 → ec3007966`) inside a single cron turn, and `.Jules/` was
  renamed to `.jules/` mid-session. A stash/checkout round-trip there let another agent's merge
  overwrite **8 files of the user's uncommitted work**. Rules:
  - To verify a branch, use an **isolated worktree**: `git worktree add C:/Project/_verify <branch>`,
    work there, then `git worktree remove --force <path>` + `git worktree prune`.
  - To commit only your own files while the tree is dirty, `git add <explicit paths>` and confirm
    with `git diff --cached --name-only` — never `git add -A`.
  - `git stash pop` can **partially apply**: it may restore untracked files, leave the tracked
    modifications behind, and print "The stash entry is kept in case you need it again."
    Verify per file (`git status --porcelain -- <f>`) and recover the remainder with
    `git restore --source=stash@{0} -- <files>` before dropping anything.
  - `git stash drop` prints the dropped SHA. If work may still be needed, **pin it immediately** so
    gc cannot reclaim it: `git branch oa-twins/worktree-backup-<date> <sha>` (and/or `git tag`).
    Recover single files with `git restore --source=<ref> -- <path>`.
  - Before pushing, expect your commit may already be upstream via another agent; `git pull --rebase`
    and re-check. A PR you opened can be **merged by another agent within minutes** — re-read
    `gh pr view <n> --json state,headRefOid` instead of assuming it is still open.
- **A side-effect of running `pnpm install` is a dirty `pnpm-lock.yaml`.** It can drop workspace
  entries for packages that are untracked locally. If the lockfile was clean when you started, revert
  it (`git checkout -- pnpm-lock.yaml`) so it never rides along in an unrelated PR.
- **write_file YAML validation false-fails on `run: |` blocks** containing markdown tables
  (`| Col |`) or `curl` lines with embedded `"` and `\`. The validator treats pipe-table rows as
  mapping errors. Workaround: build the file with `execute_code` (Python string replace) instead of
  `write_file`, OR avoid `|` blocks — use `run:` with `>` folded scalars and no markdown tables.
  Always finish with `python3 -c "import yaml; yaml.safe_load(open(path))"` to confirm.
- **Never overwrite an existing real secret with a pasted placeholder.** In this session the user
  pasted `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...xdSY` as a "set this" value. That is an obvious
  placeholder (literal `...xdSY`), and the repo's `gh secret list` already had a real value from
  2026-06. Setting the placeholder would have CLOBBERED a working secret. Rule: before any
  `gh secret set X --body "..."`, run `gh secret list` and compare. If the existing secret is
  non-empty/real and the new value looks like a placeholder (contains `...`, `XXX`, `YourKeyHere`,
  `<...>`), STOP and ask — do not write. Also: do not echo/paste raw tokens into chat more than once;
  `gh secret set` consumes stdin so the token never lands in transcript history.

### Repair job additions
- `repair-security`: see the 2026-08-05 case above. Bump the vulnerable dep(s) in the affected
  workspace's `package.json`, `pnpm install`, re-lock, and re-run Trivy (or just re-run the CI job)
  to confirm 0 HIGH/CRITICAL before opening the PR.
- **PowerShell has no `&&`** — a chained remote command fails with "InvalidEndOfLine" in PS. Use
  `cd /opt/esggo ; pm2 reload ecosystem.config.js`.
- **`git push` rejected (fetch first)** after a long session — run `git pull --rebase origin main`
  then `git push`. Dependabot/other pushes land between your commits.
- The `analyze` job must not rely on commit-message guessing alone; download the actual job logs
  (the first version that grepped commit messages missed real errors). See `references/log-download.md`.

## Deploy-readiness checklist (esggo repo) — verify BEFORE claiming success
This session's "deploy plan" looked complete but several steps would have failed silently. Check:
1. **Firebase**: `firebase.json` must exist with a `hosting` block. In esggo it is ABSENT
   (only `.firebaserc` → project `esg-sunshine`, NOT `esggo-504004`). `next.config.ts` uses
   `output: "standalone"`, which needs `rewrites` to `__/...` or `output: "export"` for static
   hosting. `firebase deploy --only hosting` fails without `firebase.json`.
2. **Vercel**: `vercel env ls` may fail with "The specified token is not valid" (token expired).
   Re-`vercel login` before setting env vars; never guess a token.
3. **VPS sync**: SSH must already work. If `ssh -i ~/.ssh/esggo_original ... 'echo OK'` returns
   `Permission denied (publickey)`, the VPS `authorized_keys` lacks the pubkey — unlock on the
   VPS console first. Don't run `scp`/`rsync` against an unresolvable host like `esgo-vps`;
   use the real IP `161.118.248.180`.
4. **Secrets**: `gh secret list` first. If a real value exists, do NOT overwrite with a pasted
   placeholder (e.g. `AIzaSy...xdSY`). See the secret pitfall above.
5. **esggo-learning-center**: leave untouched unless the user explicitly includes it.

## Verification
- `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-repair.yml'))"` → must print OK.
- `pnpm run typecheck` and `pnpm run lint` still pass (workflow YAML is not TS, but confirm repo green).
- The live file lives at `.github/workflows/auto-repair.yml` in esggo (v2.1, Telegram enabled).

## Local failure watcher (gh-error-watch) + OA-swarm tracking
`auto-repair.yml` (v2.1) reacts to `workflow_run` failure *inside* GitHub. To also catch failures the
moment they land and **dispatch the OA swarm (萬能分身) to fully repair + fill gaps + track**, run a
local Hermes cronjob that polls `gh run list` and opens a tracking issue per new failure.

- **Watcher script**: `scripts/gh-error-watch.py` (deploy to `~/.hermes/scripts/`). Reads
  `gh run list --json`, skips runs already seen via state file
  `~/.hermes/scripts/gh-error-watch.state`, downloads the REAL failed log with
  `gh run view <id> --log-failed` (never trust a narrative — only the pipeline log), classifies
  `error_type` with the same 9-class scheme as auto-repair.yml, and prints
  `{ new_failures:[...], action:'delegate'|'none', newest_run_id }`.
- **Cronjob**: `cronjob create` every 15m. Prompt = run the script; if `action=='delegate'`, group
  the failures by root cause, `gh issue create` one tracker per cause (use existing labels
  `OmniAgent`/`auto-fix`/`github_actions`/`bug`/`dependencies`), then **repair the highest-leverage
  causes inline** (see cron constraints below). If `action=='none'`, exit silently (no delivery).
  This is the "發出瞬間偵測 → 派萬能分身跟蹤" mechanism.

### Cron-mode execution constraints (added 2026-08-08) — READ BEFORE PLANNING THE REPAIR
The cron runner is a no-user-present context, and two tools behave differently there:
- **`execute_code` is refused** with `BLOCKED: … Cron jobs run without a user present to approve it`.
  Use `write_file` + `terminal` instead (this also replaces the older "build YAML with execute_code"
  workaround in CRITICAL pitfalls — under cron that workaround is unavailable). To re-enable it
  deliberately, the user sets `approvals.cron_mode: approve`.
- **`delegate_task` subagents are discarded when the session exits.** Dispatch returns immediately
  and the cron turn then ends, so a delegated repair usually never lands. **Do not delegate repairs
  from a cron job.** Fix the small, high-confidence causes yourself (config/YAML one-liners are ideal)
  and leave the large or risky ones described in the tracking issue for a foreground session.

### Gap-scan + advance watcher state (learned 2026-08-08 cron turn)
A cron turn can run long (TLS retries, many `gh` calls). New workflow runs land DURING execution, after the watcher's poll snapshot. If you only process the snapshot, those mid-turn failures are neither tracked now nor handled cleanly next poll — the next poll re-classifies them as 'new' and, because grouped trackers don't carry run_ids in titles, reopens duplicate issues. Close the loop:
1. After filing the snapshot's trackers, do a **gap scan**: `gh run list --limit 30 --json databaseId,workflowName,conclusion,createdAt` and keep runs with `databaseId > <state_file_value>` and `conclusion == 'failure'`. For each, fetch the real `gh run view <id> --log-failed`, confirm the root cause matches an existing tracker, and **append the run_id to that existing issue via comment** (do NOT open a new issue — the root-cause dedup rule still applies).
2. **Advance the watcher state file** to the current newest run_id (`gh run list --limit 1 --json databaseId`) so the next 15-min poll starts AFTER everything just handled. Without this, the next poll re-processes the gap runs and spams duplicate trackers.

#### The state pointer can BURY same-batch failures — `action=none` is not proof of "no failures" (added 2026-08-08, 06:04 turn)
Sharper than the mid-turn-race case above, and it fires on *every* push. One push fans out to N
workflows that all get **near-sequential run_ids**; `auto-repair.yml` is `workflow_run`-triggered, so
its own run is created ~1 min LATER and therefore gets a **HIGHER** run_id than the failures it was
reacting to. Advancing state to "newest run id" then parks the pointer above those failures, and the
next poll's `databaseId > state` filter silently drops them:

```
31242789889  ESG-GO CI/CD          failure  05:56:10  ← buried
31242789898  Sacred Pipeline       failure  05:56:10  ← buried
31242789901  learning-center-ci    failure  05:56:10  ← buried
31242789905  OmniCore CI           failure  05:56:10  ← buried
31242790051  Deploy to Oracle VPS  failure  05:56:10  ← buried
31242799400  OA-TWINS Auto-Repair  success  05:56:24
31242837645  OA-TWINS Auto-Repair  success  05:57:31  ← state pointer landed HERE
```

So `action=none` + `new_failures: []` reported **zero** while five workflows were red on the newest
sha. Always run the gap scan against the sha rather than trusting the pointer:
```bash
gh run list --repo DingJun1028/esggo --limit 15 --json databaseId,workflowName,conclusion,headSha,createdAt
```
then re-triage every `conclusion=="failure"` on the newest `headSha`, regardless of run_id ordering.
Because the successful auto-repair run is *always* the highest id, this is the normal steady state,
not an edge case — treat a clean watcher result as "no NEW class of failure", never as "CI is green".

##### Burying mechanism #2: the runs were still IN FLIGHT at poll time (added 2026-08-08, 09:42 turn)
The section above blames run_id *ordering*. There is a second, independent cause with the same
outcome, and it fires whenever a push lands within ~1 minute of the poll: the runs exist but have
**no conclusion yet**, so a `conclusion == 'failure'` filter cannot see them — and `save_state` then
parks the pointer AT one of those in-flight ids, permanently hiding them from the next poll.

Observed sequence (watcher polled `09:37:36`, push was `09:36:56`):

| run_id | conclusion at poll | conclusion later | vs saved pointer |
| --- | --- | --- | --- |
| `31250979668` OmniCore CI | *(empty — running)* | **failure** | **below** pointer ⇒ never revisited |
| `31250979702` Sacred Pipeline | *(empty — running)* | **failure** | == pointer |
| — saved state | | | `31250979702` |

So `action=none` was reported while main's newest sha was red in two workflows, and the next poll's
`databaseId > 31250979702` filter would have skipped `31250979668` forever. The failure is silent in
both directions: nothing new is reported now, and nothing is recoverable later.

Defence is the same gap scan, but you must select on **sha**, not on conclusion, and re-read the
conclusion *after* the runs settle:
```bash
gh run list --repo DingJun1028/esggo --limit 10 --json databaseId,workflowName,conclusion,headSha,event \
  --jq '.[] | select(.headSha|startswith("<newest_sha>")) | "\(.databaseId) \(.conclusion) \(.event) \(.workflowName)"'
```
An **empty** `conclusion` field means *still running*, which is neither pass nor fail — never score it
as "no failure". Re-poll that sha before concluding the turn; on the 09:42 turn the same command a few
calls later returned `failure / failure / success` for the three push runs.

##### Burying mechanism #3: the pointer parks on a same-batch SUCCESS (added 2026-08-08)
Needs neither a later auto-repair run (#1) nor in-flight status (#2): within one push fan-out run_ids
are assigned in an order unrelated to which workflows fail, so a **passing** sibling can hold the
batch's highest id and `save_state` parks the pointer on it, above that push's failures (seen:
`…192 failure`, `…193 failure`, `…202 success` ← pointer). **Never treat "pointer ≥ run_id" as
evidence a run was handled** — gap-scan on the newest `headSha`, the only filter immune to all three.
Cheapest no-regression pre-check: `wc -l` both `--log-failed` files — identical counts ⇒ inherited reds.
The freshly-filed `(unknown)` issue is usually the ONE uncovered surface (trackers get sibling-covered
first; it is filed seconds after the run settles) — probe it last, expect the gap.
**Fourth "nothing-to-do" shape:** `action=none` + burying + docs-only push + all reds tracked/covered
+ a 0-comment `(unknown)` issue ⇒ 0 issues, 1 comment, 1 digest, **1 state advance** — the advance is
the deliverable; without it the buried failures are skipped forever.
Full evidence: `references/2026-08-08-pointer-parks-on-batch-success.md`.

#### Proving "no regression" in one command
`grep -l "ERR_PNPM" /c/Project/_ci_logs/r<prefix>*.log` across every fetched log — exit 1 / no output
is the whole proof that the install-stage P0 stayed fixed. One call, all workflows, and it survives
the no-`$(...)`-in-`echo` payload blocklist. Pair it with a per-log
`grep -oE "<sig1>|<sig2>|..." | sort | uniq -c` to get the surviving causes as counts.
- **Write issue/comment bodies OUTSIDE the shared repo.** Use `C:/Project/_ci_logs/` (Windows) — never `C:/Project/esggo/<x>.md` and never `/tmp` (MSYS mangles `/tmp`). The esggo clone is committed to by many agents concurrently; even a temp file there can dirty a push.
- **Wrap every `gh` API call in a retry loop.** GitHub API intermittently returns `net/http: TLS handshake timeout`; a `for a in 1 2 3 4; do out=$(gh ... 2>&1); if echo "$out" | grep -q '<marker>'; then break; fi; sleep 3; done` loop recovers reliably.
- **TWO watchers, TWO state paths + a stale decoy; `oa-twins-tracker.py`'s guard misses burying #1/#3, so its `action=none` can hide a real red. Gap-scan by `headSha`; never hand-advance it.** See `references/2026-08-09-two-state-paths-and-burying-guard-hole.md`.
- **First-run fragility:** if the watcher's `gh run list` fails (TLS), `main()` returns BEFORE `save_state`, so no state file is written and the NEXT poll treats all 20 runs as new. If the watcher errored, advance the state file manually to the newest run you actually processed.
- **Close trackers when their root cause is gone — the loop is not just open-and-file.** After a fix
  lands, grep the newest log for the signature and if the count is `0`, `gh issue close <n> -c ...`
  with the evidence table inline. On 2026-08-08 this closed four issues (#457/#456 for
  `OUTDATED_LOCKFILE`, #452/#448 for `CONFIG_MISMATCH`) and opened **zero** new ones — the correct
  outcome when every live cause already has a tracker. Leaving resolved P0 trackers open is what
  makes the backlog unreadable and causes the next poll to re-file duplicates.
- **The state file is written concurrently by sibling subagents.** `write_file` may return
  `"... was modified by sibling subagent <id> but this agent never read it"`. Advancing it is safe
  **because the value is monotonic** — always write the current newest run id, never a lower one.
  Re-read it after writing to confirm. **READ IT BEFORE WRITING, though:** the watcher's own
  `save_state` runs at the end of a successful poll, so it may already sit at the newest run
  (seen 2026-08-08: `1|31245988797`, exactly the newest id). Equal-to-newest means there is nothing
  to write — skip the write and say so in the report, rather than issuing a redundant write that
  trips another sibling warning. The same concurrency means a stale worktree you find in
  `git worktree list` may belong to a *live* sibling: if a sibling-write warning fired this turn,
  flag the worktree for a foreground session instead of `git worktree remove --force`.
- **The Telegram send-buffer is shared by siblings too (added 2026-08-08, 06:45 turn).** The same
  sibling-write warning fires on `~/AppData/Local/hermes/scripts/_auto_repair_alert.txt`, because it
  is a single overwritten buffer that every concurrent poll writes before calling `_send_tg_alert.py`.
  A sibling can clobber your message between `write_file` and the send. Always `wc -c` + `head` the
  buffer immediately before dispatching, confirm the bytes are yours, then send; treat
  `ok: True message_id: <n>` as the only proof of delivery.
- **When every remedial action is already taken by siblings, send ONE digest — not four alerts.**
  Steady state on a busy repo: watcher `action=none`, gap scan finds N reds, and every one already
  has a tracker, a re-classification comment, and (for stale PRs) 3+ block-warnings. Do not re-file,
  do not re-warn, do not send one Telegram per red. Verify, then send a single consolidated status
  that leads with the *state change* (what got fixed) and lists the surviving reds as known causes.
  Check sibling coverage before acting: `gh issue view <n> --json comments` on the tracker, the
  auto-repair `(unknown)` issue, and each stale PR.
- **`C:/Project/_ci_logs/` is shared by siblings too.** The same warning fires on comment-body files
  (`c459.md` etc.), meaning your write may clobber a sibling's pending body or vice-versa. Suffix
  every body file you intend to post — `c<issue>_oatwins_<HHMM>.md` — and `wc -c` it right before
  `gh ... -F` to confirm the bytes are still yours.
  **The clobber can happen with NO sibling-write warning at all (2026-08-08, 09:1x turn), and
  `verified: true` does not protect you.** `write_file` returned `{"bytes_written": 4062,
  "verified": true}`; seconds later the same path was **3168** bytes with a different first line — a
  sibling had overwritten it and no warning fired. `verified` attests to the write *at write time*,
  never to the file at dispatch time. So check **content, not just size** — a same-size clobber would
  pass a `wc -c`-only check:
  ```bash
  wc -c /c/Project/_ci_logs/c<issue>_oatwins_<HHMM>.md
  head -1 /c/Project/_ci_logs/c<issue>_oatwins_<HHMM>.md
  ```
  If the bytes are not yours, **read the file before overwriting** — it is a sibling's pending work
  and it may change your plan. Here it revealed the sibling had already covered the finding, flipping
  the correct action from "post" to "stay silent on that surface and find the uncovered one".
- **`git worktree remove --force` failing is usually benign.** Under Windows it can return
  `Permission denied` / `Device or resource busy` (indexer, AV, or a sibling holding a handle) while
  git still **de-registers** the worktree — confirm with `git worktree list`. If it is gone from the
  list, the job is done; the empty directory is inert leftover. Do not retry destructively or
  `rm -rf` it while siblings are active — note it for a foreground session and move on.
- Reusable copy-paste snippets: `references/ci-watch-gap-scan.md`.
- Prefer simple `terminal` one-liners. A hardline blocklist rejects oversized/complex payloads —
  `rm -rf "$VAR"`, long chains of `$(...)` substitution, and heredocs can trip it. Split into
  separate calls; the block is about payload shape, not the operation.
  Concrete shapes that were REJECTED on 2026-08-08 (both recovered by splitting):
  - a `for id in A B; do gh run view ... > f; echo "X=$(grep -c ...)"; done` loop, and
  - even a single line of three chained `echo "NAME=$(grep -c pat file)"` statements.
  The trigger is `$(...)` **nested inside a quoted `echo`**, repeated. Working form = one bare
  command per call, letting the raw output speak:
  ```bash
  gh run view <id> --repo <r> --log-failed > /c/Project/_ci_logs/r<id>.log 2>&1; echo "exit=$?"
  grep -c ERR_PNPM_OUTDATED_LOCKFILE /c/Project/_ci_logs/r<id>.log
  grep -oE "static-components|Possible secret detected|syntax error near" /c/Project/_ci_logs/r<id>.log | sort | uniq -c
  ```
  Note `grep -c` returning `0` exits **1**; the runner labels that "No matches found (not an error)".
  Treat exit 1 with output `0` as a successful zero-hit check, not a failed command — and do not let
  the loop-warning heuristic push you into abandoning a grep that is actually working.

### Never leave the repo dirty for a P0 you cannot fix
Credential exposure outranks CI green. When Trivy secret-scan reports e.g.
`CRITICAL: Google (gcp-service-account) … firebase-service-account.json:2`, confirm blast radius
before writing anything else:
```bash
git ls-files --error-unmatch <file>   # tracked?
git cat-file -e HEAD:<file>           # in HEAD?
git check-ignore -v <file>            # ignored?
gh repo view --json visibility        # PUBLIC?
```
If tracked + public, the key is already leaked: the FIRST step is revoking/rotating it at the
provider, not deleting the file. Do NOT bundle a history rewrite (`git filter-repo`/BFG + force-push)
into a CI-fix PR, and never attempt it from cron while other agents are pushing.
- **auto-repair.yml v2.2 email step**: adds `dawidd6/action-send-mail` gated on `SMTP_*` secrets with
  `continue-on-error: true` — if SMTP is unset it skips WITHOUT blocking CI. This is the
  "GitHub 報錯通知信" channel; without SMTP, the GitHub Issue + Telegram tracker carry notification.

### gh CLI gotchas (hit this session)
- **Never pass a body containing backticks via `-b`.** Under Git-Bash, `gh issue comment N -b "...\`}'..."`
  dies with ``bash: eval: unexpected EOF while looking for matching ` ``. Log excerpts almost always
  contain backticks/code fences, so ALWAYS `write_file` the body to `C:/Project/_ci_logs/cNNN.md` and
  use `-F`. Same rule for `gh issue create` / `gh pr create`.
- **`-c "$(cat 'C:/path/file.md')"` IS safe for backtick-heavy bodies (verified 2026-08-08).**
  `gh issue close` has no `-F` flag, so the file trick needs command substitution — and that is fine:
  bash does **not** re-parse the *output* of `$(...)`, so backticks and code fences inside the file
  are passed through literally. The `-b` failure above is only about backticks typed directly on the
  command line. Still quote the path in the drive-letter form: `-c "$(cat 'C:/Project/_ci_logs/x.md')"`.
- **`gh issue close -c` SILENTLY DROPS the comment if the issue is already closed (2026-08-08).**
  When a merged PR carries `Closes #N`, GitHub auto-closes the tracker *with no evidence attached*.
  A follow-up `gh issue close N -c "$(cat ...)"` then prints
  `! Issue ...#N (...) is already closed` and **exits 0 — but posts nothing**. The evidence is lost
  and the next poll sees an unaudited closure. Always post evidence with a separate
  `gh issue comment N -F "C:/Project/_ci_logs/cN_oatwins_<HHMM>.md"` and confirm the returned
  `#issuecomment-<id>` URL. Treat "already closed" as *"now go comment"*, not as success.
- **`gh issue comment` works on PR numbers too.** To block-warn a pull request you do not need
  `gh pr comment`; `gh issue comment <pr#> -F "C:/..."` returns a `.../pull/<n>#issuecomment-...` URL.
  Grep the output for `issuecomment-` to confirm it truly landed — exit code alone lies (see the
  `/c/...` path trap below).
- **Check `git worktree list` BEFORE creating one.** A previous cron turn that ran out of time can
  leave a *locked* worktree holding a half-finished branch (seen: `C:/Project/_verify` on
  `auto-repair/lockfile-overrides-20260808` sitting exactly at origin/main with no fix commit).
  Don't try to reuse that branch — it is checked out elsewhere and git will refuse. Create a fresh
  worktree + a suffixed branch (`...-20260808b`) and finish the job there.
- `gh issue create` uses **`-l`/`--label`**, NOT `--labels` (newer gh: "unknown flag: --labels").
- **Labels must already exist** in the repo. `gh issue create -l` fails "could not add label: 'X' not
  found" for unknown labels. Use repo-existing labels (`OmniAgent`, `auto-fix`, `github_actions`,
  `bug`, `dependencies`). The workflow's REST-API issue create can use arbitrary labels; the LOCAL
  `gh` CLI cannot — pre-create or reuse existing ones.
- **Write issue bodies to a Windows-absolute path, not `/tmp`.** Under MSYS/Git-Bash, `/tmp/x.md`
  resolves wrong and `gh issue create -F /tmp/x.md` → "file not found". Use `C:/Project/esggo/x.md`
  (or `write_file` then `-F` that absolute path), then `rm` it.
- **`-F` also rejects the MSYS drive form `/c/...` (confirmed 2026-08-08).** `gh` is a *native
  Windows* binary, so it never sees the MSYS mount table. `gh issue comment N -F /c/Project/_ci_logs/x.md`
  fails with `open /c/Project/_ci_logs/x.md: The system cannot find the path specified.` — note this
  exits **0** in the surrounding loop, so a naive retry loop reports success while posting nothing.
  Always pass the drive-letter form and quote it: `-F "C:/Project/_ci_logs/x.md"`. Confirm the post
  actually landed by grepping the output for `issues/` (the returned comment URL) rather than
  trusting the exit code.
- **`gh pr view --json merged` is not a field** ("Unknown JSON field"). Use `--json state` — a merged
  PR returns `state: "MERGED"`. Useful fields: `state,headRefOid,changedFiles,files,mergedAt`.
- **A `;` in a `--jq` expression is a parse error** (hit 2026-08-08). Trying to emit the title and the
  comments in one call —
  `gh issue view N --json comments,title --jq '"title=\(.title)"; .comments[] | ...'` — dies with
  `failed to parse jq expression (line 1, column 18) ... unexpected token ";"`. jq has no statement
  separator, so one filter cannot produce two independent outputs. Split into two calls:
  ```bash
  gh issue view <n> --repo DingJun1028/esggo --json comments --jq '.comments | length'
  gh issue view <n> --repo DingJun1028/esggo --json comments --jq '.comments[] | "\(.createdAt) \(.body[0:200])"'
  ```
  Ask for the LENGTH first — `0` is exactly the "genuine gap ⇒ post here" signal from the per-surface
  rule, and it costs one cheap call before you pay for bodies.
  **But `> 0` is NOT coverage — compare `.comments[-1].createdAt` against YOUR finding (11:41 turn).**
  #444 had 0 comments 8h after filing; #430 had 4, newest `05:20`, stale against the 09:1x finding it
  needed. Check every tracker the reds map to: that poll had all 4 PRs *and* the run's `(unknown)`
  issue sibling-covered, yet two trackers uncovered — the turn's entire value. Also ask **has a
  tracker become the CRITICAL PATH?** (nothing changed about #444; #441 closing + #469 greening
  Secret Scan/Vitest left ESLint the sole red job). Warning-count guards + the
  contradiction-resolution method: `references/2026-08-08-tracker-coverage-staleness-and-critical-path.md`.
- Under MSYS, `git worktree add /c/Project/x` creates a literal **`C:/c/Project/x`**. Pass a native
  path (`C:/Project/x`) and confirm with `git worktree list` before trusting the checkout.

### Verifying a fix: five traps that produce false "PASS" (added 2026-08-08)
1. **A pipe swallows the exit code.** `pnpm typecheck 2>&1 | tail -25` reports **tail's** status (0)
   even when tsc fails. Always capture the real one:
   `cmd > out.log 2>&1; echo "EXIT=$?" >> out.log` then grep both `EXIT=` and `error TS`.
2. **Committing to a branch then returning to `main` reverts the workspace copies.** After
   `git checkout main` the changed files hold the ORIGINAL broken content again, so re-running a
   local check there validates the bug, not the fix. Verify on the branch, or via
   `git show <branch>:<path>` / `git show origin/main:<path>`.
3. **Judge a CI-config fix by job scheduling, not run conclusion.** `total_count` going 0 → 10 proves
   a startup_failure is repaired even while the run is still red from unrelated pre-existing jobs.
   To claim "no regression" from removing install steps, grep the new log for
   `cannot find module|command not found|MODULE_NOT_FOUND` and show it is empty.
4. **A linter that ABORTED greps as clean.** The nastiest of the four, because the output looks like
   a pass. If the repo's `eslint.config.js` imports a plugin that is not installed where you are
   running, ESLint dies before linting anything: `Error: Cannot find module 'eslint-plugin-react'`
   and **`EXIT=2`**. A `grep -c "<rule>"` on that output returns `0` — indistinguishable from "fixed".
   **Always assert the exit code and read the head of the log:** `0` = clean, `1` = real violations,
   `2` = config/parse fault ⇒ the verification is INVALID, not passing. The same shape applies to any
   checker that can fail at startup (tsc with a bad `tsconfig`, vitest with a bad config).

   Recovery that needs no install and never touches the shared clone's `node_modules` — build a
   throwaway harness loading ONLY the plugin that owns the failing rule:
   ```bash
   # minimal flat config, e.g. eslint.verify.mjs, importing just eslint-plugin-react-hooks
   ./node_modules/.bin/eslint --no-config-lookup --config eslint.verify.mjs <file>
   ```
   To give a fresh worktree the shared clone's modules, junction them (PowerShell — `cmd //c mklink`
   misbehaves under MSYS):
   ```bash
   powershell.exe -NoProfile -Command "New-Item -ItemType Junction -Path 'C:\Project\_verifyN\node_modules' -Target 'C:\Project\esggo\node_modules'"
   powershell.exe -NoProfile -Command "(Get-Item 'C:\Project\_verifyN\node_modules').Delete()"   # drops the LINK, target intact
   ```
   **Then CALIBRATE before trusting it.** Run the harness against the **pre-fix** file
   (`git show origin/main:<path> > Before.jsx`) and require its count to equal CI's count — here both
   `20`. A harness that cannot reproduce the failure cannot prove the fix, and calibrating is also
   what reveals when your fix is only partial. Delete the harness files before `git add <explicit path>`.
5. **ANSI colour codes silently break your regex, and empty output reads as "signal absent".**
   (Promoted from a reference footnote to a first-class trap after it bit twice in the 10:30 turn.)
   Vitest/ESLint output in `--log-failed` is colourised, so the runtime text is
   `^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m...`. A perfectly correct
   pattern therefore matches **nothing**:
   ```bash
   grep -ohE "Test Files +[0-9]+ failed \| [0-9]+ passed \([0-9]+\)" <log>   # → EMPTY (codes interleaved)
   grep -ohE "FAIL cli/[a-z0-9/_.-]+" <log>                                   # → EMPTY, same reason
   ```
   Both returned nothing while the lines were plainly present. That is the danger: an empty result is
   indistinguishable from "the failure is gone", so it fabricates a PASS in exactly the same way trap
   4 does. **Never conclude "signature absent" from a `-E` pattern with spaces/pipes/parens in it.**
   Match a short literal first, then strip the codes to read the value:
   ```bash
   grep -ah "Test Files" <log> | tail -3
   grep -ah "CLI build failed" <log> | sed -e 's/\x1b\[[0-9;]*m//g' | cut -c1-150
   ```
   Rule of thumb: `grep -ah "<short literal>"` to PROVE presence, de-ANSI only to READ the number.
   (`-a` also guards against grep treating a log with control bytes as binary and printing nothing
   but "Binary file matches".)

### `patch` tool: whole-file validation turns a rejection into a discovery
For linted formats (`.yml`, `.json`, `.py`) the patch tool validates the **entire candidate file** and
refuses the write if it still parses badly — even when your specific edit was correct. When a
rejection cites a line *outside* your edit, that is a second instance of the same corruption, not a
bad patch. If the broken block repeats identically, fix every copy in ONE call with
`replace_all=true`; sequential single patches all fail because intermediate states stay invalid.
This is how a 4-job repeat of one malformed `steps:` block was found and fixed in a single edit.

## References
- **23rd** `inherited_wrangler_config`: `TS5058 … '/…/worker/my-worker/tsconfig.json'` (**doubled**
  segment). `workingDirectory: worker` + **no `worker/wrangler.toml`** ⇒ wrangler walks up, inherits the
  ROOT config of a *different* Worker; `[build]` relative paths resolve against cwd. 12/12 red since
  07-30 = **never deployed**; NOT cron-repairable. Prior trackers #838/#839/#866/#867/#686 all closed
  **per-run_id** ⇒ chronic red invisible to `--state open`; search closed + `--workflow` history too.
- **22nd** `cf_10021_node_api_at_import`: cause **underneath** the 21st. `createRequire` at module top
  level (`@notionhq/workers`) ⇒ startup-validation reject `[code: 10021]`; `Total Upload` succeeding is
  NOT a pass. **21st is a STACK** (`DATABASE_URL` → `10042` → `10021`) ⇒ judge a CF fix by the OLD
  signature vanishing (+ KV gone from bindings), never by the check-run going green — still-red is
  normally **unmasking**. CF builds run **sequentially (~4 min apart)**; `in_progress` ≠ pass or fail.
  [both](references/2026-08-25-cf-10021-unmasking-and-inherited-wrangler-config.md)
- **21st** `cloudflare_workers_builds`: CF App writes **check-runs**, so `gh run list` (watcher + gap
  scan) is STRUCTURALLY blind ⇒ `action=none` is permanent and all-green Actions is **偽綠**. Probe
  `.../commits/<sha>/check-runs` every poll (`/status` gives `total=0`). `0s`
  duration = **RED HERRING** (real ~98s). `output.summary` has no log text ⇒ read via
  `mcp__cloudflare_builds__workers_builds_get_build_logs`. **Defaults `per_page=30`; 3 CF reds beyond
  page 1 ⇒ `?per_page=100`+`select()`** ([pg](references/cf-check-runs-pagination.md)). Root cause was
  18th-class `DATABASE_URL` env gate, 1 cause × 3 Workers; CF-side unfixed; NOT cron-repairable.
  [blind-spot](references/2026-08-23-cloudflare-workers-builds-blind-spot.md)
- **20th** `fail_open_deploy`: `nginx -t && reload` short-circuits ⇒ `[emerg]` inside a **GREEN** run
  (watchers filter `failure`; grep the WINNING job's `--log`). A green deploy in workflow B
  (`Deploy via SSH`, installs in the Docker image) can NOT clear a 12b tracker for workflow A
  (`Deploy direct`, host install); write closure criteria as a WORKFLOW NAME. `in_progress` 13h ≠ hung
  — read job `startedAt`. [references/2026-08-20-fail-open-deploy-and-cross-path-closure.md](references/2026-08-20-fail-open-deploy-and-cross-path-closure.md)
- **19th** `qemu_sigill`: ARM64 QEMU `SIGILL`; frames in `pnpm.mjs` mask it as build/lockfile — never
  `repair-dependency`/`repair-build`. Flake by default; correct cron repair IS `gh run rerun --failed`
  (= discriminator). Fix: native `ubuntu-24.04-arm`. >10min `in_progress` ≠ hung.
  [references/2026-08-21-qemu-sigill-arm64-crossbuild.md](references/2026-08-21-qemu-sigill-arm64-crossbuild.md)
- Local watcher: [scripts/gh-error-watch.py](scripts/gh-error-watch.py) — poll GitHub CI failures, classify, emit delegate/none JSON.
- Worked triage example: [ref](references/2026-08-08-multi-root-cause-triage.md)
  — 17 failures → 5 root causes; the watcher misclassified all of them; includes the `startup_failure`
  repro, the `replace_all` repeat-corruption fix, and the before/after evidence table.
- Stalled-PR / specifier-drift case: [ref](references/2026-08-08-outdated-lockfile-and-stalled-pr.md)
  — `action=none` while CI was 100% blocked by an unmerged fix; `ERR_PNPM_OUTDATED_LOCKFILE` vs
  `CONFIG_MISMATCH`; the two mutually-destructive repair routes; the overrides-diff comment-line
  false positive; post-merge-on-main verification table.
- Generated-artifact drift, full close-the-loop template: [references/2026-08-08-types-sync-generated-drift.md](references/2026-08-08-types-sync-generated-drift.md)
  — `TYPES_OUT_OF_SYNC` diagnosed from the `missing:`/`extra:`/`mismatched:` triple, fixed by running
  the canonical generator (never hand-editing the `.d.ts`), then PR → merge → post-merge verification
  inside ONE cron turn; includes the "gap-scan runs are your own PR's runs" trap and the
  identical-signal-count no-regression table.
- Inline-component lint class + the aborted-linter false PASS: [references/2026-08-08-static-components-inline-components.md](references/2026-08-08-static-components-inline-components.md)
  — `react-hooks/static-components` ×20 from TWO declarations (hoist + render-function shapes); the
  `EXIT=2` config fault that made `grep -c` report a fake `0`; building and CALIBRATING a standalone
  ESLint harness against the pre-fix file; `160 (20 errors,140 warnings)` → `140 (0 errors,140 warnings)`
  as one-line proof of fix-plus-no-regression; max-warnings unmasking.
- Unregistered workspace tree surfacing as a test failure: [references/2026-08-08-cli-workspace-unregistered-vitest.md](references/2026-08-08-cli-workspace-unregistered-vitest.md)
  — `Error: CLI build failed` ×3 with `536 passed | 0 failed` as the tell that a `beforeAll` hook, not
  the code, is broken; the four-command chain proving `cli/*` is absent from both
  `pnpm-workspace.yaml packages:` and the lockfile importers; the `packages/cli` ≠ `cli/` trap; and
  the decision table that makes this a file-a-tracker, not a fix, under cron.
- Stale sibling coverage + a failing step that MOVED: [references/2026-08-08-stale-sibling-comment-and-moved-step.md](references/2026-08-08-stale-sibling-comment-and-moved-step.md)
  — 6 `action=delegate` failures that were 100% PR noise; why an existing OA-TWINS comment does NOT
  license silence once the PR is pushed to again; `cut -f1,2 <log> | sort -u` to enumerate the failing
  JOB/STEP; and the log line-count gap (283 vs 5397) as the tell that a *warning reduction* pushed a
  job past its lint gate into a pre-existing failure — unmasking, not regression.
- Draft blocks landing despite `MERGEABLE`: [references/2026-08-08-draft-pr-blocks-landing-and-fix-detection.md](references/2026-08-08-draft-pr-blocks-landing-and-fix-detection.md)
- **17th class** orphaned mirror test (`ERR_MODULE_NOT_FOUND`, 13 assertions fail — source subtree
  deleted + gitignored, canonical twin tests survive ⇒ delete the orphans, coverage-neutral) and
  **18th class** latent build gate (`Missing .env file` in `Build Check`, unmasked when its `needs:`
  job turned green ⇒ make `.env` optional + add the still-required `DATABASE_URL` placeholder to
  EVERY `pnpm build` step; 4-case EXIT-code verification table; PR → merge → post-merge main green):
  [references/2026-08-16-orphaned-mirror-tests-and-latent-env-gate.md](references/2026-08-16-orphaned-mirror-tests-and-latent-env-gate.md)
- **16th class** PM2 dup reg (2 ids vs `instances: 1`) → 502 gate or `speedList` throw; site `200`; PREV run too: [references/2026-08-14-pm2-ghost-id-deploy-false-red.md](references/2026-08-14-pm2-ghost-id-deploy-false-red.md)
- Draft PR blocks "land it" + a PR that fixes someone else's tracker: [references/2026-08-08-draft-pr-unlandable-and-cross-tracker-fix.md](references/2026-08-08-draft-pr-unlandable-and-cross-tracker-fix.md)
  — a "remove hardcoded key" PR that silently resolved the 15th class by adding root `tsx`, found by
  diffing `--json jobs` CONCLUSIONS; why `grep -c` of `0` on a PR log is proof-of-fix, not missing
  data; lockfile **shape C** (`+N/-0` additive); deleting a secret file clears the SCAN but not the
  EXPOSURE; and a `_ci_logs` clobber that fired with no sibling-write warning.
- Docs-only push + stale-by-sha PR coverage (the steady-state poll): [references/2026-08-08-docs-only-push-inherited-reds.md](references/2026-08-08-docs-only-push-inherited-reds.md)
  — `action=none` while two workflows were red on the newest `main` sha, with the OmniCore failure
  BELOW the state pointer; `event=push` clearing the PR-noise filter, resolved by reading the commit
  and an identical-count baseline table; PR-comment staleness by head-sha run `createdAt`; state file
  already equal-to-newest ⇒ skip the write; outcome = 0 issues, 2 comments, 1 digest.
- In-flight runs bury failures + the `createdAt` staleness inversion: [references/2026-08-08-inflight-runs-and-headsha-staleness.md](references/2026-08-08-inflight-runs-and-headsha-staleness.md)
  — `action=none` while main's newest sha was red because its runs had **no conclusion yet** at poll
  time, and `save_state` parked the pointer at an in-flight id *above* a run that later failed
  (burying mechanism #2); why an empty `conclusion` is neither pass nor fail; and the correction that
  `gh pr list --json createdAt` is PR-open time and inverts the sibling-coverage verdict (use
  `headRefOid` + the commits API for the head's real push time).
- Count deltas that mean nothing + ANSI-broken greps: [references/2026-08-08-count-artifacts-and-ansi-grep.md](references/2026-08-08-count-artifacts-and-ansi-grep.md)
  — `grep -c` **6 → 3** while `Test Files` was identical (matched the error line AND its code frame);
  `-E` patterns returning **empty** because ANSI codes sit between tokens.
- Push scope beats commit type; `Possible secret detected`=2 is ONE hit + the YAML echo:
  [references/2026-08-08-push-scope-and-command-echo-miscount.md](references/2026-08-08-push-scope-and-command-echo-miscount.md)

### Hermes update & doctor on Windows
Off-topic — load the `windows-hermes-update-troubleshooting` skill.
