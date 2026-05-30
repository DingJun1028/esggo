# ESGGO 善向永續 系統 官方 Wiki 🏛️
## 版本：v8.5.1-Alpha | 架構：SaaS User Journey Edition

歡迎來到 **ESGGO 善向永續 系統** 官方 Wiki。
本平台是一套結合 **ESG 治理、AI 智能協作、可信資料驗證與混合雲調度** 的整合式數位平台。

本 Wiki 的目錄結構嚴格遵循 **SaaS 使用者旅程 (User Journey)** 編排，從初始導入到報告發布，幫助企業一步步建立可持續、可追溯、可驗證的治理作業環境。

---

## 📖 Wiki 目錄導覽

### 核心概念與架構
*   [[平台總覽]]
*   [[SaaS 系統架構與使用者旅程]]
*   [[5T-誠信協議]]
*   [[資料表與邏輯資料庫]]

### 旅程 I. 初始導入與配置 (Onboarding)
建立公司基礎資料，確立系統整合與出發點。
*   [[Profile-企業管理]]
*   [[API-Setup-整合中心]]
*   [[Data-Sources-資料來源]]
*   [[Templates-專家模板]]
*   [[Health-Check-企業健檢]]

### 旅程 II. 策略盤點與分派 (Strategy & Task)
評估重大議題，並將永續工作拆解派發給各單位。
*   [[Materiality-重大性矩陣]]
*   [[Roadmap-淨零路徑]]
*   [[Tasks-任務中心]]
*   [[Document-Checklist-文件清單]]

### 旅程 III. 數據採集與填報 (Data Operations)
集中管理各部門與供應鏈的 ESG 原始數據與憑證。
*   [[Environmental-環境指揮]]
*   [[Social-社會影響]]
*   [[Governance-公司治理]]
*   [[CBAM-Calculator-CBAM計算機]]
*   [[Supply-Chain-供應鏈透明]]
*   [[Stakeholders-利害關係人]]

### 旅程 IV. AI 賦能與撰寫 (AI Copilot)
利用 AI 協助解讀法規、給予建議並生成永續報告。
*   [[Editor-SustainWrite編輯器]]
*   [[Advisory-專家諮詢]]
*   [[Digital-Twin-數位分身]]
*   [[Intelligence-商情中心]]
*   [[Compliance-Check-合規檢查]]

### 旅程 V. 確信審計與發佈 (Audit & Publish)
確保數據不可篡改，提供內外部稽核，並發佈最終結果。
*   [[Dashboard-控制台]]
*   [[Audit-Log-審計日誌]]
*   [[Vault-證據金庫]]
*   [[Proof-Center-誠信證明]]
*   [[Audit-Verify-VerifyLink]]
*   [[Publish-報告發佈]]

### 旅程 VI. 知識沉澱與加值 (Grow & Upgrade)
查閱歷史資產，或尋求進階的顧問與課程資源。
*   [[Library-永續智庫]]
*   [[Reading-Room-永續閱覽室]]
*   [[Finance-永續財務]]
*   [[Academy-永續學院]]
*   [[Advisors-顧問專區]]
*   [[Consulting-顧問服務]]
*   [[Agents-代理專區]]

### 隱藏專區：超級管理員與 IT 後台 (Admin Console)
底層算力調度、系統維護與設計規範（僅限 ADMIN / IT_OPS）。
*   [[AI-Platform-AI整合平台]]
*   [[Hermes-Orchestrator-Hermes調度器]]
*   [[Swarm-代理蜂群]]
*   [[System-Status-系統狀態]]
*   [[System-Test-系統測試]]
*   [[Terminal-終端主控]]
*   [[Design-Library-設計圖書館]]
*   [[技術完整性檢查結論]]

---

## 🌌 核心概念與架構

### 平台總覽
**定位：** **ESGGO 善向永續 系統** 是一套聚焦於企業永續治理的「SaaS 操作系統」。
它不是單純的表單工具，而是依循企業真實情境，將「資料輸入 → 策略分派 → AI 撰寫 → 稽核驗證 → 報告發佈」串聯為一個閉環旅程。透過 **5T 誠信協議** 與 **BlueCC 混合雲中控**，讓治理過程透明、可信且高效。

