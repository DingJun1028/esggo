---
name: hermes-state-sync-monitor
description: Check Hermes sync watermarks locally, read-only, no SSH.
---

# hermes-state-sync-monitor

Monitor opencode / Hermes sync watermarks stored in Hermes `state.db` (`state_meta` table), verify sync health via **LOCAL read-only** DB access, and produce a periodic sync-status report. This is the class behind the 15-min cron jobs `opencode-vps-sync` (checker) and `opencode-db-sync` (updater), and any task mentioning "sync watermark / last_sync / bridge status".

## Environment constraints (hard)
- **Hermes SSH backend is frequently broken → NEVER SSH** for sync verification. Mark VPS-side as `unreachable` and move on. No public sync HTTP endpoint exists to probe either.
- `state.db` is large (~600MB+) and busy → open **read-only**: `sqlite3.connect("file:<path>?mode=ro", uri=True)` + `PRAGMA busy_timeout=8000`. A check job must never write to it.
- No `sqlite3` CLI on Windows git-bash; use Python `sqlite3` module.

## Steps
1. **Read watermarks** from `state_meta`:
   - `SELECT key,value FROM state_meta WHERE key LIKE '%last_sync%'`
   - Also pull bridge counters: `telegram_vps_bridge_last_id` is a **MSG ID counter, NOT a timestamp** — never age it.
   - Decode epoch-ms values to UTC; compute age in hours.
2. **Classify staleness** as BENIGN or BROKEN (see Pitfalls + Decision logic).
3. **Verify the sync cron jobs are alive**: query `cron/executions.db` → `executions` table (`job_id,status,started_at,finished_at`). Resolve job_ids by name from `cron/jobs.json` (match names containing `opencode`). Healthy = `completed` within the last 1–2 intervals.
4. **Read the PREVIOUS run's output** in `cron/output/<job_id>/` to detect change since last report. **Do NOT echo a prior alarm without re-verifying its evidence this run.**
5. **Mark VPS-side `unreachable`** (no SSH, no public sync endpoint).
6. **Emit concise status**: watermark table + benign/broken classification + cron liveness + VPS unreachable.

## Pitfalls (this class bites hard)
- **WAL/SHM mtime ≠ writes.** `opencode.db-wal` at 0 bytes + old main `opencode.db` mtime ⇒ DB is idle. `-shm`/`-wal` mtimes get touched on every DB *open* (even read-only), so they look "fresh" but prove nothing about writes. A prior run falsely claimed "opencode actively writing (WAL mtime 13:03)" from exactly this — it was wrong. **Trust the main file mtime + WAL byte size, not -shm/-wal mtime.**
- **Stale watermark ≠ failure.** A sync watermark only advances when there is actual data to sync. If the source DB is idle (no new sessions), a 40h-stale watermark is BENIGN. Always check source-activity before crying "bridge break".
- **Don't multiply false alarms.** When the prior same-job run reported an anomaly, re-verify the underlying evidence this run; correct it in the report rather than repeating it.
- **`telegram_vps_bridge_last_id` is a counter**, not epoch-ms. Ageing it yields 1970 garbage — exclude it from time-based staleness.
- **The `opencode-*` sync cron jobs were DELETED (verified 2026-08-08).** `jobs.json` now holds 9 jobs, none named `opencode*`. So step 3 ("verify the sync cron jobs are alive") finds nothing — that is the answer, not a lookup failure. A frozen watermark with a *recently modified* `opencode.db` therefore means **"the writer is gone"**, not "the bridge broke". Report it as: writer removed → watermark will never advance until an `opencode-db-sync` job is recreated.
- **Ghost job executions massively inflate failure counts.** `executions.db` retains rows for deleted jobs; `job_id`s that are absent from `jobs.json` are ghosts. On 2026-08-08, 491 of 531 24h failures came from 14 ghost ids that all stopped by 2026-08-07 14:50. **Always LEFT-JOIN executions against live `jobs.json` ids and report live-job failures separately**, or you will raise a five-hundred-failure alarm about a fire that is already out.
  - **Re-verified 2026-08-18: ghost ids with 24h activity = 0**, and `jobs.json` now holds **15** live jobs (was 9 on 2026-08-08). The ghost backlog has aged out of the 24h window, so a current high failure count is real and must be attributed to live jobs — do not hand-wave it as ghosts without running the join.
- **A non-zero `opencode.db-wal` means pending writes; only 0 bytes proves idle.** Verified 2026-08-18: main mtime 15.2 h old but WAL = 4,136,512 bytes and counts had grown past the documented baseline (session 102→106, message 7145→7257, event 88968→89817, part 29402→29640). Old main mtime alone is NOT idleness — cross-check WAL size AND row counts vs baseline before declaring benign staleness.
- **Model-drift fail-closed is the #1 live-job failure mode.** `RuntimeError: Skipped to prevent unintended spend: ... this job is unpinned` and `HTTP 404: Model 'deepseek/deepseek-v4-flash-free' not found` mean the job needs re-pinning: `hermes cron edit <id> --model tencent/hy3:free --provider nous`. Verify by re-reading `jobs.json` — fixed jobs show `model_snapshot=None`.
  - **Exact unpinned fingerprint in `jobs.json`** (verified 2026-08-18): unpinned job = `model=None, provider=None, model_snapshot=<stale value>`. Pinned/healthy job = `model=<id>, provider=<p>, model_snapshot=None`. Detect with one pass over `jobs.json`; do not infer pin state from error text alone.
  - **Drift-skip does NOT need the job to 404.** On 2026-08-18 global config drifted `nous` → `custom-ollama/gemma4:latest` (user switched to local Ollama). All 6 unpinned jobs fail-closed instantly; 399 of 403 24h failures traced to this ONE root cause. High-frequency jobs dominate the count (5m job = 159, 10m = 142, 15m = 91), so a huge failure number usually means *few* broken jobs, not many.
  - `hermes cron edit` flags are `--model MODEL --provider MODEL_PROVIDER` (confirmed via `--help`). The error text suggests a `cronjob action=update` tool form; the CLI form above works from terminal and is available inside cron runs.
  - **Verify recovery with a bounded poll, not by assertion.** After pinning, poll `executions.db` for a `started_at` newer than the pre-fix max per job and assert `drift_skip` absent from `error`. A 5-minute-interval job yields evidence within ~4 min; a `0 9 * * *` job will not, so report it as "fixed, awaiting next window" rather than claiming recovery.
- **Hermes terminal heredoc can trip the cron lifecycle guard** (embedded-null error on `<<'PY'`). Prefer writing a `.py` file via write_file then `python3 path` over inline heredocs for DB scripts.

## Decision logic (benign vs broken)
- Source DB main mtime **recent** AND watermark **old** → real bridge break (data produced but not synced).
- Source DB main mtime **also old** (idle) AND `opencode.db-wal` = 0 bytes → **benign staleness** (nothing to sync).
- Cron jobs not completing (status stuck `running` / no recent `completed`) → pipeline trigger broken (report separately from watermark staleness).

## References
- `references/watermark_keys.md` — state_meta key inventory + opencode.db schema + worked numbers.
- `references/false_alarm_wal_shm.md` — the 2026-08-06 false-alarm narrative and the exact fix.

## Scripts
- `scripts/sync_probe.py` — re-runnable read-only probe: watermarks + ages, opencode.db mtime/WAL size, cron job liveness, baseline diff. Run `python3 scripts/sync_probe.py`.
