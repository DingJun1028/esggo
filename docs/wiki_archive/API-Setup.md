API 設定 API Setup
路徑： /api-setup | 權限： ADMIN, DEV_OPS | 所屬旅程： VI. 系統整合與擴展

1. 模組定位 (Core Purpose)
提供企業級 API 金鑰管理、Webhook 設定與第三方系統連接器配置，實現 ESG 數據的自動化交換與整合，擴展 ESG GO 的生態系統。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： IT 管理員、DevOps 工程師或永續專案經理。他們通常需要將 ESG GO 與企業內部現有的 ERP、CRM 或數據湖系統進行整合，但面臨手動匯出匯入數據耗時費力、難以實現即時數據同步、擔心 API 串接的安全性與穩定性，且缺乏統一介面管理多個整合點的困境。
體驗高光時刻 (Aha Moment)： IT 管理員在設定完 Webhook 後，看到外部系統的數據自動且無縫地流入 ESG GO，且系統即時顯示「數據同步成功」的綠色提示，同時在日誌中清晰可見每次數據交換的細節，感受到「原來數據整合可以這麼無縫且安心，而且一切都在掌控之中」。
操作軌跡：
1.  IT 管理員進入「API 設定」頁面，點擊「新增 API 金鑰」。
2.  為新的整合應用命名，選擇所需的權限範圍（例如：僅讀取報告數據），並生成金鑰。
3.  切換至「Webhook」頁籤，設定一個新的 Webhook URL，選擇觸發事件（例如：報告發佈、數據更新）。
4.  配置第三方連接器（例如：SAP ERP 系統），選擇要同步的數據字段（例如：能源消耗數據），並執行連線測試。
5.  監控 API 請求日誌與 Webhook 觸發狀態，確保數據流穩定且符合預期。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側導航頁籤 (Tab Navigation) + 右側內容區」的佈局。左側頁籤包含「API 金鑰」、「Webhook」與「連接器管理」，右側內容區根據選定的頁籤動態切換顯示。
核心液態玻璃元件： BrandDataTable (用於顯示 API 金鑰列表、Webhook 列表及連接器狀態)、BrandCodeBlock (用於顯示 API 金鑰或 Webhook Secret，具備一鍵複製功能)、BrandToggleSwitch (用於啟用/禁用整合或 Webhook)、BrandStatusDot (顯示連線狀態或啟用狀態：綠=正常，紅=異常)。
行動端適配 (RWD)： < 768px 時，左側導航頁籤自動轉為頂部水平滾動 Tab 或下拉選單。表格自動轉化為「堆疊式資料卡片 (Stacked Cards)」，隱藏次要資訊（如完整的 API 金鑰字串），僅顯示關鍵名稱、狀態與創建日期。API 金鑰和 Webhook Secret 預設隱藏，需點擊卡片內的「顯示」按鈕才可查看。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向：
*   API 金鑰與 Webhook 配置：由使用者在前端介面輸入，經後端驗證與加密後，儲存至 `integration_configs` 資料表。
*   API 請求日誌：所有透過 API 進行的數據操作，其請求與響應資訊（不含敏感數據）會被記錄至 `api_audit_logs` 資料表，用於追蹤與問題排查。
*   Webhook 觸發：當 ESG GO 內部事件（如數據更新、報告發佈）發生時，後端服務會根據配置向外部 Webhook URL 發送 HTTP POST 請求，並記錄發送狀態與響應。
*   第三方連接器數據：透過連接器獲取的外部數據，會根據預設或自定義的映射規則，寫入 ESG GO 相關的數據表（例如 `esg_data_points`, `energy_consumption_records`）。
5T 實踐點：
*   **[T2 Traceable 追溯]**：每次 API 金鑰的生成、修改、撤銷，以及 Webhook 的配置變更，都會在系統的 Audit Log 中留下詳細的操作者、時間戳與變更內容紀錄，確保所有整合行為可追溯。
*   **[T4 Transparent 透明]**：提供 API 請求日誌與 Webhook 發送狀態監控介面，讓使用者清晰了解數據交換的頻率、成功率與潛在錯誤，提升整合過程的透明度。
*   **[T5 Trustworthy 信任]**：API 金鑰採用非對稱加密儲存，且僅在生成時顯示一次。Webhook 簽名使用 HMAC-SHA256 驗證，確保數據來源的真實性與完整性，防止中間人攻擊或數據篡改。

5. 功能項目解說和使用技術 (Features & Tech Stack)
*   **API 金鑰管理**：允許使用者生成、撤銷、管理不同權限範圍的 API 金鑰，並設定金鑰的有效期限。技術使用 JWT (JSON Web Tokens) 進行身份驗證與授權，後端採用 Node.js/Express 框架處理 API 請求，並結合 bcrypt 進行金鑰的加密儲存。
*   **Webhook 配置**：提供介面設定 Webhook URL、選擇觸發事件類型（如數據更新、報告狀態變更），並支援自定義請求頭與 Payload 模板。技術使用 Supabase Realtime 或 Kafka 進行事件發佈，後端服務負責異步發送 Webhook 請求並處理重試機制與錯誤日誌。
*   **第三方連接器**：預設提供與主流 ERP/CRM 系統（如 SAP, Salesforce, Workday）的整合模板，簡化數據映射過程。技術使用微服務架構，每個連接器作為獨立服務運行，透過 GraphQL 或 RESTful API 與 ESG GO 核心系統通信，並利用 OAuth 2.0 進行安全授權。
*   **API 請求日誌與監控**：提供可篩選、可排序的 API 請求日誌，顯示請求時間、來源 IP、狀態碼與響應時間。技術使用 Elastic Stack (Elasticsearch, Logstash, Kibana) 進行日誌收集、分析與可視化。
*   **互動式 API 文件**：提供最新的 API 接口說明、請求範例與響應格式，方便開發者快速上手。技術使用 Swagger UI 或 Postman Collection 自動生成與展示，並與後端 API 定義同步。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線：
*   API 金鑰或 Webhook Secret 顯示時，必須確保其內容不會溢出 BrandCodeBlock 容器，且一鍵複製按鈕始終可見且可點擊。
*   在行動端，堆疊式資料卡片中的關鍵資訊（如名稱、狀態）必須清晰可讀，不可因文字過長而截斷或重疊，且點擊展開後詳細資訊的排版應保持整潔。
🚨 邏輯/體驗紅線：
*   API 金鑰生成後，必須僅顯示一次，且無法再次從介面中直接讀取明文。若使用者未複製，應有明確提示或提供重新生成選項。
*   Webhook 測試發送功能必須在 5 秒內返回結果，並清晰標示成功或失敗原因（例如：HTTP 狀態碼、具體錯誤訊息），而非籠統的「發送失敗」。
*   當第三方連接器連線失敗時，必須提供具體的錯誤訊息（例如：API Key 無效、權限不足、目標服務器無響應），而非籠統的「連線失敗」，以協助使用者快速排查問題。
*   任何敏感操作（如撤銷 API 金鑰、刪除 Webhook）必須彈出二次確認對話框，並要求使用者輸入密碼或進行其他身份驗證。