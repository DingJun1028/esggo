---
name: aistation
description: Engineering conventions and verification workflow for the AI Station video-generation pipeline (C:\Project\aistation). Load when working on aistation — adding features, fixing bugs, running tests, or extending the MECE best-practices TODO. FastAPI + ffmpeg/Pillow + optional cloud extras, free-tier-first by design.
---

# AI Station — project conventions

AI Station is a local-first, **free-tier-first** AI video pipeline: FastAPI
control center + ffmpeg/Pillow rendering + optional cloud extras (OpenAI,
ElevenLabs, Runway, S3, NoCodeBackend). Every cloud integration is OPTIONAL and
degrades to a free local path when its key is absent — `feature_summary()` in
`config.py` reflects live-vs-fallback. Honor this in ALL changes: never
hard-require a key; keep the free path working.

## Module map (src/)
- `config.py` — single source of truth for feature flags, `FONT_PATH` (CJK), structured logging
- `parser.py` — script → `Shot` list (free parser / 壽司博士 DNA markers / OpenAI)
- `tts.py` — narration synthesis (edge-tts free, ElevenLabs optional)
- `visuals.py` — per-shot media (Pillow gradient free, Runway B-roll optional)
- `renderer.py` — ffmpeg clip assembly + word-synced captions + brand intro
- `pipeline.py` — orchestration; `run_pipeline` / `enqueue` (sync) / `submit` (bg pool)
- `storage.py` — publish local or S3
- `db.py` — SQLite job store + NCBDB provenance mirror (best-effort)
- DB schema bug pattern: if `storage/jobs.db` exists but is empty, `init_db()` was not guaranteed to run before the first INSERT. Fix: call `init_db()` inside `create_job()` so schema creation is lazy but guaranteed on first write. Do NOT assume import-time schema setup.
- metrics.py — read-only job-store aggregation for GET /api/metrics
- entropy.py — entropy computation (job_failure_rate + lifecycle_incompleteness + 5t_audit_failure), < 0.1 target
- audit_5t.py (scripts/) — automated 5T audit sweep over storage/artifacts/
- app.py — FastAPI routes (health, jobs, webhook, metrics, video, storage, best-practice, oci)

## Monorepo integration (esggo)
AI Station also lives as `apps/aistation` inside the esggo monorepo.
Root-level wiring:
- Root `pyproject.toml` provides `[project.optional-dependencies] aistation` and `[project.scripts] aistation = "apps.aistation.src.cli:main"`
- `scripts/aistation` is the repo-local launcher
- App-local `apps/aistation/pyproject.toml` should include `[tool.pytest.ini_options]` with `testpaths = ["tests"]`
- Do not rely on root `testpaths` to discover app-local tests

## Verification workflow (MANDATORY before claiming done)
### Venv isolation rule (Windows pitfall)
Do NOT use the Hermes built-in venv for AI Station. The Hermes venv has known package corruption on this host (`pydantic_core._pydantic_core` missing, `pyyaml` access-denied on upgrade) that will break FastAPI imports and `hermes verify`. Create an isolated venv in the project:
```bash
cd C:\Project\aistation
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
```
Run tests and the server with `.venv\Scripts\python.exe` only. If port `8000` is already bound, kill the holder process before restarting the server.

### pytest
```bash
cd C:\Project\aistation
.venv\Scripts\python.exe -m pytest tests/ -q --no-header
```
If a module is missing, install into the project venv, not the Hermes venv.
Run the FULL suite (not just the new test) and confirm `exit=0` + the count.
Exact command recipes + current test inventory: `references/verify.md`.
Deploy/CI patterns (multi-arch, cloud-job gating, `gh secret set` TTY trap): `references/deploy-ci.md`.

### PITFALL: trust-but-verify the documented test count (honesty-first)
The MECE `TODO.md` records a claimed test count (e.g. "pytest 79 passed, 2 skipped — CI 綠燈").
That number is STALE by definition — a prior session may have added/removed tests, or a test may be
flaky. When you resume via "繼續"/"下一步", DO NOT parrot the old count. Re-run the full suite and
CORRECT `TODO.md` if the real count differs. 2026-08-28 this caught a real failure
(`test_api_series_endpoint` flaky on a real render) that the old "green" claim had hidden. Recipe +
root-cause: `references/flaky-test-recipe.md`.

