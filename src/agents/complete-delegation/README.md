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

> 已知限制（後續項目）：尚無獨立**稽核日誌** sink；決策引擎策略可擴充；
> 與實際 gateway 的端對端串接仍在規劃。見第 7 節。

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
權限須為八種 + `full` 之一；`permissions` 非空。

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
// 200 → { success, executionId, result, error, duration }
```

---

## 6. 自主決策引擎

`AutonomousDecisionEngine`：
- `makeDecision(ctx: DecisionContext)`：依 `intent` / `options` / `constraints` 產生 `AutonomousDecision`（含 `decisionId`、`selectedOption`）。
- `assessAutonomyCapability()`：評估代理自主能力。
- `recordDecision()`：紀錄決策（記憶體 store）。
- `reportToPrincipal()`：將決策回報 principal。

取得單例：`getDecisionEngine()`；測試重置：`resetDecisionEngine()`。

---

## 7. 後續擴充（進行中）

1. **稽核日誌**：將 `recordDecision` / 執行結果寫入可查詢的 audit sink（持久化）。
2. **權限擴充**：新增細粒度權限類型與對應 `validateDelegation` 分支。
3. **決策策略**：可插拔策略（conservative / balanced / aggressive）影響 `makeDecision`。
4. **Gateway 端對端**：使 `executeCompleteDelegationTask` 透過 `omni-gateway` 實際轉發執行，而非本地 stub。

---

## 8. 測試

覆蓋套件（位於 `tests/`，全測試 317 passed）：
- `complete-delegation.test.ts` — manager / agent / 決策引擎
- `api-routes.test.ts` — 上述 5 個 REST 端點
- `integration.test.ts` — 端到端流程
- `performance-optimizer.test.ts` — 連線池 / 效能
- `esg-analysis.test.ts` — 評分（D5）

執行：`npx vitest run tests/complete-delegation.test.ts tests/api-routes.test.ts tests/integration.test.ts tests/performance-optimizer.test.ts tests/esg-analysis.test.ts`
