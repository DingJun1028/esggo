# Root-cause trackers as the uncovered surface + a tracker that became the critical path
### esggo, 2026-08-08 11:41 UTC cron poll

The steady-state poll where **every PR surface was already covered by siblings** and the real gap was
sitting in the root-cause trackers themselves — one of which had gone 8 hours with **zero comments**.

---

## 1. Opening state — every "nothing to do" signal fired at once

```json
{"new_failures": [], "action": "none", "newest_run_id": "31253187601"}
```

Three separate reasons to go silent, all of them wrong:

| Signal | Why it said "silent" | Why it was wrong |
| --- | --- | --- |
| watcher `action=none` | no NEW failure class | burying mechanism #1 — the auto-repair success run (`31253187601`) sat above two `main` failures |
| head commit is docs | `docs+script:` 177 insertions / 0 deletions | true, and it *did* mean zero regression — but `main` was still red |
| all 4 open PRs had OA-TWINS comments newer than their head-sha push | sibling coverage | coverage was per-PR; the **trackers** were not covered |

Gap scan by sha found `main @ 035cba3c` red in two workflows:

| Workflow | run | failing job / step |
| --- | --- | --- |
| OmniCore CI | `31253147510` | ESLint, Secret Scan, Vitest Tests |
| 🌌 Sacred Pipeline | `31253147487` | 🛡️ 原罪煉金 / 🔍 Linting |

Inherited-not-regressed, proven against the previous `main` sha:

| Signal (OmniCore) | `0bd4c3a4` (31250979668) | `035cba3c` (31253147510) |
| --- | --- | --- |
| failing job/step | ESLint / Secret Scan / Vitest | identical |
| ESLint | `205 problems (0 errors, 205 warnings)` | `205 problems (0 errors, 205 warnings)` |
| `CLI build failed` | 6 | 6 |
| `Possible secret detected` | 2 | 2 |
| `Test Files` | `3 failed \| 44 passed (47)` | `3 failed \| 44 passed (47)` |

Sacred likewise flat: `31250979702` → `31253147487`, both 283 log lines, both `140 (0 errors, 140 warnings)`.

---

## 2. The PR coverage check said "stay silent" — and it was right

Comparing each PR's newest comment against its **head sha's real push time**
(`headRefOid` → commits API, never `gh pr list --json createdAt`):

| PR | head | pushed | newest comment | verdict |
| --- | --- | --- | --- | --- |
| #468 | `ff9e9114` | 08:57:06 | 09:44:09 | covered |
| #469 | `f25b2463` | 08:58:12 | 09:19:44 | covered |
| #470 | `22133547` | 10:08:33 | 10:28:09 | covered |
| #472 | `8f9aa8f7` | 10:33:15 | 10:51:22 | covered |