### PITFALL: never block an API-contract test on a REAL render
`test_api_series_endpoint` historically submitted a REAL job (`submit()` → `ThreadPoolExecutor` →
edge-tts network call + ffmpeg render) then polled ~60s for `status == "done"`. Under full-suite load
the shared 2-worker pool can't finish in time → intermittent `assert 'queued' == 'done'`.
Fix: an API-contract test asserts the CONTRACT only (`status == "queued"` + `job_id` returned + job
record exists), and leaves the full render lifecycle to the dedicated real-ffmpeg E2E test
(`test_integration_render_runs_ffmpeg`). Never make a fast unit/API test depend on the slow,
network/CPU-bound real-render path. See `references/flaky-test-recipe.md` for the exact diff.

### PITFALL: `requirements.txt` does NOT install pytest (verified 2026-08-23)
`pip install -r requirements.txt` leaves pytest absent (it lives in `[project.optional-dependencies].test` in `pyproject.toml`, not the main deps). After building the isolated venv, also run:
```bash
.venv\Scripts\pip install pytest
```
Symptom if skipped: `.venv\Scripts\python.exe -m pytest` → `No module named pytest`.
Also: build the venv with the **system** `python3` (WindowsApps shim, py3.14 here), never the Hermes venv — the Hermes venv has the `pydantic_core` corruption noted above and will break FastAPI imports. The requirements install on a clean system-python venv took >120s (edge-tts/numpy compile); run it background or with a generous foreground timeout, not a 180s cap.

## Git state reconciliation (PITFALL — cost real time once)
The session-start Workspace snapshot is stale by definition. NEVER assert
"changes are uncommitted / waiting for your push" from memory. A prior turn may
have already committed AND pushed; the working tree can be clean while you
believed it held pending edits. Before reporting git state, run:
```
git status --short
git log --oneline -3
git fetch origin && git ls-remote origin | grep HEAD
git rev-list --count origin/main..HEAD   # 0 == nothing to push
```
Confirm before acting. `gh` is already authed on this host, so plain
`git push origin main` works (no token form needed).

## MECE best-practices loop (the optimization lens)
Work is tracked in `TODO.md` as 7 mutually-exclusive pillars: Correctness,
Security, Maintainability, Performance, Extensibility, Observability, Testing.
When the user says "最佳實踐" / "繼續" / "下一步" / "全都做", extend the TODO:
implement the next item, add a regression test, mark it ✅ with the technique,
and keep the test count in the TODO in sync. External-blocked items (need keys)
stay 🔒 and are explicitly called out — never silently dropped.

### Working-tree hygiene (part of the MECE Maintainability lens)
Ad-hoc debugging scripts accumulate in `scripts/` (e.g. `debug_n8n_auth*.py`,
`get_n8n_api_key*.py`, `import_n8n*.py`) — many query VPS credential stores
(`/home/ubuntu/.n8n/database.sqlite`). These are scratch; `rm` them once their
purpose is served. Add a `.gitignore` regression guard for generated artifacts
(`_proof/`, `*.log`, `.wrangler/`) so a clean tree stays clean. Use `git status
--short` to enumerate debris; do NOT `git clean -f` blindly.

⚠️ NESTED GIT-REPO HAZARD: a dir like `aistation_backup/` may be an INDEPENDENT
`git init` clone (its own `.git`, distinct HEAD) — NOT a worktree of this repo.
`git status` shows it as one untracked entry. NEVER `rm -rf` it on suspicion;
its contents are the user's data and may hold unique history. Flag it to the
user and let them decide. Prove independence first: `git -C aistation_backup
rev-parse HEAD` vs this repo's `git rev-parse HEAD` + inspect
`git -C aistation_backup log --oneline -3`.

## Conventions to preserve
- Webhook responses carry an `ok` flag (`status==done` AND `video_url` present); `video_url=None` → `ok=False` + `error` backfilled, so callers branch on `ok`, not None.

## Brand consistency verification (5T Transparent / Tangible)
Use `src/brand_verify.py` to validate generated artifacts against the `sushi_dr`
brand preset before publishing. It checks:
- **Host signature** (`大家好，我是壽司博士`) substring presence in shot 1 narration/text — uses substring match, not full `intro_line` equality, so free-path narrations that lead with the same signature still pass.
- **DNA palette** theme tag validity for branded shots.
- **Parser-produced visual theme whitelist**: free-path shots may use `cosmos/ocean/forest/fire/tech/city/neutral` without failing brand verify.
- **Forbidden AI visuals** absent from narration / visual_prompt / caption.

