#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
local_telegram_sender.py — reusable Telegram sender for local Hermes cron scripts.
Use when `deliver: local` cron jobs must notify a phone themselves (the platform
Telegram push fails on Windows with getaddrinfo errors).

Design (matches the OA-TWINS "secret vault" pattern observed in production):
  - Bot token is split across two lines of a local file (NOT a single plaintext
    string, NOT a GitHub secret value — those can't be read by local scripts).
  - Chat id is a hardcoded fallback or env override.

Usage:
  python3 local_telegram_sender.py            # reads message from _alert.txt
  echo "hi" | python3 local_telegram_sender.py
  python3 local_telegram_sender.py "inline msg"
"""
import os
import sys
import json
import urllib.request
import urllib.error

# EDIT THESE for your environment
_SCRIPT_DIR = r"C:\Users\dingj\AppData\Local\hermes\scripts"
_TOKEN_FILE  = r"C:\Users\dingj\iCloudDrive\iCloud~is~workflow~my~workflows\TELEGRAM.txt"
_MSG_FILE    = os.path.join(_SCRIPT_DIR, "_auto_repair_alert.txt")
CHAT_ID     = os.environ.get("HERMES_CRON_AUTO_DELIVER_CHAT_ID", "6387287462")


def load_token():
    """Reconstruct bot token from the split vault file (lines 23-24, 0-based)."""
    try:
        with open(_TOKEN_FILE, encoding="utf-8") as f:
            lines = f.read().splitlines()
        l23 = lines[22] if len(lines) > 22 else ""
        l24 = lines[23] if len(lines) > 23 else ""
        bot_id, _, part1 = l23.partition(": ")
        return f"{bot_id}:{part1}{l24}".strip()
    except Exception as e:
        print("TOKEN_EXTRACT_ERROR:", e)
        sys.exit(2)


def main():
    if not sys.stdin.isatty():
        msg = sys.stdin.read().strip()
    elif len(sys.argv) > 1:
        msg = " ".join(sys.argv[1:]).strip()
    else:
        try:
            with open(_MSG_FILE, encoding="utf-8") as f:
                msg = f.read().strip()
        except FileNotFoundError:
            print("ERROR: no message (pipe, arg, or _alert.txt)")
            sys.exit(2)
    if not msg:
        print("ERROR: empty message")
        sys.exit(2)

    token = load_token()
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({"chat_id": CHAT_ID, "text": msg}).encode("utf-8")
    req = urllib.request.Request(
        url, data=payload,
        headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = json.loads(r.read().decode("utf-8"))
            print("HTTP", r.status, "ok:", body.get("ok"),
                  "message_id:", body.get("result", {}).get("message_id"))
            sys.exit(0 if body.get("ok") else 1)
    except urllib.error.HTTPError as e:
        print("HTTPError", e.code, e.read().decode("utf-8")[:300])
        sys.exit(1)
    except Exception as e:
        print("SEND_ERROR:", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
