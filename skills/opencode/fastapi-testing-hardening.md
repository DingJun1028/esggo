---
name: fastapi-testing-hardening
description: Patterns for hardening and test-driving FastAPI apps — webhook/shared-secret auth, path-traversal guards for static files, FastAPI TestClient pitfalls (the None-typed-param 422), non-blocking background jobs, ffmpeg-dependent integration tests, and using CI (fresh venv + ffmpeg) as the authoritative test gate. Use when adding auth/security to a FastAPI endpoint, writing pytest tests against a FastAPI service with TestClient, making a long request handler non-blocking, or debugging a TestClient 422 / background-job flakiness.
---

# FastAPI Testing & Hardening

## When to use
- Adding shared-secret / webhook auth to a FastAPI endpoint.
- Serving user-generated files and needing a path-traversal guard.
- Writing `pytest` tests with `fastapi.testclient.TestClient`.
- Making a long request handler non-blocking (background render / job).
- Verifying ffmpeg / numpy-dependent code where local passes but CI must be the gate.

## Core patterns

### 1. Webhook / shared-secret auth
- Read the secret from config **dynamically**. A module-level `from .config import WEBHOOK_SECRET` binds the name at import time, so a test's `monkeypatch.setattr(config, "WEBHOOK_SECRET", ...)` will NOT affect `app.WEBHOOK_SECRET`. Instead reference `config.WEBHOOK_SECRET` inside the helper/route, or have the route call a helper that reads `config`.
- Accept the key via header `X-AI-Station-Key` **and** `?key=` query param.
- If unset → open (no auth); if set → `401` on mismatch. Don't hard-fail when unset (allows local dev + n8n without secrets).

### 2. Path-traversal guard for static files
- Avoid `app.mount("/storage", StaticFiles(directory=...))` for user content — it's easy to misuse and hard to guard. Prefer an explicit route:
  ```python
  @app.get("/storage/{rest_of_path:path}")
  def storage_file(rest_of_path: str):
      target = (STORAGE_DIR / rest_of_path).resolve()
      if not str(target).startswith(str(STORAGE_DIR.resolve())) or not target.exists():
          raise HTTPException(404, "not found")
      return FileResponse(str(target))
  ```

### 3. TestClient header/query pitfall (real bug, 422)
- NEVER type a route param as `None`:
  ```python
  @app.post("/webhook/n8n")
  def webhook_n8n(payload: WebhookIn, _: None = Header(None, alias="X-AI-Station-Key")): ...
  ```
  FastAPI tries to coerce the incoming header into type `None` → **422 Unprocessable Entity** on any request that actually sends the header (even a wrong one).
- FIX: read headers/query from the `Request` object inside the handler:
  ```python
  from fastapi import Request
  def _check(request: Request):
      secret = config.WEBHOOK_SECRET
      if not secret: return
      if request.headers.get("X-AI-Station-Key") != secret and request.query_params.get("key") != secret:
          raise HTTPException(401, "invalid or missing webhook key")
  ```
- POST body schema pitfall: for a JSON body endpoint, tests must use `client.post(..., json={...})`. Using `params={...}` sends form-encoded data, which FastAPI will reject with 422 if the route expects JSON. This is a common TestClient mistake that looks like a route bug but is actually a test bug.
- If a `@app.post` handler declares body fields with `Body(...)`/`Body(None)`, tests MUST send JSON body fields (`json=...`). Sending the same fields via query params (`params=...`) will still 422 because FastAPI reads them from the wrong place.
- **FastAPI 0.133 / Pydantic 2.13 variant:** function-parameter body fields without explicit `Body(...)` can still expose OpenAPI validation issues that surface as `422` during `TestClient` requests. If `/v1/generate`-style routes fail schema validation before the handler runs, switch the parameters to explicit `Body(...)` declarations and keep the test payload as `json={...}`; this has proven reliable in `apps/aistation/src/cli.py`.

### 4. Background jobs (non-blocking submit)
- `ThreadPoolExecutor` lives in `concurrent.futures`, NOT `threading`. `threading.ThreadPoolExecutor` raises `AttributeError`. Import correctly:
  ```python
  from concurrent.futures import ThreadPoolExecutor
  _pool = ThreadPoolExecutor(max_workers=2, thread_name_prefix="svc")
  ```
