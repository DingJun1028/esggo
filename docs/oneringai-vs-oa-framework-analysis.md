# OneRingAI vs OA-Team 30 蜂群框架 — 架構異同與整合建議

> 生成日期：2026-08-11
> 分析基礎：
> - **esggo 側**：實際讀取 `packages/oa-framework`、`packages/omni-agent`、`packages/omni-agent-bus` 原始碼與 README（真實狀態）。
> - **OneRingAI 側**：依據其 `README` (v1.0.0) 聲稱整理，**未經本地安裝/pnpm 驗證**；實際 API 以安裝後 `node_modules/@everworker/oneringai/AGENTS.md` 為準。

---

## 1. 摘要

| 維度 | OA-Team 30 蜂群（esggo `oa-framework`） | OneRingAI |
|------|------------------------------------------|-----------|
| 本質 | **元框架 (meta-framework)**：包裝 7 個既有 agent 框架成統一介面 | **統一函式庫 (unified library)**：自帶 Agent/Connector/Memory/Tools 實作 |
| 核心資產 | **5T 雙層閘門**（欄位級 + 內容級品質驗證） | **Connector-First 多供應商** + **MemorySystem** 一級子系統 |
| LLM 多供應商 | 經子框架 adapter 間接（目前多數為 scaffold） | 原生 12 家（OpenAI/Anthropic/Google/Grok/…）統一 API |
| 記憶 | 騰訊 Agent 記憶 (TencentDB) 適配器 | 內建 entity/fact graph + vector + 三主體權限 |
| Node 要求 | `>=20`（pnpm workspace） | `22+` |

**結論**：兩者互補而非替代。**5T 是 OA 的獨特強項，OneRingAI 無對應**；OneRingAI 補齊的是 OA 目前薄弱的「多供應商統一 API / 原生工具權限 / 成本優化 / 長時會話」。建議以 **adapter 形式** 引入，而非替換。

---

## 2. esggo 現狀（實測）

`packages/oa-framework@0.5.0` 整合 7 子框架，統一介面 `ISubFrameAdapter`：

| ID | 框架 | 適配器 | 狀態 |
|----|------|--------|------|
| `adk` | Google ADK (TS) | `adapters/adk.ts` | 真實 `LlmAgent` + `run()`，未裝時降級 |
| `genkit` | Google Genkit | `adapters/genkit.ts` | 真實 `ai.generate()`，未裝時降級 |
| `agent0` | Agent Zero | `adapters/agent0.ts` | scaffold |
| `crewai` | CrewAI 30 蜂群 | `adapters/crewai.ts` | scaffold（待 crewai-runtime） |
| `agentreach` | Agent Reach | `adapters/agentreach.ts` | 路由表已落地，health 降級 |
| `deerflow` | DeerFlow | `adapters/deerflow.ts` | scaffold |
| `tencent-mem` | 騰訊 Agent 記憶 | `adapters/tencent-mem.ts` | 真實 API，VPS 未部署時 health=down |

核心：`OAOrchestrator`（多框架並行 dispatch）+ `core/t5.ts`（Hash Lock 鑄造）+ `core/omni-gate.ts`（對齊 `omni-agent` gates.ts 的長度/品質正則）。

`packages/omni-agent-bus@0.1.0` 提供**增量輸出優化**骨架：`event-bus` / `conduit` / `service-orchestrator` / `etl-pipeline` / `delta-tracker` / `cache-manager` / `compression` / `pagination` / `worker-pool` 等（與 `soul.md` §12 模式對應）。

---

## 3. 維度對照

| # | 維度 | OA-Team 30 蜂群 | OneRingAI v1.0.0 |
|---|------|------------------|-------------------|
| 1 | **架構哲學** | 元框架：包多框架成統一介面，5T 為品質守門員 | 統一庫：自實作 Agent/Connector/Memory/Tools |
| 2 | **多供應商 LLM** | 經子框架 adapter 間接；目前 scaffold 居多 | 原生 `Connector`+`Vendor`，12 家直接支援 + 模型註冊 v2（88 模型） |
| 3 | **記憶系統** | 騰訊 TencentDB Team Memory 適配器（4 類資產） | 內建 `MemorySystem`：entity/fact graph + vector + owner/group/world + principal ACL |
| 4 | **工具系統** | 依賴子框架自帶工具；bus 提供業務級 patterns | `ToolFunction` + 39 內建 + connector 工具（50 服務）+ 自定義工具生成（VM sandbox）+ 權限策略 |
| 5 | **多 Agent 編排** | `OAOrchestrator` 多框架並行 + 5T 閘 | `createOrchestrator`（委派/共享 workspace）+ `AgentRegistry` |
| 6 | **長時 / 非同步** | bus 有 `event-bus`/`worker-pool`；無跨天會話原語 | `SuspendSignal`/`Agent.hydrate()` 跨天 resume + Async Tools（非阻塞 auto-continue）+ Routine DAG |
| 7 | **品質驗證** | **5T 雙層閘門（獨特）** | 結構化輸出驗證；無 5T 對應 |
| 8 | **成本 / 推論優化** | 無 | prompt caching / async batches / provider-hosted tools / 成本遙測 |
| 9 | **語言 / 運行** | TS + Next.js，node>=20，pnpm | TS，node 22+ |

