# ESG Intelligence Center (ESG Insights Dashboard) [Intelligence]
路徑： /intelligence | 權限： ADMIN, CSO, PM | 所屬旅程： VI. 績效監控與決策

1. 模組定位 (Core Purpose)
ESG Intelligence Center 是一個整合性的數據分析與視覺化平台，旨在為企業提供全面的 ESG 績效洞察，幫助高階主管與永續專案經理快速識別風險與機會，並支持數據驅動的策略決策。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 高階主管 (CSO, CEO) 與永續專案經理 (PM)。他們面臨的痛點是：傳統 ESG 報告製作週期長、數據分散且缺乏即時性，導致難以在董事會或策略會議上快速回應績效質詢，也無法即時調整策略以應對市場變化。
體驗高光時刻 (Aha Moment)： 當 CSO 在董事會上被問及「我們在水資源管理方面的績效是否優於同業？」時，他能即時在儀表板上點擊「水資源」卡片，系統立刻彈出包含歷史趨勢、目標達成率與同業基準比較的多維度圖表。CSO 瞬間感受到「所有數據盡在掌握」的專業與安心。
操作軌跡：
1. 登入系統，直接進入個人化的 ESG 績效總覽儀表板。
2. 點擊「環境 (E)」維度，深入查看碳排放、水資源利用等關鍵指標的即時數據與趨勢。
3. 利用時間篩選器與地區篩選器，聚焦特定期間或廠區的表現。
4. 點擊「同業比較」功能，快速評估自身在特定指標上的相對位置。
5. 將關鍵圖表加入「我的報告」清單，準備生成客製化報告。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「多卡片網格佈局 (Multi-Card Grid Layout)」，頂部為「關鍵績效指標 (KPI) 總覽卡片」，下方為可自由拖曳、調整大小的「數據圖表卡片」。
核心液態玻璃元件： BrandKPIWidget (顯示即時數值與趨勢箭頭)、BrandSparklineChart (輕量級趨勢圖)、BrandDataTable (可排序、篩選的數據表格)、BrandFilterPill (篩選條件膠囊)。
行動端適配 (RWD)： < 768px 時，所有數據卡片自動垂直堆疊，並隱藏次要資訊。複雜的圖表（如散佈圖）會自動轉化為「摘要列表」或提供「點擊全螢幕放大」選項，確保數據可讀性與操作流暢度。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 從 `esg_kpis`, `carbon_emissions`, `water_usage` 等多個資料表聚合數據，經由後端服務層進行即時計算與分析，結果緩存於 Redis 並推送到前端儀表板。用戶篩選操作會觸發新的 API 請求，更新儀表板數據，但不直接寫入原始資料表。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的 ESG 數據（如碳排放量）具體化為可視化的趨勢圖、目標達成率與同業比較。
[T2 Traceable 追溯]： 儀表板上的每一個 KPI 數值，都提供「鑽取 (Drill-down)」功能，可追溯到其原始數據來源與計算邏輯。
[T3 Trackable 追蹤]： 任何篩選條件的變更或圖表配置的調整，都會被記錄在用戶行為日誌中，以便後續分析用戶偏好與優化體驗。
[T4 Transparent 透明]： 每個圖表下方都提供「數據來源說明」與「計算方法」的彈出視窗，確保用戶理解數據的生成過程。
[T5 Trustworthy 信任]： 數據在進入 Intelligence Center 前，會經過多層次的數據清洗與驗證流程，確保呈現的數據是經過核實且可信的。

5. 功能項目解說和使用技術 (Features & Tech Stack)
互動式數據視覺化： 支援多種圖表類型（折線圖、柱狀圖、圓餅圖、散佈圖），具備縮放、平移、Tooltip 互動功能。技術使用 ECharts 或 Highcharts 進行渲染，結合 React-Query 進行數據緩存與同步。
客製化儀表板： 允許用戶自由拖曳、調整卡片大小與位置，並儲存為個人化視圖。技術使用 React Grid Layout 實現拖曳佈局，並將用戶配置儲存至 `user_dashboard_configs` 資料表。
即時數據篩選與聚合： 提供多維度篩選器（時間、地區、部門、GRI 指標），後端服務即時聚合數據並返回結果。技術使用 GraphQL API 進行高效數據查詢，搭配 Apache Druid 或 ClickHouse 進行 OLAP 分析。
ESG 績效預警系統： 用戶可設定 KPI 閾值，當數據超出預設範圍時，系統自動發送郵件或站內通知。技術使用 Apache Kafka 進行事件流處理，結合 Celery (Python) 或 BullMQ (Node.js) 處理異步通知任務。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 任何數據卡片在不同螢幕尺寸下（尤其是在 RWD 切換點），其內容（圖表、文字）絕對不可溢出卡片邊界，或導致卡片高度異常撐開。所有圖表的 Tooltip 必須在邊緣處智慧偏移，不可被螢幕邊界截斷。
🚨 邏輯/體驗紅線：
1. 當後端數據源暫時不可用時，儀表板必須顯示友善的「數據載入中」或「數據暫時無法取得」提示，而非空白或錯誤頁面。
2. 任何篩選條件的變更，必須在 2 秒內完成數據更新與圖表重繪，若超過此時間，需顯示載入動畫並檢查後端性能。
3. 不同用戶角色（如 CSO vs. PM）在查看同一儀表板時，必須嚴格遵守其權限設定，不可顯示超出權限範圍的數據或功能。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自 `/environmental`, `/social`, `/governance`, `/finance` 的全維度數據。
下游影響： 提供決策支援給 `/roadmap` 與 `/publish` (報告策略摘要)。
依賴組件： BrandKPIWidget, BrandSparklineChart, BrandFilterPill.