### SaaS 系統架構與使用者旅程
本系統採用 **MECE (互斥且窮盡)** 原則建構導航，所有模組分為六大使用者旅程與三大 IT 管理後台：
1.  **Onboarding**: 設定基礎配置。
2.  **Strategy**: 盤點目標與分派任務。
3.  **Data Operations**: 採集 E、S、G 數據。
4.  **AI Copilot**: 降低認知負載，智能撰寫。
5.  **Audit & Publish**: 防篡改確信與發佈。
6.  **Grow & Upgrade**: 生態系加值與學習。
7.  **(Admin) Orchestration, Maintenance, Design**: 系統底層控制。

### 5T 誠信協議
系統的靈魂。確保每一筆資料符合：
*   **T1 Tangible (可具體化)**: 抽象指標可視化 (如 Bento Grid 卡片)。
*   **T2 Traceable (可追溯)**: 數據溯源，與證據金庫關聯。
*   **T3 Trackable (可追蹤)**: 所有變更均寫入 Audit Log。
*   **T4 Transparent (可透明)**: AI 推理過程不黑箱。
*   **T5 Trustworthy (可信任)**: ZKP 零知識證明與 SHA-256 數位封印。

---

## 旅程 I. 初始導入與配置 (Onboarding)

### Profile-企業管理
*   **目標：** 「我需要設定公司基礎資料，並知道從何開始。」
*   **功能：** 企業基本設定、ESG 長期目標、願景與治理架構的主控頁。作為 AI 數位分身的基礎脈絡來源。

### API-Setup-整合中心
*   **目標：** 串接外部系統，打通資料孤島。
*   **功能：** 顯示 ERP、BEMS 等 API 連接器狀態、Webhook 監控與環境變數校驗，確保系統整合健康。

### Data-Sources-資料來源
*   **目標：** 管理內部資料庫與 **ESGGO 善向永續 系統** 平台的資料流動。
*   **功能：** 設定自動同步排程、欄位映射與資料清洗規則，是自動化碳盤查的前置作業。

### Templates-專家模板
*   **目標：** 快速套用國際標準框架。
*   **功能：** 內建 GRI 2021 與 ISSB S1/S2 欄位映射的「零算力模板」，幫助新導入企業無痛起步。

### Health-Check-企業健檢
*   **目標：** 快速診斷 ESG 現況。
*   **功能：** 15 題互動式問診，自動生成「90 天改善路徑圖」，讓企業立刻獲得可操作的行動方案。

---

## 旅程 II. 策略盤點與分派 (Strategy & Task)

### Materiality-重大性矩陣
*   **目標：** 「我要確立哪些 ESG 議題對公司最重要。」
*   **功能：** 互動式氣泡圖支援雙重重大性 (Double Materiality) 評估，產出高衝擊與高關注的核心議題清單。

### Roadmap-淨零路徑
*   **目標：** 將減碳願景轉化為時間軸。
*   **功能：** 建立 SBTi 1.5°C 減碳趨勢圖與中長期里程碑追蹤，把願景轉成執行節點。

### Tasks-任務中心
*   **目標：** 跨部門交辦與進度追蹤.
*   **功能：** 結合 5T 一致性檢查的看板，負責指派 ESG 數據填報任務、設定死線並追蹤各單位進度。

### Document-Checklist-文件清單
*   **目標：** 確保稽核不缺件。
*   **功能：** 系統化的憑證收集目錄，與「證據金庫」連動，自動標示待補件項目。

---

## 旅程 III. 數據採集與填報 (Data Operations)

### Environmental-環境指揮
*   **目標：** 集中管理環境數據。
*   **功能：** 管理 GHG Scope 1-3 排放、能源耗用、水資源與廢棄物數據，ESG E 面的核心主頁。

### Social-社會影響
*   **目標：** 衡量企業對人的影響。
*   **功能：** 管理勞工結構、職安 FR/SR 指標、DEI 多元化數據與員工受訓時數，ESG S 面核心。

