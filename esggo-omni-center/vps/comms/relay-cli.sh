#!/usr/bin/env bash
set -euo pipefail
RELAY_URL="${RELAY_URL:-http://127.0.0.1:9999}"
# Token must come from environment (.env.secrets); never hardcode a default.
: "${AUTH_TOKEN:?AUTH_TOKEN not set — export it from .env.secrets (source vps/.env.secrets)}"

cmd_help() {
  echo "Usage: relay-cli.sh <status|cmd|results|ping>"
}
cmd_status() {
  curl -s --max-time 5 "$RELAY_URL/status" -H "X-Auth-Token: $AUTH_TOKEN" | python3 -m json.tool 2>/dev/null || curl -s --max-time 5 "$RELAY_URL/status" -H "X-Auth-Token: $AUTH_TOKEN"
}
cmd_cmd() {
  command="${1:-uname -a}"
  body=$(printf '{"command":"%s","description":"%s"}' "$command" "$command")
  curl -s --max-time 5 -X POST "$RELAY_URL/cmd" \
    -H "Content-Type: application/json" \
    -H "X-Auth-Token: $AUTH_TOKEN" \
    -d "$body" | python3 -m json.tool 2>/dev/null || curl -s --max-time 5 -X POST "$RELAY_URL/cmd" -H "Content-Type: application/json" -H "X-Auth-Token: $AUTH_TOKEN" -d "$body"
}
cmd_results() {
  curl -s --max-time 5 "$RELAY_URL/result" -H "X-Auth-Token: $AUTH_TOKEN" | python3 -m json.tool 2>/dev/null || curl -s --max-time 5 "$RELAY_URL/result" -H "X-Auth-Token: $AUTH_TOKEN"
}
cmd_ping() {
  curl -s --max-time 5 "http://100.108.241.29:9999/status" -H "X-Auth-Token: $AUTH_TOKEN" | python3 -m json.tool 2>/dev/null || echo "relay:unavailable"
}

case "${1:-}" in
  status) cmd_status ;;
  cmd) shift; cmd_cmd "${1:-uname -a}" ;;
  results) cmd_results ;;
  ping) cmd_ping ;;
  *) cmd_help; exit 1 ;;
esac
