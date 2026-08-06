# ESGGO 除錯手帳 (Debug Ledger)

> 用途：記錄非顯而易見的除錯過程、根因與決策依據，供後續「相同症狀」快速定位。
> 最後更新：2026-07-12

---

## 一、完全代主自行 — 事件總線統一發布（深貫廣通）

### 症狀 / 動機
各組件（manager / engine / agent / 執行路由）原本各自以不同方式產出事件，
沒有統一出入口，監控 / 分析元件難以一致訂閱；且執行路由有 inline `toBusEvent` 重複建 `IBusEvent`。

### 決策
新增 `src/agents/complete-delegation/events.ts` 之 `publishDelegationEvent(type, topic, payload, source)`：
- 統一對外轉發點，內部呼叫 `omni-gateway.secureForward`（SHA-256 `hashLock` 溯源）。
- **fire-and-forget**：內部 `try/catch`，發布失敗回傳 `{ status:'error', hashLock:'' }`，不影響主業務流程（觀測性不應阻斷業務）。
- 事件名統一走 `DelegationEventNames`（`'delegation.created'` 等 dot 形式，非 `DELEGATION_CREATED` 大寫）。

### 接線清單（經 #248 合併）
| 來源 | 事件 | 主題 |
|------|------|------|
| `CompleteDelegationManager` | `delegation.created` / `validated` / `terminated` | `delegation.authorization` |
| `AutonomousDecisionEngine` | `delegation.decision.made` | `delegation.decision` |
| `AutonomousDecisionEngine` / `CompleteDelegationAgent` | `delegation.decision.reported` | `delegation.reporting` |
| 執行路由 | `delegation.execution.started` / `completed` | `delegation.execution` |

### 消費方式
1. SSE：`GET /api/delegation/events/stream?delegationId=`（monitor 權限把關，#251）。
2. 應用內：`enhancedOmniBus.subscribe('external-forward', cb)`（見 README「事件消費者範例」）。

---

## 二、vitest 模組實例陷阱（bus 收 0 事件）— 根因與繞法

### 症狀
在 `tests/complete-delegation.test.ts` 用：
```ts
const received = [];
enhancedOmniBus.subscribe('external-forward', (e) => received.push(e));
await createCompleteDelegationAgent({...});   // 內部經 secureForward 發布
await sleep(20);
// received.length === 0  ← 失敗
```
但同測試內 `enhancedOmniBus.publish('external-forward', {...})` 直接發 → `received.length === 1`（成功）。

### 根因
`enhancedOmniBus` 是 `src/lib/omni-agent-bus.ts` 的單例（`export const enhancedOmniBus = new SimpleOmniBus()`）。
但在 vitest 下：
- **測試直接 import** 的 `enhancedOmniBus` 是一份模組實例 A。
- **生產鏈經 `omni-gateway`**（`src/core/services/omni-gateway.ts` → `../../lib/omni-agent-bus`）import 的是
  另一份模組實例 B（相對路徑 / 掛載點差異導致 vitest 未去重，解析成不同模組拷貝）。

`secureForward` 往 B 發，測試訂閱 A → 兩份 `new SimpleOmniBus()` 互不連通 → 收 0 筆。
**生產環境（Next 單一模組圖）只有一份實例，行為正確**，此為純測試假象。

### 繞法（已採用）
- 驗證「各組件確實發布」改用 `vi.spyOn(delegationEvents, 'publishDelegationEvent')`：
  manager / engine / agent 直接呼叫的就是同一份 `events` 模組，spy 穩健無歧義，且能斷言事件名 / 主題 / payload。
- 若需端對端驗證 SSE 串流（`tests/api-routes.test.ts`）：SSE 路由**直接 import** `enhancedOmniBus`（與測試同類 import），
  故其訂閱的實例 == 測試直接 import 的實例；測試內 `enhancedOmniBus.publish(...)` 即可被路由的 subscriber 收到（實測通過）。

### 雷區提醒
- 判斷 vitest「bus 收不到」時，先區分是**真 bug** 還是**模組實例拷貝**；直接 publish 同實例能收即代表機制正常。
- 永遠不要在事件名比對時用大寫 `DELEGATION_CREATED`：`DelegationEventNames` 的值是 dot 形式 `'delegation.created'`；
  總線上 `ev.payload.type` 才是事件名，`ev.event` 亦同。

---

## 三、SSE 路由權限把關
`GET /api/delegation/events/stream` 與 audit API 一致：
`manager.validateDelegation(delegationId, 'monitor')`（`full` 視為涵蓋 monitor）。
缺 `delegationId` → 400；不存在 → 404；無權限 → 403；成功 → `text/event-stream`，首幀 `CONNECTED`，斷線 `request.signal` abort 自動 `unsub()` + `controller.close()`。
