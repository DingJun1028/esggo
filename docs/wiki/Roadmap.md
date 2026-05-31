# 淨零路徑 Roadmap [Roadmap]
路徑： /roadmap | 權限： CSO, PM, ADMIN | 所屬旅程： III. 目標設定與管理

1. 模組定位 (Core Purpose)
淨零路徑模組將企業的淨零願景具體化為可追蹤的 SBTi 1.5°C 減碳趨勢圖與里程碑，提供中長期減碳目標設定、進度管理與策略調整的視覺化中樞。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或永續專案經理 (PM)。他們面臨將抽象的淨零承諾轉化為具體、可追蹤的行動計畫的挑戰，傳統上依賴複雜的試算表和手動圖表，難以即時掌握進度並向高層匯報。
體驗高光時刻 (Aha Moment)： 當 CSO 在跨部門策略會議上展示淨零路徑圖時，能即時調整里程碑，並看到 SBTi 趨勢線如何動態響應，清晰呈現企業距離 1.5°C 目標的差距與努力方向，讓決策者感受到「一切盡在掌握」的策略清晰感。
操作軌跡：
1. 首次進入頁面，設定企業的基準年與最終淨零目標年份。
2. 根據 SBTi 指引，設定各年度的階段性減碳目標與關鍵里程碑（如：導入再生能源、優化製程）。
3. 定期更新實際減碳數據，觀察趨勢圖與里程碑進度條的動態變化。
4. 根據進度落差，與團隊討論並調整後續策略，確保路徑不偏離。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「頂部儀表板 + 下方時間軸」佈局。頂部展示核心 KPI (如：SBTi 1.5°C 趨勢圖、當前減碳進度百分比)，下方則為可互動的「里程碑時間軸 (Timeline)」。
核心液態玻璃元件： BrandProgressRing (SBTi 進度環形圖)、TimelineSegment (里程碑區段卡片，支援拖曳調整)、TrendLineChart (SBTi 趨勢折線圖)。
行動端適配 (RWD)： < 768px 時，頂部儀表板的 KPI 轉為垂直堆疊卡片，SBTi 趨勢圖自動縮放並提供橫向滾動。里程碑時間軸則轉化為「可展開的列表視圖」，點擊單一里程碑可查看詳細資訊。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 減碳目標與里程碑數據由使用者輸入，儲存於 `carbon_reduction_targets` 與 `milestones` 資料表。實際減碳數據則從 `emission_data` 表撈取，並即時運算後更新趨勢圖，同時影響 `Dashboard KPI` 中的淨零進度指標。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的「淨零承諾」具體化為可視化的 SBTi 1.5°C 趨勢線與明確的年度減碳百分比目標。
[T3 Trackable 追蹤]： 每次目標或里程碑的設定與修改，都會在 `audit_log` 中留下操作者、時間與變更內容的紀錄，確保所有策略調整皆可追溯。
[T4 Transparent 透明]： 系統會清晰標示 SBTi 1.5°C 趨勢線的計算邏輯與數據來源（如：基準年排放量、目標減碳率），讓使用者對數據的生成過程一目瞭然。

5. 功能項目解說和使用技術 (Features & Tech Stack)
SBTi 1.5°C 趨勢圖渲染： 支援多條趨勢線（基準線、SBTi 目標線、實際進度線）的動態繪製與 Tooltip 互動。技術使用 Recharts 或 Chart.js 搭配客製化數據點與動畫效果。
里程碑管理與進度追蹤： 提供里程碑的增、刪、改、查功能，並支援拖曳調整順序與日期。技術使用 React Hook Form 進行表單管理，搭配 React DnD 實現拖曳功能，後端 API 透過 RESTful 設計與 Supabase 互動。
目標達成率即時計算： 根據實際排放數據與設定目標，即時計算當前減碳達成率與預計達標日期。技術使用 React `useMemo` 或 `useCallback` 進行高效能計算，並透過 WebSockets (如 Supabase Realtime) 實時更新進度。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 當里程碑數量過多導致時間軸無法完整顯示時，必須自動啟用橫向滾動條，且滾動條樣式與位置不可遮擋任何里程碑資訊。SBTi 趨勢圖在不同螢幕尺寸下，其圖例 (Legend) 必須保持可讀性，不可重疊或溢出。
🚨 邏輯/體驗紅線： 若使用者設定的減碳目標與 SBTi 1.5°C 基準線存在明顯邏輯衝突（例如：目標減碳率低於 SBTi 建議值），系統必須彈出「軟性警告 (Soft Warning)」提示，而非直接阻止設定。當實際排放數據為空時，趨勢圖應顯示「數據不足」的佔位符，而非空白或錯誤圖表。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自 `/materiality` (重大性議題) 與 `/environmental` (實際排放數據)。
下游影響： 提供進度數據給 `/dashboard` 與 `/intelligence` (預測分析)。
依賴組件： BrandProgressRing, TimelineSegment, TrendLineChart.