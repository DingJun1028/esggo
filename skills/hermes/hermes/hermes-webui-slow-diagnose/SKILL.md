---
name: hermes-webui-slow-diagnose
version: 1
author: oa-team
license: agpl-3.0
description: Hermes WebUI 慢請求診斷與 state.db FTS 遺留清理。
metadata:
  hermes:
    tags: [hermes, webui, performance, state.db, fts]
    related_skills: [hermes-auth-lock-repair, hermes-state-db-maintenance]
---

# Hermes WebUI 慢請求診斷與修復

Use when WebUI (hermes-webui) logs `Slow WebUI request` or endpoints like
`/api/sessions`, `/api/profiles`, `/api/models` take many seconds.

## When to Use
- `/api/sessions` > 3s (cold): usually `state.db` FTS5 bloat.
- `/api/profiles` > 3s (cold): 100+ SKILL.md scanned via `read_text()[:4000]`.
- `/api/models` > 4s: provider-catalog rebuild budget exceeded (benign fallback).

## Root-cause map (verified 2026-08-24)
- `state.db` had 4.58GB with leftover `cjk_fts:true` tables
  (`messages_fts_trigram*`, 5 tables + 3 triggers + 1 view) even after
  `cjk_fts:false` was set in config.yaml. These are NOT cleaned automatically.
- `/api/sessions` `read_importable_agent_session_rows` runs a `LEFT JOIN
  latest_messages` + candidate CTE on the 4.5GB db; trigram tables make the
  `messages` scan path slow. Sessions table itself (2457 rows) is fine.
- `/api/profiles` `profiles.py:_compute_profile_skills_stats` reads every
  SKILL.md `[:4000]`; oa-team profile had 174 SKILL.md. Has a 4s TTL cache so
  only cold/first load is slow — benign after warmup.

## Safe cleanup procedure
1. BACKUP first (do not skip):
   `cp "$LOCALAPPDATA/hermes/state.db" "$LOCALAPPDATA/hermes/state.db.bak.$(date +%Y%m%d%H%M%S)"`
2. Drop leftover trigram objects (write a .py file, run with the hermes venv
   python — inline heredocs got SIGINT-interrupted twice; a script file is
   reliable):
   ```python
   import sqlite3, os
   p = os.path.join(os.environ["LOCALAPPDATA"], "hermes", "state.db")
   con = sqlite3.connect(p); cur = con.cursor()
   cur.execute("PRAGMA wal_checkpoint(TRUNCATE);")
   for t in ["messages_fts_trigram_insert","messages_fts_trigram_delete","messages_fts_trigram_update"]:
       cur.execute(f"DROP TRIGGER IF EXISTS {t};")
   for tb in ["messages_fts_trigram","messages_fts_trigram_data","messages_fts_trigram_idx",
              "messages_fts_trigram_docsize","messages_fts_trigram_config","messages_fts_trigram_src"]:
       cur.execute(f"DROP TABLE IF EXISTS {tb};")  # src is a VIEW -> use DROP VIEW
   con.commit()
   cur.execute("PRAGMA integrity_check;")  # must print 'ok'
   con.close()
   ```
   NOTE: `messages_fts_trigram_src` is a VIEW — `DROP TABLE` errors; use
   `DROP VIEW IF EXISTS messages_fts_trigram_src`.
3. Verify: `integrity_check` == ok, trigram remaining == NONE.
4. File size does NOT shrink from DROP alone (pages go to freelist, reused
   later). To actually shrink, run `VACUUM;` — but it is slow on 4.5GB and
   blocks; do it only in a low-traffic window with `background=true`.

## Bootstrap: stale session recovery failure
Symptom: `hermes-webui` bootstrap fails with
`ERROR: Web UI did not become healthy at http://0.0.0.0:8787/health`
even though the log shows `Hermes Web UI listening on http://0.0.0.0:8787`.

