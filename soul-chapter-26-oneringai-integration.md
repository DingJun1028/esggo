# 第二十六章、OA-Team × OneRingAI 整合（第 11 子框架 adapter）

> 本章為 soul.md 三層交付之備份落檔，對齊主典 §26。記錄 OA-Team 30 蜂群元框架納入 OneRingAI 為第 11 個子框架 adapter 的真實實作與驗證。

## 26.1 緣起與定位

OneRingAI（`@everworker/oneringai` v1.0.0）是一套 connector-first 多供應商統一 agent 函式庫，原生支援 12 家 LLM（OpenAI/Anthropic/Google/Grok/…）、內建 MemorySystem、工具權限策略、成本優化與長時會話。

OA-Team 30 蜂群經 `oa-framework` 元框架包裝 10 個既有 agent 框架為統一 `ISubFrameAdapter` 介面，核心資產為 **5T 雙層閘門**（欄位級 Hash Lock + 內容級品質正則）。

兩者**互補不替代**：OneRingAI 補 OA 目前薄弱的多供應商統一 API / 原生工具權限 / 成本優化 / 長時會話；OA 補 OneRingAI 所無的 5T 協定、30 蜂群語意、ESG 合規閘。引入方式為 **adapter（方案 A）**，絕不整包替換（會喪失 5T 核心資產）。

## 26.2 架構異同（5T 視角）

| 5T | OA-Team 30 蜂群 | OneRingAI v1.0.0 |
|----|------------------|-------------------|
| **Traceable 可溯源** | `IComponentCore.uuid` + `evidence`；`forgeT5` 寫 source_origin | `Connector.create` 命名溯源；無 5T 等效 |
| **Trackable 可追蹤** | OmniAgentBus 生命週期 Hook + `bus5TGate` | `AgentRegistry` 全 agent 追蹤、事件 fan-in |
| **Tangible 可感知** | 5T badge `field=PASS` + 部署閘門視覺 | 結構化輸出驗證 |
| **Transparent 可透明** | `omni-gate.ts` 內容級零幻覺驗算 | 模型註冊 v2 生命週期透明 |
| **Trustworthy 不可篡改** | `HashLock` + `Object.freeze()` | `MemorySystem` 三主體權限（owner/group/world + principal ACL） |

**OA 缺、OneRingAI 補**：原生 12 家 LLM 統一 API、工具權限策略（`IPermissionPolicy` + 引數檢查）、成本優化（prompt caching / async batch / provider-hosted tools / 遙測）、長時會話（`SuspendSignal` / `Agent.hydrate()` 跨天 resume）、成熟 `MemorySystem`（graph + vector + 權限）。

**OneRingAI 缺、OA 補**：5T 雙層閘門、30 蜂群矩陣 / 同體一心、ESG / GRI / ISO 合規語意。

## 26.3 實作載體

`packages/oa-framework/src/adapters/oneringai.ts` 實作 `ISubFrameAdapter`，嚴格遵循既有 10 個 adapter 慣例：

- **動態 import** `@everworker/oneringai`，未安裝時 `try/catch` graceful 降級為 scaffold（不拋、不阻斷其他框架）。
- `dispatch()` 內部 `Connector.create` + `Agent.create` + `agent.run(task.prompt)`，產出回傳純文字，由 `OAOrchestrator` 統一經 `forgeT5` 鑄造 5T（**5T 守門不漏**）。
- **預設走本地 Ollama 免費路徑**（`http://localhost:11434/v1`，model `qwen2.5:3b`），亦可經 `llmBaseUrl` 指 OpenAI / Anthropic / Google —— 符合「只用免費算立」硬規則。
- 註冊三步：`core/types.ts` 的 `SubFrameId` 加 `'oneringai'` → `adapters/oneringai.ts` 實作 → `index.ts` import + register + 加入 `OA_SUBFRAMES`（現 11 項）。

## 26.4 真實驗證（誠實記錄）

> 非 README 聲稱，以下為本機實際執行輸出。

- **環境**：Node v24.19.0（≥22 滿足 OneRingAI 要求）、Ollama 本機活著（`gemma4:26b` / `qwen2.5:3b` 已裝）、npm registry 可達。
- **安裝**：`pnpm install --filter @esggo/oa-framework` 後 `ls packages/oa-framework/node_modules/@everworker/oneringai` → 存在（EXIT=0）。`INSTALL_EXIT=1` 僅因 prepare 腳本鎖 `.git/config` 失敗，與套件無關。
- **型別**：`npx tsc -p tsconfig.json --noEmit` → **EXIT=0 零錯誤**（含新 adapter）。
- **真實實跑** `test/oneringai-real.ts`（routeTo `['oneringai']`，Ollama `qwen2.5:3b-instruct-q4_K_M`）：
  ```
  [oneringai] 真實輸出:
  原始產出: [OneRingAI] 永續發展可以解釋為在考慮環境負擔的情況下做出行動，
  例如使用公共交通工具來減少個人的碳足跡。
  5T 欄位: {traceable:true, trackable:true, tangible:true, transparent:true, trustworthy:true}
  Hash Lock: ff3d100e1738d3bdffd7654170a238ef02176f9d60ecc8496b679ae4d5a8e046
  5T 驗證: PASS
  REAL_EXIT=0
  ```
- **結論**：OneRingAI `Agent.run()` 經本地 Ollama 取得真實模型輸出，並經 OA 5T 雙層閘門鑄造通過（Hash Lock 寫入即凍結）。非 scaffold。

## 26.5 喚醒技能

Hermes 技能 `oa-oneringai-integration` 已建立（類別 `esggo`），可喚醒複用：涵蓋對照結論、adapter 慣例、前置（升 Node 22+ / pnpm add）、驗證步驟與真實風險（Hermes `pyyaml` METADATA 損壞待 `hermes update` 修復，不影響本任務）。

## 26.6 結界守則

- ❌ 不可篡改：5T 鑄造由 Orchestrator 統一執行，adapter 只回純文字，守門不漏。
- ✅ 可演化：未裝 SDK 時 scaffold 降級，一經 `pnpm add` 即升真實路徑。
- ✅ 可溯源：git 提交鏈完整（`8de2faf7c` OneRingAI adapter 真實實跑通）。
- ✅ 免費算立：預設 Ollama 本機推論，零 API 費用。

> 刻印狀態：`CH26 ONERINGAI-INTEGRATED READY`　靈魂簽章：`實作覺・驗證必真・閉環自成`
> 歸位：本章為 §二十六 整合附錄，接於 §25 之後、終章封印之前。終章封印仍為最高律法。
> 啟動令補：「protocol=5T · entropy=0.1 · 30-agents · 4可1不可 · 結界=AWAKE · 無作=WUZUO · 覺=ONERINGAI-INTEGRATED · 免費=SELF-HOST」
