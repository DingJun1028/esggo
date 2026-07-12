## Goal
- 完全代主自行「每樣都是」①②③④ 全併 main；依平台不變量「全域・全端・全量・RWD・雙向同步・TypeScript」完成深貫廣通 / 承上啟下。
- 所有 WIP 清理完畢、全量日誌持久化驗證、監控消費者、RWD UI 完善。

## Constraints & Preferences
- 【平台不變量】全域・全端・全量・RWD・雙向同步・TypeScript。
- 不污染 main；合併/PR 嚴守 G1(保護舞步)/G4(草稿不進 PR)。
- 使用繁體中文回應。

## Progress
### Done
- **734 passed / 0 failed** (vitest 實跑，非舊 summary 聲稱之 369) | model-router.ts 通過 tsconfig.verify.json 靜態檢查（9 個 pre-existing 錯誤非本次引入）| branch HEAD = 7596f6a29
- ①②③④ + #3收尾 + 平台不變量對齊 全數合併 main。
- PR #248~#273 全數合併（G1 舞步：DELETE → admin merge → PUT 重建；本代理程式碼編輯由平行自動化管線自動 branch + PR + 合併，無須手動）。
- AuditLogger configurable maxEntries（#271）：0=不限 / >0=環形緩衝截斷。
- DelegationEventStream RWD mobile layout（#269）：事件色彩、可展開 payload、Lucide icons。
- Health checker（#269）：journal + metrics + event flow + alerts 四項健康檢查。
- Journal persistence E2E test（#269）：5 筆全量日誌驗證。
- 告警外部通知 + SSE 即時可見（#270）：觀測器產生告警時呼叫外部通知器（webhook）+ 發布 delegation.alert.raised 事件至同一 bus（SSE 即時可見）；ingest 對該類型提早 return（no self-loop）；閉環 / 失敗容錯。
- Unified publishBusEvent（#272, chore #lib）：SHA-256 hashLock + enhancedOmniBus 單一發布路徑；omni-gateway.secureForward 委託之。
- 告警郵件通知 + 複合扇出（#273）：createEmailNotifier（經郵件閘道 webhook，免 SMTP 相依）+ createCompositeNotifier 扇出至多 sink；getDefaultAlertNotifier 依環境組出 webhook+郵件。
- Gemma 本地模型整合（feat/gemma-local-free-vps）：新增 local_gemma provider（Ollama VPS，100% 免費）+ callLocalOllama + 路由表本地為主；FREE_PROVIDER_POOL 自動派生 + isModelUp/markModelDown 降級 + 雲端池兜底；模型清單檔（models.txt / hermes-free-models.json）對齊 gemma3:4b / gemma3:12b / llama3.1:8b；修 tsconfig.verify.json 排除 __tests__（避免 vitest globals 型別缺口誤報）。free-provider.test.ts 14 passed。
- 本地 Gemma 3 整合（feat/gemma-local-free-vps）：model-router 新增 `local_gemma` provider + `callLocalOllama`（Ollama /api/chat）；路由表全數改走本地 `gemma3:4b` / `gemma3:12b` / `llama3.1:8b`（100% 免費、私有、零算力）；`hermes-free-models.json` / `models.txt` 預設改為 `gemma3:4b`。修復兩個致命 bug：①`callFreeProvider` 因本地模型 `apiKeyEnv` 為空被誤判「無 Key」而全部跳過 → 改為空 Key 視為「免 Key」不跳過；②`VPS_OLLAMA_URL` 未被傳入呼叫端點 → 改由 `cfg.apiUrl`（PROVIDER_ENDPOINTS）傳入 `callLocalOllama`。新增 2 項測試（本地模型可選用 + 端點尊重 VPS_OLLAMA_URL）。

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- AuditLogger：maxEntries 預設 0（全量留存），僅在明確設定時才截斷。
- 健康檢查器整合 metrics + journal + 事件流活性 + 告警存在性四項。
- publishBusEvent 統一發布原語：所有子系統（委派/閘道器）走同一條帶 hashLock 的路徑。
- 本地模型設計：`local_gemma` 的 `apiKeyEnv` 為空 → 視為「免 Key」，`callFreeProvider` 不跳過；端點統一由 `PROVIDER_ENDPOINTS.local_gemma.apiUrl` 提供（尊重 `VPS_OLLAMA_URL` 環境變數），`callLocalOllama` 經 `cfg.apiUrl` 接收，單一來源避免散落硬編碼 IP。

## Next Steps
- ✅ 郵件通知已完成（#273）。可延伸：monorepo 其他子系統（如 twelve-omni）套用統一發布模式（twelve-omni 自身 secureForward 僅 hashLock+凍結、不發布至共享總線，為已知分歧，待評估併入）。
- 可評估 E2E 整合測試（health + metrics + alerts + SSE 一體化驗證）。
- ⚠️ 系統層級 UTF-8 字碼頁（OEMCP/ACP=65001）可根除顯示層亂碼，但需重啟且影響全機，待使用者明示同意（未執行）。

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
