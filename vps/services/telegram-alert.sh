#!/bin/bash
# Telegram alert relay for Alertmanager webhooks
# Usage: ./telegram-alert.sh (runs as HTTP server on :9080)

TOKEN="${TELEGRAM_BOT_TOKEN:?TELEGRAM_BOT_TOKEN must be set (bot token, see BotFather)}"
CHAT_ID="${TELEGRAM_ALERT_CHAT_ID:?TELEGRAM_ALERT_CHAT_ID must be set}"

while true; do
  echo -e "HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK" | \
  nc -l -p 9080 | while read line; do
    if [[ "$line" == *"POST"* ]]; then
      payload=$(cat)
      curl -s -X POST "https://api.telegram.org/bot${TOKEN}/sendMessage" \
        -d chat_id="${CHAT_ID}" \
        -d text="🚨 ESGGO Alert: ${payload}" \
        -d parse_mode="HTML" > /dev/null
    fi
  done
done
