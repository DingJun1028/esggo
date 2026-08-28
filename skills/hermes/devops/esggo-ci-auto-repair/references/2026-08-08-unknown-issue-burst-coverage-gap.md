# The `(unknown)` coverage gap is at the OLDER burst members, not the newest (2026-08-08, 13:15 turn)

Worked example for the per-surface coverage rule. Steady-state poll: nothing new, nothing landable,
every red already tracked — and the turn still produced two genuinely uncovered surfaces plus one
new positive fact.

## Snapshot

Watcher: `{"new_failures": [], "action": "none", "newest_run_id": "31257593762"}`

Burying mechanism #1 (the normal steady state): the pointer parked on the **auto-repair success run**,
which is `workflow_run`-triggered and therefore gets a HIGHER run_id than the failures it reacted to.

| run_id | conclusion | sha | workflow |
| --- | --- | --- | --- |
| `31257593762` | success | `3333cd10` | OA-TWINS Auto-Repair ← pointer landed here |
| `31257544563` | **failure** | `3333cd10` | OmniCore CI ← buried |
| `31257544560` | **failure** | `3333cd10` | 🌌 Sacred Pipeline ← buried |

## Provenance: judge by changed PATHS, not commit type

Three pushes in 8 minutes, two of them typed like production code:

| sha | commit | changed | delta |
| --- | --- | --- | --- |
| `9f6c9851` | `best-practice: 新增 H 節語音代理部署實踐` | `best-practice-items.md` | `+58/-2` |
| `36229367` | `fix(deploy): s2s 改用 transformers 直載 gemma4:e2b` | `_tmp_vps/deploy_voice_agent.sh` | `+132/-0` |
| `3333cd10` | `feat(watchdog): VPS OOM 看門狗` | `_tmp_vps/watchdog_vps.sh` | `+40/-0` |

`_tmp_vps/*.sh` is outside ESLint (`src/`, `app/`) and the Vitest globs ⇒ inherited by construction.

## Identical counts across all three shas

| main run | sha | `CLI build failed` | `Possible secret detected` | ESLint | `static-components` |
| --- | --- | --- | --- | --- | --- |
| `31257225680` | `9f6c9851` | 6 | 2 | `205 (0 errors, 205 warnings)` | 0 |
| `31257405965` | `36229367` | 6 | 2 | `205 (0 errors, 205 warnings)` | 0 |
| `31257544563` | `3333cd10` | 6 | 2 | `205 (0 errors, 205 warnings)` | 0 |

Failing job/step (`cut -f1,2 <log> | sort -u`): `ESLint / Run ESLint`, `Secret Scan / Scan for
committed secrets`, `Vitest Tests / Run Vitest`. Sacred: `🛡️ 原罪煉金 / 🔍 零幻覺靜態掃描 (Linting)`,
`140 (0 errors, 140 warnings)` — **do not compare 140 against OmniCore's 205**, different lint scopes.

Root causes → existing trackers: #465 (15th class), #444 (max-warnings), #430 (secret). Zero new.

## The actual finding: coverage was at the newest `(unknown)` only

`auto-repair.yml` files one `(unknown)` issue **per run_id**, so the burst produced three:

```
477  08-08T12:36  [OA-TWINS-AUTO-REPAIR] Auto-Repair - CI #31257544563 (unknown)
476  08-08T12:32  [OA-TWINS-AUTO-REPAIR] Auto-Repair - CI #31257405965 (unknown)
475  08-08T12:27  [OA-TWINS-AUTO-REPAIR] Auto-Repair - CI #31257225680 (unknown)
```

```bash
for n in 477 476 475; do echo -n "#$n "; gh issue view $n --repo DingJun1028/esggo --json comments --jq '.comments|length'; done
#477 2      ← sibling covered it (12:49:55 and 12:50:36, duplicates seconds apart = ONE coverage event)
#476 0      ← genuine gap
#475 0      ← genuine gap
```

The sibling's #477 comment was correct and even tabulated all three shas — but a reader landing on
#476 or #475 saw an unclassified `(unknown)` with no verdict. **The heuristic "the freshly-filed
`(unknown)` is the uncovered surface" fails whenever a burst files several**; siblings converge on
the newest. Enumerate by burst membership (the run_ids your gap scan just triaged).

Trackers were all covered and none stale: #465 `12:08:53`, #444 `12:29:32`, #430 `11:47:28`, and
nothing had changed about any of them (counts identical, no rival PR, no claim disproven).

## Coverage-exists ≠ coverage-COMPLETE

`.comments | length > 0` proves *someone posted*, not that your fact is recorded. Probe by name:

```bash
gh issue view 477 --repo DingJun1028/esggo --json comments --jq '.comments[-1].body' | grep -c "Validate VPS Scripts"
# → 0
```

The sibling had the inherited-reds analysis but **not** the positive evidence. Closing the loop from
the other side — find the job that WOULD have caught a regression from these commits and confirm it
ran green:

```
success   Validate VPS Scripts     ← the bash -n gate, on both shell-adding shas
success   TypeScript Check
success   Worker Check
success   agents.yaml Verification
```

172 new lines of shell are therefore **verified clean**, not merely outside the blast radius. That
upgrades "the reds are inherited" from absence-of-evidence to positive evidence, and it was the only
new fact the turn produced — so it belonged on the uncovered surfaces (#476/#475), not as a fourth
comment on #477.

## Outcome

`0` new issues, `2` comments (`issuecomment-5226262129`, `issuecomment-5226262622`), `1` digest,
`0` state writes — the state file already equalled the newest run id (`31257593762`), so writing
would have been redundant and risked a sibling warning.

Nothing landable: #468/#469/#470/#472 all `isDraft=true` (a draft refuses merge regardless of
`mergeable`), and #449/#450 are the stale route-B lockfile PRs that must stay unmerged.

## Fifth "nothing-to-do" shape

`action=none` + burying + all reds tracked + newest `(unknown)` covered, but OLDER same-burst
`(unknown)` issues at 0 comments ⇒ **0 issues, 2 comments, 1 digest, 0 state writes**. Not silence.
