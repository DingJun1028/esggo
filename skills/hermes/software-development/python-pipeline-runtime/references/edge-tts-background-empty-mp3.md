# Edge TTS empty-mp3 under Hermes background process — reproduction & fix

## Environment
- Windows 10, Python 3.11, `edge-tts` (free zh-TW neural voice).
- Project: a 7-layer YouTube video pipeline; TTS layer writes per-scene `.mp3`,
  ffmpeg muxes them into the final MP4.

## Symptom
`edge-tts` "succeeds" (no exception) but `workspace/audio/scene_01.mp3` is
**0 bytes**. ffmpeg then dies:
```
[in#1] Failed to find two consecutive MPEG audio frames.
Error opening input file .../scene_01.mp3.
Error opening input files: Invalid data found when processing input
```

## Reproduction matrix (all in the SAME project, same code)
| How the pipeline is launched                         | scene_01.mp3 |
|------------------------------------------------------|--------------|
| `python -c "asyncio.run(run_pipeline(...))"` (foreground terminal) | 17 856 B ✓ |
| `python scripts/run_pipeline_cli.py` (foreground, stdout piped)       | 24 192 B ✓ |
| `python -m uvicorn web.app:app` (background) → `POST /api/render`     | 47 664 B ✓ |
| `python -m http.server` sidecar (background) → `asyncio.run(pipeline)`| 0 B ✗ |
| `http.server` sidecar (background) → `subprocess.run(cli.py)`          | 0 B ✗ |

=> The failure correlates with **Hermes background-process-managed stdout/stderr
pipes**, NOT with subprocess vs in-process. Edge TTS streaming is sensitive to
the captured-stdout environment.

## Fix that worked (preferred)
Wrap the pipeline behind **FastAPI + uvicorn** and trigger it over HTTP. The
async server context lets Edge TTS stream correctly, and you get a clean API +
Bearer-token auth for free.

`web/app.py` (excerpt):
```python
import asyncio
from fastapi import FastAPI, Form, Header, HTTPException
app = FastAPI()

@app.post("/api/render")
async def render(script: str | None = Form(None), aspect: str = Form("16:9"),
                 authorization: str | None = Header(None)):
    _check_auth(authorization)          # Bearer token
    if not script.strip(): raise HTTPException(400, "script required")
    task_id = uuid.uuid4().hex[:12]
    jobs[task_id] = {"state": "queued", ...}
    asyncio.create_task(_run_job(task_id, script, aspect))   # async task, NOT subprocess
    return {"task_id": task_id, "status": "accepted"}

async def _run_job(tid, script, aspect):
    jobs[tid]["state"] = "running"
    res = await run_pipeline(script, aspect=aspect)   # Edge TTS works here
    jobs[tid].update({"state": "complete", "output": res["output"], ...})
```

n8n (or any caller) then hits `POST /api/render` with the same JSON + a
`Authorization: Bearer <token>` header — verified end-to-end producing a valid
dual-track MP4 (video + audio streams present).

## Why NOT the http.server sidecar
`http.server.BaseHTTPRequestHandler.do_POST` runs on a worker thread. Calling
`asyncio.run(pipeline(...))` there, or `subprocess.run(cli.py)` there, both
yield a 0-byte mp3 under Hermes. Same for `subprocess.run` with
`stdout=subprocess.DEVNULL` / result-file isolation — the empty-mp3 persisted,
so it is an environment issue, not a stdout-capture bug.

## Quick verification after the fix
```bash
TOKEN=$(grep -oP 'generated: \K\w+' <(hermes process log of the uvicorn run))
curl -s -H "Authorization: Bearer $TOKEN" -X POST http://127.0.0.1:8088/api/render \
  --form "script=測試分鏡一。||測試分鏡二。" --form "aspect=16:9"
# poll /api/tasks/<id> until state=complete
ffprobe -v error -show_entries stream=codec_type -of csv=p=0 workspace/final/*.mp4
# expect both "video" and "audio" lines
ls -l workspace/audio/scene_01.mp3   # must be > 0 bytes
```

## Related ffmpeg notes (same project)
- CJK subtitles: use ASS (`-vf "ass=sub.ass"`), cd into the dir first to avoid
  the `C:` colon being read as a filter `key:value` separator.
- concat demuxer drops audio when clips have different stream counts — give every
  clip a silent `aac` track so audio survives.
- `Path.replace(dst, src)` renames `dst` to `src`; the bug `out.replace(tmp)`
  deletes `out`. First arg = new name.
