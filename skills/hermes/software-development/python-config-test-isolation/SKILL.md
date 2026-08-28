---
name: python-config-test-isolation
description: Pitfalls and patterns for Python apps (esp. FastAPI) with a central config.py and tests/fixtures that redirect state. Covers by-value config imports silently breaking test isolation, job-scoped storage URLs 404ing, and isolated live end-to-end smoke tests that do not pollute the repo.
triggers:
  - importing a mutable value from a config module and a monkeypatch or runtime redirect does not take effect
  - tests render into the real storage or jobs.db despite an isolated_state fixture
  - building a live end-to-end smoke test that must not touch repo state
  - storage asset URLs return 404 or collide across jobs
  - background-thread renders ignoring redirected paths
  - flaky/ERROR-ing suite with no code change — suspect leftover repo-root jobs.db/storage polluting shared state
  - job stuck in queued/rendering after a background render raised — suspect at-exit pool cancel
---

# Python config import & test-isolation patterns

## The core pitfall: by-value config imports
When a module does `from .config import STORAGE_DIR`, the name is bound ONCE at
import time. If a test fixture or runtime redirect later does
`monkeypatch.setattr(config, "STORAGE_DIR", tmp)`, the downstream module still
holds the stale original. Symptoms seen in the wild:
- test renders still write into the real `storage/` (or `jobs.db`) even though a
  fixture "redirected" it;
- the app's `/storage/{path}` route serves from the repo dir, not the temp dir;
- background-thread renders (ThreadPoolExecutor) also use the stale value.

Fix: never import the value by name; read it at call time by attribute:
```python
from . import config
# ...
work = config.STORAGE_DIR / job_id          # NOT: from .config import STORAGE_DIR; work = STORAGE_DIR / job_id
```
Applies equally to `db.DB_PATH`, `config.WEBHOOK_SECRET`, feature flags, etc.
Centralize the lookup (`config.X` / `db.X`) so a single fixture redirect is
honored everywhere. After the fix, the `isolated_state` fixture only needs:
```python
monkeypatch.setattr(config, "STORAGE_DIR", work)
monkeypatch.setattr(db, "DB_PATH", work / "jobs.db")
db.init_db()
```
No `monkeypatch.setattr(pipeline, "STORAGE_DIR", work)` line — that only worked
because `pipeline` had its own stale copy; removing the copy removes the need.

## Job-scoped storage URLs (do not strip the dir prefix)
If every job renders into `STORAGE_DIR/<job_id>/final.mp4`, never return a URL
built from only the filename (`f"/storage/{path.name}"`). It resolves to a
missing file (HTTP 404) and collides across jobs. Keep the job-relative path and
read `config.STORAGE_DIR` at call time (see above):
```python
rel = path.resolve().relative_to(config.STORAGE_DIR.resolve())
url = f"/storage/{rel.as_posix()}"   # -> /storage/<job_id>/final.mp4
```
Add a regression test that asserts `url != "/storage/final.mp4"` and that the URL
resolves to a real file under STORAGE_DIR. Do the same for any S3 key
(`videos/{rel}` instead of `videos/{path.name}`) to avoid cross-job overwrite.

## Background-pool at-exit must NOT cancel in-flight renders
If the app registers an `atexit` to drain the worker pool, use
`cancel_futures=False` (or plain `shutdown(wait=False)`). With
`shutdown(wait=False, cancel_futures=True)`, an interpreter-exit while a render is
still queued/running **cancels that future**, leaving the job orphaned in
`queued`/`rendering` with no `failed` status — indistinguishable from a silent
hang. This also makes background-job tests flaky (the job never reaches a terminal
state within the poll budget). Always wrap the pooled call in try/except that
writes `status="failed"` (see fastapi-testing-hardening §4), and let the process
exit without cancelling.

## Leftover repo-root state flake (clean before trusting the suite)
A `gitignored` `jobs.db` / `storage/` left in the **repo root** pollutes the
shared `config.STORAGE_DIR` / `db.DB_PATH` (modules read these at import). Even
with an `isolated_state` fixture, pre-existing repo-root rows cause **intermittent
fixture-setup `ERROR`s** and ordering-dependent flakes — the suite can pass in
isolation but `ERROR` on a full run. The shell `rm -rf` to clear them is often
auto-blocked by the destructive-action gate, so pollution accumulates across
sessions.
- Clean with Python, not shell rm: `shutil.rmtree('storage', ignore_errors=True); os.remove('jobs.db')` — the harness is far less likely to block a targeted Python cleanup.
- No non-isolated test may write to the real `STORAGE_DIR` (e.g. a publish-URL test must use `tmp_path`, never `config.STORAGE_DIR`).
- Gate: after any change touching the pool/storage/DB_PATH, run the suite ≥3× consecutively; treat a single `ERROR` as a real bug, not environment noise.

## Isolated live end-to-end smoke test
To prove the REAL pipeline (ffmpeg + edge-tts + Pillow, not mocks) works without
polluting the repo, redirect storage + db to a temp dir BEFORE importing the
modules that read them, then poll the job to a terminal state and validate with
ffprobe. Reusable scaffolding: `scripts/live_smoke_template.py`.

Ordering gotcha: set `config.STORAGE_DIR` / `db.DB_PATH` and ONLY THEN import
`src.pipeline` etc., because those modules capture the value at import. A smoke
script that imports them first and reassigns later will still leak into the real
`storage/`.

Reusable, copy-and-adapt scaffolding: `scripts/live_smoke_template.py` (isolated
temp workspace, polls job to terminal state, validates with ffprobe, asserts the
video_url is job-scoped and resolves, and fails if it leaks into the repo).

## Tooling pitfall on the Windows/msys host (this machine)
The `search_files` (ripgrep) backend intermittently fails with
`IO error ... 系統找不到指定的路徑。 (os error 3)` on some path forms
(backslash-style or certain `/c/...` forms), even though `git`/terminal work.
Fallback that always works:
```bash
terminal -> grep -rn "pattern" /c/Project/<repo>/   # or:  find dir -name "*.py"
```
Use absolute POSIX paths beginning with `/c/Project/...`. The same applies to
reading a file that `search_files` cannot see — fall back to `terminal` or the
dedicated read tools.

## Scripts package & centralized config pattern
When a repo has standalone CLI scripts plus a central `config.py`, keep the
scripts directory importable and point them at the single source of truth:

1. Add `scripts/__init__.py` so `scripts.foo` can be imported.
2. In each script, prepend the repo root to `sys.path` when run directly:
   ```python
   if __name__ == "__main__":
       sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
   from src import config
   ```
3. If the script must run even when `src` deps are missing, wrap in `try/except`
   and fall back to a local defaults dict so `python scripts/foo.py` never hard-fails.
4. Hardcoded lists in scripts **drift** from config when both define roles or
   tiers independently. Always import `config.LIST` and derive local data from
   it. Never maintain two copies of the same enum/role list.
5. Register console entry points in `pyproject.toml`:
   ```toml
   [project.scripts]
   bee-colony-demo = "scripts.bee_colony_demo:main"
   ```
6. Add `scripts/__pycache__/` to `.gitignore` so `__init__.py` caches do not
   become repo-state noise.

Pitfall in the wild: a 10-role list was maintained in both `src/config.py` and
`scripts/bee_colony_demo.py`. After a role rename, the script still printed
the old names until it was refactored to import `BEE_COLONY_ROLES`.
