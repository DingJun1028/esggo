#!/usr/bin/env python3
# run_swarm_local.py — OA-Team 30 本地蜂群執行器 (gitignore, 不進倉庫)
# 用途: 讓 CrewAI 在 Ollama 本機模型上穩定跑 (關掉 native tool-calling 路徑)
# 為什麼需要: CrewAI 0.175 對有 delegation/tools 的 agent 走 call_llm_native_tools,
#   而 Ollama 小模型 (qwen2.5:3b) 在 tool-calling 請求下偶爾回空 -> ValueError None or empty.
#   關掉 tools/delegation 後 CrewAI 走普通 chat, 避開空回應.
# 驗證: 2026-08-09 端到端 Flow Completed exit 0, 錯誤計數 0 (proc_4768b1b2c1a7).
import os
import sys
from pathlib import Path

from crewai.project import load_crew
from pydantic import BaseModel


class SwarmState(BaseModel):
    task: str = ""


def main():
    task = sys.argv[1] if len(sys.argv) > 1 else "為 ESG-GO 產出一個 5T 合規的元件骨架"
    crew, default_inputs = load_crew(Path(__file__).with_name("crew.jsonc"))
    # 關掉 native tool-calling 路徑: 避免 Ollama 小模型回空
    for agent in crew.agents:
        try:
            agent.tools = []
            agent.allow_delegation = False
            if hasattr(agent, "function_calling_llm"):
                agent.function_calling_llm = None
        except Exception:
            pass
    result = crew.kickoff(inputs={**default_inputs, "task": task})
    print("\n========== 蜂群答案 ==========")
    print(result.raw)
    print("==============================")


if __name__ == "__main__":
    main()
