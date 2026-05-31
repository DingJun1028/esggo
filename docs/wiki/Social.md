社會影響 Social
路徑： /social | 權限： HR, PM, ADMIN | 所屬旅程： III. 數據採集與管理

1. 模組定位 (Core Purpose)
社會影響頁是企業社會責任 (S) 面向的數據集中管理中心，提供標準化的勞工、職安、DEI 與社會治理數據輸入、追蹤與分析功能，以支援合規揭露與績效管理。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 人力資源經理 (HR Manager) 與永續專案經理 (ESG PM)。他們常面臨來自不同部門（如人資系統、職安部門）的數據口徑不一、手動彙整耗時且易出錯，導致在準備 ESG 報告時，社會面指標的揭露缺乏一致性與可信度。
體驗高光時刻 (Aha Moment)： 當 HR 經理在頁面中輸入當月職安數據後，系統即時在右側圖表更新「失能傷害頻率 (FR)」與「失能傷害嚴重率 (SR)」的趨勢線，並自動標示出與去年同期相比的改善百分比。這種「數據即時反饋，績效一目瞭然」的體驗，讓他們感受到數據管理的效率與價值。
操作軌跡：
1. HR 經理進入「社會影響」頁面，點擊「職安數據」區塊。
2. 透過表單輸入本月工時、傷害人次等原始數據。
3. 系統自動計算 FR/SR 指標，並更新頁面上的趨勢圖。
4. 檢閱 DEI 多元化儀表板，確認各族群比例與目標達成度。
5. 點擊「匯出報告草稿」，將所有社會面數據打包成符合 GRI 格式的 Excel。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側導航樹 + 右側多卡片儀表板」佈局。左側導航樹用於切換「勞工結構」、「DEI」、「職安」等子模組，右側主內容區則由多個 BrandMetricCard (指標卡片) 與 BrandLineChart (趨勢圖) 組成。
核心液態玻璃元件： BrandMetricCard (顯示關鍵指標與變化率)、BrandDataTable (用於數據輸入與列表展示)、BrandGaugeChart (顯示 DEI 目標達成率)。
行動端適配 (RWD)： < 768px 時，左側導航樹自動收合為頂部 Tab 或底部 FAB。右側儀表板的 BrandMetricCard 自動堆疊，BrandDataTable 轉化為「堆疊式資料卡片 (Stacked Cards)」，僅顯示核心資訊，點擊後展開詳細數據。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 透過前端表單輸入或 HRIS 系統 API 整合的數據，寫入 `social_metrics` 資料表。這些數據會即時更新 `ESG_Dashboard_S_KPI` 視圖，並作為 SustainWrite 編輯器中社會章節的數據來源。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的「社會影響」具體化為可量化的指標，如「失能傷害頻率 (FR)」、「女性主管比例」、「平均受訓時數」等，並透過圖表直觀呈現。
[T3 Trackable 追蹤]： 每次數據的增刪改查，系統都會在 `audit_logs` 表中記錄操作者、時間、變更內容與 IP 地址，確保所有社會面數據變動皆可追溯。
[T4 Transparent 透明]： 每個指標的計算方法（例如 FR = (失能傷害人次 / 總工時) * 1,000,000）都會在 Tooltip 中明確標示，並可連結至原始數據來源（如 HRIS 系統介面或上傳的職安報告）。

5. 功能項目解說和使用技術 (Features & Tech Stack)
勞工結構與 DEI 數據輸入： 提供結構化表單，支援多選、下拉選單與數值輸入。技術使用 React Hook Form 搭配 Zod 進行前端驗證，後端使用 Supabase Functions 處理資料寫入與關聯邏輯。
職安 FR/SR 指標計算與趨勢圖： 根據輸入的原始數據，即時計算並渲染趨勢圖。技術使用 Recharts 進行圖表渲染，搭配 React useMemo 進行高效數據計算與狀態管理。
HRIS 數據整合介面： 提供標準化 API 介面，允許企業現有 HRIS 系統（如 Workday, SAP SuccessFactors）自動同步數據。技術使用 Node.js (Express) 建立 RESTful API，並實作 OAuth 2.0 進行安全認證。
數據匯出與報告生成： 支援將當前頁面數據匯出為 Excel 或 PDF 格式。技術使用 SheetJS (js-xlsx) 進行 Excel 匯出，並透過 Puppeteer 或 Playwright 進行無頭瀏覽器 PDF 渲染。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 當數據表格的列數過多時，表格必須具備虛擬化 (Virtualization) 滾動能力，確保頁面流暢度，且表頭與表身對齊不可錯位。
🚨 邏輯/體驗紅線： 職安指標計算結果若出現負值 or 異常極大值（例如 FR > 1000），必須觸發前端警示，並在後端日誌中記錄為「異常數據」，防止錯誤數據被採納。若 HRIS 數據整合失敗，必須在 5 分鐘內透過 Email 或 Slack 通知相關負責人，並在介面顯示清晰的「數據同步異常」狀態。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自 `/api-setup` (HRIS 系統) 與人資部門的手動填報。
下游影響： 提供數據給 `/dashboard` 的社會績效 KPI 與 `/editor` 的社會揭露章節。
依賴組件： BrandMetricCard, BrandDataTable, BrandGaugeChart.