### Governance-公司治理
*   **目標：** 展現治理透明度。
*   **功能：** 記錄董事會結構、商業道德事件與稅務透明度等 G 面關鍵數據。

### CBAM-Calculator-CBAM計算機
*   **目標：** 應對歐盟碳關稅。
*   **功能：** 產品碳足跡輸入與歐盟碳價匯率即時試算，提供財務衝擊預估報告。

### Supply-Chain-供應鏈透明
*   **目標：** 延伸治理邊界至供應商。
*   **功能：** 管理供應商名單、ESG 評分、風險分級與承諾書簽署狀態。

### Stakeholders-利害關係人
*   **目標：** 管理外部聲音與回饋。
*   **功能：** 透過影響力矩陣與互動日誌，追蹤投資人、客戶與員工的關注議題。

---

## 旅程 IV. AI 賦能與撰寫 (AI Copilot)

### Editor-SustainWrite編輯器
*   **目標：** 「我需要 AI 幫我高效率寫出合規報告。」
*   **功能：** 支援 208 頁報告框架的撰寫中樞。具備章節導航、佐證清單與 AI 即時協作生成能力。

### Advisory-專家諮詢
*   **目標：** 獲得不同視角的治理建議。
*   **功能：** 內建 SPIRIT (合規、共榮、創新) 三大 AI 人格，隨時進行情境對話與策略諮詢。

### Digital-Twin-數位分身
*   **目標：** 讓 AI 懂企業的 DNA。
*   **功能：** 結合道德 DNA 滑桿與 RAG 知識倉庫，讓生成的內容貼合企業真實的價值觀與歷史脈絡。

### Intelligence-商情中心
*   **目標：** 監測外部環境風險。
*   **功能：** 即時整合 ESG 法規更新、產業標竿比較與外部風險事件預警。

### Compliance-Check-合規檢查
*   **目標：** 發佈前的全盤 AI 掃描。
*   **功能：** 自動比對草稿與 GRI/ISSB 要求，挑出缺漏或語意模糊段落，並提供一鍵修正建議。

---

## 旅程 V. 確信審計與發佈 (Audit & Publish)

### Dashboard-控制台
*   **目標：** 「我要一眼看清當前治理狀態。」
*   **功能：** 採用高資訊密度的 Bento Grid 佈局，展示 KPI、GRI 覆蓋率矩陣與最新 5T 系統活動日誌。

### Audit-Log-審計日誌
*   **目標：** 凡走過必留下痕跡 (T3 Trackable)。
*   **功能：** 記錄所有資料變更、操作者與時間戳，並附帶 SHA-256 哈希鎖定，不可篡改。

### Vault-證據金庫
*   **目標：** 安全儲存所有佐證文件。
*   **功能：** 顯示檔案的 Hash 雜湊值與 ZKP 驗證狀態，確保報告數據與原始文件完美對應。

### Proof-Center-誠信證明
*   **目標：** 企業數位信任的對外展廳。
*   **功能：** 集中展示全系統中已完成哈希鎖定的紀錄與企業整體的數位信任指數。

### Audit-Verify-VerifyLink
*   **目標：** 讓外部查核者輕鬆驗證。
*   **功能：** 提供給第三方會計師的專屬入口，具備即時 ZKP 哈希驗算動畫，降低外部查核成本。

### Publish-報告發佈
*   **目標：** 完成最後一哩路。
*   **功能：** 提供報告 A4 排版預覽，執行最終數位封印並匯出 PDF 正式對外揭露。

---

## 旅程 VI. 知識沉澱與加值 (Grow & Upgrade)

### Library-永續智庫
*   **目標：** 快速查找國際標準。
*   **功能：** 提供 GRI、SASB、ISSB 等標準的快速索引卡與框架導讀。

### Reading-Room-永續閱覽室
*   **目標：** 沉澱企業治理歷史。
*   **功能：** 持久化存檔過往的報告與情報，支援標籤與時間過濾，供未來團隊學習回顧。

### Finance-永續財務
*   **目標：** 評估 ESG 的財務影響。
*   **功能：** 進行 ESG 綠色投資 ROI 分析、TCFD 財務衝擊評估與碳價壓力測試。

