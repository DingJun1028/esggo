# 完全代主自行 (Complete Autonomous Delegation)

讓 **agent 在授權範圍內代理使用者（principal）自主決策與執行** 的機制。
結合簽章驗證、約束條件（constraints / restrictions）、自主決策引擎、執行歷程與回報，
實現「使用者委派 → agent 自主完成」的端到端能力。

> 狀態：已合併 `main`（功能 PR #229；安全修補 D1–D5 PR #231；紀錄 PR #237）。
> 安全漏洞 D1–D5 均已 fixed，詳見 `ERROR-LEDGER.md`。

---

## 1. 架構與元件

| 元件 | 檔案 | 職責 |
|------|------|------|
| `CompleteDelegationManager` | `delegation-manager.ts` | 建立 / 簽章 / 驗證 / 終止授權範圍；列舉活躍授權 |
| `CompleteDelegationAgent` | `complete-delegation-agent.ts` | 代理執行 `executeOnBehalfOfPrincipal`、約束與歷程、授權驗證 |
| `AutonomousDecisionEngine` | `autonomous-decision-engine.ts` | 自主決策 `makeDecision`、能力評估、決策紀錄、回報 principal |
| `PerformanceOptimizer` / `ConnectionPool` | `performance-optimizer.ts` | 連線池（waiters 佇列，見 D3）與效能優化 |
| `ESGAnalysisEngine` | `src/lib/esg-analysis/engine.ts` | ESG 評分運算（D5 已防 NaN） |
| 型別 | `src/types/complete-delegation.ts` | `ICompleteDelegationManager`、`ICompleteDelegationScope`、`DelegationPermission` 等 |

入口聚合於 `src/agents/complete-delegation/index.ts`：
`createCompleteDelegationAgent`、`executeCompleteDelegationTask`、`getDelegationManager`、`getDecisionEngine`。

---

## 2. 授權生命週期

```
principal ──建立──> CompleteDelegationManager.createCompleteDelegation()
                         │  產生 ICompleteDelegationScope
                         │  signDelegation() → SHA-256 簽章 (scope.signature)
                         ▼
                  儲存於 store (get/terminate/getActiveDelegations)
                         │
agent ──代理執行──> CompleteDelegationAgent.executeOnBehalfOfPrincipal(intent)
                         │  1. validateAuthorization(intent)        → manager.validateDelegation()
                         │  2. generateOptions(intent, context)
                         │  3. decisionEngine.makeDecision(ctx)     → 含 recordDecision()
                         │  4. executeTask(decision, context)
                         │  5. 紀錄結果 + reportToPrincipal()
                         ▼
                  執行歷程 (getExecutionHistory) / 決策回報 (reportToPrincipal)
                         │
principal ──終止──> manager.terminateDelegation(id, reason)  → 移除授權
```

### 驗證（D1 修復後）
`validateDelegation(delegationId, permission)` 執行：
1. 從 store 取得 scope（不存在 → `false`）
2. 時間窗檢查：`now < validFrom || now > validUntil` → `false`
   - 無期限時 `validUntil = Number.MAX_SAFE_INTEGER`（D2）
3. 權限檢查：`permissions.includes(permission) || permissions.includes('full')`
4. **簽章驗證**：`verifySignature(scope)` 重新計算 SHA-256 並比對 `scope.signature`
   （舊版 `return true` 繞過已移除）

---

## 3. 權限模型

`DelegationPermission` 八種 + 萬用 `full`：

| 權限 | 說明 |
|------|------|
| `read` | 讀取資源 |
| `write` | 寫入 / 變更 |
| `execute` | 執行任務 / 動作 |
| `decide` | 自主決策 |
| `delegate` | 再委派 |
| `govern` | 治理操作 |
| `audit` | 稽核 |
| `monitor` | 監控 / 觀測（只讀觀測，不含變更） |
| `full` | 包含以上全部（wildcard） |

`validateDelegation` 中 `full` 視為涵蓋任何 required permission。

---

## 4. 安全模型

| 機制 | 實作 |
|------|------|
| 簽章 | `signDelegation` 對 `{delegationId, principalId, agentId, permissions, validFrom, validUntil}` 做 SHA-256；`verifySignature` 重算比對 |
| 效期 | `validUntil` 預設 `Number.MAX_SAFE_INTEGER`（無期限），過期即 `validateDelegation=false` |
| 約束 | `getConstraints()` 依 restrictions + 有效期限產生 `DecisionConstraint[]`（severity: `hard`） |
| 最小權限 | 建立時校驗權限列舉；執行前 `validateDelegation(id, 'execute')` 把關（API 回 403） |

> 已實作：決策引擎支援**可插拔策略**（`conservative` / `balanced` / `aggressive`，預設 `balanced`，
> 行為與舊版一致）；`AuditLogger` 內建記憶體環形緩衝區 + 可掛載 `auditSink`（持久化 / 轉送外部儲存）、
> 支援 `getLogs()` / `query()`；`CompleteDelegationManager` 於建立 / 驗證 / 終止時寫入審計日誌。
> 唯與實際 `omni-gateway` 的端對端串接仍在進行（見第 7 節）。

