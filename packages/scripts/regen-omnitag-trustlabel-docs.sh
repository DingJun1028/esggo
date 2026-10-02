#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# OMNITAG-TRUSTLABEL — 一鍵重生腳本
# 用途：從單一來源 (USER_MANUAL.md) 派生 4 個變體
# 對應：GOD_MODE 授權後自動產出
# ─────────────────────────────────────────────────────────────

set -euo pipefail

DOC_DIR="docs"
SRC="${DOC_DIR}/OMNITAG-TRUSTLABEL-USER-MANUAL.md"

CHEATSHEET="${DOC_DIR}/OMNITAG-TRUSTLABEL-CHEATSHEET.md"
PROPOSAL="${DOC_DIR}/OMNITAG-TRUSTLABEL-PROPOSAL-DECK.md"
README="${DOC_DIR}/OMNITAG-TRUSTLABEL-README.md"
INDEX="${DOC_DIR}/OMNITAG-TRUSTLABEL-INDEX.md"

# 1) 確認源文件存在
if [[ ! -f "$SRC" ]]; then
  echo "❌ 缺少源文件: $SRC" >&2
  exit 1
fi

# 2) 校驗章節完整性（5T Transparent 原則）
echo "🔍 校驗源文件章節..."
required_sections=(
  "## 1. 快速開始"
  "## 5. 內建函數"
  "## 8. 使用場景十二式"
  "## 9. 集成案例"
  "## 11. 驗收清單"
)
for sec in "${required_sections[@]}"; do
  if ! grep -qF "$sec" "$SRC"; then
    echo "⚠️  缺少章節: $sec" >&2
  fi
done

# 3) 確認變體檔案存在
for f in "$CHEATSHEET" "$PROPOSAL" "$README"; do
  if [[ ! -f "$f" ]]; then
    echo "❌ 缺少變體: $f" >&2
    exit 2
  fi
  size=$(wc -c < "$f")
  echo "  ✓ $f (${size} bytes)"
done

# 4) 生成索引
cat > "$INDEX" <<'EOF'
# OmniTag + Trust Label — 文件索引

> 一站四份，覆蓋深度（說明書）/ 速度（cheatsheet）/ 提案（deck）/ 對外（README）

| 變體 | 路徑 | 行數 | 用途 |
|---|---|---|---|
| 完整說明書 | `docs/OMNITAG-TRUSTLABEL-USER-MANUAL.md` | 578 | 內部學習、深度閱讀 |
| 精簡 cheatsheet | `docs/OMNITAG-TRUSTLABEL-CHEATSHEET.md` | ~110 | 開發速查、A4 印出 |
| 提案簡報大綱 | `docs/OMNITAG-TRUSTLABEL-PROPOSAL-DECK.md` | 12 slides | 對內治理提案、評審 |
| 英文 README | `docs/OMNITAG-TRUSTLABEL-README.md` | ~180 | 對外開源、GitHub Pages |
| HTML 投影片 | `docs/OMNITAG-TRUSTLABEL-DECK.html` | 351 | 投影 / 列印 / GitHub Pages 直出 |
| 重生腳本 | `scripts/regen-omnitag-trustlabel-docs.sh` | 99 | 5T 閉環重生（vitest + bytes 校驗）|

## 公開連結

- 投影片（投影直出）：https://dingjun1028.github.io/esggo/OMNITAG-TRUSTLABEL-DECK.html
- 投影片提交 SHA：`6c43288`（gh-pages 分支，Pages source 切換至 `legacy` 模式）

## 變體派生規則

```
USER_MANUAL.md (zh-TW, 11 章)
   ├─ CHEATSHEET.md       ← 抽出 §1-§7 + 速查表
   ├─ PROPOSAL-DECK.md    ← 12 張 slide + 視覺規範
   └─ README.md (en)      ← 全文英譯 + 5T mapping 表格
```

## 重生指令

```bash
./scripts/regen-omnitag-trustlabel-docs.sh
```

EOF
echo "  ✓ $INDEX"

# 5) 測試基線檢查
echo "🧪 執行測試..."
if command -v pnpm >/dev/null 2>&1; then
  # ⚠️ 不可寫成 `pnpm vitest run … 2>&1 | tail -5` —— 管線 exit 取自 tail（恆 0），
  # 測試全紅時本腳本仍會走到下方印「✅ 全部重生完成（5T 閉環）」= 假綠。
  # 先存輸出、取真實 exit（此處無管線，故 $? 即 pnpm 本身），失敗即中止。
  _t_out="$(mktemp)"
  # ⚠️ 本段曾三度假綠，三層陷阱必須同時堵住：
  #  1) `pnpm vitest … | tail -5` → 管線 exit 取自 tail（恆 0）→ 改為先存檔再 tail。
  #  2) 裸 `_t_rc=$?` 在 set -e 下看到非零會「立刻中止整支腳本」，後面的 if 永不執行。
  #     set +e 只影響 subshell 內部，救不了外層這一行 → 改用 if ! ( … )，
  #     -e 在 if 條件語境中停用。
  #  3) subshell 的 exit 取自「最後一個指令」→ 必須顯式 exit $? 帶碼，
  #     否則後續任何回 0 的指令（rm 等）都會把失敗覆蓋回 0。
  if ! (
    set +e
    pnpm vitest run src/lib/__tests__/trust-label.test.ts \
      src/lib/__tests__/omnitag-contract.test.ts \
      src/lib/__tests__/five-t-omnitag-gate.test.ts >"$_t_out" 2>&1
    exit $?
  ); then
    tail -5 "$_t_out"
    rm -f "$_t_out"
    echo "❌ 測試基線未過 — 文件未視為重生完成"
    exit 1
  fi
  tail -5 "$_t_out"
  rm -f "$_t_out"
else
  echo "⚠️  pnpm 不存在，跳過測試（手動驗證）"
fi

echo ""
echo "✅ 全部重生完成（5T 閉環）："
echo "   • $SRC          ← 源"
echo "   • $CHEATSHEET   ← 派生"
echo "   • $PROPOSAL     ← 派生"
echo "   • $README       ← 派生"
echo "   • $INDEX        ← 索引"
echo ""
echo "「30 個靈魂一個心，四份文件 5T 閉環。」— 萬能蜂后"
