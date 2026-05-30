SustainWrite 編輯器 SustainWrite Editor
路徑： /editor | 權限： PM, ADMIN | 所屬旅程： IV. AI 賦能與撰寫

1. 模組定位 (Core Purpose)
SustainWrite 是 ESG GO 的核心撰寫中樞，提供 208 頁報告框架、佐證清單與 AI 合規協作，幫助企業高效率產出符合 GRI/ISSB 標準的可信永續報告。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM)。他們通常對著 200 多頁的 Word 檔案發愁，需要不斷在各種 PDF 憑證與法規網頁間頻繁切換，深怕寫錯或漏掉 GRI 指標。
體驗高光時刻 (Aha Moment)： 當 PM 點擊「AI 擴寫」時，系統不僅在 3 秒內生成合規草稿，還自動在右側抽屜亮起該段落對應的「電費單 PDF 縮圖」。PM 瞬間感受到「不用自己大海撈針」的巨大釋放感。
操作軌跡：
1. 焦慮地從左側導航樹點開尚未完成的 GRI 305 章節。
2. 召喚 AI 助手，請其依據今年度數據生成排放聲明。
3. 檢閱 AI 內容與標註的證據來源，確認無誤後點擊「寫入」。
4. 執行合規掃描，看到全綠燈通過，安心存檔。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左中右三欄佈局」。左側為「章節導航」，中央為「所見即所得編輯區」，右側為「AI 顧問 / 佐證文件抽屜」。
核心液態玻璃元件： 使用 BrandFloatingAgent 作為右下角懸浮 AI 助手；編輯區背景採用 glassBg (白/深藍磨砂)。
行動端適配 (RWD)： < 768px 時，左右兩欄自動隱藏為「漢堡選單」與「懸浮 FAB」，中央編輯區必須 100% 滿版，防止文字擠壓破版。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 編輯內容自動每 30 秒 Autosave 至 Supabase report_drafts 表。
5T 實踐點：
[T4 Trustworthy 信任]： AI 生成的每一段文字，旁邊都會生成一個 BrandBadge，標示其推理來源（內部知識庫或外部法規）。
[T2 Traceable 追溯]： 使用者在文字中 @ 標記數據時，自動建立與 evidence_vault 的雙向連結。

5. 功能項目解說和使用技術 (Features & Tech Stack)
所見即所得編輯 (WYSIWYG)： 支援標題、清單、表格與 @ 標記。技術使用 TipTap 或 Lexical 編輯器核心進行客製化。
AI 擴寫與合規掃描： 透過背景串接 AI 進行內容分析。技術使用 Genkit 搭配 Gemini 2.0 Pro 模型，並以 Server-Sent Events (SSE) 實作打字機串流效果。
自動儲存防呆機制： 背景靜默儲存。技術使用 Supabase Realtime 與 Lodash debounce 控制 API 請求頻率。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 當 AI 一次性生成超過 2000 字時，中央編輯區的 Y 軸滾動條必須正常出現，絕對不可撐破外層 Liquid Glass 卡片容器。
🚨 邏輯/體驗紅線： AI 回傳結果若包含違背 ESG 標準的幻覺字眼，必須被攔截並標示為紅字。若發生斷網，必須平滑切換至「離線暫存模式 (IndexedDB)」，不可彈出令使用者恐慌的 Error 500 白畫面。

---

重大性矩陣 Materiality
路徑： /materiality | 權限： CSO, PM | 所屬旅程： II. 策略盤點與分派

1. 模組定位 (Core Purpose)
用於執行雙重重大性評估 (Double Materiality)。將抽象的 ESG 議題，透過財務衝擊與環境衝擊分數，轉換為可視化、可排序的象限氣泡圖。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或高階幕僚。過去必須收集數十份 Excel 問卷，手動計算平均值後再用 PowerPoint 辛苦拉泡泡圖，不僅耗時且容易算錯，開會時若被質疑分數來源，往往無法即時反查。
體驗高光時刻 (Aha Moment)： 在跨部門策略會議上，CSO 直接拉動網頁上的分數滑桿，下方的「溫室氣體排放」氣泡立刻平滑飛入右上角的「核心重大象限」。這種即時算繪的科技感，極大提升了 CSO 在會議中的專業權威感。
操作軌跡：
1. 匯入本年度候選的 ESG 議題清單。
2. 統整各方評分後，在介面上進行最終權重微調 (拉動 Sliders)。
3. 觀察氣泡動態落點，辨識出今年的 5 大核心議題。
4. 點擊「鎖定矩陣」，產出該年度不可篡改的策略基準。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 頂部為分數拉桿列 (Sliders Array)，下方 70% 區域為滿版的互動式二維氣泡圖。
核心液態玻璃元件： BrandSlider (具備數值即時反饋)、MatrixBubble (帶有 Liquid 模糊邊緣的氣泡)。
行動端適配 (RWD)： 透過 Media Query 將預設視圖切換為「議題優先級列表 (List View)」，並提供「點擊展開圖表」的橫向全螢幕選項，避免手指誤觸。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 分數變更即時運算 (X*Y 軸權重)，寫入 materiality_topics 表。
5T 實踐點：
[T1 Tangible 具體]： 將 1-5 分的抽象問卷評分，具體化為座標軸上的絕對落點與氣泡大小。
[T3 Traceable 追溯]： 每次主管調整滑桿分數，系統自動在該議題的 Audit Log 中留下 Score_Changed 事件紀錄。

5. 功能項目解說和使用技術 (Features & Tech Stack)
互動式氣泡圖渲染： 需要支援流暢的座標移動動畫與 Tooltip 懸浮提示。技術使用 Recharts 搭配客製化 SVG 元素，或直接以 D3.js 實作力導向 (Force-directed) 防重疊邏輯。
雙重重大性狀態同步： 上方拉桿與下方圖表需保持毫秒級同步。技術使用 React useMemo 計算權重，結合 Zustand 或 Context API 進行狀態共享。
矩陣鎖定封印： 確認後禁止修改。技術使用 Supabase 的 Row Level Security (RLS) 變更資料表權限為 Read-Only。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 當兩個議題分數極度接近時，氣泡重疊處的 Tooltip 必須具備「智慧偏移 (Smart Placement)」邏輯，不可出現互相遮擋字體的問題。
🚨 邏輯/體驗紅線： 「鎖定矩陣」點擊後，必須彈出二次確認對話框。鎖定後任何嘗試拉動滑桿的行為都應給予「已鎖定」的視覺阻尼回饋 (Visual Spring Feedback)，而非按鈕突然消失導致突兀感。

---

證據金庫 Vault
路徑： /vault | 權限： ALL_USERS | 所屬旅程： V. 確信審計與發佈

1. 模組定位 (Core Purpose)
平台所有佐證文件（如電費單、ISO 證書、採購合約）的加密儲存與查核中心。這是支撐平台「可信度」的最底層防線。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 各部門填報窗口與外部稽核員。填報者常找不到最新版憑證，稽核員則總是懷疑「這張截圖有沒有被 Photoshop 修過？」。雙方處於不信任且溝通成本極高的狀態。
體驗高光時刻 (Aha Moment)： 填報者將 PDF 拖入區塊的瞬間，系統伴隨清脆音效亮起綠色的 ZKP Verified 與專屬 Hash 碼。稽核員看到這串由密碼學保證的標記時，立刻放下了戒心，雙方達成零摩擦的信任。
操作軌跡：
1. 填報窗口將供應商提供的 PDF 拖曳至 Dropzone。
2. 系統讀取檔案並展示 SHA-256 雜湊運算的動畫進度條 (增加科技儀式感)。
3. 選擇該文件要關聯的數據項目（例如：一月份台北廠電力）。
4. 檔案入庫，狀態轉為綠色的「已封印 (Sealed)」。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「檔案總管型表格 (Data Table)」佈局，結合頂部區域的「全寬拖曳上傳區 (Dropzone)」。
核心液態玻璃元件： VaultOmniTable (萬能聖碑表格)、BrandStatusDot (顯示 ZKP 驗證狀態：綠=已封印，紅=檔案損毀/失效)。
行動端適配 (RWD)： 表格必須自動轉化為「堆疊式資料卡片 (Stacked Cards)」，隱藏複雜的 Hash 字串，僅保留檔名、GRI 條款與 5T 狀態燈號。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 實體檔案上傳至 Supabase Storage / S3，MetaData 與 SHA-256 Hash 寫入 evidence_vault 資料表。
5T 實踐點：
[T4 Trustworthy 信任]： 檔案拖入前端瀏覽器的瞬間，即刻計算出 SHA-256 Hash，並隨檔案上傳至資料庫。後續對圖片的任何微小修改，都會導致 Hash 對不上而亮起紅燈警報。

5. 功能項目解說和使用技術 (Features & Tech Stack)
客戶端 Hash 運算： 為了減少伺服器負擔與傳輸竄改風險，在前端直接算 Hash。技術使用瀏覽器原生的 Web Crypto API (crypto.subtle.digest)。
拖曳上傳互動： 支援多檔案與拖曳辨識。技術使用 react-dropzone 搭配客製化 Liquid Glass 樣式邊框高亮。
大檔案串流上傳： 避免超過 50MB 的 PDF 卡死瀏覽器。技術使用 Supabase Storage 的 TUS (Resumable Uploads) 協議進行分塊上傳。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 檔名或 Hash 字串過長時必須觸發 text-overflow: ellipsis (顯示...)，配合 Tooltip 檢視完整內容，絕對不可撐開表格導致整個頁面出現醜陋的 X 軸滾動條。
🚨 邏輯/體驗紅線： 若系統檢測到使用者上傳了重複的檔案 (Hash 完全相同)，必須阻斷上傳並彈出友善提示：「此文件已存在於金庫中，是否直接建立關聯？」，以節省儲存空間與防止資料冗餘。

---

數據管理 Data Management
路徑： /data-management | 權限： PM, ADMIN | 所屬旅程： I. 數據採集與整合

1. 模組定位 (Core Purpose)
提供一站式數據採集、清洗、轉換與整合功能，確保所有 ESG 相關數據的品質與一致性，為後續分析與報告奠定基礎。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM) 或數據分析師。他們需要從多個異質系統（如 ERP、MES、HR 系統）匯入數據，手動處理格式不一、單位混亂、缺失值等問題，耗時且易錯。
體驗高光時刻 (Aha Moment)： 當 PM 上傳一份混亂的 Excel 檔案後，系統自動識別出常見的數據欄位，並建議清洗規則。PM 點擊「一鍵清洗」後，數據立刻變得整齊劃一，並自動轉換為標準單位。PM 感到「數據治理從未如此輕鬆」。
操作軌跡：
1. 進入數據管理頁面，選擇「新增數據源」。
2. 上傳 Excel 或連接 API 數據源。
3. 系統自動預覽數據，並提示潛在的數據品質問題。
4. 根據系統建議或自定義規則進行數據清洗與轉換。
5. 確認數據無誤後，將其映射至 ESG GO 的標準數據模型。
6. 設定自動排程，確保數據定期更新。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側數據源列表，右側數據預覽與清洗工具」的雙欄佈局。數據預覽區為可滾動的 BrandDataTable。
核心液態玻璃元件： BrandDataTable (支援篩選、排序、分頁)、BrandDataMapper (拖曳式欄位映射工具)、BrandRuleEngine (數據清洗規則配置器)。
行動端適配 (RWD)： 左側數據源列表收合為漢堡選單，右側數據預覽區轉為堆疊式卡片，清洗工具則以模態視窗或底部抽屜呈現。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 外部數據源 -> 數據清洗與轉換服務 (Supabase Edge Functions) -> 暫存區 (staging_data) -> 標準化數據表 (esg_metrics)。
5T 實踐點：
[T1 Tangible 具體]： 將原始、非結構化的數據，轉化為可量化、標準化的 ESG 指標。
[T2 Traceable 追溯]： 每次數據匯入、清洗、轉換的步驟與規則，都會被記錄在數據的 Audit Log 中，可追溯數據的完整生命週期。
[T5 Timely 即時]： 支援數據源的自動排程更新，確保 ESG 數據始終反映最新狀態。

5. 功能項目解說和使用技術 (Features & Tech Stack)
數據源連接與管理： 支援多種數據源類型（Excel, CSV, API, 資料庫）。技術使用 React Hook Form 建立連接表單，後端 Supabase Edge Functions 處理外部 API 呼叫。
智能數據清洗與轉換： 自動識別數據類型、單位，提供清洗建議。技術使用 Python 數據處理庫 (Pandas) 部署為 Supabase Edge Functions，前端使用 Monaco Editor 供進階用戶自定義轉換腳本。
數據映射與標準化： 將清洗後的數據映射到預定義的 ESG 指標。技術使用 React DnD (Drag and Drop) 實現拖曳式映射，後端 GraphQL API 處理數據模型更新。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 數據預覽表格在載入大量欄位時，水平滾動條必須正常顯示，且表頭與內容對齊，不可出現錯位。
🚨 邏輯/體驗紅線： 數據清洗規則應用後，若導致數據量大幅減少（例如：超過 50% 的數據被過濾），系統必須彈出警告，要求用戶確認，防止誤操作導致數據丟失。

---

報告生成 Report Generation
路徑： /report-generation | 權限： PM, CSO | 所屬旅程： V. 確信審計與發佈

1. 模組定位 (Core Purpose)
提供多樣化的 ESG 報告模板與客製化選項，支援一鍵生成符合國際標準（GRI, ISSB, SASB）的永續報告，並具備版本管理與發佈功能。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或專案經理 (PM)。他們需要定期提交永續報告，但手動排版、校對、整合各章節內容耗時費力，且難以確保符合最新法規要求。
體驗高光時刻 (Aha Moment)： 當 CSO 選擇報告模板、確認內容後，點擊「生成報告」，系統在數秒內產出排版精美、內容完整的 PDF 報告。CSO 看到報告自動帶入最新數據和圖表，並標註合規性，感到「報告生成從未如此高效且安心」。
操作軌跡：
1. 選擇要生成的報告類型（如：GRI 報告、TCFD 報告）。
2. 選擇報告模板，或從歷史版本中複製。
3. 檢視報告內容預覽，進行最終調整。
4. 點擊「生成報告」，系統開始處理。
5. 下載生成的 PDF 報告，或直接發佈至閱覽室。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側報告設定與模板選擇，右側實時報告預覽」的雙欄佈局。預覽區支援頁面跳轉與縮放。
核心液態玻璃元件： BrandTemplateSelector (帶有預覽圖的模板選擇器)、BrandReportPreviewer (高解析度 PDF 預覽器)、BrandVersionControl (報告版本管理列表)。
行動端適配 (RWD)： 左側設定區收合為底部 Tab 或模態視窗，右側預覽區滿版顯示，提供手勢縮放與滑動翻頁功能。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 從 `report_drafts`、`esg_metrics`、`evidence_vault` 等表撈取數據與內容，經由報告生成服務 (PDF Renderer) 處理後，儲存至 `published_reports` 表與 Supabase Storage。
5T 實踐點：
[T2 Traceable 追溯]： 每一份生成的報告都帶有版本號，並記錄生成時間、操作者及所依據的數據快照，確保報告內容可追溯。
[T4 Trustworthy 信任]： 報告內容直接引用自經過 5T 驗證的數據與證據金庫，確保報告的真實性與可信度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多標準報告模板： 內建 GRI、ISSB、SASB 等多種報告框架模板。技術使用 Handlebars.js 或 Pug 模板引擎，後端渲染為 HTML 後再轉換為 PDF。
實時報告預覽： 在生成前提供接近最終輸出的預覽。技術使用 React-PDF 庫在前端渲染 PDF 預覽，或將 HTML 預覽轉換為圖片流。
版本管理與發佈： 支援報告草稿、已發佈版本管理，並可直接發佈至公開閱覽室。技術使用 Supabase 的版本控制功能，並結合 RLS 控制發佈權限。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 報告預覽器在不同螢幕尺寸下，頁面內容必須保持正確的長寬比，不可出現文字模糊或圖片變形。
🚨 邏輯/體驗紅線： 報告生成過程中，若因數據缺失或格式錯誤導致生成失敗，必須提供清晰的錯誤報告，指出具體問題所在，而非僅顯示「生成失敗」。

