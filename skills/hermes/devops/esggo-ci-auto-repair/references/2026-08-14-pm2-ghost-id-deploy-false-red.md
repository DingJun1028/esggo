# 16th class: `pm2_ghost_id_deploy_false_red` — crash in the DISPLAY function, service healthy

Discovered 2026-08-14 cron turn. Run `31753130343`, `Deploy to Oracle VPS`, sha `f9d334fe`.
**Invisible to the 9/15-class log-grep triage**: no TS / ESLint / pnpm / Trivy / secret signature
appears anywhere in the log.

## Signature
Job `Deploy to VPS` → step `Deploy direct`:
```
[PM2] Applying action restartProcessId on app [esggo-core](ids: [ 12, 13 ])
[PM2][ERROR] Process 12 not found
Process 12 not found
/usr/lib/node_modules/pm2/lib/API.js:1718
        acted.push(proc.pm2_env ? proc.pm2_env.pm_id : proc.pm_id)
TypeError: Cannot read properties of undefined (reading 'pm2_env')
    at API.speedList (/usr/lib/node_modules/pm2/lib/API.js:1717:18)
Node.js v22.23.2
##[error]Process completed with exit code 1.
```
Job conclusions: `Pre-deploy Check` success · **`Deploy to VPS` failure** · `Deploy Notification` success.

## The decisive tell — it is a FALSE RED
Two facts, both in the log itself:
1. **Every restart printed `✓`** (`universal-translator`, `stt-whisper`, `deerflow`,
   `omniagent-gateway`).
2. **The throw site is `API.speedList`** — the function that *prints the process table*, i.e. it runs
   **after** the action has been applied.

So the deploy largely succeeded and the failure is in reporting, not in deployment. Confirm from
outside before writing anything into a tracker:
```bash
curl -s -o /dev/null -w "%{http_code}\n" --max-time 20 https://live.esggo.co/      # → 200
curl -s -o /dev/null -w "%{http_code}\n" --max-time 20 https://aistation.esggo.co/ # → 200
```
`200` ⇒ false-red, **not** an outage. Never escalate this as a site-down P0 without that check.