### Test maintenance rule (verified 2026-08-15)
When changing `brand_verify` rules, update tests in BOTH:
- `tests/test_brand_verify.py` — unit-level `verify_artifact` expectations
- `tests/test_aistation.py` — integration/webhook tests that run real renders
  and assert final job status == `done`
- **Forbidden AI visuals** absent from narration / visual_prompt / caption.

```python
from src import brand_verify
result = brand_verify.verify_batch(shot_dicts)
assert result.passed, result.issues
```

`tests/test_brand_verify.py` (7 cases) is the regression suite. Add it to any
render-related test runs.

### Pipeline integration
`pipeline.py` now runs `brand_verify.verify_batch()` after `render_final()` and
before `publish()`. A brand violation marks the job `failed` and notifies the
swarm via `notify.video_done(..., status="failed")`. This is the 5T brand gate.

### Test maintenance note
When changing brand_verify rules, update tests in BOTH:
- `tests/test_brand_verify.py` — unit-level verify_artifact expectations
- `tests/test_aistation.py` — integration/webhook tests that run real renders
  and assert final job status == `done`

## Brand-color single source of truth + parallel-copy drift (5T Tangible)
AI Station has MORE THAN ONE checkout. The authoritative brand preset lives at
`C:\Users\dingj\aistation_clone\src\brand.py`; a parallel copy also lives inside the
esggo monorepo at `C:\Project\esggo\apps\aistation\` (modules `src/brand.py`,
`src/parsers/dna_parser.py`, `src/visuals/image_gen.py`). They DRIFT.

Canonical brand palette (§9.4, verified 2026-08-27) — the 5T Tangible identity:
- `deep_blue`   `#10243f`
- `warm_gold`   `#c9a24b`
- `rice_white`  `#f3ede1`
- `green`       `#3c6e47`
- `cold_blue`   `#0a1626`

The 5T gate caught a real drift: `image_gen.py` had hardcoded `#1B3A5B/#D4A017/#F8F4E3/#2E5E3A`
(wrong). Fix = make `src/brand.py` the SINGLE SOURCE OF TRUTH and have `image_gen.py`
`from src.brand import PALETTE` + `_hex_to_rgb()` (never re-hardcode hex in the renderer).
When touching brand colors, grep the WHOLE `apps/aistation` tree for stale hex before
claiming done. A regression test `test_brand_colors_match_single_source_of_truth` should
assert each `BRAND_COLORS[name] == (0x10,0x24,0x3F)` etc. against `src/brand.PALETTE`.

## Regex pitfall: optional close bracket in mixed 【】/[] character class
DNA-marker parsers match mixed full-width `【場景】` and half-width `[Scene]` brackets.
The OPTIONAL CLOSE in a character class must be `[\]②]?` — NOT `[\\)②]?`.
`[\\)②]?` matches an optional literal `\` / `)` / `②`, NOT an optional `]` / `②`, so the
negative lookahead fails and `re.findall`/`finditer` returns `[]` with NO error. This silently
zeroed both `dna_parser.py` and `src/brand.py`'s parser until debugged.
Reproduction + fix recipe: `references/regex-bracket-pitfall.md`.
Debug method when a bracket parser returns `[]`: print the compiled `DNA_PATTERN` and run
`re.findall` on a 1-segment sample (`[Scene] x.` and `【場景】x。`) — a mis-escaped char class
in the lookahead is the usual cause. Normalize `type` to a stable English key so downstream
visuals/render stay language-agnostic.

## universal-translator integration notes
- Mobile app server URL: `http://100.71.82.0:8788` (Tailscale IP + port 8788).
  Do NOT use `100.64.0.1` (Tailscale CGRouter) or `0.0.0.0`.
- No password is currently configured on universal-translator; leave the app
  password field blank. If the client enforces non-empty, enable basic auth in
  `server.mjs` + ecosystem env.
- **Pitfall**: pm2 stale state can surface `ReferenceError: X is not defined`
  for variables that ARE defined in the source file (e.g. `STT_PORT`, `urlPath`).
  First-line fix: `pm2 restart <name>` and re-check logs before editing code.
- Health check: `curl -sf http://127.0.0.1:8788/health` should return `{"status":"ok","version":"1.7.0",...}`.
  If `urlPath is not defined` errors appear in `ut-error.log`, restart universal-translator.

## universal-translator integration notes
- Mobile app server URL: `http://100.71.82.0:8788` (Tailscale IP + port 8788).
  Do NOT use `100.64.0.1` (Tailscale CGRouter) or `0.0.0.0`.
