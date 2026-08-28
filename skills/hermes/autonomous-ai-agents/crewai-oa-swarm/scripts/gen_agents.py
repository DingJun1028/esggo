#!/usr/bin/env python3
"""批量生成 OA-Team 30 萬能蜂群 agent 定義 (對應 soul.md 30 Souls Matrix)。

用法:
    python gen_agents.py
產出 agents/*.jsonc（30 個，CrewAI 標準欄位 + 元數據寫入 // 註解行）。

注意：CrewAI JSON-first 不允許 agent JSONC 含 soul_id/squad/tags/tools 等非標準欄位，
否則 load_crew 報 JSONProjectValidationError。這些元數據放在 // 註解行。
"""
import json
import os

AGENTS_DIR = os.path.join(os.path.dirname(__file__), "agents")
os.makedirs(AGENTS_DIR, exist_ok=True)

SWARM = [
    {
        "prefix": "sage", "range": (1, 6), "team": "智庫聖所小隊",
        "tags": ["#記憶聖所", "#全知之眼"],
        "role_tmpl": "智庫聖所 · 記憶召喚師 (Agent {n})",
        "goal_tmpl": "維護長短期記憶召回率 >95%，提純任務本質脈絡 (編號 {n})",
        "backstory": "OA-Team 30 蜂群的記憶中樞。負責向量知識沉澱與脈絡提純。",
        "tools": ["custom:memory_recall", "custom:vector_search"],
    },
    {
        "prefix": "rune", "range": (7, 12), "team": "符文契約小隊",
        "tags": ["#神聖契約", "#雙向TS"],
        "role_tmpl": "符文契約 · 型別鑄造師 (Agent {n})",
        "goal_tmpl": "鑄造全端雙向 TypeScript 型別安全 API 介面與 ZKP 屏障 (編號 {n})",
        "backstory": "OA-Team 的契約中樞。負責 API 介面鑄造與 5T 溯源標頭內聯。",
        "tools": ["custom:ts_codegen", "custom:zkp_proof"],
    },
    {
        "prefix": "wing", "range": (13, 18), "team": "光之羽翼小隊",
        "tags": ["#光之羽翼", "#自主代行"],
        "role_tmpl": "光之羽翼 · 自主代行師 (Agent {n})",
        "goal_tmpl": "執行自動化背景 Task、ADK 多代理調度與前端 Bento Box 組件渲染 (編號 {n})",
        "backstory": "OA-Team 的執行中樞。負責非同步任務調度與即時 UI 回饋。",
        "tools": ["custom:task_scheduler", "custom:bento_render"],
    },
    {
        "prefix": "forge", "range": (19, 24), "team": "煉金熵減小隊",
        "tags": ["#原罪煉金", "#熵減寶石"],
        "role_tmpl": "煉金熵減 · 重構優化師 (Agent {n})",
        "goal_tmpl": "執行重構、代碼熵值優化 (每週 -3%)、CI/CD Pipeline (編號 {n})",
        "backstory": "OA-Team 的煉金中樞。負責技術債消除與效能 Monitoring。",
        "tools": ["custom:refactor", "custom:ci_pipeline"],
    },
    {
        "prefix": "verify", "range": (25, 30), "team": "5T 驗算小隊",
        "tags": ["#零幻覺", "#HashLock"],
        "role_tmpl": "5T 驗算 · 零幻覺守門師 (Agent {n})",
        "goal_tmpl": "執行 ISO 規範驗算、Hash Lock 加密鎖定與 UUID 發放 (編號 {n})",
        "backstory": "OA-Team 的信任中樞。負責零幻覺驗證與不可篡改刻印。",
        "tools": ["custom:hash_lock", "custom:iso_verify"],
    },
]

LLM = "openai/tencent/hy3:free"

count = 0
for squad in SWARM:
    for n in range(squad["range"][0], squad["range"][1] + 1):
        agent = {
            "role": squad["role_tmpl"].format(n=n),
            "goal": squad["goal_tmpl"].format(n=n),
            "backstory": squad["backstory"],
            "llm": LLM,
            "allow_delegation": True,
        }
        fname = os.path.join(AGENTS_DIR, f"{squad['prefix']}_{n:02d}.jsonc")
        header = (
            f"// {squad['team']} — {squad['role_tmpl'].format(n=n)}\n"
            f"// soul_id: OA-{n:02d} | tags: {', '.join(squad['tags'])}\n"
            f"// tools: {', '.join(squad['tools'])}\n"
        )
        with open(fname, "w", encoding="utf-8") as f:
            f.write(header + json.dumps(agent, indent=2, ensure_ascii=False) + "\n")
        count += 1

print(f"✅ 生成 {count} 個 agent 定義到 {AGENTS_DIR}")