---

5T 協定 5T Protocol
路徑： /5t-protocol | 權限： ALL_USERS | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
詳細闡述 ESG GO 平台所遵循的 5T 數據完整性協定，作為所有數據處理、儲存與呈現的最高指導原則，確保數據的具體性、追溯性、透明性、信任性與即時性。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 內部開發者、產品經理、外部稽核員及對數據可信度有疑慮的客戶。他們需要理解 ESG GO 如何確保數據的真實與可靠，以建立對平台的信任。
體驗高光時刻 (Aha Moment)： 稽核員在閱讀 5T 協定頁面時，看到每個 T 都配有具體的技術實踐案例（如：ZKP 驗證、區塊鏈雜湊），並能點擊連結查看相關功能頁面。稽核員感到「這不僅是口號，而是實實在在的技術保障」。
操作軌跡：
1. 進入 5T 協定頁面。
2. 閱讀每個 T 的定義與商業價值。
3. 點擊「T4 Trustworthy」下的連結，跳轉至「證據金庫」頁面，查看具體實踐。
4. 理解 ESG GO 如何從底層技術上保障數據的完整性與可信度。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「單欄內容佈局」，每個 T 為一個獨立的 LiquidGlassCard 區塊，包含標題、定義、商業價值、技術實踐與相關功能連結。
核心液態玻璃元件： LiquidGlassCard (用於區分每個 T 的內容)、BrandBadge (標示技術關鍵字)、BrandLinkButton (導航至相關功能頁面)。
行動端適配 (RWD)： 內容區塊自動堆疊，文字大小與行距適配行動端閱讀體驗，確保清晰易讀。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 本頁面內容為靜態文檔，儲存於內容管理系統 (CMS) 或直接硬編碼於前端。其核心邏輯在於闡釋與連結其他功能頁面的 5T 實踐點。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的數據完整性原則，具體化為可理解的定義、商業價值與技術實踐案例。
[T3 Transparent 透明]： 公開闡述平台如何確保數據的可靠性，提升用戶對系統的信任。

5. 功能項目解說和使用技術 (Features & Tech Stack)
互動式內容展示： 每個 T 的內容可展開/收合，並包含內部連結。技術使用 React Accordion 或 Collapse 元件，內部連結使用 Next.js 的 Link 元件。
關鍵字高亮與解釋： 對於專業術語提供 Tooltip 解釋。技術使用 React Tooltip 元件。
多語言支援： 協定內容支援多語言切換。技術使用 i18next 或 react-intl 進行國際化。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 內容區塊在不同螢幕尺寸下，文字排版必須保持一致，不可出現文字溢出或圖片與文字重疊。
🚨 邏輯/體驗紅線： 頁面中的所有內部連結必須有效，點擊後能正確導航至對應的功能頁面，不可出現 404 錯誤。

---

AI 智能助理 AI Intelligent Assistant
路徑： /ai-assistant | 權限： ALL_USERS | 所屬旅程： IV. AI 賦能與撰寫

1. 模組定位 (Core Purpose)
提供一個全方位的 AI 智能助理，透過自然語言理解與生成，協助用戶快速查詢 ESG 知識、生成報告草稿、優化數據分析，提升工作效率與決策品質。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 所有平台用戶。他們在 ESG 報告撰寫、數據分析或政策理解上遇到困難時，往往需要花費大量時間搜尋資料或諮詢專家。
體驗高光時刻 (Aha Moment)： 用戶在聊天框中輸入「請幫我分析今年碳排放數據的異常波動」，AI 助理不僅立刻生成一份圖文並茂的分析報告，還主動建議「您可能需要檢查供應鏈中的運輸數據」。用戶感到「AI 助理不僅聰明，還能預判我的需求」。
操作軌跡：
1. 點擊右下角的 BrandFloatingAgent 召喚 AI 助理。
2. 在聊天框中輸入問題或指令（如：生成某章節報告草稿、解釋某個 GRI 指標）。
3. AI 助理實時生成回答、報告草稿或數據洞察。
4. 用戶可對 AI 回答進行追問或要求進一步優化。
5. 將 AI 生成的內容一鍵寫入報告或數據儀表板。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「右側懸浮抽屜式聊天介面」，可隨時展開或收合，不影響主頁面操作。聊天介面內部為對話氣泡與內容展示區。
核心液態玻璃元件： BrandFloatingAgent (右下角懸浮 AI 圖標)、BrandChatWindow (聊天介面)、BrandAIGeneratedCard (AI 生成內容卡片，可一鍵複製/寫入)。
行動端適配 (RWD)： 懸浮抽屜自動全屏展開，聊天介面滿版顯示，輸入框位於底部，確保良好的對話體驗。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 用戶輸入 -> AI 服務 (Genkit/Gemini) -> 內部知識庫 (vector_db) + 實時數據 (esg_metrics) -> AI 回應。用戶選擇寫入的內容會更新至 `report_drafts` 或 `esg_metrics`。
5T 實踐點：
[T3 Transparent 透明]： AI 生成的內容會標註其參考來源（如：GRI 準則、內部數據），讓用戶了解資訊的依據。
[T4 Trustworthy 信任]： AI 助理在生成數據分析或報告草稿時，會優先引用經過 5T 驗證的內部數據，減少幻覺風險。

5. 功能項目解說和使用技術 (Features & Tech Stack)
自然語言理解與生成： 處理用戶輸入並生成智能回應。技術使用 Genkit 框架與 Gemini 2.0 Pro 模型，結合 RAG (Retrieval-Augmented Generation) 模式。
實時對話與串流： 提供流暢的對話體驗，AI 回應以打字機效果實時呈現。技術使用 Server-Sent Events (SSE) 實現串流。
內容寫入與整合： AI 生成的內容可直接寫入其他功能模組。技術使用 GraphQL Mutations 或 REST API 進行跨模組數據操作。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 聊天介面在顯示長篇 AI 回應時，滾動條必須正常出現，且對話氣泡不可溢出邊界。
🚨 邏輯/體驗紅線： AI 助理在處理敏感數據或生成報告時，必須嚴格遵守權限設定，不可洩露用戶無權訪問的資訊。若 AI 回應與事實嚴重不符，必須有機制進行標記與回報。

---

碳盤查管理 Carbon Inventory Management
路徑： /carbon-inventory | 權限： PM, ENVIRONMENTAL_ENGINEER | 所屬旅程： I. 數據採集與整合

1. 模組定位 (Core Purpose)
提供符合 ISO 14064 及 GHG Protocol 標準的碳排放數據採集、計算、分析與報告功能，協助企業精準掌握碳足跡，制定減碳策略。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 環境工程師或永續專案經理。他們需要收集各部門的能源消耗、廢棄物處理、差旅等數據，手動計算範疇一、二、三排放量，過程繁瑣且容易出錯，難以追蹤減碳成效。
體驗高光時刻 (Aha Moment)： 當工程師匯入電費單數據後，系統自動識別電量並根據預設排放係數計算出範疇二排放量，同時在儀表板上實時更新碳排放趨勢圖。工程師感到「碳盤查不再是噩夢，而是可視化的管理」。
操作軌跡：
1. 選擇要進行碳盤查的年度與組織邊界。
2. 進入數據輸入介面，選擇排放源（如：電力、燃料、差旅）。
3. 上傳或手動輸入相關活動數據（如：電量、燃料消耗量）。
4. 系統自動應用排放係數進行計算，並顯示各範疇排放量。
5. 檢視碳排放儀表板，分析排放熱點與趨勢。
6. 生成碳盤查報告。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側排放源導航樹，中央數據輸入與計算結果展示，右側碳排放儀表板預覽」的三欄佈局。
核心液態玻璃元件： BrandEmissionInputForm (智能數據輸入表單，支援單位轉換)、BrandCarbonDashboard (互動式碳排放儀表板，包含趨勢圖、圓餅圖)、BrandCoefficientManager (排放係數管理工具)。
行動端適配 (RWD)： 左側導航樹收合為漢堡選單，中央數據輸入區與右側儀表板切換為 Tab 顯示，確保在小螢幕上也能清晰操作與查看。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 活動數據 (energy_consumption, travel_data) -> 排放係數庫 (emission_factors) -> 碳排放計算服務 (Supabase Edge Functions) -> 碳排放結果 (carbon_emissions) -> 儀表板 (dashboard_kpis)。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的能源消耗數據，具體化為可量化的碳排放量，並以圖表形式呈現。
[T2 Traceable 追溯]： 每個碳排放數據都可追溯其原始活動數據、所使用的排放係數及計算邏輯。
[T4 Trustworthy 信任]： 排放係數庫定期更新並標註來源，確保計算結果的權威性與可信度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多範疇排放計算： 支援範疇一、二、三排放量的自動計算。技術使用 Supabase Edge Functions 執行基於 GHG Protocol 的複雜計算邏輯。
排放係數管理： 內建多國排放係數庫，並支援用戶自定義。技術使用 PostgreSQL JSONB 欄位儲存係數數據，並提供管理介面。
互動式碳儀表板： 實時顯示碳排放總量、各範疇佔比、減碳進度。技術使用 D3.js 或 ECharts 進行數據可視化，結合 Supabase Realtime 實現數據更新。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 碳排放儀表板上的圖表在數據量過大時，必須保持清晰可讀，圖例與標籤不可重疊。
🚨 邏輯/體驗紅線： 排放係數更新時，系統必須提示用戶是否重新計算歷史排放數據，並提供回溯功能，防止數據不一致。

---

供應鏈管理 Supply Chain Management
路徑： /supply-chain-module | 權限： PM, SUPPLY_CHAIN_MANAGER | 所屬旅程： IX. 供應鏈與利害關係人管理

1. 模組定位 (Core Purpose)
提供供應鏈 ESG 數據的收集、評估與協作平台，幫助企業管理供應商的環境、社會與治理績效，降低供應鏈風險。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 供應鏈經理。他們需要評估數百甚至數千家供應商的 ESG 表現，但缺乏統一的數據收集工具和評估標準，溝通成本高，難以識別高風險供應商。
體驗高光時刻 (Aha Moment)： 當供應鏈經理發送問卷後，系統自動追蹤供應商填寫進度，並在儀表板上實時顯示各供應商的 ESG 評分與風險等級。經理看到「高風險供應商」被自動標紅，並建議改進措施，感到「供應鏈風險一目了然，決策更有依據」。
操作軌跡：
1. 匯入供應商列表。
2. 選擇 ESG 評估問卷模板，發送給供應商。
3. 監控問卷回收進度與供應商填寫狀態。
4. 系統自動計算供應商 ESG 評分與風險等級。
5. 檢視供應商 ESG 儀表板，識別高風險供應商。
6. 與供應商進行協作，要求改進措施並追蹤進度。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側供應商列表，中央供應商詳細資訊與評估結果，右側供應鏈風險儀表板」的三欄佈局。
核心液態玻璃元件： BrandSupplierTable (供應商列表，支援篩選與排序)、BrandESGRatingCard (顯示供應商 ESG 評分與風險等級)、BrandQuestionnaireBuilder (問卷設計與發送工具)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，中央詳細資訊與右側儀表板切換為 Tab 顯示，確保在行動端也能高效管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 供應商數據 (suppliers) -> 問卷數據 (questionnaires) -> 評估結果 (supplier_esg_ratings) -> 儀表板 (supply_chain_dashboard)。
5T 實踐點：
[T1 Tangible 具體]： 將供應商的 ESG 表現，具體化為可量化的評分與風險等級。
[T2 Traceable 追溯]： 每個供應商的 ESG 評分都可追溯其問卷回答、評估標準及歷史變更。
[T3 Transparent 透明]： 供應商可查看其自身的評估結果與改進建議，促進雙向溝通。

5. 功能項目解說和使用技術 (Features & Tech Stack)
供應商數據管理： 匯入、編輯、分類供應商資訊。技術使用 React Hook Form 建立表單，Supabase PostgreSQL 儲存數據。
ESG 問卷與評估： 設計、發送問卷，自動計算評分。技術使用 Formik 或 React Hook Form 建立動態問卷，Supabase Edge Functions 執行評分邏輯。
供應鏈風險儀表板： 可視化展示供應商 ESG 表現與風險分佈。技術使用 Recharts 或 D3.js 進行數據可視化。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 供應商列表在載入大量供應商時，分頁與滾動條必須正常工作，不可出現卡頓或數據顯示不全。
🚨 邏輯/體驗紅線： 供應商問卷提交後，若因數據格式錯誤導致評分失敗，必須提供清晰的錯誤提示，並引導供應商修正。

---

總覽-Dashboard Overview-Dashboard
路徑： /dashboard | 權限： ALL_USERS | 所屬旅程： VIII. 數據分析與洞察

