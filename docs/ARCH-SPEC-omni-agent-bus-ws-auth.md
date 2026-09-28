---
source_origin: 万能分身超觉醒 session (2026-09-28) / OmniAgentBus + Gateway WS auth CI 閉環
created: 2026-09-28
modified: 2026-09-28
co_authors: [agent:01, agent:07, agent:11, agent:30]
lifecycle: active
access: public-research
---

# 架構規格書：OmniAgentBus 分身總線 × Gateway WS 認證 × CI 閉環

> 5T-Traceable: 本文件由 `feat/oa-swarm-array-routing-ws-auth` 分支之實測證據反推撰寫，非事前設計文件。
> 5T-Trackable: 每條「驗證閘」皆對應可重現的指令與 exit code。
> 5T-Tangible: 規格中的所有數字均為本機實跑輸出，無估算值。
> 5T-Transparent: 未實測項以「⏸ 待 CI 實測」明示。
> 5T-Trustworthy: 產物 `dist/` 為 gitignored，僅經 `test:dist` 產物匯入煙霧驗證後釋出。

---

## 1. 系統定位

```
                     ┌─────────────────────────────────────┐
                     │   OA-Team 30 蜂群矩陣 (SSOT)         │
                     │   apps/gateway/oa-swarm-matrix.mjs  │
                     │   5 陣列 × 6 = 30, Object.freeze    │
                     └──────────────┬──────────────────────┘
                                    │ 派工關鍵字路由
                                    │ inferAgentNum(prompt, allowedNums)
                                    ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  OmniAgentBus — 代理總線 (packages/omni-agent-bus)               │
  │                                                                   │
  │   publish(topic, from, payload)                                   │
  │        │                                                          │
  │        ├─► 5T Gate (總線級單一旗標 gateEnabled)                   │
  │        │      ├─ pass  → 圓通扇出至所有已訂閱分身                  │
  │        │      └─ fail  → 轉 <topic>.rejected (無人收)              │
  │        │                                                          │
  │        └─► handlers: Map<string, Set<BusHandler>>                │
  │               無數量上限常數 → 分身數僅受記憶體與 handler 延遲    │
  └──────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────────────┐
                     │  Gateway WS 認證 (apps/gateway)      │
                     │  候選來源: query token / subprotocol │
                     │            X-Omni-Token / Bearer     │
                     │  多候選遮蔽 + 嚴格相等 + 逐一路由    │
                     └─────────────────────────────────────┘
```

---

## 2. 組件規格

### 2.1 蜂群矩陣 SSOT — `apps/gateway/oa-swarm-matrix.mjs`

| 項目 | 規格 | 實測值 |
|------|------|--------|
| 代理總數 | 恰 30 | 30 ✅ |
| 陣列數 | 恰 5，id 1-5 | 5 ✅ |
| 每陣列人數 | 恰 6（MECE 互斥且窮盡） | 6/6/6/6/6 ✅ |
| 編號連續性 | 01-30 無缺漏 | ✅ |
| 陣列歸屬 | 01→策略 / 12→技術 / 18→創意 / 24→營銷 / 30→守衛 | ✅ |
| 不可篡改 | `Object.isFrozen` 對陣列與每個成員皆 true | true ✅ |
| 21 vs 03 | 萬能商業分析蜂 vs 萬能分析蜂 命名區隔 | ✅ |

**關鍵設計：關鍵字遮蔽防護**

`CAPABILITY_KEYWORDS` 會互相遮蔽。`資安分析報告` 同時命中 `分析`(03) 與 `資安`(27)。
若不先以 `allowedNums` 限定陣列，表格順序會決定勝負 → 派給守衛組（不含 03）時
退回 25 測場蜂，漏掉 27 資安蜂。命中多個時取**最長關鍵字**，讓 `平面設計` 勝過 `設計`。

實測：

| 輸入 | 限定陣列 | 結果 | 期望 |
|------|---------|------|------|
| 資安分析報告 | 守衛組 {25..30} | 27 | 27 ✅ |
| 做一張平面設計圖 | 創意組 {13..18} | 13 | 13 ✅ |

**邊界**：`listAgents(0)` 不可用 `!arrayId` 判斷 — `0` 為 falsy，會被誤判成「未指定」
而回傳全部 30 位。必須顯式檢查 `undefined / null / '' / 'all'`。

### 2.2 OmniAgentBus — `packages/omni-agent-bus`

| 項目 | 規格 | 實測值 |
|------|------|--------|
| 分身上限 | **無硬編碼上限** | 37 → 237 ✅ |
| 扇出耗時 | 237 分身 × 500 事件 < 5000ms | 3ms ✅ |
| 總投遞數 | — | 18774 ✅ |
| 5T 攔截 | 未過閘產出轉 `.rejected`，無人收到 | rejected=1 ✅ |
| 閘門語意 | **總線級**單一 `gateEnabled` 旗標 | 見下方警告 |