Root cause: stale session files in `.hermes/webui/sessions/*.json` and a stale
`bootstrap-*.log` cause the bootstrap to attempt process recovery. The
recovered process PID no longer exists → `KeyError` on a stale session ID
(e.g. `KeyError: '20260811_155257_ab1e04'` in `models.py:_resolve_session`),
which aborts startup before the health probe can succeed.

Fix (tested 2026-08-24):
1. Kill any stale process: `taskkill /F /PID <PID> /T`
2. Clean stale state:
   `rm -rf .hermes/webui/sessions/*.json && rm .hermes/webui/bootstrap-8787.log`
3. Start the server directly (bypasses bootstrap recovery):
   `cd C:/Project/hermes-webui && python -u server.py --port 8787`
4. Verify: `curl -sSf http://localhost:8787/health` → `{"status": "ok", ...}`

Note: `python` here means the hermes-agent venv Python:
`C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe`

## Container unhealthy: chown hang on Windows bind-mount
Symptom: `hermes-webui-hermes-webui-1` shows `unhealthy` (healthcheck
`bash /apptoo/scripts/lib/health_probe.sh localhost 8787 /health` fails),
but the container is alive (ExitCode=0, RestartCount=0). Logs stop after
`usermod: no changes` with no further output.

Root cause: container CMD is `/hermeswebui_init.bash`, which runs
`chown_home_hermeswebui` → `find /home/hermeswebui -exec chown ...` over the
bind-mounted `C:/Users/dingj/.hermes` (4.6GB state.db + many small files).
On **Windows Docker bind-mount**, each chown syscall is translated by the FS
layer and times out/retries per-file — the find hangs forever, so the script
never reaches `cd /app && python server.py` (line ~493). Service never starts.

Fix (temporary, reversible — inside container, does not edit repo files):
1. Check what is actually listening / running:
   `docker exec <c> bash -c "ss -tlnp | grep -E '8787|8788'; ps aux | grep server.py"`
   (expect empty — confirms server never started)
2. The init script already exported env to `/tmp/hermeswebui_root_env.txt`
   before hanging. Source it and start the server directly, skipping chown:
   ```bash
   docker exec -d <c> bash -c "set -a; . /tmp/hermeswebui_root_env.txt; set +a; cd /app && python server.py"
   ```
3. Verify: `docker exec <c> curl -s -o /dev/null -w '%{http_code}' localhost:8787/health`
   → 200. Docker healthcheck flips unhealthy→healthy within one probe cycle.

Caveat: this is in-container only. If the container is recreated
(`docker-compose up --force-recreate` / rebuild), it hangs again at chown.
Root fix = patch `docker_init.bash:chown_home_hermeswebui` to skip chown on
Windows bind-mounts (e.g. `2>/dev/null` + timeout, or detect `[[ -n
$IS_WINDOWS_DOCKER ]]`). Do NOT apply that patch without user authorization —
it edits a project file. Surface the patch suggestion, let user decide.

## Model-routing drift (separate issue, not a bug)
- Symptom in logs: `custom-ollama/gemma4:latest` -> `http://...:8788` 404,
  fallback `opencode-go` 401 `Model opencode-go is not supported`.
- Root cause: a stale `config.yaml.bak.*` had `custom-ollama.base_url:
  http://100.71.82.0:8788` (the translation service, not Ollama). The ACTIVE
  `config.yaml` already points `:11434/v1` correctly. Cron jobs that snapshot
  config at creation time may hold the old endpoint until re-pinned:
  `hermes cron edit <job_id> --provider <p> --model <m>` or re-create the job.
- Do NOT edit the active config to "fix" this — it is already correct. Fix the
  cron snapshot drift instead.

## Verification
- After cleanup, the candidate CTE in `read_importable_agent_session_rows`
  drops from ~7-13s to <0.1s (measured 0.04s post-cleanup).
- `/api/profiles` second hit should be <5ms (cache warm).
