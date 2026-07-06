#!/usr/bin/env bash
# ============================================================
# ESGGO VPS Agent — Bidirectional Communication with Local
# Runs on VPS, polls local relay server for commands
# ============================================================
# Usage: bash vps-agent.sh [RELAY_IP] [RELAY_PORT]
# ============================================================
set -euo pipefail

# ── Config ──────────────────────────────────────────────────
RELAY_IP="${1:-100.108.241.29}"     # Local machine IP (Tailscale or public)
RELAY_PORT="${2:-9999}"
AUTH_TOKEN="${3:-esggo-relay-$(date +%Y%m%d)}"
POLL_INTERVAL=3                      # seconds between polls
RETRY_INTERVAL=10                    # seconds on connection error
VPS_IP=$(curl -s --max-time 5 http://checkip.amazonaws.com 2>/dev/null || echo "unknown")

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[AGENT]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; }
info() { echo -e "${CYAN}[INFO]${NC} $1"; }

# ── Cleanup ─────────────────────────────────────────────────
cleanup() {
  log "Shutting down agent..."
  exit 0
}
trap cleanup SIGTERM SIGINT

# ── Execute command locally ─────────────────────────────────
exec_command() {
  local cmd_id="$1"
  local command="$2"
  local start_time=$(date +%s)

  log "Executing: $command"

  # Execute and capture output
  local stdout="" stderr="" exit_code=0
  stdout=$(eval "$command" 2> >(stderr=$(cat); echo "$stderr" >&2)) || exit_code=$?
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))

  # Send result back
  local result=$(cat <<EOF
{
  "commandId": "$cmd_id",
  "vpsIp": "$VPS_IP",
  "stdout": $(echo "$stdout" | head -c 50000 | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" 2>/dev/null || echo '""'),
  "stderr": $(echo "$stderr" | head -c 10000 | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" 2>/dev/null || echo '""'),
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
    -H "X-Auth-Token: ${AUTH_TOKEN}" \
    -d "$result" \
    --max-time 10 2>/dev/null || echo "000")

  if [ "$http_code" = "200" ]; then
    log "Result sent (exit=$exit_code, ${duration}s)"
  else
    warn "Failed to send result (HTTP $http_code)"
  fi
}

# ── Poll loop ────────────────────────────────────────────────
poll_loop() {
  info "Polling ${RELAY_IP}:${RELAY_PORT} every ${POLL_INTERVAL}s"
  info "VPS IP: ${VPS_IP}"
  info "Auth: ${AUTH_TOKEN}"
  echo ""

  while true; do
    local response
    response=$(curl -s --max-time 5 \
      "http://${RELAY_IP}:${RELAY_PORT}/cmd" \
      -H "X-Auth-Token: ${AUTH_TOKEN}" 2>/dev/null || echo '{"error":"connection_failed"}')

    # Check if we got a command
    if echo "$response" | grep -q '"idle":true'; then
      sleep "$POLL_INTERVAL"
      continue
    fi

    if echo "$response" | grep -q '"error"'; then
      warn "Connection error, retrying in ${RETRY_INTERVAL}s..."
      sleep "$RETRY_INTERVAL"
      continue
    fi

    # Parse command
    local cmd_id=$(echo "$response" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('id',''))" 2>/dev/null || echo "")
    local command=$(echo "$response" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('command',''))" 2>/dev/null || echo "")

    if [ -n "$cmd_id" ] && [ -n "$command" ]; then
      exec_command "$cmd_id" "$command"
    fi

    sleep "$POLL_INTERVAL"
  done
}

# ── Startup ─────────────────────────────────────────────────
echo ""
log "=========================================="
log "  ESGGO VPS Agent Starting"
log "  Relay: ${RELAY_IP}:${RELAY_PORT}"
log "  VPS:   ${VPS_IP}"
log "=========================================="
echo ""

# Test connectivity first
info "Testing relay connection..."
if curl -s --max-time 5 "http://${RELAY_IP}:${RELAY_PORT}/status" -H "X-Auth-Token: ${AUTH_TOKEN}" > /dev/null 2>&1; then
  log "Relay connection OK"
else
  warn "Cannot reach relay at ${RELAY_IP}:${RELAY_PORT}"
  warn "Agent will keep trying..."
fi

# Register with relay (send VPS info)
curl -s --max-time 5 \
  -X POST "http://${RELAY_IP}:${RELAY_PORT}/cmd" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: ${AUTH_TOKEN}" \
  -d "{\"command\":\"echo 'VPS Agent Connected','desc\":\"Agent registration\"}" \
  > /dev/null 2>&1 || true

poll_loop