> ⚠️ **5T 閘粒度警告（勿誤述）**
> 閘門是「總線級」的單一旗標 + 內容級 `bus5TGate`，對所有 payload 一視同仁。
> **不存在**「每個分身各自受閘」的性質。`live-clones.smoke.ts` 驗證的是：
> 閘門的攔截/放行結果**不因分身數量而改變**。

**兩條並行的驗證面**：

| 面 | 測試 | 驗證對象 |
|----|------|---------|
| src 面 | 7 支 `*.smoke.ts`（tsx 直接跑 TS） | 原始碼行為 |
| dist 面 | `dist-smoke.mjs`（先 `tsc` 再 import） | **消費者真正 import 的產物** |

`dist-smoke.mjs` 需先 `tsc` 產生 `dist/`（gitignored），故獨立為 `test:dist`。

### 2.3 Gateway WS 認證 — `apps/gateway/ws-auth.test.mjs`

認證候選來源與優先序（多候選遮蔽防護：全部候選皆錯才拒絕）：

| 來源 | 格式 | 說明 |
|------|------|------|
| query | `?token=<T>` | 嚴格相等，`TOKENextra` 拒絕 |
| subprotocol | `bearer, <T>` / `auth.<T>` | 有效者優先，無關 header 不遮蔽 |
| header | `X-Omni-Token: <T>` | 既有 Node client 相容路徑 |
| header | `Authorization: Bearer <T>` | 標準路徑 |

**向後相容**：`WS_AUTH_TOKEN` 未設定時，啟動即印 `⚠️ 未啟用` 警告，任何人可連線（僅限本機/內網）。
設定後所有路徑強制認證，舊 client 需帶 token。

---

## 3. CI 驗證閘

### 3.1 根因：本分支 CI 紅燈

`apps/gateway/ws-auth.test.mjs` 是**腳本式**測試（頂層 `await` + `record()` + `process.exit`），
非 vitest 套件。根 `vitest run` 抓取後報 `No test suite found in file` → 整個 job exit 1。

```
Test Files  1 failed | 81 passed | 4 skipped (85)
     Tests  823 passed | 21 skipped (844)
Error: No test suite found in file apps/gateway/ws-auth.test.mjs
##[error]Process completed with exit code 1.
```

同一類問題在 `vitest.config.ts` 已有先例排除：`apps/omnilive/test/**`、
`apps/self-healing/test/**`、`apps/ftg-tools/**/*.test.mjs`、
`apps/universal-translator/test/**`（皆為 node:test 或腳本式）。

### 3.2 雙邊修正（排除 + 真實執行）

| 檔案 | 變更 | 理由 |
|------|------|------|
| `vitest.config.ts:51` | 排除 `apps/gateway/ws-auth.test.mjs` | 避免根 vitest 抓不到 suite |
| `.github/workflows/ci.yml:182` | 新增 `Run Gateway WS auth test (node script)` | **覆蓋率不減**，直接以 node 執行 25 斷言 |
| `.github/workflows/ci.yml:186` | 新增 `Run OmniAgentBus suite (src smoke + dist import)` | 補上 served-surface 缺口 |
| `.github/workflows/ci.yml:190` | 新增 `Typecheck OmniAgentBus tests` | 測試碼本身也要過 tsc |
| `packages/omni-agent-bus/package.json` | 新增 `test:dist` / `test:all` | dist-smoke 需先 build |

**排除 ≠ 遺棄。** 排除只是讓根 vitest 不去抓錯類型的檔案；真實執行交給
`node apps/gateway/ws-auth.test.mjs` 與 `pnpm -F @esggo/omni-agent-bus test:all`。

### 3.3 驗證閘對照表

| 閘 | 指令 | 實測結果 |
|----|------|---------|
| 根單元測試 | `npx vitest run` | exit 0 — 81 files / 823 tests passed |
| Repo 標準檢查 | `npm run check` | exit 0 — 4 files / 24 tests passed |
| 熵境 lint 閘 | `npm run lint` | exit 0 — 32 warnings, **0 errors** |
| 核心型別 | `npx tsc -p tsconfig.core.json` | exit 0 |
| 蜂群矩陣 SSOT | `npx vitest run apps/gateway` | exit 0 — 42 tests passed |
| WS 認證腳本 | `node apps/gateway/ws-auth.test.mjs` | exit 0 — 25/25 |
| 總線 src 面 | `pnpm -F @esggo/omni-agent-bus test` | exit 0 — 7 smoke 全過 |
| 總線 dist 面 | `pnpm -F @esggo/omni-agent-bus test:dist` | exit 0 — DIST_IMPORT_SMOKE_OK |
| 測試碼型別 | `pnpm -F @esggo/omni-agent-bus typecheck:test` | exit 0 |
| Workflow schema | `python .scratch/verify-workflows-schema.py` | exit 0 — 25 檔 0 錯誤 |
| Python 語法 | `python -m py_compile agent_mesh_tool.py` | exit 0 |

---

## 4. 關鍵設計決策

### ADR-A：lib/agents/omni-agent-bus.ts 退化成 re-export shim

