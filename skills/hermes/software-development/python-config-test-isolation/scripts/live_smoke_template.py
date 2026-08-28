"""Isolated live end-to-end smoke test — COPY & ADAPT.

Renders a REAL video using the project's actual free stack (e.g. edge-tts +
ffmpeg + Pillow), fully isolated to a temp dir so it never writes into the
repo's storage/ or jobs.db.

KEY ORDERING RULE: redirect config.STORAGE_DIR / db.DB_PATH BEFORE importing
src.pipeline etc., because those modules capture the value at import time. If you
import first and reassign later, the render leaks into the real storage/.

Usage:
    python scripts/live_smoke.py
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

# Ensure project root is importable.
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

# --- Redirect state BEFORE importing src modules that read config by value ---
tmp = Path(tempfile.mkdtemp(prefix="aistation-smoke-"))

import src.config as config

config.STORAGE_DIR = tmp

import src.db as db

db.DB_PATH = tmp / "jobs.db"

from src import pipeline  # noqa: E402

SCRIPT = """【場景】城市不是替人民設計。
【衝突】市民的需求常被專家最佳化取代。
【洞察】公共價值來自共創。
【方法】用三個共創問題啟動參與。
【反思】你上一次被詢問，是什麼時候？"""

TITLE = "live-smoke"


def main() -> int:
    db.init_db()
    config.setup_logging()
    print(f"[smoke] temp workspace: {tmp}")
    print(f"[smoke] features: {json.dumps(config.feature_summary(), ensure_ascii=False)}")

    job_id = pipeline.submit(TITLE, TITLE, brand_preset="sushi_dr")
    print(f"[smoke] submitted job_id={job_id}")

    for _ in range(120):
        rec = db.get_job(job_id)
        if rec and rec["status"] in ("done", "failed"):
            break
        time.sleep(1)
    else:
        print("[smoke] TIMEOUT", file=sys.stderr)
        return 2

    rec = db.get_job(job_id)
    if rec["status"] != "done":
        print(f"[smoke] FAILED: {rec.get('result')}", file=sys.stderr)
        return 1

    result = json.loads(rec["result"])
    video = Path(result["file"])
    # Regression guard: the returned video_url must be job-scoped and resolve.
    assert result["video_url"].startswith("/storage/"), result["video_url"]
    resolved = (config.STORAGE_DIR / result["video_url"][len("/storage/"):]).resolve()
    assert resolved.exists(), result["video_url"]
    print(f"[smoke] video_url resolves -> {resolved}")

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration,format_name:stream=codec_type,codec_name",
         "-of", "json", str(video)],
        capture_output=True, text=True,
    )
    if probe.returncode != 0:
        print(f"[smoke] FAILED: ffprobe: {probe.stderr}", file=sys.stderr)
        return 1
    info = json.loads(probe.stdout)
    dur = float(info["format"]["duration"])
    streams = {s["codec_type"]: s["codec_name"] for s in info["streams"]}
    print(f"[smoke] ffprobe: duration={dur:.2f}s streams={streams}")
    if dur <= 0 or "video" not in streams:
        print("[smoke] FAILED: invalid media", file=sys.stderr)
        return 1

    # Ensure nothing leaked into the repo storage/.
    repo_storage = ROOT / "storage"
    if repo_storage.exists() and any(repo_storage.iterdir()):
        print("[smoke] FAILED: leaked into repo storage/", file=sys.stderr)
        return 1

    print(f"[smoke] OK — real video rendered: {video} ({video.stat().st_size} bytes)")
    shutil.rmtree(tmp, ignore_errors=True)
    print("[smoke] cleaned up temp workspace")
    return 0


if __name__ == "__main__":
    sys.exit(main())
