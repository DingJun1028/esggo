---
uuid: "ea1f2ffa-c936-4687-ae23-9c384c4e26e6"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.424Z"
evidence: "docs\wiki\System-Test.md"
---
# 系統測試 System Test [System Test]
路徑： /system-test | 權限： QA, DEV, PM, DevOps | 所屬旅程： VI. 系統維運與品質保證

1. 模組定位 (Core Purpose)
系統測試頁是 ESG GO 平台交付品質與回歸驗證的統一可視化中樞，確保所有功能模組在持續迭代中，始終維持 Production-Ready 的高標準。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： QA 工程師、開發者、產品經理、DevOps 團隊。在每次功能發佈或程式碼合併後，他們需要快速確認系統的穩定性與功能完整性，但過去缺乏一個集中且即時的介面來總覽所有測試結果與品質報告，導致問題發現不及時，回歸驗證耗時且容易遺漏。
體驗高光時刻 (Aha Moment)： 當 QA 團隊在發佈前夕，看到所有核心模組的測試燈號皆為綠色，並且頁面交付質量報告顯示無任何 UI 跑版或性能瓶頸，他們會感到「哇！這次發佈可以安心了，所有品質數據一目瞭然」。
操作軌跡：
1. DevOps 觸發 CI/CD Pipeline，自動執行各類測試。
2. QA 工程師進入 `/system-test` 頁面，即時查看最新測試結果儀表板。
3. 發現某個單元測試失敗，點擊進入詳情，查看錯誤日誌與相關程式碼變更。
4. PM 檢閱頁面交付質量報告，確認新功能頁面在不同裝置上的 RWD 表現符合預期。
5. 確認所有關鍵指標達標後，團隊共同決定進行發佈。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「儀表板型多卡片佈局 (Dashboard Multi-Card Layout)」，頂部為全局狀態概覽 (如：總測試數、通過率、最新執行時間)，下方則以 2x2 或 3x2 的 Bento Grid 呈現「單元測試結果」、「頁面交付質量報告」、「問題清單」與「測試可視化狀態」等核心卡片。
核心液態玻璃元件： BrandStatusCard (顯示測試模組狀態，綠/黃/紅燈號)、BrandProgressBar (顯示測試進度與通過率)、BrandDataTable (用於展示詳細測試結果與問題列表)。
行動端適配 (RWD)： < 768px 時，所有卡片自動堆疊為單欄佈局，並隱藏部分次要資訊，僅保留核心狀態與摘要。詳細報告需點擊卡片後進入獨立頁面查看，以確保在小螢幕上仍能清晰閱讀。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向：
*   CI/CD Pipeline 執行測試後，測試框架 (如 Jest, Cypress, Playwright) 產生的 JSON 報告會被解析並存入 `test_results` 資料表。
*   頁面交付質量工具 (如 Lighthouse CI, Storybook) 產生的報告會存入 `page_quality_audits` 資料表。
*   問題清單數據與追蹤狀態則與 Jira/GitHub Issues 等外部系統同步，或存入 `issue_tracker` 資料表。
*   這些數據會匯總並影響內部 DevOps/QA Dashboard 的 KPI。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的程式碼品質與測試結果，具體化為可視化的儀表板、通過率百分比、紅綠燈狀態，以及具體的性能分數與可訪問性評級。
[T2 Traceable 追溯]： 每個測試結果都與其對應的 Git Commit ID、執行時間、執行者 (CI Bot 或手動觸發者) 綁定，確保任何品質問題都能追溯到源頭。
[T3 Trackable 追蹤]： 測試失敗的歷史趨勢、問題的解決進度、頁面性能的變化曲線，都可以在此頁面被追蹤與分析，提供長期品質改進的依據。
[T4 Transparent 透明]： 所有測試結果、品質報告與問題清單對具備權限的團隊成員完全透明公開，促進跨部門對品質的共識與協作。
[T5 Trustworthy 信任]： 測試結果由自動化工具生成，並經過版本控制系統的保護，確保數據的原始性和不可篡改性，為發佈決策提供可信賴的依據。

5. 功能項目解說和使用技術 (Features & Tech Stack)
單元測試結果儀表板： 實時展示各模組的單元測試 (Unit Test) 與整合測試 (Integration Test) 通過率、失敗詳情與歷史趨勢。技術使用 React Chart.js 或 Recharts 渲染圖表，後端整合 Jest/Vitest 測試報告解析器。
頁面交付質量審計報告： 提供各核心頁面的性能 (Performance)、可訪問性 (Accessibility)、最佳實踐 (Best Practices) 與 SEO 評分，並展示 RWD 快照。技術使用 Lighthouse CI 或 Playwright 進行自動化審計，並將結果存儲與可視化。
問題清單與追蹤： 集中顯示當前所有未解決的測試相關問題，可直接連結至 Jira 或 GitHub Issues。技術使用 GraphQL 或 REST API 與外部 Issue Tracking 系統同步，前端使用 Ag-Grid 或客製化表格元件。
測試可視化狀態： 提供一個概覽圖，以熱力圖或樹狀圖形式展示各功能模組的測試覆蓋率與健康狀態。技術使用 D3.js 或 ECharts 進行複雜數據的可視化渲染。
測試執行觸發與日誌： 允許具備權限的用戶手動觸發特定測試套件，並實時查看執行日誌。技術使用 WebSocket 或 Server-Sent Events (SSE) 實時推送後端測試進度與日誌，後端整合 CI/CD 工具 (如 GitHub Actions, GitLab CI) 的 API。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線：
*   當測試結果數據量巨大時 (例如：數千條單元測試結果)，表格或圖表必須保持流暢滾動，不可出現卡頓或渲染錯誤。
*   儀表板上的狀態燈號 (紅/黃/綠) 必須清晰可辨，且在不同主題模式 (亮/暗) 下保持高對比度。
*   RWD 模式下，所有卡片堆疊後，其標題與核心數據必須完整顯示，不可被截斷或重疊。
🚨 邏輯/體驗紅線：
*   測試結果數據的更新延遲不得超過 10 秒 (從 CI/CD 報告生成到頁面顯示)。
*   若與外部 Issue Tracking 系統同步失敗，必須在頁面頂部顯示顯眼的錯誤提示，並提供重試或手動同步選項。
*   當所有測試都通過，但頁面交付質量報告中存在任何「嚴重 (Critical)」級別的性能或可訪問性問題時，總體狀態燈號仍必須顯示為「黃色警告」或「紅色失敗」。
*   手動觸發測試時，若因後端服務器故障導致無法執行，必須給出明確的錯誤訊息，而非無限加載或空白頁面。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自 CI/CD Pipeline 的測試報告。
下游影響： 決定系統的發佈狀態與版本穩定性評級。
依賴組件： BrandStatusCard, BrandProgressBar, BrandDataTable.