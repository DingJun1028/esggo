---
uuid: "d304a081-baeb-47d0-bd51-b2555fbd5c7f"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.430Z"
evidence: "docs\wiki\SustainWrite.md"
---
# SustainWrite 編輯器 [SustainWrite Editor]
路徑： /editor | 權限： PM, ADMIN | 所屬旅程： IV. AI 賦能與撰寫

1. 模組定位 (Core Purpose)
SustainWrite 是 ESG GO 的核心撰寫中樞，提供 208 頁報告框架、佐證清單與 AI 合規協作，幫助企業高效率產出符合 GRI/ISSB 標準的可信永續報告。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM) 在面對 200 多頁的 Word 檔案時，需要不斷在各種 PDF 憑證與法規網頁間頻繁切換，深怕寫錯或漏掉 GRI 指標，導致報告撰寫耗時且章節管理困難。
體驗高光時刻 (Aha Moment)： 當 PM 點擊「AI 擴寫」時，系統不僅在 3 秒內生成合規草稿，還自動在右側抽屜亮起該段落對應的「電費單 PDF 縮圖」。PM 瞬間感受到「不用自己大海撈針」的巨大釋放感，並對內容的結構化、可追溯與可驗證性感到安心。
操作軌跡：
1. 焦慮地從左側導航樹點開尚未完成的 GRI 305 章節。
2. 召喚 AI 助手，請其依據今年度數據生成排放聲明。
3. 檢閱 AI 內容與標註的證據來源，確認無誤後點擊「寫入」。
4. 執行合規掃描，看到全綠燈通過，安心存檔。
5. 完成後進行封印或發佈流程。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
**設計系統： InfoOne v8.1.0 (Light Mode Priority)**
桌面版佈局： 採用「左中右三欄佈局」。左側為「章節導航樹」，中央為「所見即所得編輯區」，右側為「AI 顧問 / 佐證文件抽屜」。
視覺風格： 極簡淺色系 (`bg-slate-50`)，搭配液態玻璃 (`backdrop-blur-xl`, `bg-white/80`)。
核心元件： 使用 `UniversalCard` 作為容器；編輯區背景採用 `bg-white/90`；章節導航使用新的 `ui/TreeNav` (淺色版)。
行動端適配 (RWD)： < 768px 時，左右兩欄自動隱藏為「漢堡選單」與「懸浮 FAB」，中央編輯區必須 100% 滿版。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 編輯內容自動每 30 秒 Autosave 至 Supabase report_drafts 表。佐證文件關聯資訊儲存於 evidence_links 表，並影響 report_status_dashboard 的合規進度 KPI。
5T 實踐點：
[T1 真 Truthful - Traceable]： 使用者在文字中 @ 標記數據時，自動建立與 evidence_vault 的雙向連結。
[T2 善 Thankful - Transparent]： AI 生成文字旁標示推理來源（內部知識庫或外部法規）。
[T3 美 Tasteful - Tangible]： 透過可視化的合規進度條與液態玻璃質感 UI，讓數據「可感知」。
[T4 信 Trustful - Trustworthy]： 寫入內容經由 Hash Lock 封印，確保不可篡改。
[T5 通 Transferful - Trackable]： 每次編輯內容皆留下版本紀錄，追蹤生命週期。

5. 功能項目解說和使用技術 (Features & Tech Stack)
所見即所得編輯 (WYSIWYG)： 技術使用 TipTap 編輯器核心，並結合 `react-mentions` 實現數據掛載。
AI 協作與 Swarm 共鳴： 整合 `SwarmResonance` 元件展示代理蜂群的實時處理狀態。
因果拓樸圖： 使用 `CausalTopologyGraph` 可視化 5T 封印過程中的密碼學驗證鏈。
自動儲存與同步： 技術使用 Supabase Realtime 與 Lodash debounce。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 編輯器工具列在不同螢幕尺寸下必須保持可見且功能正常。
🚨 邏輯體驗紅線： 若發生斷網，必須平滑切換至「離線暫存模式 (IndexedDB)」。
🚨 誠信紅線： 封印後的內容若被手動從後端修改，`integrity_hash` 驗證必須失敗並報警。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自 `/data-sources` 的原始採集數據。
下游影響： 直接影響 `/dashboard` 的全域進度與 `/vault` 的證據鏈。
依賴組件： `UniversalCard`, `SwarmResonance`, `CausalTopologyGraph`.