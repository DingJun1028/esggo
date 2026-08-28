# Production sample run (P0 3-clip validation)

## Environment
- Project: `C:\Project\aistation`
- Venv: `.venv` (Python 3.11, fully isolated from Hermes venv)
- Server: `uvicorn src.app:app --host 0.0.0.0 --port 8000`

## Windows port bind pitfall
On Windows, a previous python.exe may already hold `0.0.0.0:8000`.
Symptom: `[Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)`
Resolution:
1. Find holder: `netstat -ano | findstr :8000`
2. Kill by PID using `subprocess.run(['taskkill','/F','/T','/PID',str(pid)])` from Python; plain `taskkill //F //PID` can mis-parse in Git-Bash.

## DB schema bug
- `storage/jobs.db` can exist but contain no tables if `init_db()` never ran before first INSERT.
- Fix: add `init_db()` at top of `create_job()` in `src/db.py` so schema creation is lazy but guaranteed.
- Verified by: insert a test job, then `SELECT name FROM sqlite_master WHERE type='table'` returns `['jobs']`.

## 3-sample batch (2026-08-12)
Scripts used: 3 SEED_TOPICS from `brand.py` (`ESG報告寫完...`, `AI越來越像人...`, `ESG 2.0 Product-Market Fit...`).
Submission: parallel `POST /api/jobs` with payload `{"script": "...", "title": "...", "brand_preset": "sushi_dr"}`.
Outcome:
- All 3 jobs reached `status=done`, `progress=100`.
- Outputs per job: `final.mp4` + `clip_1..5.mp4` + `brand_intro.mp4` + per-shot `shot_N.png` + `shot_N.mp3`.
- Provenance: `jobs.db` root path has 8 rows including the 3 sample jobs with timestamps.
- Tests: `.venv\Scripts\python.exe -m pytest tests/ -q --no-header` = 64 passed.
- `hermes verify` was not run for this project because Hermes venv is corrupted on this host; that is unrelated to the project fix.

## Brand consistency checks
- `host`: 壽司博士 Dr. Source
- `intro_line`: 「大家好，我是壽司博士...」
- `forbidden_ai_visuals`: 藍紫霓虹 / 機器人大腦 / 漂浮數據 / 無意義商務畫面 / 過量未來科技動畫
- DNA markers parsed: 場景, 衝突, 洞察, 方法, 反思
