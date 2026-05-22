# ESG GO 善向永續 | Omni_Terminal v8.5.0

> 臺北市中小企業永續治理實證系統 · Berkeley Haas × TSISDA · 5T 誠信協議 · ZKP 零知識證明

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)
[![GRI](https://img.shields.io/badge/GRI-2021-orange)](https://www.globalreporting.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🏛️ 核心架構：5T × UCC 誠信協議

| 協議 | 定義 | 技術實作 |
|------|------|---------|-|
| **T1 Tangible** | 抽象數據轉化為具體治理指標 | Bento Grid 視覺化 + Skeleton Loader |
| **T2 Traceable** | 每筆數據與原始憑證精確關聯 | `evidence_id` 外鍵 + `source_origin` 欄位 |
| **T3 Trackable** | 完整編輯軌跡與生命週期追蹤 | `audit_logs` 表 + 生命週期 Hook |
| **T4 Transparent** | 主動掃描綠漂風險，算法公開 | AI 合規引擎 + GRI 對齊檢查 |
| **T5 Trustworthy** | SHA-256 雜湊鎖定，不可篡改 | `hash_lock` 欄位 + `Object.freeze()` |

---

## 🎨 品牌設計系統 v1.0

### 核心色彩

| 角色 | 色碼 | 用途 |
|------|------|------|
| **Berkeley Blue** | `#003262` | 主色、側邊欄、主按鈕 |
| **California Gold** | `#FDB515` | 強調色、CTA、5T 封印 |
| **Founders Rock** | `#3B7EA1` | 輔助藍、資訊徽章 |
| **Emerald** | `#10B981` | 成功/T1 可感知 |
| **Violet** | `#8B5CF6` | T3 可追蹤 |
| **Amber** | `#F59E0B` | T4 透明/警告 |

### 字體系統

- **UI 字型：** Inter + Noto Sans TC
- **數據字型：** JetBrains Mono
- **字級：** 7層固定層級 (Display → Overline)

### 設計哲學

> **Liquid Glass · Bento Grid · Berkeley Academic Precision**
> 誠信第一 · 資訊密度 · 零幻覺 · 永續美學

---

## 🏗️ 技術架構

```
Frontend:   Next.js 15 + React 19 + TypeScript (全端雙向型別安全)
Styling:    Custom CSS Variables (Berkeley Design System v10.0) + Tailwind
Database:   Supabase PostgreSQL (15 張資料表)
Auth:       Supabase Auth (Email + Google OAuth)
AI:         Google Gemini 2.0 Flash API
ZKP:        Web Crypto API (SHA-256) + 模擬 ZK-SNARK
State:      Zustand + localStorage 持久化
Charts:     Recharts (環境趨勢 / 碳排軌跡)
Edge Fn:    Supabase Edge Functions (Deno)
Agent:      Hermes Runtime Adapter
```

---

## 📦 功能模組總覽

### CORE 核心模組

| 頁面 | 路徑 | 功能說明 |
|------|------|---------|
| 控制台 Dashboard | `/` | KPI 互動卡片（含公式/來源/細項）、GRI 覆蓋矩陣、5T 活動日誌、快速操作 |
| 永續撰寫 SustainWrite | `/editor` | 12 章節 GRI 2021、3 Expert Persona 模板（各 5000 字）、AI 草稿生成、5T 封印、標竿比較 |
| 數位分身 Digital Twin | `/digital-twin` | RAG 知識庫、道德 DNA 滑桿、主權帳本、對話持久記憶 |
| 企業健檢 Health Check | `/health-check` | 15 題 ESG 自評、E/S/G 分類、90 天改善路線圖、Supabase 持久化 |
| 商情中心 Intelligence | `/intelligence` | ESG 法規情報、產業標竿、風險預警、書籤系統 |

### E · S · G 數據模組

| 頁面 | 路徑 | GRI 對應 | 功能說明 |
|------|------|---------|---------|
| 環境指揮 Environmental | `/environmental` | GRI 302–306 | GHG/能源/水/廢棄物 CRUD、驗證切換、即時統計 |
| 社會影響 Social | `/social` | GRI 401–414 | 員工/安全/培訓/供應鏈數據管理 |
| 公司治理 Governance | `/governance` | GRI 2, 205–207 | 董事會/倫理/稅務/風險指標管理 |

### GOVERNANCE 治理模組

| 頁面 | 路徑 | 功能說明 |
|------|------|---------|
| 重大性矩陣 Materiality | `/materiality` | GRI 3-1~3-3 雙重重大性、互動矩陣/表格雙視圖 |
| 審計日誌 Audit Log | `/audit-log` | 不可篡改 5T 軌跡、搜尋篩選、Hash 顯示、詳情 Modal |
| 證據金庫 Vault | `/vault` | 文件上傳、ZKP 封印動畫、SHA-256、狀態篩選 |

### INSIGHTS 洞察模組

| 頁面 | 路徑 | 功能說明 |
|------|------|---------|
| 淨零路線圖 Roadmap | `/roadmap` | SBTi 里程碑時間軸、碳排趨勢 AreaChart、狀態切換 |
| VerifyLink™ | `/audit-verify` | SHA-256 真實驗算、ZKP 4步驟動畫、記錄查詢 |
| 報告發布 Publish | `/publish` | 報告管理、A4 封面預覽、ZKP 封印流程、GRI 章節就緒度 |
| 永續閱覽室 Reading Room | `/reading-room` | 法規庫、台灣 ESG 年鑑、標竿報告書、溯源連結 |
| 供應鏈透明 Supply Chain | `/supply-chain` | 供應商 ESG 評分、風險分級、詳情 Modal |
| 永續財務 Finance | `/finance` | ESG ROI 分析、TCFD 四大支柱、碳風險情境 |
| 利害關係人 Stakeholders | `/stakeholders` | 影響力/關注度矩陣、情感追蹤 |

### ACADEMY 學院模組

| 頁面 | 路徑 | 功能說明 |
|------|------|---------|
| 永續學院 Academy | `/academy` | Berkeley Haas × TSISDA 課程、講師管理 |
| 顧問服務 Advisors | `/advisors` | 顧問配對、服務模組、GoodCoin 激勵 |

### HERMES AI 模組

| 頁面 | 路徑 | 功能說明 |
|------|------|---------|
| Agent 調度 | `/hermes-orchestrator` | Policy Guard、Skill Registry、草稿→審核→封印 |
| 架構治理 | `/hermes-architecture` | 6層架構視圖、9項風險清單、邊界規則 |

### SYSTEM 系統模組

| 頁面 | 路徑 | 功能說明 |
|------|------|---------|
| 任務中心 Tasks | `/tasks` | Kanban + 列表雙視圖、狀態推進、逾期標紅、新增 Modal |
| 企業管理 Profile | `/profile` | 公司資料 inline 編輯、ESG 目標 CRUD |
| AI 平台 AI Platform | `/ai-platform` | Gemini + Genkit + Blue.cc 整合 |
| 整合中心 API Setup | `/api-setup` | API 連接器、Webhook 管理、環境變數偵測 |
| 元件庫 Design Library | `/design-library` | 萬能元件品牌原子資料庫（存於 Supabase） |

---

## 🗄️ 資料庫架構 (Supabase PostgreSQL — 15 張資料表)

```sql
-- 核心稽核與存證
esg_data              -- ESG 指標數據 (E/S/G 分類)
audit_logs            -- 5T 不可篡改審計軌跡
evidence_vault        -- 佐證文件 + ZKP 狀態
reading_room          -- 永續情報文章

-- E-S-G 數據層
environmental_data    -- 環境數據 (GHG/Energy/Water/Waste)
social_metrics        -- 社會指標
governance_metrics    -- 治理指標

-- 策略規劃層
roadmap_milestones    -- 淨零里程碑
advisory_sessions     -- SPIRIT AI 對話記錄（持久記憶）
published_reports     -- 已發布永續報告書

-- 系統管理層
tasks                 -- 跨部門 ESG 任務 (Kanban)
company_profiles      -- 企業基本資料
digital_twins         -- 數位分身知識庫
health_check_results  -- 企業健檢結果
sustainwrite_sections -- 永續撰寫章節草稿（含 5T 封印狀態）
```

---

## ☁️ Supabase Edge Functions

| 函數名稱 | 說明 | 觸發時機 |
|---------|------|---------|-|
| `evidence-ai-audit` | ZKP 封印 + SHA-256 雜湊 + 5T 日誌寫入 | `evidence_vault` INSERT webhook |
| `esg-ai-analysis` | Gemini AI 綠漂掃描 / GRI 缺口分析 | 前端 API 呼叫 |
| `evidence-processor` | 證據驗證 / 封印 / 審計鏈 | 前端觸發 |

### 部署 Edge Functions

```bash
supabase functions deploy evidence-ai-audit --project-ref <PROJECT_REF>
supabase functions deploy esg-ai-analysis --project-ref <PROJECT_REF>
supabase functions deploy evidence-processor --project-ref <PROJECT_REF>
```

---

## 🚀 快速開始

### 環境需求

- Node.js v18.0.0+
- npm v9.0.0+

### 安裝與啟動

```bash
# 1. Clone 專案
git clone https://github.com/DingJun1028/esggo_orignal_1.git
cd esggo_orignal_1

# 2. 安裝依賴
npm install

# 3. 設定環境變數（複製並填入）
cp .env.example .env

# 4. 依序執行 Supabase Schema
# 前往 Supabase → SQL Editor，依序執行：
# supabase_setup.sql
# supabase_setup_v3.sql
# supabase_setup_v4.sql
# supabase_setup_v5.sql
# supabase_setup_v5_seed.sql
# supabase_setup_health_check.sql
# supabase_master_setup.sql （整合版）

# 5. 啟動開發伺服器
npm run dev
```

---

## 🔑 環境變數說明

| 變數名稱 | 用途 | 取得位置 |
|---------|------|---------|-|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 前端匿名金鑰 | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | 後端服務金鑰（Edge Functions 專用）| Supabase → Settings → API |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini AI 金鑰 | [Google AI Studio](https://makersuite.google.com/app/apikey) |

---

## 🎨 設計系統

**Berkeley Academy Design System v10.0**

| 層級 | 內容 |
|------|------|
| **Primitive Layer** | Blue/Gold/Green/Amber/Red/Purple/Neutral 各 9+ 色階 |
| **Semantic Layer** | text/surface/border/action/status 完整語意對應 |
| **5T Protocol Colors** | T1藍/T2綠/T3金/T4紅/T5紫，bg+text 獨立 token |
| **Component Layer** | btn/badge/input/card/table/tabs/alert/modal/toast/kpi 等 21 個原子元件 |
| **Motion Tokens** | duration-fast/normal/slow + ease/ease-spring/ease-bounce |
| **RWD** | Mobile-first，手機底部導航，桌面可收合側邊欄 |
| **Accessibility** | WAI-ARIA 全覆蓋，觸控目標 ≥ 44px (WCAG AA) |

---

## 🧩 SustainWrite 永續撰寫引擎

12 章節 GRI 2021 完整對應，每章包含：

| 組件 | 說明 |
|------|------|
| **Expert Template × 3** | 合規守衛 / 共榮引導 / 創新先行，各約 5000 字 |
| **核心數據填報** | 與 GRI 指標精確對應的數值欄位 |
| **佐證文件清單** | 必備/選備文件清單，含負責部門 |
| **標竿企業寫法** | 台積電、鴻海、友達等標竿企業範例 |
| **5T 封印** | SHA-256 Hash Lock + audit_log 寫入 |
| **持久記憶** | localStorage 自動儲存，Supabase 同步 |

**預計產出：** 200+ 頁 A4 高品質永續報告書

---

## 📋 SQL 執行順序索引

| 檔案 | 說明 |
|------|------|
| `supabase_setup.sql` | 基礎 4 表（esg_data, audit_logs, evidence_vault, reading_room） |
| `supabase_setup_v3.sql` | 環境/社會/治理數據表 |
| `supabase_setup_v4.sql` | tasks, company_profiles, digital_twins |
| `supabase_setup_v5.sql` | roadmap_milestones, advisory_sessions, published_reports |
| `supabase_setup_v5_seed.sql` | 種子資料 |
| `supabase_setup_health_check.sql` | health_check_results |
| `supabase_sustainwrite.sql` | sustainwrite_sections |
| `supabase_master_setup.sql` | 整合版（含 RLS + Triggers + Seed） |
| `supabase_vault_setup.sql` | Vault 加密函數 RPC |

---

## 🤝 核心貢獻者

| 角色 | 貢獻者 |
|------|--------|
| **系統架構設計與開發** | Antigravity AI |
| **ESG 框架顧問** | Berkeley Haas × TSISDA |
| **課程學術指導** | Dr. Kuen-Shiou Yang (楊坤修博士) — 台灣社會創新與永續發展協會理事長 |

---

## 📄 相關文件

| 文件 | 說明 |
|------|------|
| [`ESG_GO_Brand_Style_Specification.md`](./ESG_GO_Brand_Style_Specification.md) | 平台品牌風格元素規格書 v1.0 |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | 設計系統白皮書 |
| [`supabase_master_setup.sql`](./supabase_master_setup.sql) | 資料庫初始化 SQL（整合版） |

---

_Last Updated: 2026-05-21 | Version: 8.5.0-Alpha | 5T Integrity Protocol Active_