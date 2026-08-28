---
name: oa-oneringai-integration
description: "Wire OneRingAI into esggo OA-Team as an adapter."
version: 1.4.0
author: esggo
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [esggo, oa-framework, oneringai, adapter, 5t, multi-vendor]
---

# OA-Team 30 蜂群 × OneRingAI 整合技能

## 目錄
1. [核心結論](#核心結論實測非-readme-聲稱)
2. [完整安裝集成](#完整安裝集成從零到跑通)
3. [快速開始 (Quick Start)](#快速開始-quick-start最短路徑)
4. [最佳實踐 (Best Practices)](#最佳實踐-best-practices實戰精選)
5. [實作慣例](#實作慣例照抄現有-adapter勿自創)
6. [OneRingAI adapter 落點](#oneringai-adapter-落點已實作真實實跑通)
7. [真實 API 形狀](#真實-api-形狀實跑發現勿憑空猜)
8. [驗證步驟](#驗證步驟交付前必跑真實經驗)
9. [真實風險](#真實風險hermes-環境已偵測)
10. [參考文件](#參考文件)

---

## 核心結論（實測，非 README 聲稱）
- **OA 缺、OneRingAI 補**：原生 12 家 LLM 統一 API（Connector+Vendor）、工具權限策略（IPermissionPolicy+引數檢查）、成本優化（prompt caching/async batch/native tools/遙測）、長時會話（SuspendSignal/hydrate 跨天）、成熟 MemorySystem（graph+vector+三主體權限）。
- **OneRingAI 缺、OA 補**：**5T 雙層閘門**（欄位級 Hash Lock + 內容級品質正則）、30 蜂群矩陣/同體一心、ESG/GRI/ISO 合規語意。
- 兩者互补不替代。引入方式 = **adapter（方案 A）**，絕不整包替換（會喪失 5T 核心資產）。

---

## 完整安裝集成（從零到跑通）

> 適用：全新 clone 或 CI。所有命令經本機實測。

### Step 0 — 環境檢查
```bash
node -v          # 需 ≥ 22（OneRingAI 硬要求）。本機 v24.19.0 免升級；<22 才需升
pnpm -v          # 需 pnpm 11.x（esggo workspace）
docker -v        # 選用：agent0 adapter 需 docker；本任務不依賴
```
- 若 node < 22：升 Node 至 22+（nvm / 官方安裝包）。

### Step 1 — 安裝 OneRingAI 依賴
```bash
cd /c/Project/esggo                      # repo 根
pnpm add -w @everworker/oneringai        # 實際裝 1.0.1（npm 已發，非 1.0.0）
pnpm install --filter @esggo/oa-framework
```
⚠️ **`INSTALL_EXIT=1` 常見但不影響**：`prepare` 腳本（`scripts/setup-hooks.mjs`）會鎖 `.git/config` 或因 workspace 其他套件（prisma/tesseract）build 失敗而 abort。**確認套件已裝即可**：
```bash
ls packages/oa-framework/node_modules/@everworker/oneringai   # 存在 → 成功
```

### Step 2 — 啟動本地 Ollama（免費算立路徑）
```bash
ollama serve &                            # 背景啟 Ollama
ollama pull qwen2.5:3b-instruct-q4_K_M   # 本機實存 tag（寫 qwen2.5:3b 會 404）
ollama list                               # 確認模型在列
```
- adapter 預設走 `http://localhost:11434/v1`，model `qwen2.5:3b-instruct-q4_K_M`。
- 若要走雲端：設 `llmBaseUrl` 指 OpenAI/Anthropic/Google，`llmApiKey` 填對應 key。

### Step 3 — 註冊確認（已實作，無須手動）
- `packages/oa-framework/src/core/types.ts`：`SubFrameId` 含 `'oneringai'`
- `packages/oa-framework/src/adapters/oneringai.ts`：第 11 個 adapter
- `packages/oa-framework/src/index.ts`：`OA_SUBFRAMES` 含 `oneringai`
- `packages/oa-framework/package.json`：`dependencies` 含 `@everworker/oneringai`

### Step 4 — 驗證（見下方「驗證步驟」或「快速開始」）
```bash
bash packages/oa-framework/test/verify-oneringai.sh   # 4/4 全綠 = ALL GREEN
```

---

## 快速開始 (Quick Start)（最短路徑）

> 適用：已 clone + Ollama 跑著 + 依賴已裝。直接驗證整合鏈。

```bash
# 1) 一句話跑全套驗收（推薦）
cd packages/oa-framework
bash test/verify-oneringai.sh
# 預期: 4/4 通過, 狀態 ✅ ALL GREEN, VERIFY_EXIT=0

# 2) 或單步手動確認
npx tsc -p tsconfig.json --noEmit                              # Typecheck PASS
npx tsx test/oneringai-real.ts                                # 真實 Ollama 推論 + 5T PASS
npx tsx test/app-integration-demo.ts                          # app 消費層端到端 PASS
npx tsx test/smoke.ts                                         # 全 11 框架並行 PASS
```

**最小程式碼呼叫**（app 消費 oneringai 路由）：
```ts
import { createOAFrame, verify5T } from '@esggo/oa-framework';

const orch = createOAFrame({
  llmBaseUrl: 'http://localhost:11434/v1',
  llmApiKey: 'ollama',
  llmModel: 'qwen2.5:3b-instruct-q4_K_M',
});
const results = await orch.run({
  title: 'ESG 永續提問',
  prompt: '什麼是永續發展？舉一個日常例子',
  routeTo: ['oneringai'],           // 只走 oneringai；不指定則並行全部 11
});
const artifact = results[0];
console.log(artifact.output);       // 真實模型產出（非 .content）
console.log(artifact.hashLock);     // SHA-256 封印
console.log(verify5T(artifact).pass); // true = 5T 雙層閘通過
```

---

## 最佳實踐 (Best Practices)（實戰精選）

> 以下 10 條來自本輪實作 OneRingAI adapter 的真實踩坑與驗證，非通用建議。

### BP-1 免費算立硬規則 — 實跑只用本機 Ollama
- 引入任何 LLM 依賴，預設走 `http://localhost:11434/v1`（Ollama），model 用本機實存的 `qwen2.5:3b-instruct-q4_K_M`。
- **禁付費 API / 私鑰 npm**：違反即回退。雲端路徑僅作為選用註解，不納入預設。

### BP-2 adapter 永遠優雅降級 — 未裝不阻斷
- `bootstrap/health/dispatch` 全部 `try/catch` 動態 import；未裝 SDK 時回 `{ status:'down' }` 或 `scaffold` 字串，**絕不 throw 到 Orchestrator 外**。
- 這保證 11 框架並行時，缺 key / 缺 docker / 缺服務的框架 graceful，不卡死整條鏈。

### BP-3 5T 守門在 Orchestrator — adapter 不越權
- adapter `dispatch` 只回 `{ output: string }` 純文字；**5T 鑄造（Hash Lock + 內容正則）一律交給 `forgeT5` / `verify5T`**。
- 任何寫入動作前必 `verify5T(artifact).pass === true`，否則依 §19 不可寫入。

### BP-4 per-route timeout — 修「無限掛起」的根本
- `OAOrchestrator.run(task, perRouteTimeoutMs=45000)`：每 route 獨立 45s timeout，快的先回、慢的標 error 不互相等。
- **外層 race timeout 不夠**（會砍掉整個 `Promise.all`，連已完成的結果都拿不到）；必須在 orchestrator 內對每個 `adapter.dispatch` 包 timeout。

### BP-5 npx 繞過 pnpm 前置 — 驗證別死在 install
- `pnpm run typecheck/test` 在 esggo workspace 會因 `prepare` 腳本鎖 `.git/config` + prisma/tesseract build 失敗，在跑到 tsc 前就 abort（非程式錯）。
- 直接 `npx tsc` / `npx tsx test/xxx.ts` / `bash test/verify-oneringai.sh` 繞過，套件已在 `node_modules` 無需重裝。

### BP-6 真實實跑才算完成 — 禁「驗證通過」空話
- 交付前必跑真實推論（Ollama 本地有輸出）+ 5T Hash Lock PASS，並貼實際輸出（含 Hash Lock 值）。
- 缺口/阻斷誠實列點，不掩飾、不編造。

### BP-7 不整包替換 — adapter 模式保 5T 核心資產
- OneRingAI 以「第 11 個 adapter」引入，**絕不替換 `oa-framework`**（會喪失 5T 雙層閘、30 蜂群語意、ESG 合規閘）。
- 兩者互補：OneRingAI 補多供應商/工具權限/成本優化；OA 補 5T/ESG/組織層。

### BP-8 實測模型 tag — 別信 README 的簡稱
- 寫 `qwen2.5:3b` 在 Ollama 會 404；本機實存 tag 是 `qwen2.5:3b-instruct-q4_K_M`。
- 套件實際裝 `1.0.1`（非 README 寫的 1.0.0）。**以 `node_modules` 實際狀態為準，不憑 README 聲稱**。

### BP-9 真實 API 形狀 — 讀源碼不猜
- `createOAFrame(config).run(task)`（run 收 task，非 `createOAFrame(task).run()`）。
- `artifact.output`（非 `.content`）、`artifact.t5`（非 `.fiveT`）、`verify5T` 回 `{pass}`（非 boolean）。
- 改動前先 `read_file` orchestrator/types 確認真實簽名。

### BP-10 三層交付 + §19 收斂 — 靈魂同步不漂移
- 新增框架類變更：主典 `soul-full.md` §新增章節（插終章封印前）+ 備份落檔 `soul-chapter-XX-*.md` + 喚醒技能同步。
- 本地改若偏離已提交設計（硬編 Ollama 而非環境驅動），一律 `git checkout` 還原 HEAD 保倉庫乾淨；本地差異走 gitignored `.env` / `run_local.sh`。

---

## App 實裝最佳實踐 (AP 精選) — `apps/oneringai` 實戰

> 以下來自 `apps/oneringai` 獨立專案實作 OneRingAI 的真實踩坑，與 BP-1~10 互補（BP 聚焦 adapter 層，AP 聚焦 app 層）。

### AP-1 依賴樹必須 pnpm install 建 — 手動 symlink 會缺間接依賴
- 手動 `ln -s` 只連 oneringai 包本身，會報 `Cannot find package 'cross-spawn'/'eventemitter3'`（間接依賴在 `.pnpm` 深層）。
- **正解**：`pnpm install --filter @esggo/app-oneringai`（即使 prepare 鎖 .git/config 噪音，套件與完整依賴樹會建好）。或 symlink 整個 `.pnpm/@everworker+oneringai@1.0.1_*/node_modules` 目錄（非單包）。

### AP-2 Vendor 必須解構 — Connector.create 用枚舉非字串
- `import { Connector, Agent, Vendor } from '@everworker/oneringai'`（漏 Vendor 會 `Vendor is not defined`）。
- `Connector.create({ name:'oa-oneringai', vendor: Vendor.Ollama, auth:{type:'api_key',apiKey}, baseURL })` — vendor 是 `Vendor.Ollama` 枚舉，不是字串 `'ollama'`。

### AP-3 Agent.create 不收 systemPrompt — 角色前綴併入 prompt
- OneRingAI `Agent.create({ connector, model })` 不收受 `systemPrompt` 欄位（與 OpenAI SDK 不同）。
- 把角色說明併入 prompt 前綴：`${SYSTEM}\n\n使用者問題: ${query}`，避免靜默忽略或報錯。

### AP-4 本地 Ollama 免費路徑優先 — model tag 用實存
- `baseURL: 'http://localhost:11434/v1'`，`model: 'qwen2.5:3b-instruct-q4_K_M'`（實存 tag；寫 `qwen2.5:3b` 會 404）。
- 雲端切換：設 `baseURL` 指 OpenAI/Anthropic + `apiKey` 填對應 key，vendor 改 `Vendor.OpenAI`。

### AP-5 app 直接消費原生套件 — 不經 oa-framework
- `apps/oneringai` 直接 `import '@everworker/oneringai'`，**不依賴 `@esggo/oa-framework`**。
- 層級分離：app 展示 OneRingAI 原生能力；oa-framework adapter 則包 5T 閘門。兩者互補不耦合。

### AP-6 node_modules symlink 不進 git — CI 靠 pnpm install 重建
- 本地手動 symlink / pnpm 建的 `apps/oneringai/node_modules` 被 .gitignore 忽略（正確）。
- 其他環境 clone 後 `pnpm install` 自動重建依賴樹；勿把 node_modules 提交。

---

## 實作慣例（照抄現有 adapter，勿自創）
`packages/oa-framework/src/adapters/` 現有 11 個 adapter 全部遵循同一模式：
```ts
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';
export class XxxAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'xxx';
  readonly label = '...';
  readonly runtime = 'ts' as const;
  constructor(config: OAFrameConfig) { /* 存 config */ }
  async bootstrap() { try { await import('pkg'); return { ok: true }; } catch { return { ok:false, error:'未安裝' }; } }
  async dispatch(task: OATask) { try { /* 動態 import + 真實 SDK 呼叫 */ } catch(e){ return { output:`[Xxx] ${task.prompt} (scaffold: ${e.message})` }; } }
  async health() { try { await import('pkg'); return { status:'ok' }; } catch { return { status:'down', detail:'scaffold' }; } }
}
```
關鍵：
1. **動態 import**，未安裝時 graceful 降級（不拋、不阻斷其他框架）。
2. `dispatch` 只回 `{ output: string }`，**5T 鑄造交給 Orchestrator 的 forgeT5**（守門不漏）。
3. 註冊三步：在 `core/types.ts` 的 `SubFrameId` 加 union 成員 → `adapters/oneringai.ts` 實作 → `index.ts` import+register+加入 `OA_SUBFRAMES`。

## OneRingAI adapter 落點（已實作，真實實跑通）
- `packages/oa-framework/src/adapters/oneringai.ts`：`id='oneringai'`，預設走本地 Ollama (`http://localhost:11434/v1`) 免費路徑；**預設 model = `qwen2.5:3b-instruct-q4_K_M`**（本機 Ollama 實存 tag；寫 `qwen2.5:3b` 會 404）；也可經 `llmBaseUrl` 指 OpenAI/Anthropic/Google。
- adapter 內部 `Agent.create({ connector:'oa-oneringai', model })` + `agent.run(task.prompt)` → 產出純文字回 Orchestrator 鑄 5T。
- 安裝的套件實際是 `@everworker/oneringai@1.0.1`（非 1.0.0，npm 已發 1.0.1）。

## 真實 API 形狀（實跑發現，勿憑空猜）
```ts
import { createOAFrame, verify5T } from '@esggo/oa-framework';
const orch = createOAFrame({ llmBaseUrl, llmApiKey:'ollama', llmModel:'qwen2.5:3b-instruct-q4_K_M' });
const results: OATaskResult[] = await orch.run(task);   // ← run 收 task，不是 createOAFrame(task).run()
const artifact = results[0];
artifact.output;     // ← 欄位是 output，不是 content
artifact.t5;        // ← 5T 狀態在 .t5，不是 .fiveT
artifact.hashLock;  // SHA-256 封印
const v = verify5T(artifact);  // ← 回 { pass: boolean, failed:[], gates:[], contentPassed:boolean }，不是 boolean
if (!v.pass) { /* 依 §19 不可寫入 */ }
```
- `OATask.routeTo: string[]` 指定路由（如 `['oneringai']`）；不指定則並行全部已註冊 adapter。
- `OAOrchestrator.run(task, perRouteTimeoutMs=45000)`：**每 route 獨立 45s timeout**，逾時/失敗回 scaffold 錯誤不阻斷其他（這是修 smoke 逾時的根本）。

## 驗證步驟（交付前必跑，真實經驗）
```bash
cd packages/oa-framework
# ⚠️ 勿用 pnpm run typecheck/test —— pnpm 11 前置 install 會因 workspace prepare 鎖 .git/config 失敗 (ERR_PNPM_IGNORED_BUILDS)，在跑到 tsc 前就 abort。
# 直接用 npx 繞過 pnpm 前置（套件已裝在 node_modules）：
npx tsc -p tsconfig.json --noEmit   # Windows 路徑，勿用 /c/... 前綴（MSYS tsc 假報 TS6053）
npx tsx test/oneringai-real.ts      # 真實實跑：Ollama qwen2.5:3b → 5T Hash Lock PASS, REAL_EXIT=0
npx tsx test/app-integration-demo.ts # app 消費層端到端示範, DEMO_EXIT=0
npx tsx test/smoke.ts               # 全 11 框架並行 + 5T 鑄造, 60s 內結束, RESULT: ALL_11_FRAMEWORKS_OK
# 或一鍵驗收 (跨平台 bash):
bash test/verify-oneringai.sh        # 依序跑 tsc + 3 實跑, 4/4 全綠則 ALL GREEN
```

## 真實風險（Hermes 環境已偵測）
- `hermes permanent pyyaml==6.0.3 METADATA 缺失`（上次 `hermes update` 中斷）。修復需關閉 Hermes Desktop/其他 hermes 程序後重跑 `hermes update`（涉及占用中 hermes.exe，有風險，不要自動執行）。
- 該損壞**不影響** esggo 程式碼任務（Python 側，tsc 獨立）。
- pnpm workspace `prepare` 腳本鎖 `.git/config` 致 `INSTALL_EXIT=1` / `pnpm run test` 前置 abort（非程式錯）；以 `npx` / `bash test/verify-oneringai.sh` 直接驗證繞過。

## 參考文件
- 完整分析：`docs/oneringai-vs-oa-framework-analysis.md`（esggo repo 根）
- soul 三層交付：`soul-full.md` §26 + `soul-chapter-26-oneringai-integration.md` + `esggo-learning-center/soul-appendix-oa-framework.md`
- OA 框架 README：`packages/oa-framework/README.md`
- 5T 鑄造：`packages/oa-framework/src/core/t5.ts`；閘門：`packages/oa-framework/src/core/omni-gate.ts`
- Orchestrator：`packages/oa-framework/src/core/orchestrator.ts`（per-route timeout）