**決策**：`.ts` 不再持有實作，改為帶型別的重導出薄層；正典為同目錄 `.js`。

**理由**（三重證據）：
1. 該 `.ts` 內容是純 CommonJS（`require` / `module.exports`、零型別標註），
   副檔名與內容不符。
2. 它的 API 與正典 `.js` 不相容 — 缺 `writeEntry` / `readEntry` /
   `queryBlackboard` / 註冊自癒 Hook。
3. 自身在嚴格型別下產生 **46 個 tsc 錯誤**（隱式 any、class 屬性不存在）。

**呼叫端追蹤證據**：三個 `require('./omni-agent-bus')` 呼叫端
（`knowledge-collector.js` / `omni-agent-bus-autonomy.js` / `omni-agent-bus-hook.js`）
皆解析到同目錄 `.js`（Node CJS 解析不認 `.ts`），零呼叫端 import 該 `.ts`。

**後果**：`require.main === module` 守衛在 shim 下不觸發，autonomy 心跳不會啟動。
`scripts/start-orchestrator.sh` 已同步改指 `.js`。

### ADR-B：dist-smoke 與 src smoke 分離

`*.smoke.ts` 走 tsx（直接跑 TS），`dist-smoke.mjs` 走 node（import 編譯產物）。
兩者驗證面不同：前者證「原始碼對」，後者證「發出去的東西對」。
只跑前者會漏掉 tsc 設定錯誤、匯出遺漏、package.json `main` 指錯等**只在產物顯現**的缺陷。

---

## 5. 已知邊界與未驗證項

| 項目 | 狀態 | 說明 |
|------|------|------|
| CI 於 ubuntu runner 實測 | ⏸ **待驗證** | 本地為 Windows。`ws-auth.test.mjs` 已刻意不寫死路徑（由 `import.meta.url` 推導），跨平台性只由既有 CI 歷史佐證，本輪未實測 |
| `Code scanning AI findings` 紅燈 | ⚫ **非 repo 缺陷** | 根因為 GitHub Copilot 服務端 `CAPIError: 400 The requested model is not supported`，repo 內無法修 |
| `dist-smoke` 合規文本長度 | ⚠️ **耦合** | 文本長度 281 綁定 `src/bus.ts` 的 `GATE_MIN_LENGTH`（最高 tangible ≥ 200）。常數調高需同步延長 fixture，否則測試以「某維度掉下去」形式紅燈（失敗訊息會指出具體維度） |
| 30 蜂群 × 7 子框架 = 37 分身 | ✅ 已驗 | `live-clones.smoke.ts` 第 2 節實跑 |
| `ollama_model_tool` 殘留引用 | ✅ 無殘留 | ripgrep 全 repo 掃描：tracked files 0 matches |

---

## 6. 失敗模式與處置

| 失敗模式 | 徵兆 | 處置 |
|----------|------|------|
| 腳本式測試被 vitest 抓取 | `No test suite found in file` | 加 `vitest.config.ts` exclude **且** 補 CI 腳本步驟（不可只排除） |
| `listAgents(0)` 回傳 30 位 | 派工數量異常 | 不可用 `!arrayId`，改顯式檢查 `undefined/null/''/'all'` |
| 關鍵字遮蔽 | 派給錯誤代理 | 先用 `allowedNums` 限定陣列，再取最長關鍵字 |
| 5T 閘語意誤述 | 文檔宣稱「每分身受閘」 | 閘門是總線級旗標，一視同仁 |
| dist 匯出遺漏 | 消費端 `ERR_MODULE_NOT_FOUND` | 跑 `test:dist`，不可只跑 src smoke |
| pre-commit hook 吞掉 commit | shell 回 exit 0 但 HEAD 未推進 | 必查 `git log --oneline -3` 比對 HEAD hash |
| `.scratch/` 被 gitignore | 暫存檔未進 commit | 需 `git add -f` |

---

## 7. 驗證方法論

本輪所有「通過」宣稱皆滿足以下三條件：

1. **真實指令執行**，非描述。非零 exit 即失敗，不以 `tail` 管線的 exit 掩蓋。
2. **從來源抽出字串逐字執行** — CI 步驟的 `run:` 由 YAML 解析後交給 subprocess，
   而非手打複寫，消除「驗證的不是同一條命令」風險。
3. **負向測試驗證驗證器** — schema 驗證器以注入缺陷測試（缺 runs-on、uses+run 併存、
   `on: [push]` sequence 形式），確認它會擋且不會崩潰。

> 本地 `act` 與 `actionlint` 皆未安裝（`command -v` 回空）— 誠實標示，
> 以 schema 必要鍵檢查替代，不假稱已用 actionlint 驗證。

---

*文件由 agent:01（蜂后）統籌 · agent:07（編碼）· agent:11（測試）· agent:30（質控）*
*5T 狀態：Traceable ✅ · Trackable ✅ · Tangible ✅ · Transparent ✅ · Trustworthy ⏸（dist 待 CI 實測）*
