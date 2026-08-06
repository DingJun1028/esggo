"""B-roll provider adapters for the HLPF POC pipeline.

Providers (selected by ``settings.broll_provider``):
  - ``poster``  : wrap the rendered poster PNG in a static clip (DEFAULT, no API key)
  - ``runway``  : Runway image-to-video from the poster (needs RUNWAY_API_KEY)
  - ``heygen``  : HeyGen talking-avatar video from the beat script (needs HEYGEN_API_KEY)

Every adapter returns a local per-beat clip ``.mp4`` whose audio track is the
beat's TTS file. The assembly step in ``app.py`` concatenates these clips
uniformly, so swapping providers never changes the final codec spec
(h264 / 1920x1080 / aac).

If a real provider is selected but fails (missing key, network/API error),
the module transparently falls back to the poster clip so the overall job
still succeeds.
"""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

from .config import settings


# ---------------------------------------------------------------------------
# Endpoint constants (verified against vendor docs 2026-08-02)
# ---------------------------------------------------------------------------
RUNWAY_ENDPOINT = "https://api.dev.runwayml.com/v1/image_to_video"
RUNWAY_TASK_ENDPOINT = "https://api.dev.runwayml.com/v1/tasks/{task_id}"
RUNWAY_VERSION_HEADER = "2024-11-06"

HEYGEN_ENDPOINT = "https://api.heygen.com/v3/videos"
HEYGEN_STATUS_ENDPOINT = "https://api.heygen.com/v1/video_status/{video_id}"


# ---------------------------------------------------------------------------
# ffmpeg location (mirrors app.py _find_ffmpeg)
# ---------------------------------------------------------------------------
def _find_ffmpeg() -> str:
    candidates = [
        r"C:\Users\dingj\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wek3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe",
        "ffmpeg",
    ]
    import subprocess

    for c in candidates:
        if Path(c).is_file() or subprocess.run(["where", c], capture_output=True, text=True).returncode == 0:
            return c if Path(c).is_file() else subprocess.check_output(["where", c], text=True).strip().splitlines()[0]
    raise FileNotFoundError("ffmpeg.exe not found")


# ---------------------------------------------------------------------------
# Minimal JSON HTTP helper (stdlib only, no new dependency)
# ---------------------------------------------------------------------------
def _http_json(
    method: str,
    url: str,
    *,
    headers: dict[str, str] | None = None,
    data: dict[str, Any] | None = None,
    timeout: int = 60,
) -> tuple[int, dict[str, Any]]:
    payload = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=payload, method=method)
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    if payload is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            return resp.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as exc:  # non-2xx: surface status + body
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            body = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            body = {"raw": raw}
        return exc.code, body


