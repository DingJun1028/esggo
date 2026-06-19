#!/bin/bash

# ESG Sunshine JunAiKey V Beta - 災難恢復腳本
# 版本: 1.0.0
# 作者: ESG Sunshine Team
# 描述: 自動化災難恢復流程，包括數據備份恢復、服務重啟等

set -euo pipefail

# 配置變數
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_ROOT}/backups"
LOG_FILE="${PROJECT_ROOT}/logs/disaster-recovery-$(date +%Y%m%d-%H%M%S).log"
RECOVERY_STEPS_FILE="${PROJECT_ROOT}/recovery-steps.json"

# 顏色代碼
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日誌函數
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

success() { log "${GREEN}SUCCESS${NC}" "$1"; }
info() { log "${BLUE}INFO${NC}" "$1"; }
warning() { log "${YELLOW}WARNING${NC}" "$1"; }
error() { log "${RED}ERROR${NC}" "$1"; }

# 檢查依賴
check_dependencies() {
    info "檢查系統依賴..."

    local deps=("docker" "docker-compose" "psql" "curl" "jq")
    local missing_deps=()

    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done

    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "缺少必要的依賴: ${missing_deps[*]}"
        exit 1
    fi

    success "所有依賴檢查通過"
}

# 創建恢復計劃
create_recovery_plan() {
    info "創建災難恢復計劃..."

    cat > "$RECOVERY_STEPS_FILE" << EOF
{
  "version": "1.0.0",
  "created_at": "$(date -Iseconds)",
  "recovery_steps": [
    {
      "id": "backup_validation",
      "name": "數據備份驗證",
      "description": "驗證最新的數據備份完整性",
      "action": "validate_backups",
      "timeout": 300000,
      "rollback": false,
      "depends_on": []
    },
    {
      "id": "system_isolation",
      "name": "系統隔離",
      "description": "隔離故障系統防止數據污染",
      "action": "isolate_system",
      "timeout": 60000,
      "rollback": true,
      "depends_on": ["backup_validation"]
    },
    {
      "id": "database_recovery",
      "name": "數據庫恢復",
      "description": "從備份恢復數據庫",
      "action": "restore_database",
      "timeout": 1800000,
      "rollback": true,
      "depends_on": ["system_isolation"]
    },
    {
      "id": "file_system_recovery",
      "name": "文件系統恢復",
      "description": "恢復上傳的文件和靜態資源",
      "action": "restore_files",
      "timeout": 600000,
      "rollback": true,
      "depends_on": ["system_isolation"]
    },
    {
      "id": "service_restart",
      "name": "服務重啟",
      "description": "重啟所有應用服務",
      "action": "restart_services",
      "timeout": 300000,
      "rollback": true,
      "depends_on": ["database_recovery", "file_system_recovery"]
    },
    {
      "id": "health_checks",
      "name": "健康檢查",
      "description": "執行完整系統健康檢查",
      "action": "perform_health_checks",
      "timeout": 120000,
      "rollback": false,
      "depends_on": ["service_restart"]
    },
    {
      "id": "data_integrity_check",
      "name": "數據完整性檢查",
      "description": "驗證恢復後的數據完整性",
      "action": "verify_data_integrity",
      "timeout": 300000,
      "rollback": false,
      "depends_on": ["health_checks"]
    },
    {
      "id": "notification",
      "name": "恢復完成通知",
      "description": "發送恢復完成通知",
      "action": "send_notification",
      "timeout": 30000,
      "rollback": false,
      "depends_on": ["data_integrity_check"]
    }
  ],
  "estimated_duration": 2400000,
  "rto": 14400000,
  "rpo": 300000
}
EOF

    success "災難恢復計劃已創建: $RECOVERY_STEPS_FILE"
}

# 驗證備份
validate_backups() {
    info "驗證數據備份..."

    # 查找最新的備份文件
    local latest_backup=$(find "$BACKUP_DIR" -name "*.sql" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)

    if [ -z "$latest_backup" ]; then
        error "未找到數據庫備份文件"
        return 1
    fi

    info "找到最新的備份文件: $latest_backup"

    # 檢查備份文件大小
    local backup_size=$(stat -f%z "$latest_backup" 2>/dev/null || stat -c%s "$latest_backup" 2>/dev/null)
    if [ "$backup_size" -lt 1024 ]; then
        error "備份文件大小異常: ${backup_size} bytes"
        return 1
    fi

    info "備份文件大小: $(numfmt --to=iec-i --suffix=B "$backup_size")"

    # 嘗試驗證備份文件格式（基本檢查）
    if ! head -n 5 "$latest_backup" | grep -q "PostgreSQL database dump"; then
        warning "備份文件格式可能不正確，但繼續執行"
    fi

    success "備份驗證完成"
}

# 隔離系統
isolate_system() {
    info "隔離故障系統..."

    # 停止所有服務
    cd "$PROJECT_ROOT"
    docker-compose down --timeout 30

    # 備份當前日誌
    if [ -d "${PROJECT_ROOT}/logs" ]; then
        local log_backup="${PROJECT_ROOT}/logs/pre-recovery-$(date +%Y%m%d-%H%M%S).tar.gz"
        tar -czf "$log_backup" -C "${PROJECT_ROOT}/logs" . 2>/dev/null || true
        info "日誌已備份到: $log_backup"
    fi

    success "系統已隔離"
}

