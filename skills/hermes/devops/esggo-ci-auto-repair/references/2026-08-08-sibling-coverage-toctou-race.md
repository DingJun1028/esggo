# Sibling coverage checks are TOCTOU — a 44-second race produced a duplicate comment

Date: 2026-08-08, 10:45 cron turn. Repo: DingJun1028/esggo.

## The rule that failed

Every anti-spam rule in SKILL.md says "check for an existing OA-TWINS comment before posting".
That check has a race window equal to however long your triage takes. On a repo with concurrent
sibling cron polls, that window is enough to lose.

## Measured timeline

| Time (UTC) | Event |
| --- | --- |
| `10:45:49` | watcher poll returns `action=none`, `newest_run_id=31253187601` |
| `~10:47` | `gh issue view 472 --json comments` → **clean** (only Jules bot, Cloudflare, coderabbit) |
| `10:50:38` | **sibling** posts its own OA-TWINS no-regression verification to #472 |
| `10:51:22` | this agent posts a near-identical verification → **duplicate** |

Both comments said the same thing (PR #472 introduces no regression, reds inherited from `main`),
on a one-file accessibility PR (`components/layout/spirit-modal.tsx +18/-10`). Exactly the spam the
rule exists to prevent.

## The early-warning signal that was available and ignored

`~/AppData/Local/hermes/scripts/_auto_repair_alert.txt` had been rewritten by the sibling at local
`18:51`. Reading it showed a staged digest already containing the line:

```
· #472 無回歸驗證留言 ✅
```

**The shared Telegram buffer told the truth before the GitHub comments API did.** The existing rule
treats that buffer purely as a dispatch-time clobber check; it is also a *coverage* signal about what
siblings have done or are about to do.

## Corrected procedure

1. Read `_auto_repair_alert.txt` as part of the coverage check, not only before dispatch. If it
   already lists the action you were about to take, abort.
2. Re-read the target's newest comment timestamp immediately before posting:
   ```bash
   gh issue view <n> --repo DingJun1028/esggo --json comments --jq '.comments[-1].createdAt'
   ```
   If it is within ~5 minutes of now and is not yours, assume a sibling has it and abort.
3. Duplicates are **not recoverable from cron**. Do not delete a sibling's comment, and do not delete
   your own to tidy up — deleting evidence is worse than a duplicate. Report it honestly in the turn
   report instead.
4. Do **not** clobber a sibling's staged Telegram buffer to insert your own digest. If your unique
   finding is already covered on its own surfaces, let the sibling's digest go out and put your
   finding in the cron turn report.

## Same-turn context (why the duplicate was avoidable but the triage was still correct)

The turn's substantive findings were sound and independently re-derived:

- Watcher `action=none` while `main` `035cba3c` was red in OmniCore CI (`31253147510`) and Sacred
  Pipeline (`31253147487`) — burying mechanism #1 (the `workflow_run` auto-repair run always takes
  the highest id, so the state pointer `31253187601` sat above both failures).
- Head commit was docs+script only (`SPEECH_TO_SPEECH_INTEGRATION.md`, `_tmp_vps/ollama_downgrade.sh`,
  `+177/-0`), so reds were inherited by construction. Identical-count baseline vs main `0bd4c3a4`:
  `CLI build failed` 6→6, `Possible secret detected` 2→2, OmniCore ESLint `205 (0 errors)` →
  `205 (0 errors)`, Sacred ESLint `140 (0 errors)` → `140 (0 errors)`, `static-components` 0→0.

## Bonus finding: #469 vs #470 is NOT a contradiction — resolve it with `--json jobs`

Tracker #465 carried a 09:20 comment claiming "修復已存在於 PR #469（已實測轉綠）", while the 10:30 turn
had proven that adding `tsx`/`commander` to **root** does not fix the 15th class (verified on #470).
These look contradictory. Job conclusions settle it — the two PRs genuinely differ:

| Job | main `035cba3c` `31253147510` | PR #469 `f25b2463` `31249545861` | PR #470 `22133547` `31252137447` |
| --- | --- | --- | --- |
| `Vitest Tests` | failure | **success** | failure |
| `Secret Scan` | failure | **success** | failure |
| `ESLint` | failure | failure | failure |

So #469 really is the landable fix for both #465 and the Secret Scan gate; #470's superficially
similar root-dependency change is insufficient. **Never assume two PRs with similar diffs have the
same effect — diff their job conclusions.** #469 remains `isDraft=true`, so cron cannot land it
(`gh pr ready` is the author's call); the correct output is to flag the one manual step.

## Housekeeping finding

`SKILL.md` for `esggo-ci-auto-repair` hit **100,139 chars against the 100,000 limit**, so
`skill_manage(action='patch')` now refuses all additions. New lessons must go to `references/` until
a foreground session splits the file (the per-class sections are the obvious extraction candidates).
