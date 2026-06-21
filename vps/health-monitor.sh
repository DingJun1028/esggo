#!/usr/bin/env bash
set -Eeuo pipefail

# ESGGO VPS Health Monitor & Auto-Restart Script
# Monitors services and auto-restarts on failure
# Usage: ./vps/health-monitor.sh

CONFIG_FILE="${CONFIG_FILE:-/var/www/esggo/health-monitor.conf}"
LOG_FILE="/var/log/esggo-health-monitor.log"
MAX_RESTARTS=3
RESTART_WINDOW=300

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

# Source config if exists
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

ESGGO_PORT="${ESGGO_PORT:-3000}"
GATEWAY_PORT="${GATEWAY_PORT:-8642}"
ESGGO_PM2="${ESGGO_PM2:-esggo-core}"
GATEWAY_PM2="${GATEWAY_PM2:-omniagent-gateway}"

check_http_health() {
    local port=$1
    local endpoint=$2
    
    if curl -fsS --max-time 5 "http://127.0.0.1:${port}${endpoint}" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

restart_service() {
    local service_name=$1
    local pm2_name=$2
    local port=$3
    
    log "Attempting to restart ${service_name}..."
    pm2 restart "$pm2_name" --update-env 2>/dev/null || pm2 start "$pm2_name" 2>/dev/null || true
    
    sleep 5
    if check_http_health "$port" "/status" || check_http_health "$port" "/api/health"; then
        log "SUCCESS: ${service_name} restarted successfully"
        return 0
    else
        log "ERROR: ${service_name} failed to restart"
        return 1
    fi
}

check_all_services() {
    local failed=0
    
    # Check Next.js app
    if ! check_http_health "${ESGGO_PORT}" "/api/health"; then
        log "WARNING: esggo-core not responding on port ${ESGGO_PORT}"
        restart_service "esggo-core" "$ESGGO_PM2" "$ESGGO_PORT" || ((failed++))
    fi
    
    # Check OmniAgent Gateway
    if ! check_http_health "${GATEWAY_PORT}" "/status"; then
        log "WARNING: omniagent-gateway not responding on port ${GATEWAY_PORT}"
        restart_service "omniagent-gateway" "$GATEWAY_PM2" "$GATEWAY_PORT" || ((failed++))
    fi
    
    # Check system resources
    local mem_usage=$(free | awk '/Mem/{printf "%.0f", $3/$2*100}')
    local cpu_usage=$(top -bn1 | awk '/Cpu/{print $2}' | cut -d'%' -f1 || echo 0)
    
    if [ "${mem_usage}" -gt 90 ]; then
        log "WARNING: High memory usage: ${mem_usage}%"
    fi
    
    if [ "${cpu_usage:-0}" -gt 90 ]; then
        log "WARNING: High CPU usage: ${cpu_usage}%"
    fi
    
    # Check disk space
    local disk_usage=$(df / | awk 'NR==2{gsub(/%/,"",$5); print $5}')
    if [ "${disk_usage:-0}" -gt 90 ]; then
        log "WARNING: High disk usage: ${disk_usage}%"
    fi
    
    return $failed
}

# Run health check
check_all_services
exit $?