系統核心架構 System Core Architecture
路徑： /system-overview | 權限： ADMIN, PM, DEV, CSO | 所屬旅程： I. 系統概覽與設定

1. 模組定位 (Core Purpose)
ESG GO 系統核心架構以「治理流程」為核心，整合前端體驗、數據管理、AI 協作與確信機制，提供從內部數據輸入、結構化治理、AI 賦能、證據追溯、稽核驗證到最終報告發佈與外部查核的完整 ESG 生命週期管理平台。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 企業永續長 (CSO)、永續專案經理 (PM)、各部門數據填報者、外部稽核員。他們共同面臨數據碎片化、合規性難以追溯、報告撰寫效率低下、以及外部信任度不足等挑戰。
體驗高光時刻 (Aha Moment)： 當使用者意識到整個 ESG 數據從收集、處理、分析到最終報告的過程，都在一個高度整合、AI 輔助且具備密碼學確信的環境中流轉時，會產生「哇！原來 ESG 治理可以如此高效且可信」的巨大安心感。
操作軌跡：
1. 企業各部門將原始 ESG 數據（如電費單、員工培訓紀錄）透過前端介面或 API 輸入系統。
2. 系統自動進行數據結構化與初步驗證，並透過 AI 協作層提供撰寫建議。
3. 關鍵數據與報告內容自動關聯至「證據金庫」，並生成不可篡改的 Hash 鎖。
4. 永續專案經理利用 AI 賦能的 SustainWrite 編輯器高效產出報告草稿。
5. 內部稽核或外部查核員可透過 5T 標籤與 ZKP 驗證機制，快速追溯數據源頭與變更歷史。
6. 最終報告經確認後發佈，並確保其內容具備高度可信性與透明度。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用標準企業級 SaaS 的「左側固定導航欄 + 頂部全局操作區 + 右側主內容區」佈局。主內容區多採用 12 欄 Bento Grid 或左右雙欄佈局，確保資訊密度與可讀性。
核心液態玻璃元件： BrandHeader (全局導航與通知)、BrandSidebar (模組切換)、BrandDataTable (數據展示與篩選)、BrandForm (數據輸入與編輯)、BrandModal (彈出式任務流)、BrandToast (即時反饋通知)。所有核心卡片與容器均採用 glassBg 效果，提供現代感與層次感。
行動端適配 (RWD)： < 768px 時，左側導航欄自動收合為「漢堡選單」，並將核心模組入口轉化為 Mobile Bottom Navigation (底部 Tab 欄)，方便單手操作。複雜表格自動轉化為「堆疊式資料卡片 (Stacked Cards)」或提供橫向滾動。所有輸入表單元素必須確保觸控友善，避免過小的點擊區域。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向：
*   **輸入**：前端體驗層接收用戶輸入，或透過 API Connectors 從外部系統（如 ERP, IoT）獲取數據，經由 Hermes Gateway 傳輸。
*   **處理**：ESG 數據層對原始數據進行分類、清洗與結構化。治理應用層則基於這些數據執行業務邏輯（如計算、分析）。AI 協作層提供智能輔助與洞察。
*   **儲存**：所有結構化數據、元數據、Audit Log 與 Hash 值最終儲存於 Supabase PostgreSQL。實體文件（如 PDF, 圖片）則儲存於 Supabase Storage (S3)。
*   **確信**：治理確信層負責對數據與文件進行加密、Hash 鎖定與 ZKP 驗證，確保數據的完整性與不可篡改性。
*   **輸出**：數據可透過 Dashboard 視覺化呈現，或經由 SustainWrite 編輯器生成報告，並可供外部查核。
5T 實踐點：
[T1 Tangible 具體]：
*   **ESG 數據層**：將抽象的環境、社會、治理議題，透過標準化的數據模型與指標（如 GRI, ISSB）具體化為可量化的數據點。
*   **Materiality 模組**：將雙重重大性評估結果，具體化為可視化的象限氣泡圖，使策略決策有明確依據。
[T2 Traceable 追溯]：
*   **Audit Log**：系統對所有關鍵操作（如數據修改、文件上傳、報告發佈）自動生成不可篡改的日誌，記錄操作者、時間、內容與 IP 地址，確保操作行為可追溯。
*   **Evidence Vault**：所有數據點均可追溯至其原始佐證文件，並透過雙向連結確保數據與證據的一致性，便於稽核追溯。
[T3 Trackable 追蹤]：
*   **Audit Log**：提供詳細的歷史版本追蹤功能，可查看任何數據或報告內容的歷次變更，並可回溯至特定版本，追蹤數據演進。
*   **Digital Twin**：透過數位分身模型，實時追蹤企業的 ESG 績效變化，並預測未來趨勢，實現動態追蹤。
[T4 Transparent 透明]：
*   **AI 協作層**：SPIRIT AI 人格在提供建議或生成內容時，會明確標示其知識來源（內部知識庫、外部法規、數據分析結果），確保 AI 推理過程的透明度。
*   **5T 標籤**：所有數據與文件均附帶 5T 標籤，清晰揭示其確信狀態與來源，提升資訊透明度。
[T5 Trustworthy 信任]：
*   **Hash Lock**：上傳至 Evidence Vault 的所有文件，在客戶端即時計算 SHA-256 Hash 值並隨文件一同儲存，任何後續對文件的微小修改都會導致 Hash 值不匹配，從而觸發警報，確保文件內容的完整性與不可篡改性。
*   **ZKP 驗證**：在特定敏感數據的驗證場景中，引入零知識證明 (ZKP) 技術，允許第三方在不揭露原始數據的情況下，驗證數據的真實性與合規性，建立無條件信任。

