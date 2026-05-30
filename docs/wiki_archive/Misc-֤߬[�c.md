# 系統核心架構

## 前端體驗層 Frontend Experience Layer
路徑： / | 權限： ALL_USERS | 所屬旅程： I. 系統互動與呈現

1.  模組定位 (Core Purpose)
    前端體驗層是 ESG GO 系統的門面，負責將後端數據轉化為直觀、高效且響應式的用戶介面，確保所有使用者都能獲得流暢且一致的操作體驗。

2.  客戶旅程與 UX 體驗 (Customer Journey & UX)
    目標對象與痛點： 所有 ESG GO 系統的使用者 (PM, CSO, ADMIN, AUDITOR)。他們期望系統操作直觀、反應迅速，且在不同裝置上都能保持良好的視覺與功能完整性，避免因介面問題導致工作效率下降或資訊誤讀。
    體驗高光時刻 (Aha Moment)： 當使用者在手機上打開 ESG GO 系統，發現複雜的數據表格自動優雅地轉換為易於瀏覽的卡片式佈局，且導航按鈕位於拇指可及的底部，瞬間感受到「這系統真的懂我，在哪裡都能輕鬆辦公」的便利感。
    操作軌跡：
    1.  使用者在桌面瀏覽器上登入系統，快速找到所需功能。
    2.  在通勤途中，切換至平板或手機，繼續瀏覽報告或審核數據。
    3.  無論裝置大小，介面元素都能自動調整，保持清晰可讀性與操作性。
    4.  透過底部導航或漢堡選單，輕鬆切換核心功能模組。

3.  UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
    桌面版佈局： 採用彈性網格系統 (Flexible Grid System)，支援多欄佈局與可調整的側邊欄，確保資訊密度與視覺舒適度平衡。
    核心液態玻璃元件： BrandButton (統一風格按鈕)、LiquidCard (帶有磨砂效果的資訊卡片)、ResponsiveDataTable (響應式數據表格)。
    行動端適配 (RWD)： < 768px 時，側邊導航自動收合為漢堡選單，複雜表格自動轉化為堆疊式卡片或可滾動的簡化視圖；核心功能導航固定於底部 Tab Bar (Mobile Bottom Navigation)。

4.  核心邏輯與 5T 協定 (Logic & 5T Protocol)
    資料流向： 從治理應用層與 ESG 數據層的 API 獲取數據，在前端進行渲染與互動，不直接儲存業務數據。用戶輸入的數據透過 API 發送至後端。
    5T 實踐點：
    [T1 Tangible 具體]： 將抽象的 ESG 數據（如碳排放量）透過圖表、儀表板等視覺化元件具體呈現，讓使用者能直觀理解。
    [T4 Transparent 透明]： 透過清晰的 UI 提示、加載動畫與錯誤訊息，讓使用者明確了解系統當前的狀態與操作結果，避免「黑箱」感。

5.  功能項目解說和使用技術 (Features & Tech Stack)
    單頁應用架構 (SPA)： 提供流暢的頁面切換體驗，減少全頁刷新。技術使用 Next.js (React Framework) 進行伺服器端渲染 (SSR) 或靜態網站生成 (SSG)，優化首頁加載速度與 SEO。
    組件化開發： 透過可重用的 React 組件，確保 UI 一致性與開發效率。技術使用 React 與 TypeScript 進行組件開發，並結合 Storybook 進行組件庫管理。
    響應式設計： 確保應用在不同尺寸的螢幕上都能良好顯示。技術使用 CSS-in-JS (如 Styled Components 或 Emotion) 搭配 Media Queries 實現 RWD。
    狀態管理： 管理複雜的應用狀態。技術使用 Zustand 或 React Context API 進行輕量級全局狀態管理。

6.  品質達標與驗收紅線 (QA Red Lines)
    🚨 UI 跑版紅線： 在任何主流瀏覽器 (Chrome, Firefox, Safari) 及裝置 (Desktop, Tablet, Mobile) 上，文字、圖片、按鈕等 UI 元素絕對不可出現重疊、溢出容器或錯位的情況。
    🚨 邏輯/體驗紅線： 頁面加載時間 (LCP) 不得超過 2.5 秒；任何用戶操作 (如點擊按鈕) 的視覺反饋延遲不得超過 300 毫秒。斷網時，必須顯示友善的離線提示，而非空白頁面或瀏覽器錯誤。

---

## 治理應用層 Governance Application Layer
路徑： /app/* | 權限： PM, ADMIN | 所屬旅程： II. 策略盤點與分派, III. 數據採集與分析, IV. AI 賦能與撰寫

1.  模組定位 (Core Purpose)
    治理應用層是 ESG GO 系統的核心業務邏輯實現層，提供一系列應用工具，協助企業進行 ESG 數據的採集、分析、報告撰寫與策略規劃，是使用者直接進行 ESG 治理工作的操作平台。

2.  客戶旅程與 UX 體驗 (Customer Journey & UX)
    目標對象與痛點： 永續專案經理 (PM) 和永續長 (CSO)。他們面臨數據分散、報告撰寫耗時、合規性難以追蹤等挑戰，需要一個整合性的平台來高效管理 ESG 事務。
    體驗高光時刻 (Aha Moment)： 當 PM 在 Dashboard 上看到所有關鍵 ESG 指標以直觀圖表呈現，並能一鍵鑽取到具體數據源，同時收到 Health Check 關於某項指標潛在風險的預警，瞬間感受到「所有資訊盡在掌握，決策有依據」的掌控感。
    操作軌跡：
    1.  PM 登入系統，首先進入 Dashboard 概覽當前 ESG 表現。
    2.  透過 SustainWrite 編輯器，協同撰寫永續報告。
    3.  利用 Digital Twin 模擬不同策略對環境的影響。
    4.  定期查看 Health Check 報告，確保數據品質與合規性。
    5.  根據 Advisory 的建議，調整 ESG 策略。
    6.  利用 Intelligence 模組進行市場趨勢分析。

3.  UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
    桌面版佈局： 採用多樣化的佈局模式，如 Dashboard 的卡片式佈局 (Bento Grid)、SustainWrite 的三欄編輯器佈局、Digital Twin 的沉浸式 3D 視圖。
    核心液態玻璃元件： BrandChart (互動式數據圖表)、BrandEditor (所見即所得編輯器)、3DScene (Digital Twin 專用三維渲染區)。
    行動端適配 (RWD)： Dashboard 的卡片自動堆疊，圖表可橫向滾動或點擊放大；SustainWrite 編輯器在小螢幕下自動隱藏側邊欄，提供全屏編輯模式；Digital Twin 則提供簡化視圖或引導用戶切換至桌面版以獲得最佳體驗。

4.  核心邏輯與 5T 協定 (Logic & 5T Protocol)
    資料流向： 從 ESG 數據層讀取原始數據，經過治理應用層的業務邏輯處理後，更新 ESG 數據層的狀態，並將所有關鍵操作記錄至治理確信層的 Audit Log。
    5T 實踐點：
    [T2 Traceable 追溯]： SustainWrite 中的每一次編輯、Digital Twin 中的每一次模擬參數調整，都會被記錄在 Audit Log 中，確保所有操作可追溯。
    [T4 Transparent 透明]： Dashboard 中的所有 KPI 數據都可點擊鑽取，顯示其計算邏輯與數據來源，確保數據的透明性。

5.  功能項目解說和使用技術 (Features & Tech Stack)
    Dashboard： 提供多維度 ESG 數據可視化與監控。技術使用 Recharts 或 ECharts 進行圖表渲染，結合 React Query 進行數據緩存與同步。
    SustainWrite： AI 輔助的永續報告撰寫編輯器。技術使用 TipTap/Lexical 編輯器框架，結合 Genkit 與 Gemini 2.0 進行 AI 內容生成。
    Digital Twin： 企業營運的數位孿生模型，用於模擬與預測。技術使用 Three.js 或 Babylon.js 進行 3D 渲染，結合 WebGL 與物理引擎。
    Health Check： 數據品質與合規性自動檢查。技術使用自定義規則引擎與數據驗證服務。
    Advisory： 基於數據分析提供 ESG 策略建議。技術使用機器學習模型 (如 Scikit-learn) 進行預測分析。
    Intelligence： 外部 ESG 趨勢與競品分析。技術使用爬蟲技術 (如 Puppeteer) 結合 NLP 進行文本分析。

6.  品質達標與驗收紅線 (QA Red Lines)
    🚨 UI 跑版紅線： Dashboard 上的圖表在數據量極大時，X/Y 軸標籤不可重疊或溢出，圖例必須清晰可見。SustainWrite 編輯器在不同字體大小下，行高與段落間距必須保持一致。
    🚨 邏輯/體驗紅線： Digital Twin 模擬結果與實際數據的誤差率不得超過預設閾值 (例如 5%)。Health Check 必須在數據異常發生後 15 分鐘內發出警報。SustainWrite 的 AI 擴寫功能，其生成內容的合規性評分不得低於 80%。

---

## ESG 數據層 ESG Data Layer
路徑： /api/data/* (邏輯路徑) | 權限： SYSTEM, PM, CSO | 所屬旅程： III. 數據採集與分析

1.  模組定位 (Core Purpose)
    ESG 數據層是 ESG GO 系統的數據中樞，負責所有環境 (Environmental)、社會 (Social)、治理 (Governance) 相關數據的結構化儲存、管理與整合，確保數據的完整性、一致性與可用性。

2.  客戶旅程與 UX 體驗 (Customer Journey & UX)
    目標對象與痛點： 各部門數據填報者、永續專案經理 (PM)、永續長 (CSO)。他們面臨數據來源多樣、格式不一、難以整合分析的困境，導致數據品質參差不齊，報告撰寫缺乏可靠依據。
    體驗高光時刻 (Aha Moment)： 當 PM 在系統中輕鬆匯入來自不同部門的電費、水費、員工培訓時數等數據，系統自動進行清洗、校驗並歸類到正確的 ESG 指標下，且能即時在 Dashboard 上看到更新後的圖表，瞬間感受到「數據管理不再是噩夢，而是高效決策的基石」的安心感。
    操作軌跡：
    1.  各部門填報者透過表單或匯入功能，將原始 ESG 數據提交至系統。
    2.  系統自動對數據進行初步驗證與清洗。
    3.  數據被結構化儲存至對應的 ESG 數據子模組 (Environmental, Social, Governance)。
    4.  PM 或 CSO 透過治理應用層的介面，查詢、分析這些數據。
    5.  數據變更時，系統自動更新相關指標與報告。

3.  UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
    桌面版佈局： 數據管理介面通常採用表格 (Data Table) 結合篩選器與批量操作功能，或樹狀結構 (Tree View) 展示數據層次。
    核心液態玻璃元件： DataGrid (可排序、篩選的數據網格)、FormBuilder (動態表單生成器)、FileUploadZone (文件上傳區)。
    行動端適配 (RWD)： 數據表格自動轉化為堆疊式卡片或可橫向滾動的簡化視圖；複雜的數據輸入表單會自動優化為單列佈局，並提供清晰的輸入提示。

4.  核心邏輯與 5T 協定 (Logic & 5T Protocol)
    資料流向： 接收來自前端體驗層的用戶輸入數據，或透過 API Connectors 從外部系統獲取數據，經過數據清洗、驗證後，儲存至 Supabase PostgreSQL 的各個 ESG 相關資料表 (如 `environmental_emissions`, `social_training_hours`, `governance_board_diversity`)。這些數據是治理應用層、AI 協作層和治理確信層的基礎。
    5T 實踐點：
    [T1 Tangible 具體]： 將企業營運中抽象的 ESG 影響（如碳足跡、員工滿意度）量化為具體的數值指標，並儲存於結構化資料庫中。
    [T3 Trackable 追蹤]： 每一筆數據的錄入、修改、刪除操作，都會在資料庫層面觸發觸發器 (Triggers) 或透過 ORM 記錄至治理確信層的 Audit Log，確保數據變更可追溯。
    [T5 Trustworthy 信任]： 透過資料庫的完整性約束 (Integrity Constraints)、數據類型驗證與權限控制，確保數據的準確性與不可篡改性。

5.  功能項目解說和使用技術 (Features & Tech Stack)
    數據模型設計： 針對環境、社會、治理等不同領域設計標準化的數據模型與資料庫 Schema。技術使用 PostgreSQL 進行關聯式數據儲存，並利用 JSONB 欄位儲存彈性數據。
    數據驗證與清洗： 確保輸入數據的品質與合規性。技術使用後端驗證框架 (如 Zod, Joi) 進行數據格式、範圍與邏輯驗證。
    數據整合 API： 提供標準化的 RESTful API 供其他層級調用。技術使用 Node.js (Express/NestJS) 或 Supabase Edge Functions 構建 API 服務。
    數據版本控制： 追蹤數據的歷史變更。技術使用資料庫的歷史表 (History Tables) 或 Supabase 的 Row Level Security (RLS) 結合觸發器。

6.  品質達標與驗收紅線 (QA Red Lines)
    🚨 UI 跑版紅線： (此層無直接 UI，但其數據呈現於前端) 任何從此層提供的數據，在前端圖表或表格中顯示時，若因數據格式錯誤或缺失導致前端渲染異常 (如 NaN, undefined)，則視為紅線。
    🚨 邏輯/體驗紅線： 任何關鍵 ESG 數據 (如碳排放量、水資源消耗) 的計算結果，與人工核對的基準數據誤差率不得超過 0.5%。數據匯入功能必須支援至少 10 萬筆數據的批量處理，且處理時間不得超過 5 分鐘。

---

## 治理確信層 Governance Assurance Layer
路徑： /assurance | 權限： ADMIN, AUDITOR, SYSTEM | 所屬旅程： V. 確信審計與發佈

1.  模組定位 (Core Purpose)
    治理確信層是 ESG GO 系統的信任基石，負責確保所有 ESG 數據與報告的真實性、可追溯性與不可篡改性，透過 Audit Log、Evidence Vault、Hash Lock 和 ZKP 驗證等機制，為外部稽核與內部審計提供堅實的證據鏈。

2.  客戶旅程與 UX 體驗 (Customer Journey & UX)
    目標對象與痛點： 外部稽核員、內部審計團隊、永續專案經理 (PM)。他們面臨數據來源不透明、憑證真偽難辨、審計流程耗時且信任成本高的問題，難以快速建立對 ESG 報告的信任。
    體驗高光時刻 (Aha Moment)： 當稽核員在 Evidence Vault 中點擊一份電費單，系統不僅展示了原始文件，還自動彈出其不可篡改的 Hash 碼與 ZKP 驗證狀態，並連結到 Audit Log 中該文件上傳者的時間戳，稽核員瞬間感受到「這系統的數據是鐵證如山，無可辯駁」的絕對信任感。
    操作軌跡：
    1.  PM 上傳一份新的 ISO 證書至 Evidence Vault。
    2.  系統自動計算 Hash 值並進行 ZKP 驗證，標記為「已封印」。
    3.  稽核員審查某份 ESG 報告時，點擊報告中的數據連結。
    4.  系統導航至 Evidence Vault，展示相關憑證與其確信狀態。
    5.  稽核員進一步查看 Audit Log，追溯該數據或憑證的所有歷史操作。

3.  UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
    桌面版佈局： Audit Log 採用時間軸 (Timeline) 或可篩選的數據表格佈局；Evidence Vault 採用檔案總管型表格 (Data Table) 結合頂部拖曳上傳區 (Dropzone)。
    核心液態玻璃元件： AuditTimeline (事件時間軸)、VaultOmniTable (萬能聖碑表格)、BrandStatusDot (顯示 ZKP 驗證狀態)、HashBadge (顯示文件 Hash 值)。
    行動端適配 (RWD)： Audit Log 的表格自動轉化為堆疊式卡片，按時間倒序排列；Evidence Vault 的表格也轉化為堆疊式資料卡片，隱藏複雜的 Hash 字串，僅保留檔名、GRI 條款與 5T 狀態燈號。

4.  核心邏輯與 5T 協定 (Logic & 5T Protocol)
    資料流向： 接收來自治理應用層與 ESG 數據層的所有關鍵操作事件，寫入 `audit_logs` 資料表。接收用戶上傳的實體文件，儲存至 Supabase Storage / S3，並將其 Metadata、SHA-256 Hash 與 ZKP 驗證結果寫入 `evidence_vault` 資料表。
    5T 實踐點：
    [T2 Traceable 追溯]： Audit Log 記錄所有用戶與系統的關鍵操作，包括時間戳、操作者、操作類型與受影響的資源，形成完整的追溯鏈。
    [T3 Trackable 追蹤]： 每一份上傳至 Evidence Vault 的文件，其 Hash 值與 ZKP 驗證狀態都會被追蹤，任何對文件的修改都會導致 Hash 值不匹配，從而觸發警報。
    [T5 Trustworthy 信任]： 透過 Hash Lock 確保文件內容的不可篡改性，結合 ZKP (零知識證明) 驗證數據的真實性而不洩露原始資訊，建立最高等級的數據信任。

5.  功能項目解說和使用技術 (Features & Tech Stack)
    Audit Log 記錄： 實時記錄系統內所有關鍵事件。技術使用事件溯源 (Event Sourcing) 模式，將事件寫入不可變的日誌流，並利用 Supabase 的 Realtime 功能進行實時監控。
    Evidence Vault： 安全儲存與管理所有佐證文件。技術使用 Supabase Storage 或 AWS S3 進行文件儲存，結合 Web Crypto API (crypto.subtle.digest) 在客戶端計算 SHA-256 Hash。
    Hash Lock： 透過密碼學 Hash 值確保文件內容的完整性。技術使用 SHA-256 算法，並將 Hash 值與文件 Metadata 一同儲存。
    ZKP 驗證： 零知識證明，用於在不揭露原始數據的情況下驗證數據的真實性。技術使用 SnarkJS 或相關的零知識證明庫進行實作。

6.  品質達標與驗收紅線 (QA Red Lines)
    🚨 UI 跑版紅線： Audit Log 的時間軸在事件數量極多時，必須保持流暢滾動，不可出現卡頓或元素重疊。Evidence Vault 的檔名或 Hash 字串過長時必須觸發 `text-overflow: ellipsis`，並配合 Tooltip 檢視完整內容。
    🚨 邏輯/體驗紅線： 任何上傳至 Evidence Vault 的文件，若其 Hash 值與資料庫記錄不符，系統必須立即標記為「已損毀/失效」並發出警報。Audit Log 必須確保任何操作事件的記錄不可被修改或刪除。若系統檢測到使用者上傳了重複的檔案 (Hash 完全相同)，必須阻斷上傳並彈出友善提示。

---

## AI 協作層 AI Collaboration Layer
路徑： /api/ai/* (邏輯路徑) | 權限： SYSTEM, PM | 所屬旅程： IV. AI 賦能與撰寫

1.  模組定位 (Core Purpose)
    AI 協作層是 ESG GO 系統的智慧引擎，透過整合先進的 AI 技術，賦能使用者高效撰寫報告、進行合規掃描、提供智慧建議，並透過數位孿生實現預測性分析，極大提升 ESG 治理的效率與品質。

2.  客戶旅程與 UX 體驗 (Customer Journey & UX)
    目標對象與痛點： 永續專案經理 (PM)。他們在撰寫報告時常面臨寫作瓶頸、合規性不確定、數據分析耗時等問題，需要智慧工具來加速流程並確保內容品質。
    體驗高光時刻 (Aha Moment)： 當 PM 在 SustainWrite 編輯器中點擊「AI 擴寫」按鈕，AI 不僅在數秒內生成了符合 GRI 標準的段落草稿，還自動標註了引用來源與合規性評分，PM 瞬間感受到「AI 助手就像一位資深永續顧問，讓撰寫報告變得前所未有的輕鬆與自信」的巨大價值。
    操作軌跡：
    1.  PM 在 SustainWrite 中選定一個段落，召喚 AI 助手進行擴寫或潤飾。
    2.  AI 根據內部知識庫與外部法規，生成建議內容。
    3.  PM 檢閱 AI 內容，並利用 OmniHermes 進行合規掃描。
    4.  SPIRIT AI 人格提供進一步的策略建議。
    5.  Digital Twin RAG 結合 AI 進行情境模擬與預測。

3.  UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
    桌面版佈局： AI 互動介面通常以側邊抽屜 (Sidebar Drawer)、懸浮對話框 (Floating Chatbot) 或編輯器內嵌模式呈現。
    核心液態玻璃元件： BrandFloatingAgent (右下角懸浮 AI 助手)、AIChatBubble (AI 對話氣泡)、ComplianceBadge (合規性評分徽章)。
    行動端適配 (RWD)： 懸浮 AI 助手自動調整位置，對話框適應小螢幕尺寸；編輯器內的 AI 建議會以更簡潔的方式呈現，避免遮擋核心內容。

4.  核心邏輯與 5T 協定 (Logic & 5T Protocol)
    資料流向： 接收來自前端體驗層的用戶指令與文本，從 ESG 數據層與治理確信層獲取相關數據與證據，透過 Gemini 2.0 進行處理，將生成結果返回前端，並將 AI 互動過程記錄至 Audit Log。
    5T 實踐點：
    [T4 Transparent 透明]： AI 生成的每一段文字，都會標示其推理來源（內部知識庫、外部法規、或特定數據點），讓使用者了解 AI 決策的依據。
    [T5 Trustworthy 信任]： 透過 OmniHermes 合規掃描與內建的幻覺檢測機制，確保 AI 生成內容的準確性與可靠性，避免提供錯誤或誤導性資訊。

5.  功能項目解說和使用技術 (Features & Tech Stack)
    大型語言模型整合： 核心的 AI 內容生成與理解能力。技術使用 Google Gemini 2.0 Pro 模型，透過 API 進行調用。
    AI 流程編排： 管理複雜的 AI 任務流程，如多步驟的內容生成與審核。技術使用 Google Genkit 框架進行 AI 流程的設計與部署。
    合規掃描： 自動分析文本內容是否符合 ESG 法規與標準。技術使用 OmniHermes (基於 NLP 的自定義模型) 進行文本分類與實體識別。
    AI 人格化互動： 提供多種 AI 互動模式，提升用戶體驗。技術使用 Prompt Engineering 結合 Few-shot Learning 實現 SPIRIT 三大 AI 人格 (策略師、撰寫者、稽核員)。
    檢索增強生成 (RAG)： 結合企業內部數據與知識庫，提升 AI 回答的準確性與相關性。技術使用 Digital Twin RAG，將企業的數位孿生數據作為 AI 的外部知識源。

6.  品質達標與驗收紅線 (QA Red Lines)
    🚨 UI 跑版紅線： AI 生成的內容在編輯器中顯示時，必須正確渲染所有格式 (標題、清單、表格)，不可出現 Markdown 語法未解析或樣式錯亂。AI 對話框在內容過長時，必須具備正常的滾動條，不可撐破容器。
    🚨 邏輯/體驗紅線： AI 回傳結果若包含違背 ESG 標準的幻覺字眼或不實資訊，必須被攔截並標示為紅字警示。AI 擴寫功能在 1000 字以內的內容生成，響應時間不得超過 5 秒。

---

## 基礎設施層 Infrastructure Layer
路徑： /infra/* (邏輯路徑) | 權限： SYSTEM, ADMIN | 所屬旅程： VI. 系統維運與安全

1.  模組定位 (Core Purpose)
    基礎設施層是 ESG GO 系統的底層支撐，提供穩定、安全、可擴展的運行環境，包含數據庫、存儲、API 網關、身份驗證、郵件服務等核心服務，確保整個系統的可靠運行與高效交付。

2.  客戶旅程與 UX 體驗 (Customer Journey & UX)
    目標對象與痛點： 系統管理員 (ADMIN) 和開發團隊。他們需要一個穩定且易於管理的基礎設施來部署、監控和維護系統，避免因底層問題導致系統停機、數據丟失或性能瓶頸。
    體驗高光時刻 (Aha Moment)： 當系統管理員在 BlueCC Hybrid Control Plane 上看到所有服務的運行狀態都是綠色，且數據庫的備份與恢復流程一鍵可達，同時收到 Hermes Gateway 關於 API 流量的實時監控報告，瞬間感受到「系統運行穩如泰山，維運工作輕鬆高效」的極致安心。
    操作軌跡：
    1.  系統管理員登入 BlueCC Hybrid Control Plane，監控各項服務的健康狀態。
    2.  開發者透過 API Connectors 整合新的第三方服務。
    3.  系統自動發送郵件通知 (Resend Email) 給相關用戶。
    4.  所有對外 API 請求都經過 Hermes Gateway 進行認證與限流。
    5.  數據庫 (Supabase PostgreSQL) 自動進行備份與擴容。

3.  UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
    桌面版佈局： 管理控制台通常採用儀表板 (Dashboard) 佈局，展示服務狀態、資源使用率、日誌監控等。
    核心液態玻璃元件： ServiceStatusCard (服務狀態卡片)、MetricChart (性能指標圖表)、LogViewer (日誌查看器)。
    行動端適配 (RWD)： 管理儀表板的卡片自動堆疊，圖表可橫向滾動；複雜的配置表單會優化為單列佈局，確保在平板上也能進行基本的監控與操作。

4.  核心邏輯與 5T 協定 (Logic & 5T Protocol)
    資料流向： 承載所有層級的數據流動。Supabase PostgreSQL 儲存所有業務數據與元數據。Supabase Storage 儲存文件。API Connectors 負責與外部服務的數據交換。Hermes Gateway 處理所有進出系統的 API 流量。
    5T 實踐點：
    [T3 Trackable 追蹤]： BlueCC Hybrid Control Plane 監控所有基礎設施組件的運行狀態與資源使用情況，並記錄詳細的日誌，確保所有系統事件可追蹤。
    [T5 Trustworthy 信任]： Supabase PostgreSQL 提供強大的數據庫安全功能 (如 RLS, 加密)，Hermes Gateway 實施嚴格的 API 認證與授權，確保數據與系統的安全性與可靠性。

5.  功能項目解說和使用技術 (Features & Tech Stack)
    數據庫服務： 提供穩定、可擴展的關聯式數據庫。技術使用 Supabase PostgreSQL，包含其內建的認證 (Auth)、實時 (Realtime) 與儲存 (Storage) 服務。
    混合雲控制平面： 統一管理與監控多個部署環境。技術使用 BlueCC Hybrid Control Plane (自定義或基於 Kubernetes/Cloud Run 的管理層)。
    API 連接器： 實現與第三方服務的無縫集成。技術使用自定義的 API Connectors，可能基於 Webhooks 或 OAuth 2.0 協議。
    郵件服務： 負責系統通知、驗證碼等郵件發送。技術使用 Resend Email 服務，提供高送達率與可追溯性。
    API 網關： 統一管理、保護、監控所有 API。技術使用 Hermes Gateway (可能基於 Kong, Apigee 或自定義的 Nginx/Envoy 配置)，提供認證、限流、日誌記錄等功能。

6.  品質達標與驗收紅線 (QA Red Lines)
    🚨 UI 跑版紅線： BlueCC Hybrid Control Plane 的監控儀表板在不同解析度下，圖表與狀態卡片必須保持清晰可讀，不可出現重疊或數據截斷。
    🚨 邏輯/體驗紅線： 數據庫服務的平均響應時間 (P95) 不得超過 50 毫秒。系統必須具備至少 99.9% 的年度運行時間 (SLA)。任何核心服務 (如數據庫、API 網關) 的故障，必須在 5 分鐘內觸發自動警報並通知相關管理員。