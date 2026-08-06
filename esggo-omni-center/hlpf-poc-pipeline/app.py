"""HLPF POC FastAPI pipeline v0.3.0 — real C01-C04 preview generator.

Endpoints:
  GET  /api/health
  GET  /api/beats
  POST /api/jobs        -> renders posters + TTS + assembles final.mp4

Outputs to: out/<project>/preview/
"""
from __future__ import annotations

import asyncio
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException

from src.config import settings

app = FastAPI(title="HLPF POC Pipeline", version="0.3.0")
BEATS_FILE = Path(r"C:\Project\esggo-learning-center\beats.json")
OUT_ROOT = settings.out_root


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------
def _load_beats() -> dict[str, Any]:
    try:
        return json.loads(BEATS_FILE.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=f"beats.json not found at {BEATS_FILE}") from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="beats.json is not valid JSON") from exc


def _find_ffmpeg() -> str:
    """Return ffmpeg.exe path. Prefer explicit WinGet path, fall back to PATH."""
    candidates = [
        r"C:\Users\dingj\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wek3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe",
        "ffmpeg",
    ]
    for c in candidates:
        if Path(c).is_file() or subprocess.run(["where", c], capture_output=True, text=True).returncode == 0:
            resolved = c if Path(c).is_file() else subprocess.check_output(["where", c], text=True).strip().splitlines()[0]
            return resolved
    raise FileNotFoundError("ffmpeg.exe not found")


def _safe_name(text: str) -> str:
    return "".join(c if c.isalnum() or c in "-_ " else "_" for c in text).strip().replace(" ", "-") or "preview"


# ---------------------------------------------------------------------------
# endpoints
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health() -> dict[str, Any]:
    data = _load_beats()
    return {
        "status": "ok",
        "service": "hlpf-poc-pipeline",
        "version": app.version,
        "beatsFile": str(BEATS_FILE),
        "beatCount": len(data.get("beats", [])),
        "outRoot": str(OUT_ROOT),
    }


@app.get("/api/beats")
def beats() -> dict[str, Any]:
    data = _load_beats()
    return {
        "project": data.get("project"),
        "pocScope": data.get("pocScope"),
        "beats": data.get("beats", []),
    }


@app.post("/api/jobs")
def enqueue_job() -> dict[str, Any]:
    data = _load_beats()
    project = data.get("project", "hlpf-poc")
    title = data.get("title", "preview")
    poc_scope = data.get("pocScope", "")
    all_beats = data.get("beats", [])

    if isinstance(poc_scope, str) and "C01-C04" in poc_scope:
        beats = [b for b in all_beats if b.get("sceneId") in {"C01", "C02", "C03", "C04"}] or all_beats[:4]
    else:
        beats = all_beats[:4]

    job_id = f"job-{int(time.time())}"
    out_dir = OUT_ROOT / project / _safe_name(title)
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        from src.visual import render_beat_poster  # lazy import keeps startup cheap
        from src.broll import generate_broll

        images: list[Path] = []
        audios: list[Path] = []

        for beat in beats:
            scene_id = beat.get("sceneId", "unknown")
            img = out_dir / f"{scene_id}.png"
            mp3 = out_dir / f"{scene_id}.mp3"

            render_beat_poster(beat, img)
            images.append(img)

            # edge-tts
            ssml = beat.get("ssmlScript") or beat.get("scriptText", "")
            try:
                import re
                text_for_tts = re.sub(r"<[^>]+>", "", ssml).strip()
            except Exception:
                text_for_tts = beat.get("scriptText", "")

            asyncio.run(
                _tts_save(
                    text=text_for_tts,
                    out_path=mp3,
                    voice="zh-TW-HsiaoChenNeural",
                )
            )
            audios.append(mp3)

        # 2) build per-beat clips via the B-roll provider (poster / runway / heygen)
        clips = [generate_broll(beat=b, poster_png=img, audio_mp3=aud, out_dir=out_dir)
                 for b, img, aud in zip(beats, images, audios)]

        # 3) assemble final.mp4 (concat clips; codec spec fixed: h264/1920x1080/aac)
        final_path = out_dir / "final.mp4"
        _assemble_mp4(clips=clips, out_path=final_path)

        result = {
            "job_id": job_id,
            "status": "succeeded",
            "project": project,
            "title": title,
            "requested_beats": [b.get("sceneId") for b in beats],
            "final_path": str(final_path),
            "out_dir": str(out_dir),
        }
        _write_job_result(result)
        return result
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"pipeline failed: {exc}") from exc


# ---------------------------------------------------------------------------
# TTS
# ---------------------------------------------------------------------------
async def _tts_save(*, text: str, out_path: Path, voice: str) -> None:
    try:
        import edge_tts
    except ImportError as exc:
        raise RuntimeError("edge-tts is not installed") from exc

    communicate = edge_tts.Communicate(text=text or " ", voice=voice)
    await communicate.save(str(out_path))


def _write_job_result(result: dict[str, Any]) -> None:
    job_result_path = OUT_ROOT.parent / "job_result.json"
    existing = {}
    if job_result_path.is_file():
        try:
            existing = json.loads(job_result_path.read_text(encoding="utf-8"))
        except Exception:
            existing = {}
    existing[str(result.get("job_id", "unknown"))] = result
    job_result_path.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------------------------------------------------------------------------
# FFmpeg assembly (concat pre-built clips; codec spec is fixed)
# ---------------------------------------------------------------------------
def _assemble_mp4(*, clips: list[Path], out_path: Path) -> None:
    if not clips:
        raise ValueError("clips must not be empty")

    ffmpeg = _find_ffmpeg()
    try:
        # concat list
        concat_file = out_path.parent / "_concat.txt"
        concat_file.write_text("\n".join(f"file '{c.resolve()}'" for c in clips), encoding="utf-8")

        cmd = [
            ffmpeg,
            "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-movflags", "+faststart",
            str(out_path),
        ]
        subprocess.run(cmd, check=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
    finally:
        # clean temp clips + concat list
        for c in clips:
            try:
                c.unlink()
            except FileNotFoundError:
                pass
        try:
            (out_path.parent / "_concat.txt").unlink()
        except FileNotFoundError:
            pass