1. 模組定位 (Core Purpose)
提供企業 ESG 績效的綜合性概覽，通過關鍵指標、趨勢圖與預警系統，幫助用戶快速掌握整體永續發展狀況，支持高層決策。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 高階主管 (CSO, CEO)、永續專案經理 (PM)。他們需要快速了解企業在環境、社會、治理各方面的表現，但傳統報告冗長且數據分散，難以即時掌握核心資訊。
體驗高光時刻 (Aha Moment)： 當 CSO 打開儀表板時，看到所有核心 ESG KPI（如：碳排放量、員工滿意度、董事會多元性）都以直觀的圖表和紅綠燈指示呈現，並能一鍵鑽取查看詳細數據。CSO 感到「企業的永續脈動盡在掌握」。
操作軌跡：
1. 登入系統後，自動進入總覽儀表板。
2. 快速瀏覽各 ESG 領域的核心 KPI 與趨勢。
3. 點擊「碳排放」卡片，鑽取至碳盤查詳情頁面。
4. 檢視系統發出的預警通知，了解潛在風險。
5. 根據儀表板數據，向團隊下達指令或調整策略。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「多卡片網格佈局 (Bento Grid)」，可自定義卡片大小與位置，包含 KPI 數字卡、趨勢圖、圓餅圖、進度條等。
核心液態玻璃元件： BrandKPICard (顯示關鍵指標與趨勢箭頭)、BrandTrendChart (可互動的趨勢圖)、BrandAlertBadge (預警通知徽章)、BrandFilterPanel (全局篩選器)。
行動端適配 (RWD)： 網格佈局自動轉化為單欄堆疊式卡片，卡片內容精簡，確保在小螢幕上也能快速瀏覽核心資訊。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 從 `esg_metrics`、`carbon_emissions`、`employee_data` 等多個數據表聚合數據，經由實時計算服務 (Supabase Edge Functions) 處理後，推送到儀表板。
5T 實踐點：
[T1 Tangible 具體]： 將複雜的 ESG 數據轉化為直觀的 KPI、圖表與視覺化指標。
[T5 Timely 即時]： 儀表板數據實時更新，反映企業最新的 ESG 績效狀態。
[T3 Transparent 透明]： 每個 KPI 都可鑽取至其數據來源與計算邏輯，確保數據透明度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
可客製化儀表板： 用戶可自由拖曳、調整卡片佈局與內容。技術使用 React Grid Layout 實現拖曳佈局，Zustand 進行狀態管理。
實時數據更新： 儀表板數據自動刷新，無需手動操作。技術使用 Supabase Realtime 訂閱數據變更，並通過 WebSocket 推送更新。
多維度數據篩選： 支援按時間、部門、地區等多維度篩選數據。技術使用 React Hook Form 結合 `useMemo` 進行高效數據過濾。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 儀表板卡片在拖曳調整大小時，內容必須自動適應，不可出現文字溢出或圖表變形。
🚨 邏輯/體驗紅線： 儀表板數據載入失敗時，必須顯示友善的錯誤提示，並提供重試按鈕，不可顯示空白或錯誤數據。

---

Digital-Twin-模擬器 Digital-Twin-Simulator
路徑： /digital-twin | 權限： CSO, PM | 所屬旅程： VIII. 數據分析與洞察

1. 模組定位 (Core Purpose)
建立企業營運的 ESG 數位分身，透過模擬不同策略情境（如：導入再生能源、優化供應鏈），預測其對 ESG 績效與財務的影響，支持前瞻性決策。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或策略規劃師。他們需要評估不同減碳或永續投資方案的潛在效益與風險，但傳統分析方法耗時且難以全面考慮多重變數。
體驗高光時刻 (Aha Moment)： 當 CSO 在模擬器中將「再生能源佔比」從 10% 提升到 50% 時，系統立刻在 3D 廠區模型上顯示碳排放量顯著下降，同時預測出未來 5 年的節省成本與投資回報率。CSO 感到「未來策略的影響清晰可見，決策更有信心」。
操作軌跡：
1. 選擇要模擬的 ESG 策略情境（如：減碳路徑、供應鏈優化）。
2. 調整關鍵參數（如：投資金額、技術導入比例）。
3. 啟動模擬，觀察數位分身對 ESG 績效、財務指標的實時影響。
4. 比較不同情境的模擬結果，評估最佳方案。
5. 將模擬結果保存為報告，供內部討論與決策。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側參數設定與情境選擇，中央 3D 互動式數位分身模型，右側模擬結果數據與圖表」的三欄佈局。
核心液態玻璃元件： BrandScenarioConfigurator (情境參數配置器)、Brand3DModelViewer (基於 Three.js 的 3D 模型渲染器)、BrandSimulationResultChart (模擬結果對比圖)。
行動端適配 (RWD)： 左側參數設定區收合為底部 Tab，中央 3D 模型區滿版顯示，右側結果數據則以可滾動的列表呈現。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 歷史營運數據 (esg_metrics, financial_data) + 策略參數 (scenario_configs) -> 模擬引擎 (Supabase Edge Functions / Python ML models) -> 模擬結果 (simulation_results)。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的策略情境，具體化為可視化的 3D 模擬結果與量化的財務/ESG 影響。
[T3 Transparent 透明]： 模擬引擎的關鍵假設與計算邏輯可被查閱，確保模擬過程的透明度。
[T4 Trustworthy 信任]： 模擬基於經過 5T 驗證的歷史數據與權威模型，提升模擬結果的可信度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
3D 數位分身渲染： 實時渲染企業廠區或供應鏈的 3D 模型，並可互動。技術使用 Three.js 或 Babylon.js 進行 3D 渲染，結合 React Three Fiber。
情境模擬引擎： 根據輸入參數，運行複雜的 ESG 與財務影響模型。技術使用 Python 機器學習框架 (如：TensorFlow, PyTorch) 部署為 Supabase Edge Functions 或專用微服務。
結果可視化與對比： 將不同模擬情境的結果以圖表形式進行對比。技術使用 D3.js 或 Plotly.js 進行高級數據可視化。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 3D 模型在不同解析度下必須保持流暢渲染，不可出現卡頓或模型崩潰。
🚨 邏輯/體驗紅線： 模擬結果與歷史數據存在顯著偏差時，系統必須提示用戶檢查輸入參數或模型假設，防止產生誤導性結果。

---

Health-Check-診斷 Health-Check-Diagnosis
路徑： /health-check | 權限： ADMIN, PM | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
提供 ESG 數據品質、合規性與系統健康狀態的全面診斷報告，自動識別潛在問題並提供改進建議，確保平台數據的準確性與系統穩定運行。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN) 或永續專案經理 (PM)。他們需要確保 ESG 數據的準確性與報告的合規性，但手動檢查數據一致性、法規更新非常耗時且容易遺漏。
體驗高光時刻 (Aha Moment)： 當管理員點擊「執行健康檢查」後，系統在數秒內生成一份詳細報告，不僅標示出「某數據欄位缺失率過高」和「某報告章節未滿足最新 GRI 指標」，還提供一鍵修復或導航至相關頁面的選項。管理員感到「系統自動幫我找出問題，並給出解決方案，省心又高效」。
操作軌跡：
1. 進入健康檢查頁面。
2. 選擇要執行的檢查類型（數據品質、合規性、系統性能）。
3. 點擊「執行檢查」，等待報告生成。
4. 檢視診斷報告，優先處理「高風險」項目。
5. 點擊問題詳情，查看改進建議或導航至相關功能頁面進行修正。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側檢查項目列表，右側診斷報告與問題詳情」的雙欄佈局。報告區以 BrandDiagnosticCard 呈現各項檢查結果。
核心液態玻璃元件： BrandDiagnosticCard (顯示檢查結果、風險等級與建議)、BrandProgressBar (顯示檢查進度)、BrandActionLink (一鍵跳轉至問題修正頁面)。
行動端適配 (RWD)： 左側檢查項目列表收合為漢堡選單，右側診斷報告區轉為單欄堆疊式卡片，確保在行動端也能清晰查看診斷結果。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 檢查服務 (Supabase Edge Functions) 從 `esg_metrics`、`report_drafts`、`system_logs` 等表讀取數據，對比 `compliance_rules`、`data_quality_standards` 進行分析，生成 `health_check_reports`。
5T 實踐點：
[T4 Trustworthy 信任]： 定期對數據進行品質檢查，確保數據的真實性與完整性，提升報告的可信度。
[T3 Transparent 透明]： 公開診斷報告，讓用戶了解數據與系統的健康狀況，並提供改進建議。
[T5 Timely 即時]： 可設定定期自動執行健康檢查，確保問題能被及時發現與處理。

5. 功能項目解說和使用技術 (Features & Tech Stack)
數據品質檢查： 檢測數據缺失、異常值、格式不一致等問題。技術使用 SQL 查詢與 Supabase Edge Functions 執行數據驗證邏輯。
合規性掃描： 對比最新 ESG 法規與報告標準，檢查報告內容的合規性。技術使用 Genkit 搭配 Gemini 2.0 Pro 模型進行文本分析與比對。
系統性能監控： 監測 API 響應時間、數據庫負載等系統指標。技術使用 Prometheus/Grafana 進行監控，並將關鍵指標整合至本頁面。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 診斷報告中的圖表或列表在數據量過大時，必須保持清晰可讀，不可出現重疊或截斷。
🚨 邏輯/體驗紅線： 若健康檢查發現「高風險」問題，必須通過系統通知、郵件等方式即時通知相關負責人，不可僅在頁面內顯示。

---

Advisory-顧問 Advisory-Consultant
路徑： /advisory | 權限： PM, CSO | 所屬旅程： VII. 生態協作與學習

1. 模組定位 (Core Purpose)
提供一個平台內置的顧問服務預約與管理介面，讓企業用戶能便捷地與 ESG 專家顧問建立聯繫，獲取專業諮詢與指導。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM) 或永續長 (CSO)。他們在制定 ESG 策略、解決複雜合規問題時，常需要外部專家的意見，但尋找合適的顧問耗時費力，且溝通效率不高。
體驗高光時刻 (Aha Moment)： 當 PM 在平台內瀏覽顧問列表，看到每位顧問的專業領域、案例與可用時間，並能一鍵預約視訊會議。PM 感到「專業顧問近在咫尺，解決問題不再孤單」。
操作軌跡：
1. 進入顧問頁面，瀏覽推薦顧問列表。
2. 根據專業領域、語言、可用時間篩選顧問。
3. 點擊顧問個人檔案，查看詳細介紹與過往案例。
4. 選擇合適的顧問，預約視訊會議時間。
5. 在預約時間通過平台內置的視訊工具與顧問進行交流。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側篩選器，右側顧問卡片網格佈局」的雙欄佈局。顧問卡片顯示顧問頭像、姓名、專長與評分。
核心液態玻璃元件： BrandConsultantCard (顧問資訊卡片)、BrandFilterPanel (篩選器)、BrandBookingModal (預約模態視窗)、BrandVideoCallWidget (內置視訊通話元件)。
行動端適配 (RWD)： 左側篩選器收合為底部 Tab 或模態視窗，右側顧問卡片轉為單欄堆疊式列表，確保在行動端也能方便瀏覽與預約。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 顧問資料 (advisors) -> 預約排程 (bookings) -> 視訊會議服務 (integrated video conferencing API)。
5T 實踐點：
[T4 Trustworthy 信任]： 顧問的資歷、專業領域與客戶評價公開透明，幫助用戶建立信任。
[T3 Transparent 透明]： 預約流程與費用清晰可見，避免隱藏費用。

5. 功能項目解說和使用技術 (Features & Tech Stack)
顧問資料庫與篩選： 儲存顧問的詳細資訊，並提供多維度篩選。技術使用 Supabase PostgreSQL 儲存顧問數據，前端使用 React Hook Form 實現篩選邏輯。
在線預約與排程： 讓用戶直接在平台內預約顧問時間。技術使用 React-Big-Calendar 或 FullCalendar 實現日曆排程，Supabase Edge Functions 處理預約邏輯。
內置視訊通話： 支援平台內的視訊會議功能。技術使用 WebRTC 搭配第三方服務 (如：Daily.co, Twilio Video) 實現。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 顧問卡片在不同內容長度下（如：專長描述），必須保持一致的高度與排版，不可出現卡片高度不一導致的視覺混亂。
🚨 邏輯/體驗紅線： 預約成功後，系統必須向用戶和顧問雙方發送確認通知（郵件、站內信），並在日曆中自動添加事件，防止遺漏。

---

Intelligence-情報 Intelligence-Intelligence
路徑： /intelligence | 權限： CSO, PM | 所屬旅程： VIII. 數據分析與洞察

1. 模組定位 (Core Purpose)
提供 ESG 相關的市場情報、行業趨勢、法規更新與競爭者分析，幫助企業保持對外部環境的敏銳洞察，支持策略制定。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或策略規劃師。他們需要持續關注 ESG 領域的最新動態，但資訊來源分散、更新頻繁，難以高效獲取並消化關鍵情報。
體驗高光時刻 (Aha Moment)： 當 CSO 打開情報頁面時，看到系統自動彙整了最新的「歐盟綠色分類法更新」和「某競爭對手發佈的永續報告分析」，並提供 AI 摘要與影響評估。CSO 感到「外部情報自動送上門，決策更有前瞻性」。
操作軌跡：
1. 進入情報頁面，瀏覽最新 ESG 市場動態與法規更新。
2. 點擊感興趣的情報卡片，查看詳細內容與 AI 摘要。
3. 訂閱特定行業或主題的情報推送。
4. 收藏重要情報，並與團隊成員分享。
5. 根據情報分析，調整企業的 ESG 策略。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側情報分類與篩選器，右側情報卡片流 (Masonry Grid)」的雙欄佈局。情報卡片包含標題、來源、發佈時間、AI 摘要與關鍵標籤。
核心液態玻璃元件： BrandIntelligenceCard (情報卡片，支援 AI 摘要展開/收合)、BrandFilterPanel (情報篩選器)、BrandSubscriptionWidget (情報訂閱元件)。
行動端適配 (RWD)： 左側分類篩選器收合為底部 Tab 或模態視窗，右側情報卡片流轉為單欄堆疊式列表，確保在行動端也能流暢瀏覽。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 外部數據源 (RSS feeds, API from news/research platforms) -> 數據採集與清洗服務 (Supabase Edge Functions) -> AI 分析與摘要 (Genkit/Gemini) -> 情報數據庫 (intelligence_feed)。
5T 實踐點：
[T3 Transparent 透明]： 每條情報都明確標註來源與發佈時間，確保資訊的透明度。
[T5 Timely 即時]： 情報數據實時更新，確保用戶獲取的是最新、最相關的市場動態。
[T4 Trustworthy 信任]： AI 摘要與分析會標註其依據的原始文本，減少誤讀風險。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多源情報聚合： 從多個外部數據源自動採集 ESG 相關情報。技術使用 Web Scraping (如：Puppeteer, Playwright) 或 RSS Feed Parser 部署為 Supabase Edge Functions。
AI 摘要與分析： 對採集到的情報進行自動摘要、關鍵詞提取與影響評估。技術使用 Genkit 搭配 Gemini 2.0 Pro 模型進行自然語言處理。
個性化情報推送： 根據用戶訂閱偏好，推送相關情報。技術使用 Supabase Realtime 或 Web Push API 實現實時通知。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 情報卡片在不同內容長度下，必須保持良好的視覺一致性，不可出現卡片高度不一或內容溢出。
🚨 邏輯/體驗紅線： AI 摘要必須準確反映原始文章的核心內容，若摘要與原文意思嚴重偏離，必須有回報機制。

