# Swarm Checks (2026-08-09 修正 — 破除幻影指令)

## ⚠️ 重要更正
舊版本寫的 `agents-cli swarm start --agents=30` 是**幻影指令**，不存在於任何可驗證來源
（已驗證 `DingJun1028/esggo` v2.1.0、`DingJun1028/agents-cli` Google fork、Google `google-agents-cli`
皆無 `swarm start`）。本檔已重寫為真實可執行路線。

## 路線 C（已驗證可跑）：CrewAI OA-Team 30 crew
專案位置：`C:/Project/esggo-learning-center/oa-team-crewai`
驅動：本機 Ollama `gemma4:latest`（免費算立，不違反 only-free 約束）

### 結構驗證（不連網）
```bash
cd C:/Project/esggo-learning-center/oa-team-crewai
CREWAI_PY="$(cygpath -u 'C:/Users/dingj/AppData/Roaming/uv/tools/crewai/Scripts/python.exe')"
env -u PYTHONPATH OPENAI_API_KEY=dummy OPENAI_API_BASE=http://127.0.0.1:9 "$CREWAI_PY" -c \
  "from crewai.project import load_crew; from pathlib import Path; c,_=load_crew(Path('crew.jsonc')); assert len(c.agents)==30 and len(c.tasks)==5"
```
成功指標：`LOAD_CREW OK: agents=30 tasks=5`

### 實際執行（本機 Ollama 驅動）
```bash
cd C:/Project/esggo-learning-center/oa-team-crewai
CREWAI_PY="$(cygpath -u 'C:/Users/dingj/AppData/Roaming/uv/tools/crewai/Scripts/python.exe')"
env -u PYTHONPATH OPENAI_API_KEY=ollama-local-dummy "$CREWAI_PY" main.py "任務描述"
```
前提：Ollama 已常駐且 `ollama pull gemma4` 完成（http://localhost:11434/v1 可用）。

### 已知坑（本輪實證）
1. `crew.jsonc` 頂層不能寫 `llm`（unsupported field），必須在 **agent jsonc 層**加 `llm` 欄位。
2. `gen_agents.py` 已改為每個 agent 寫 `llm: {model: gemma4:latest, base_url: http://localhost:11434/v1}`。
3. 不能依賴 crewai 預設 `gpt-4.1-mini`（會 404），必須顯式 agent 級 llm。
4. agents jsonc 只能有標準欄位（role/goal/backstory/allow_delegation/llm/tools），自定欄位（soul_id/squad/tags）寫進 `//` 註解。

## 路線 A（新環境一次性演練）：Hermes delegate_task
真 primitive 是 `delegate_task`（每批最多 10 並行，跨批達 30）。
不持久，僅驗證 5T 協作流。成本較高，建議僅演練用。

## 路線 B（VPS-resident 持久運行）：swarm-orchestrator.py
寫真 orchestrator 腳本 + systemd，30 agent 角色契約固化，可持續運行。
參考：skill §5 / oa-components skill。

## Return protocol
報告時只給：`成功` 或 `失敗 + 錯誤訊息`。
不要請求截圖或完整 terminal dump。
