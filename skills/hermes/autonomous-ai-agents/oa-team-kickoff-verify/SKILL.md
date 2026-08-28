---
name: oa-team-kickoff-verify
description: "OA-Team 30 蜂群本機 Ollama Kickoff 防假完成 + CrewAI/Ollama 相容坑（模型名 404 / delegation 空回 / 背景跑超時 / 蜂群答案真輸出驗證）。適用任何 CrewAI JSON-first 蜂群在本機 Ollama 跑。"
version: 1.0.0
author: dingj
license: MIT
metadata:
  hermes:
    tags: [oa-team, crewai, ollama, swarm, kickoff, verify, best-practice, esggo]
    related_skills: [powershell-ssh-deploy-verify, oa-swarm-local-runtime, oa-team-swarm]

---

# OA-Team 30 蜂群本機 Ollama Kickoff 防假完成（經驗技能書）

> 固化自 2026-08-23 實戰：從 VPS 取 `/opt/esggo/oa-team-crewai`（crew.jsonc + 30 agent jsonc），
> 建 venv 裝 crewai 1.15.17，經本機 Ollama `qwen2.5:3b` 跑 `run_swarm_local.py`，
> 蜂群真實產出 TypeScript 元件骨架。審出並解決 4 個坑，固化防假完成驗證法。

## 觸發條件
- 撰寫 / 執行「CrewAI JSON-first 蜂群在本機 Ollama 跑」的 kickoff
- 用戶說「跑 OA-Team 蜂群」「kickoff swarm」「蜂群答案空白」「Ollama 跑 crewai 空回」
- 相關：`oa-swarm-local-runtime`（OAB broker 實體化）、`powershell-ssh-deploy-verify`（VPS 部署）

## 真實坑與已驗證解法

### 坑 1 — 模型名 404（最常炸）
- 現象：`ValueError: Model qwen2.5:3b-instruct-q4_K_M not found: 404`
- 根因：技能建議用 `qwen2.5:3b-instruct-q4_K_M`，但 VPS Ollama 實際裝的是 `qwen2.5:3b`（env `OLLAMA_MODEL=qwen2.5:3b`）
- 解法：**先查實際模型名**再設 env：
  ```bash
  curl -sS http://127.0.0.1:11434/api/tags | grep -o '"name":"[^"]*"'
  export OPENAI_MODEL_NAME=qwen2.5:3b   # 用實際名，非技能建議名
  ```

### 坑 2 — delegation/tools 致 `None or empty`
- 現象：`ValueError: Invalid response from LLM call - None or empty`
- 根因：agent jsonc 含 `allow_delegation: true` 或 tools 註解 → CrewAI 0.175+ 走 `call_llm_native_tools`，Ollama 小模型回空
- 解法：load_crew 後遍歷 agents 關掉：
  ```python
  for a in crew.agents:
      a.tools = []
      a.allow_delegation = False
      a.function_calling_llm = None
  ```

### 坑 3 — Ollama 慢致 foreground 超時
- 現象：30 agent × 5 task 在 VPS ARM 上跑數分鐘，foreground 180s 必 timeout
- 解法：**背景跑 + monitor**，不阻塞：
  ```bash
  nohup python run_swarm_local.py '任務' > /tmp/oa_swarm_run.log 2>&1 &
  # 另開 monitor 等完成
  while pgrep -f run_swarm_local.py >/dev/null; do sleep 15; done
  echo SWARM_DONE
  ```

### 坑 4 — 假完成（pm2 online 錯覺 → 此處是 crewai kickoff 無 pm2）
- 現象：進程 RUNNING 但 agent 數不動，以為卡死
- 真判：`ps aux | grep llama-server` 看 CPU%（363% = 活躍推理，非僵死）；`grep -c 'Agent:'` 看遞增；最終 `grep '========== 蜂群答案'` 確認真答案

## 完整 kickoff 流程（已驗證可跑）

```bash
# 1. 取權威 repo（VPS 已有，或 git clone esggo-learning-center）
scp -r ubuntu@161.118.248.180:/opt/esggo/oa-team-crewai/ ./oa-team-crewai/

# 2. venv + 裝 crewai（Python 3.12，非 3.14 過新）
cd oa-team-crewai && python3 -m venv .venv && . .venv/bin/activate
pip install 'crewai>=0.175.0'   # 實裝 1.15.17

# 3. 寫 run_swarm_local.py（關 delegation/tools）
cat > run_swarm_local.py << 'PYEOF'
import os, sys
from pathlib import Path
from crewai import Agent, Crew, Process
from crewai.project import load_crew
os.environ.setdefault('OPENAI_API_BASE', 'http://127.0.0.1:11434/v1')
os.environ.setdefault('OPENAI_MODEL_NAME', 'qwen2.5:3b')  # 用實際模型名
os.environ.setdefault('OPENAI_API_KEY', 'ollama')
crew, default_inputs = load_crew(Path('crew.jsonc'))
for a in crew.agents:
    a.tools = []; a.allow_delegation = False; a.function_calling_llm = None
result = crew.kickoff(inputs={**default_inputs, 'task': sys.argv[1] if len(sys.argv)>1 else 'ESG-GO 5T 元件骨架'})
print('========== 蜂群答案 =========='); print(result.raw)
PYEOF

# 4. 背景跑
nohup python run_swarm_local.py '為 ESG-GO 產出一個 5T 合規的元件骨架' > /tmp/oa_swarm_run.log 2>&1 &

# 5. 防假完成驗證
watch: grep -c 'Agent:' /tmp/oa_swarm_run.log   # 應遞增
watch: ps aux | grep llama-server | awk '{print $3}'   # 363% = 活躍
final: grep -A 30 '========== 蜂群答案' /tmp/oa_swarm_run.log   # 真 TypeScript 答案
```

## 驗證清單（自審用）
- [ ] 模型名用 `api/tags` 實際查到的，非技能建議名
- [ ] load_crew 後 agents 關 `tools/delegation/function_calling_llm`
- [ ] 背景跑 + monitor，非 foreground 阻塞
- [ ] `llama-server` CPU% 確認活躍（非僵死誤判）
- [ ] 蜂群答案分隔符出現且內容非空（真 TypeScript/文字）

## 5T 對齊
- Traceable：crew.jsonc 30 agent 可溯
- Trackable：agent 數遞增 / monitor flag 可追
- Tangible：Ollama 363% CPU 真推理 / 蜂群真答案
- Transparent：模型 404 / delegation 空回 等坑全露
- Trustworthy：指紋硬鐵律（VPS 登入前 ssh-keygen 比對）

## 實戰來源
- VPS：`/opt/esggo/oa-team-crewai`（crew.jsonc + agents/ 30 jsonc + main.py）
- 本機成果物：`oa-team-kickoff-result.txt`（80 行蜂群答案）
- 關聯：oa-swarm-local-runtime（OAB）、powershell-ssh-deploy-verify（VPS 部署）