---

Environmental-環境 Environmental-Environment
路徑： /esg/environmental | 權限： PM, ENVIRONMENTAL_ENGINEER | 所屬旅程： I. 數據採集與整合

1. 模組定位 (Core Purpose)
提供環境相關 ESG 數據的全面管理介面，涵蓋能源、水資源、廢棄物、排放等指標的數據錄入、監測與分析，支持企業環境績效管理。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 環境工程師或永續專案經理。他們需要收集和管理大量的環境數據，但數據來源分散、格式不一，難以進行統一的監測和分析。
體驗高光時刻 (Aha Moment)： 當工程師在環境模組中看到各廠區的能源消耗、水資源使用和廢棄物產生量都以實時圖表呈現，並能輕鬆對比歷史數據和設定目標。工程師感到「環境數據一目了然，管理效率大幅提升」。
操作軌跡：
1. 進入環境模組，選擇要管理的環境指標（如：能源消耗）。
2. 錄入或匯入相關數據（如：電費單、水費單）。
3. 檢視各指標的實時監測圖表與趨勢分析。
4. 設定環境目標，並追蹤達成進度。
5. 生成環境績效報告。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側環境指標導航樹，中央數據輸入與監測儀表板」的雙欄佈局。儀表板包含多個 BrandTrendChart 和 BrandKPICard。
核心液態玻璃元件： BrandMetricInputForm (環境數據輸入表單)、BrandTrendChart (實時趨勢圖)、BrandTargetTracker (目標達成進度條)。
行動端適配 (RWD)： 左側導航樹收合為漢堡選單，中央儀表板轉為單欄堆疊式卡片，確保在行動端也能清晰查看環境數據。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 原始環境數據 (energy_consumption, water_usage, waste_generation) -> 數據清洗與標準化服務 -> `esg_metrics` 表 (環境類)。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的環境行為轉化為可量化的數據指標，並以圖表形式呈現。
[T2 Traceable 追溯]： 每個環境數據都可追溯其原始來源、錄入時間和操作者。
[T5 Timely 即時]： 數據實時更新，確保環境績效監測的即時性。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多指標數據錄入： 支援能源、水資源、廢棄物、排放等多種環境指標的數據錄入。技術使用 React Hook Form 建立動態表單。
實時監測與分析： 提供各環境指標的實時趨勢圖、目標達成進度。技術使用 Recharts 或 D3.js 進行數據可視化，Supabase Realtime 實現數據更新。
目標設定與追蹤： 允許用戶設定環境目標並自動追蹤進度。技術使用 Supabase PostgreSQL 儲存目標數據，Supabase Edge Functions 執行進度計算。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 儀表板上的圖表在數據量過大時，必須保持清晰可讀，圖例與標籤不可重疊。
🚨 邏輯/體驗紅線： 數據錄入時，若輸入值超出合理範圍（如：電量為負數），必須彈出警告並阻止提交，防止錯誤數據污染。

---

Social-社會 Social-Social
路徑： /esg/social | 權限： PM, HR_MANAGER | 所屬旅程： I. 數據採集與整合

1. 模組定位 (Core Purpose)
提供社會面向 ESG 數據的全面管理介面，涵蓋員工福利、多元共融、社區參與、人權等指標的數據錄入、監測與分析，支持企業社會責任管理。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 人力資源經理 (HR Manager) 或永續專案經理。他們需要收集和管理大量的員工數據、社區活動記錄，但數據分散在不同系統，難以進行統一的監測和分析。
體驗高光時刻 (Aha Moment)： 當 HR 經理在社會模組中看到員工流失率、性別多元性、志工時數等指標都以實時圖表呈現，並能輕鬆對比歷史數據和設定目標。經理感到「社會數據清晰可見，管理決策更有依據」。
操作軌跡：
1. 進入社會模組，選擇要管理的社會指標（如：員工多元性）。
2. 錄入或匯入相關數據（如：員工資料、培訓記錄）。
3. 檢視各指標的實時監測圖表與趨勢分析。
4. 設定社會目標，並追蹤達成進度。
5. 生成社會績效報告。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側社會指標導航樹，中央數據輸入與監測儀表板」的雙欄佈局。儀表板包含多個 BrandTrendChart 和 BrandKPICard。
核心液態玻璃元件： BrandMetricInputForm (社會數據輸入表單)、BrandTrendChart (實時趨勢圖)、BrandTargetTracker (目標達成進度條)。
行動端適配 (RWD)： 左側導航樹收合為漢堡選單，中央儀表板轉為單欄堆疊式卡片，確保在行動端也能清晰查看社會數據。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 原始社會數據 (employee_data, community_engagement) -> 數據清洗與標準化服務 -> `esg_metrics` 表 (社會類)。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的社會行為轉化為可量化的數據指標，並以圖表形式呈現。
[T2 Traceable 追溯]： 每個社會數據都可追溯其原始來源、錄入時間和操作者。
[T5 Timely 即時]： 數據實時更新，確保社會績效監測的即時性。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多指標數據錄入： 支援員工福利、多元共融、社區參與、人權等多種社會指標的數據錄入。技術使用 React Hook Form 建立動態表單。
實時監測與分析： 提供各社會指標的實時趨勢圖、目標達成進度。技術使用 Recharts 或 D3.js 進行數據可視化，Supabase Realtime 實現數據更新。
目標設定與追蹤： 允許用戶設定社會目標並自動追蹤進度。技術使用 Supabase PostgreSQL 儲存目標數據，Supabase Edge Functions 執行進度計算。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 儀表板上的圖表在數據量過大時，必須保持清晰可讀，圖例與標籤不可重疊。
🚨 邏輯/體驗紅線： 涉及個人隱私的數據（如：員工薪資）在展示時必須進行脫敏處理，確保數據安全與合規。

---

Governance-治理 Governance-Governance
路徑： /esg/governance | 權限： PM, LEGAL_COMPLIANCE | 所屬旅程： I. 數據採集與整合

1. 模組定位 (Core Purpose)
提供治理面向 ESG 數據的全面管理介面，涵蓋董事會結構、商業道德、風險管理、合規性等指標的數據錄入、監測與分析，支持企業治理績效管理。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 法務合規經理 (Legal Compliance) 或永續專案經理。他們需要收集和管理大量的公司治理數據，如董事會會議記錄、風險評估報告，但數據分散且難以進行統一的監測和分析。
體驗高光時刻 (Aha Moment)： 當合規經理在治理模組中看到董事會多元性、風險評估分數、合規培訓完成率等指標都以實時圖表呈現，並能輕鬆對比歷史數據和設定目標。經理感到「治理數據清晰可見，風險管理更有信心」。
操作軌跡：
1. 進入治理模組，選擇要管理的治理指標（如：董事會多元性）。
2. 錄入或匯入相關數據（如：董事會成員資料、風險評估報告）。
3. 檢視各指標的實時監測圖表與趨勢分析。
4. 設定治理目標，並追蹤達成進度。
5. 生成治理績效報告。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側治理指標導航樹，中央數據輸入與監測儀表板」的雙欄佈局。儀表板包含多個 BrandTrendChart 和 BrandKPICard。
核心液態玻璃元件： BrandMetricInputForm (治理數據輸入表單)、BrandTrendChart (實時趨勢圖)、BrandTargetTracker (目標達成進度條)。
行動端適配 (RWD)： 左側導航樹收合為漢堡選單，中央儀表板轉為單欄堆疊式卡片，確保在行動端也能清晰查看治理數據。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 原始治理數據 (board_composition, risk_assessments, compliance_training) -> 數據清洗與標準化服務 -> `esg_metrics` 表 (治理類)。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的治理行為轉化為可量化的數據指標，並以圖表形式呈現。
[T2 Traceable 追溯]： 每個治理數據都可追溯其原始來源、錄入時間和操作者。
[T5 Timely 即時]： 數據實時更新，確保治理績效監測的即時性。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多指標數據錄入： 支援董事會結構、商業道德、風險管理、合規性等多種治理指標的數據錄入。技術使用 React Hook Form 建立動態表單。
實時監測與分析： 提供各治理指標的實時趨勢圖、目標達成進度。技術使用 Recharts 或 D3.js 進行數據可視化，Supabase Realtime 實現數據更新。
目標設定與追蹤： 允許用戶設定治理目標並自動追蹤進度。技術使用 Supabase PostgreSQL 儲存目標數據，Supabase Edge Functions 執行進度計算。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 儀表板上的圖表在數據量過大時，必須保持清晰可讀，圖例與標籤不可重疊。
🚨 邏輯/體驗紅線： 涉及敏感的公司治理文件（如：內部審計報告）必須嚴格控制訪問權限，防止未經授權的查看。

---

Templates-模板 Templates-Templates
路徑： /templates | 權限： PM, ADMIN | 所屬旅程： III. 報告框架與撰寫

1. 模組定位 (Core Purpose)
提供豐富的 ESG 報告模板、數據收集問卷模板與內容框架，幫助用戶快速啟動報告撰寫與數據收集工作，確保內容符合國際標準。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM)。他們需要撰寫符合 GRI/ISSB 標準的報告或設計數據收集問卷，但從零開始耗時費力，且難以確保內容的完整性與合規性。
體驗高光時刻 (Aha Moment)： 當 PM 瀏覽模板庫，看到各種預設的報告章節、數據指標和問卷問題，並能一鍵套用至自己的專案。PM 感到「有了這些專業模板，我的工作效率至少提升一倍」。
操作軌跡：
1. 進入模板頁面，瀏覽報告模板、問卷模板和內容框架。
2. 根據需求篩選或搜索特定模板（如：GRI 報告模板）。
3. 預覽模板內容，確認是否符合需求。
4. 選擇模板，一鍵套用至新的報告或問卷專案。
5. 根據企業實際情況，對套用後的模板進行客製化修改。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側模板分類與篩選器，右側模板卡片網格佈局」的雙欄佈局。模板卡片顯示模板名稱、類型、適用標準與預覽圖。
核心液態玻璃元件： BrandTemplateCard (模板預覽卡片)、BrandFilterPanel (模板篩選器)、BrandPreviewModal (模板詳細預覽模態視窗)。
行動端適配 (RWD)： 左側分類篩選器收合為底部 Tab 或模態視窗，右側模板卡片流轉為單欄堆疊式列表，確保在行動端也能方便瀏覽與選擇。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 模板數據 (templates) 儲存於 Supabase PostgreSQL，用戶套用模板時，會將模板內容複製到 `report_drafts` 或 `questionnaires` 表。
5T 實踐點：
[T3 Transparent 透明]： 每個模板都明確標註其適用的國際標準（如：GRI 2021），確保用戶了解其合規性依據。
[T4 Trustworthy 信任]： 平台提供的模板由 ESG 專家團隊設計並定期更新，確保其專業性與權威性。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多類型模板庫： 包含報告模板、問卷模板、內容框架等。技術使用 Supabase PostgreSQL 儲存模板元數據，模板內容以 JSON 或 Markdown 格式儲存。
模板預覽與篩選： 提供模板的詳細預覽功能，並支援多維度篩選。技術使用 React Modal 顯示預覽，React Hook Form 實現篩選。
一鍵套用與客製化： 用戶可一鍵套用模板，並在編輯器中進行修改。技術使用 GraphQL Mutations 或 REST API 複製模板內容。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 模板卡片在不同內容長度下，必須保持良好的視覺一致性，不可出現卡片高度不一或內容溢出。
🚨 邏輯/體驗紅線： 套用模板後，若因模板內容與當前專案數據模型不兼容導致錯誤，必須提供清晰的錯誤提示與解決方案。

---

Audit-Log-審計日誌 Audit-Log-AuditLog
路徑： /audit-log | 權限： ADMIN, AUDITOR | 所屬旅程： V. 確信審計與發佈

1. 模組定位 (Core Purpose)
記錄系統內所有關鍵操作與數據變更的詳細日誌，提供可追溯、不可篡改的審計軌跡，確保數據的完整性與合規性，支持內外部審計。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN) 或外部稽核員 (AUDITOR)。他們需要追蹤數據的來源、變更歷史和操作者，以確保數據的真實性與合規性，但傳統系統的日誌分散且難以查詢。
體驗高光時刻 (Aha Moment)： 當稽核員在審計日誌中輸入「碳排放數據」並篩選「修改」操作，系統立刻顯示出所有相關的數據變更記錄，包括誰在何時修改了哪個數據，以及修改前後的對比。稽核員感到「所有操作都無所遁形，數據可信度極高」。
操作軌跡：
1. 進入審計日誌頁面。
2. 根據用戶、操作類型、時間範圍或數據對象進行篩選。
3. 檢視日誌列表，查看關鍵操作的摘要。
4. 點擊日誌詳情，查看操作的完整上下文、修改前後的數據對比。
5. 導出審計日誌報告。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「頂部篩選器與搜索欄，下方 BrandDataTable 審計日誌列表」的單欄佈局。日誌列表顯示操作者、時間、操作類型、對象與摘要。
核心液態玻璃元件： BrandDataTable (審計日誌列表，支援篩選、排序、分頁)、BrandFilterPanel (多維度篩選器)、BrandLogDetailModal (日誌詳情模態視窗)。
行動端適配 (RWD)： 篩選器收合為底部 Tab 或模態視窗，日誌列表轉為堆疊式資料卡片，僅顯示核心信息，點擊卡片展開詳情。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 所有關鍵操作 (CRUD on `esg_metrics`, `report_drafts`, `user_management` etc.) 都會觸發寫入 `audit_logs` 表。
5T 實踐點：
[T2 Traceable 追溯]： 記錄所有關鍵操作的詳細信息，包括操作者、時間、IP 地址、操作類型、受影響的數據對象，確保所有數據變更都可追溯。
[T4 Trustworthy 信任]： 審計日誌本身採用不可篡改的儲存機制（如：Append-only logs），確保日誌的真實性與完整性。

5. 功能項目解說和使用技術 (Features & Tech Stack)
實時日誌記錄： 系統內所有關鍵操作都會被實時記錄。技術使用 Supabase Row Level Security (RLS) 觸發 PostgreSQL Triggers 寫入日誌表，或通過後端微服務攔截 API 請求。
多維度查詢與篩選： 支援按用戶、操作類型、時間、數據對象等多維度查詢日誌。技術使用 Supabase PostgreSQL 的全文搜索與索引優化。
日誌詳情與數據對比： 顯示操作的完整上下文，並對數據修改提供前後對比。技術使用 JSON Diff 庫在前端展示數據差異。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 審計日誌列表在載入大量日誌時，分頁與滾動條必須正常工作，不可出現卡頓或數據顯示不全。
🚨 邏輯/體驗紅線： 任何嘗試修改審計日誌的行為都必須被系統阻斷並記錄為「安全事件」，並向管理員發出警報。

---

Roadmap-路線圖 Roadmap-Roadmap
路徑： /esg-roadmap | 權限： CSO, PM | 所屬旅程： II. 策略盤點與分派

1. 模組定位 (Core Purpose)
提供企業 ESG 策略與行動計劃的可視化路線圖，幫助用戶規劃、追蹤和溝通永續發展目標，確保策略與執行的一致性。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或專案經理 (PM)。他們需要制定長期的 ESG 策略，並將其分解為具體的行動計劃，但傳統的 Excel 或 PPT 難以動態追蹤進度，也難以向利害關係人清晰溝通。
體驗高光時刻 (Aha Moment)： 當 CSO 在路線圖頁面看到未來 3-5 年的 ESG 目標（如：2030 碳中和）以甘特圖形式清晰呈現，每個里程碑都連結到具體任務和負責人，並能實時更新進度。CSO 感到「永續發展的藍圖一目了然，團隊協作更有方向」。
操作軌跡：
1. 進入 ESG 路線圖頁面。
2. 創建新的 ESG 目標（如：減碳、多元共融）。
3. 將目標分解為具體的里程碑和任務。
4. 為每個任務分配負責人、設定截止日期。
5. 實時更新任務進度，觀察路線圖的變化。
6. 與利害關係人分享路線圖，溝通進度與挑戰。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側目標與任務列表，右側互動式甘特圖 (Gantt Chart)」的雙欄佈局。甘特圖顯示任務時間軸、進度條與里程碑。
核心液態玻璃元件： BrandGanttChart (互動式甘特圖，支援拖曳調整)、BrandTaskCard (任務資訊卡片)、BrandProgressIndicator (進度指示器)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，右側甘特圖轉為可滾動的列表視圖，或提供橫向全屏模式以查看完整時間軸。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： ESG 目標 (esg_goals) -> 里程碑 (milestones) -> 任務 (tasks) -> 路線圖數據 (roadmap_data)。任務進度更新會影響路線圖的視覺呈現。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的 ESG 願景具體化為可視化的時間軸、里程碑與任務。
[T2 Traceable 追溯]： 每個目標、里程碑和任務都可追溯其創建者、修改歷史和相關數據。
[T3 Transparent 透明]： 路線圖可與內部團隊和外部利害關係人分享，提升策略溝通的透明度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
互動式甘特圖： 支援任務拖曳、調整時間、進度更新。技術使用 DHTMLX Gantt 或 React-Gantt 進行甘特圖渲染。
目標與任務管理： 創建、編輯、分配 ESG 目標與任務。技術使用 React Hook Form 建立表單，Supabase PostgreSQL 儲存數據。
進度追蹤與可視化： 實時更新任務進度，並在甘特圖上反映。技術使用 Supabase Realtime 訂閱任務狀態變更。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 甘特圖在任務數量過多時，必須保持清晰可讀，任務條不可重疊，且滾動條正常工作。
🚨 邏輯/體驗紅線： 任務截止日期過期但進度未完成時，必須自動標記為「逾期」並發出提醒，防止任務被遺忘。

---

Publish-發佈 Publish-Publish
路徑： /publish | 權限： CSO, ADMIN | 所屬旅程： V. 確信審計與發佈

1. 模組定位 (Core Purpose)
提供 ESG 報告與相關資訊的公開發佈功能，支援多渠道發佈（如：網站、PDF 下載、新聞稿），並管理發佈版本與權限。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或系統管理員 (ADMIN)。他們需要將完成的 ESG 報告公開發佈，但手動上傳到多個平台耗時費力，且難以確保發佈內容的一致性與安全性。
體驗高光時刻 (Aha Moment)： 當 CSO 點擊「一鍵發佈」後，系統自動將報告生成為多種格式，並同步更新到企業官網的閱覽室和提供可分享的下載連結。CSO 感到「報告發佈從未如此便捷且專業」。
操作軌跡：
1. 選擇要發佈的 ESG 報告或資訊。
2. 選擇發佈渠道與格式（如：PDF、網頁版）。
3. 設定發佈權限與可見範圍（公開、僅限連結）。
4. 點擊「發佈」，系統自動處理。
5. 檢視已發佈內容的狀態與訪問數據。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側待發佈列表，右側發佈設定與預覽」的雙欄佈局。發佈設定包含渠道選擇、權限設定與版本管理。
核心液態玻璃元件： BrandPublishList (待發佈內容列表)、BrandPublishSettings (發佈設定表單)、BrandShareLink (可分享連結生成器)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，右側發佈設定區轉為單欄堆疊式表單，確保在行動端也能方便操作。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 從 `report_drafts`、`esg_metrics` 獲取內容，經由發佈服務 (PDF Renderer, Web Page Generator) 處理後，儲存至 `published_reports` 表與 Supabase Storage，並更新 `reading_room` 內容。
5T 實踐點：
[T3 Transparent 透明]： 發佈的報告會明確標註版本號、發佈時間與來源，確保資訊的透明度。
[T4 Trustworthy 信任]： 發佈內容會經過最終的合規性檢查，確保其真實性與可信度。
[T2 Traceable 追溯]： 每次發佈操作都會記錄在審計日誌中，包括發佈者、時間和發佈內容。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多格式發佈： 支援將報告發佈為 PDF、響應式網頁等格式。技術使用 Puppeteer 或 Headless Chrome 進行 HTML 到 PDF 的轉換，Next.js 靜態生成網頁。
版本管理與回溯： 支援發佈多個版本，並可回溯至歷史版本。技術使用 Supabase 的版本控制功能。
權限與可見性控制： 設定報告的公開範圍與訪問權限。技術使用 Supabase Row Level Security (RLS) 控制數據訪問。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 發佈預覽頁面在不同設備上必須保持響應式佈局，不可出現內容溢出或排版混亂。
🚨 邏輯/體驗紅線： 發佈成功後，必須生成有效的公開連結，且該連結在任何瀏覽器中都能正常訪問，不可出現 404 錯誤。

---

Reading-Room-閱覽室 Reading-Room-ReadingRoom
路徑： /reading-room | 權限： ALL_USERS | 所屬旅程： VII. 生態協作與學習

1. 模組定位 (Core Purpose)
作為企業公開 ESG 報告、新聞稿、政策文件等資訊的統一入口，提供便捷的瀏覽、搜索與下載功能，提升企業永續發展的透明度與溝通效率。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 外部利害關係人（投資者、客戶、媒體）和內部員工。他們需要快速獲取企業的 ESG 相關公開資訊，但傳統企業網站的資訊分散且難以查找。
體驗高光時刻 (Aha Moment)： 當投資者在閱覽室中輸入「碳中和目標」，系統立刻篩選出所有相關的報告、新聞稿和政策文件，並能直接在線預覽或下載。投資者感到「企業的 ESG 資訊透明且易於獲取」。
操作軌跡：
1. 進入閱覽室頁面。
2. 瀏覽最新發佈的 ESG 報告與新聞。
3. 使用搜索欄或篩選器查找特定內容。
4. 點擊感興趣的報告，在線預覽或下載 PDF。
5. 分享報告連結給其他利害關係人。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「頂部搜索欄與分類篩選器，下方內容卡片網格佈局」的單欄佈局。內容卡片顯示標題、發佈日期、類型與預覽圖。
核心液態玻璃元件： BrandContentCard (內容預覽卡片)、BrandSearchInput (搜索欄)、BrandFilterPanel (分類篩選器)、BrandPDFViewer (內置 PDF 預覽器)。
行動端適配 (RWD)： 搜索欄與篩選器收合為底部 Tab 或模態視窗，內容卡片流轉為單欄堆疊式列表，確保在行動端也能流暢瀏覽。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 從 `published_reports`、`news_releases` 等表讀取公開內容，並提供給前端展示。
5T 實踐點：
[T3 Transparent 透明]： 所有公開發佈的 ESG 資訊都集中展示，提升企業的透明度。
[T4 Trustworthy 信任]： 閱覽室中的內容均來自平台內部經過 5T 驗證的發佈流程，確保資訊的真實性。
[T5 Timely 即時]： 閱覽室內容與發佈功能同步更新，確保用戶獲取的是最新資訊。

5. 功能項目解說和使用技術 (Features & Tech Stack)
內容搜索與篩選： 支援全文搜索與按類型、日期、關鍵詞篩選內容。技術使用 Supabase PostgreSQL 的全文搜索功能。
在線預覽與下載： 支援 PDF 報告的在線預覽與下載。技術使用 React-PDF 庫進行前端預覽。
響應式內容展示： 確保所有內容在不同設備上都能良好顯示。技術使用 Next.js 靜態生成頁面，並結合 CSS Media Queries。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 內容卡片在不同內容長度下，必須保持良好的視覺一致性，不可出現卡片高度不一或內容溢出。
🚨 邏輯/體驗紅線： 任何已發佈的內容，其公開連結必須始終有效，不可出現 404 錯誤。

---

Library-知識庫 Library-Library
路徑： /library | 權限： ALL_USERS | 所屬旅程： VII. 生態協作與學習

1. 模組定位 (Core Purpose)
提供一個集中的 ESG 知識庫，包含行業指南、最佳實踐、法規解讀、術語詞典等資源，幫助用戶提升 ESG 專業知識與能力。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 所有平台用戶。他們在學習 ESG 知識、理解複雜法規或查找專業術語時，往往需要花費大量時間在網路上搜索，且資訊質量參差不齊。
體驗高光時刻 (Aha Moment)： 當用戶在知識庫中搜索「雙重重大性」，系統立刻顯示出詳細的解釋、案例分析和相關法規連結。用戶感到「所有 ESG 知識都在這裡，學習效率大大提高」。
操作軌跡：
1. 進入知識庫頁面。
2. 瀏覽不同分類的知識文章（如：GRI 準則、ISSB 標準）。
3. 使用搜索欄或篩選器查找特定知識點。
4. 點擊文章，閱讀詳細內容。
5. 收藏重要文章，或與團隊成員分享。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側知識分類導航樹，右側知識文章列表與詳情」的雙欄佈局。文章列表顯示標題、摘要與關鍵詞。
核心液態玻璃元件： BrandKnowledgeCard (知識文章預覽卡片)、BrandCategoryTree (知識分類導航樹)、BrandArticleViewer (文章內容展示區)。
行動端適配 (RWD)： 左側導航樹收合為漢堡選單，右側文章列表轉為單欄堆疊式卡片，文章詳情頁面滿版顯示，確保在行動端也能流暢閱讀。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 知識文章內容 (knowledge_articles) 儲存於內容管理系統 (CMS) 或 Supabase PostgreSQL，並提供給前端展示。
5T 實踐點：
[T4 Trustworthy 信任]： 知識庫內容由 ESG 專家團隊編撰並定期審核更新，確保其專業性與權威性。
[T3 Transparent 透明]： 文章會標註其參考來源與更新日期，確保資訊的透明度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多分類知識文章： 支援多層級的知識分類與文章管理。技術使用 Supabase PostgreSQL 儲存文章元數據，文章內容以 Markdown 格式儲存。
全文搜索與篩選： 支援對知識文章進行全文搜索與按分類、標籤篩選。技術使用 Supabase PostgreSQL 的全文搜索功能。
文章內容展示： 提供清晰易讀的文章內容展示。技術使用 React Markdown 或 MDX 渲染 Markdown 內容。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 文章內容在不同螢幕尺寸下，文字排版必須保持一致，不可出現文字溢出或圖片與文字重疊。
🚨 邏輯/體驗紅線： 知識庫搜索功能必須在 3 秒內返回結果，不可出現長時間加載或無結果。

---

Finance-財務 Finance-Finance
路徑： /finance-integration | 權限： PM, FINANCE_MANAGER | 所屬旅程： I. 數據採集與整合

1. 模組定位 (Core Purpose)
提供財務數據與 ESG 數據的整合介面，幫助企業將財務績效與永續發展目標掛鉤，實現 ESG 投資與財務影響的量化分析。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 財務經理 (Finance Manager) 或永續專案經理。他們需要評估 ESG 投資對財務的影響，或將財務數據納入 ESG 報告，但財務系統與 ESG 系統通常是獨立的，數據整合困難。
體驗高光時刻 (Aha Moment)： 當財務經理在財務整合模組中連接 ERP 系統後，系統自動將財務數據（如：資本支出、營收）與 ESG 數據（如：減碳投資）進行關聯，並在儀表板上顯示 ESG 投資的 ROI。經理感到「ESG 不再只是成本，而是可量化的財務效益」。
操作軌跡：
1. 進入財務整合頁面。
2. 連接企業的財務系統（如：ERP、會計系統）。
3. 映射財務數據欄位至 ESG GO 的標準數據模型。
4. 檢視財務與 ESG 數據的關聯分析儀表板。
5. 根據分析結果，評估 ESG 投資的財務影響。
6. 生成財務與 ESG 整合報告。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側系統連接與數據映射，右側財務與 ESG 整合儀表板」的雙欄佈局。儀表板包含 BrandROIChart 和 BrandCorrelationMatrix。
核心液態玻璃元件： BrandSystemConnector (財務系統連接器)、BrandDataMapper (數據映射工具)、BrandROIChart (投資回報率圖表)、BrandCorrelationMatrix (數據關聯矩陣)。
行動端適配 (RWD)： 左側連接與映射區收合為底部 Tab 或模態視窗，右側儀表板轉為單欄堆疊式卡片，確保在行動端也能清晰查看。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 外部財務系統 -> 數據採集服務 -> `financial_data` 表 -> 與 `esg_metrics` 表進行關聯分析。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的 ESG 投資轉化為可量化的財務回報率與影響。
[T2 Traceable 追溯]： 財務數據的來源與映射邏輯可追溯，確保數據的準確性。
[T4 Trustworthy 信任]： 財務數據與 ESG 數據的整合過程透明，確保分析結果的可信度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
多財務系統連接： 支援連接主流 ERP、會計系統。技術使用 OAuth 2.0 進行安全認證，後端 Supabase Edge Functions 處理 API 接口。
數據映射與轉換： 將財務數據映射至 ESG GO 的數據模型。技術使用 React DnD 實現拖曳式映射，Supabase Edge Functions 執行數據轉換。
財務與 ESG 關聯分析： 計算 ESG 投資的 ROI、分析財務與 ESG 指標的相關性。技術使用 Python 數據科學庫 (如：SciPy, NumPy) 部署為 Supabase Edge Functions。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 儀表板上的圖表在數據量過大時，必須保持清晰可讀，圖例與標籤不可重疊。
🚨 邏輯/體驗紅線： 財務數據與 ESG 數據關聯失敗時，必須提供清晰的錯誤提示，並引導用戶檢查數據映射配置。

---

供應鏈 Supply-Chain
路徑： /supply-chain | 權限： PM, SUPPLY_CHAIN_MANAGER | 所屬旅程： IX. 供應鏈與利害關係人管理

1. 模組定位 (Core Purpose)
提供供應鏈 ESG 數據的收集、評估與協作平台，幫助企業管理供應商的環境、社會與治理績效，降低供應鏈風險。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 供應鏈經理。他們需要評估數百甚至數千家供應商的 ESG 表現，但缺乏統一的數據收集工具和評估標準，溝通成本高，難以識別高風險供應商。
體驗高光時刻 (Aha Moment)： 當供應鏈經理發送問卷後，系統自動追蹤供應商填寫進度，並在儀表板上實時顯示各供應商的 ESG 評分與風險等級。經理看到「高風險供應商」被自動標紅，並建議改進措施，感到「供應鏈風險一目了然，決策更有依據」。
操作軌跡：
1. 匯入供應商列表。
2. 選擇 ESG 評估問卷模板，發送給供應商。
3. 監控問卷回收進度與供應商填寫狀態。
4. 系統自動計算供應商 ESG 評分與風險等級。
5. 檢視供應商 ESG 儀表板，識別高風險供應商。
6. 與供應商進行協作，要求改進措施並追蹤進度。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側供應商列表，中央供應商詳細資訊與評估結果，右側供應鏈風險儀表板」的三欄佈局。
核心液態玻璃元件： BrandSupplierTable (供應商列表，支援篩選與排序)、BrandESGRatingCard (顯示供應商 ESG 評分與風險等級)、BrandQuestionnaireBuilder (問卷設計與發送工具)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，中央詳細資訊與右側儀表板切換為 Tab 顯示，確保在行動端也能高效管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 供應商數據 (suppliers) -> 問卷數據 (questionnaires) -> 評估結果 (supplier_esg_ratings) -> 儀表板 (supply_chain_dashboard)。
5T 實踐點：
[T1 Tangible 具體]： 將供應商的 ESG 表現，具體化為可量化的評分與風險等級。
[T2 Traceable 追溯]： 每個供應商的 ESG 評分都可追溯其問卷回答、評估標準及歷史變更。
[T3 Transparent 透明]： 供應商可查看其自身的評估結果與改進建議，促進雙向溝通。

5. 功能項目解說和使用技術 (Features & Tech Stack)
供應商數據管理： 匯入、編輯、分類供應商資訊。技術使用 React Hook Form 建立表單，Supabase PostgreSQL 儲存數據。
ESG 問卷與評估： 設計、發送問卷，自動計算評分。技術使用 Formik 或 React Hook Form 建立動態問卷，Supabase Edge Functions 執行評分邏輯。
供應鏈風險儀表板： 可視化展示供應商 ESG 表現與風險分佈。技術使用 Recharts 或 D3.js 進行數據可視化。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 供應商列表在載入大量供應商時，分頁與滾動條必須正常工作，不可出現卡頓或數據顯示不全。
🚨 邏輯/體驗紅線： 供應商問卷提交後，若因數據格式錯誤導致評分失敗，必須提供清晰的錯誤提示，並引導供應商修正。

---

Stakeholders-利害關係人 Stakeholders-Stakeholders
路徑： /stakeholders | 權限： PM, CSO | 所屬旅程： IX. 供應鏈與利害關係人管理

1. 模組定位 (Core Purpose)
提供利害關係人識別、分析、溝通與參與的管理平台，幫助企業有效管理與各利害關係人的關係，提升企業聲譽與永續發展的包容性。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM) 或永續長 (CSO)。他們需要識別並分析企業的各類利害關係人（如：員工、客戶、投資者、社區），但缺乏統一的工具來管理溝通記錄和參與活動。
體驗高光時刻 (Aha Moment)： 當 PM 在利害關係人模組中看到所有利害關係人的列表、影響力矩陣和溝通記錄，並能一鍵發送問卷或安排會議。PM 感到「利害關係人管理變得有條不紊，溝通效率大大提升」。
操作軌跡：
1. 進入利害關係人頁面，匯入或手動添加利害關係人。
2. 進行利害關係人分析（如：影響力與關注度矩陣）。
3. 記錄與利害關係人的溝通活動與互動歷史。
4. 發送問卷或通知，收集利害關係人意見。
5. 檢視利害關係人參與度儀表板。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側利害關係人列表，中央詳細資訊與溝通記錄，右側影響力矩陣與參與度儀表板」的三欄佈局。
核心液態玻璃元件： BrandStakeholderTable (利害關係人列表)、BrandEngagementLog (溝通記錄時間軸)、BrandInfluenceMatrix (影響力與關注度矩陣圖)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，中央詳細資訊與右側儀表板切換為 Tab 顯示，確保在行動端也能高效管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 利害關係人數據 (stakeholders) -> 溝通記錄 (engagement_logs) -> 參與度數據 (engagement_metrics)。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的利害關係人關係，具體化為可視化的影響力矩陣與量化的參與度指標。
[T2 Traceable 追溯]： 所有與利害關係人的溝通記錄與互動歷史都可追溯。
[T3 Transparent 透明]： 內部團隊可共享利害關係人信息與溝通記錄，提升協作透明度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
利害關係人數據管理： 匯入、編輯、分類利害關係人資訊。技術使用 React Hook Form 建立表單，Supabase PostgreSQL 儲存數據。
影響力與關注度分析： 幫助用戶評估利害關係人的影響力與關注度。技術使用 D3.js 渲染互動式矩陣圖。
溝通記錄與活動管理： 記錄與利害關係人的溝通歷史，並管理參與活動。技術使用 Supabase PostgreSQL 儲存日誌，React Calendar 進行活動排程。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 影響力矩陣圖在不同數據量下，必須保持清晰可讀，利害關係人標籤不可重疊。
🚨 邏輯/體驗紅線： 涉及利害關係人敏感資訊（如：個人聯繫方式）必須嚴格控制訪問權限，防止數據洩露。

---

Audit-Verify-VerifyLink Audit-Verify-VerifyLink
路徑： /verify-link | 權限： AUDITOR, PUBLIC | 所屬旅程： V. 確信審計與發佈

1. 模組定位 (Core Purpose)
提供一個公開的數據驗證連結，允許外部稽核員或公眾通過輸入特定代碼，查詢 ESG 報告中關鍵數據的原始佐證文件與審計軌跡，極大提升報告的可信度與透明度。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 外部稽核員、投資者或公眾。他們在審閱 ESG 報告時，常對數據的真實性與來源存疑，但缺乏直接驗證的渠道。
體驗高光時刻 (Aha Moment)： 當稽核員在 VerifyLink 頁面輸入報告中提供的驗證碼，系統立刻顯示出該數據所對應的加密佐證文件（如：電費單 PDF）和其 SHA-256 Hash 值。稽核員感到「數據的真實性得到了區塊鏈級別的驗證，信任感瞬間建立」。
操作軌跡：
1. 訪問 VerifyLink 頁面。
2. 輸入 ESG 報告中提供的數據驗證碼。
3. 系統查詢並顯示該數據的原始佐證文件、Hash 值和審計軌跡摘要。
4. 稽核員可下載佐證文件，並自行驗證 Hash 值。
5. 確認數據的真實性與可追溯性。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「中央驗證輸入框，下方驗證結果展示區」的單欄佈局。結果區顯示文件縮圖、Hash 值、時間戳與審計摘要。
核心液態玻璃元件： BrandVerificationInput (驗證碼輸入框)、BrandVerifiedResultCard (驗證結果卡片，顯示文件預覽與 Hash)、BrandStatusDot (驗證狀態指示燈)。
行動端適配 (RWD)： 頁面內容自動適應行動端，輸入框與結果卡片垂直堆疊，確保在小螢幕上也能清晰操作與查看。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 用戶輸入驗證碼 -> 查詢 `evidence_vault` 表 (通過 RLS 限制訪問權限) -> 返回佐證文件元數據與 Hash 值。
5T 實踐點：
[T4 Trustworthy 信任]： 透過公開的驗證連結與加密 Hash 值，讓第三方可獨立驗證數據的真實性與完整性，建立最高級別的信任。
[T2 Traceable 追溯]： 驗證結果會顯示佐證文件的上傳時間、操作者等審計軌跡摘要，確保數據來源可追溯。
[T3 Transparent 透明]： 提供公開透明的驗證機制，讓所有利害關係人都能核實報告數據。

5. 功能項目解說和使用技術 (Features & Tech Stack)
數據驗證碼查詢： 根據唯一的驗證碼查詢對應的佐證文件。技術使用 Supabase PostgreSQL 查詢，並通過 RLS 確保只有公開的元數據可被訪問。
文件預覽與 Hash 顯示： 顯示佐證文件的縮圖預覽和 SHA-256 Hash 值。技術使用 React-PDF 渲染縮圖，並直接從數據庫獲取 Hash 值。
審計軌跡摘要： 顯示佐證文件的關鍵審計信息。技術使用 Supabase PostgreSQL 查詢 `audit_logs` 表的相關記錄。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 驗證結果卡片在不同內容長度下，必須保持良好的視覺一致性，不可出現內容溢出。
🚨 邏輯/體驗紅線： 輸入無效驗證碼時，必須顯示友善的錯誤提示：「驗證碼無效或已過期」，而非顯示空白頁面或技術錯誤。

---

Academy-學院 Academy-Academy
路徑： /academy | 權限： ALL_USERS | 所屬旅程： VII. 生態協作與學習

1. 模組定位 (Core Purpose)
提供一系列 ESG 相關的線上課程、培訓材料與認證計畫，幫助用戶系統性地學習 ESG 知識，提升專業技能，並獲得行業認可。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 所有平台用戶，特別是 ESG 新手或希望提升專業技能的從業者。他們需要系統化的學習資源，但市面上的課程質量參差不齊，且缺乏實踐指導。
體驗高光時刻 (Aha Moment)： 當用戶在學院中完成一門「碳盤查基礎」課程，並通過測驗獲得數位證書，同時系統推薦了「碳足跡計算實踐」的進階課程。用戶感到「在這裡不僅學到知識，還能獲得認證和持續成長的機會」。
操作軌跡：
1. 進入學院頁面，瀏覽推薦課程或課程分類。
2. 選擇感興趣的課程，查看課程大綱與講師介紹。
3. 報名課程，開始學習（觀看視頻、閱讀材料、完成作業）。
4. 參與線上討論，與其他學員互動。
5. 完成課程並通過測驗，獲得數位證書。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側課程分類導航，右側課程卡片網格佈局」的雙欄佈局。課程卡片顯示課程名稱、講師、進度與評分。
核心液態玻璃元件： BrandCourseCard (課程預覽卡片)、BrandCategoryTree (課程分類導航樹)、BrandVideoPlayer (內置視頻播放器)、BrandCertificateBadge (數位證書徽章)。
行動端適配 (RWD)： 左側導航樹收合為漢堡選單，右側課程卡片流轉為單欄堆疊式列表，課程詳情頁面滿版顯示，確保在行動端也能流暢學習。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 課程內容 (courses, lessons) 儲存於 Supabase Storage (視頻) 和 PostgreSQL (元數據)，用戶學習進度 (user_progress) 儲存於 PostgreSQL。
5T 實踐點：
[T4 Trustworthy 信任]： 學院課程內容由權威 ESG 專家設計，確保知識的專業性與準確性。
[T3 Transparent 透明]： 課程大綱、學習目標、評分標準公開透明，讓學員清楚了解學習路徑。

5. 功能項目解說和使用技術 (Features & Tech Stack)
課程內容管理： 支援視頻、文本、測驗等多種課程內容類型。技術使用 Supabase Storage 儲存視頻文件，Supabase PostgreSQL 儲存課程元數據。
學習進度追蹤： 記錄學員的學習進度、測驗成績。技術使用 Supabase PostgreSQL 儲存用戶進度數據。
數位證書頒發： 學員完成課程後自動頒發數位證書。技術使用 Web Crypto API 生成證書 Hash，並儲存於區塊鏈或 Supabase PostgreSQL。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 視頻播放器在不同螢幕尺寸下，必須保持正確的長寬比，不可出現視頻變形或控制條被遮擋。
🚨 邏輯/體驗紅線： 課程測驗提交後，必須即時顯示成績與正確答案解析，不可出現長時間等待或結果錯誤。

---

Advisors-顧問 Advisors-Advisors
路徑： /advisors | 權限： ALL_USERS | 所屬旅程： VII. 生態協作與學習

1. 模組定位 (Core Purpose)
提供一個 ESG 專家顧問的公開名錄與個人檔案展示平台，方便用戶瀏覽不同領域的顧問，了解其專業背景與服務範圍，為進一步諮詢提供參考。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 所有平台用戶。他們在尋找 ESG 專業顧問時，往往需要花費大量時間在網路上搜索，且難以快速了解顧問的專業背景與服務質量。
體驗高光時刻 (Aha Moment)： 當用戶在顧問名錄中看到每位顧問的詳細個人檔案、專業領域、過往案例和客戶評價，並能直接發送站內信或查看聯繫方式。用戶感到「尋找專業顧問變得高效且透明」。
操作軌跡：
1. 進入顧問名錄頁面。
2. 瀏覽推薦顧問列表或使用篩選器查找特定領域顧問。
3. 點擊顧問個人檔案，查看詳細介紹、資歷與服務範圍。
4. 閱讀其他客戶的評價。
5. 通過平台內置功能發送諮詢請求或查看聯繫方式。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側篩選器，右側顧問卡片網格佈局」的雙欄佈局。顧問卡片顯示顧問頭像、姓名、專長與評分。
核心液態玻璃元件： BrandConsultantCard (顧問資訊卡片)、BrandFilterPanel (篩選器)、BrandProfileViewer (顧問詳細個人檔案展示)。
行動端適配 (RWD)： 左側篩選器收合為底部 Tab 或模態視窗，右側顧問卡片流轉為單欄堆疊式列表，確保在行動端也能方便瀏覽。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 顧問資料 (advisors) 儲存於 Supabase PostgreSQL，包含個人簡介、專業領域、服務項目等。
5T 實踐點：
[T4 Trustworthy 信任]： 顧問的資歷、專業領域與客戶評價公開透明，幫助用戶建立信任。
[T3 Transparent 透明]： 顧問的服務範圍與聯繫方式清晰可見，促進雙向溝通。