- No password is currently configured on universal-translator; leave the app
  password field blank. If the client enforces non-empty, enable basic auth in
  `server.mjs` + ecosystem env.
- **Pitfall**: pm2 stale state can surface `ReferenceError: X is not defined`
  for variables that ARE defined in the source file (e.g. `STT_PORT`, `urlPath`).
  First-line fix: `pm2 restart <name>` and re-check logs before editing code.

## Best-practice endpoint (VERIFIED)
`GET /api/best-practice` returns a single frozen-style artifact combining:
- `pipeline_metrics` from `metrics.compute_metrics()`
- `kpi` snapshot + alert levels from `kpi.snapshot()`
- `recent_jobs_5t` for the last 20 jobs via `gate5t.verify_5t(payload)`

Implementation note: job payloads in `db` may be list-shaped or otherwise not dicts. Normalize before `setdefault`:
```python
if not isinstance(payload, dict):
    payload = {"value": payload}
```
Without this, `/api/best-practice` returns 500 on real job stores.

## Pilot sample output convention
Use `pilot_samples/` under the project root for P0 sample videos. Verified filenames are stable MP4s produced by the free local path:
- `pilot_samples/<job_id>.mp4`
Before claiming done, validate with `file <path>` → must contain `ISO Media, MP4 Base Media v1 [ISO 14496-12:2003]`.

## OCI infrastructure controller (optional step #8)
`src/oci_controller.py` exposes `/oci/*` routes for OCI instance lifecycle
(`list`, `start`, `stop`, `ops-log`) and is mounted in `app.py` via
`include_router`. It shells out to `/home/ubuntu/bin/oci`, so 5T rules apply:
- **Traceable**: every action writes to `/tmp/oci_ops.log`
- **Trackable**: status changes are observable in `/oci/instances`
- **Trustworthy**: responses are frozen before return

### systemd env pitfall (verified 2026-08-15)
If `/oci/instances` returns `{"detail":"oci error: Abort:"}` while CLI works
as `ubuntu`, the service is running as `root`. Fix:
1. Add `User=ubuntu` under `[Service]` in `/etc/systemd/system/aistation.service`
2. `sudo systemctl daemon-reload && sudo systemctl restart aistation`
3. Curl `http://127.0.0.1:8000/oci/instances` again — should return instance JSON

The VPS snapshot `deploy/aistation.service` already carries `User=ubuntu`.

## n8n operator notes (verified 2026-08-15)
### Owner setup via SQLite
If the n8n web UI shows an uninitialized owner and `/rest/setup` returns 404,
initialize directly:
```python
import sqlite3
conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite', timeout=10)
cur = conn.cursor()
cur.execute("UPDATE user SET setupDoneAt=?, inviteCode=?, inviteToken=? WHERE id=?", (...))
conn.commit()
```
Then restart n8n and open the web UI.

### API auth pitfall (n8n 2.34.4)
`X-N8N-API-KEY` can return `Unauthorized` for `/rest/workflows` even with a
valid key. Logs show `browserId check failed`. Workarounds: import via the web
UI, or use browser automation. Do not loop on REST auth.

### Verified fallback for scheduling
If n8n REST auth or browser automation is unreliable, use **Hermes cron**
directly calling `https://aistation.esggo.co/webhook/n8n` with a fresh script
each tick. This preserves the 5T loop without depending on n8n availability.

## n8n scheduling pattern
AI Station already exposes `POST /webhook/n8n` with optional `X-AI-Station-Key` HMAC auth. Recommended workflow:
- Trigger: Schedule (`cron`)
- HTTP Request: `POST http://127.0.0.1:8000/webhook/n8n`
- Body fields: `title`, `script`, `brand_preset`
- Branch on `ok` for success/failure notifications
5T mapping: job_id → traceability; execution → trackability; video_url → tangible; workflow JSON → transparent; webhook key → trustworthy.

**Verified fallback (2026-08-15)**: If n8n REST API auth is blocked (`Unauthorized` despite valid key, `browserId check failed` in n8n 2.34.4 logs) AND browser automation shows blank/empty pages, do NOT keep retrying n8n. Switch to **Hermes cron** directly calling `https://aistation.esggo.co/webhook/n8n` with a fresh script each tick. This preserves the 5T loop without depending on n8n availability.

