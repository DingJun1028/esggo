#!/usr/bin/env python3
"""
verify_gap_matrix.py — 稽核 oa-team-soul-canon §四「缺口補齊」配對矩陣

單一真相源：§二 30 矩陣編號歸屬
  策略 01-06 / 技術 07-12 / 創意 13-18 / 營銷 19-24 / 守衛 25-30

稽核項目：
  1. 基礎配對（§4.1.1~4.1.4）：編號×編號，共 10 陣列對 × 6 = 60 組
  2. 樞紐配對（§4.1.5 守衛防護 6 + §4.1.6 蜂后總控 6）= 12 組
  3. 陣列對覆蓋：10/10（C(5,2)）
  4. 成員跨組觸達：30/30（每成員基礎配對 ≥4 跨陣列出現）
  5. 零陣列越界（同陣列自配對）、零同編號自配對

退出碼：0 = 全數通過，1 = 有缺失
"""
import re
import sys
from pathlib import Path
from collections import Counter

SKILL = Path(__file__).resolve().parent.parent / "SKILL.md"

# ── 單一真相源：§二 矩陣編號歸屬 ──
SQUAD = {}
NAMES = {
    "01": "蜂后", "02": "規劃", "03": "分析", "04": "策効", "05": "風險", "06": "優化",
    "07": "編碼", "08": "算法", "09": "架構", "10": "數據", "11": "測試", "12": "設計",
    "13": "圖像", "14": "動畫", "15": "文案", "16": "音頻", "17": "市場", "18": "社群",
    "19": "增長", "20": "運營", "21": "商業分析", "22": "探路", "23": "外交", "24": "調研",
    "25": "測場", "26": "追蹤", "27": "安全", "28": "維護", "29": "支援", "30": "質控",
}
for n in range(1, 31):
    k = f"{n:02d}"
    SQUAD[k] = ("策略" if n <= 6 else "技術" if n <= 12 else
                "創意" if n <= 18 else "營銷" if n <= 24 else "守衛")

PAIR_RE = re.compile(r'(\d{2})\s+(\S+?)\s+×\s+(\d{2})\s+(\S+?)\s+→')
FULL_RE = re.compile(r'(\d{2})\s+(\S+?)\s+×\s+全陣列\s+→')
# §4.1.5 寬鬆型：編號 × (全陣列 | 陣列+陣列)
HUB_RE = re.compile(r'(\d{2})\s+(\S+?)\s+×\s+(.+?)\s+→')


def extract(block: str):
    return PAIR_RE.findall(block), FULL_RE.findall(block)