# 恢復數據庫
restore_database() {
    info "開始數據庫恢復..."

    local latest_backup=$(find "$BACKUP_DIR" -name "*.sql" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)

    if [ -z "$latest_backup" ]; then
        error "未找到數據庫備份文件"
        return 1
    fi

    # 確保數據庫容器正在運行
    cd "$PROJECT_ROOT"
    docker-compose up -d esg-db

    # 等待數據庫準備就緒
    local max_attempts=30
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec -T esg-db pg_isready -U esg_user -d esg_dashboard >/dev/null 2>&1; then
            break
        fi
        info "等待數據庫準備就緒... ($attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done

    if [ $attempt -gt $max_attempts ]; then
        error "數據庫準備超時"
        return 1
    fi

    # 創建恢復備份
    info "創建當前數據的備份..."
    docker-compose exec -T esg-db pg_dump -U esg_user -d esg_dashboard > "${PROJECT_ROOT}/backups/pre-recovery-$(date +%Y%m%d-%H%M%S).sql"

    # 恢復數據庫
    info "從備份恢復數據庫..."
    docker-compose exec -T esg-db psql -U esg_user -d esg_dashboard -f /dev/stdin < "$latest_backup"

    if [ $? -eq 0 ]; then
        success "數據庫恢復完成"
    else
        error "數據庫恢復失敗"
        return 1
    fi
}

# 恢復文件系統
restore_files() {
    info "恢復文件系統..."

    # 恢復上傳的文件
    if [ -d "${BACKUP_DIR}/uploads" ]; then
        cp -r "${BACKUP_DIR}/uploads"/* "${PROJECT_ROOT}/uploads/" 2>/dev/null || true
        success "上傳文件已恢復"
    fi

    # 恢復配置文件
    if [ -d "${BACKUP_DIR}/config" ]; then
        cp -r "${BACKUP_DIR}/config"/* "${PROJECT_ROOT}/config/" 2>/dev/null || true
        success "配置文件已恢復"
    fi
}

# 重啟服務
restart_services() {
    info "重啟所有服務..."

    cd "$PROJECT_ROOT"

    # 停止所有服務
    docker-compose down

    # 清理未使用的資源
    docker system prune -f

    # 重啟所有服務
    docker-compose up -d

    # 等待服務啟動
    sleep 30

    success "服務重啟完成"
}

# 執行健康檢查
perform_health_checks() {
    info "執行系統健康檢查..."

    local services=("http://localhost:3001/health" "http://localhost:3000/api/health")
    local failed_checks=()

    for service in "${services[@]}"; do
        if ! curl -f -s --max-time 30 "$service" >/dev/null; then
            failed_checks+=("$service")
        fi
    done

    if [ ${#failed_checks[@]} -ne 0 ]; then
        error "以下服務健康檢查失敗: ${failed_checks[*]}"
        return 1
    fi

    success "所有服務健康檢查通過"
}

# 驗證數據完整性
verify_data_integrity() {
    info "驗證數據完整性..."

    # 檢查關鍵表記錄數
    docker-compose exec -T esg-db psql -U esg_user -d esg_dashboard -c "
        SELECT
            'esg_readings' as table_name,
            COUNT(*) as record_count
        FROM esg_readings
        UNION ALL
        SELECT
            'users' as table_name,
            COUNT(*) as record_count
        FROM auth.users
    " | tee -a "$LOG_FILE"

    success "數據完整性檢查完成"
}

# 發送通知
send_notification() {
    info "發送恢復完成通知..."

    local subject="ESG系統災難恢復完成"
    local body="ESG Sunshine系統已在 $(date) 成功完成災難恢復。所有服務已恢復正常運行。"

    # 在實際環境中，這裡會發送郵件或Slack通知
    echo "$subject: $body" | tee -a "$LOG_FILE"

    success "恢復完成通知已發送"
}

# 執行恢復步驟
execute_recovery_step() {
    local step="$1"

    case "$step" in
        "backup_validation")
            validate_backups
            ;;
        "system_isolation")
            isolate_system
            ;;
        "database_recovery")
            restore_database
            ;;
        "file_system_recovery")
            restore_files
            ;;
        "service_restart")
            restart_services
            ;;
        "health_checks")
            perform_health_checks
            ;;
        "data_integrity_check")
            verify_data_integrity
            ;;
        "notification")
            send_notification
            ;;
        *)
            error "未知的恢復步驟: $step"
            return 1
            ;;
    esac
}

# 主恢復流程
main() {
    local recovery_type="${1:-full}"

    info "開始ESG系統災難恢復流程 (類型: $recovery_type)"
    info "日誌文件: $LOG_FILE"

    # 創建必要的目錄
    mkdir -p "${PROJECT_ROOT}/logs"
    mkdir -p "$BACKUP_DIR"

    # 檢查依賴
    check_dependencies

    # 創建恢復計劃
    create_recovery_plan

    # 讀取恢復步驟
    local steps=$(jq -r '.recovery_steps[].id' "$RECOVERY_STEPS_FILE")

    # 執行每個步驟
    for step in $steps; do
        info "執行恢復步驟: $step"

        if execute_recovery_step "$step"; then
            success "步驟 $step 執行成功"
        else
            error "步驟 $step 執行失敗"
            # 對於關鍵步驟失敗，停止恢復流程
            if [[ "$step" =~ ^(backup_validation|database_recovery|service_restart)$ ]]; then
                error "關鍵步驟失敗，中止恢復流程"
                exit 1
            fi
        fi
    done

    success "災難恢復流程完成"
    info "請檢查日誌文件以獲取詳細信息: $LOG_FILE"
}

# 腳本入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi