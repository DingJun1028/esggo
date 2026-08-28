#!/usr/bin/env python3
"""
CrewAI OA-Team 30 蜂群 — 結構驗證腳本 (不依賴網絡)
用法: python verify_structure.py
斷言: 30 agents / 5 tasks / 標準欄位 / load_crew 原生組裝成功。
【不】聲稱 LLM 推理已驗證 — 需可達端點才 kickoff 出真實產出。
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))


def strip_jsonc(p: Path) -> str:
    return "\n".join(
        ln for ln in p.read_text(encoding="utf-8").splitlines()
        if not ln.strip().startswith("//")
    )


def main():
    # 1. crew.jsonc 純結構
    crew = json.loads(strip_jsonc(ROOT / "crew.jsonc"))
    assert len(crew["agents"]) == 30, f"crew agents = {len(crew['agents'])}"
    assert len(crew["tasks"]) == 5, f"crew tasks = {len(crew['tasks'])}"
    for a in crew["agents"]:
        assert (ROOT / "agents" / f"{a}.jsonc").exists(), f"missing {a}.jsonc"

    # 2. 30 agent 檔案標準欄位
    af = sorted(f for f in os.listdir(ROOT / "agents") if f.endswith(".jsonc"))
    assert len(af) == 30, f"agent files = {len(af)}"
    for fn in af:
        c = json.loads(strip_jsonc(ROOT / "agents" / fn))
        for k in ("role", "goal", "backstory"):
            assert k in c, f"{fn} missing {k}"
        # 關鍵: load_crew 拒絕非標準欄位
        assert "soul_id" not in c and "squad" not in c and "tags" not in c, \
            f"{fn} 含非標準欄位 (soul_id/squad/tags) — load_crew 會拒"
        assert "tools" not in c or all(not t.startswith("custom:") for t in c.get("tools", [])), \
            f"{fn} 含未實作 custom tool — load_crew 會報 not found"

    print("✅ 純結構驗證通過:")
    print(f"   crew.jsonc: {len(crew['agents'])} agents / {len(crew['tasks'])} tasks")
    print(f"   agents/*.jsonc: {len(af)} 檔案 (標準欄位, 無非標準鍵/未實作工具)")

    # 3. load_crew 原生組裝 (需 crewai 已裝; 用快速失敗埠避免 DNS 卡死)
    try:
        from crewai.project import load_crew
        crew_obj, _ = load_crew(ROOT / "crew.jsonc")
        assert len(crew_obj.agents) == 30 and len(crew_obj.tasks) == 5
        print("✅ load_crew 原生組裝通過 (30 agents / 5 tasks)")
    except ImportError:
        print("⚠️ crewai 未安裝 — 跳過 load_crew (純結構驗證已通過)")
    except Exception as e:
        print(f"❌ load_crew 失敗: {e}")
        sys.exit(1)

    print("\n⚠️ 未含: 實際 LLM kickoff (需可達端點: 本機 Ollama / OpenRouter / 正確 Nous 域名)")


if __name__ == "__main__":
    main()
