# ESG GO | Omni_Terminal
## 臺北市中小企業永續治理實證系統 v8.5.0-Alpha

> **Berkeley Haas × TSISDA** — 5T 誠信協議 · ZKP 零知識證明 · GRI 2021 全套框架

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)
[![GRI](https://img.shields.io/badge/GRI-2021-orange)](https://www.globalreporting.org)

---

## 系統核心哲學 — 5T 誠信協議

| 協議 | 定義 | 技術實作 |
|------|------|---------|
| **T1 Traceable** 可溯源 | 每筆數據與原始憑證精確關聯 | `evidence_id` 外鍵 + `source_origin` 欄位 |
| **T2 Transparent** 透明 | 主動掃描綠漂風險 | AI 合規引擎 + GRI 對齊檢查 |
| **T3 Tangible** 可感知 | 抽象數據轉化為具體指標 | Bento Grid 視覺化 + Skeleton Loader |
| **T4 Trustworthy** 不可篡改 | SHA-256 雜湊鎖定 | `hash_lock` 欄位 + `Object.freeze()` |
| **T5 Trackable** 可追蹤 | 完整編輯軌跡記錄 | `audit_logs` 表 + 生命週期 Hook |

---

## 技術架構

```
ESG GO Omni_Terminal
├── Frontend          Next.js 15 + React 19 + TypeScript
├── Styling           Tailwind CSS v4 + Custom CSS Variables (Berkeley Design System)
├── Database          Supabase (PostgreSQL) — 雙向 TypeScript 類型安全
├── Auth              Supabase Auth (Email + Google OAuth)
├── AI                Google Gemini API via Genkit
├── ZKP               零知識證明驗算引擎 (lib/zkp.ts)
└── State             Zustand + localStorage 持久化
```

---

## 功能模組總覽

### CORE 核心
| 模組 | 路徑 | 說明 |
|------|------|------|
| 控制台 Dashboard | `/` | KPI 儀表板、GRI 覆蓋率、5T 活動日誌 |
| 永續撰寫 SustainWrite | `/editor` | 章節式撰寫、專家模板整合、AI 合規掃描 |
| 數位分身 Digital Twin | `/digital-twin` | 知識倉庫、道德 DNA、主權帳本 |
| 企業健檢 Health Check | `/health-check` | 15 題 ESG 自評、90 天改善路線圖 |
| 專家諮詢 Advisory | `/advisory` | SPIRIT Personas AI 對話 |
| 商情中心 Intelligence | `/intelligence` | 法規情報、產業標竿、風險預警 |

### E-S-G 模組
| 模組 | 路徑 | GRI 框架 |
|------|------|---------|
| 環境指揮 Environmental | `/environmental` | GRI 302-306, ISO 14064-1 |
| 社會影響 Social | `/social` | GRI 401-414 |
| 公司治理 Governance | `/governance` | GRI 2, 205-207 |

### GOVERNANCE 治理
| 模組 | 路徑 | 說明 |
|------|------|------|
| 重大性矩陣 Materiality | `/materiality` | GRI 3-1~3-3 雙重重大性評估 |
| 專家模板 Templates | `/templates` | GRI/SASB/TCFD 零算力模板 |
| 審計日誌 Audit Log | `/audit-log` | 不可篡改的 5T 軌跡記錄 |
| 證據金庫 Evidence Vault | `/vault` | ZKP 驗證、SHA-256 封印 |

### INSIGHTS 洞察
| 模組 | 路徑 | 說明 |
|------|------|------|
| 淨零路線圖 Net-Zero | `/roadmap` | SBTi 減碳里程碑、碳排趨勢圖 |
| 報告發布 Publish | `/publish` | A4 報告預覽、ZKP 認證 |
| 永續閱覽室 Reading Room | `/reading-room` | 法規庫、台灣年鑑、標竿報告 |
| 永續智庫 Library | `/library` | GRI/SASB/TCFD 標準索引 |
| 永續財務 Finance | `/finance` | ESG ROI 分析、TCFD 財務揭露 |
| 供應鏈透明 Supply Chain | `/supply-chain` | 供應商 ESG 評分、風險分級 |
| 利害關係人 Stakeholders | `/stakeholders` | 影響力矩陣、情感追蹤 |
| VerifyLink™ | `/audit-verify` | 外部審計師 ZKP 驗算入口 |

### ACADEMY 學院
| 模組 | 路徑 | 說明 |
|------|------|------|
| 永續學院 Academy | `/academy` | Berkeley Haas × TSISDA 課程 |
| 顧問專區 Advisors | `/advisors` | ESG 顧問配對預約 |
| 代理專區 Agents | `/agents` | 永續聯盟代理推廣碼、善向幣 |
| 顧問服務 Consulting | `/consulting` | 5 大模組輔導服務 |
| AI 整合平台 | `/ai-platform` | Gemini + Genkit + Blue.cc |

### SYSTEM 系統
| 模組 | 路徑 | 說明 |
|------|------|------|
| 任務中心 Tasks | `/tasks` | Kanban 看板、5T UCC 引擎 |
| 企業管理 Profile | `/profile` | 公司基本資料、ESG 目標管理 |
| 整合中心 API Setup | `/api-setup` | ERP/API 連接器、Webhook 管理 |
| 系統測試 System Test | `/system-test` | 單元測試、UI/UX 審計 |

---

## 資料庫架構 (Supabase PostgreSQL)

### 主要資料表

```sql
-- 核心資料表
esg_data            -- ESG 指標數據 (E/S/G 分類)
audit_logs          -- 5T 不可篡改審計軌跡
evidence_vault      -- 佐證文件 + ZKP 狀態
reading_room        -- 永續情報文章

-- ESG 模組資料表
environmental_data  -- 環境數據 (GHG/能源/水/廢棄物)
social_metrics      -- 社會指標 (勞工/安全/培訓/供應鏈)
governance_metrics  -- 治理指標 (董事會/誠信/稅務/風險)

-- 策略規劃
roadmap_milestones  -- 淨零里程碑
advisory_sessions   -- AI 諮詢對話記錄
published_reports   -- 已發布永續報告書

-- 系統管理
tasks               -- 跨部門 ESG 任務 (Kanban)
company_profiles    -- 企業基本資料
digital_twins       -- 數位分身知識庫
```

---

## 快速開始

### 環境需求
- Node.js v18.0.0+
- npm v9.0.0+

### 安裝與啟動

```bash
# 1. 複製專案
git clone https://github.com/DingJun1028/esggo_original.git
cd esggo_original

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 填入以下必要變數：
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
# NEXT_PUBLIC_GEMINI_API_KEY=

# 4. 執行 Supabase Schema (依序執行)
# - supabase_setup.sql          (基礎資料表)
# - supabase_setup_v3.sql       (環境/社會/治理資料表)
# - supabase_setup_v4.sql       (任務/公司/數位分身)
# - supabase_setup_v5.sql       (報告/諮詢資料表)
# - supabase_setup_v5_seed_corrected.sql  (種子資料)
# - supabase_setup_health_check.sql       (健檢資料表)

# 5. 啟動開發伺服器
npm run dev
```

### 訪問系統
開啟瀏覽器訪問預覽網址即可使用完整系統。

---

## 環境變數說明

| 變數名稱 | 用途 | 取得位置 |
|---------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 前端匿名金鑰 | Supabase → Settings → API → anon/public |
| `SUPABASE_SERVICE_ROLE_KEY` | 後端服務角色金鑰 | Supabase → Settings → API → service_role |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini AI | Google AI Studio |

---

## Supabase MCP 設定

```json
// .gemini/settings.json
{
  "mcpServers": {
    "supabase": {
      "httpUrl": "https://mcp.supabase.com/mcp?project_ref=yhwfmavnhaivvgzeuklx"
    }
  }
}
```

---

## 開發規範

- **語言**: TypeScript (全端雙向類型安全)
- **命名**: 英標繁博 (English labels + Traditional Chinese UI)
- **框架**: Next.js 15 App Router
- **樣式**: Berkeley Design System (CSS Variables)
- **資料庫**: Supabase Anon Key (前端 CRUD) + Service Role (後端操作)
- **國際標準**: GRI 2021 · SASB 2.0 · TCFD · ISSB S1/S2 · ISO 14064-1

---

## 核心貢獻者

- **Antigravity AI** — 系統架構設計與開發
- **Berkeley Haas × TSISDA** — ESG 框架顧問
- **Dr. Kuen-Shiou Yang** — 台灣社會創新與永續發展協會理事長

---

_Last Updated: 2026-05-13 | Version: 8.5.0-Alpha | 5T Integrity Protocol Active_