# Runway text-to-video B-roll (module 4 cloud swap)

When `RUNWAY_API_KEY` is set, each shot's `visual_prompt` is sent to Runway to
produce an AI-generated video clip instead of the Pillow gradient still. This is
the "best-effort" cloud swap — never let a Runway failure break the pipeline.

## Shape returned by the visuals layer

`visuals.render_shot_media(shot, idx, total, png_path, mp4_path)` returns
`(media_path, is_video)`. The renderer branches on `is_video`:

- `is_video=False` (gradient still, the free default): ken-burns zoompan +
  trim to audio duration + fade.
- `is_video=True` (Runway clip): `scale=W:H:force_original_aspect_ratio=decrease,
  pad=...:(ow-iw)/2:(oh-ih)/2, trim=duration, fade in/out, format=yuv420p`,
  THEN the same word-synced `drawtext` caption chain. The clip is trimmed to the
  narration length so the audio stays in sync.

## generate_broll() pattern (async — Runway is not sync)

```python
import httpx
headers = {"Authorization": f"Bearer {RUNWAY_API_KEY}", "Content-Type": "application/json"}
# 1) submit
r = httpx.post("https://api.runwayml.com/v1/text_to_video",
               headers=headers,
               json={"prompt": shot["visual_prompt"], "duration": 4, "watermark": False},
               timeout=60)
r.raise_for_status()
body = r.json()
task_id = body.get("id") or body.get("taskId")
# 2) synchronous endpoint may return the url directly — short-circuit
if not task_id:
    url = body.get("video_url") or (body.get("output") or [None])[0]
    if url:
        out_path.write_bytes(httpx.get(url, timeout=120).content)
        return out_path
    raise RuntimeError("Runway returned neither task id nor url")
# 3) poll until done
for _ in range(60):
    t = httpx.get(f"https://api.runwayml.com/v1/tasks/{task_id}", headers=headers, timeout=30)
    t.raise_for_status()
    data = t.json()
    if data.get("status") == "SUCCEEDED":
        url = (data.get("output") or [None])[0]
        if url:
            out_path.write_bytes(httpx.get(url, timeout=120).content)
            return out_path
        raise RuntimeError("Runway SUCCEEDED but produced no output url")
    if data.get("status") == "FAILED":
        raise RuntimeError(f"Runway task failed: {data}")
raise RuntimeError("Runway task timed out")
```

## CRITICAL — fallback discipline

`render_shot_media` MUST wrap `generate_broll` in try/except and fall back to
`render_free_frame` (gradient still) on ANY exception. Without this, a Runway
outage or API-shape change kills the whole render. Verified: with no key,
`USE_RUNWAY=False` and the pipeline produces gradient stills end-to-end.

## Best-effort caveat

Runway's API endpoint + poll shape change across versions. Treat the code above
as a *starting template* and adjust the `/v1/text_to_video` path, the task-id
and status field names, and the output-array shape to the current Runway API
docs. The contract that must hold regardless: submit returns either a task id or
a direct url; a polled task yields an output url on success; on failure the
pipeline falls back to the gradient still.
