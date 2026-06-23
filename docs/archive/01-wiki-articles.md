# ESGGO 聖典文獻 — 01：Wiki 文獻記憶碎片

> **來源：** `C:\Project\esggo_wiki_temp\` — 40 篇官方 Wiki 文檔  
> **版本：** OmniHermes v8.5.1-Alpha / ESG GO System  
> **最後更新：** 2026-05-23  
> **設計系統：** Berkeley Academy Design System v10.0  
> **誠信標準：** 5T Integrity Protocol v1.1.0  

---

## 一、平台總覽

### 平台定位
OmniHermes + ESG GO 是一套聚焦於 **企業永續治理、ESG 數據管理、AI 協作、可信審計與混合雲智能控制** 的整合平台。核心目的不只是協助企業完成永續報告，而是建立完整的 **數位治理操作系統**。

### 平台目標
1. 讓企業更容易建立 ESG 治理基礎
2. 降低永續報告撰寫與資料整理成本
3. 建立證據與數據的可追溯鏈
4. 透過 AI 提升分析與撰寫效率
5. 讓治理狀態可視化、可查核、可持續優化

### 平台整體特色
- **5T 誠信協議**：T1可具體化、T2可追溯、T3可追蹤、T4可透明、T5可信任
- **GRI / ISSB 對應能力**
- **Omni-Agent 智能調度**
- **BlueCC 混合雲中控**
- **ZKP + SHA-256 數位封印**
- **全域 RWD 與行動端優化**
- **統一品牌原子元件庫**

---

## 二、系統核心架構

### 六大層架構

| 層級 | 名稱 | 核心技術 |
|------|------|----------|
| 1 | 前端體驗層 | Next.js + React + TypeScript + RWD + Mobile Bottom Navigation |
| 2 | 治理應用層 | Dashboard / SustainWrite / Digital Twin / Health Check / Advisory / Intelligence |
| 3 | ESG 數據層 | Environmental / Social / Governance / Materiality / Finance / Supply Chain / Stakeholders |
| 4 | 治理確信層 | Audit Log / Evidence Vault / Hash Lock / ZKP 驗證 / 5T 標籤 |
| 5 | AI 協作層 | Gemini 2.0 / Genkit 流程 / OmniHermes 合規掃描 / SPIRIT 三大 AI 人格 / Digital Twin RAG |
| 6 | 基礎設施層 | Supabase PostgreSQL / BlueCC Hybrid Control Plane / API Connectors / Resend Email / Hermes Gateway |

### 核心設計思想
以「治理流程」為核心，每個頁面共同參與：
**資料輸入 → 結構化治理 → AI 協作 → 證據追溯 → 稽核驗證 → 報告發佈 → 外部查核**

---

## 三、技術架構與資料設計

### 技術棧
- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Database:** Supabase PostgreSQL
- **Cloud Control:** BlueCC API Bridge + Hybrid Dispatcher
- **AI Engine:** Gemini 2.0 + OmniHermes + Genkit
- **Integrity Layer:** SHA-256 + ZKP + Audit Logs
- **Email / Notification:** Resend API
- **Security Layer:** RLS + API Connectors

### 響應式設計
所有頁面透過 `ClientLayout` 支援：
- 行動端底部導航
- 桌面端側邊欄
- Safe Area 優化
- 全域 RWD 適配

### 資料設計原則
1. 以 Supabase PostgreSQL 為正式資料結構映射目標
2. 前端目前以 TypeScript Interface + Mock Array 作為 SEED
3. 所有邏輯資料表均對應未來後端關聯式資料表
4. 所有關鍵數據頁面皆具備 5T 標籤能力

### 數據一致性策略
- 統一透過 `lib/db.ts` 作為 Supabase 接口層
- 確保全系統欄位與資料來源一致
- 降低前後端映射落差

### 安全與可信設計
- 重要紀錄使用 SHA-256 進行加密封印
- 關鍵文件支援 ZKP 驗證狀態
- 所有生命週期變更可寫入審計日誌
- 敏感資料透過 RLS 進行保護

---

## 四、資料表與邏輯資料庫

目前系統資料主要以前端 Mock Data / SEED 形式存在，作為未來 Supabase PostgreSQL 正式資料表的 1:1 映射雛形。

### 4.1 ESG 核心數據庫 (ESG Metrics)
| 資料表 | 欄位 |
|--------|------|
| GHG Emissions | 範疇一、二、三排放量、碳密集度 |
| Energy Consumption | 總用電量、再生能源比例、化石燃料耗用 |
| Water & Waste | 取水量、廢水排放、有害/一般廢棄物、回收率 |
| Social Metrics | 員工編制、女性比例、FR/SR 指標、平均受訓時數 |
| Governance Metrics | 董事會人數、獨立董事比例、女性董事比例、貪腐事件數、有效稅率 |

### 4.2 治理與稽核資料庫 (Governance & Audit)
| 資料表 | 欄位 |
|--------|------|
| Evidence Vault | 佐證文件、Hash 雜湊值、ZKP 驗證狀態、檔案大小、對應 GRI 條款 |
| Audit Logs | 操作者、時間、操作行為、SHA-256 Hash |
| Materiality Topics | ESG 議題名稱、Impact、Concern、雙重重大性定位 |

### 4.3 營運與管理資料庫 (Operations & Management)
| 資料表 | 欄位 |
|--------|------|
| Tasks | 任務狀態、優先級、負責人、截止日期、進度 |
| Company Profile | 公司營收、員工人數、產業別、願景使命 |
| Notifications | 系統通知、AI 提醒、合規警示、到期提醒 |

### 4.4 外部關聯資料庫 (External Relations)
| 資料表 | 欄位 |
|--------|------|
| Suppliers | 供應商名單、ESG 評分、風險分級、承諾書狀態、在地採購狀態 |
| Stakeholders | 群體類型、主要關注議題、影響力權重、參與頻率 |
| Finance ROI | 投入成本、年度節省金額、回收期 |

### 4.5 知識庫與商情系統 (Knowledge & Intelligence)
| 資料表 | 欄位 |
|--------|------|
| Intelligence | ESG 法規動態、碳政策、產業新聞、衝擊等級標籤 |
| Benchmarks | 產業標竿企業 E/S/G 分數 |
| Standards Library | GRI / ISSB / TCFD / SASB |
| Net-Zero Milestones | 中長期減碳里程碑、SBTi 目標設定 |

### 4.6 AI 與系統架構資料 (AI & System)
| 資料表 | 欄位 |
|--------|------|
| Personas / Digital Twin | SPIRIT 人格 System Prompts、道德 DNA 權重 |
| Hermes Swarm | Agent 狀態、任務分配、非同步工作 |
| Connectors | Supabase / Gemini / ERP / 各外部服務連接狀態 |

---

## 五、功能模組詳解

### 5.1 核心指揮中心 (CORE)

#### 控制台 Dashboard (`/`)
- **定位：** 平台核心入口，整合 KPI 儀表板、GRI 覆蓋率、5T 活動日誌
- **佈局：** Bento Grid 高資訊密度設計
- **內容：** KPI 儀表板、GRI 覆蓋率矩陣、5T 活動日誌、功能入口導航
- **痛點解決：** 資料分散難掌握、報告進度缺乏總覽

#### SustainWrite 永續撰寫 (`/editor`)
- **定位：** 核心撰寫中樞，支援永續報告、GRI 章節內容與 AI 協作式撰寫
- **規模：** 支援 208 頁報告框架
- **內容：** 章節導航、報告內容編輯區、佐證清單、AI 合規掃描、GRI 對齊管理
- **痛點解決：** 報告撰寫耗時、章節管理困難、內容與佐證難對應

#### 數位分身 Digital Twin (`/digital-twin`)
- **定位：** 企業治理知識的數位映射中心
- **核心：** 道德 DNA 滑桿 + RAG 知識倉庫 + 主權帳本追蹤
- **差異化：** 讓 AI 在企業治理語境下進行更貼近價值導向的協作
- **痛點解決：** ESG 知識散落、AI 難理解企業歷史脈絡

#### 企業健檢 Health Check (`/health-check`)
- **定位：** ESG 治理成熟度快速診斷工具
- **機制：** 15 題 ESG 診斷嚮導 → 自動生成 90 天改善路徑圖
- **痛點解決：** 不知道 ESG 從哪開始、缺乏可操作的改善路徑

#### 專家諮詢 Advisory (`/advisory`)
- **定位：** 企業與 AI 顧問互動的專屬空間
- **SPIRIT 三大 AI 人格：** 合規 / 共榮 / 創新
- **痛點解決：** 單一 AI 視角無法滿足多元決策需求

#### 商情中心 Intelligence (`/intelligence`)
- **定位：** ESG 外部環境監測與風險感知中心
- **內容：** 法規更新流、產業標竿比較、風險預警、ESG 情報標記
- **痛點解決：** 外部法規資訊難集中、風險事件常在發生後才被注意

### 5.2 E-S-G 數據模組

#### 環境指揮 Environmental (`/environmental`)
- **數據：** GHG Scope 1-3、能源耗用、水資源管理、廢棄物追蹤
- **對應資料表：** GHG Emissions / Energy Consumption / Water & Waste

#### 社會影響 Social (`/social`)
- **數據：** 勞工結構、DEI 多元化追蹤、職安 FR/SR 指標、平均受訓時數
- **對應資料表：** Social Metrics

#### 公司治理 Governance (`/governance`)
- **數據：** 董事會結構、獨立董事比例、女性董事比例、商業道德案件、稅務透明度
- **對應資料表：** Governance Metrics

### 5.3 治理與確信 (GOVERNANCE)

#### 重大性矩陣 Materiality (`/materiality`)
- **功能：** 雙重重大性評估與議題排序
- **可視化：** 互動式氣泡圖（Impact / Concern）
- **對應標準：** GRI 3-1 ~ 3-3

#### 專家模板 Templates (`/templates`)
- **內容：** GRI 2021 模板、ISSB S1/S2 映射、零算力啟動模板
- **價值：** 降低導入門檻、提高內容結構一致性

#### 審計日誌 Audit Log (`/audit-log`)
- **功能：** 記錄每一次資料、封印、驗證與操作事件
- **機制：** 不可篡改的 5T 軌跡記錄 + SHA-256 哈希鎖定
- **對應資料表：** Audit Logs

#### 證據金庫 Vault (`/vault`)
- **功能：** 佐證文件與可信驗證中心
- **欄位：** Hash 值、ZKP 驗證狀態、檔案大小、對應 GRI 條款
- **對應資料表：** Evidence Vault

### 5.4 洞察與發佈 (INSIGHTS)

#### 淨零路徑 Roadmap (`/roadmap`)
- **功能：** 中長期減碳目標、里程碑與進度追蹤
- **可視化：** SBTi 1.5°C 減碳趨勢圖

#### 報告發佈 Publish (`/publish`)
- **功能：** 永續報告最終輸出、預覽與封印
- **流程：** A4 預覽 → ZKP 數位封印 → PDF 匯出

#### 永續閱覽室 Reading Room (`/reading-room`)
- **功能：** 持久化內容與情報閱讀空間
- **篩選：** GRI 標籤 + 時間戳過濾

#### 永續智庫 Library (`/library`)
- **內容：** GRI、SASB、TCFD、ISSB 等國際標準快速索引卡片

#### 永續財務 Finance (`/finance`)
- **功能：** ESG ROI 分析、TCFD 財務影響評估、碳價壓力測試
- **價值：** 建立 ESG 與財務的橋接能力

#### 供應鏈透明 Supply Chain (`/supply-chain`)
- **數據：** 供應商 ESG 評分、風險分級、承諾書追蹤、在地採購狀態
- **對應資料表：** Suppliers

#### 利害關係人 Stakeholders (`/stakeholders`)
- **功能：** 影響力矩陣、情感追蹤、互動日誌
- **對應資料表：** Stakeholders

#### VerifyLink™ / Audit Verify (`/audit-verify`)
- **定位：** 外部審計師或第三方查核者的可信驗證入口
- **特色：** 即時 ZKP 哈希驗算動畫

### 5.5 學院與顧問 (ACADEMY)

#### 永續學院 Academy (`/academy`)
- **內容：** Berkeley Haas × TSISDA 課程、學員進度、師資陣容

#### 顧問專區 Advisors (`/advisors`)
- **功能：** 顧問名錄、在線狀態、預約媒合

#### 代理專區 Agents (`/agents`)
- **功能：** 代理人階級系統、推廣碼管理、GoodCoin 錢包機制

#### 顧問服務 Consulting (`/consulting`)
- **內容：** 五大輔導模組、中控儀表板、加購市場

#### AI 整合平台 AI Platform (`/ai-platform`)
- **展示：** Gemini 2.0、Genkit 流程、BlueCC 任務同步

### 5.6 系統管理 (SYSTEM)

#### 任務中心 Tasks (`/tasks`)
- **功能：** 跨部門 ESG 協作工作看板
- **欄位：** 任務清單、優先級、進度追蹤、負責人、5T 一致性檢查

#### 企業管理 Profile (`/profile`)
- **內容：** 企業基本資料、ESG 長期目標、治理架構、願景與使命

#### 整合中心 API Setup (`/api-setup`)
- **功能：** API 連接器狀態、Webhook 監控、環境變數校驗

#### 系統測試 System Test (`/system-test`)
- **功能：** 自動化單元測試 UI、頁面交付質量審計報告

---

## 六、5T 誠信協議

5T 是平台的核心治理標準，確保每一筆 ESG 資料都具備可視、可追溯、可追蹤、可透明與可信任的特性。

### T1 Tangible｜可具體化
- **目標：** 將抽象 ESG 數據轉化為可視化、可操作的治理指標
- **技術實作：** Bento Grid、KPI Cards、GRI Coverage Matrix、Tangible Metrics with Units

### T2 Traceable｜可追溯
- **目標：** 每筆數據都必須能回到來源與憑證
- **技術實作：** `evidence_id`、`source_origin`、grounded path validation

### T3 Trackable｜可追蹤
- **目標：** 所有變更都要留下可追蹤生命週期紀錄
- **技術實作：** `audit_logs`、lifecycle hooks、event trail

### T4 Transparent｜可透明
- **目標：** AI 與規則引擎的檢查過程應可理解、可檢視
- **技術實作：** OmniHermes 合規掃描、GRI 對齊標籤、explicit formula reference

### T5 Trustworthy｜可信任
- **目標：** 重要資料需具備加密封印與不可篡改機制
- **技術實作：** SHA-256 hash lock、Web Crypto API、ZKP verification badge、seal notification

---

## 七、品牌原子元件庫

### 原子級元件 (Atoms)
- **BrandStatusDot：** 顯示 5T 協議狀態（T1-T5）
- **BrandBadge：** 標準化 GRI 指標與 ISO 標準標籤
- **BrandButton：** 具備 5T 封印動畫效果的高級操作按鈕
- **BrandAvatar：** 顯示 AI 代理（SPIRIT Personas）的身份識別

### 分子級元件 (Molecules)
- **BrandKpiCard：** 整合計算公式、數據來源與 5T 狀態的關鍵指標卡片
- **BrandT5Strip：** 橫向顯示單筆數據之 5T 完整度進度條
- **BrandSearchBar：** 具備 GRI 自動補全與智慧過濾功能的搜尋欄

### 生物級元件 (Organisms)
- **VaultOmniTable：** 萬能聖碑記錄表格，整合即時 SHA-256 驗算與 ZKP 標識
- **HermesFloatingAgent：** 全域懸浮 AI 助手，支援語音與視覺掃描輸入
- **StandardPage：** 預設的 12 欄 Bento Grid 佈局頁面框架

### 品牌視覺 Token
- **Primary Color：** `#003262`（Berkeley Blue）
- **Accent Color：** `#FDB515`（California Gold）
- **設計哲學：** Liquid Glass（液態玻璃擬態）
- **視覺標準：** Berkeley Academic Precision

