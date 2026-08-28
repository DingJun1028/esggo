---
name: oa-twins-tracking
description: OA-TWINS esggo CI-failure Telegram+Issue tracker.
---

# OA-TWINS Tracking — CI Failure → Telegram + Issue Notifier

## When to use
- User wants GitHub Actions CI failures on `DingJun1028/esggo` surfaced as Telegram alerts + GitHub Issues.
- "追蹤信件 / 萬能分身追蹤 / OA-TWINS 跟蹤" not firing or never started.
- Managing the secret vault / split-token Telegram credentials.

## Architecture (proven, verified working)
```
every 15m (cron telegram-vps-bridge, deliver=local)
  └─ python3 oa-twins-tracker.py   <- SINGLE closed-loop script, no subagent JSON-parsing
       ├─ gh run list --repo DingJun1028/esggo --limit 20 --json ...
       ├─ diff against newest_run_id stored in oa-twins-tracker.state (dedup)
       ├─ for each new failure:
       │    ├─ write _auto_repair_alert.txt (the "圣柜 buffer")
       │    ├─ call _send_tg_alert.py  -> recombine TELEGRAM.txt split token -> POST api.telegram.org
       │    └─ gh issue create "OA-TWINS (bee) 追蹤: <wf> #<run_id>" (skip if title exists)
       └─ write newest_run_id to state (prevent re-send)
```

## Critical Windows / Git-Bash / Hermes pitfalls (these bit us hard)
1. **NEVER use `os.path.expanduser("~/...")` in scripts run via Git-Bash.** It expands to a MIXED-separator path (`C:\Users\dingj/.hermes/scripts/x`) that Python sometimes can't `os.path.exists` consistently and `subprocess.run([sys.executable, path])` fails with "can't open file". **Use absolute Windows paths** (`r"C:\Users\dingj\AppData\Local\hermes\scripts\..."`) for STATE_FILE / ALERT_FILE / SENDER.
2. **Hermes cron `deliver: all` breaks tracking.** The platform-layer Telegram push hits `httpx.ConnectError: [Errno 11001] getaddrinfo failed` / `Timed out` and marks the whole job `error`, sometimes aborting the script mid-run. **Set `deliver: local`** and let the script itself send Telegram (it calls `_send_tg_alert.py` directly, which works — verified HTTP 200).
3. **`int("")` ValueError**: when `load_state()` returns `""` (first run), guard all `int()` conversions before comparison.
4. **`save_state` must run on EVERY path** — including the `action=none` early-return branch — or state never persists and every run re-fires.
5. **Don't rely on a subagent to parse the watcher JSON and call gh/telegram.** That multi-step chain is fragile. Put all logic in ONE script the cron just invokes.

## Secret vault (the "秘密圣柜 / 轉換表" design)
- Telegram bot token is **split-stored** across lines 23-24 of:
  `C:\Users\dingj\iCloudDrive\iCloud~is~workflow~my~workflows\TELEGRAM.txt`
  - line 23: `8682978464: AAF1URM5_fIop_6Lz8_k90nle04ZP`  (bot_id + ": " + part1)
  - line 24: `t61TYY`  (part2)
  - recombine: `{bot_id}:{part1}{part2}`
- `_send_tg_alert.py` reads that file, recombines, and POSTs to `https://api.telegram.org/bot{token}/sendMessage`.
- Chat id `6387287462` (hardcoded fallback + in `telegram-vps-bridge.py` as `TARGET = "telegram:6387287462"`).
- **Do NOT store the token as one plaintext line.** User's explicit philosophy: split-storage + AI-pairing. Keep it that way.
- GitHub Actions secrets `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` also exist in the repo, but `gh secret` **cannot read values** — they're only usable inside Actions, not from a local cron. Local cron must use the iCloud `TELEGRAM.txt` vault.

## Verification
After any change, run the script once with state cleared and confirm:
```
rm -f oa-twins-tracker.state
python3 oa-twins-tracker.py
# expect: {"action":"delegate","failures":N,"telegram_sent":N,"issues_created":M,"state_written":true}
cat oa-twins-tracker.state   # MUST contain a run id (not missing)
```
And check Telegram on the phone received the alerts.

## Files (all under C:\Users\dingj\AppData\Local\hermes\scripts\)
- `oa-twins-tracker.py` — the closed-loop driver (see references/oa-twins-tracker.py)
- `_send_tg_alert.py` — split-token recombine + Telegram POST
- `_auto_repair_alert.txt` — alert buffer the tracker writes before sending
- `gh-error-watch.py` — older watcher (JSON-only, no send); superseded by oa-twins-tracker.py
- `telegram-vps-bridge.py` — bidirectional Telegram command poller (state.db), separate concern

## Cron jobs involved
- `telegram-vps-bridge` (every 15m, deliver=local) -> runs oa-twins-tracker.py
- `gh-error-mail-watch` (every 15m) -> older, also deliver=local; consider folding into the single script
