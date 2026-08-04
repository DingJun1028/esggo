"""HLPF POC pipeline entry point.
Delegates to runner.py (which calls go.bat).
Kept for backward compatibility with Hermes cron (no_agent) profiles.
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
RUNNER = os.path.join(HERE, "runner.py")

if __name__ == "__main__":
    proc = subprocess.run(
        [sys.executable, RUNNER],
        cwd=HERE,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=600,
    )
    sys.exit(proc.returncode)