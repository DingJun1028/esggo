---
uuid: "ae4b9d71-78b8-41a9-b679-37565569fa05"
version: "8.5.1"
timestamp: "2026-06-07T14:59:43.000Z"
evidence: "docs\wiki\Document-Checklist.md"
---
# 文件清單 Document Checklist [Document Checklist]
路徑： /document-checklist | 權限： PM, ALL_USERS | 所屬旅程： II. 策略盤點與分派

1. 模組定位 (Core Purpose)
文件清單模組是確保 ESG 稽核「不缺件」的數位目錄。它與「證據金庫 (Vault)」深度連動，自動比對數據填報進度與佐證文件上傳狀態，確保每一筆 ESG 指標皆有對應的憑證支撐。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點：
*   **各部門窗口**：常常不知道「這筆數據需要什麼樣的證明文件」。
*   **PM/稽核員**：在數百個資料夾中翻找對應的電費單或教育訓練簽到表。
體驗高光時刻 (Aha Moment)：
當使用者進入清單，看到所有法規要求的佐證項目已被自動羅列，且已上傳的項目顯示「綠色勾勾 (Verified)」，未補齊的項目則以「橙色驚嘆號」提醒，並提供一鍵上傳入口。那種「一切盡在掌握」的秩序感，是本模組的核心價值。
操作軌跡：
1. 系統根據選定的 ESG 框架 (如 GRI) 自動生成所需文件清單。
2. 使用者點擊特定項目，查看文件規格要求。
3. 直接拖拽文件至清單項目進行上傳。
4. 系統自動計算 Hash 鎖定，並同步至證據金庫。
5. 稽核員在查核時，點擊清單即可瞬間調閱原始憑證。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側目錄樹 + 右側清單詳情」佈局。清單項目採用條目式卡片，清晰標示狀態、權限與最後更新時間。
核心液態玻璃元件： CheckboxTree (目錄選擇)、StatusBadge (5T 狀態標籤)、FileUploadZone (支援多檔拖拽上傳)。
行動端適配 (RWD)： 轉化為「狀態聚合視圖」，優先顯示待辦 (Pending) 項目，點擊後展開上傳或檢閱介面。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 清單模板來自 `checklist_templates`，用戶上傳紀錄寫入 `document_entries`，文件實體存於 Supabase Storage，並與 `Vault` 產生 1:1 關聯。
5T 實踐點：
[T2 Traceable 溯源]： 實現「數據點 -> 憑證項目 -> 原始文件」的完整鏈路追溯。
[T5 Trustworthy 信任]： 上傳瞬間執行客戶端 Hash 運算，確保憑證在進入雲端前即被「數位封裝」。

5. 功能項目解說和使用技術 (Features & Tech Stack)
*   **動態模板載入**：根據企業選擇的重大性議題自動過濾所需清單。技術：Next.js 動態路由與 Supabase RPC。
*   **多權限協作**：不同部門僅能看到與其任務相關的文件清單。技術：Supabase RLS。
*   **自動化進度條**：實時計算整體憑證齊全率。技術：React State Management + SQL Aggregate Functions.

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 邏輯紅線： 文件清單若與證據金庫數據不一致（如 Vault 檔案被刪除但清單仍顯示綠色），系統必須立即觸發同步警示。
🚨 UI 紅線： 上傳進度條必須具備「液態流動」動畫，嚴禁出現靜止不動的假死狀態。
🚨 安全紅線： 敏感憑證必須經過權限過濾，非授權人員不得下載或預覽。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自 `/data-sources` 與 `/tasks` 的待補件訊號。
下游影響： 直接決定 `/vault` 的飽和度與 `/publish` 的報告齊全度。
依賴組件： CheckboxTree, StatusBadge, FileUploadZone.
