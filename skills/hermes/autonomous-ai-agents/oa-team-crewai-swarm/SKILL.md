---
name: oa-team-crewai-swarm
category: autonomous-ai-agents
description: Build OA-Team 30-agent CrewAI swarm from soul.md JSON-first.
tags: [crewai, swarm, multi-agent, oa-team, json-first, soul-md]
---

# OA-Team 30 蜂群 — CrewAI 實作 (JSON-first)

對應 `soul.md` 的「30 Souls Matrix」(5 大陣列 × 6 代理)。本技能是經實戰驗證的可執行骨架與排錯手冊，補足 `oa-team-swarm` (Hermes 委派版) 之外的 CrewAI 實作路徑。

## 1. 目錄結構

```
oa-team-crewai/
├── crew.jsonc              # CrewAI JSON-first 編排 (agents 陣列 + tasks 陣列)
├── agents/
│   ├── agent_01.jsonc ... agent_06.jsonc       # Strategy Squadron (智庫聖所)
│   ├── agent_07.jsonc ... agent_12.jsonc       # Technology Squadron (符文契約)
│   ├── agent_13.jsonc .. agent_18.jsonc       # Creative Squadron (光之羽翼)
│   ├── agent_19.jsonc .. agent_24.jsonc       # Marketing Squadron (煉金熵減)
│   └── agent_25.jsonc .. agent_30.jsonc       # Guard Squadron (5T 驗算)
├── main.py                 # Flow 入口 (load_crew + OATeamFlow)
├── gen_agents.py           # 批量生成 30 agent (對應 soul.md 5 陣列)
├── pyproject.toml
└── .github/workflows/crewai-run.yml   # 注意: 必須在 repo 根 .github/workflows/
```

## 2. crew.jsonc (標準格式)

```jsonc
{
  "name": "oa_team_30_swarm",
  "agents": [ "agent_01", /* ... 30 個, 對應 agents/agent_<NN>.jsonc */ "agent_30" ],
  "tasks": [
    {
      "name": "extract_essence",
      "description": "【本質提純】Queen Bee (Agent 01) receives the task: {task}. Extract the core essence, identify required squadron involvement, and produce a structured task brief with 5T alignment markers.",
      "expected_output": "A JSON object with essence, squadrons_involved, 5t_tags, priority.",
      "agent": "agent_01"
    }
    /* 5 tasks: extract → forge_contract → dispatch_swarm → entropy_forge → verify_5t */
  ],
  "process": "sequential",
  "verbose": true
}
```

**禁止欄位**：`crew.jsonc` 不能有 `description`；`agents/*.jsonc` 不能有 `soul_id`/`squad`/`tags` 等非標準鍵 → `load_crew` 報 `unsupported field(s)`。元數據寫進 `//` 註解行。

## 3. agents/agent_<NN>.jsonc (標準欄位)

```jsonc
// OA-01 — 萬能蜂后 (Queen Bee)
// Squadron 1: Strategy Squadron | soul_id: OA-01 | tags: #全能領導 #戰略總覽
{
  "role": "萬能蜂后 (Queen Bee) - OA-01",
  "goal": "負責整體戰略規劃、資源分配、跨組協調與決策鏈控制...",
  "backstory": "I am the Queen Bee, the central intelligence of OA-Team 30...",
  "allow_delegation": true,
  "verbose": true
}
```

Agent naming: `agent_01` through `agent_30`, zero-padded to 2 digits. Squadron assignments match soul.md §II:
- Squadron 1 (agents 01-06): Strategy — 智庫聖所
- Squadron 2 (agents 07-12): Technology — 符文契約
- Squadron 3 (agents 13-18): Creative — 光之羽翼
- Squadron 4 (agents 19-24): Marketing — 煉金熵減
- Squadron 5 (agents 25-30): Guard — 5T 驗算

**llm 不要硬編碼**：交給環境變數 (`OPENAI_MODEL_NAME` / `OPENAI_API_BASE` / `OPENAI_API_KEY`) 驅動，本地 (Nous) 與 CI (CREWAI_API_KEY) 皆可用。

## 4. main.py (Flow + load_crew)

```python
from pathlib import Path
from crewai.flow import Flow, listen, start
from crewai.project import load_crew
from pydantic import BaseModel

class SwarmState(BaseModel):
    task: str = ""
    result: str = ""

class OATeamFlow(Flow[SwarmState]):
    @start()
    def prepare_task(self, crewai_trigger_payload: dict | None = None):
        self.state.task = sys.argv[1] if len(sys.argv) > 1 else "為 AI Station 產出一個 5T 合規的元件骨架"
        print("🐝 OA-Team 30 萬能蜂群啟動 — CrewAI JSON-first Flow")

    @listen(prepare_task)
    def run_swarm(self):
        crew, default_inputs = load_crew(Path(__file__).with_name("crew.jsonc"))
        result = crew.kickoff(inputs={**default_inputs, "task": self.state.task})
        self.state.result = result.raw
        return result

if __name__ == "__main__":
    OATeamFlow().kickoff()
```

