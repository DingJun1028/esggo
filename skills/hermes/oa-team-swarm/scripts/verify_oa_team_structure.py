#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify_oa_team_structure.py — OA-Team 30 蜂群結構驗證 (不依賴網絡)

驗證:
  - crew.jsonc 存在且含 30 agents / 5 tasks
  - agents/*.jsonc 30 個檔案, 每個含 role/goal/backstory
  - 每個 agent 含 llm 欄位 (避免 crewai 預設 gpt-4.1-mini 404)
  - 用 load_crew 實際組裝 (快速失敗埠避免 DNS 卡死)

用法:
  python3 verify_oa_team_structure.py [--crew-dir .]
"""
import argparse
import json
import os
import sys
from pathlib import Path


def strip_jsonc(text: str) -> str:
    """移除 // 註解行, 回傳純 JSON 字串"""
    lines = []
    for line in text.splitlines():
        if line.strip().startswith("//"):
            continue
        lines.append(line)
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--crew-dir", default=".")
    args = ap.parse_args()
    crew_dir = Path(args.crew_dir)
    crew_file = crew_dir / "crew.jsonc"
    agents_dir = crew_dir / "agents"

    errors = []

    # 1. crew.jsonc
    if not crew_file.exists():
        errors.append(f"缺失 crew.jsonc: {crew_file}")
        _report(errors)
        return 1

    raw = strip_jsonc(crew_file.read_text(encoding="utf-8"))
    crew = json.loads(raw)
    agents_ref = crew.get("agents", [])
    tasks = crew.get("tasks", [])
    if len(agents_ref) != 30:
        errors.append(f"crew.jsonc agents 陣列應有 30, 實際 {len(agents_ref)}")
    if len(tasks) != 5:
        errors.append(f"crew.jsonc tasks 應有 5, 實際 {len(tasks)}")

    # 2. agents/*.jsonc
    agent_files = sorted(agents_dir.glob("*.jsonc")) if agents_dir.exists() else []
    if len(agent_files) != 30:
        errors.append(f"agents/ 應有 30 個 jsonc, 實際 {len(agent_files)}")
    for af in agent_files:
        try:
            a = json.loads(strip_jsonc(af.read_text(encoding="utf-8")))
        except Exception as e:
            errors.append(f"{af.name}: JSON 解析失敗 {e}")
            continue
        for field in ("role", "goal", "backstory"):
            if field not in a:
                errors.append(f"{af.name}: 缺標準欄位 {field}")
        if "llm" not in a:
            errors.append(f"{af.name}: 缺 llm 欄位 (將導致 crewai 用預設 gpt-4.1-mini 404)")

    # 3. load_crew 實際組裝
    try:
        from crewai.project import load_crew
        c, _ = load_crew(crew_file)
        if len(c.agents) != 30:
            errors.append(f"load_crew 組裝後 agents={len(c.agents)} (應 30)")
        if len(c.tasks) != 5:
            errors.append(f"load_crew 組裝後 tasks={len(c.tasks)} (應 5)")
    except Exception as e:
        errors.append(f"load_crew 失敗: {e}")

    _report(errors)
    return 1 if errors else 0


def _report(errors):
    if errors:
        print(f"❌ 驗證失敗 ({len(errors)} 項):")
        for e in errors:
            print(f"  - {e}")
    else:
        print("✅ OA-Team 30 結構驗證通過: 30 agents / 5 tasks / 全含 llm")


if __name__ == "__main__":
    sys.exit(main())
