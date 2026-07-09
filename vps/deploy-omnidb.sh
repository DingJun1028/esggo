#!/bin/bash
# ============================================================
# ESGGO OmniDB — 一鍵部署腳本
# 執行環境：VPS (Ubuntu 24.04) 或 OCI Cloud Shell
# 前提：已建立 MySQL DB + Autonomous DB + 下載 Wallet
# ============================================================
set -euo pipefail

# 顏色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err() { echo -e "${RED}[✗]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA_DIR="${SCRIPT_DIR}/omni-schemas"
MYSQL_SCHEMA_DIR="${SCRIPT_DIR}/mysql-schema"

echo "============================================"
echo "  ESGGO OmniDB Schema Deployment"
echo "============================================"
echo ""

# ============================================================
# Part 1: MySQL Database (OCI MySQL HeatWave)
# ============================================================
info "Part 1: MySQL Database (esggo_omni)"
echo ""

# 從環境變數讀取 MySQL 連線資訊
MYSQL_HOST="${MYSQL_HOST:-}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-admin}"
MYSQL_PASS="${MYSQL_PASS:-}"
MYSQL_DB="${MYSQL_DB:-esggo_omni}"

if [ -z "$MYSQL_HOST" ] || [ -z "$MYSQL_PASS" ]; then
    warn "MySQL 連線資訊未設定。請設定環境變數："
    echo "  export MYSQL_HOST=<your-mysql-host>"
    echo "  export MYSQL_PASS=<your-password>"
    echo ""
    warn "或手動執行 MySQL schema："
    echo "  mysql -h \$MYSQL_HOST -u \$MYSQL_USER -p\$MYSQL_PASS $MYSQL_DB < $MYSQL_SCHEMA_DIR/01-esggo-omni-mysql.sql"
    echo ""
else
    log "連線 MySQL: $MYSQL_HOST:$MYSQL_PORT/$MYSQL_DB"
    
    # 建立資料庫（如不存在）
    mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASS" \
        -e "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DB\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
    
    # 執行 Schema
    if [ -f "$MYSQL_SCHEMA_DIR/01-esggo-omni-mysql.sql" ]; then
        mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" \
            < "$MYSQL_SCHEMA_DIR/01-esggo-omni-mysql.sql"
        log "MySQL Schema 部署完成"
    else
        err "找不到 MySQL Schema 文件: $MYSQL_SCHEMA_DIR/01-esggo-omni-mysql.sql"
    fi
fi

echo ""

# ============================================================
# Part 2: Oracle Autonomous Database (OmniDB)
# ============================================================
info "Part 2: Oracle Autonomous Database (OmniDB)"
echo ""

WALLET_DIR="${WALLET_DIR:-$HOME/oci-wallet}"
TNS_ADMIN="${TNS_ADMIN:-$WALLET_DIR}"

if [ ! -d "$WALLET_DIR" ]; then
    warn "Wallet 目錄不存在: $WALLET_DIR"
    echo "  請先下載 Autonomous Database Wallet 並解壓到此目錄"
    echo "  或設定 WALLET_DIR 環境變數指向 Wallet 位置"
    echo ""
else
    export TNS_ADMIN="$WALLET_DIR"
    
    # 檢查 sqlcl 或 sqlplus
    SQL_TOOL=""
    if command -v sql &>/dev/null; then
        SQL_TOOL="sql"
    elif command -v sqlplus &>/dev/null; then
        SQL_TOOL="sqlplus"
    fi
    
    if [ -z "$SQL_TOOL" ]; then
        warn "找不到 sqlcl 或 sqlplus。請安裝 Oracle Instant Client 或 sqlcl"
        echo ""
    else
        log "使用 $SQL_TOOL 連線 Autonomous Database"
        
        # 從環境變數讀取 ADB 連線資訊
        ADB_USER="${ADB_USER:-ADMIN}"
        ADB_PASS="${ADB_PASS:-}"
        ADB_SERVICE="${ADB_SERVICE:-}"
        
        if [ -z "$ADB_PASS" ]; then
            warn "ADB 密碼未設定。請設定："
            echo "  export ADB_PASS=<your-admin-password>"
            echo "  export ADB_SERVICE=<your-tns-service-name>"
            echo ""
        else
            # 依序執行 5 個 Schema
            SCHEMAS=(
                "OMNI_BASE_METADATA:$SCHEMA_DIR/02-base-metadata.sql"
                "OMNI_PROFILE_VECTOR:$SCHEMA_DIR/03-profile-vector.sql"
                "OMNI_LIFECYCLE_LOG:$SCHEMA_DIR/04-lifecycle-log.sql"
                "OMNI_TRUST_LEDGER:$SCHEMA_DIR/05-trust-ledger.sql"
            )
            
            for entry in "${SCHEMAS[@]}"; do
                SCHEMA_NAME="${entry%%:*}"
                SQL_FILE="${entry##*:}"
                
                if [ -f "$SQL_FILE" ]; then
                    info "部署 $SCHEMA_NAME ..."
                    
                    if [ "$SQL_TOOL" = "sql" ]; then
                        # sqlcl
                        echo "@$SQL_FILE" | sql -l "${ADB_USER}/${ADB_PASS}@${ADB_SERVICE}" 2>&1 | tail -5
                    else
                        # sqlplus
                        sqlplus -l "${ADB_USER}/${ADB_PASS}@${ADB_SERVICE}" "@$SQL_FILE" 2>&1 | tail -5
                    fi
                    
                    log "$SCHEMA_NAME 部署完成"
                else
                    err "找不到 Schema 文件: $SQL_FILE"
                fi
                echo ""
            done
        fi
    fi
fi

echo ""
echo "============================================"
echo "  Deployment Summary"
echo "============================================"
echo ""
log "MySQL OmniDB: ${MYSQL_HOST:-未連線}"
log "Oracle OmniDB: ${ADB_SERVICE:-未連線}"
echo ""
echo "下一步："
echo "  1. 確認兩邊 Schema 都已成功建立"
echo "  2. 更新 .env 加入 OMNI_DATABASE_URL"
echo "  3. 執行 npm run build 確認 Prisma 整合正常"
echo "  4. 啟動 OmniAgent Gateway: pm2 start ecosystem.config.js"
echo ""