```bash
cronjob action=create \
  name="AI Station Daily Webhook" \
  schedule="0 9 * * *" \
  prompt="Trigger the AI Station webhook at https://aistation.esggo.co/webhook/n8n with a fresh daily script. Return the job status and video URL if done."
```

**n8n owner setup automation (verified 2026-08-15)**: When `systemctl status n8n` shows the owner is uninitialized, complete setup by writing to SQLite directly:
```python
import sqlite3, secrets
conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite', timeout=10)
cur = conn.cursor()
cur.execute("UPDATE user SET setupDoneAt=?, inviteCode=?, inviteToken=? WHERE id=?", (...))
conn.commit()
```
Then restart n8n and proceed with web UI.

**n8n API auth pitfall (verified 2026-08-15)**: `X-N8N-API-KEY` can return `Unauthorized` for `/rest/workflows` even with a valid key from `user_api_keys`. n8n 2.34.4 logs show `browserId check failed`. Workarounds: (1) import via the web UI, or (2) try `Authorization: Bearer <key>`, or (3) use browser automation to navigate `/workflows` and import manually. See `esggo-vps-ops` skill for the full owner-setup + API auth notes.

## Windows server-restart pattern (port 8000)
If `python -m src.app` fails with `Errno 10048` (port already bound), the holder may be a stale Python/uvicorn process with no cmdline visible in `ps`. Resolution:
```powershell
tasklist /FI "TCP:8000"
# then stop holder PID and restart
```
Or use the existing app server if already listening on 8000.

## KPI alert model
|kpi.KpiSnapshot.status() returns OK / WARN / CRIT. Treat overall == CRIT as P0; WARN as P1. Do not fabricate swarm KPI values—only include keys supplied via snapshot(**overrides).

## Entropy Monitor + 5T Audit Watch (§23 §24 — VERIFIED 2026-08-24)
The 5T protocol requires entropy < 0.1 as a seal condition. This section documents the automated entropy computation + 5T audit sweep that enforces that condition in production.

### Components
| File | Role | Test |
|------|------|------|
| src/entropy.py | Computes entropy from live jobs.db data | tests/test_entropy.py (11 cases) |
| scripts/audit_5t.py | Sweeps storage/artifacts/ JSON files for Hash Lock + 5T gate | tests/test_audit_5t.py (7 cases) |
| scripts/weekly_report.py | KPI -> 5T gate -> Newsletter dispatch | tests/test_chapter10.py (3 E2E cases) |

### Entropy formula (from entropy.compute_entropy())
entropy = 0.4 * job_failure_rate + 0.3 * lifecycle_incompleteness + 0.3 * audit_failure_rate
- job_failure_rate = failed / total_terminal jobs in jobs.db
- lifecycle_incompleteness = terminal jobs missing result field / total terminal
- audit_failure_rate = tampered/failed artifacts / total artifacts on disk

Live measurement (2026-08-24): entropy = 0.0022 < 0.1 target -> OK

### 5T audit sweep (audit_5t.py)
Scans every .json file in storage/artifacts/ and classifies:
- verified — Hash Lock matches + all 5T checks pass
- tampered — Hash Lock mismatch (payload modified after freezing)
- 5t_failed — Hash matches but 5T gate rejects (missing source_origin, lifecycle_hooks)
- parse_error — corrupt JSON

Live measurement (2026-08-24): 0 total artifacts -> 100% pass rate

### Daily cron watch
Registered as Hermes cron job entropy-5t-audit-daily (0 9 * * *) running from C:\\Project\\aistation:
1. Runs entropy.compute_entropy() -- reports entropy value + components
2. Runs audit_5t.audit_artifacts() -- reports 5T audit results
3. If entropy < 0.1 AND audit pass_rate = 100% -- report OK status
4. If entropy >= 0.1 OR audit finds failures -- triggers weekly_report.py --dry-run with WARN/CRIT escalation

### Running the audit
```bash
cd C:/Project/aistation
.venv/Scripts/python.exe scripts/audit_5t.py           # human-readable report
.venv/Scripts/python.exe scripts/audit_5t.py --json  # machine-readable
.venv/Scripts/python.exe scripts/audit_5t.py --fix   # remove tampered/failed artifacts
.venv/Scripts/python.exe -c "from src import entropy; print(entropy.compute_entropy())"
```

## AI Video Content Verification (七道門檻驗證)

Before claiming any AI-generated video is complete, run the **7-gate verification** to ensure quality standards are met without diluting original judgment, misrepresenting facts, or sacrificing human dignity.

### Quick Start

```bash
# Run verification suite
node scripts/video-creation-test-suite.mjs scripts/test-video-example.json

# Check report
cat test-reports/evaluation-report.json
```

### The Seven Gates

| Gate | 驗證項目 | 成功標準 |
|------|----------|----------|
| 01 | 腳本匯入場景生成 | 場景6-16/分鐘，時間碼無重疊 |
| 02 | 數據圖卡準確性 | 數字/年份/來源完整，比較方向清晰 |
| 03 | 視覺一致性 | 門檻圖卡70%以上視覺一致 |
| 04 | AI B-roll人本感 | 無機器感、恐懼、悲情化 |
| 05 | 品牌真實感 | 真人30%+、B-roll音效50%+ |
| 06 | 子影片切割 | 4支短影片+1張門檻圖卡 |
| 07 | 最終定錨 | 完成率70%+，事實錯誤<1% |

### Test Data Format

Test data JSON must include:
- `metadata.style` = "professor" (壽司博士風格)
- `scenes[]` - 時間碼標記的場景列表
- `dataCards[]` - 數據圖卡（value, year, source 必須完整）
- `thresholds[]` - 7道門檻（視覺元素需一致）
- `broll.flagging[]` - 人本感檢查標記
- `audio` - 聲音比例配置
- `subVideos[]` - 4支子影片
- `metrics` - 觀眻實驗指標
- Background jobs must end as `failed` (never stuck in `queued`/`rendering`) — wrap the pool task in try/except.
- Tests use the `isolated_state` fixture so renders hit a temp dir, not the repo root.
- Structured logging via `config.log` at key stages; level via `AI_STATION_LOG_LEVEL`.
- **`atexit` pool shutdown uses `cancel_futures=False`** — cancelling in-flight renders orphans the job in `rendering` and flakes tests.
- **No non-isolated test writes to the real `STORAGE_DIR`**; clean leftover repo-root `jobs.db`/`storage/` (Python `shutil.rmtree`, not shell `rm -rf`) before trusting a green run — leftover state causes intermittent fixture `ERROR`s.

## Deploy artifacts (deploy/)
- `deploy/docker-compose.yml` — pulls `docker.io/dingjunhong1028/aistation:latest`, binds `:8000` to localhost, mounts `./storage`, healthcheck on `/api/health`. Image is built + pushed by CI when `DOCKERHUB_*` secrets are set.
- `deploy/nginx/aistation.esggo.co.conf` — reverse proxy (HTTP block live; HTTPS block commented for `certbot --nginx`).
- `deploy/deploy.sh USER@HOST [DOMAIN]` — bootstraps docker+nginx on a fresh VPS if missing, rsync + `docker compose pull && up -d` + nginx enable + health check. Reads server-side `deploy/.env` (gitignored; `deploy/.env.example` is the template).
- `deploy/oracle-free.md` — full Oracle Always-Free ARM64 playbook: provision VM.Standard.A1.Flex (4 OCPU/24GB, $0), add pubkey to `authorized_keys`, one-command `deploy.sh`, certbot HTTPS. The esggo VPS (161.118.252.147) is the same class of ARM box.

## VPS native deployment (non-docker) — verified on Ubuntu 24.04 / ARM64
Use when the VPS already runs nginx + certbot + systemd and you want a lightweight Python deployment without Docker.

### Paths
- App root: `/opt/esggo/apps/aistation/`
- venv: `/opt/esggo/apps/aistation/.venv/`
- storage: `/opt/esggo/apps/aistation/storage/`
- systemd unit: `/etc/systemd/system/aistation.service`
- nginx site: `/etc/nginx/sites-available/aistation.esggo.co.conf` (enabled)
- SSL: `/etc/letsencrypt/live/aistation.esggo.co/` (certbot managed)

### Critical runtime constraint
This app root is shared with another Python service on the same host. **Do NOT run `docker compose up -d` here** unless you have first migrated or stopped the existing uvicorn on `127.0.0.1:8000`. The compose file binds `127.0.0.1:8000:8000`; if another process already owns `:8000`, compose will fail with `failed to bind host port 127.0.0.1:8000/tcp: address already in use`.

### Verified systemd unit
```ini
[Service]
User=ubuntu
ExecStart=/opt/esggo/apps/aistation/.venv/bin/uvicorn src.app:app --host 127.0.0.1 --port 8000
```
The systemd service **must** run as `User=ubuntu`. If `/api/health` or `/oci/*` returns errors while CLI works as `ubuntu`, the service is likely running as `root`. Fix: add `User=ubuntu`, `daemon-reload`, restart.