5. 功能項目解說和使用技術 (Features & Tech Stack)
*   **前端體驗層 (Frontend Experience Layer)**：
    *   **行為**：提供響應式、高性能的用戶界面，確保跨裝置的一致體驗。
    *   **技術**：基於 Next.js 框架實現伺服器端渲染 (SSR) 或靜態網站生成 (SSG)，搭配 React 進行組件化開發，並全面採用 TypeScript 提升代碼品質與可維護性。支援 RWD (Responsive Web Design) 與 Mobile Bottom Navigation。
*   **治理應用層 (Governance Application Layer)**：
    *   **行為**：提供核心業務功能，協助企業進行 ESG 數據管理、策略規劃與報告撰寫。
    *   **技術**：Dashboard 使用 Recharts 或 D3.js 進行數據視覺化。SustainWrite 基於 TipTap 或 Lexical 編輯器核心客製化，結合 AI 擴寫與合規掃描。Digital Twin 使用 Three.js 或 Babylon.js 進行 3D 模型渲染，結合數據實時更新。Health Check 提供後端服務健康監控與預警機制。Advisory 基於 AI 模型的智能建議系統。Intelligence 提供數據分析與商業智能模組。
*   **ESG 數據層 (ESG Data Layer)**：
    *   **行為**：管理環境、社會、治理等各類 ESG 數據的收集、儲存與結構化。
    *   **技術**：數據模型設計遵循 GRI/ISSB 等國際標準，使用 Supabase PostgreSQL 進行數據儲存與查詢。包含 Environmental, Social, Governance 標準化數據表結構；Materiality 重大性議題評估數據；Finance 財務數據與 ESG 績效關聯；Supply Chain 供應鏈 ESG 數據追蹤；Stakeholders 利害關係人溝通與管理數據。
*   **治理確信層 (Governance Assurance Layer)**：
    *   **行為**：確保數據與文件的完整性、真實性與不可篡改性，提升報告的可信度。
    *   **技術**：Audit Log 基於 PostgreSQL 的觸發器 (Triggers) 或 CDC (Change Data Capture) 實現。Evidence Vault 使用 Supabase Storage (S3) 搭配 Web Crypto API 進行客戶端 Hash 運算。Hash Lock 將 SHA-256 Hash 值儲存於數據庫，並與文件內容綁定。ZKP 驗證 可能整合 SnarkJS 或其他零知識證明庫。5T 標籤 透過數據庫中新增字段標記 5T 狀態，並在前端進行視覺化呈現。
*   **AI 協作層 (AI Collaboration Layer)**：
    *   **行為**：提供智能輔助、內容生成、合規掃描與數據洞察。
    *   **技術**：Gemini 2.0 作為核心大語言模型 (LLM) 提供智能推理與生成能力。Genkit 流程 用於編排複雜的 AI 工作流，如 RAG (Retrieval-Augmented Generation) 或多步驟推理。OmniHermes 合規掃描 基於 LLM 進行文本分析，比對內部知識庫與外部法規，識別合規風險。SPIRIT 三大 AI 人格 透過 Prompt Engineering 與模型微調，定義不同角色（如數據分析師、合規專家、撰寫助手）的 AI 行為。Digital Twin RAG 結合企業內部數據與知識庫，為數位分身提供實時、精準的上下文信息。
*   **基礎設施層 (Infrastructure Layer)**：
    *   **行為**：提供穩定、安全、可擴展的後端服務與數據儲存。
    *   **技術**：Supabase PostgreSQL 作為核心關係型數據庫，提供數據儲存、認證 (Auth)、實時訂閱 (Realtime) 與文件儲存 (Storage) 等服務。OmniBlue Hybrid Control Plane 作為混合雲控制平面，用於管理多雲或混合部署環境下的資源與服務。API Connectors 用於與第三方系統（如 ERP, IoT 平台）進行數據交換的標準化接口。Resend Email 用於系統通知、報告發送等郵件服務。Hermes Gateway 作為 API Gateway，負責請求路由、負載均衡、安全認證與流量管理。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 在主流瀏覽器 (Chrome, Firefox, Edge, Safari) 及不同解析度下，所有頁面佈局必須保持一致，無元素重疊、文字溢出或錯位。RWD 適配必須在指定斷點 (e.g., < 768px) 處平滑切換，不可出現內容擠壓、按鈕無法點擊或底部導航欄消失的情況。任何數據表格在數據量過大時，必須確保滾動條正常出現，且表頭固定，不可撐破父容器。
🚨 邏輯體驗紅線：
*   **數據完整性**：任何數據輸入或修改操作，必須確保其在 ESG 數據層與治理確信層的數據一致性，不可出現數據丟失或不匹配的情況。
*   **安全與權限**：未經授權的角色絕對不可訪問其權限範圍之外的數據或功能。任何越權行為必須被系統攔截並記錄於 Audit Log。
*   **AI 可靠性**：AI 協作層生成的任何內容，若包含明顯的「幻覺 (Hallucination)」或與事實嚴重不符的資訊，必須被 OmniHermes 合規掃描機制識別並標記為高風險，不可直接寫入報告。
*   **性能與響應**：核心數據查詢與報告生成功能，必須在可接受的時間範圍內完成（例如：Dashboard 數據加載 < 3 秒，AI 擴寫 < 5 秒），不可出現長時間的白屏或無響應。
*   **確信機制失效**：若 Evidence Vault 中的文件 Hash 值與實際文件不匹配，或 ZKP 驗證失敗，系統必須立即發出高優先級警報，並將相關數據標記為「不可信」，不可靜默處理。

7. 矩陣關聯 (Matrix Connection)
上游數據： 企業原始輸入、外部 API 數據。
下游影響： 驅動全系統 6 大 SaaS 旅程的模組協同。
依賴組件： 全系統所有 Core Components。