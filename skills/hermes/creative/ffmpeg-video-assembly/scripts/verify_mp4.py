#!/usr/bin/env python3
"""verify_mp4.py — assert an MP4 is YouTube-upload-compatible.

Usage:  python verify_mp4.py <file.mp4>
Exits 0 if valid (h264 + width/height present + duration>0), else 1.

Reusable probe: run after any ffmpeg render so you never claim success
without checking the actual bytes.
"""
import json
import subprocess
import sys
from pathlib import Path

EXPECT_W = 1920
EXPECT_H = 1080


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: verify_mp4.py <file.mp4>")
        return 2
    mp4 = Path(sys.argv[1])
    if not mp4.exists():
        print(f"FAIL: missing {mp4}")
        return 1
    probe = subprocess.run(
        ["ffprobe", "-v", "error",
         "-show_entries", "format=duration:stream=codec_name,codec_type,width,height",
         "-of", "json", str(mp4)],
        capture_output=True, text=True,
    )
    if probe.returncode != 0:
        print("FAIL:", probe.stderr.strip())
        return 1
    info = json.loads(probe.stdout)
    v = next((s for s in info.get("streams", [])
              if s.get("codec_type") == "video"), {})
    a = next((s for s in info.get("streams", [])
              if s.get("codec_type") == "audio"), {})
    dur = info.get("format", {}).get("duration")
    ok = (v.get("codec_name") == "h264"
          and v.get("width") == EXPECT_W
          and v.get("height") == EXPECT_H
          and a.get("codec_name") == "aac"
          and dur and float(dur) > 0)
    print(json.dumps({
        "exists": True, "vcodec": v.get("codec_name"),
        "w": v.get("width"), "h": v.get("height"),
        "acodec": a.get("codec_name"),
        "duration": dur,
    }, ensure_ascii=False, indent=2))
    print("\nVERIFY:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