- Pattern: `POST /api/jobs` returns immediately with `{job_id, status:"queued"}`; the render runs in the pool; client polls `GET /api/jobs/{id}`. Webhook can stay synchronous (n8n awaits the result).
- **Wrap the pooled call so a render error is recorded, never silent.** If `submit()` just does `_pool.submit(run_pipeline, ...)`, an exception dies in the pool and the job is stuck in `queued`/`rendering` forever. Wrap:
  ```python
  def _run():
      try:
          run_pipeline(job_id, script, title, brand_preset=brand_preset)
      except Exception as e:
          log.exception("job=%s failed", job_id)
          db.update_job(job_id, status="failed", result=__json({"error": str(e)}))
  _pool.submit(_run)
  ```
- **Do NOT `cancel_futures=True` in the `atexit` shutdown.** `atexit.register(lambda: _pool.shutdown(wait=False, cancel_futures=True))` will KILL an in-flight render at interpreter exit, orphaning the job in `rendering`. Use `cancel_futures=False` (or just `shutdown(wait=False)`) so a render still running when the process ends is allowed to finish. (Found the hard way: flaky `ERROR`/stuck-job symptoms traced to this.)
- **Test poll budget: 30s is too tight for real ffmpeg renders.** A cold/slow box (Windows + ffmpeg startup + TTS network) can exceed `range(60)*0.5s = 30s` and the test flakes `AssertionError: status != done`. Poll generously: `for _ in range(120): ...; time.sleep(0.5)` (≈60s) or longer. The render is real and sequential, so there's no correctness cost to a longer budget.

### 5. Integration tests that shell out to ffmpeg
- Wrap real ffmpeg renders so they skip locally but run in CI:
  ```python
  try:
      subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
  except Exception:
      pytest.skip("ffmpeg not installed")
  ```
- CI installs ffmpeg (`sudo apt-get install -y ffmpeg`); local may lack it → skip. This exercises the real render path in CI while keeping the local suite fast/green.

### 6. CI is the authoritative gate (not your local venv)
- A fresh CI venv will NOT have deps missing from `pyproject.toml` base `dependencies`, even if your local venv does. Code that imports `numpy` (or any optional dep) passes locally but **fails in CI** if the dep is only in `requirements.txt`. Keep runtime deps in `pyproject` `dependencies`; `[dev]` should only add test tooling (`pytest`, `pyyaml`).
- Non-essential CI steps (Docker buildx image build) can hit transient registry timeouts (`context deadline exceeded` to `registry-1.docker.io`). Mark them `continue-on-error: true` so a registry blip doesn't turn a green test run red. The `pytest` step is the real gate.

### 6b. Real cloud-provider integration tests without leaking keys or breaking the default suite
When the app can call paid cloud APIs (Runway, ElevenLabs, OpenAI, S3) but you don't want keys in the repo or the default suite to fail/skip-fail, isolate the real calls behind a **marker** and a **CI-gated job** that only runs when the secret exists:
- Register the marker in `pyproject.toml` so it doesn't warn:
  ```toml
  [tool.pytest.ini_options]
  markers = ["cloud: real cloud-provider integration; runs only when API keys are present"]
  ```
- Each real-call test is marked and self-skips when its key is absent:
  ```python
  @pytest.mark.cloud
  def test_runway_real_broll():
      if not os.environ.get("RUNWAY_API_KEY"):
          pytest.skip("RUNWAY_API_KEY not set")
      ...  # asserts a real video file is produced
  ```
- Do NOT put `pytestmark = pytest.mark.cloud` at module level — that marks EVERY test in the file and skips the whole suite by default. Mark only the real-call tests.
- In CI, add a second job that gates on secret presence. **Job-level `if:` cannot read `secrets.*`** (see `github-secrets` skill) — instead a prior job emits an output:
  ```yaml
  cloud-integration:
    needs: build
    if: ${{ needs.build.outputs.cloud_ready == 'true' }}
    steps:
      - run: pytest -m cloud -v
        env:
          RUNWAY_API_KEY: ${{ secrets.RUNWAY_API_KEY }}
          ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}
  ```