def main() -> int:
    if not SKILL.exists():
        print(f"[FAIL] 找不到 {SKILL}")
        return 1
    lines = SKILL.read_text(encoding="utf-8").splitlines()
    txt = "\n".join(lines)

    # §4.1 區塊
    s = txt.index("### 4.1 跨組配對補齊")
    e = txt.index("### 4.2 跨組溝通協定")
    block = txt[s:e]

    # 基礎配對（§4.1.1~4.1.4，排除樞紐章節）
    base_block = block.split("#### 4.1.5")[0]
    base_pairs, _ = extract(base_block)

    # 樞紐：§4.1.5（守衛組 × 全陣列/多陣列）+ §4.1.6（蜂后 × 編號）
    hub_block = block.split("#### 4.1.5")[1]
    p15 = hub_block.split("#### 4.1.6")[0]
    p16 = hub_block.split("#### 4.1.6")[1].split("#### 4.1.7")[0]
    # §4.1.5 守衛樞紐：計「編號 × (全陣列 | 陣列+陣列)」型，凡守衛組出現即計
    p15_pairs = HUB_RE.findall(p15)
    p15_valid = [p for p in p15_pairs if SQUAD.get(p[0]) == "守衛"]
    p16_pairs, _ = extract(p16)

    errors = []
    seen_base = set()

    # ── 基礎配對稽核 ──
    for a, na, b, nb in base_pairs:
        seen_base.add(a); seen_base.add(b)
        if a == b:
            errors.append(f"同編號自配對: {a}")
        if SQUAD[a] == SQUAD[b]:
            errors.append(f"陣列越界: {a}{na}({SQUAD[a]})×{b}{nb}({SQUAD[b]})")
        if a not in SQUAD or b not in SQUAD:
            errors.append(f"編號超範圍: {a}/{b}")

    base_ps = Counter()
    for a, na, b, nb in base_pairs:
        base_ps[tuple(sorted([SQUAD[a], SQUAD[b]]))] += 1

    # ── 樞紐配對稽核 ──
    # §4.1.5 應有 6 組守衛樞紐
    if len(p15_valid) != 6:
        errors.append(f"§4.1.5 守衛防護樞紐應 6 組，實得 {len(p15_valid)}")
    # §4.1.6 應有 6 組編號型
    if len(p16_pairs) != 6:
        errors.append(f"§4.1.6 蜂后總控樞紐應 6 組，實得 {len(p16_pairs)}")
    for a, na, b, nb in p16_pairs:
        if SQUAD[a] == SQUAD[b]:
            errors.append(f"樞紐越界: {a}{na}({SQUAD[a]})×{b}{nb}({SQUAD[b]})")
    for a, na, right in p15_valid:
        if SQUAD.get(a) != "守衛":
            errors.append(f"§4.1.5 非守衛樞紐: {a}{na}")

    total = len(base_pairs) + len(p15_valid) + len(p16_pairs)

    # ── 陣列對覆蓋 ──
    cross = {k for k in base_ps if k[0] != k[1]}
    array_cov = len(cross)

    # ── 成員觸達 ──
    cnt = Counter()
    for a, na, b, nb in base_pairs:
        cnt[a] += 1; cnt[b] += 1
    missing = [f"{k:02d}{NAMES[k]}" for k in range(1, 31) if f"{k:02d}" not in seen_base]
    low = [f"{k:02d}{NAMES[k]}({cnt[f'{k:02d}']})" for k in range(1, 31) if cnt[f"{k:02d}"] < 4]

    # ── 報告 ──
    print("=" * 56)
    print(" OA-Team 30 蜂群 · §四 缺口補齊矩陣稽核")
    print("=" * 56)
    print(f" 基礎配對 (§4.1.1~4.1.4): {len(base_pairs)} 組 (預期 60)")
    print(f" 樞紐配對 (§4.1.5 守衛): {len(p15_valid)} 組 (預期 6)")
    print(f" 樞紐配對 (§4.1.6 蜂后):   {len(p16_pairs)} 組 (預期 6)")
    print(f" 配對總數: {total} (預期 72)")
    print(f" 陣列對覆蓋: {array_cov}/10")
    print(f" 成員跨組觸達: {len(seen_base)}/30")
    print("-" * 56)
    print(" 基礎陣列對分佈:")
    for k, v in sorted(base_ps.items()):
        tag = "✓" if (k[0] != k[1] and v == 6) else "✗"
        print(f"   {k[0]}×{k[1]}: {v} {tag}")
    print("-" * 56)

    if errors:
        print("[FAIL] 發現以下問題:")
        for er in errors:
            print(f"   ✗ {er}")
    if missing:
        print(f"   ✗ 未觸達成員: {missing}")
    if low:
        print(f"   ✗ 配對數偏低(<4): {low}")

    ok = (not errors and not missing and not low
          and len(base_pairs) == 60 and total == 72
          and array_cov == 10 and len(seen_base) == 30)

    print("=" * 56)
    if ok:
        print("[PASS] §四 缺口補齊矩陣全數通過 ✓")
        print("        60 基礎 + 12 樞紐 = 72 組 | 10/10 陣列對 | 30/30 觸達")
        return 0
    print("[FAIL] 稽核未通過")
    return 1


if __name__ == "__main__":
    sys.exit(main())