---

## 5. API 參考

基底：`/api/delegation`

### POST `/api/delegation` — 建立授權
```jsonc
// body
{ "principalId": "user-123", "agentId": "agent-001",
  "permissions": ["read","write","execute"], "validUntil": 1783769300000, "description": "..." }
// 201 → { success, delegation: { delegationId, agentId, principalId, permissions, validFrom, validUntil, description } }
```
權限須為九種（含 `monitor`） + `full` 之一；`permissions` 非空。

### GET `/api/delegation` — 活躍授權列表
`?principalId=` 可選；回傳 `{ success, delegations[], count }`。

### GET `/api/delegation/[id]` — 取得單筆
`404` 若不存在。

### DELETE `/api/delegation/[id]` — 終止
body `{ "reason": "..." }` 可選；回傳 `{ success, delegationId, reason }`。

### POST `/api/delegation/[id]/execute` — 執行任務
```jsonc
// body
{ "intent": "產生 Q3 ESG 報告", "context": { ... } }
// 驗證：delegation 存在(404) → validateDelegation(id,'execute')(403)
// 200 → { success, executionId, result, error, duration, gateway: { startHashLock, completeHashLock } }
```

### GET `/api/delegation/audit?delegationId=xxx` — 審計軌跡
```jsonc
// 需具備 monitor（或 full）權限；回傳該授權生命週期審計事件（全量）
// 驗證：delegation 存在(404) → validateDelegation(id,'monitor')(403)
// 200 → { success, delegationId, count, entries: [ DELEGATION_CREATED / DELEGATION_VALIDATED / DELEGATION_TERMINATED ... ] }
// 全量：經 createFileAuditSink（append-only JSONL，預設 .audit/delegation-audit.jsonl）
//       持久化，不抽樣、不截斷；設 AUDIT_FULL_VOLUME=false 可停用（退回記憶體環形緩衝）
```

### GET `/api/delegation/events/stream?delegationId=xxx` — 事件總線訂閱 (SSE)
```text
// 即時推送該 delegation 生命週期事件（text/event-stream）
// 需具備 monitor（或 full）權限；驗證：delegation 存在(404) → validateDelegation(id,'monitor')(403)
// 無 delegationId → 400
// 每幀：data: { "type": "<事件名>", "delegationId": "...", "hashLock": "<64hex>", "ts": <ms>, "payload": {...} }\n\n
// 首幀為 { "type": "CONNECTED", "delegationId": "...", "ts": <ms> }
// 斷線自動退訂
```

**事件消費者範例**（前端 EventSource / Node fetch 皆可）：
```ts
// 瀏覽器：EventSource（自動重連；不支援自訂 header，權限由 delegation 的 monitor 授權隱含）
const es = new EventSource(
  `/api/delegation/events/stream?delegationId=${delegationId}`
);
es.onmessage = (e) => {
  const evt = JSON.parse(e.data);
  if (evt.type === 'CONNECTED') return console.log('已訂閱', evt.delegationId);
  console.log('委派事件', evt.type, 'hashLock', evt.hashLock, evt.payload);
};
es.onerror = () => es.close();

// Node 端：fetch + 讀取 stream
const res = await fetch(`/api/delegation/events/stream?delegationId=${delegationId}`);
const reader = res.body.getReader();
const dec = new TextDecoder();
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  const frame = dec.decode(value);            // 含 "data: {...}\n\n"
  const json = frame.replace(/^data: /, '').trim();
  const evt = JSON.parse(json);
  console.log('委派事件', evt);
}
```

也可直接在應用內訂閱同一條 `omni-agent-bus`（與 SSE 端點同源）：
```ts
import { enhancedOmniBus } from '../lib/omni-agent-bus';
const unsub = enhancedOmniBus.subscribe('external-forward', (ev) => {
  const p = ev.payload as { type?: string; delegationId?: string };
  if (p?.type?.startsWith('delegation.') && p.delegationId === delegationId) {
    console.log('委派事件', p.type, (ev as any).hashLock);
  }
});
// ... 使用完畢 unsub();
```

### POST `/api/delegation/events` — 雙向回寫 (client → bus)
```jsonc
// body
{ "delegationId": "del_xxx", "type": "delegation.decision.made",
  "topic": "delegation.decision",            // 可省，將依 type 推導
  "payload": { "decisionId": "dec-xyz" } }
// 驗證：delegationId 存在(404) → validateDelegation(id,'execute')(403) → type 須為 DelegationEventNames 值(400)
// 200 → { success, hashLock }   (hashLock 為 SHA-256，溯源回寫事件)
// 與 GET /api/delegation/events/stream（server→client）互補，構成委派事件雙向同步
```
雙向同步語意：client 經 `POST` 回寫事件至同一 `omni-agent-bus`（`external-forward`），所有 `GET /stream` 訂閱者（含其他 client）即時收到 → 狀態雙向一致。