# ---------------------------------------------------------------------------
# Clip builders
# ---------------------------------------------------------------------------
def _poster_clip(*, poster_png: Path, audio_mp3: Path, out_clip: Path) -> Path:
    """Static clip: loop the poster image for the duration of the audio."""
    ffmpeg = _find_ffmpeg()
    cmd = [
        ffmpeg, "-y",
        "-loop", "1",
        "-i", str(poster_png),
        "-i", str(audio_mp3),
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", str(out_clip),
    ]
    import subprocess

    subprocess.run(cmd, check=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return out_clip


def _mux_to_audio(*, video_mp4: Path, audio_mp3: Path, out_clip: Path) -> Path:
    """Re-encode any B-roll mp4 to 1920x1080, loop to fill the audio, attach aac."""
    ffmpeg = _find_ffmpeg()
    cmd = [
        ffmpeg, "-y",
        "-i", str(video_mp4),
        "-i", str(audio_mp3),
        "-filter_complex",
        "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,"
        "pad=1920:1080:(ow-iw)/2:(oh-ih)/2,"
        "loop=loop=-1:size=32767[v]",
        "-map", "[v]",
        "-map", "1:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-movflags", "+faststart",
        str(out_clip),
    ]
    import subprocess

    subprocess.run(cmd, check=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return out_clip


def _download(url: str, dest: Path, *, timeout: int = 120) -> Path:
    urllib.request.urlretrieve(url, str(dest))  # noqa: S310 (trusted provider URLs)
    return dest


# ---------------------------------------------------------------------------
# Runway adapter
# ---------------------------------------------------------------------------
def _image_data_uri(png: Path) -> str:
    """Base64 data URI of the poster (Runway needs HTTPS or data: URI)."""
    import base64

    b64 = base64.b64encode(png.read_bytes()).decode("ascii")
    return f"data:image/png;base64,{b64}"


def _runway_broll(*, beat: dict[str, Any], poster_png: Path, audio_mp3: Path, out_dir: Path) -> Path:
    if not settings.runway_api_key:
        raise RuntimeError("RUNWAY_API_KEY not configured")
    scene_id = str(beat.get("sceneId", "x"))
    prompt = str(beat.get("brollPrompt") or beat.get("scriptText") or scene_id)

    # 1) submit image-to-video task
    status, body = _http_json(
        "POST", RUNWAY_ENDPOINT,
        headers={"Authorization": f"Bearer {settings.runway_api_key}",
                 "X-Runway-Version": RUNWAY_VERSION_HEADER},
        data={
            "model": settings.runway_model or "gen4_turbo",
            "promptText": prompt[:1000],
            "promptImage": _image_data_uri(poster_png) if poster_png.exists() else str(poster_png),
            "ratio": "1280:720",
            "duration": 10,
        },
        timeout=60,
    )
    if status >= 400:
        raise RuntimeError(f"runway submit failed {status}: {body}")
    task_id = (body.get("id") or (body.get("task") or {}).get("id")
               or (body.get("data") or {}).get("id"))
    if not task_id:
        raise RuntimeError(f"runway submit: no task id in {body}")

    # 2) poll until succeeded / failed
    raw_mp4 = out_dir / f"_runway_{scene_id}.raw.mp4"
    deadline = time.time() + 600
    while time.time() < deadline:
        time.sleep(10)
        st, tb = _http_json("GET", RUNWAY_TASK_ENDPOINT.format(task_id=task_id),
                            headers={"Authorization": f"Bearer {settings.runway_api_key}"},
                            timeout=30)
        state = (tb.get("status") or (tb.get("data") or {}).get("status") or "").upper()
        if state in ("SUCCEEDED", "COMPLETED"):
            urls = tb.get("output") or (tb.get("data") or {}).get("output") or []
            if isinstance(urls, dict):
                urls = [urls.get("url")] if urls.get("url") else []
            url = next((u for u in (urls if isinstance(urls, list) else []) if u), None)
            if not url:
                raise RuntimeError(f"runway task succeeded but no output url: {tb}")
            _download(url, raw_mp4)
            break
        if state in ("FAILED", "CANCELED"):
            raise RuntimeError(f"runway task {state}: {tb}")
    else:
        raise RuntimeError("runway task timed out (600s)")

    # 3) mux B-roll with the beat audio
    out_clip = out_dir / f"_broll_{scene_id}.mp4"
    try:
        return _mux_to_audio(video_mp4=raw_mp4, audio_mp3=audio_mp3, out_clip=out_clip)
    finally:
        raw_mp4.unlink(missing_ok=True)


# ---------------------------------------------------------------------------
# HeyGen adapter
# ---------------------------------------------------------------------------
def _heygen_broll(*, beat: dict[str, Any], audio_mp3: Path, out_dir: Path) -> Path:
    if not settings.heygen_api_key:
        raise RuntimeError("HEYGEN_API_KEY not configured")
    scene_id = str(beat.get("sceneId", "x"))
    script = str(beat.get("scriptText") or beat.get("ssmlScript") or scene_id)

    # 1) submit avatar video
    status, body = _http_json(
        "POST", HEYGEN_ENDPOINT,
        headers={"x-api-key": settings.heygen_api_key, "Content-Type": "application/json"},
        data={
            "type": "avatar",
            "avatar_id": settings.heygen_avatar_id or "",
            "script": script,
            "voice_id": settings.heygen_voice_id or "",
            "aspect_ratio": "16:9",
            "output_format": "mp4",
        },
        timeout=60,
    )
    if status >= 400:
        raise RuntimeError(f"heygen submit failed {status}: {body}")
    video_id = (body.get("data") or {}).get("video_id") or body.get("id") or (body.get("data") or {}).get("id")
    if not video_id:
        raise RuntimeError(f"heygen submit: no video id in {body}")

    # 2) poll status
    raw_mp4 = out_dir / f"_heygen_{scene_id}.raw.mp4"
    deadline = time.time() + 600
    while time.time() < deadline:
        time.sleep(10)
        st, tb = _http_json("GET", HEYGEN_STATUS_ENDPOINT.format(video_id=video_id),
                            headers={"x-api-key": settings.heygen_api_key}, timeout=30)
        data = tb.get("data", tb)
        state = str(data.get("status", "")).lower()
        if state in ("completed", "success", "succeeded"):
            url = data.get("video_url") or data.get("url")
            if not url:
                raise RuntimeError(f"heygen completed but no url: {tb}")
            _download(url, raw_mp4)
            break
        if state in ("failed", "error"):
            raise RuntimeError(f"heygen task failed: {tb}")
    else:
        raise RuntimeError("heygen task timed out (600s)")

    # 3) mux with beat audio
    out_clip = out_dir / f"_broll_{scene_id}.mp4"
    try:
        return _mux_to_audio(video_mp4=raw_mp4, audio_mp3=audio_mp3, out_clip=out_clip)
    finally:
        raw_mp4.unlink(missing_ok=True)


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------
def generate_broll(*, beat: dict[str, Any], poster_png: Path, audio_mp3: Path, out_dir: Path) -> Path:
    """Return a per-beat clip mp4. Falls back to the poster clip on any failure."""
    provider = (settings.broll_provider or "poster").lower()
    scene_id = str(beat.get("sceneId", "x"))
    try:
        if provider == "runway":
            return _runway_broll(beat=beat, poster_png=poster_png, audio_mp3=audio_mp3, out_dir=out_dir)
        if provider == "heygen":
            return _heygen_broll(beat=beat, audio_mp3=audio_mp3, out_dir=out_dir)
    except Exception as exc:  # never break the whole job on B-roll failure
        print(f"[broll] provider '{provider}' failed ({exc}); falling back to poster clip")
    return _poster_clip(poster_png=poster_png, audio_mp3=audio_mp3, out_clip=out_dir / f"_broll_{scene_id}.mp4")
