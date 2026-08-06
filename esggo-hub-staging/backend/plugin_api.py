"""ESGGO Hub backend — project health for esggo-learning-center.

Mounted at /api/plugins/esggo-hub/ by the gateway when this plugin is listed
in `plugins.enabled` in config.yaml. Pure stdlib: reads local git + filesystem
state. No Firebase credentials, no network, no secrets read.

Frontend reads it via ctx.rest('/status') and subscribes for live ticks via
ctx.socket('/events') → POST/GET /api/plugins/esggo-hub/*.
"""
from __future__ import annotations

import asyncio
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

PROJECT_PATH = Path(r"C:/Project/esggo-learning-center")


def _git(*args: str) -> str:
    """Run a git command inside the project dir; return stdout or '' on failure."""
    try:
        out = subprocess.run(
            ["git", "-C", str(PROJECT_PATH), *args],
            capture_output=True,
            text=True,
            timeout=10,
        )
        return out.stdout.strip() if out.returncode == 0 else ""
    except Exception:
        return ""


def _count_src() -> int:
    """Walk the project tree counting .jsx files, skipping heavy dirs outright
    (rglob would descend into node_modules/.git/dist regardless of filtering)."""
    n = 0
    skip = {"node_modules", "dist", ".git", "__pycache__", ".next", ".cache", "build", "coverage"}
    try:
        stack = [PROJECT_PATH]
        while stack:
            cur = stack.pop()
            try:
                for entry in cur.iterdir():
                    try:
                        if entry.is_dir():
                            if entry.name not in skip:
                                stack.append(entry)
                        elif entry.suffix == ".jsx":
                            n += 1
                    except OSError:
                        continue
            except OSError:
                continue
    except Exception:
        return 0
    return n


@router.get("/status")
async def status() -> dict:
    branch = await asyncio.to_thread(_git, "rev-parse", "--abbrev-ref", "HEAD")
    commit = await asyncio.to_thread(_git, "log", "-1", "--format=%h %s")
    dirty = await asyncio.to_thread(_git, "status", "--porcelain")
    dist = (PROJECT_PATH / "dist").exists()
    env_present = (PROJECT_PATH / ".env").exists()  # existence only; values never read/exposed
    rules = (PROJECT_PATH / "firestore.rules").exists()
    src_files = await asyncio.to_thread(_count_src)
    return {
        "ok": True,
        "project": "esggo-learning-center",
        "path": str(PROJECT_PATH),
        "branch": branch or "unknown",
        "last_commit": commit or "unknown",
        "dirty": dirty,
        "dist_built": dist,
        "env_present": env_present,
        "firestore_rules": rules,
        "src_files": src_files,
        "checked_at": datetime.now(timezone.utc).isoformat(),
    }


@router.websocket("/events")
async def events(ws: WebSocket) -> None:
    """Live tick channel. Each frame tells the client to re-fetch /status.

    The socket is an accelerator only — the client keeps a polling fallback,
    and on OAuth remotes the socket is a no-op (handled by the SDK).
    """
    await ws.accept()
    try:
        while True:
            await ws.send_json({"type": "tick", "ts": datetime.now(timezone.utc).isoformat()})
            await asyncio.sleep(10)
    except WebSocketDisconnect:
        return