### Cloudflare tunnel routing (verified)
`/etc/cloudflared/config.yml` ingress for `aistation.esggo.co` must point to the actually-running listener:
```yaml
- hostname: aistation.esggo.co
  service: http://127.0.0.1:8000   # NOT 8001 unless a different app owns 8000
```
After editing: `sudo systemctl restart cloudflared`.

### SQLite + storage permissions (verified)
On first deploy or container migration, `storage/` and `jobs.db` may be owned by `root`. Fix before starting:
```bash
sudo chown -R ubuntu:ubuntu /opt/esggo/apps/aistation/jobs.db /opt/esggo/apps/aistation/storage
sudo chmod 664 /opt/esggo/apps/aistation/jobs.db
```
Otherwise webhook enqueue fails with `Internal Server Error` and no uvicorn traceback.

### Public `/storage/` serving
Once cloudflared routes to the active listener, `GET /storage/{job_id}/final.mp4` is public and Cloudflare-cached. A successful webhook returns:
```json
{"job_id":"...","status":"done","ok":true,"video_url":"/storage/.../final.mp4","shots":N}
```
Direct `curl -I https://aistation.esggo.co/storage/<job_id>/final.mp4` should return `HTTP/1.1 200 OK` with `Content-Type: video/mp4`. Cloudflare may cache for `max-age=14400`.

### Post-deploy nginx + letsencrypt pitfall
After adding a new nginx site or creating new certbot certs, nginx reload may fail with:
```
cannot load certificate key ".../letsencrypt/live/<domain>/privkey.pem": Permission denied
```
Fix: `sudo chmod 644 /etc/letsencrypt/live/*/privkey.pem`, then `sudo nginx -t && sudo nginx -s reload`.

### Cloudflare + mp4 download pitfall
When Cloudflare proxies the domain, `curl -o file.mp4 <url>` often reports `0 bytes` even though the server returns `Content-Length: 3295282`. The bytes are being swallowed by Cloudflare's proxy layer in non-browser clients. Workarounds:
- Use browser verification (`browser_navigate` + `browser_vision`) for playback confirmation.
- Bypass proxy temporarily with `curl http://<VPS_IP>/path -H 'Host: <domain>'` for backend-only checks.
- Do NOT conclude "video is 0 bytes" from curl alone.
- `wrangler.toml` — Cloudflare Workers configuration for web frontend deployment. See `cloudflare-workers-deploy` skill for setup instructions.
- `functions/health.ts` — Worker health check endpoint for Cloudflare Workers deployment.
- `web/package.json` — Frontend build configuration (Vite/TypeScript). Note: `pydantic-to-zod` dependency removed for Workers compatibility.

## Cloudflare Workers Deployment
### Cloudflare Workers Deployment (Alternative to VPS)

For deploying the web frontend to Cloudflare Workers instead of VPS:
- Use `wrangler.toml` configuration (see `cloudflare-workers-deploy` skill)
- Run `npx wrangler login` for initial setup
- Set account_id in wrangler.toml
- Deploy: `npx wrangler deploy -e production`

**Worker Functions Entry Point** (`functions/health.ts`):
```typescript
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        if (url.pathname === '/health' || url.pathname === '/api/health') {
            return new Response(JSON.stringify({ 
                status: 'ok', 
                timestamp: new Date().toISOString()
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({
            total: 0,
            by_status: { done: 0, failed: 0, rendering: 0 },
            success_rate: 100,
            avg_render_seconds: 0,
            top_brands: []
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
```

**Note**: The Python FastAPI backend would require significant refactoring to run on Workers. Consider:
1. Workers for frontend only, VPS for backend
2. Hybrid approach with API routes
3. Full migration to Workers with Durable Objects

### Cloudflare Workers Deployment (Alternative to VPS)
For deploying the web frontend to Cloudflare Workers instead of VPS:
- Use `wrangler.toml` configuration (see `cloudflare-workers-deploy` skill)
- Run `npx wrangler pipelines setup` for initial setup
- Set secrets: `npx wrangler secret put OPENAI_API_KEY`, etc.
- Deploy: `npx wrangler deploy`

**Note**: The Python FastAPI backend would require significant refactoring to run on Workers. Consider:
1. Workers for frontend only, VPS for backend
2. Hybrid approach with API routes
3. Full migration to Workers with Durable Objects