5. 功能項目解說和使用技術 (Features & Tech Stack)
顧問個人檔案展示： 顯示顧問的詳細個人信息、專業背景、服務項目、過往案例和客戶評價。技術使用 Supabase PostgreSQL 儲存顧問數據，React Components 渲染個人檔案。
多維度篩選與搜索： 支援按專業領域、語言、地區等篩選顧問。技術使用 React Hook Form 實現篩選邏輯，Supabase PostgreSQL 進行數據查詢。
站內信與聯繫方式： 提供平台內置的站內信功能，並顯示顧問的公開聯繫方式。技術使用 Supabase Realtime 實現站內信功能。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 顧問卡片在不同內容長度下，必須保持一致的高度與排版，不可出現卡片高度不一導致的視覺混亂。
🚨 邏輯/體驗紅線： 顧問個人檔案中的所有聯繫方式必須有效，不可出現無效鏈接或錯誤信息。

---

Agents-代理人 Agents-Agents
路徑： /agents | 權限： ADMIN, PM | 所屬旅程： IV. AI 賦能與撰寫

1. 模組定位 (Core Purpose)
提供 AI 代理人的配置與管理介面，允許管理員部署、監控和優化不同職能的 AI 代理人（如：數據採集代理、報告審核代理），以自動化重複性 ESG 任務。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN) 或永續專案經理 (PM)。他們希望利用 AI 自動化繁瑣的 ESG 任務，但缺乏統一的工具來配置和管理這些 AI 代理人。
體驗高光時刻 (Aha Moment)： 當管理員部署一個「碳數據採集代理」後，該代理人自動連接各數據源，定期採集並清洗數據，並在儀表板上顯示採集進度。管理員感到「AI 代理人就像一個個不知疲倦的員工，極大提升了工作效率」。
操作軌跡：
1. 進入 AI 代理人頁面。
2. 瀏覽可用的 AI 代理人模板（如：數據採集、報告審核）。
3. 選擇模板，配置代理人的參數與任務範圍。
4. 部署代理人，並監控其運行狀態與任務進度。
5. 根據代理人表現，進行優化或調整配置。
6. 接收代理人發出的預警或報告。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側代理人列表，右側代理人配置與監控儀表板」的雙欄佈局。儀表板顯示代理人狀態、任務進度與日誌。
核心液態玻璃元件： BrandAgentCard (代理人狀態卡片)、BrandAgentConfigurator (代理人參數配置表單)、BrandAgentMonitor (代理人實時監控儀表板)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，右側配置與監控區切換為 Tab 顯示，確保在行動端也能高效管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 代理人配置 (agent_configs) -> 代理人任務 (agent_tasks) -> 代理人日誌 (agent_logs)。代理人執行任務時會讀取/寫入 `esg_metrics`、`report_drafts` 等表。
5T 實踐點：
[T3 Transparent 透明]： 每個 AI 代理人的任務範圍、執行邏輯與運行日誌都公開透明，讓用戶了解其行為。
[T4 Trustworthy 信任]： AI 代理人執行任務時會遵循預設的 5T 協定，確保數據處理的可靠性。
[T2 Traceable 追溯]： 代理人執行的所有操作都會被記錄在審計日誌中，確保可追溯。

5. 功能項目解說和使用技術 (Features & Tech Stack)
代理人配置與部署： 允許用戶配置代理人的參數並部署。技術使用 React Hook Form 建立配置表單，後端 Supabase Edge Functions 啟動代理人實例。
實時監控與日誌： 監控代理人的運行狀態、任務進度與日誌輸出。技術使用 Supabase Realtime 訂閱代理人狀態，並通過 WebSocket 推送日誌。
任務排程與自動化： 支援代理人任務的定時排程與自動執行。技術使用 Supabase Cron Jobs 或外部排程服務。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 代理人監控儀表板上的圖表在數據量過大時，必須保持清晰可讀，圖例與標籤不可重疊。
🚨 邏輯/體驗紅線： AI 代理人執行任務失敗時，必須即時發出警報通知管理員，並提供詳細的錯誤日誌，不可靜默失敗。

---

Consulting-諮詢 Consulting-Consulting
路徑： /consulting | 權限： ALL_USERS | 所屬旅程： VII. 生態協作與學習

1. 模組定位 (Core Purpose)
提供一個便捷的線上諮詢服務預約平台，讓企業用戶能直接在平台內預約 ESG 專家進行一對一諮詢，解決特定的永續發展挑戰。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM) 或永續長 (CSO)。他們在面對複雜的 ESG 議題時，需要專業的個性化指導，但尋找和預約外部諮詢服務流程繁瑣。
體驗高光時刻 (Aha Moment)： 當 PM 在諮詢頁面選擇了「碳中和策略規劃」服務，並能直接查看可預約的專家時間表，一鍵完成預約和支付。PM 感到「專業諮詢服務觸手可及，解決問題高效便捷」。
操作軌跡：
1. 進入諮詢頁面，瀏覽可用的諮詢服務類型。
2. 選擇感興趣的服務（如：GRI 報告審閱、TCFD 風險評估）。
3. 選擇可預約的專家與時間。
4. 完成預約與支付。
5. 在預約時間通過平台內置的視訊工具與專家進行諮詢。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側服務分類，右側服務卡片網格佈局」的雙欄佈局。服務卡片顯示服務名稱、價格、可用專家與簡介。
核心液態玻璃元件： BrandServiceCard (諮詢服務卡片)、BrandCategoryTree (服務分類導航樹)、BrandBookingModal (預約與支付模態視窗)。
行動端適配 (RWD)： 左側分類收合為底部 Tab 或模態視窗，右側服務卡片流轉為單欄堆疊式列表，確保在行動端也能方便瀏覽與預約。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 服務列表 (consulting_services) -> 專家排程 (expert_schedules) -> 預約記錄 (bookings) -> 支付網關 (payment_gateway)。
5T 實踐點：
[T3 Transparent 透明]： 諮詢服務的內容、價格、專家資歷與可用時間公開透明。
[T4 Trustworthy 信任]： 平台合作的諮詢專家均經過嚴格篩選，確保服務質量。

5. 功能項目解說和使用技術 (Features & Tech Stack)
服務目錄與分類： 展示不同類型的 ESG 諮詢服務，並支援分類瀏覽。技術使用 Supabase PostgreSQL 儲存服務數據。
在線預約與排程： 允許用戶選擇專家與時間，並完成預約。技術使用 React-Big-Calendar 實現日曆排程，Supabase Edge Functions 處理預約邏輯。
安全支付集成： 集成第三方支付網關，處理諮詢費用。技術使用 Stripe 或 PayPal API 進行支付處理。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 服務卡片在不同內容長度下，必須保持一致的高度與排版，不可出現卡片高度不一導致的視覺混亂。
🚨 邏輯/體驗紅線： 預約成功後，必須向用戶和專家雙方發送確認通知（郵件、站內信），並在日曆中自動添加事件，防止遺漏。支付失敗時，必須提供清晰的錯誤提示。

---

AI-Platform-AI平台 AI-Platform-AIPlatform
路徑： /ai-platform | 權限： ADMIN, PM | 所屬旅程： IV. AI 賦能與撰寫

1. 模組定位 (Core Purpose)
提供 AI 模型訓練、部署、監控與管理的一站式平台，允許管理員和開發者客製化 AI 模型以適應企業特定的 ESG 數據與需求，最大化 AI 賦能價值。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN) 或數據科學家。他們希望利用 AI 解決企業特定的 ESG 問題，但缺乏統一的平台來管理 AI 模型生命週期，從數據準備到模型部署和監控。
體驗高光時刻 (Aha Moment)： 當數據科學家上傳企業內部數據集並選擇預訓練模型進行微調後，系統自動完成模型訓練與部署，並在儀表板上顯示模型性能指標。科學家感到「AI 模型開發與部署從未如此高效且可控」。
操作軌跡：
1. 進入 AI 平台頁面。
2. 瀏覽可用的預訓練 AI 模型或創建新模型。
3. 上傳數據集，進行數據預處理。
4. 配置模型訓練參數，啟動訓練任務。
5. 監控模型訓練進度與性能指標。
6. 部署訓練好的模型，並集成到其他 ESG GO 功能中。
7. 監控已部署模型的運行狀態與推理性能。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側模型列表與導航，中央模型訓練與部署儀表板」的雙欄佈局。儀表板包含 BrandModelPerformanceChart 和 BrandDeploymentStatus。
核心液態玻璃元件： BrandModelCard (AI 模型預覽卡片)、BrandDatasetUploader (數據集上傳器)、BrandModelPerformanceChart (模型性能指標圖表)、BrandDeploymentStatus (模型部署狀態指示器)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，中央儀表板切換為 Tab 顯示，確保在行動端也能高效管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 訓練數據 (training_data) -> 模型訓練服務 (GPU-enabled microservices) -> 訓練好的模型 (model_artifacts) -> 模型部署服務 -> 模型推理日誌 (inference_logs)。
5T 實踐點：
[T3 Transparent 透明]： 模型訓練過程、參數、性能指標與部署狀態公開透明。
[T4 Trustworthy 信任]： 模型的訓練數據來源可追溯，確保模型的可靠性與公平性。
[T2 Traceable 追溯]： 每個模型的版本、訓練歷史、部署記錄都可追溯。

5. 功能項目解說和使用技術 (Features & Tech Stack)
模型訓練與微調： 支援上傳數據集，對預訓練模型進行微調或從頭訓練。技術使用 TensorFlow/PyTorch 框架，部署在 Kubernetes 或 Supabase Edge Functions (with GPU support)。
模型部署與集成： 將訓練好的模型部署為 API 服務，並集成到其他 ESG GO 功能中。技術使用 FastAPI 或 Flask 構建模型服務，通過 GraphQL/REST API 集成。
模型監控與管理： 監控模型的運行狀態、推理性能、數據漂移等。技術使用 Prometheus/Grafana 進行監控，並將指標整合至儀表板。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 模型性能圖表在數據量過大時，必須保持清晰可讀，圖例與標籤不可重疊。
🚨 邏輯/體驗紅線： 模型訓練失敗時，必須即時發出警報通知管理員，並提供詳細的錯誤日誌，不可靜默失敗。

---

Tasks-任務 Tasks-Tasks
路徑： /tasks | 權限： ALL_USERS | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
提供個人與團隊任務管理功能，幫助用戶追蹤 ESG 專案中的待辦事項、分配任務、設定截止日期，確保所有工作按時完成。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 所有平台用戶。他們在 ESG 專案中需要協同工作，但任務分配不清晰、進度難以追蹤，導致效率低下和任務遺漏。
體驗高光時刻 (Aha Moment)： 當用戶在任務列表中看到自己的所有待辦任務，每個任務都標註了截止日期和負責人，並能一鍵更新進度。用戶感到「所有任務都井井有條，工作效率大大提升」。
操作軌跡：
1. 進入任務頁面，瀏覽個人或團隊任務列表。
2. 創建新任務，設定任務名稱、描述、截止日期和負責人。
3. 更新任務進度（待辦、進行中、已完成）。
4. 篩選或搜索特定任務。
5. 接收任務提醒與截止日期通知。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側任務分類與篩選器，右側任務列表 (Kanban 或 List View)」的雙欄佈局。任務卡片顯示任務名稱、截止日期、負責人與進度。
核心液態玻璃元件： BrandTaskCard (任務資訊卡片)、BrandFilterPanel (任務篩選器)、BrandKanbanBoard (看板視圖)、BrandDatePicker (日期選擇器)。
行動端適配 (RWD)： 左側分類篩選器收合為底部 Tab 或模態視窗，右側任務列表轉為單欄堆疊式卡片，確保在行動端也能高效管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 任務數據 (tasks) 儲存於 Supabase PostgreSQL，包含任務名稱、描述、狀態、負責人、截止日期等。
5T 實踐點：
[T2 Traceable 追溯]： 每個任務的創建者、分配歷史、進度更新都可追溯。
[T5 Timely 即時]： 任務進度實時更新，並提供截止日期提醒，確保任務按時完成。

5. 功能項目解說和使用技術 (Features & Tech Stack)
任務創建與管理： 創建、編輯、刪除任務，設定任務屬性。技術使用 React Hook Form 建立任務表單，Supabase PostgreSQL 儲存數據。
多視圖任務展示： 支援列表視圖、看板視圖等。技術使用 React DnD 實現看板拖曳功能。
任務提醒與通知： 在任務截止日期臨近時發送提醒。技術使用 Supabase Realtime 或 Web Push API 實現通知。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 任務卡片在不同內容長度下，必須保持一致的高度與排版，不可出現卡片高度不一或內容溢出。
🚨 邏輯/體驗紅線： 任務截止日期過期但進度未完成時，必須自動標記為「逾期」並發出提醒，防止任務被遺忘。

---

Profile-個人檔案 Profile-Profile
路徑： /profile | 權限： ALL_USERS | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
提供用戶個人資訊、偏好設定、權限查看與安全設置的管理介面，讓用戶能自主管理其在 ESG GO 平台上的個人化體驗。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 所有平台用戶。他們需要管理自己的個人信息、修改密碼、設定通知偏好，但傳統系統的個人設置分散且難以找到。
體驗高光時刻 (Aha Moment)： 當用戶在個人檔案頁面修改了頭像和通知偏好，並能清晰看到自己的角色權限。用戶感到「我的個人信息和系統體驗都在我的掌控之中」。
操作軌跡：
1. 進入個人檔案頁面。
2. 編輯個人基本信息（如：姓名、頭像、聯繫方式）。
3. 修改密碼或設定兩步驟驗證。
4. 配置通知偏好（如：郵件、站內信）。
5. 查看自己的角色與權限。
6. 管理 API 金鑰（如果具備開發者權限）。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側導航菜單（個人信息、安全、通知、權限），右側內容展示區」的雙欄佈局。內容區以 BrandForm 和 BrandInfoCard 呈現。
核心液態玻璃元件： BrandAvatarUploader (頭像上傳器)、BrandForm (通用表單元件)、BrandToggleSwitch (通知開關)、BrandInfoCard (權限信息卡片)。
行動端適配 (RWD)： 左側導航菜單收合為底部 Tab 或模態視窗，右側內容區滿版顯示，確保在行動端也能方便管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 用戶數據 (users) 儲存於 Supabase Auth 和 PostgreSQL，偏好設定 (user_preferences) 儲存於 PostgreSQL。
5T 實踐點：
[T4 Trustworthy 信任]： 用戶可自主管理個人信息與安全設置（如：兩步驟驗證），提升賬戶安全性。
[T3 Transparent 透明]： 用戶可清晰查看自己的角色與權限，了解自己在系統中的操作範圍。

5. 功能項目解說和使用技術 (Features & Tech Stack)
個人信息編輯： 編輯用戶姓名、頭像、聯繫方式等。技術使用 React Hook Form 建立表單，Supabase Storage 儲存頭像，Supabase PostgreSQL 更新用戶數據。
賬戶安全設置： 修改密碼、兩步驟驗證。技術使用 Supabase Auth 提供的安全功能。
通知偏好管理： 配置郵件、站內信等通知方式。技術使用 Supabase PostgreSQL 儲存用戶偏好。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 表單元素在不同螢幕尺寸下，必須保持正確的對齊與間距，不可出現重疊或溢出。
🚨 邏輯/體驗紅線： 修改密碼時，必須要求輸入舊密碼進行驗證，並確保新密碼符合複雜度要求。

