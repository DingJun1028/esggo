5T 信任儀表板 (5T Trust Dashboard)
路徑： /5t-dashboard | 權限： ADMIN, CSO, PM | 所屬旅程： V. 確信審計與發佈

1. 模組定位 (Core Purpose)
5T 信任儀表板提供 ESG GO 系統對「可信度五大原則 (5T Protocol)」的即時合規總覽，確保所有 ESG 數據與報告的完整性、可追溯性與透明度，是企業永續治理的信任基石。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或合規部門主管。他們需要一個單一且權威的視圖，快速評估 ESG 數據的健康狀況與合規風險，尤其是在面對內部稽核、外部確信或高階會議時，缺乏即時、可驗證的數據信任報告，會導致決策延遲與潛在的聲譽風險。
體驗高光時刻 (Aha Moment)： 當 CSO 登入儀表板，看到所有 5T 指標都呈現「綠燈」狀態，並能點擊任一指標，即時鑽取查看其背後的詳細合規紀錄與數據來源，瞬間感受到「數據盡在掌握，信任無懈可擊」的安心感。
操作軌跡：
1. CSO 登入 ESG GO 系統，直接導航至「5T 信任儀表板」。
2. 快速掃視五個核心 5T 指標卡片，確認整體合規狀態。
3. 發現「T5 Trustworthy」指標呈現黃色警示，點擊卡片進入詳情頁。
4. 檢閱近期文件 Hash 驗證失敗的列表，識別出問題文件與負責人。
5. 指派相關人員處理，並在儀表板上追蹤該問題的解決進度。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「五宮格卡片佈局」作為頂部概覽區，每個卡片代表一個 5T 指標，顯示其即時狀態與簡要摘要。下方 70% 區域為「動態合規事件時間軸」與「可篩選的詳細稽核日誌表格」。
核心液態玻璃元件： BrandStatusCard (用於 5T 指標概覽，具備狀態燈號與進度條)、BrandGaugeChart (用於顯示各 T 的量化合規分數)、AuditLogTable (具備篩選與排序功能)、BrandAlertBadge (用於顯示異常事件)。
行動端適配 (RWD)： < 768px 時，五宮格卡片自動堆疊為垂直列表。詳細稽核日誌表格自動轉化為「堆疊式資料卡片 (Stacked Cards)」，僅顯示關鍵資訊，並提供「點擊展開」查看完整細節的功能。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 本儀表板不直接儲存數據，而是作為一個聚合器，實時從 ESG GO 系統的各個模組（如 `evidence_vault`、`audit_logs`、`report_drafts`、`materiality_topics`、`data_points` 等）撈取合規狀態與事件數據，進行匯總與展示。
5T 實踐點：
[T1 Tangible 具體]： 儀表板顯示「GRI 覆蓋率矩陣」的即時進度與「關鍵 KPI 卡片」的數據完整度，量化呈現數據的具體化程度。
[T2 Traceable 追溯]： 儀表板提供「數據溯源路徑圖」，可點擊任何數據點，追溯其 `evidence_id`、`source_origin`，並標示任何 `grounded path validation` 失敗的警示。
[T3 Trackable 追蹤]： 儀表板實時展示「合規事件時間軸」，記錄所有關鍵數據的 `lifecycle hooks` 與 `event trail`，包括數據創建、修改、審批等操作，確保所有變更皆可追蹤。
[T4 Transparent 透明]： 儀表板顯示「AI 協作透明度分數」，並可鑽取查看 `OmniHermes` 的推理日誌、`GRI 條款引用`與 `explicit formula reference`，確保 AI 生成內容的透明度。
[T5 Trustworthy 信任]： 儀表板監控 `evidence_vault` 中所有文件的 `SHA-256 hash lock` 狀態，顯示 `ZKP verification badge` 的有效性，並記錄 `seal notification` 歷史，對任何 Hash 不符或驗證失敗的事件發出警報。

5. 功能項目解說和使用技術 (Features & Tech Stack)
實時 5T 狀態聚合： 透過後端服務（如 Apache Kafka 或 RabbitMQ）訂閱各模組的合規事件流，並使用 GraphQL Subscriptions 或 WebSockets 將實時狀態推送到前端。
互動式鑽取分析： 允許使用者點擊 5T 指標卡片，導航至詳細的合規日誌或數據溯源頁面。技術使用 React Router 進行路由管理，搭配 Zustand 或 React Context API 進行全局狀態共享。
歷史合規趨勢圖： 顯示各 5T 指標在時間軸上的合規分數變化趨勢。技術使用 Recharts 或 Nivo 進行圖表渲染，後端數據源為 TimescaleDB 或 InfluxDB 等時序資料庫。
自動化警報整合： 當任一 5T 指標觸發預設的紅線閾值時，自動發送通知。技術使用 Supabase Edge Functions 監聽資料庫觸發器，並透過 Webhook 整合至 Slack 或 PagerDuty。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 當「合規事件時間軸」包含超過 1000 條紀錄時，其虛擬化滾動 (Virtual Scrolling) 必須正常運作，不可出現卡頓或頁面渲染錯誤，且任何時間軸上的元素（如時間戳、事件描述）不可溢出容器。
🚨 邏輯/體驗紅線： 當系統檢測到 `evidence_vault` 中任一文件的 SHA-256 Hash 與原始記錄不符時，T5 Trustworthy 指標必須在 5 秒內從綠燈轉為紅燈警示，並在儀表板上顯示具體的異常文件列表，不可出現延遲或誤報。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自全系統所有模組的合規事件。
下游影響： 全系統可信度的核心衡量標準，直接影響 `/dashboard`。
依賴組件： BrandStatusCard, BrandGaugeChart, AuditLogTable, BrandAlertBadge.