### Image is MULTI-ARCH (amd64 + arm64)
CI builds+pushes `linux/amd64,linux/arm64` (QEMU-emulated on the amd64 runner via `docker/setup-qemu-action` + `platforms:` in `docker/build-push-action`). This runs NATIVELY on the Oracle Always-Free ARM64 VPS — no runtime QEMU, best render perf. The no-secret CI run stays single-arch (`load: true` can't multi-arch). Concrete workflow snippet: `references/deploy-ci.md`.

### CI-gated real cloud tests (PITFALL: `secrets` banned in job `if:`)
`tests/test_aistation.py` has `@pytest.mark.cloud` real Runway/ElevenLabs tests that SKIP unless `RUNWAY_API_KEY`/`ELEVENLABS_API_KEY` are present. The `cloud-integration` job must NOT use `if: ${{ secrets.X != '' }}` — GitHub rejects `secrets` in a job-level `if:` ("Unrecognized named-value: 'secrets'"). Gate it off a BUILD-JOB OUTPUT instead: the `build` job runs a `cloud_gate` step that echoes `ready=true` to `$GITHUB_OUTPUT` when either secret env var is non-empty; the cloud job uses `if: ${{ needs.build.outputs.cloud_ready == 'true' }}`. See `references/deploy-ci.md`.

### PITFALL: `gh secret set NAME` with no TTY silently creates an EMPTY secret
In a non-interactive shell (no TTY) `gh secret set RUNWAY_API_KEY` reads nothing, exits 0, and creates the secret with an EMPTY value. That poisons the gate (empty ≠ absent) and makes a real call fail. Always set secrets with `-b` + a masked value (`gh secret set NAME -b "..."`) or run interactively on a real terminal. After any failed interactive `gh secret set`, run `gh secret list` and DELETE any empty one (`gh secret delete NAME`) before relying on the gate.

## OmniAutoVideo 萬能自動影音 Integration Pattern

When extending the pipeline with UI-style configuration (like OmniAutoVideo's
form fields), follow this pattern:

### 1. Config layer (`src/config.py`)
- Add env-var-backed flags with sensible free-tier defaults
- Use `float()`/`int()` for numeric configs, not raw `os.getenv` strings
- Auto-derive dependent values (e.g., `VIDEO_RATIO=9:16` → flip width/height)
- Expose via `feature_summary()` so `/api/config` reflects live state

### 2. TTS engine (`src/tts.py`)
- For Azure TTS V1 voices, edge-tts speaks them natively (no Azure REST key)
- Provide `synthesize_with_voice()` for per-call voice override
- `synthesize()` stays as the default-path entry point for backward compat
- Always implement silent-fallback (silent audio track) so render never breaks

### 3. Parser (`src/parser.py`)
- Use `_CHARS_PER_SEC = 8` heuristic for duration estimation
- Split long narrations at sentence boundaries FIRST, then word boundaries as fallback
- Only call `_split_long_narration` in parse functions — never in the renderer
- Define `_split_sentences` BEFORE `_split_long_narration` (forward reference bug)

### 4. Pipeline (`src/pipeline.py`)
- `run_pipeline()` is the internal worker; `enqueue()` is sync, `submit()` is async
- Voice/style params must flow: `enqueue/submit/run_pipeline → tts.synthesize_with_voice`
- Do NOT call both `submit()` and `enqueue()` in the same endpoint — pick one

### 5. API endpoints (`src/app.py`)
- Add `from pydantic import BaseModel` when creating new request models
- `GET /api/config` returns the full live config as JSON
- `POST /webhook/mpt` should use `enqueue()` (synchronous) only
- New endpoint models must be defined before they're used (Python class ordering)

### 6. Test coverage
- Mock external calls (edge-tts, ffmpeg, cloud APIs) — never hit real services in unit tests
- Always monkeypatch BOTH `enqueue` and `submit` if the endpoint might call either
- For 3s-splitting tests, use text with sentence-ending punctuation (`。`) — commas won't trigger splits
- Reference: `tests/test_aistation.py` (OmniAutoVideo section, 8 new test cases)

### 7. Environment variables for OmniAutoVideo
```bash
# In deploy/.env or VPS systemd Environment=
AZURE_VOICE=zh-TW-HsiaoChenNeural
VIDEO_RATIO=9:16          # vertical portrait
MAX_SHOT_DURATION=3       # 3-second per-clip ceiling
KEN_BURNS_ZOOM=1.08       # subtle zoom for still images
```
