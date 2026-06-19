#!/bin/bash

# ESG儀表板監控告警腳本
# 用於檢查應用健康狀態並在異常時發送告警

set -e

# 配置
APP_NAME="ESG儀表板"
HEALTH_CHECK_URL="http://localhost/health"
LOG_FILE="/var/log/esg-monitoring.log"
ALERT_EMAIL="admin@esg-dashboard.com"
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日誌函數
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    echo "[$timestamp] [$level] $message"
}

# 健康檢查函數
check_health() {
    local url=$1
    local timeout=10

    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 系統資源檢查
check_system_resources() {
    # CPU 使用率
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    local cpu_threshold=90

    if (( $(echo "$cpu_usage > $cpu_threshold" | bc -l) )); then
        alert "CRITICAL" "高CPU使用率: ${cpu_usage}% (閾值: ${cpu_threshold}%)"
        return 1
    fi

    # 記憶體使用率
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    local mem_threshold=85

    if (( mem_usage > mem_threshold )); then
        alert "WARNING" "高記憶體使用率: ${mem_usage}% (閾值: ${mem_threshold}%)"
        return 1
    fi

    # 磁碟使用率
    local disk_usage=$(df / | grep / | awk '{ print $5 }' | sed 's/%//g')
    local disk_threshold=90

    if (( disk_usage > disk_threshold )); then
        alert "WARNING" "高磁碟使用率: ${disk_usage}% (閾值: ${disk_threshold}%)"
        return 1
    fi

    return 0
}

# 應用日誌錯誤檢查
check_application_logs() {
    local log_files=("/var/log/nginx/error.log" "/var/log/esg-monitoring.log")
    local error_patterns=("error" "Error" "ERROR" "failed" "Failed" "FAILED")

    for log_file in "${log_files[@]}"; do
        if [[ -f "$log_file" ]]; then
            # 檢查最近5分鐘的錯誤
            local recent_errors=$(tail -n 100 "$log_file" | grep -E "($(IFS=\|; echo "${error_patterns[*]}"))" | wc -l)

            if (( recent_errors > 10 )); then
                alert "WARNING" "應用日誌中發現過多錯誤 ($recent_errors 個) in $log_file"
                return 1
            fi
        fi
    done

    return 0
}

# 網路連接檢查
check_network_connectivity() {
    # 檢查外部API連接
    local api_urls=("https://api.esg-dashboard.com/health" "https://fonts.googleapis.com")

    for url in "${api_urls[@]}"; do
        if ! curl -s --max-time 5 "$url" > /dev/null 2>&1; then
            alert "WARNING" "無法連接到外部服務: $url"
            return 1
        fi
    done

    return 0
}

# 告警函數
alert() {
    local level=$1
    local message=$2

    log "$level" "$message"

    case $level in
        "CRITICAL")
            echo -e "${RED}🚨 CRITICAL: $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  WARNING: $message${NC}"
            ;;
        "INFO")
            echo -e "${GREEN}ℹ️  INFO: $message${NC}"
            ;;
    esac

    # 發送郵件告警 (如果配置了)
    if [[ -n "$ALERT_EMAIL" ]] && [[ "$level" == "CRITICAL" || "$level" == "WARNING" ]]; then
        echo "Subject: [$level] $APP_NAME Alert

$message

Time: $(date)
Host: $(hostname)
" | sendmail "$ALERT_EMAIL" 2>/dev/null || true
    fi

    # 發送Slack告警 (如果配置了)
    if [[ -n "$SLACK_WEBHOOK_URL" ]] && [[ "$level" == "CRITICAL" || "$level" == "WARNING" ]]; then
        curl -s -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-type: application/json' \
            -d "{\"text\":\"[$level] $APP_NAME Alert: $message\"}" || true
    fi
}

# 主檢查函數
perform_health_checks() {
    log "INFO" "開始健康檢查"

    local all_checks_passed=true

    # 應用健康檢查
    if ! check_health "$HEALTH_CHECK_URL"; then
        alert "CRITICAL" "應用健康檢查失敗: $HEALTH_CHECK_URL"
        all_checks_passed=false
    else
        log "INFO" "應用健康檢查通過"
    fi

    # 系統資源檢查
    if ! check_system_resources; then
        all_checks_passed=false
    else
        log "INFO" "系統資源檢查通過"
    fi

    # 應用日誌檢查
    if ! check_application_logs; then
        all_checks_passed=false
    else
        log "INFO" "應用日誌檢查通過"
    fi

    # 網路連接檢查
    if ! check_network_connectivity; then
        all_checks_passed=false
    else
        log "INFO" "網路連接檢查通過"
    fi

    if $all_checks_passed; then
        log "INFO" "所有健康檢查通過"
        echo -e "${GREEN}✅ 所有健康檢查通過${NC}"
        return 0
    else
        log "ERROR" "部分健康檢查失敗"
        echo -e "${RED}❌ 部分健康檢查失敗${NC}"
        return 1
    fi
}

# 創建日誌目錄
mkdir -p "$(dirname "$LOG_FILE")"

# 主循環 (如果以守護進程模式運行)
if [[ "$1" == "--daemon" ]]; then
    echo "啟動監控守護進程..."

    while true; do
        perform_health_checks
        sleep 300  # 每5分鐘檢查一次
    done
else
    # 單次檢查模式
    perform_health_checks
fi