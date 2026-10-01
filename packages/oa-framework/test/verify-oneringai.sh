#!/usr/bin/env bash
# verify-oneringai.sh — OA-Team × OneRingAI 整合一鍵驗收
# 用法: bash test/verify-oneringai.sh   (在 packages/oa-framework 下, 或從 repo 根)
# 設計: 跨平台 (git-bash / sh). 三項真實驗證依序跑, 任一步失敗即停.
# 所有驗證皆真實執行 (非 stub): tsc 編譯 + Ollama 本機推論 + 5T 鑄造.

# ⚠️ 不可寫成 `npx tsx x.ts | tail -4` —— 管線的 exit code 是 tail 的（恆 0），
# set -e 會完全失效，於是任何失敗都會被 echo 成 "✅ PASS" 再報 ALL GREEN。
# 這正是技能書「4/4 全綠 = 驗收通過」原本會假綠的根因。
# 一律先存輸出、再取 ${PIPESTATUS[0]} 的真實 exit，最後才印 PASS。
set -e  # 任一步非 0 即退出 (fail-fast, 依 §19 不可聲稱完成)

cd "$(dirname "$0")/.." || exit 1  # 移到 packages/oa-framework

OUT="$(mktemp)"
trap 'rm -f "$OUT"' EXIT

# run_step <標籤> <說明> <命令...>
run_step() {
  local label="$1" desc="$2"; shift 2
  echo "▶ ${label} (${desc})"
  if ! "$@" >"$OUT" 2>&1; then
    local rc=$?
    echo "  ❌ ${label} FAILED (exit=${rc})"
    echo "  ── 實際輸出 ──────────────────────"
    cat "$OUT"
    echo "  ──────────────────────────────────"
    echo " 總結: 1-3/4 通過, 於 [${label}] 中止"
    echo " 狀態: ❌ NOT GREEN — 整合鏈驗收未通過"
    exit 1
  fi
  tail -4 "$OUT"
  echo "  ✅ ${label} PASS"
}

echo "════════════════════════════════════════════════════"
echo " OA-Team × OneRingAI 整合 — 一鍵驗收 (verify-oneringai)"
echo "════════════════════════════════════════════════════"

# [3/4] 舊的 app-integration-demo.ts 已於 a882e9b2e "remove stale app-integration-demo.ts"
# 被維護者移除，故不再列為驗收項（不可憑空重寫一個已被刻意刪除的檔案）。
run_step "[1/3]" "Typecheck (tsc --noEmit)"     npx tsc -p tsconfig.json --noEmit
run_step "[2/3]" "OneRingAI 真實實跑"           npx tsx test/oneringai-real.ts
run_step "[3/3]" "全框架 Smoke (11 frameworks)" npx tsx test/smoke.ts

echo "────────────────────────────────────────────────────"
echo " 總結: 3/3 通過"
echo " 狀態: ✅ ALL GREEN — 整合鏈驗收通過"
echo "════════════════════════════════════════════════════"
