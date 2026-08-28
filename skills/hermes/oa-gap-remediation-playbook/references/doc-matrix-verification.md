# 文檔枚舉矩陣驗證技法（通用抽取範本）

> 適用場景：soul.md / 聖典 / 規格書中任何「枚舉矩陣」（跨組配對、陣列歸屬、KPI、角色映射）
> 一經增修，須以程式實測驗證，不得以文字自證（對齊 oa-team-soul-canon 附錄 C.6）。
> 本範本由 OA-Team 30 蜂群缺口補齊五輪實證提煉，可直接抄用。

## 核心紀律

1. **單一真相源**：先定義權威編號歸屬表（如 §二 30 矩陣），驗證器只讀此表，不讀文檔敘述。
2. **退出碼即真相**：`sys.exit(0)` = 通過，`1` = 失敗；CI / cron 只認退出碼。
3. **格式混用必寬鬆**：配對行常混用 `編號 × 編號` 與 `編號 × 全陣列 / 陣列+陣列`，正則須兩者皆抓。
4. **欄位解包數對齊**：寬鬆正則抓到 3 欄（a, name, right），嚴格正則抓 4 欄（a, na, b, nb），不可混用。

## 最小可抄 Python 範本

```python
#!/usr/bin/env python3
"""verify_matrix.py — 文檔枚舉矩陣驗證（抄此骨架）"""
import re, sys
from pathlib import Path
from collections import Counter

SKILL = Path(__file__).resolve().parent.parent / "SKILL.md"

# 單一真相源：權威編號歸屬（依實際文檔替換）
SQUAD = {
    "01": "strategy", "02": "strategy", "03": "strategy", "04": "strategy",
    "05": "strategy", "06": "strategy",
    "07": "tech", "08": "tech", "09": "tech", "10": "tech", "11": "tech", "12": "tech",
    # ... 依 §二 全數列出 01-30
}

# 嚴格型：編號 × 編號
PAIR_RE = re.compile(r'(\d{2})\s+(\S+?)\s+×\s+(\d{2})\s+(\S+?)\s+→')
# 寬鬆型：編號 × (全陣列 | 陣列+陣列)
HUB_RE = re.compile(r'(\d{2})\s+(\S+?)\s+×\s+(.+?)\s+→')

def main() -> int:
    txt = SKILL.read_text(encoding="utf-8")
    # 切出目標章節區塊
    s = txt.index("### 4.1 跨組配對補齊")
    e = txt.index("### 4.2 跨組溝通協定")
    block = txt[s:e]

    base_block = block.split("#### 4.1.5")[0]
    base_pairs = PAIR_RE.findall(base_block)
    hub_block = block.split("#### 4.1.5")[1]
    p15 = hub_block.split("#### 4.1.6")[0]
    p15_pairs = HUB_RE.findall(p15)
    p15_valid = [p for p in p15_pairs if SQUAD.get(p[0]) == "guard"]  # 依實際過濾

    errors = []
    # 基礎：陣列對覆蓋 + 零越界
    base_ps = Counter()
    for a, na, b, nb in base_pairs:
        if a == b: errors.append(f"同編號自配對: {a}")
        if SQUAD[a] == SQUAD[b]: errors.append(f"陣列越界: {a}({SQUAD[a]})×{b}({SQUAD[b]})")
        base_ps[tuple(sorted([SQUAD[a], SQUAD[b]]))] += 1
    # 預期 10 陣列對各 6 組
    for pair, cnt in base_ps.items():
        if cnt != 6: errors.append(f"陣列對 {pair} = {cnt} (期望 6)")

    if errors:
        print("[FAIL]")
        for e in errors: print(f"  - {e}")
        return 1
    print("[PASS] 矩陣驗證通過 ✓")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## Windows git-bash 路徑坑（已實證，必讀）

| 寫法 | 結果 | 結論 |
| --- | --- | --- |
| `cd "$(dirname "$0")/.."` | `C:\c\Users\...` 找不到檔 | ✗ 避用 |
| `readlink -f "$0"` | 同上雙重轉換 | ✗ 避用 |
| 硬編碼 `C:/Users/dingj/...` 原生格式 | Python 直讀成功 | ✓ 採用 |
| `execute_code` 內 `pathlib` 直讀 | 成功（繞開終端機 cwd 楔死） | ✓ 採用 |

**通用解法**：驗證腳本若需在 Windows git-bash 跑，bash 入口直接硬編碼 Hermes 技能固定安裝路徑（如 `C:/Users/dingj/AppData/Local/hermes/skills/...`），或改用 `execute_code` 的 Python `pathlib` 直讀，避開 MSYS `/c/` 轉換。

## 正則陷阱清單（已實證）

1. **格式混用漏算**：僅認 `編號×編號` 會漏掉 `編號×全陣列`（如 `27 安全蜂 × 全陣列`）。→ 用 `HUB_RE` 寬鬆型抓 §4.1.5，再依左側編號所屬陣列過濾。
2. **重複函數定義**：`extract()` 定義兩次會導致後者覆蓋前者，靜默失效。→ 每函數唯一定義。
3. **解包欄位錯配**：`HUB_RE` 回 3 欄卻用 `for a, na, b, nb` 解包 → `ValueError`。→ 寬鬆型用 `a, na, right`，嚴格型用 `a, na, b, nb`。
4. **JSONC 註解**：驗證 `.jsonc` 前須先剝離 `//` 註解行，否則 `json.loads` 報錯。→ `line[:line.find("//")]`。
5. **squad 正則**：`squad: (\w+)` 抓不到 `"squad": "strategy"`。→ 用 `\"squad\":\s*\"(\w+)\"`。

## 三閘合一入口範本（bash）

```bash
#!/usr/bin/env bash
set -u
SKILL_DIR="C:/Users/dingj/AppData/Local/hermes/skills/autonomous-ai-agents/oa-team-soul-canon"
PASS=0; FAIL=0
run() { local n="$1"; shift; echo "▶ $n"; if "$@"; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); fi; }
run "A 驗證" python3 "$SKILL_DIR/scripts/verify_a.py"
run "B 驗證" python3 "$SKILL_DIR/scripts/verify_b.py"
echo "結果：通過 $PASS / 失敗 $FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
```

## 驗收清單

- [ ] 單一真相源表已定義（編號→陣列）
- [ ] 嚴格 + 寬鬆正則皆就位
- [ ] 陣列對覆蓋數、成員觸達數、零越界皆斷言
- [ ] 退出碼 0/1 正確
- [ ] Windows git-bash 路徑坑已規避（硬編碼或 pathlib）
- [ ] `bash verify_all.sh` 實測 EXIT=0
