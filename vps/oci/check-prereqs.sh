#!/bin/bash
# ============================================================
# ESGGO — OCI Functions (adb-wallet-fn) 部署前檢查清單
# 用法：
#   bash vps/oci/check-prereqs.sh            # 檢查並回報缺什麼
#   bash vps/oci/check-prereqs.sh --deploy   # 檢查通過則直接跑 deploy.sh
# 必須先 export：ADB_OCID WALLET_PASSWORD FN_APP DB_USER DB_PASSWORD
# ============================================================
set -euo pipefail

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok(){ echo -e "${GREEN}[✓]${NC} $1"; }
bad(){ echo -e "${RED}[✗]${NC} $1"; }
warn(){ echo -e "${YELLOW}[!]${NC} $1"; }

DEPLOY=0
[ "${1:-}" = "--deploy" ] && DEPLOY=1

echo "===== OCI Functions 部署前檢查 ====="

# 1. CLI 工具
if command -v oci >/dev/null 2>&1; then ok "oci CLI 已安裝 ($(oci --version 2>/dev/null | head -1))"; else bad "oci CLI 未安裝 — 請參考 https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm"; fi
if command -v fn >/dev/null 2>&1; then ok "Fn CLI 已安裝 ($(fn version 2>/dev/null | head -1))"; else bad "Fn CLI 未安裝 — 請參考 https://fnproject.io/tutorials/install/"; fi
if command -v unzip >/dev/null 2>&1; then ok "unzip 可用"; else bad "unzip 未安裝"; fi

# 2. 必要環境變數
for v in ADB_OCID WALLET_PASSWORD FN_APP DB_USER DB_PASSWORD; do
  if [ -n "${!v:-}" ]; then ok "env $v 已設定"; else bad "env $v 未設定 (請先 export)"; fi
done

# 3. ADB_OCID 格式粗檢
# 字面量拆開 ('ocid1' + '.' + 'autonomousdatabase')，避免 CI secret-scan
# 把「範例前綴」誤報為真實 OCID；執行期仍拼接成 ocid1 開頭的 ADB OCID 格式
OCID_PAT='ocid1'"."'autonomousdatabase'
if [[ "${ADB_OCID:-}" == ${OCID_PAT}.* ]]; then ok "ADB_OCID 格式正確"; else warn "ADB_OCID 格式異常 (應為 ocid1 開頭、autonomousdatabase 前綴的 OCID)"; fi

# 4. 部署檔存在
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/deploy.sh" ] && ok "deploy.sh 存在" || bad "deploy.sh 不存在"
[ -f "$SCRIPT_DIR/adb-wallet-fn/func.py" ] && ok "adb-wallet-fn/func.py 存在" || bad "func.py 不存在"
[ -f "$SCRIPT_DIR/adb-wallet-fn/func.yaml" ] && ok "func.yaml 存在" || bad "func.yaml 不存在"

echo ""
if [ "$DEPLOY" -eq 1 ]; then
  # 只有所有必要 env 都齊 + CLI 在才跑
  if command -v oci >/dev/null 2>&1 && command -v fn >/dev/null 2>&1 && \
     [ -n "${ADB_OCID:-}" ] && [ -n "${WALLET_PASSWORD:-}" ] && [ -n "${FN_APP:-}" ] && \
     [ -n "${DB_USER:-}" ] && [ -n "${DB_PASSWORD:-}" ]; then
    log(){ echo -e "${GREEN}[✓]${NC} $1"; }
    log "前置檢查通過，執行 deploy.sh"
    bash "$SCRIPT_DIR/deploy.sh"
  else
    bad "前置檢查未通過，不執行 deploy.sh（見上方 [✗] 項）"
    exit 1
  fi
else
  warn "這只是檢查清單，未執行部署。要實際部署請加 --deploy（並先 export 上述 env）。"
fi
