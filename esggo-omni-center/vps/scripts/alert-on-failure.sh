#!/usr/bin/env bash
set -euo pipefail
UNIT="${1:-unknown}"
MSG="ESGGO alert: ${UNIT} failed on $(hostname) at $(date -Iseconds)"
if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
  curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TELEGRAM_CHAT_ID}" -d text="${MSG}" >/dev/null || true
elif [ -n "${DISCORD_ALERT_WEBHOOK_ID:-}" ] && [ -n "${DISCORD_ALERT_WEBHOOK_TOKEN:-}" ]; then
  curl -sS -X POST "https://discord.com/api/webhooks/${DISCORD_ALERT_WEBHOOK_ID}/${DISCORD_ALERT_WEBHOOK_TOKEN}" \
    -H 'Content-Type: application/json' -d "{\"content\":\"${MSG}\"}" >/dev/null || true
else
  logger -p local0.err "${MSG}"
fi
echo "${MSG}"