- The default `pytest` run stays green + free; the real calls execute only when the user supplies keys. Keys are injected as env vars in CI and never printed or committed.
- Also keep a **mock/fallback** test that runs always (no key): e.g. `test_runway_fallback_mock` forces the HTTP call to raise and asserts the pipeline falls back to the free path. That covers the fallback branch in every run.

### 7. Flaky suite from leftover repo-root state (intermittent fixture ERROR)
A `gitignored` `jobs.db` / `storage/` left in the **repo root** silently pollutes the shared `config.STORAGE_DIR` / `db.DB_PATH` that modules read at import. Even with an `isolated_state` fixture, pre-existing repo-root rows/files cause **intermittent fixture-setup `ERROR`s** (and `AttributeError`/`assert` flakes) depending on test ordering. Symptoms: the suite passes alone but `ERROR`s on a full run; `rm -rf` of test artifacts may be auto-blocked by the destructive-action gate, so the pollution accumulates across sessions.
- FIX: clean repo-root `jobs.db` + `storage/` (use a Python `shutil.rmtree` cleanup rather than a shell `rm -rf`, which the harness may block), then re-run. Make the `isolated_state` fixture create a FRESH temp dir each time (it does) AND ensure no non-isolated test writes to the real `STORAGE_DIR` (e.g. `test_publish_returns_job_scoped_storage_url` must use `tmp_path`, not `config.STORAGE_DIR`).
- Prevention: keep the suite green across ≥3 consecutive runs after any change touching the pool, storage, or DB_PATH; treat one-off `ERROR`s as real, not environment noise.

**Root-cause variant — import-time `mkdir`:** the worst offender is a module that runs
`STORAGE_DIR.mkdir(parents=True, exist_ok=True)` at **import time** (top-level, not inside a
function). Every `import src.config` — including at pytest collection — then writes `storage/`
into the repo root, so even a run where `isolated_state` hasn't activated yet pollutes. FIX:
never `mkdir` at import. Create `STORAGE_DIR` **lazily**: inside `db.init_db()` (runs at app
startup, before the first `sqlite3.connect`) and inside `pipeline.run_pipeline()` (`work.mkdir(
parents=True)` creates the parent too). Then assert in a test that `importlib.reload(config)` does
NOT create the dir, only `db.init_db()` does. This eliminates the pollution at the source instead
of relying on cleanup.

### 8. Config imported by value silently breaks runtime redirection
`from .config import STORAGE_DIR` (or any config constant) binds the name at **import
time**. A later `monkeypatch.setattr(config, "STORAGE_DIR", tmp)` or an `isolated_state`
fixture that redirects `config.STORAGE_DIR` will NOT affect the already-bound module
global — so renders still hit the real repo `storage/`, leaking files and defeating test
isolation. `WEBHOOK_SECRET` has the same trap (§1).
- **Rule:** any config value tests/runtime may redirect must be read as an **attribute**
  at call time (`config.STORAGE_DIR`), never a module-level `STORAGE_DIR`. Apply in
  `app.py` routes, `pipeline.run_pipeline`, and `storage.*` helpers alike.
- **Symptom:** `isolated_state` tests `ERROR` at fixture setup
  (`AttributeError: module 'src.pipeline' has no attribute 'STORAGE_DIR'`), or
  non-isolated tests leak real job dirs into `storage/`. Both resolve by reading
  `config.*` dynamically. This is the root cause behind much of §7's flakiness — fix the
  import, don't just clean artifacts.
- **Sibling storage-URL bug:** `publish()`/URL builders must return the **real on-disk
  path**, not just the filename. If a job writes `storage/<job_id>/final.mp4` but
  `publish()` returns `/storage/final.mp4`, every client URL 404s and jobs collide. Keep
  the job sub-directory in the returned URL (`/storage/<job_id>/final.mp4`) and verify it
  resolves through the actual `/storage/{path}` route (§2 guard) with a live render.

