# Webhook / n8n trigger for the pipeline (Windows + Hermes background process)

## The trap: stdlib `http.server` silently breaks Edge TTS

A `http.server.BaseHTTPRequestHandler.do_POST` that calls the async pipeline —
whether via `asyncio.run(pipeline(...))` in the handler thread, or via
`subprocess.run([python, "run_pipeline_cli.py"], input=...)` — produces **0-byte
mp3 files** for every scene when the server itself is a *background-managed*
process (e.g. launched via Hermes `process` tool / `terminal(background=true)`).
ffmpeg then fails with:

    [in#1] Failed to find two consecutive MPEG audio frames.
    Error opening input file .../workspace/audio/scene_01.mp3.

The **same** pipeline + `edge-tts` runs fine from a foreground terminal and from
a FastAPI/uvicorn async endpoint. The sync, threaded `http.server` at the top of
the call tree corrupts the Edge TTS stream (its event loop + stdout pipe interact
badly with the TTS socket). Confirmed by contrast: uvicorn's async task path
writes correct 17-47 KB mp3s; the http.server path writes 0 bytes.

**Rule: never front the pipeline with `http.server`.** Expose it via FastAPI +
uvicorn.

## Correct shape: FastAPI render endpoint + n8n HTTP Request node

```python
# web/app.py (uvicorn) — bearer-token auth so localhost is not open
from fastapi import FastAPI, Header, HTTPException
app = FastAPI()
TOKEN = os.environ.get("APP_TOKEN") or secrets.token_hex(8)  # always-on auth

def _check_auth(authorization: str | None):
    if authorization != f"Bearer {TOKEN}":
        raise HTTPException(401, "Missing/invalid Authorization: Bearer <token>")

@app.post("/api/render")
async def render(script: str = Form(...), title: str = Form(None),
                 aspect: str = Form("16:9"), authorization: str | None = Header(None)):
    _check_auth(authorization)
    task_id = await enqueue(script, title, aspect)   # run pipeline in background task
    return {"task_id": task_id}
```

n8n workflow: `Webhook` -> `Code` (normalize script/title/aspect) ->
`HTTP Request` (POST `http://host.docker.internal:8088/api/render`,
body = `={{ $json }}`, header `Authorization: Bearer {{ $env.APP_TOKEN }}`) ->
`IF` (url != "") -> `Respond to Webhook`.

## Minimal subprocess wrapper for a separate process (if ever needed)

If you MUST shell out to a standalone pipeline runner, isolate it and write the
result to a file (stdout pipe under a background process can also bite):

```python
import subprocess, tempfile, os, json
result_file = os.path.join(tempfile.gettempdir(), f"pipe_res_{os.getpid()}.json")
env = dict(os.environ, PIPELINE_RESULT_FILE=result_file)
proc = subprocess.run([py, "scripts/run_pipeline_cli.py"],
                      input=json.dumps(payload, ensure_ascii=False),
                      text=True, encoding="utf-8",
                      stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, env=env)
if proc.returncode != 0 or not os.path.exists(result_file):
    raise RuntimeError(proc.stderr.strip() or "pipeline subprocess failed")
return json.loads(Path(result_file).read_text(encoding="utf-8"))
```

## UTF-8 decode fix for any HTTP body

```python
n = int(self.headers.get("Content-Length", 0))
body = json.loads(self.rfile.read(n).decode("utf-8"))   # explicit decode!
# BAD: json.loads(self.rfile.read(n))  -> latin-1 default mangles CJK
```