> **事件總線貫通（深貫廣通）**：授權生命週期（`DELEGATION_CREATED` / `VALIDATED` / `TERMINATED`）由 `CompleteDelegationManager`、
> 決策（`DELEGATION_DECISION_MADE`）由 `AutonomousDecisionEngine`、回報（`DELEGATION_DECISION_REPORTED`）由 agent、
> 執行（`DELEGATION_EXECUTION_STARTED` / `COMPLETED`）由執行路由，統一經 `omni-gateway.secureForward` 轉發至
> `omni-agent-bus`（SHA-256 `hashLock` 溯源），供監控 / 分析元件訂閱。封裝見 `events.ts` 之 `publishDelegationEvent`（fire-and-forget，發布失敗不影響主流程）。

---

## 6. 自主決策引擎

`AutonomousDecisionEngine`：
- `makeDecision(ctx: DecisionContext)`：依 `intent` / `options` / `constraints` 產生 `AutonomousDecision`（含 `decisionId`、`selectedOption`）。
- `assessAutonomyCapability()`：評估代理自主能力。
- `recordDecision()`：紀錄決策（記憶體 store）。
- `reportToPrincipal()`：將決策回報 principal。

取得單例：`getDecisionEngine()`；測試重置：`resetDecisionEngine()`。

---

## 7. 後續擴充

- [x] **稽核日誌**：`AuditLogger`（`autonomous-decision-engine.ts`）內建記憶體環形緩衝區（上限 1000 筆）+
      可掛載 `auditSink`（持久化 / 轉送外部儲存），並提供 `getLogs()` / `query()`；
      `CompleteDelegationManager` 於 `DELEGATION_CREATED` / `DELEGATION_VALIDATED` / `DELEGATION_TERMINATED`
      寫入審計日誌，對外開放 `getAuditTrail()`。
- [x] **權限擴充**：新增 `monitor`（監控 / 觀測）權限類型，已納入型別與 API / manager 列舉校驗。
- [x] **決策策略**：可插拔策略（`decision-strategy.ts`）`conservative` / `balanced` / `aggressive`，
      經 `getDecisionEngine({ strategy })` / `new AutonomousDecisionEngine({ strategy })` 注入，
      `makeDecision` 委託 `strategy.select()` 選擇最佳方案。
- [x] **Gateway 端對端**：`POST /api/delegation/[id]/execute` 於執行前 / 後經 `omni-gateway.secureForward` 實際轉發 `DELEGATION_EXECUTION_STARTED` / `DELEGATION_EXECUTION_COMPLETED` 至 `omni-agent-bus`（含 SHA-256 `hashLock` 溯源）；回應附 `gateway.startHashLock` / `gateway.completeHashLock`。另含 route-level e2e 測試斷言回傳 64 字元 hashLock。
- [x] **事件訂閱 SSE**：`GET /api/delegation/events/stream?delegationId=` 經 `enhancedOmniBus` 訂閱 `external-forward`，即時推送該 delegation 生命週期事件（含 `hashLock` 溯源），`monitor`（或 `full`）權限把關、斷線自動退訂。亦可直接於應用內 `enhancedOmniBus.subscribe('external-forward', ...)` 消費（見第 5 節「事件消費者範例」）。
- [x] **事件雙向同步**：`POST /api/delegation/events` 接收 client 經同一 `omni-agent-bus`（`external-forward`）回寫的委派事件（需 `execute`/`full` 權限），與 SSE（server→client）互補構成雙向同步；回寫事件同樣附 SHA-256 `hashLock` 溯源。
- [x] **全量審計留存**：`AuditLogger` 掛載 `createFileAuditSink`（append-only JSONL，預設 `.audit/delegation-audit.jsonl`，可經 `AUDIT_SINK_PATH` 覆寫），每筆審計除記憶體環形緩衝區（近期視圖）外另持久化，實現不抽樣、不截斷的全量留存；`getFullAuditTrail(delegationId?)` 讀回全量日誌，`/api/delegation/audit` 改經此取全量軌跡。設 `AUDIT_FULL_VOLUME=false` 停用（退回環形緩衝）。

---

## 8. 測試

覆蓋套件（位於 `tests/`，全測試 327 passed）：
- `complete-delegation.test.ts` — manager / agent / 決策引擎
- `api-routes.test.ts` — 上述 5 個 REST 端點
- `integration.test.ts` — 端到端流程
- `performance-optimizer.test.ts` — 連線池 / 效能
- `esg-analysis.test.ts` — 評分（D5）

執行：`npx vitest run tests/complete-delegation.test.ts tests/api-routes.test.ts tests/integration.test.ts tests/performance-optimizer.test.ts tests/esg-analysis.test.ts`
