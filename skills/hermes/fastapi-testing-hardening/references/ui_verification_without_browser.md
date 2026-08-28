# Verify a FastAPI Web UI Without a Browser

When `browser_navigate` fails (Chrome exits early / no DevTools port) on the host,
replay the UI's exact `fetch` calls against a live server instead of faking the check.
This was used to validate the AI Station UI (submit form → poll → video download/copy
buttons) end-to-end.

## Launch the server
```bash
# Read PORT from env; the entry's main() may ignore --port, so don't pass --port.
PORT=8123 python -m src.app
```
Run in background (`process` tool, `watch_pattern: "Application startup complete"`),
then confirm:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8123/api/health
# expect 200
```

## Replay script (scripts/ui_smoke.py)
Use `urllib.request` (or `requests`) so CJK/JSON bodies aren't mangled by bash quoting.
The script must issue the SAME calls the UI makes:
```python
import json, time, urllib.request

BASE = "http://localhost:8123"
SCRIPT = "【場景】城市不是替人民設計。\n【衝突】...\n【反思】你上一次被詢問，是什麼時候？"

def _req(method, path, data=None):
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(BASE + path, data=body, method=method,
        headers={"Content-Type": "application/json"} if body else {})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, json.loads(r.read().decode() or "{}")

# 1) submit exactly as the form does (include brand_preset if the UI sends it)
st, j = _req("POST", "/api/jobs",
             {"title": "UI-test", "script": SCRIPT, "brand_preset": "sushi_dr"})
jid = j["job_id"]
# 2) poll until terminal
for _ in range(120):
    _, rec = _req("GET", f"/api/jobs/{jid}")
    if rec["status"] in ("done", "failed"):
        break
    time.sleep(1)
# 3) assert BOTH asset routes serve a real MP4
vurl = json.loads(rec["result"])["video_url"]
with urllib.request.urlopen(BASE + f"/api/jobs/{jid}/video", timeout=30) as r:
    assert "video/mp4" in r.headers["Content-Type"] and len(r.read()) > 1000
with urllib.request.urlopen(BASE + vurl, timeout=30) as r:        # the copy-button URL
    assert "video/mp4" in r.headers["Content-Type"] and len(r.read()) > 1000
```

## Gotchas
- The job-scoped storage URL (`/storage/<id>/final.mp4`) is what a "copy link" button
  should use. If `publish()` returned the bare filename (`/storage/final.mp4`) the copy
  link 404s even though `/api/jobs/{id}/video` works. Verify both (see §8 in SKILL.md).
- Background server via `PORT=8123 python -m src.app` (env var), NOT `--port` arg —
  the app's `main()` reads `config.PORT`, not argv.
- After testing: `process` kill the server, `rm -rf storage/*` (gitignored, safe).
