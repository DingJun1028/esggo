# CrewAI + Ollama 本機蜂群 — 實證細節

## 模型選擇（本機已裝）
| 模型 | 型態 | CrewAI 相容 | 備註 |
|------|------|------------|------|
| `gemma4:latest` (8B) | **reasoning** | ❌ content 空 | 答案在 `reasoning` 欄；8B CPU 推理壓垮 Ollama |
| `qwen2.5:3b-instruct-q4_K_M` | 一般 instruct | ✅ | 本輪蜂群實際跑通用此；非 reasoning、輕量 |
| `nomic-embed-text` | embedding | n/a | 記憶用，非 chat |

## 報錯 traceback 特徵
```
File ".../crewai/utilities/agent_utils.py", line 537, in _validate_and_finalize_llm_response
    raise ValueError("Invalid response from LLM call - None or empty.")
```
出在 `call_llm_native_tools` → 兩種成因：(a) reasoning 模型 content 空；(b) 有 delegation/tools 的 agent 走 native tool-calling 路徑，Ollama 回 `tool_calls: None` 被當空。

## 驗證命令（本輪用過，均通過）
```bash
# 1. 結構
python verify_oa_team_structure.py --crew-dir .
# 2. Ollama 活著 (用 /api/tags 非 /api/health)
curl -sf http://localhost:11434/api/tags | python3 -c "import sys,json;print([m['name'] for m in json.load(sys.stdin)['models']])"
# 3. 直接打 OpenAI 端點確認 content 非空
curl -s -m 60 http://localhost:11434/v1/chat/completions -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:3b-instruct-q4_K_M","messages":[{"role":"user","content":"hi"}],"max_tokens":50}'
# 4. smoke test: load_crew + 關 tools
CREWAI_PY=~/.local/share/uv/tools/crewai/bin/python
env -u PYTHONPATH OPENAI_API_KEY=dummy OPENAI_API_BASE=http://127.0.0.1:9 \
  "$CREWAI_PY" -c "from pathlib import Path; from crewai.project import load_crew; c,_=load_crew(Path('crew.jsonc')); [setattr(a,'tools',[]) or setattr(a,'allow_delegation',False) for a in c.agents]; print('OK', len(c.agents))"
```

## run_swarm_local.py 核心邏輯（gitignore, 不進庫）
```python
crew, di = load_crew(Path(__file__).with_name("crew.jsonc"))
for agent in crew.agents:
    agent.tools = []
    agent.allow_delegation = False
    agent.function_calling_llm = None
result = crew.kickoff(inputs={**di, "task": task})
print(result.raw)
```

## 時間成本參考
30 agents × 5 sequential tasks，qwen2.5:3b CPU 推理：約 8-12 分鐘（每 agent 1-2 分）。