---

## 4. 能力缺口矩陣

### OA 目前缺（OneRingAI 可補）
- **原生多供應商統一 API**：免去逐框架寫 adapter；尤其 OpenAI/Anthropic/xAI 直接 callable。
- **工具權限策略**：OneRingAI 的 `IPermissionPolicy` + 使用者規則 + 引數檢查，OA 目前無對等。
- **成本優化**：prompt caching / batch / native tools 遙測，OA 完全空白。
- **長時會話**：跨天 Suspend/Resume，OA 需自行在 bus 上搭建。
- **記憶系統成熟度**：OneRingAI `MemorySystem` 的 graph+vector+權限開箱即用；騰訊記憶需自部 VPS。

### OneRingAI 缺（OA 可補）
- **5T 協定**：寫入即凍結 Hash Lock + 內容級品質正則，OneRingAI 無任何等效。
- **30 蜂群矩陣 / 同體一心**：角色分工、跨組配對、信任橋樑，OneRingAI 無組織層。
- **ESG / GRI / ISO 合規語意**：OA 的 gates 內建「% 揭露、GRI/ISO 來源」特徵，OneRingAI 通用。

---

## 5. 整合策略

### 方案 A（推薦）：OneRingAI 作為第 8 個 adapter
在 `oa-framework/src/adapters/oneringai.ts` 實作 `ISubFrameAdapter`：
- `dispatch()` 內部建 `Connector.create` + `Agent.create`，把 OA 任務轉 OneRingAI `run()`。
- 產出仍經 `forgeT5` 鑄造 + `omni-gate` 閘門 → **5T 守門不漏**。
- 優點：零替換風險，5T 資產保留，多供應商即開即用。
- 代價：需升 Node 至 22+ 或鎖定 OneRingAI 版本（評估相容）。

### 方案 B：OneRingAI 作 LLM Connector 層
抽出 OA 的「LLM 呼叫」全部走 OneRingAI `Connector`+模型註冊，子框架 adapter 只負責「框架特異邏輯」。
- 適用：當 OA 多數 adapter 從 scaffold 轉真實實作時。

### 方案 C：記憶雙寫
`tencent-mem` 與 OneRingAI `MemorySystem` 擇一為主、另一為備；或經 `omni-agent-bus` 的 `delta-tracker` 雙寫。
- 注意：兩者權限模型不同（TencentDB 團隊 / OneRingAI 三主體+principal），需映射層。

### 方案 D（不推薦）：整包替換
放棄 `oa-framework` 改用 OneRingAI。
- 風險：喪失 5T 核心資產、30 蜂群語意、ESG 合規閘；且引入外部依賴供應鏈。

---

## 6. 風險與前置

| 風險 | 說明 | 緩解 |
|------|------|------|
| **Node 22+** | OneRingAI 要求 22+，esggo 現 `>=20` | 評估升 VPS/CI Node；或鎖 OneRingAI 版本測試 node20 兼容性 |
| **外部依賴** | 引入 `npm:@everworker/oneringai`（MIT，相容） | 走 pnpm overrides + `pnpm audit`；參照 `AGENTS.md` 自動修復機制 |
| **adapter 降級** | 未裝 SDK 時 graceful 降級模式需保留 | 沿用 `oa-framework` 既有 `health()` 降級慣例 |
| **記憶雙寫一致性** | 兩套權限模型 | 先做單寫（方案 A），記憶整合排後 |

---

## 7. 下一步（建議執行順序）

1. **安裝驗證**：`pnpm add -w @everworker/oneringai`，跑其 `AGENTS.md` 建議的 smoke test，確認 Node20 可否運行（實際驗證，非 README 聲稱）。
2. **寫 `adapters/oneringai.ts`**（方案 A 骨架），`dispatch()` 轉 `Agent.run()`。
3. **5T 包裝**：產出接 `forgeT5` + `verify5T` 當部署前閘。
4. **選點驗證**：挑 OpenAI 或 Ollama（免費）跑通一條 OA 任務鏈，附真實輸出。
5. **評估記憶**：視 TencentDB VPS 部署狀態決定是否雙寫。

> 備註：本文件為分析/建議，未變更任何程式碼。實作前請先完成第 1 步的安裝驗證，以確認 OneRingAI 在 esggo 現有 Node 環境的實際可用性。
