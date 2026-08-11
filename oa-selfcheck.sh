#!/usr/bin/env bash
# oa-selfcheck.sh — OA 萬能分身元框架 + OAB 5T 部署閘門 單一自驗入口
# 用途: CI / auto-repair / cron 呼叫, 一鍵確認本地「閉環穩定態」
# 退出碼 0 = 全綠; 非 0 = 有失敗 (供 auto-repair 偵測)
set -u
cd "$(dirname "$0")" || exit 1

echo "=== [OA Self-Check] 開始 ==="
FAIL=0

# 1. oa-framework 型別檢查 (嚴格)
echo "--- [1] oa-framework typecheck ---"
( cd packages/oa-framework && npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck ) \
  && echo "  TSC_OK" || { echo "  TSC_FAIL"; FAIL=1; }

# 2. oa-framework 10 子框架 smoke
echo "--- [2] oa-framework smoke (10 子框架) ---"
( cd packages/oa-framework && npx --no-install tsx test/smoke.ts ) \
  && echo "  OA_SMOKE_OK" || { echo "  OA_SMOKE_FAIL"; FAIL=1; }

# 3. OAB 跨包管線 (總線 + 5T 閘門 + 跨包聯通)
echo "--- [3] omni-agent-bus pnpm run test ---"
( cd packages/omni-agent-bus && pnpm run test ) \
  && echo "  OAB_OK" || { echo "  OAB_FAIL"; FAIL=1; }

# 4. CrewAI 真實執行 (若 venv 存在)
echo "--- [4] CrewAI 真實執行驗證 ---"
if [ -f packages/oa-framework/.venv-crewai/Scripts/python.exe ]; then
  ( cd packages/oa-framework && env PYTHONPATH= .venv-crewai/Scripts/python.exe verify_crewai.py ) \
    && echo "  CREWAI_OK" || { echo "  CREWAI_FAIL"; FAIL=1; }
else
  echo "  SKIP (venv 未建, 非阻塞)"
fi

if [ "$FAIL" -eq 0 ]; then
  echo "=== [OA Self-Check] 全綠 (閉環穩定態 OK) ==="
  exit 0
else
  echo "=== [OA Self-Check] 有失敗 (FAIL=$FAIL) ==="
  exit 1
fi
