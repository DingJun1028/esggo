## Goal
- 完全代主自行「每樣都是」①②③④ 全併 main；依平台不變量「全域・全端・全量・RWD・雙向同步・TypeScript」完成深貫廣通 / 承上啟下。
- 所有 WIP 清理完畢、全量日誌持久化驗證、監控消費者、RWD UI 完善。

## Constraints & Preferences
- 【平台不變量】全域・全端・全量・RWD・雙向同步・TypeScript。
- 不污染 main；合併/PR 嚴守 G1(保護舞步)/G4(草稿不進 PR)。
- 使用繁體中文回應。

## Progress
### Done
- **361 passed / 0 failed** | tsc clean | main HEAD = a8871066b
- ①②③④ + #3收尾 + 平台不變量對齊 全數合併 main。
- PR #248~#271 全數合併（G1 舞步：DELETE → admin merge → PUT 重建）。
- AuditLogger configurable maxEntries（#271）：0=不限 / >0=環形緩衝截斷。
- DelegationEventStream RWD mobile layout（#269）：事件色彩、可展開 payload、Lucide icons。
- Health checker（#269）：journal + metrics + event flow + alerts 四項健康檢查。
- Journal persistence E2E test（#269）：5 筆全量日誌驗證。
- Alert notifier webhook（#270）：閉環 / 失敗容錯 / 無 self-loop。
- Unified publishBusEvent（chore #lib）：SHA-256 hashLock + enhancedOmniBus 單一發布路徑。

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- AuditLogger：maxEntries 預設 0（全量留存），僅在明確設定時才截斷。
- 健康檢查器整合 metrics + journal + 事件流活性 + 告警存在性四項。
- publishBusEvent 統一發布原語：所有子系統（委派/閘道器）走同一條帶 hashLock 的路徑。

## Next Steps
- 可延伸：郵件通知、monorepo 其他子系統套用統一發布模式。
- 可評估 E2E 整合測試（health + metrics + alerts + SSE 一體化驗證）。

## Critical Context
- ⚠️ G1 PUT 保護 body 必須用乾淨 body（無 url 包裹層）。
- main 保護已重建（required_approving_review_count:1 / dismiss_stale_reviews:true）。
- 倉內文字檔全為合法 UTF-8，亂碼純為 PowerShell 顯示層問題。

## Relevant Files
- src/lib/bus.ts：統一發布原語 publishBusEvent。
- src/agents/complete-delegation/health.ts：系統健康檢查器。
- src/agents/complete-delegation/metrics.ts：指標觀測器 + 告警評估。
- src/agents/complete-delegation/autonomous-decision-engine.ts：AuditLogger（configurable maxEntries）。
- src/components/delegation/DelegationEventStream.tsx：RWD 事件流面板。
- src/app/api/delegation/health/route.ts：健康檢查 API。
- src/app/api/healthz/route.ts：整合委派健康檢查。
- tests/journal-persistence.test.ts：全量日誌 E2E 測試（5 筆）。
- tests/audit-logger.test.ts：AuditLogger 全量留存測試（3 筆）。
