"""Unlock Hermes SSH backend config on the Windows host (single command).

Sets the FULL SSH backend key set (backend / ssh_host / ssh_user / ssh_port /
cwd / ssh_key) so the agent's SSH-backed terminal / execute_code / file tools
can reach the esggo VPS. After running, RESTART the Hermes session/gateway for
the new config to take effect (SSH backend config is loaded at process start).

CRITICAL (2026-08-03, verified): the ORIGINAL script omitted terminal.ssh_key.
Hermes's SSH backend uses ssh-agent by default when ssh_key is unset; if the
agent's key is NOT loaded into the agent (e.g. key lives at ~/.ssh/esggo_original
or Downloads), the connection fails with 'getsockname failed: Not a socket' /
'Read from remote host ... Unknown error' even though host/user/port are set.
The key path MUST be written to terminal.ssh_key. This script now auto-detects
the key and writes it as the 6th key.

CRITICAL: forces HERMES_HOME so `hermes config set` writes to the REAL config
(C:\\Users\\dingj\\AppData\\Local\\hermes\\config.yaml), NOT the default
%USERPROFILE%\\.hermes\\config.yaml. Without this, the script self-reports OK
but the running Hermes never sees the change (verified 2026-08-01).

Usage (manual, default — always prints status):
    python <skill>/scripts/unlock-ssh.py
    python <skill>/scripts/unlock-ssh.py --ssh-key "C:\\Users\\dingj\\.ssh\\esggo_original"

Usage (cron watchdog — silent when already configured, so the watchdog
stays quiet; ONLY works if the file lives under <hermes home>/scripts/):
    python <skill>/scripts/unlock-ssh.py --watchdog

NOTE (2026-08-01, verified): cron `script:` accepts ONLY relative filenames
under <hermes home>/scripts/, and that directory is NOT writable from an
agent session (only the skill dir is). So the watchdog path above is
documented for completeness but cannot be wired via cronjob tool today;
use the manual form instead.

NOTE: the agent itself CANNOT run this script — its own terminal/execute_code
route through the very SSH backend being fixed (chicken-and-egg). The user
must run it in a local PowerShell/CMD on the Windows host.
"""
import argparse
import os
import shutil
import subprocess
import sys

HERMES_HOME = r"C:\Users\dingj\AppData\Local\hermes"
HOST = "161.118.248.180"
USER = "ubuntu"
PORT = "22"
CWD = "/opt/esggo"

# Auto-detected private key candidates, in priority order.
# 2026-08-03: user's working key was found at Downloads (ssh-key-2026-07-22.key);
# canonical skill default is ~/.ssh/esggo_original.
KEY_CANDIDATES = [
    os.path.expanduser(r"~\.ssh\esggo_original"),
    os.path.expanduser(r"~\.ssh\esggo_vps"),
    os.path.expanduser(r"~\.ssh\id_ed25519"),
    os.path.expanduser(r"~\.ssh\id_rsa"),
    r"C:\Users\dingj\Downloads\ssh-key-2026-07-22.key",
]


def find_key(explicit: str | None) -> str | None:
    if explicit:
        return explicit if os.path.exists(explicit) else None
    for k in KEY_CANDIDATES:
        if os.path.exists(k):
            return k
    return None


CHECKS = {
    "terminal.backend": "ssh",
    "terminal.ssh_host": HOST,
    "terminal.ssh_user": USER,
    "terminal.ssh_port": PORT,
    "terminal.cwd": CWD,
}


def find_hermes():
    exe = shutil.which("hermes")
    if exe:
        return exe
    candidates = [
        os.path.expanduser("~/.local/bin/hermes.exe"),
        os.path.expanduser("~/.local/bin/hermes"),
        os.path.expanduser("~/AppData/Local/Programs/hermes/hermes.exe"),
        os.path.expanduser("~/AppData/Roaming/hermes/hermes.exe"),
        os.path.join(HERMES_HOME, "hermes.exe"),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None


def run(args, timeout=60):
    env = dict(os.environ)
    env["HERMES_HOME"] = HERMES_HOME  # force the REAL hermes home
    return subprocess.run(args, capture_output=True, text=True, timeout=timeout, env=env)


def config_path():
    """Return the config.yaml path hermes resolves under forced HERMES_HOME."""
    hermes = find_hermes()
    if not hermes:
        return None
    r = run([hermes, "config", "path"])
    return (r.stdout or r.stderr or "").strip()


def file_configured(key_path: str | None):
    """Verify by reading config.yaml DIRECTLY (bypasses hermes CLI self-report)."""
    cfg = os.path.join(HERMES_HOME, "config.yaml")
    try:
        with open(cfg, encoding="utf-8") as f:
            text = f.read()
    except OSError:
        return False
    ok = all(k in text for k in ("ssh_host", "ssh_user"))
    if key_path and ok:
        ok = ("ssh_key" in text) and (key_path.replace("\\", "/") in text.replace("\\", "/"))
    return ok


def cli_configured(hermes, key_path: str | None):
    for key, want in CHECKS.items():
        rv = run([hermes, "config", "get", key])
        if want not in (rv.stdout or ""):
            return False
    if key_path:
        rv = run([hermes, "config", "get", "terminal.ssh_key"])
        if key_path.replace("\\", "/") not in (rv.stdout or "").replace("\\", "/"):
            return False
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--watchdog", action="store_true",
                    help="silent (empty stdout) when already configured")
    ap.add_argument("--ssh-key", default=None,
                    help="explicit path to SSH private key (auto-detected if omitted)")
    args = ap.parse_args()

    hermes = find_hermes()
    if not hermes:
        print("HERMES_NOT_FOUND")
        sys.exit(1)

    key_path = find_key(args.ssh_key)
    if key_path:
        CHECKS["terminal.ssh_key"] = key_path

    cp = config_path()
    ok_file = file_configured(key_path)
    ok_cli = cli_configured(hermes, key_path)

    if ok_file and ok_cli:
        if not args.watchdog:
            print(f"SSH_ALREADY_OK host={HOST} user={USER} port={PORT} cwd={CWD}")
            if key_path:
                print(f"SSH_KEY={key_path}")
            print(f"CONFIG_PATH={cp}")
        sys.exit(0)  # already configured

    rcs = []
    for key, val in CHECKS.items():
        rcs.append(run([hermes, "config", "set", key, val]).returncode)

    # VERIFY by direct file read (truth), not hermes self-report
    ok = file_configured(key_path)
    if not args.watchdog or not ok:
        print(f"SSH_UNLOCK_{'OK' if ok else 'FAIL'} set_rc={tuple(rcs)}")
        print(f"CONFIG_PATH={cp}")
        print(f"FILE_VERIFIED={ok} ({os.path.join(HERMES_HOME, 'config.yaml')})")
        if key_path:
            print(f"SSH_KEY={key_path}")
        else:
            print("SSH_KEY=None  # no candidate key found; backend will fall back to ssh-agent")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
