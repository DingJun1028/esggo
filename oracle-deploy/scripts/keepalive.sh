#!/bin/bash
# ============================================================
# ESG GO - Oracle Always Free 防閒置回收腳本
# 定期執行以保持實例活躍
# ============================================================

# 設定
LOG_FILE="/var/log/esggo-keepalive.log"
API_URL="http://localhost:3000/api/health"

# 函數：記錄日誌
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# 函數：執行健康檢查
health_check() {
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        log "Health check passed (HTTP $response)"
        return 0
    else
        log "Health check failed (HTTP $response)"
        return 1
    fi
}

# 函數：執行 CPU 負載
cpu_load() {
    # 執行一些計算密集型任務
    local start_time
    local end_time
    local duration
    
    start_time=$(date +%s%N)
    
    # 執行 5 秒的計算
    timeout 5 bash -c 'echo "scale=10000; 4*a(1)" | bc -l > /dev/null 2>&1'
    
    end_time=$(date +%s%N)
    duration=$(( (end_time - start_time) / 1000000 ))
    
    log "CPU load executed (${duration}ms)"
}

# 函數：執行網路活動
network_activity() {
    # 發送一些網路請求
    local endpoints=(
        "http://localhost:3000/api/health"
        "http://localhost:3000/"
    )
    
    for endpoint in "${endpoints[@]}"; do
        curl -s -o /dev/null "$endpoint" 2>/dev/null
    done
    
    log "Network activity completed"
}

# 函數：執行記憶體使用
memory_usage() {
    # 分配一些記憶體
    local mb=${1:-100}
    dd if=/dev/zero bs=1M count=$mb 2>/dev/null | cat > /dev/null
    
    log "Memory usage: ${mb}MB"
}

# 主程式
main() {
    log "=== Keepalive script started ==="
    
    # 1. 健康檢查
    health_check
    
    # 2. CPU 負載
    cpu_load
    
    # 3. 網路活動
    network_activity
    
    # 4. 記憶體使用（輕量）
    memory_usage 50
    
    log "=== Keepalive script completed ==="
}

# 執行主程式
main
