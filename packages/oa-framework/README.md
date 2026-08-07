# OA Framework — 萬能分身元框架

整合 7 大 AI Agent 框架為統一元框架，對齊 `soul.md` 的 5T 協議與 `omni-agent` 5T 驗證引擎。

## 整合的子框架

| ID | 框架 | 形態 | 適配器 |
|---|---|---|---|
| `adk` | Google Agent Development Kit (TS) | npm `@google/adk` | `adapters/adk.ts` |
| `genkit` | Google Genkit (Firebase) | npm `genkit` | `adapters/genkit.ts` |
| `agent0` | Agent Zero organic framework | Docker `agent0ai/agent-zero:50001` | `adapters/agent0.ts` |
| `crewai` | CrewAI 30 蜂群 | Python/uv (crewai-runtime) | `adapters/crewai.ts` |
| `agentreach` | Agent Reach（最新技術） | **spec pending** — 待使用者提供文檔 | `adapters/agentreach.ts` |
| `deerflow` | DeerFlow 研究流程 | Python FastAPI (esggo-deerflow) | `adapters/deerflow.ts` |
| `tencent-mem` | 騰訊 Agent 記憶 (TencentDB Agent Memory) — **Team Memory** | MemoryCore `:8420` + Hub `:8125` + Proxy `:8096` | `adapters/tencent-mem.ts` |

## 架構

```
src/
  core/
    types.ts        # IComponentCore / ISubFrameAdapter / OAFrameConfig / OATask / OATaskResult
    t5.ts           # 5T 驗證器 + Hash Lock (forgeT5 / verify5T)
    orchestrator.ts # OAOrchestrator — 多框架並行 dispatch + 5T 閘門
  adapters/         # 7 個子框架適配器 (統一 ISubFrameAdapter 介面)
  index.ts          # createOAFrame() — 一鍵註冊全部 7 框架
test/
  smoke.ts          # 7 框架並行 + 5T 驗證
```

## 5T 協議（來自 soul.md）

每筆產出經 `forgeT5` 鑄造，必合規：
- **Traceable** 可溯源 · **Trackable** 可追蹤 · **Tangible** 可感知
- **Transparent** 可透明 · **Trustworthy** 不可篡改 (SHA-256 Hash Lock + `Object.freeze`)

## 使用

```ts
import { createOAFrame, verify5T } from '@esggo/oa-framework';

const oa = createOAFrame({ llmModel: 'gemini-2.5-flash', memoryGateway: 'http://127.0.0.1:8420' });
const results = await oa.run({ id: 't1', prompt: '為 ESG-GO 產出 5T 合規元件骨架' });
for (const r of results) {
  const v = verify5T(r);  // 5T 全綠 + Hash Lock 未被篡改
  console.log(`[${r.subFrame}] 5T=${v.pass ? 'PASS' : 'FAIL'}`);
}
```

## 驗證

```bash
npm run typecheck   # tsc 零錯誤
npx tsx test/smoke.ts  # 7 框架並行 + 5T 鑄造 → ALL_7_FRAMEWORKS_OK
```

## 待辦

- [x] **騰訊 Agent 記憶** — 已升級為 Team Memory 適配器 (`memory.ts` + `tencent-mem.ts`)：
  - 4 類資產 `MemoryAssetKind`: `chat_memory`(L0-L3) / `skill` / `wiki` / `codegraph`
  - 真實 API：`/v3/tools/list` + `/v3/tools/call` (Knowledge OpenAPI) + `/api/assets` (資產庫)
  - 部署：`git clone https://github.com/Tencent/TencentDB-Agent-Memory.git && cd deploy/global-images && cp .env.example .env && ./start-all.sh`
  - 端點：core `:8420` / hub `:8125` / proxy `:8096`
  - 對齊 OA-Team 30 蜂群：每個 Agent 可經 `saveAsset`+`callTool` 實作 Agent Loadout (綁定不同記憶資產)
  - 當前 VPS `:8420` 未部署 → `health()` 回 `down` (graceful 降級, 不阻斷其他框架)
- [ ] **Agent Reach**：使用者未提供文檔，`agentreach.ts` 為占位骨架（`health()` 回 `down`），待補協議細節後實作通道分發。
- [ ] 各 adapter `dispatch` 目前為 scaffold（回傳標記字串），需注入真實 SDK 調用（@google/adk / genkit / Agent0 A2A / crewai-runtime / DeerFlow API / TencentDB gateway）。
- [ ] 與 `omni-agent` 5T Gate 串接（將 `verify5T` 作為部署前閘門）。