---

API-Setup-API設定 API-Setup-APISetup
路徑： /api-setup | 權限： ADMIN | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
提供系統 API 金鑰的生成、管理與權限配置介面，允許管理員為外部應用或內部集成生成安全的 API 訪問憑證，並精細控制其數據訪問權限。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN) 或開發者。他們需要為第三方應用或內部腳本生成 API 金鑰以訪問 ESG GO 數據，但缺乏統一且安全的管理介面，難以控制金鑰權限。
體驗高光時刻 (Aha Moment)： 當管理員點擊「生成新金鑰」，系統立刻生成一串安全的 API 金鑰，並能通過勾選列表精細控制該金鑰對不同數據表和操作的權限。管理員感到「API 訪問安全且可控」。
操作軌跡：
1. 進入 API 設定頁面。
2. 瀏覽現有的 API 金鑰列表。
3. 點擊「生成新金鑰」，輸入金鑰名稱。
4. 配置金鑰的數據訪問權限（讀取、寫入、特定表）。
5. 複製生成的 API 金鑰，並提供給開發者。
6. 監控 API 金鑰的使用情況，並可隨時撤銷。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側 API 金鑰列表，右側金鑰詳情與權限配置表單」的雙欄佈局。權限配置區以 BrandPermissionMatrix 呈現。
核心液態玻璃元件： BrandAPIKeyCard (API 金鑰信息卡片)、BrandPermissionMatrix (權限配置矩陣，支援勾選)、BrandCopyButton (一鍵複製金鑰)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，右側詳情與配置區轉為單欄堆疊式表單，確保在行動端也能方便管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： API 金鑰 (api_keys) 儲存於 Supabase PostgreSQL，並與權限表 (permissions) 關聯。API 請求會通過後端驗證金鑰與權限。
5T 實踐點：
[T4 Trustworthy 信任]： API 金鑰採用加密儲存，並提供精細的權限控制，確保數據訪問的安全性。
[T3 Transparent 透明]： 每個 API 金鑰的權限配置清晰可見，避免權限濫用。
[T2 Traceable 追溯]： 每個 API 金鑰的生成者、生成時間、權限配置和使用日誌都可追溯。

5. 功能項目解說和使用技術 (Features & Tech Stack)
API 金鑰生成與管理： 生成唯一的 API 金鑰，並管理其生命週期。技術使用 Web Crypto API 生成金鑰，Supabase PostgreSQL 儲存金鑰元數據。
精細權限控制： 允許管理員為每個金鑰配置對不同數據表和操作的讀寫權限。技術使用 Supabase Row Level Security (RLS) 實現精細權限控制。
API 使用監控： 監控每個金鑰的 API 請求量、錯誤率等。技術使用 Supabase Edge Functions 記錄 API 請求日誌，並整合到監控儀表板。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 權限配置矩陣在不同數據表數量下，必須保持清晰可讀，勾選框不可錯位。
🚨 邏輯/體驗紅線： 撤銷 API 金鑰後，該金鑰必須立即失效，任何使用該金鑰的 API 請求都應被拒絕。

---

System-Test-系統測試 System-Test-SystemTest
路徑： /system-test | 權限： ADMIN, QA | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
提供系統自動化測試的執行與報告介面，允許管理員和 QA 人員運行預定義的測試套件，監控系統功能、性能與 UI 的健康狀況，確保系統穩定運行。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN) 或 QA 工程師。他們需要定期對系統進行測試，以確保新功能沒有引入問題，但手動測試耗時且容易遺漏。
體驗高光時刻 (Aha Moment)： 當 QA 工程師點擊「執行所有測試」後，系統在數分鐘內完成所有測試，並在儀表板上顯示綠色的「所有測試通過」標誌，同時提供詳細的測試報告。工程師感到「系統質量得到了自動化保障，發佈更有信心」。
操作軌跡：
1. 進入系統測試頁面。
2. 瀏覽可用的測試套件（如：功能測試、性能測試、UI 測試）。
3. 選擇要執行的測試套件或單個測試用例。
4. 點擊「執行測試」，等待測試完成。
5. 檢視測試報告，分析失敗的測試用例。
6. 導出測試報告，與開發團隊分享。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側測試套件列表，右側測試執行與報告儀表板」的雙欄佈局。儀表板顯示 BrandTestResultChart 和 BrandTestLogViewer。
核心液態玻璃元件： BrandTestCard (測試套件預覽卡片)、BrandTestResultChart (測試結果統計圖表)、BrandTestLogViewer (實時測試日誌查看器)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，右側執行與報告區切換為 Tab 顯示，確保在行動端也能高效管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 測試配置 (test_configs) 儲存於 Supabase PostgreSQL，測試執行服務 (CI/CD pipeline) 運行測試，測試結果 (test_results) 儲存於 PostgreSQL。
5T 實踐點：
[T4 Trustworthy 信任]： 系統測試結果公開透明，確保系統功能的可靠性。
[T3 Transparent 透明]： 測試報告會詳細記錄每個測試用例的執行結果與日誌，提升測試過程的透明度。
[T5 Timely 即時]： 可設定定期自動執行測試，確保問題能被及時發現。

5. 功能項目解說和使用技術 (Features & Tech Stack)
測試套件管理： 管理不同類型的測試套件和測試用例。技術使用 Supabase PostgreSQL 儲存測試配置。
自動化測試執行： 觸發後端自動化測試腳本執行。技術使用 Playwright/Cypress (UI/E2E), Jest/Vitest (Unit/Integration) 運行測試，並通過 CI/CD (GitHub Actions/GitLab CI) 集成。
測試報告與日誌： 實時顯示測試進度，並生成詳細的測試報告。技術使用 Supabase Realtime 推送實時日誌，Recharts 渲染結果圖表。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 測試報告中的圖表在數據量過大時，必須保持清晰可讀，圖例與標籤不可重疊。
🚨 邏輯/體驗紅線： 任何「關鍵功能測試」失敗時，必須立即發出「紅燈警報」通知開發團隊，並阻止新版本發佈。

---

用戶管理 User Management
路徑： /user-management | 權限： ADMIN | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
提供平台用戶的創建、編輯、禁用與刪除功能，允許管理員全面掌控用戶賬戶，確保系統訪問的安全與合規。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN)。他們需要管理大量的用戶賬戶，包括新員工入職、離職人員賬戶處理、權限調整等，但傳統系統的用戶管理介面操作複雜且效率低下。
體驗高光時刻 (Aha Moment)： 當管理員在用戶列表中搜索到某位員工，並能一鍵禁用其賬戶或重置密碼。管理員感到「用戶管理變得如此簡單高效，系統安全更有保障」。
操作軌跡：
1. 進入用戶管理頁面。
2. 瀏覽所有用戶列表，或使用搜索/篩選功能查找特定用戶。
3. 點擊「新增用戶」，填寫用戶信息並分配角色。
4. 點擊用戶，編輯其個人信息、重置密碼或禁用/啟用賬戶。
5. 批量操作多個用戶。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「頂部搜索與篩選，下方 BrandDataTable 用戶列表」的單欄佈局。用戶列表顯示用戶名、郵箱、角色、狀態與操作按鈕。
核心液態玻璃元件： BrandDataTable (用戶列表，支援篩選、排序、分頁)、BrandUserForm (用戶信息編輯表單)、BrandStatusToggle (用戶狀態切換開關)。
行動端適配 (RWD)： 搜索與篩選器收合為底部 Tab 或模態視窗，用戶列表轉為堆疊式資料卡片，僅顯示核心信息，點擊卡片展開詳情。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 用戶數據 (users) 儲存於 Supabase Auth 和 PostgreSQL，操作日誌寫入 `audit_logs`。
5T 實踐點：
[T4 Trustworthy 信任]： 管理員可精確控制用戶賬戶狀態，確保只有授權用戶才能訪問系統。
[T2 Traceable 追溯]： 所有用戶管理操作（創建、編輯、禁用）都會被記錄在審計日誌中，確保可追溯。

5. 功能項目解說和使用技術 (Features & Tech Stack)
用戶賬戶 CRUD： 創建、讀取、更新、刪除用戶賬戶。技術使用 Supabase Auth API 和 PostgreSQL 進行用戶數據管理。
批量操作： 支援批量禁用、啟用或刪除用戶。技術使用 React Hook Form 結合多選功能。
用戶狀態管理： 禁用/啟用用戶賬戶。技術使用 Supabase Auth 的 `updateUser` 方法。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 用戶列表在載入大量用戶時，分頁與滾動條必須正常工作，不可出現卡頓或數據顯示不全。
🚨 邏輯/體驗紅線： 禁用用戶賬戶後，該用戶必須立即被登出，且無法再次登入系統。

---

權限管理 Permission Management
路徑： /permission-management | 權限： ADMIN | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
提供基於角色的訪問控制 (RBAC) 管理介面，允許管理員定義角色、分配權限，並將角色賦予用戶，確保不同用戶只能訪問其被授權的功能與數據。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN)。他們需要為不同職能的員工配置精細的系統權限，但手動管理每個用戶的權限複雜且容易出錯。
體驗高光時刻 (Aha Moment)： 當管理員創建一個「永續專案經理」角色，並能通過勾選列表為該角色配置對「SustainWrite 編輯器」的讀寫權限。然後將該角色賦予多個用戶，所有用戶的權限立刻生效。管理員感到「權限管理變得如此靈活且安全」。
操作軌跡：
1. 進入權限管理頁面。
2. 瀏覽現有的角色列表。
3. 點擊「新增角色」，定義角色名稱。
4. 為角色配置對各功能模組和數據表的讀寫、創建、刪除權限。
5. 將角色賦予一個或多個用戶。
6. 檢視用戶的實際權限。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側角色列表，右側角色權限配置矩陣」的雙欄佈局。權限配置區以 BrandPermissionMatrix 呈現。
核心液態玻璃元件： BrandRoleCard (角色信息卡片)、BrandPermissionMatrix (權限配置矩陣，支援勾選)、BrandUserRoleAssigner (用戶角色分配器)。
行動端適配 (RWD)： 左側列表收合為漢堡選單，右側配置區轉為單欄堆疊式表單，確保在行動端也能方便管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 角色 (roles) 和權限 (permissions) 儲存於 Supabase PostgreSQL，用戶與角色的關聯 (user_roles) 也儲存於 PostgreSQL。所有數據訪問和功能操作都會通過 RLS 驗證權限。
5T 實踐點：
[T4 Trustworthy 信任]： 透過 RBAC 實現精細的權限控制，確保用戶只能訪問其被授權的數據和功能，提升系統安全性。
[T3 Transparent 透明]： 每個角色所擁有的權限配置清晰可見，避免權限濫用。
[T2 Traceable 追溯]： 任何權限變更（角色創建、權限調整、角色分配）都會被記錄在審計日誌中，確保可追溯。

5. 功能項目解說和使用技術 (Features & Tech Stack)
角色創建與管理： 創建、編輯、刪除角色。技術使用 React Hook Form 建立表單，Supabase PostgreSQL 儲存角色數據。
基於資源的權限配置： 為每個角色配置對不同功能模組、數據表、甚至特定數據行 (Row Level Security) 的權限。技術使用 Supabase Row Level Security (RLS) 實現。
用戶角色分配： 將角色賦予用戶。技術使用 Supabase PostgreSQL 儲存用戶與角色的關聯。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 權限配置矩陣在功能模組和數據表數量過多時，必須保持清晰可讀，勾選框不可錯位。
🚨 邏輯/體驗紅線： 任何權限變更後，必須立即生效，且用戶在下次操作時，其權限必須已更新。

---

組織管理 Organization Management
路徑： /organization-management | 權限： ADMIN | 所屬旅程： VI. 系統管理與維護

1. 模組定位 (Core Purpose)
提供多組織、多部門的層級結構管理介面，允許管理員配置企業的組織架構，並將用戶、數據與報告與特定組織/部門關聯，支持大型企業的複雜管理需求。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員 (ADMIN)。他們需要管理大型企業內部的多個子公司、部門或廠區的 ESG 數據和報告，但缺乏統一的組織架構管理工具，導致數據歸屬混亂。
體驗高光時刻 (Aha Moment)： 當管理員在組織管理頁面創建了「台北廠」和「高雄廠」兩個子組織，並能將不同的用戶和數據分配到各自的組織下。管理員感到「企業的複雜組織架構在系統中清晰呈現，數據管理更有序」。
操作軌跡：
1. 進入組織管理頁面。
2. 瀏覽企業的組織樹結構。
3. 點擊「新增組織」，創建新的子公司或部門。
4. 編輯組織信息，設定組織層級。
5. 將用戶、數據源、報告等資源分配給特定組織。
6. 檢視各組織的數據概覽。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側組織樹導航，右側組織詳情與資源分配」的雙欄佈局。組織詳情區以 BrandOrgForm 和 BrandResourceAssigner 呈現。
核心液態玻璃元件： BrandOrgTree (組織樹狀結構圖)、BrandOrgForm (組織信息編輯表單)、BrandResourceAssigner (資源分配器，支援拖曳)。
行動端適配 (RWD)： 左側導航樹收合為漢堡選單，右側詳情與分配區轉為單欄堆疊式表單，確保在行動端也能方便管理。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 組織數據 (organizations) 儲存於 Supabase PostgreSQL，並與用戶、數據、報告等資源通過外鍵關聯。
5T 實踐點：
[T3 Transparent 透明]： 企業的組織架構在系統中清晰呈現，方便管理員理解數據歸屬。
[T2 Traceable 追溯]： 每個數據和報告都可追溯其所屬的組織，確保數據歸屬的清晰性。

5. 功能項目解說和使用技術 (Features & Tech Stack)
組織樹狀結構管理： 創建、編輯、刪除組織，並支持多層級結構。技術使用 Supabase PostgreSQL 儲存組織數據，React Tree View 渲染組織樹。
資源分配與關聯： 將用戶、數據源、報告等資源分配給特定組織。技術使用 React DnD 實現拖曳分配，Supabase PostgreSQL 更新關聯關係。
組織數據隔離： 確保不同組織的數據在訪問時進行隔離。技術使用 Supabase Row Level Security (RLS) 實現數據隔離。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 組織樹狀結構在層級過深或節點過多時，必須保持清晰可讀，節點不可重疊。
🚨 邏輯/體驗紅線： 刪除組織時，必須彈出二次確認對話框，並提示該組織下的所有資源將被解除關聯或刪除，防止誤操作。