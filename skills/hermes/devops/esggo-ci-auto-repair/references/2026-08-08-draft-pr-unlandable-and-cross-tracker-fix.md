# Draft PR blocks the "land it" rule + a PR that silently fixes OTHER trackers (2026-08-08, 09:1x turn)

Watcher said `action=none`, `newest_run_id=31249578667`. Steady state on the surface — but the turn
produced a real finding, and also hit a hard blocker that the skill had not documented.

## Snapshot

All 20 most-recent runs were `event=pull_request` across three PRs; `main` had no new activity since
`845e74bd` (07:44). Provenance-first (`gh run list --json ...,event,headBranch`) prevented triaging
another agent's verification fan-out as production breakage.

`main` @ `845e74bd` reds, every one already tracked ⇒ **0 new issues filed** (deliberate):

| Workflow | Failing job(s) | Tracker |
| --- | --- | --- |
| OmniCore CI | ESLint / Secret Scan / Vitest Tests | #444 / #430 / #465 |
| 🌌 Sacred Pipeline | Linting | #444 |
| ESG-GO CI/CD | Security Scan / Code Quality | #429 / #444 |
| Deploy to Oracle VPS | Deploy to VPS | #434 |

## Finding 1 — a PR titled for one purpose fixed a DIFFERENT tracker

PR #469 was titled `🛡️ Sentinel: [CRITICAL] Remove hardcoded API key from gateway config`. Its diff
also added to **root** `package.json` devDependencies:

```
+    "commander": "^12.1.0",
+    "tsx": "^4.23.8",
```

