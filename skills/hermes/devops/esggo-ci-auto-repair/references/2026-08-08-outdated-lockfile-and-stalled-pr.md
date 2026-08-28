# 2026-08-08 — `action=none` but CI still fully blocked: the stalled-PR case

## One-line lesson
The watcher said `action: "none"` and the gap scan was empty — yet **every CI install was still
dead**, because the verified fix was sitting in an **unmerged PR**. A cron turn that goes silent on
`action=none` alone will let a P0 sit red indefinitely.

## Timeline

| Time | Event |
| --- | --- |
| 04:48 | PR #455 opened (fix for `ERR_PNPM_OUTDATED_LOCKFILE`), CI runs on its head |
| 04:52 | Tracker #457 filed with evidence the fix works |
| 05:10 | Cron poll → `action: "none"`, state already at newest run `31240296885` |
| 05:13 | This turn merged #455 → main `f84885018` → `18d8bc3c6` |

State file already equalled the newest run, so **both** the watcher and the gap scan were
legitimately empty. Nothing was "missed" by the tooling — the gap was that *nobody landed the fix*.

## Root cause: `ERR_PNPM_OUTDATED_LOCKFILE` (distinct from CONFIG_MISMATCH)

Real log (`gh run view <id> --log-failed`):

    [ERR_PNPM_OUTDATED_LOCKFILE] Cannot install with "frozen-lockfile" because
    pnpm-lock.yaml is not up to date with <ROOT>/apps/cf-tunnel-manager/package.json

      Failure reason:
      specifiers in the lockfile don't match specifiers in package.json:
    * 2 dependencies are mismatched:
      - tsx (lockfile: ^4.23.8, manifest: ^4.19.0)
      - typescript (lockfile: ^5.9.3, manifest: ^5.6.0)

Note this is the **inverse** of `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`: that one is about the
`overrides:` block, this one is about per-importer **dependency specifiers**.

Read-only diagnosis on the sha CI actually built (no install, no checkout):

    git show origin/main:apps/cf-tunnel-manager/package.json | grep -E '"(tsx|typescript)"'
    git show origin/main:pnpm-lock.yaml | sed -n '/^  apps\/cf-tunnel-manager:/,/^  apps\/[a-z-]*:$/p'

| 來源 | tsx | typescript |
| --- | --- | --- |
| `apps/cf-tunnel-manager/package.json` | `^4.19.0` | `^5.6.0` |
| `pnpm-lock.yaml` importer specifier | `^4.23.8` | `^5.9.3` |

## THE TRAP: two repair routes that silently undo each other

| Route | Changes | Used by |
| --- | --- | --- |
| A — manifest → lockfile | 7 × `package.json` bumped to match lockfile; **lockfile untouched** | PR #455 (merged) |
| B — lockfile → manifest | regenerate `pnpm-lock.yaml` only | PR #449, #450 (stale) |

#449/#450 were opened earlier for the *overrides* CONFIG_MISMATCH and only touch
`pnpm-lock.yaml`. Their lockfile was generated **before** route A aligned the manifests. Merging
either one after #455 would roll the lockfile back to a state that no longer matches the new
manifests → **`ERR_PNPM_OUTDATED_LOCKFILE` returns**, re-blocking 4 workflows.

Action taken: commented a block-warning on both instead of merging or closing another agent's PR.

## Evidence table (this is the shape to reproduce)

Before/after, all from real `--log-failed` output:

| grep | PR #455 head `062607e2` | main post-merge `18d8bc3` |
| --- | --- | --- |
| `ERR_PNPM_OUTDATED_LOCKFILE` | 0 | 0 |
| `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` | 0 | 0 |
| `command not found｜MODULE_NOT_FOUND｜Cannot find module` | 0 | 0 |
| `static-components` | 20 | 20 (pre-existing, #441/#444) |
| `Possible secret detected` | 2 | 2 (pre-existing, #430) |
| `syntax error near` | 1 | 1 (pre-existing, #433) |

Passing jobs on the fix: `TypeScript Check`, `Worker Check`, `build-and-test`, `build`,
`agents.yaml Verification`.

**Verify on a post-merge `main` run, not only on the PR head.** The PR head can be green-ish for
reasons that do not survive the squash (different merge base). One extra `gh run view` on the
first main run after merge is the real proof.

## The overrides-diff false positive

The skill's overrides key-diff one-liner reports a mismatch that is really just **YAML comment
lines** in `pnpm-workspace.yaml` being captured by the grep:

    1,4d0
    < #undici同majorpatch，jsdom@29接受^7.25.0...
    < #安全修補：必須加<major上界，裸

Comment lines start with `#` and are not keys. Before believing a CONFIG_MISMATCH diff, confirm the
differing lines are not comments — or cross-check with `grep -c ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`
on the newest real log, which is authoritative.

## Housekeeping done

- Closed #457/#456 (OUTDATED_LOCKFILE) and #452/#448 (CONFIG_MISMATCH, grep count now 0),
  deduped by root cause — **no new issues opened**, since every live cause already had a tracker.
- Advanced watcher state to the newest run id so the merge-triggered runs (which fail only from
  already-tracked causes) do not spawn duplicate trackers next poll.
- Left a stale worktree `C:/Project/_verify2` alone: a sibling subagent was concurrently active
  (proved by a `write_file` sibling-modification warning on the state file). Flagged it for a
  foreground session instead of force-removing it.

## Still open after this turn

- #430 — `firebase-service-account.json` committed to a public repo (Trivy CRITICAL).
  **Revoke/rotate at GCP first**; never bundle a history rewrite into a CI-fix PR, and never
  attempt one from cron while other agents push.
- #434 — Deploy to Oracle VPS `Permission denied (publickey)`, exit 255. Not auto-repairable.
