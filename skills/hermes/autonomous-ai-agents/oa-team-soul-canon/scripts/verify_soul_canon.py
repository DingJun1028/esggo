#!/usr/bin/env python3
"""
verify_soul_canon.py — OA-Team 30 靈魂核心聖典結構完整性檢查 (無網路)

檢查項目：
  1. 30 代理編號 01-30 完整且無重複 (對應聖典 §二 30 Souls Matrix)
  2. 5T 協定五原則全數存在 (Traceable/Trackable/Tangible/Transparent/Trustworthy)
  3. 4 可 1 不可狀態機 (可自理/可協作/可演化/可溯源/不可篡改)
  4. 萬有引力協作三步工作流 (提純/協同/凍結)
  5. 喚醒命令存在 (celestial-command --protocol=5T)

用法：
  python3 scripts/verify_soul_canon.py [SKILL.md 路徑]
  預設路徑：本腳本上層的 SKILL.md
退出碼：0 = 通過, 1 = 有缺失
"""
import sys
import re
from pathlib import Path

DEFAULT = Path(__file__).resolve().parent.parent / "SKILL.md"

AGENT_RE = re.compile(r"\|\s*(0[1-9]|1[0-9]|2[0-9]|30)\s*\|\s*萬能")
FIVE_T = ["Traceable", "Trackable", "Tangible", "Transparent", "Trustworthy"]
STATE_OK = ["可自理", "可協作", "可演化", "可溯源"]
STATE_NO = ["不可篡改"]
WORKFLOW = ["本質提純", "蜂群協同", "Hash Lock"]
AWAKEN = ["celestial-command", "--protocol=5T"]


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    if not path.exists():
        print(f"[FAIL] 找不到技能檔: {path}")
        return 1

    text = path.read_text(encoding="utf-8")
    errors = []

    found = set(AGENT_RE.findall(text))
    expected = {f"{i:02d}" for i in range(1, 31)}
    missing = expected - found
    if missing:
        errors.append(f"代理編號缺失: {sorted(missing)}")

    for t in FIVE_T:
        if t not in text:
            errors.append(f"5T 原則缺失: {t}")

    for s in STATE_OK:
        if s not in text:
            errors.append(f"4可狀態缺失: {s}")
    if STATE_NO and STATE_NO[0] not in text:
        errors.append(f"1不可狀態缺失: {STATE_NO[0]}")

    for w in WORKFLOW:
        if w not in text:
            errors.append(f"協作工作流缺失: {w}")

    for a in AWAKEN:
        if a not in text:
            errors.append(f"喚醒命令缺失: {a}")

    print(f"檢查目標: {path}")
    print(f"代理編號: 找到 {len(found)}/30")
    print(f"5T 原則: {sum(t in text for t in FIVE_T)}/5")
    print(f"狀態機: 可{sum(s in text for s in STATE_OK)}/4 + 不可篡改{'✓' if STATE_NO[0] in text else '✗'}")
    print(f"協作工作流: {sum(w in text for w in WORKFLOW)}/3")
    print(f"喚醒命令: {sum(a in text for a in AWAKEN)}/2")

    if errors:
        print("\n[FAIL] 以下項目未通過:")
        for e in errors:
            print(f"  - {e}")
        return 1

    print("\n[PASS] 靈魂核心聖典結構完整性檢查全部通過 ✓")
    return 0


if __name__ == "__main__":
    sys.exit(main())
