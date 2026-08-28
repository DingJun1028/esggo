"""Asyncio ffmpeg wrapper — import this in a pipeline module, don't run directly.

Usage:
    from run_ffmpeg import run_ffmpeg
    await run_ffmpeg(["ffmpeg", "-y", "-i", "in.mp4", "out.mp4"], cwd="/path")
"""
import asyncio


async def run_ffmpeg(cmd: list[str], cwd: str | None = None) -> None:
    """Run an ffmpeg command; raise RuntimeError with stderr tail on failure."""
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        cwd=cwd,
    )
    out, err = await proc.communicate()
    if proc.returncode != 0:
        raise RuntimeError(
            f"ffmpeg failed ({proc.returncode}):\n{err.decode(errors='ignore')[-1800:]}"
        )
    return out


if __name__ == "__main__":
    print("Import this module; do not run directly.")