## 5. 環境與執行

### 安裝 (Python 3.10–3.13, CrewAI 不支援 3.14)
```bash
uv python install 3.13
uv tool install crewai --python 3.13
uv tool install 'crewai[litellm]' --python 3.13   # LiteLLM 路由自訂模型
```

### 本機執行
```bash
# 關鍵: 清除 PYTHONPATH 污染 (否則 import pydantic 崩潰)
env -u PYTHONPATH OPENAI_API_KEY="$NOUS_API_KEY" \
  OPENAI_API_BASE="https://api.nousresearch.com/v1" \
  uv run --python 3.13 --with 'crewai[litellm]' python main.py "任務描述"
```

### CI 執行 (GitHub Actions)
```yaml
# .github/workflows/crewai-run.yml  (必須 repo 根, 子目錄不會被註冊!)
jobs:
  crewai-run:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: oa-team-crewai } }
    steps:
      - uses: actions/checkout@v4
      - run: curl -LsSf https://astral.sh/uv/install.sh | sh
      - name: Run
        env:
          OPENAI_API_KEY: ${{ secrets.CREWAI_API_KEY }}
          OPENAI_MODEL_NAME: gpt-4o-mini
        run: |
          export PATH="$HOME/.local/bin:$PATH"
          uv run --python 3.13 --with 'crewai[litellm]' python main.py "任務"
```

## 6. 已驗證的坑 (error → fix)

| 錯誤 | 根因 | 修復 |
|------|------|------|
| `No module named 'pydantic_core._pydantic_core'` | `PYTHONPATH` 指向搶壞的 Hermes venv，污染 crewai | 執行前 `env -u PYTHONPATH` |
| `crewai: command not found` (但 `uv tool list` 有) | `~/.local/bin` 不在 PATH | `export PATH="$HOME/.local/bin:$PATH"` |
| `Failed to spawn: run_crew / program not found` | `crewai run` CLI 期望 `crewai create` 腳手架的 entrypoint | 改用 `python main.py` 或 `uv run --with crewai python main.py` |
| `crew.jsonc: unsupported field(s): description` | `load_crew` 拒絕非標準鍵 | 刪除 crew 層 description |
| `agent: unsupported field(s): soul_id, squad, tags` | agent JSON 只收標準欄位 | 元數據移到 `//` 註解 |
| `custom:memory_recall not found` | 宣告不存在的 custom tool | 先移除 tools 欄位，或建 `tools/<name>.py` |
| `Error importing native provider: Missing credentials` | `OPENAI_API_KEY` 空 (CI 讀不到 secret) | 確認 secret 在 repo 級 Actions scope；CI 用 `echo "len=${#KEY}"` 探針除錯 |
| `TencentException - Connection error` (模型 `tencent/hy3:free`) | 裸模型名被 litellm 誤判為 Tencent 原生端點 | 用 `openai/tencent/hy3:free` + `base_url` 走 OpenAI-compatible |
| `Failed to connect to OpenAI API` (模型 `openai/...`) | 端點 DNS 失敗/不可達 | 換可達端點 (本機 Ollama / OpenRouter / 正確域名) |
| GitHub Actions 不觸發 workflow | workflow 放進 `oa-team-crewai/.github/` 子目錄 | 移到 repo 根 `.github/workflows/` |
|| `@pytest.mark.parametrize` tuple unpacking error: `number of names (3): ['squadron', '(lo', 'hi)'] must be equal to the number of values (2): (1, (1, 6))` | `dict.items()` yields **nested tuples** (key, (v1,v2)) which pytest unpacks incorrectly into N+1 parameter names | Use flat list comprehension: `@pytest.mark.parametrize("k,v", list(d.items()))` — or restructure data so each parametrize tuple has exactly N flat values matching N parameter names. Never pass `d.items()` directly to a multi-name parametrize. |
|| TypeScript module resolution error | TypeScript `bundler` module resolution requires `.js` extension in relative imports even for `.ts` source files | Use `.js` extension: `import { X } from './path.js'` — TypeScript compiler handles the mapping |

## 7. 驗證清單 (不依賴網絡)

```bash
# 結構驗證 (jsonc 解析 + 數量)
python3 -c "
import json, os
def strip(p): return '\n'.join(l for l in open(p,encoding='utf-8') if not l.strip().startswith('//'))
crew = json.loads(strip('crew.jsonc'))
assert len(crew['agents'])==30 and len(crew['tasks'])==5
af = sorted(f for f in os.listdir('agents') if f.endswith('.jsonc'))
assert len(af)==30
print('✅ 30 agents / 5 tasks 結構正確')
"
# CrewAI 原生組裝驗證 (用快速失敗埠代替空 key, 避免網絡卡死)
env -u PYTHONPATH OPENAI_API_KEY=dummy OPENAI_API_BASE=http://127.0.0.1:9 \
  uv run --python 3.13 --with 'crewai[litellm]' \
  python -c "from crewai.project import load_crew; c,_=load_crew(__import__('pathlib').Path('crew.jsonc')); assert len(c.agents)==30"
```

