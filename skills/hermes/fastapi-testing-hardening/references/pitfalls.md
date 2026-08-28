# FastAPI Testing & Hardening — Concrete Pitfalls

Real bugs caught in this session, reproduced as before/after.

## A. TestClient 422 on any webhook call (None-typed header param)

BEFORE (fails with 422 when the header is present, even a wrong key):
```python
@app.post("/webhook/n8n")
def webhook_n8n(payload: WebhookIn, _: None = Header(None, alias="X-AI-Station-Key"),
                key: str | None = Query(None)):
    _check_webhook_auth(_, key)
```
FastAPI coerces the incoming `X-AI-Station-Key` value into type `None` → validation
error → 422. The auth test then sees `status_code == 422` instead of `401`.

AFTER (read from Request):
```python
def _check_webhook_auth(request: "Request"):
    secret = config.WEBHOOK_SECRET
    if not secret:
        return
    x_key = request.headers.get("X-AI-Station-Key")
    key = request.query_params.get("key")
    if x_key != secret and key != secret:
        raise HTTPException(401, "invalid or missing webhook key")

@app.post("/webhook/n8n")
def webhook_n8n(payload: WebhookIn, request: "Request"):
    _check_webhook_auth(request)
    ...
```

## B. AttributeError: module 'threading' has no attribute 'ThreadPoolExecutor'

BEFORE:
```python
import threading
_pool = threading.ThreadPoolExecutor(max_workers=2, ...)
```
AFTER:
```python
from concurrent.futures import ThreadPoolExecutor
_pool = ThreadPoolExecutor(max_workers=2, thread_name_prefix="svc")
```

## C. numpy imported but missing in CI (local passed, CI failed)

Symptom: `import numpy` inside `visuals.py` works locally, render `failed` in CI
fresh venv. Root cause: dep was only in `requirements.txt`, not in `pyproject.toml`
`dependencies`. The CI step `pip install -e ".[dev]"` does not pull `requirements.txt`.

Fix: add runtime deps to `pyproject` `dependencies`; keep `[dev]` = pytest/pyyaml only.
Also set `[tool.setuptools] packages = ["src"]` (not `py-modules = ["src","web"]`).

## D. CI red from Docker registry timeout (not a code bug)

Symptom: pytest step = "26 passed" but the job is red because
`Set up Docker Buildx` → `Error response from daemon: Get "https://registry-1.docker.io/v2/": context deadline exceeded`.

Fix: mark the buildx + build steps `continue-on-error: true` so a registry blip
doesn't fail a test-gated CI. Build-only CI (no Docker Hub push) → image build is
best-effort.
