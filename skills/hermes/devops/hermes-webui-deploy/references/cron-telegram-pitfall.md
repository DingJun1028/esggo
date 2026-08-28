# Cron Telegram delivery pitfall (Hermes)

## Symptom
A cron job that should notify via Telegram shows `last_status: error` with:
```
delivery error: Telegram send failed: httpx.ConnectError: [Errno 11001] getaddrinfo failed
```
or `Timed out`, even though the agent's own logic (e.g. opening a GitHub issue)
succeeded.

## Root cause
`deliver: all` (or `deliver: telegram`) routes the cron result through the **Hermes
platform delivery layer** (the same Telegram sender Hermes uses for its own
messages). On some setups that layer has no/blocked Telegram token or DNS fails,
and the failure marks the ENTIRE cron run `error` — even when the agent's actual
work (script execution, issue creation) was fine.

## Fix
1. Set the cron `deliver: local` so the platform layer is bypassed.
2. Have the cron prompt call a **local script** that sends Telegram directly via
   the Telegram Bot API (using a bot token stored locally — e.g. split across lines
   in a secret file like `iCloudDrive/.../TELEGRAM.txt`, reconstructed at runtime).
   This is independent of Hermes's platform Telegram config.

## Verified pattern (OA-TWINS tracker)
- `oa-twins-tracker.py` runs `gh run list`, detects CI failures, writes the message
  to `_auto_repair_alert.txt`, then calls `_send_tg_alert.py` which reconstructs the
  bot token from the secret file and POSTs to `https://api.telegram.org/bot<token>/sendMessage`.
- `notify_via_tracker.py` is the unified notifier wrapper (stdin / arg / --file) that
  reuses the same sender — single send path, no duplicate logic.
- Both `telegram-vps-bridge` and `gh-error-mail-watch` crons call `oa-twins-tracker.py`
  with `deliver: local`; the script's own `state` file prevents duplicate sends.

## Notes
- GitHub Actions `TELEGRAM_*` secrets are NOT readable via `gh secret` (API returns
  only names, not values). For a local cron, the token must live in a local file.
- Do not rely on `deliver: all` for Telegram unless you have confirmed the platform
  layer's Telegram is configured and reachable from the cron execution environment.