## Root-cause chain — the contradiction IS the diagnosis
| # | Fact | How to prove it |
| --- | --- | --- |
| 1 | config declares the app as a **single** process (`instances: 1`, `exec_mode: 'fork'`) | `grep -n "esggo-core" -A 8 ecosystem.config.cjs` |
| 2 | PM2 on the VPS resolves that name to **two** ids `[12, 13]`; the lower is a **ghost** with no `pm2_env` (stale entry in PM2's saved dump) | the log line above |
| 3 | `pm2 start ecosystem.config.cjs --update-env` touches the ghost → TypeError in `speedList` | log |
| 4 | guard `... --update-env 2>/dev/null \|\| pm2 start ecosystem.config.cjs` **retries the identical failing command**; the retry's stderr is not suppressed → `exit 1` → `set -e` → job red | `deploy-oracle.yml:227` / `:286` |

`instances: 1` in config vs **2 ids** at runtime is the whole diagnosis. Read the config before
believing the id list.

### Fingerprint: every service restarts TWICE in the log
Two batches ~1 s apart (here `23:16:33.x` then `23:16:34.x`). That is **main command + fallback**,
not an intentional loop and not a flaky double-trigger. If you see doubled restarts, go read the
`|| ` fallback in the deploy step before theorising about PM2 or the runner.

## Hard-coded mitigations rot — do not name ids
`deploy-oracle.yml:225` / `:284` already carried:
```
# 避免 VPS 上 PM2 內部狀態損壞 (ghost id 17/18, pm2_env undefined) 導致部署紅
```
Same disease, previously diagnosed — but the ghost ids had **drifted `17/18 → 12/13`**, so the
mitigation silently stopped matching. Never fix this class by enumerating ids; clear the ghost
registration or gate success on a health check.

## Blast radius — split it honestly in the tracker
The crash interrupts the restart of one app, so that app's restart is **unconfirmed** while the
earlier ones are proven:

| Service | restart result |
| --- | --- |
| universal-translator | ✓ |
| stt-whisper | ✓ |
| deerflow | ✓ |
| omniagent-gateway | ✓ |
| **esggo-core** | **unconfirmed** — crash occurred mid-restart (but serving `200`) |

Do not write "deploy failed" and do not write "deploy succeeded". Write both halves.

## NOT auto-repairable under cron
The fix requires either a **VPS runtime mutation** or a **production deploy-script change**, and
neither is mechanically verifiable without running a real deploy against the VPS. Combined with the
standing cron constraints (no user present to approve, `delegate_task` subagents discarded at session
exit, esggo is a multi-agent concurrent-push repo), the correct cron output is
**comment with evidence, do not push**.

### Recommended fixes to name in the tracker
- **Root fix (VPS, one-shot):**
  `pm2 delete <app> && pm2 start ecosystem.config.cjs --only <app> && pm2 save`
- **Repo hardening:** the fallback must not repeat the same command. Either clear a ghost harmlessly
  first (`pm2 describe <app> >/dev/null 2>&1 || pm2 delete <app> 2>/dev/null || true`) or gate step
  success on an **HTTP health check** rather than pm2's exit code.

### Acceptance criteria (for a foreground session)
- `pm2 list` shows exactly **one** id for the app; `pm2 describe <app>` has no ghost.
- Next `Deploy to Oracle VPS` run: `grep -c "Process .* not found"` → **0**,
  `grep -c pm2_env` → **0**, and job `Deploy to VPS` → `success`.

## Cron-turn shape this produced
Watcher `oa-twins-tracker.py` returned `action=delegate, failures=1, telegram_sent=1,
issues_created=0` — `issues_created: 0` was **correct dedupe**, tracker #738 already existed from an
earlier poll. But #738 had **0 comments** and a generic title carrying no root cause, i.e. the classic
"genuine uncovered surface". Correct output: **0 issues, 1 authoritative root-cause comment, 1 digest.**

Also note the newest sha (`211953372`) was **green across all 4 workflows** that ran on it, and
`Deploy to Oracle VPS` did **not** re-run there — so the failure on the older sha `f9d334fe` was still
the *current* state of that workflow, not something superseded. Check whether the failing workflow
actually re-ran on the newest sha before calling a red "stale".

---

## REFINEMENT (2026-08-14, 00:1x turn) — the ghost is a SYMPTOM; check the PREVIOUS deploy run too

The turn above stopped at the newest failing deploy run. **Always pull the previous run of the same
workflow** — here it was *also* red, with a **completely different signature and zero tracking**:

| | earlier run `31752898499` | later run `31753130343` |
| --- | --- | --- |
| sha / time | `78c69e31` · 23:11:20Z | `f9d334fe` · 23:15:08Z |
| signature | **`[FAIL] post-deploy health check: gateway=502 web=200`** | `Process 12 not found` → `TypeError ... pm2_env` |
| `grep -ac "not found"` | **0** | 3 |
| `esggo-core` ids | `[ 12, 13 ]` — **both `✓`** | `[ 12, 13 ]` — 12 is a ghost |

`gh search issues --repo <r> "31752898499"` → `[]` ⇒ the earlier red had **no tracker at all**, while
the tracker that did exist described only the later one. One workflow, two consecutive reds, two
different signatures, one shared upstream defect.

### The real root defect: DUPLICATE REGISTRATION, not "a ghost id"
`ecosystem.config.cjs:4-10` declares `esggo-core` as `instances: 1` + `exec_mode: 'fork'` on
`127.0.0.1:3000`, yet PM2 resolves the name to **two** ids. That single defect emits two distinct reds
depending on *when* you catch it:

1. **Stage 1** — both ids start `✓`, contend for the same port, the public endpoint stays **502 for the
   full 60 s** health window (`for i in $(seq 1 12); do sleep 5 ...`, gate needs `gateway=200` **and**
   `web=200`) ⇒ `exit 1`.
2. **Stage 2** — the losing process dies, its entry loses `pm2_env`, and the next `pm2 start` touches
   it ⇒ TypeError in `speedList`.

**id 12 restarted `✓` at 23:13:23 and was a ghost by 23:16:34** — ~3 minutes. So a log showing healthy
restarts does **not** clear this class; it may just be pre-death. Say "duplicate registration" in the
tracker, never "ghost id 12" — naming the id is what made the previous mitigation
(`# ghost id 17/18`) rot silently when the ids drifted to `12/13`.

Label the port-contention link as a **hypothesis**: it is consistent with the evidence but not proven
without `pm2 list` on the VPS, which cron cannot reach. Proven parts = declared-1-vs-runtime-2, both
ids restarted `✓`, one later became a ghost.

### `pm2_env` count 1 is the YAML COMMENT, not an error
The deploy step echoes its own source, including
`# 避免 VPS 上 PM2 內部狀態損壞 (ghost id 17/18, pm2_env undefined) ...`. So a clean run still greps
`pm2_env` → **1**. Only `>= 2` (the `acted.push(proc.pm2_env ...)` source frame + the TypeError line)
means a real crash. Same YAML-echo miscount trap as `Possible secret detected`=2.

### Health-check 502 that has since recovered is a TRANSIENT, not an outage
Verify all four endpoints before wording the tracker — on this turn `live.esggo.co`, `esggo.co`,
`aistation.esggo.co` and `omniagent.esggo.co/health` were **all 200** (`{"status":"healthy"}`).
Correct wording: the 502 red is a *self-recovered transient*, the PM2 red is a *false red*, **and the
upstream duplicate registration is still unfixed**, so further deploys keep emitting one red or the
other at random. All three clauses, or the next poll misreads it.

### Cron shape produced
Watcher `action=none` (state pointer sat on a later `OA-TWINS Auto-Repair` run, burying both deploy
failures). Gap scan by workflow found them. Output: **0 new issues** (both reds = one upstream cause
⇒ root-cause dedupe puts them on the existing tracker), **1 comment**, **0 pushes**, **0 state writes**.

### TOOL TRAP: native-Windows `python3` cannot read MSYS `/c/...` paths either
The skill documents this for `gh`; it applies to `python3` too. `gh ... > /c/Project/_ci_logs/x.json`
writes fine (bash does the redirect) and `wc -c` confirms the bytes, yet
`python3 -c "json.load(open('/c/Project/_ci_logs/x.json'))"` dies with **FileNotFoundError** — while
MSYS tools (`grep`, `sed`, `cut`, `wc`) on the identical path succeed. That split is very misleading.
Pass the drive-letter form to any native binary: `open('C:/Project/_ci_logs/x.json')`.

---

## REFINEMENT 2 (2026-08-14, 07:33 turn) — the SINGLE-id variant: "declared-1-vs-runtime-2" is NOT the universal tell

Run `31778505641`, sha `9a7daeb7`, 07:03:52Z. Same class, but the id list **breaks the diagnosis above**:

```
[PM2] Applying action restartProcessId on app [esggo-core](ids: [ 15 ])
[PM2][ERROR] Process 15 not found
        acted.push(proc.pm2_env ? proc.pm2_env.pm_id : proc.pm_id)
TypeError: Cannot read properties of undefined (reading 'pm2_env')
```

| | REFINEMENT 1 (`12, 13`) | REFINEMENT 2 (`15`) |
| --- | --- | --- |
| runtime ids for `esggo-core` | **2** | **1** |
| vs `instances: 1` | contradicts ⇒ duplicate registration | **agrees** |
| ghost identity | the lower of two ids | **the ONLY registration is the ghost** |

So there are **two sub-shapes** of one disease (a polluted PM2 saved dump):
- **A — duplicate registration:** two ids, port contention, stage-1 `502` health red / stage-2 `pm2_env` red.
- **B — orphaned sole registration:** one id matching config, but its process is long gone and the
  entry has lost `pm2_env`; the very first `pm2 start` touches it and dies in `speedList`.

**Consequence: never clear this class by checking `pm2 list` count alone.** A count of 1 looks
config-conformant and reads as healthy. Sub-shape B is invisible to that check — you must ask whether
the entry is *live*: `pm2 describe esggo-core` (a ghost has no `pm2_env`). Write "登錄污染 /
registration pollution", not "重複註冊", unless you have actually seen two ids **in the run you are
triaging** — a stale tracker comment asserting duplicate registration will send the next reader
looking for a second id that is not there, and they will wrongly conclude the class is resolved.

### ghost id has now drifted THREE times: `17/18` → `12/13` → `15`
The hard-coded mitigation comment in `deploy-oracle.yml` still says `ghost id 17/18`. Third
consecutive mismatch — this is now proven, not theoretical: **any fix that names ids is dead on
arrival.**

### `pm2_env` clean-run count is 1, and it is the YAML comment — reconfirmed
`grep -c pm2_env` → **1** on a clean run (the echoed `# ... pm2_env undefined ...` comment line).
Only `>= 2` is a real crash. Same for `Process .* not found` → must be **0**.

### The same push can carry a SECOND, unrelated root cause — decompose before blaming PM2
On the immediately preceding sha `f513772e` (06:36:40Z) **two** workflows went red from ONE cause that
has nothing to do with PM2 — a TS type error inside `next build`:
```
./app/omni-agent/page.tsx:602:17
Type error: 'res.data' is of type 'unknown'.
Failed to type check.
```
| run | workflow | failing job/step |
| --- | --- | --- |
| `31776891942` | OmniCore CI | `Build Check` / `Build` |
| `31776891906` | Deploy to Oracle VPS | `Deploy to VPS` / `Deploy direct` |

**`Deploy to Oracle VPS` runs its own `next build`, so a type error reds it identically to a PM2
fault** — and grepping that log for `pm2_env` / `not found` returns only the workflow's own YAML echo
lines, which is easy to misread as "the PM2 class again". Always `cut -f1,2 <log> | sort -u` then read
the real error tail; map `Deploy to Oracle VPS` reds to build-stage causes before PM2 ones.

### Cron shape produced
Watcher `action=delegate, failures=1, telegram_sent=1, issues_created=0` (correct dedupe, #738
existed). #738 had 2 comments but the newest was **4.5 h stale** and asserted sub-shape A, which was
factually wrong for the run being triaged ⇒ the tracker-staleness test ("would a reader acting on the
newest comment alone do the wrong thing?") answered YES. Output: **0 issues, 1 superseding comment,
0 pushes, 0 state writes**.

**Do NOT hand-advance `oa-twins-tracker.py`'s state file** (the two-state-paths rule) — it wrote
`31779891918` itself; gap-scan by `headSha` instead. Here the newest sha `1a3ecbe9` came back
**green on 5 workflows including `Deploy to Oracle VPS`** (`31780045771`), with `ESG-GO CI/CD Pipeline`
still `status=pending` — report a pending run as unresolved, never score it.