### 9. Verifying a web UI when browser automation is unavailable
If `browser_navigate` fails (Chrome exits early / no DevTools port) on the host, do NOT
fake the UI check. Start the **real** server and replay its exact `fetch` calls via a
Python script — coverage equals a real browser click-through.
- Launch in the background: `PORT=8123 python -m src.app` (read PORT from env; the
  entry's `main()` may ignore `--port`). Use `process` background mode + a `watch_pattern`
  of "Application startup complete", then `curl -s -o /dev/null -w "%{http_code}"` to
  confirm `200`.
- Write a `scripts/ui_smoke.py` that issues the same HTTP calls the UI makes:
  `POST /api/jobs` (with the same JSON body the form sends, e.g. `brand_preset`),
  poll `GET /api/jobs/{id}` until `done`, then assert BOTH the canonical endpoint
  (`/api/jobs/{id}/video`) AND the job-scoped URL the copy button uses
  (`/storage/<id>/final.mp4`) return `Content-Type: video/mp4` with `len > 1000`.
- Avoid `curl` + bash variable interpolation for CJK/JSON bodies — it mangles quoting.
  Use `urllib.request` (or `requests`) in Python so the payload is exact.
- Kill the server (`process` kill) and `rm -rf storage/*` (gitignored) after.

### 10. Rate limiter tests that poison the whole process (429 cascade)
Adding an in-memory per-IP rate limiter (sliding window / token bucket) is a good
best-practice for a public free-tier VPS. But it has a **test-only landmine** that produces
order-dependent `429` failures across unrelated tests:

- `fastapi.testclient.TestClient` reports `request.client.host == "testclient"` for **every**
  request. So a per-IP limiter keys ALL test requests into ONE shared bucket. Across a 30-test
  suite making ~40+ requests, the bucket hits the default limit (e.g. 30/min) and later tests
  get `429` depending on run order → looks like a flaky `assert 200 == 429`.
- **Never mutate the global limit inside a test via `importlib.reload(module)`.** Reloading
  re-executes the module top-level (resetting `_RATE_LIMIT` to its default) and your test's
  `_app._RATE_LIMIT = 3` then **persists for the rest of the process**, poisoning every
  subsequent test. This is how a dedicated rate-limit test silently breaks `test_api_series_endpoint`
  and others.

FIX pattern (proven in this project):
1. Add a `tests/conftest.py` **autouse fixture** that neutralizes the limiter for ordinary tests:
   ```python
   @pytest.fixture(autouse=True)
   def _neutralize_rate_limit(monkeypatch):
       from src import app as _app
       monkeypatch.setattr(_app, "_RATE_LIMIT", 10_000)
       _app._RATE_BUCKETS.clear()
       yield
       _app._RATE_BUCKETS.clear()
   ```
2. The dedicated rate-limit test re-arms the limiter **locally and restores in `finally`** (no reload):
   ```python
   original = _app._RATE_LIMIT
   _app._RATE_BUCKETS.clear(); _app._RATE_LIMIT = 3
   try:
       client = TestClient(_app.app)
       codes = [client.post("/api/jobs", json={...}).status_code for _ in range(6)]
       assert 429 in codes
   finally:
       _app._RATE_LIMIT = original; _app._RATE_BUCKETS.clear()
   ```
3. Keep the limiter OFF health/`/api/health` (or any monitoring) endpoint so health checks never 429.
4. In production the limiter is per real client IP via `X-Forwarded-For` (trust the first hop
   behind nginx) — `request.client.host` is only `"testclient"` under TestClient, so the shared
   bucket is purely a test artifact, not a prod bug.

### 11. The API stores `result` as a JSON string — parse it client-side

When you expose a job's `result` via a `GET /api/jobs/{id}` endpoint that returns the row
straight from SQLite, `result` often comes back as a **JSON string** (`"{\"video_url\": ...}"`),
not a parsed object. A client/verifier that does `data.get("result").get("video_url")` raises
`AttributeError` (str has no `.get`). Always guard:

```python
raw = final.get("result")
result = json.loads(raw) if isinstance(raw, str) else (raw or {})
video_url = result.get("video_url") if isinstance(result, dict) else None
```

This bit a live `verify_live.py` on a real deploy: the job rendered fine (`status: done`,
`shots: 5`) but the verifier crashed assuming `result` was a dict. The render was never the
problem — only the client parse. Log the raw `result` line so its type is visible immediately.

### 12. Smoke-test a live container with a standalone `verify_live.py`, not nested shell quoting

To verify a deployed container actually renders end-to-end, do NOT build the POST body via
nested `python3 -c` inside an SSH heredoc — the GitHub runner's bash chokes on the quoting
(`syntax error near unexpected token 'json.dumps'`). Instead commit a standalone
`deploy/verify_live.py` using `urllib.request` (no third-party deps) to:
1. `POST /api/jobs` with the script (path-independent JSON, no shell interpolation),
2. poll `GET /api/jobs/{id}` until `done`/`failed`,
3. **verify via the served URL** (`GET /storage/<job>/final.mp4`), asserting HTTP 200 +
   `len(data) > 1000` — NOT by checking the container-internal path `/app/storage/...` on the
   host (the volume is mounted at `./storage` on the host, so that path won't exist there).

Ship it via `rsync` and run `python3 verify_live.py` over SSH. Path-independent served-URL
checks survive any mount-layout difference between host and container.

## Verification loop
1. `pytest` locally (unit + mock + skipped integration).
2. For web-UI changes, run `scripts/ui_smoke.py` against a live server (§9) — confirms the
   real endpoints serve real assets, not just that the HTML parses.
3. Push → wait for the CI run to reach `completed success`. If local passes but CI fails on
   import, it's a missing `pyproject` dependency — add it to `dependencies`, not just
   `requirements.txt`.

### 13. Injecting a non-blocking side-effect into an existing `try/except` route

When you add a fire-and-forget broadcast (e.g. `asyncio.create_task(oab_put(...))`) to a
FastAPI route that already has a `try/except` block, **where you insert it matters**.

**The trap (hit repeatedly in the DeerFlow 2.5 ↔ OA-TWINS bridge):** the write call is
usually a multi-line `await asyncio.to_thread(...)`:

```python
    try:
        memory_data, fact_id = await asyncio.to_thread(
            manager.create_fact,
            content=request.content,
            user_id=_resolve_memory_user_id(http_request),
        )          # <-- this `)` closes the call AND ends the try block's single statement
    # inserting broadcast code here (after the `)`) puts it OUTSIDE the try
    except NotImplementedError:
        raise _unsupported_501(manager, "create fact") from None
```

