# aistation — Docker sandbox dev recipe

When the agent's `terminal` backend is the **Docker sandbox** (not Windows host),
the repo is reached through the OneDrive mount, NOT the documented
`C:\Project\aistation` path.

## Resolved paths (verified 2026-08-22)
- Sandbox-visible working copy:
  `C:\Users\dingj\OneDrive\Documents\Default Project\aistation`
  (Linux form: `/c/Users/dingj/OneDrive/Documents/Default Project/aistation`)
- Clone/pull from GitHub works; `git ls-remote` and `git fetch` succeed but a
  FULL `git clone` may time out (exit 124) on slow links — use
  `git clone --filter=blob:none --no-checkout` + `git sparse-checkout set`.
- The sandbox has **no pytest / fastapi / httpx preinstalled** (bare
  python3.11 only). You must build a venv per session.

## Venv setup (sandbox)
```bash
cd "/c/Users/dingj/OneDrive/Documents/Default Project/aistation"
python3 -m venv .venv
. .venv/bin/activate
pip install -q "fastapi>=0.115" "uvicorn[standard]" "pillow" "numpy" \
  "edge-tts" "httpx" "python-dotenv" "pydantic>=2.9" pytest pyyaml
```
Then `python -m pytest -q` runs green (except ffmpeg-dependent e2e tests — see below).

## §12 incremental patterns (test-first)
`tests/test_incremental.py` defines the **full API contract** (28 tests) for
`src/incremental.py` — implementing §12 of soul.md: `StreamBuffer`,
`WorkerPool`, `CompressionEngine`, `LRUCache`, `paginate`, `DeltaTracker`,
`RateLimiter`, `EventBus`, `ServiceOrchestrator`, `ETLPipeline`, `APIGateway`,
`CacheManager`, `ErrorHandler`, `IncrementalPipeline`. The implementation was
MISSING from `main` (only a stale `.pyc` remained), causing all 28 tests to
error. Implement `src/incremental.py` to satisfy the contract; every
5T-emitting pattern must lock through `src/gate5t.lock_artifact` (so `hash_lock`
is a 64-hex SHA-256).

### Contract gotchas (caught while implementing)
- `StreamBuffer.append(key, value)` returns the **key** (str), not a seq int;
  `get_delta(since_key)` returns entries appended strictly after `since_key`.
- `ETLPipeline.get_compressed_data` stores payloads as **JSON strings** (tests
  do `json.loads(list(data.values())[0])`), not dicts.
- `ServiceOrchestrator` / `APIGateway` must stash full results in
  `self._cache[execution_id]` / `self._cache["default"]` so `get_page` works.
- `_Entry.id` is the key string; reference `.id`, not `.key`.

## MPT pure-logic port (MoneyPrinterTurbo → aistation)
User asked to "install MoneyPrinterTurbo and upgrade aistation". MPT is a
separate FastAPI+Streamlit project (deps: `moviepy==2.2.1`, `loguru`,
`litellm`, `streamlit`, locked `fastapi==0.136.3`) — NOT free-tier-first and
NOT import-compatible. Decision: port only **self-contained pure logic** into
`src/mpt_core.py` (frozen dataclasses, no MPT private packages), aligned to
aistation style. Value functions extracted:
- `get_required_video_duration`, `is_material_resolution_acceptable`
- `prioritize_unique_source_clips` (random-shuffle dedup, primary = longest
  slice per source)
- `format_ffmpeg_concat_path` / `escape_ffmpeg_concat_path`
- `concat_video_clips_with_ffmpeg`
- `normalize_llm_text` (strip `<think>` blocks, ©/® symbols, whitespace,
  newlines → spaces, collapse repeats)
- `sanitize_error_message` (scrub API keys / tokens / URLs with creds)

### Cross-platform path fix (carried into mpt_core)
`os.path.isabs("C:\\Users\\x")` is **False** on Linux/docker. In
`format_ffmpeg_concat_path`, detect Windows drive letters explicitly:
```python
is_windows_abs = bool(re.match(r"^[A-Za-z]:[\\/]", file_path or ""))
if os.path.isabs(file_path) or is_windows_abs:
    absolute_path = file_path
else:
    absolute_path = os.path.abspath(file_path)
```
Also broadened `sanitize_error_message`'s secret regex to allow a leading
space/`^` (not just `?`/`&`) so `key=SECRET` (not in a URL) is still scrubbed.

## ffmpeg-dependent e2e tests
`tests/test_aistation.py::test_n8n_webhook_returns_compact_result` and
`::test_api_series_endpoint` require a real `ffmpeg` binary to render video.
The Docker sandbox has none → `FileNotFoundError: 'ffmpeg'`. These are
ENVIRONMENT failures, not code regressions (they were red on a clean clone).
Mark them with `@pytest.mark.skipif(shutil.which("ffmpeg") is None, reason=...)`
so the suite is green in sandbox and still runs where ffmpeg exists. Do NOT
treat their red as a sign your change broke something.

## Branch hygiene
Create feature branches (`git checkout -b feature/...`) before editing; the
OneDrive copy is a normal git repo with `origin` = GitHub. Do NOT push without
explicit user authorization.