That resolves the **15th class** (`CLI build failed`, tracker #465): `cli/*/src/index.test.ts` has a
`beforeAll` doing `spawnSync('npx', ['tsx', src, '--version'])`, and `tsx` existed nowhere on the
runner. Nothing in the PR title, branch name, or tracker cross-references hinted at this.

**Detection method — diff JOB CONCLUSIONS, not just error signatures:**

```bash
gh run view <pr_run_id> --repo <r> --json jobs --jq '.jobs[] | "\(.conclusion)\t\(.name)"'
```

| Job | main `845e74bd` (31246837246) | PR #469 `f25b2463` (31249545861) |
| --- | --- | --- |
| Secret Scan | **failure** | ✅ **success** |
| Vitest Tests | **failure** | ✅ **success** |
| ESLint | failure | failure (only remaining) |
| TypeScript Check / Worker Check / Validate VPS Scripts | success | success |

`cut -f1,2 <log> | sort -u` corroborated it: main listed three failing job/step pairs, the PR listed
only `ESLint / Run ESLint`.

### Interpretive rule: a `grep -c` of **0** on a PR log can be PROOF OF FIX, not missing data

`--log-failed` contains only failed jobs. So when a job passes it vanishes from the log entirely:

```
grep -c "CLI build failed"        main: 6   PR: 0
grep -c "Possible secret detected" main: 2   PR: 0
```

Do **not** read those zeros as "signature absent / inconclusive". Confirm the direction with the
`--json jobs` conclusion (here `success`), and the zero becomes positive evidence. The inverse trap
already in the skill (an aborted linter greps as clean, `EXIT=2`) is the same coin: **always pair a
count with the job/step conclusion.**

### Why the lockfile change was safe (extends the 11th/12th class decision)

`pnpm-lock.yaml` was **`+6/-0`**, adding only two entries to the **root importer** — no regeneration,
no importer pruning, no `overrides:` edit. That is a *third* shape alongside route A / route B:

| Shape | Lockfile effect | Rollback hazard vs stale PRs |
| --- | --- | --- |
| A — bump manifest specifiers | untouched | none |
| B — `pnpm install --lockfile-only` | regenerated, importers pruned | **high** |
| C — additive new dep in one importer | append-only diff | none |

Verify shape C by reading the diff hunks, not the file count:
`gh pr diff <n> | grep -A14 "^diff --git a/pnpm-lock.yaml"`.

## Finding 2 — `mergeable=MERGEABLE` does NOT mean landable

The "`action=none` ⇒ land the fix PR" rule fired correctly, and the merge was refused:

```
$ gh pr merge 469 --repo DingJun1028/esggo --squash --delete-branch
GraphQL: Pull Request is still a draft (mergePullRequest)
exit=1
```

`gh pr view 469 --json state,mergeable` reported `state=OPEN mergeable=MERGEABLE` — **draft status is
a separate field.** All three feature PRs were drafts:

```bash
gh pr list --repo <r> --state open --limit 20 \
  --json number,isDraft,mergeable,headRefOid,title \
  --jq '.[] | "#\(.number) draft=\(.isDraft) mergeable=\(.mergeable) head=\(.headRefOid[0:8])"'
```

```
#470 draft=true  mergeable=MERGEABLE
#469 draft=true  mergeable=MERGEABLE
#468 draft=true  mergeable=MERGEABLE
#450 draft=false mergeable=MERGEABLE   ← stale route-B, already block-warned
#449 draft=false mergeable=MERGEABLE   ← stale route-B, already block-warned
```

**Do not `gh pr ready` another agent's draft.** Marking ready is an authorship decision and it
triggers reviewers/merge queues. The correct cron output is a comment stating the fix is verified and
the only blocker is draft status, plus a recommendation to the owner.

## Finding 3 — sibling coverage is per-SURFACE, not per-finding

A sibling independently reached the *same* conclusions and posted them to **#469 at `09:19:44Z`**
(confirmed via `gh issue view 469 --json comments`). Anti-spam ⇒ stayed silent on #469.

But `gh issue view 465 --json comments --jq '.comments[] | ...'` returned **empty** — the tracker had
zero comments. The sibling covered the PR surface and left the tracker surface uncovered.

> Rule: when a sibling has covered one surface, enumerate the OTHER surfaces (tracker issue, the
> `(unknown)` auto-repair issue, the PR) before concluding "already handled". Silence on all of them
> is only correct when all of them are covered.

Posted to the uncovered one: `https://github.com/DingJun1028/esggo/issues/465#issuecomment-5225489127`.

## Finding 4 — the `_ci_logs` clobber can happen with NO sibling-write warning

`write_file` returned `{"bytes_written": 4062, "verified": true}`. Seconds later:

```
$ wc -c /c/Project/_ci_logs/c469_oatwins_0920.md
3168
$ head -1 /c/Project/_ci_logs/c469_oatwins_0920.md
## 🐝 OA-TWINS 自動巡檢（新 sha `f25b2463` 權威複驗）— **前一則 08:16 判定已過時**, ...
```

Different size **and** different first line — a sibling had overwritten it with their own body. No
`modified by sibling subagent` warning fired. So `verified: true` at write time proves nothing about
the file at dispatch time. Re-read `wc -c` **plus** `head -1` immediately before `gh ... -F` and
compare against what you wrote; if it is not yours, read it and re-decide (here it revealed the
sibling had the finding covered, which changed the plan from "post" to "stay silent").

## No-regression evidence (same-workflow only)

| Workflow | main `845e74bd` | PR #469 `f25b2463` | Δ |
| --- | --- | --- | --- |
| OmniCore CI | `205 problems (0 errors, 205 warnings)` | `200 problems (0 errors, 200 warnings)` | −5 warn |
| 🌌 Sacred Pipeline | `140 problems (0 errors, 140 warnings)` | `135 problems (0 errors, 135 warnings)` | −5 warn |

Rule-frequency diff isolated the whole delta to one rule:

| Rule | main | PR |
| --- | --- | --- |
| `@typescript-eslint/no-unused-vars` | 114 | **109** |
| `@typescript-eslint/no-explicit-any` | 73 | 73 |
| `@typescript-eslint/no-require-imports` | 6 | 6 |
| `@typescript-eslint/no-var-requires` | 4 | 4 |

## Watcher state

`cat ~/.hermes/scripts/gh-error-watch.state` → `31249578667`; newest run → `31249578667`. **Equal ⇒
skipped the write** and said so in the report, rather than issuing a redundant monotonic write.

## #430 stays open after any such merge

Secret Scan is a working-tree `grep -r` (`./firebase-service-account.json:5: "private_key"`), so
deleting the file clears the *scan*. The key remains in **git history** on a public repo ⇒ revoke at
the provider first; history rewrite is a separate change, never bundled into a CI-fix PR.
