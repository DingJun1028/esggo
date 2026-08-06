#!/usr/bin/env bash
# Smart AI Router - 生產環境部署腳本
# 使用: ./deploy.sh [environment]

set -euo pipefail

# 配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${PROJECT_ROOT}/.env"
ENV_EXAMPLE="${PROJECT_ROOT}/.env.example"

# 顏色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# 檢查必要工具
check_dependencies() {
  log_info "檢查依賴工具..."
  
  for cmd in docker docker-compose npm node; do
    if ! command -v $cmd &> /dev/null; then
      log_error "找不到必要工具: $cmd"
      exit 1
    fi
  done
  
  log_info "所有依賴工具檢查通過"
}

# 檢查環境變數
check_env() {
  log_info "檢查環境變數..."
  
  if [[ ! -f "$ENV_FILE" ]]; then
    log_warn "環境檔案不存在: $ENV_FILE"
    log_info "正在從範本創建..."
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    log_warn "請編輯 $ENV_FILE 並填入實際的 API 金鑰和資料庫密碼"
  fi
  
  # 載入環境變數
  if [[ -f "$ENV_FILE" ]]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
  fi
  
  # 檢查至少有一個 API 金鑰
  if [[ -z "${GROQ_API_KEY:-}" && -z "${OPENROUTER_API_KEY:-}" ]]; then
    log_error "至少需要設定 GROQ_API_KEY 或 OPENROUTER_API_KEY"
    log_info "請從以下任一來源取得金鑰:"
    log_info "  - Groq: https://console.groq.com/keys"
    log_info "  - OpenRouter: https://openrouter.ai/keys"
    exit 1
  fi
  
  log_info "環境變數檢查通過"
}

# 建置 Docker 映像
build_image() {
  local tag="${1:-latest}"
  log_info "建置 Docker 映像: smart-ai-router:${tag}"
  
  docker build \
    --tag smart-ai-router:${tag} \
    --file .agents/skills/smart-ai-router/Dockerfile \
    .
  
  log_info "映像建置完成"
}

# 啟動服務
start_services() {
  local profile="${1:-}"
  log_info "啟動服務..."
  
  if [[ -n "$profile" ]]; then
    docker-compose -f docker-compose.dev.yml --profile "$profile" up -d
  else
    docker-compose -f docker-compose.dev.yml up -d
  fi
  
  log_info "等待服務就緒..."
  sleep 5
  
  # 檢查健康狀態
  local max_attempts=10
  local attempt=1
  while [[ $attempt -le $max_attempts ]]; do
    if curl -s http://localhost:3000/healthz > /dev/null; then
      log_info "服務已就緒！"
      return 0
    fi
    log_warn "等待服務就緒... (嘗試 $attempt/$max_attempts)"
    sleep 3
    ((attempt++))
  done
  
  log_error "服務在預期時間內未就緒"
  return 1
}

# 執行測試
run_tests() {
  log_info "執行單元測試..."
  
  npm test
  
  log_info "測試完成"
}

# 清理資源
cleanup() {
  log_info "清理資源..."
  
  docker system prune -f
  
  log_info "清理完成"
}

# 主函數
main() {
  local env="${1:-development}"
  
  log_info "=== Smart AI Router 部署腳本 ==="
  log_info "環境: $env"
  
  case "$env" in
    development)
      check_dependencies
      check_env
      build_image "dev"
      start_services
      log_info "開發環境已啟動！"
      log_info "存取位置: http://localhost:3000"
      log_info "健康檢查: http://localhost:3000/healthz"
      ;;
    test)
      check_dependencies
      check_env
      run_tests
      ;;
    production)
      check_dependencies
      check_env
      log_info "生產環境部署請使用 GitHub Actions 或手動執行:"
      log_info "  1. 推送到 main 分支觸發 CI/CD"
      log_info "  2. 或手動執行: ./deploy.sh production-manual"
      ;;
    production-manual)
      check_dependencies
      check_env
      build_image "prod"
      # 在此處添加生產環境特定的啟動邏輯
      log_info "生產環境映像已建置"
      log_info "請手動部署到生產伺服器"
      ;;
    cleanup)
      cleanup
      ;;
    *)
      log_error "未知環境: $env"
      log_info "可用環境: development, test, production, production-manual, cleanup"
      exit 1
      ;;
  esac
}

# 執行主函數
main "${@:-development}"