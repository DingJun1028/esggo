# -*- coding: utf-8 -*-
"""HLPF POC pipeline cron runner — delegates to go.bat.
Spawned as an independent process by Hermes cron (no_agent script mode).
"""
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
BAT = os.path.join(HERE, "go.bat")
LOG = os.path.join(HERE, "cron_run_output.txt")


def main() -> None:
    with open(LOG, "w", encoding="utf-8") as f:
        f.write("=== HLPF cron run %s ===\n" % time.strftime("%Y-%m-%d %H:%M:%S"))
        f.flush()
    try:
        proc = subprocess.run(
            ["cmd.exe", "/c", BAT],
            cwd=HERE,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=600,
        )
        with open(LOG, "a", encoding="utf-8") as f:
            f.write("exit code: %s\n" % proc.returncode)
            f.write("--- STDOUT ---\n%s\n" % proc.stdout)
            f.write("--- STDERR ---\n%s\n" % proc.stderr)
        print("DONE exit=%s" % proc.returncode)
    except Exception as exc:
        with open(LOG, "a", encoding="utf-8") as f:
            f.write("EXCEPTION: %r\n" % exc)
        print("ERROR %r" % exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
