[平台總覽] [Platform Overview]
路徑： /overview | 權限： ALL_USERS | 所屬旅程： I. 平台啟動與總覽

1. 模組定位 (Core Purpose)
OmniHermes + ESG GO 是一個整合企業永續治理、ESG 數據管理、AI 協作、可信審計與混合雲智能控制的平台，旨在將零散的 ESG 工作升級為平台化、結構化、可驗證、可持續的數位治理操作系統。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 企業高階主管 (CEO, CSO) 或永續專案負責人。他們面臨 ESG 數據分散、報告撰寫效率低下、數據可信度存疑、AI 應用缺乏治理，以及難以全面掌握企業永續治理狀況的挑戰。
體驗高光時刻 (Aha Moment)： 當高階主管首次看到平台儀表板上，所有關鍵 ESG 指標、AI 協作進度與數據追溯鏈條清晰可見時，他們會意識到「原來永續治理可以如此透明、高效且可信賴」。
操作軌跡：
1.  企業決策者在首次接觸平台時，透過高階簡報或產品導覽，理解平台如何解決其核心痛點。
2.  瀏覽平台總覽頁面，快速掌握各模組的定位與相互關聯，建立對平台整體架構的信任感。
3.  透過平台提供的價值總結與成功案例，確認平台能為企業帶來的長期效益與競爭優勢。
4.  決定導入平台，將永續治理從「成本中心」轉變為「價值創造中心」。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「區塊化資訊卡片 (Sectional Info Cards)」與「響應式網格 (Responsive Grid)」佈局。頂部為品牌 Hero Section，下方則以 2-3 欄的卡片展示平台核心價值、解決方案與特色。
核心液態玻璃元件： BrandHero (平台願景展示區)、BrandValueCard (特色與價值卡片)、BrandFeatureGrid (功能概覽網格)。所有卡片與區塊均採用 glassBg (白/深藍磨砂) 視覺風格。
行動端適配 (RWD)： < 768px 時，所有區塊化資訊卡片自動堆疊為單欄佈局，確保文字與圖片在小螢幕上清晰可讀。Hero Section 的背景圖片或影片會自動裁切或調整比例，以適應垂直螢幕。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 平台總覽頁面本身不涉及實時資料寫入，主要從後端服務獲取平台整體狀態、關鍵指標摘要及模組間的關聯性描述。這些資訊通常來自於平台配置服務 (Config Service) 或元數據服務 (Metadata Service)。
5T 實踐點： 平台整體架構設計即以 5T 協議為核心，確保所有模組的資料價值與可信度。
*   **[T1 Tangible 具體]**: 平台將抽象的 ESG 治理目標與法規要求，轉化為具體的數據指標、可操作的流程與可視化的報告。例如，重大性矩陣將抽象議題具體化為座標點，SustainWrite 編輯器將法規條文具體化為撰寫框架。
*   **[T2 Traceable 追溯]**: 平台確保所有 ESG 數據、佐證文件與報告內容都具備完整的追溯鏈。從數據輸入、AI 處理、人工審閱到最終發布，每一步操作都留下不可篡改的稽核軌跡，並透過雙向連結機制，確保數據與佐證文件的一對一關聯。
*   **[T3 Trackable 追蹤]**: 平台提供全面的進度追蹤與狀態監控功能。管理層可透過儀表板實時掌握各部門的 ESG 數據填報進度、報告撰寫狀態、合規掃描結果，以及證據金庫的完整性，確保治理流程的可控性。
*   **[T4 Transparent 透明]**: 平台致力於提升 ESG 數據與 AI 協作的透明度。AI 生成內容會標示其推理來源，數據來源與計算邏輯清晰可見，佐證文件可供查閱，確保所有揭露資訊的公開與可驗證性。
*   **[T5 Trustworthy 信任]**: 平台透過 ZKP (零知識證明) 與 SHA-256 數位封印技術，為所有上傳的佐證文件提供密碼學級別的信任保證。任何數據或文件的篡改都將被立即識別，從根本上建立企業內外部對 ESG 數據的絕對信任。

5. 功能項目解說和使用技術 (Features & Tech Stack)
平台總覽頁面作為高階介紹，其「功能項目」主要體現在對平台核心能力的闡述與展示上。
*   **統一品牌原子元件庫 (Unified Brand Atomic Component Library)**： 確保整個平台 UI/UX 的一致性與開發效率。技術使用 Storybook 進行元件管理與文檔化，基於 React 與 Tailwind CSS 構建。
*   **全域 RWD 與行動端優化 (Global RWD & Mobile Optimization)**： 確保平台在任何設備上都能提供流暢的體驗。技術使用 CSS Media Queries 結合 Flexbox/Grid 佈局，並搭配 Next.js 的響應式圖片優化。
*   **5T 誠信協議實踐 (5T Integrity Protocol Implementation)**： 平台所有模組的底層設計原則。技術涵蓋 Supabase Row Level Security (RLS) 進行權限控制、PostgreSQL 觸發器 (Triggers) 記錄 Audit Log、Web Crypto API 進行客戶端 Hash 運算。
*   **AI 賦能與智能調度 (AI Empowerment & Intelligent Orchestration)**： 平台核心的 AI 協作能力。技術使用 Genkit 框架整合多模態 AI 模型 (如 Gemini 2.0 Pro)，並透過 Server-Sent Events (SSE) 實現實時互動。
*   **混合雲中控與資源彈性調度 (Hybrid Cloud Control & Resource Elasticity)**： 確保平台能靈活部署與擴展。技術使用 Kubernetes (K8s) 進行容器編排，結合 Terraform 實現基礎設施即代碼 (IaC)，並透過 BlueCC 自研控制平面管理本地與雲端資源。
*   **ZKP + SHA-256 數位封印 (ZKP + SHA-256 Digital Sealing)**： 確保證據文件的不可篡改性與可信度。技術使用 Web Crypto API 進行 SHA-256 雜湊運算，並探索基於區塊鏈或零知識證明庫 (如 snarkjs) 的未來整合。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 平台總覽頁面作為對外展示的第一印象，任何區塊化卡片在不同解析度下，其內容（文字、圖片、按鈕）絕對不可溢出容器、重疊或被截斷。Hero Section 的背景圖片在任何 RWD 斷點下，其核心視覺元素必須保持可見且不失真。
🚨 邏輯/體驗紅線： 平台總覽頁面所宣稱的「平台目標」與「可解決的問題」必須與實際功能模組的體驗高度一致。若用戶在瀏覽總覽後，進入任一功能模組卻發現其核心價值未能兌現（例如，宣稱 AI 協作高效，但實際響應遲鈍），則視為嚴重的體驗紅線。此外，頁面載入時間必須在 3 秒內完成 (First Contentful Paint)，確保用戶能快速獲取平台價值。