---

## 八、建置歷程

### 第一階段：需求定義
從 ESG 管理、永續撰寫與治理驗證三大需求出發，明確定義核心目標。

### 第二階段：功能框架建立
形成六大領域：核心指揮中心、E-S-G 數據模組、治理與確信、洞察與發佈、學院與顧問、系統管理。

### 第三階段：技術與標準整合
完成 Supabase 邏輯資料表設計、5T Integrity Framework、SHA-256 + ZKP 可信機制、Berkeley 品牌設計系統、原子元件庫、BlueCC 混合雲調度邏輯、行動端適配。

### 第四階段：平台成熟化
- 全路由可正常訪問
- 所有頁面皆有對應內容展示
- 視覺語言已統一
- RWD 與行動端體驗完成
- 核心治理模組可完整展示
- **Production-Ready 狀態**

---

## 九、技術完整性檢查結論

### 響應式適配 (RWD)
所有頁面均已透過 `ClientLayout` 兼容移動端底部導航、桌面端側邊欄、Safe Area 優化。

### 數據一致性
統一使用 `lib/db.ts` 作為 Supabase 接口層，確保全系統數據同步、欄位口徑一致。

### 視覺語言
嚴格遵守品牌色配置（Berkeley Blue #003262、California Gold #FDB515），統一套用 Liquid Glass 設計哲學、Bento Grid 組織方式。

### 5T 標籤完整性
每個涉及數據操作的頁面均已植入 T1-T5 協定標籤。

### 綜合結論
系統處於 **Production-Ready** 狀態，適合用於專案展示、平台說明、驗收文件、教學與顧問導入、商務簡報與合作提案。

---

## 十、與現有 esggo 項目的關聯

此 Wiki 文獻記錄的是 ESGGO 平台的 **設計規範與功能定義**，是以下工作的參考藍圖：

1. **前端開發：** 所有頁面路由、元件設計、資料表結構均已定義
2. **AI 整合：** SPIRIT 人格、Gemini 2.0、Genkit 流程、RAG 知識倉庫
3. **可信機制：** 5T 協議、SHA-256、ZKP、審計日誌
4. **品牌設計：** Berkeley 設計系統、原子元件庫、Liquid Glass 哲學
5. **資料遷移：** Mock Data → Supabase PostgreSQL 的 1:1 映射路徑

> 這些文獻是 ESGGO 系統從概念到落地的完整設計記憶，任何後續開發都應以此為參照基準。
