#!/usr/bin/env python3
"""Probe an MP4 for YouTube-readiness. Run directly: python probe_video.py <file>.

Prints codec, resolution, duration, and a PASS/FAIL for YouTube upload criteria:
  video: h264, yuv420p, 16:9 or 9:16
  audio: aac
  container: mp4 with faststart (not checked here; assume if h264+aac)
"""
import json
import subprocess
import sys
from pathlib import Path


def probe(path: str) -> dict:
    r = subprocess.run(
        ["ffprobe", "-v", "error",
         "-show_entries", "format=duration:stream=codec_name,codec_type,width,height,pix_fmt",
         "-of", "json", path],
        capture_output=True, text=True,
    )
    info = json.loads(r.stdout)
    streams = info.get("streams", [])
    v = next((s for s in streams if s.get("codec_type") == "video"), {})
    a = next((s for s in streams if s.get("codec_type") == "audio"), {})
    w, h = v.get("width"), v.get("height")
    aspect = f"{w}x{h}" if w and h else "?"
    ok = (
        v.get("codec_name") == "h264"
        and v.get("pix_fmt") == "yuv420p"
        and a.get("codec_name") == "aac"
        and (aspect in ("1920x1080", "1080x1920"))
    )
    return {
        "exists": Path(path).exists(),
        "vcodec": v.get("codec_name"),
        "pix_fmt": v.get("pix_fmt"),
        "acodec": a.get("codec_name"),
        "resolution": aspect,
        "duration": info.get("format", {}).get("duration"),
        "youtube_ready": ok,
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: probe_video.py <file.mp4>")
        sys.exit(2)
    res = probe(sys.argv[1])
    print(json.dumps(res, indent=2))
    print("\nYOUTUBE READY:", "PASS" if res["youtube_ready"] else "FAIL")
    sys.exit(0 if res["youtube_ready"] else 1)