The auto-repair `(unknown)` issue for the exact run being triaged (#473) was **also** covered — a
sibling had posted the authoritative re-classification at 10:50:35, reaching the same
"inherited, docs-only" conclusion.

**Four PRs + the run's own auto-repair issue, all covered. The naive read is "sibling beat me, exit".**

---

## 3. The actual gap: the root-cause trackers

Enumerating comment coverage on the trackers the reds mapped to:

```bash
gh issue view 444 --repo DingJun1028/esggo --json comments --jq '.comments[] | "\(.createdAt) \(.body[0:80])"'
# → (empty)
gh issue view 430 --repo DingJun1028/esggo --json comments --jq '.comments[] | "\(.createdAt) \(.body[0:80])"'
# → 03:49:29, 04:26:28, 04:51:29, 05:20:21
```

| Tracker | comments | newest | verdict |
| --- | --- | --- | --- |
| #444 (ESLint max-warnings) | **0** | — | filed 03:49, **8 hours with zero coverage** |
| #430 (committed secret) | 4 | **05:20** | has comments, but newest **predates** the 09:1x #469 finding |
| #465 (CLI build failed) | 1 | 09:20 | covered |

**Two shapes of "uncovered" and only one of them is visible to an existence check:**

- #444 — zero comments. Any check catches this.
- #430 — four comments, looks well-tended. Only a **timestamp comparison against the finding you want
  to publish** reveals it is stale.

This is the refinement over the existing per-surface rule: a tracker having comments is not coverage.
Coverage means *a comment newer than the finding*.

---

## 4. Resolving a contradiction the skill itself carried

Two prior entries disagreed about whether adding `tsx`/`commander` to **root** fixes the 15th class:

- 09:1x turn: "#469 … added `tsx`/`commander` to root devDependencies and thereby resolved the 15th
  class (tracker #465)."
- 10:30 turn: "**Adding the missing dep to ROOT does NOT fix it**" — PR #470, `Test Files` identical
  on both sides.

Both cannot be general. Resolved with one call against #469's own current head (`f25b2463`,
OmniCore run `31249545861`):

```bash
gh run view 31249545861 --repo DingJun1028/esggo --json jobs --jq '.jobs[] | "\(.conclusion)\t\(.name)"'
```

```
success   Validate VPS Scripts
success   Secret Scan
success   agents.yaml Verification
success   Vitest Tests
success   TypeScript Check
failure   ESLint
success   Worker Check
skipped   Docker Build Test / Build Check / Lighthouse CI
```

Corroborated by `cut -f1,2 <log> | sort -u` returning exactly one line (`ESLint  Run ESLint`), and by
`grep -c` on the PR log: `Possible secret detected` **0**, `CLI build failed` **0** — zeros that are
proof-of-fix precisely because they are paired with `success` conclusions.

**Verdict: #469 genuinely fixes it; #470 did not. Neither turn was lying — they measured different
PRs.** The lesson is not "root deps do/don't work", it is: *never generalize "class X is (un)fixable
by approach Y" from one PR.* Re-verify per PR, per head sha, with `--json jobs`.

Note the instrument matters. The 10:30 entry advised "re-confirm on the first **post-merge main** run
before closing". #469 is a **stuck draft** — there is no post-merge main run and may never be, so
that advice would have left #465 unverified indefinitely. The PR's own run is the available surface.

---

## 5. A tracker can become the critical path with no new failure

Nothing about #444 changed. Everything *around* it got fixed:

- #441 (`react-hooks/static-components`) closed earlier → both workflows now report **`0 errors`**.
- #469 flips Secret Scan and Vitest to `success`.

Result: on #469's run, ESLint is the **only** failing job (`200 problems (0 errors, 200 warnings)`
against a `--max-warnings 50` gate). A poll that only asks "what is new" never notices a tracker
being promoted to sole blocker.

Add the question to every poll: **has any existing tracker become the critical path?** It is the
positive-direction analog of the two-directional PR comparison — and it is what made a
zero-comment 8-hour-old tracker the highest-value thing to write that turn.

Also worth recording in the comment: the `205` (OmniCore) vs `140` (Sacred) counts are **not
comparable** — different lint scopes — so neither number alone describes "how far from green".

And the anti-suppression guard, because the fix is tempting to fake:

```bash
gh pr diff 470 --repo DingJun1028/esggo | grep -c "eslint-disable"   # → 36
```

A `205 → 196` warning drop that comes from 36 injected `eslint-disable-line` comments is suppression,
not resolution, and must not close #444.

---

## 6. Secret ordering: revoke before the MERGE, not just before a history rewrite

esggo's Secret Scan greps the **working tree**
(`grep -r ... --exclude-dir=node_modules --exclude-dir=.next .`), so #469's
`firebase-service-account.json +0/-12` takes the signal `2 → 0` and the job `failure → success`.

Verified the exposure survives that:

```bash
gh repo view DingJun1028/esggo --json visibility --jq '.visibility'      # PUBLIC
git cat-file -e origin/main:firebase-service-account.json               # exists
```

So merging the deletion PR **removes the only visible alarm while the key stays reachable** via
`git show <old-sha>:firebase-service-account.json`. Revocation must therefore precede the *merge*,
not merely precede a history rewrite. Order written into the tracker:

1. revoke/rotate at GCP/Firebase — the only step that actually stops the bleeding
2. merge #469 to unblock CI
3. history rewrite, separately scheduled, foreground, no concurrent pushes
4. close #430 **only** on evidence of provider-side revocation — never on a green scan

---

## 7. Outcome

| Item | Result |
| --- | --- |
| New issues | **0** — every cause already tracked (#444 / #430 / #465) |
| Comments | **2**, both to previously-uncovered surfaces (#444 first-ever, #430 superseding 05:20) |
| PRs touched | 0 — all 4 covered on their current head shas |
| State file | not written; already `31253187601` = newest run id |
| Manual action flagged | #469 `isDraft=true` blocks the merge; revoke key first |

Report opened by declaring both standing deviations (not silent despite `action=none`; `delegate_task`
deliberately not used under cron) before any findings.