## 8. 與 oa-team-swarm 的關係
`oa-team-swarm` 是 Hermes Agent 委派版 (delegate_task / agents-cli)；本技能是 CrewAI 原生多智能體版。兩者共用 soul.md 的 5 大陣列角色定義與 5T 協定，但執行引擎不同。

## 9. references/ 目錄
本技能的 `references/` 目錄包含：
- `references/testing-patterns.md` — pytest parametrize best practices and pitfall workarounds
- `references/ci-patterns.md` — GitHub Actions + CrewAI deployment patterns
- `references/ts-library-architecture.md` — TypeScript library architecture for OA-Team 30 (src/ structure, Agent Runtime, 5T gate, model registry)

## 10. TypeScript Library Implementation (oneringai/src/)

### 10.1 專案結構

```
oneringai/
├── src/
│   ├── index.ts              # 主入口點 (re-exports all public APIs)
│   ├── types/                # 核心類型定義 (Vendor, Services, AuthConfig, etc.)
│   ├── core/
│   │   ├── connector.ts      # Connector-First 認證系統
│   │   ├── agent.ts          # Agent 類別 + ToolManager + ToolExecutionPipeline
│   │   └── fiveT-gate.ts     # 5T 驗證閘 (Traceable/Trackable/Tangible/Transparent/Trustworthy)
│   ├── registry/
│   │   └── models.ts         # Model Registry v2 (92 text + media models)
│   ├── agents/
│   │   ├── matrix.ts         # 30-Agent 矩陣 + SwarmFactory + SwarmOrchestrator
│   │   ├── registry.ts       # AgentRegistry (global tracking, inspection)
│   │   └── orchestrator.ts   # AgentOrchestrator (multi-agent teams, workspace)
│   ├── agent-runtime/
│   │   └── index.ts          # Agent Runtime preview (OneRingAIDriver, CodexSdkDriver)
│   ├── memory/               # 自建記憶系統 (entity/fact graph)
│   ├── tools/                # Built-in tools + developer tools + desktop tools
│   ├── audio/                # TTS/STT implementations
│   ├── search/               # Search providers (Serper, Brave, Tavily)
│   ├── mcp/                  # MCP client integration
│   └── utils/                # Crypto, logger, cache utilities
├── tsconfig.json
├── package.json (exports: ".", "./agent-runtime", "./agent-runtime/codex")
└── examples/
```

### 10.2 關鍵設計決策

**TypeScript 模組路徑**：在 `export ... from` 語句中必須使用 `.js` 擴展名（即使源文件是 `.ts`），因為 TypeScript 的 `moduleResolution: "bundler"` 會在編譯後將其正確解析為 `.js` 檔案。

**5T 驗證閘**：`FiveTGate` 類別封裝了五大驗證維度。Artifact 必須包含 `source_origin`、`lifecycle_hooks`、`user_feedback`、`logic_doc` 等欄位才能通過驗證。通過後自動應用 `Hash Lock` (SHA-256) 和 `Object.freeze()`。

**Agent Runtime**：採用 Driver 架構，`OneRingAIDriver` 與 `CodexSdkDriver` 實現 `AgentDriver` 介面。每個 Driver 負責 session 管理、run 執行、事件流和能力檢查。

**Connector 作用域**：`ScopedConnectorRegistry` 接受 `ConnectorAccessContext`（userId/tenantId/roles），用於多租戶環境中的連接器隔離。

### 10.3 驗證命令

```bash
# TypeScript 編譯檢查
cd oneringai && npx tsc --noEmit

# 執行測試
cd oneringai && npx vitest run

# 驗證 5T 閘
python scripts/verify_all.sh
```

### 10.4 Python↔TypeScript 對應

| Python (CrewAI) | TypeScript (OneRingAI) | 說明 |
|---|---|---|
| `crew.jsonc` + `agents/*.jsonc` | `SWARM_SPEC` in `src/agents/matrix.ts` | 30 代理定義 |
| `main_json.py` (load_crew) | `Agent.create()` | Agent 實例化 |
| `main_python.py` | `Agent.run()` | 單一 agent 執行 |
| `main_flows.py` | `SwarmOrchestrator` | 多代理工作流程 |
| `oa_5t_gate.py` | `FiveTGate` in `src/core/fiveT-gate.ts` | 5T 驗證閘 |
| `oa_memory_bridge.py` | `AgentContextNextGen` memory plugins | 記憶橋接 |
| `oa_webhook_verify.py` | `WebhookResult` + HMAC in security tools | Webhook 驗證 |
