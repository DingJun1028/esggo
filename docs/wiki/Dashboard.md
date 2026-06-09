---
uuid: "316564c3-d5bb-4669-a644-f5158964ed70"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.476Z"
evidence: "docs\wiki\Dashboard.md"
---
# 主權治理控制台 [Sovereign Governance Dashboard]
路徑： / | 權限： ALL_USERS | 所屬旅程： I. 平台總覽與決策

1. 模組定位 (Core Purpose)
作為 ESG GO 平台的統一入口與決策中樞，控制台透過整合關鍵績效指標 (KPI)、GRI/ISSB 覆蓋率、5T 活動日誌與**密碼學驗證模擬**，提供企業高層與專案團隊一站式、即時的永續表現洞察。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或永續專案經理 (PM)。他們需要即時掌握整體營運的永續表現，並驗證數據的密碼學完整性，避免因數據延遲或不透明導致的決策風險。
體驗高光時刻 (Aha Moment)： 當 CSO 在 Dashboard 看到透過 **Pedersen 承諾** 驗證的子公司碳排總和，而無需查閱各廠敏感機密數據時，深刻體會到「數據信託」帶來的安全感。
操作軌跡：
1. 快速瀏覽核心 KPI (如碳排放、系統熵值) 的即時數據。
2. 透過「GRI 覆蓋率矩陣」掌握報告撰寫進度。
3. 使用「密碼學模擬器」體驗 L1~L3 數據去敏與同態加總驗證。
4. 檢閱「5T 活動日誌」，追蹤全域治理動態。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
**設計系統： InfoOne v8.1.0 (Light Mode Priority)**
桌面版佈局： 彈性 **Bento Grid** 佈局，採用 4 欄網格。
視覺風格： 極簡淺色系 (`bg-slate-50`)，搭配液態玻璃 (`bg-white/70`, `backdrop-blur-xl`) 與神經形態背景光暈。
核心元件： `OmniBaseCard` (用於 Hero 卡片), `Card` (用於一般指標), `SwarmMonitor` (展示蜂群狀態)。
行動端適配 (RWD)： < 768px 時自動切換為單欄堆疊，5T 日誌改為摺疊面板。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： KPI 聚合自 `kpi_metrics`；5T 日誌訂閱 Supabase Realtime `audit_logs`；密碼學模擬透過 `/api/crypto/simulator` 執行。
5T 實踐點：
*   [T1 真 Truthful - Traceable]：所有 KPI 皆可追溯至 `data_points` 原始紀錄。
*   [T2 善 Thankful - Transparent]：展示 Pedersen 同態加法算法透明度。
*   [T3 美 Tasteful - Tangible]：使用 Bento Grid 與液態玻璃 UI 讓治理狀態「可感知」。
*   [T4 信 Trustful - Trustworthy]：5T 日誌記錄不可篡改的 Hash Lock 封印事件。

5. 功能項目解說和使用技術 (Features & Tech Stack)
KPI 儀表板： 技術使用 Recharts 結合 React Query 實時更新。
密碼學模擬器： 實作 L1-L3 去敏與 Pedersen 承諾模擬，展現 ZKP 隱私保護能力。
Slack Gateway： 整合 `SlackGatewayCard` 實現跨平台的 OmniAgent 溝通。
5T 實證日誌： 透過 `omniRealtime` 訂閱並展示即時封印事件流。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： KPI 數值必須具備自動縮放機制，不可溢出容器。
🚨 數據紅線： 模擬器計算結果必須與後端 Web Crypto API 保持絕對一致。

7. 矩陣關聯 (Matrix Connection)
上游數據： 全域模組之 `audit_logs`, `kpi_metrics`.
下游影響： 引導使用者至 `/editor`, `/materiality`, `/vault`.
依賴組件： `OmniBaseCard`, `CausalTopologyGraph`, `SwarmMonitor`, `ESGSmartQA`.