### Academy-永續學院
*   **目標：** 內部培力與學習。
*   **功能：** 展示 Berkeley Haas × TSISDA 課程內容與學員進度，將治理知識與平台操作結合。

### Advisors-顧問專區
*   **目標：** 尋找外部專業協助。
*   **功能：** 提供顧問專家名錄、在線狀態與預約媒合服務。

### Consulting-顧問服務
*   **目標：** 選購客製化輔導方案。
*   **功能：** 說明平台五大輔導模組與加購市場，打通 SaaS 軟體與線下顧問服務的橋樑。

### Agents-代理專區
*   **目標：** 平台推廣與獎勵機制。
*   **功能：** 管理代理階級、推廣碼與 GoodCoin 獎勵錢包。

---

## 🔧 隱藏專區：超級管理員與 IT 後台 (Admin Console)
*(此區塊專供具備 ADMIN / IT_OPS 權限的系統管理員使用)*

### AI-Platform-AI整合平台
*   **功能：** AI 模型的選擇與切換中心。展示 Gemini 2.0 Pro/Flash 模型配額、Genkit 工作流，以及本地端私有模型的健康狀態。

### Hermes-Orchestrator-Hermes調度器
*   **功能：** 算力與任務調度的核心。透過 BlueCC 混合雲協議，監控 AI 任務是在雲端還是本地 Edge 節點執行，實現成本與隱私的最佳化負載平衡。

### Swarm-代理蜂群
*   **功能：** 監控多個 AI Agents 協同作戰 (Swarm Intelligence) 時的拓撲結構與通訊流，確保複雜任務的執行效率。

### System-Status-系統狀態
*   **功能：** IT 基礎設施儀表板。監控 Supabase 資料庫連線、API 響應延遲與伺服器 Uptime。

### System-Test-系統測試 (System Test & Function Map)
*   **路徑：** `/system-test` | **權限層級：** 僅限 ADMIN / IT_OPS
*   **功能定位：** 系統測試頁面是 **ESGGO 善向永續 系統** 平台的「交付品質防線」與「系統活體架構圖」。
*   **核心模組：**
    1.  **系統功能地圖 (Live Function Map)**：以視覺化拓撲圖呈現 SaaS 六大旅程的所有路由與模組狀態。綠燈代表資料流與 5T 協定正常。
    2.  **UI/UX 防跑版監控 (Visual Regression)**：針對「液態玻璃 (Liquid Glass)」主題與 RWD 雙主題進行視覺快照比對，自動攔截排版異常。
    3.  **功能邏輯達標審計 (E2E Benchmarking)**：端到端模擬使用者旅程，自動驗證 5T 協定 (數據填報 -> ZKP 封印 -> 審計日誌) 的完整性。

### Terminal-終端主控
*   **功能：** 結合 Omni_Terminal 的 CLI 指令後台，允許進階管理員輸入文字指令直接操作底層資料庫或發派 AI 任務。

### Design-Library-設計圖書館
*   **功能：** Berkeley Academy Design System 規範庫。展示 **Liquid Glass v2.0** UI 元件、色碼與前端代碼應用範例。

---

## 📊 資料表與邏輯資料庫
*(對應 Supabase Schema 規劃)*
*   **ESG Metrics**: GHG, Energy, Water, Social, Governance
*   **Trust & Audit**: Evidence Vault, Audit Logs
*   **Operations**: Tasks, Company Profile, Connectors
*   **AI & Config**: Personas, Hermes Swarm, Standards Library

---

## 🏆 技術完整性檢查結論
*   **RWD 與視覺**：全域支援淺色/深色液態玻璃雙主題，行動端底部導航列適配。
*   **5T 協定**：所有數據操作皆植入 T1-T5 協定標籤，達成 ZKP 防篡改與透明追溯。
*   **狀態**：系統處於 **Production-Ready** 階段，架構高度解耦，具備極強的商業展示與導入價值。

---
© 2026 ESGGO 善向永續 系統 | **Version:** v8.5.1-Alpha | **Last Updated:** 2026-05-30
