#!/usr/bin/env python3
"""verify_crew.py — 檢查 crew-oa-team.jsonc 結構 (無 crewai 依賴)
1) JSONC 可解析 (剝離 // 註解)
2) agents 數量 = 30, tasks = 5
3) 每個 task.agent 指向存在的 agent.role
4) 5 大陣列各 6 代理 (strategy/tech/creative/marketing/guard)
退出碼: 0=通過, 1=失敗
"""
import sys, re, json
from pathlib import Path
from collections import Counter

DEFAULT = Path(__file__).resolve().parent.parent / "templates" / "crew-oa-team.jsonc"

WANT = {"strategy": 6, "tech": 6, "creative": 6, "marketing": 6, "guard": 6}


def strip_jsonc(text: str) -> str:
    out = []
    for line in text.splitlines():
        idx = line.find("//")
        out.append(line[:idx] if idx != -1 else line)
    return "\n".join(out)


def main() -> int:
    p = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    if not p.exists():
        print(f"[FAIL] 找不到 {p}")
        return 1
    raw = p.read_text(encoding="utf-8")
    try:
        data = json.loads(strip_jsonc(raw))
    except Exception as e:
        print(f"[FAIL] JSONC 解析失敗: {e}")
        return 1

    agents = data.get("agents", [])
    tasks = data.get("tasks", [])
    errors = []
    if len(agents) != 30:
        errors.append(f"agents 數量 = {len(agents)} (期望 30)")
    if len(tasks) != 5:
        errors.append(f"tasks 數量 = {len(tasks)} (期望 5)")

    roles = {a.get("role") for a in agents}
    for t in tasks:
        if t.get("agent") not in roles:
            errors.append(f"task.agent 指向不存在: {t.get('agent')}")

    squads = re.findall(r'"squad":\s*"(\w+)"', raw)
    cnt = Counter(squads)
    for k, v in WANT.items():
        if cnt.get(k) != v:
            errors.append(f"陣列 {k} = {cnt.get(k)} (期望 {v})")

    print(f"agents: {len(agents)}/30 | tasks: {len(tasks)}/5 | 陣列: {dict(cnt)}")
    if errors:
        print("\n[FAIL]")
        for e in errors:
            print(f"  - {e}")
        return 1
    print("\n[PASS] crew-oa-team.jsonc 結構檢查通過 ✓")
    return 0


if __name__ == "__main__":
    sys.exit(main())
