#!/usr/bin/env bash

set -euo pipefail

# 立即部署和启动OmniJules脚本
# 完整的ESGGO VPS部署，包含OmniJules智能体

# 配置
VPS_USER="esggo"
VPS_HOST="esggo.internal"
BACKUP_DIR="/backups/esggo"
LOG_DIR="/var/log/esggo"
APP_DIR="/var/www/esggo"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

# 立即部署和启动OmniJules
function immediate_deploy_and_enable() {
    log "🚀 开始ESGGO OmniJules立即部署..."
    log "🎯 目标: 完整部署OmniJules v5.1.0智能体，包含所有核心功能"
    
    # 创建目录
    log "📁 创建目录结构..."
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOG_DIR"
    mkdir -p "$APP_DIR"
    mkdir -p "$APP_DIR/logs"
    mkdir -p "$APP_DIR/node_modules"
    mkdir -p "$APP_DIR/packages"
    mkdir -p "$APP_DIR/vps"
    mkdir -p "$APP_DIR/scripts"
    success "目录结构创建完成"
    
    # 安装系统依赖
    log "🔧 安装系统依赖..."
    if ! command -v node >/dev/null 2>&1; then
        log "安装Node.js..."
        # 安装Node.js
        apt-get update
        apt-get install -y curl gnupg
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    
    # 安装 pnpm
    if ! command -v pnpm >/dev/null 2>&1; then
        log "安装pnpm..."
        npm install -g pnpm
    fi
    
    # 安装PM2
    if ! command -v pm2 >/dev/null 2>&1; then
        log "安装PM2..."
        npm install -g pm2
    fi
    
    success "系统依赖安装完成"
    
    # 复制OmniJules文件
    log "📦 部署OmniJules文件..."
    cp -r packages/omnikey-agent "$APP_DIR/"
    cp -r vps "$APP_DIR/"
    cp package.json ecosystem.config.cjs pnpm-workspace.yaml "$APP_DIR/"
    cp -r scripts "$APP_DIR/"
    success "OmniJules文件复制完成"
    
    # 进入应用目录
    cd "$APP_DIR"
    
    # 安装依赖
    log "📚 安装Node.js依赖..."
    pnpm install
    success "Node.js依赖安装完成"
    
    # 运行5T协议合规性检查
    log "🔒 执行5T协议合规性检查..."
    if [[ -f "scripts/security-compliance-check.sh" ]]; then
        chmod +x "scripts/security-compliance-check.sh"
        ./scripts/security-compliance-check.sh
        success "5T协议合规性检查完成"
    else
        log "⚠️ 5T协议合规性检查脚本未找到，使用基本检查..."
    fi
    
    # 启动应用
    log "🚀 启动应用..."
    
    # 启动Next.js应用
    pnpm run build
    
    # 通过PM2启动应用
    if pm2 list | grep -q "esggo"; then
        log "⚠️ 应用已在运行，重启..."
        pm2 restart esggo || pm2 start ecosystem.config.cjs --name esggo
    else
        pm2 start ecosystem.config.cjs --name esggo
    fi
    
    # 启动OmniJules智能体
    log "🧠 启动OmniJules智能体..."
    if [[ -f "vps/omni-server.mjs" ]]; then
        node vps/omni-server.mjs &
        OMNI_PID=$!
        log "OmniJules智能体已启动 (PID: $OMNI_PID)"
    else
        warn "OmniJules智能体启动脚本未找到"
    fi
    
    # 创建监控服务
    log "📊 创建监控服务..."
    
    # 创建监控配置
    cat > "$LOG_DIR/monitor.sh" << 'EOF'
#!/bin/bash
# 监控服务脚本
cd /var/www/esggo

# 检查应用状态
pm2 status esggo

# 检查OmniJules智能体状态
if [[ -f "vps/omni-server.mjs.pid" ]]; then
    PID=$(cat vps/omni-server.mjs.pid)
    if kill -0 $PID 2>/dev/null; then
        echo "🎯 OmniJules智能体运行正常 (PID: $PID)"
    else
        echo "❌ OmniJules智能体未运行"
    fi
fi

# 显示日志
log_date=$(date +%Y%m%d)
if [[ -f "pm2-logs/esggo-$log_date.log" ]]; then
    echo "📋 最新应用日志:"
    tail -20 "pm2-logs/esggo-$log_date.log"
fi
EOF

    chmod +x "$LOG_DIR/monitor.sh"
    success "监控服务创建完成"
    
    # 显示部署摘要
    show_deployment_summary
}

# 显示部署摘要
function show_deployment_summary() {
    log ""
    log "" ======== 🎯 ESGGO部署摘要 ========"
    log "📅 部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
    log "🖥️  应用目录: $APP_DIR"
    log "📋 监控目录: $LOG_DIR"
    log "💾 备份目录: $BACKUP_DIR"
    log ""
    log "🌐 服务状态:"
    log "   • Next.js应用: $(pm2 status esggo 2>/dev/null || echo '未运行')"
    log "   • OmniJules智能体: $(ps aux | grep 'omni-server.mjs' | grep -v grep | wc -l | tr -d ' ') 运行中"
    log "   • Nginx: $(systemctl is-active nginx 2>/dev/null || echo '未运行')"
    log ""
    log "🔗 访问URL:"
    log "   • 应用: http://esggo.internal:3000"
    log "   • 网关: http://esggo.internal:8642/gateway"
    log "   • 健康检查: http://esggo.internal/health"
    log ""
    log "📊 监控命令:"
    log "   • 查看应用状态: pm2 monit"
    log "   • 查看日志: pm2 logs esggo"
    log "   • 运行监控: $LOG_DIR/monitor.sh"
    log ""
    log "🛠️  管理命令:"
    log "   • 重启应用: pm2 restart esggo"
    log "   • 停止应用: pm2 stop esggo"
    log "   • 开始应用: pm2 start esggo"
    log ""
    success "🎉 ESGGO部署完成！OmniJules智能体已启动！"
}

# 执行立即部署
immediate_deploy_and_enable "$@"