Inserting the broadcast between the closing `)` and `except` raises
`SyntaxError: expected 'except' or 'finally' block` — because the `)` at 8-space indent is
the *call's* closing paren (inside the paren group), and the next 4-space line is parsed as
a new top-level statement that is neither a try-body continuation nor an `except`.

**The fix:** insert the side-effect AFTER all `except` blocks, BEFORE the `return` — at
function top level (outside the try/except entirely). It is non-blocking (`create_task`),
so losing the try's exception shielding is fine; wrap the broadcast in its own `try/except`
if you want it silent:

```python
    except OSError as exc:
        raise HTTPException(status_code=500, detail="Failed to ...") from exc

    # OA-TWINS bridge: broadcast (non-blocking, after success)
    uid = _resolve_memory_user_id(http_request)
    asyncio.create_task(oab_put(uid, fact_id, {...}))
    return MemoryResponse(**memory_data)
```

For a single-line `try` body (e.g. `memory_data = await asyncio.to_thread(manager.clear_memory, user_id=...)`),
the same rule applies: do NOT insert between the statement and `except`. Put the broadcast
after the `except` chain. If you must keep it inside the try, convert the single line to a
multi-line call and add the broadcast as a second indented statement *before* the closing
`)` of the outer `try` (i.e. as a sibling of the `await` line, both at 4-space try-body indent).

**Verification after any such edit:** `python3 -m py_compile <file>` is mandatory — ruff
will also flag it, but `py_compile` is the fastest signal. Do NOT trust "the anchor
matched" as proof the insertion is syntactically valid.

## References
- `references/pitfalls.md` — concrete before/after reproductions of the 422, ThreadPoolExecutor, and numpy-in-CI bugs.
- `references/ui_verification_without_browser.md` — replay a FastAPI web UI's fetch calls against a live server (when browser automation is down).
- `references/try_except_side_effect_insertion.md` — the `await asyncio.to_thread` + `try/except` insertion pitfall with full before/after repro.
