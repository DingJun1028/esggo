#!/usr/bin/env bash
set -euo pipefail
# ESGGO VPS Agent — Bidirectional Communication with Local Relay
RELAY_IP="${1:-100.108.241.29}"
RELAY_PORT="${2:-9999}"
# AUTH_TOKEN must come from environment (.env.secrets); no hardcoded default.
: "${AUTH_TOKEN:?AUTH_TOKEN not set — export it from .env.secrets (source vps/.env.secrets)}"
POLL_INTERVAL="${POLL_INTERVAL:-3}"
RETRY_INTERVAL="${RETRY_INTERVAL:-10}"
GATEWAY_URL="${GATEWAY_URL:-http://127.0.0.1:8642}"
GATEWAY_TOKEN="${GATEWAY_TOKEN:-$AUTH_TOKEN}"
AGENT_ID="${AGENT_ID:-vps-relay-$(hostname)}"
VPS_IP=$(curl -s --max-time 5 http://checkip.amazonaws.com 2>/dev/null || echo "unknown")

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[AGENT]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; }
info() { echo -e "${CYAN}[INFO]${NC} $1"; }

cleanup() { log "Shutting down agent..."; exit 0; }
trap cleanup SIGTERM SIGINT

json_escape() {
  python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" 2>/dev/null || echo '""'
}

omni_register() {
  curl -s --max-time 5 -X POST "${GATEWAY_URL}/agent/register" \
    -H "Content-Type: application/json" \
    ${GATEWAY_TOKEN:+-H "X-Omni-Token: $GATEWAY_TOKEN"} \
    -d "{\"agentId\":\"$AGENT_ID\",\"name\":\"VPS Relay Agent\",\"host\":\"$(hostname)\",\"channel\":\"relay\",\"capabilities\":[\"shell\",\"relay\"]}" \
    > /dev/null 2>&1 || true
}

omni_enqueue() {
  local command="$1"; local gw_id=""
  gw_id=$(curl -s --max-time 5 -X POST "${GATEWAY_URL}/agent/command" \
    -H "Content-Type: application/json" \
    ${GATEWAY_TOKEN:+-H "X-Omni-Token: $GATEWAY_TOKEN"} \
    -d "{\"agentId\":\"$AGENT_ID\",\"command\":{\"command\":$(printf '%s' "$command" | json_escape),\"description\":\"relay cmd\"}}" \
    2>/dev/null | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('command',{}).get('id',''))" 2>/dev/null || echo "")
  printf '%s' "$gw_id"
}

omni_report() {
  local gw_id="$1"; local result_json="$2"
  [ -z "$gw_id" ] && return 0
  curl -s --max-time 5 -X POST "${GATEWAY_URL}/agent/result" \
    -H "Content-Type: application/json" \
    ${GATEWAY_TOKEN:+-H "X-Omni-Token: $GATEWAY_TOKEN"} \
    -d "{\"agentId\":\"$AGENT_ID\",\"commandId\":\"$gw_id\",\"result\":$(printf '%s' "$result_json")}" \
    > /dev/null 2>&1 || true
}

exec_command() {
  local cmd_id="$1"; local command="$2"; local start_time=$(date +%s)
  log "Executing: $command"
  local gw_id; gw_id=$(omni_enqueue "$command")
  local stdout=""; local stderr=""; local exit_code=0
  stdout=$(eval "$command" 2> >(stderr=$(cat); echo "$stderr" >&2)) || exit_code=$?
  local end_time=$(date +%s); local duration=$((end_time - start_time))

  local result
  result=$(cat <<EOF
{
  "commandId": "$cmd_id",
  "vpsIp": "$VPS_IP",
  "stdout": $(printf '%s' "$stdout" | head -c 50000 | json_escape),
  "stderr": $(printf '%s' "$stderr" | head -c 10000 | json_escape),
  "exitCode": $exit_code,
  "duration": $duration,
  "hostname": "$(hostname)",
  "ts": "$(date -Iseconds)"
}
EOF
)

  local http_code
  http_code=$(curl -s -o /dev/null -w '%{http_code}' \
    -X POST "http://${RELAY_IP}:${RELAY_PORT}/result" \
    -H "Content-Type: application/json" \
    -H "X-Auth-Token: $AUTH_TOKEN" \
    -d "$result" \
    --max-time 10 2>/dev/null || echo "000")

  if [ "$http_code" = "200" ]; then
    log "Result sent (exit=$exit_code, ${duration}s)"
  else
    warn "Failed to send result (HTTP $http_code)"
  fi

  omni_report "$gw_id" "$result"
}

poll_loop() {
  info "Polling ${RELAY_IP}:${RELAY_PORT} every ${POLL_INTERVAL}s"
  info "VPS IP: ${VPS_IP}"
  info "Auth: ${AUTH_TOKEN}"
  echo ""

  while true; do
    local response
    response=$(curl -s --max-time 5 \
      "http://${RELAY_IP}:${RELAY_PORT}/cmd" \
      -H "X-Auth-Token: $AUTH_TOKEN" 2>/dev/null || echo '{"error":"connection_failed"}')

    if echo "$response" | grep -q '"idle":true'; then
      sleep "$POLL_INTERVAL"
      continue
    fi

    if echo "$response" | grep -q '"error"'; then
      warn "Connection error, retrying in ${RETRY_INTERVAL}s..."
      sleep "$RETRY_INTERVAL"
      continue
    fi

    local cmd_id command
    cmd_id=$(echo "$response"   | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('id',''))" 2>/dev/null || echo "")
    command=$(echo "$response"  | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('command',''))" 2>/dev/null || echo "")

    if [ -n "$cmd_id" ] && [ -n "$command" ]; then
      exec_command "$cmd_id" "$command"
    fi

    sleep "$POLL_INTERVAL"
  done
}

echo ""
log "=========================================="
log "  ESGGO VPS Agent Starting"
log "  Relay: ${RELAY_IP}:${RELAY_PORT}"
log "  VPS:   ${VPS_IP}"
log "=========================================="
echo ""

info "Testing relay connection..."
if curl -s --max-time 5 "http://${RELAY_IP}:${RELAY_PORT}/status" -H "X-Auth-Token: $AUTH_TOKEN" > /dev/null 2>&1; then
  log "Relay connection OK"
else
  warn "Cannot reach relay at ${RELAY_IP}:${RELAY_PORT}"
  warn "Agent will keep trying..."
fi

info "Registering agent..."
curl -s --max-time 5 \
  -X POST "http://${RELAY_IP}:${RELAY_PORT}/cmd" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $AUTH_TOKEN" \
  -d '{"command":"echo '\''VPS Agent Connected'\''","description":"Agent registration"}' \
  > /dev/null 2>&1 || true

info "Cooperating with Omni system at ${GATEWAY_URL}..."
omni_register

poll_loop
