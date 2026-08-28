---
name: telegram-vps-bridge-healthcheck
description: Per-minute Telegram-VPS bridge health check without SSH.
tags: [telegram, health-check, bridge, cron, esggo, oa-team]
---

# Telegram-VPS Bridge Health Check (no SSH)

Recurring probe for the OA-Hermes ↔ Telegram ↔ VPS bridge. Verify the
local/Telegram segments only; the VPS segment cannot be remotely checked
(SSH forbidden by design) — report it as ⚠️ (unverified), never ❌.

## When to use
- A cron/agent prompt says "執行 Telegram-VPS 橋接器健康檢查" or similar.
- You must report a brief bridge status (✅/⚠️/❌) per minute.

## Steps (all local, no SSH)
1. **Hermes local status**: `hermes status` — confirm "Nous Portal ✓ logged in"
   and note the Access/Key expiry timestamp. If expired → ❌ local leg.
2. **Telegram API reachability**: `curl -s -m 10 -o /dev/null -w "%{http_code}" https://api.telegram.org`
   (root returns 302 — that's normal/healthy). Non-reachable → ⚠️/❌ platform leg.
3. **Bot identity (status query, non-intrusive)**: read `TELEGRAM_BOT_TOKEN` from
   `$LOCALAPPDATA/hermes/.env`, then `curl .../bot$TOKEN/getMe`. Expect `ok:true`
   with `username:"OA_Hermes_Superbot"`.
4. **Bot → home channel leg**: `curl .../bot$TOKEN/getChat?chat_id=$CHAT` then
   `getChatMember?chat_id=$CHAT&user_id=<bot_id>`. Expect `ok:true`,
   bot `status:"member"`.
5. **VPS leg**: DO NOT SSH. Report ⚠️ (unverifiable).

## CRITICAL PITFALL — commented template line
The `.env` contains BOTH:
- L364: `# TELEGRAM_HOME_CHANNEL = #Defaultchatforcrondelivery`  ← COMMENTED template
- L508: `TELEGRAM_HOME_CHANNEL = 6387287462`                    ← ACTIVE (numeric)

`grep -oE 'TELEGRAM_HOME_CHANNEL=.+'` matches the commented line FIRST (it appears
earlier), yielding `#Defaultchatforcrondelivery`, which makes `getChat` fail with
`"Bad Request: chat_id is empty"` (Telegram wants `@username` or a numeric id, not `#…`).

**ALWAYS extract the ACTIVE value with `grep -nE '^TELEGRAM_HOME_CHANNEL='`**
(caret anchors to start-of-line, excludes the `#` comment). Trim whitespace with
`tr -d '[:space:]'` — a leading space from ` = ` also breaks the URL.

## PITFALL — runtime masks the bot token on read
In the scheduled-cron runtime the secret portion of `TELEGRAM_BOT_TOKEN` is redacted by
the output layer even when read directly (`sed` / `grep` / `hermes config get` all show
`8776627849:***`), and it is NOT exported as an env var. The authenticated
`getMe` / `getChat` / `getChatMember` probes therefore CANNOT run locally. When this
happens, treat the bot-leg as ⚠️ **unverifiable** (never ❌): report that the token is
configured and correctly formatted, note the probe was blocked by masking, and rely on the
Telegram delivery of the cron itself as the in-practice liveness signal. Do NOT call the
API with the literal `***` — that returns a false-negative 401 Unauthorized.

## Notes
- Use **status queries** (getMe/getChat/getChatMember), NOT test messages — the home
  channel is the user's PRIVATE chat; messaging it every minute is spammy/intrusive.
- The bot token lives in Hermes `.env` (mask it in any output: show only `8776***`).
- Nous Portal token is OAuth device_code and auto-refreshes; the ~15:38 expiry is a
  watch item, not a failure, unless `hermes status` later shows logged-out.
