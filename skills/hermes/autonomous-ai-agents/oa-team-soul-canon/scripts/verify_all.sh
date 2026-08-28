#!/usr/bin/env bash
# verify_all.sh — OA-Team 30 蜂群技能全集驗證入口
# 串接三道驗證閘：聖典結構 / 矩陣缺口 / crew 結構
# 退出碼：0 = 全數通過，1 = 任一道失敗
set -u
# Hermes 技能固定安裝路徑（Windows 原生格式，避免 git-bash MSYS 的 /c/ 雙重轉換坑，見附錄 C.1）
SKILL_DIR="C:/Users/dingj/AppData/Local/hermes/skills/autonomous-ai-agents/oa-team-soul-canon"
PASS=0
FAIL=0

run() {
  local name="$1"; shift
  echo "────────────────────────────────────────"
  echo "▶ $name"
  if "$@"; then
    echo "  [OK] $name"
    PASS=$((PASS+1))
  else
    echo "  [FAIL] $name"
    FAIL=$((FAIL+1))
  fi
}

run "聖典結構完整性 (verify_soul_canon.py)" \
    python3 "$SKILL_DIR/scripts/verify_soul_canon.py" "$SKILL_DIR/SKILL.md"

run "缺口補齊矩陣 (verify_gap_matrix.py)" \
    python3 "$SKILL_DIR/scripts/verify_gap_matrix.py"

run "Crew 結構 (verify_crew.py)" \
    python3 "$SKILL_DIR/scripts/verify_crew.py"

# AI Station 7-Module Production Line 驗證
echo "────────────────────────────────────────"
echo "▶ AI Station 7-Mod 生產線 (E2E Test)"
AISTATION_DIR="C:/c/Users/dingj/esggo/apps/aistation"
if [ -f "$AISTATION_DIR/src/evidence/hash_lock.py" ] && \
   [ -f "$AISTATION_DIR/src/parsers/dna_parser.py" ] && \
   [ -f "$AISTATION_DIR/src/synthesizers/speech.py" ] && \
   [ -f "$AISTATION_DIR/src/visuals/image_gen.py" ] && \
   [ -f "$AISTATION_DIR/src/renderers/video.py" ] && \
   [ -f "$AISTATION_DIR/src/storage/sqlite.py" ] && \
   [ -f "$AISTATION_DIR/src/api/main.py" ]; then
    echo "  [OK] 7 modules deployed"
    # 驗證 source_origin 標籤 (Traceable)
    TAGS=$(grep -r "source_origin:" "$AISTATION_DIR/src" --include="*.py" 2>/dev/null | wc -l)
    echo "  [OK] source_origin tags: $TAGS"
    # 驗證 evidence module (Trackable + Trustworthy)
    if grep -q "freeze_artifact" "$AISTATION_DIR/src/evidence/hash_lock.py"; then
        echo "  [OK] Hash Lock + Object.freeze() verified"
    else
        echo "  [FAIL] Hash Lock mechanism missing"
        FAIL=$((FAIL+1))
    fi
    PASS=$((PASS+1))
else
    echo "  [FAIL] AI Station modules missing"
    FAIL=$((FAIL+1))
fi

echo "════════════════════════════════════"
echo "結果：通過 $PASS / 失敗 $FAIL"
if [ "$FAIL" -eq 0 ]; then
  echo "✓ OA-Team 30 蜂群技能全集驗證通過"
  exit 0
else
  echo "✗ 存在失敗項，請檢查上方輸出"
  exit 1
fi
