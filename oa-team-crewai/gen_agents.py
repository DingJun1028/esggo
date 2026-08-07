#!/usr/bin/env python3
"""批量生成 OA-Team 30 萬能蜂群 agent 定義 (對應 soul.md 30 Souls Matrix)"""
import json
import os

AGENTS_DIR = os.path.join(os.path.dirname(__file__), "agents")
os.makedirs(AGENTS_DIR, exist_ok=True)

# 5 大陣列定義 (來自 soul.md)
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
        "goal_tmpl": "鑄造全端雙向 TypeScript 型別安全 API 介面與 ZKP 隱私屏障 (編號 {n})",
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

LLM = "tencent/hy3:free"

count = 0
for squad in SWARM:
    for n in range(squad["range"][0], squad["range"][1] + 1):
        # 只輸出 CrewAI 標準欄位 (tools/soul_id/squad/tags 寫進註解行)
        # llm 不硬編碼: 交由 OPENAI_MODEL_NAME / OPENAI_API_BASE 環境驅動
        #   - 本地: OPENAI_MODEL_NAME=tencent/hy3:free + OPENAI_API_BASE=Nous
        #   - AMP/CI: CREWAI_API_KEY 注入為 OPENAI_API_KEY (CrewAI managed 或 OpenAI)
        agent = {
            "role": squad["role_tmpl"].format(n=n),
            "goal": squad["goal_tmpl"].format(n=n),
            "backstory": squad["backstory"],
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
