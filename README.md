# ESGGO 善向永續 | OmniAgent 萬能平台

> **Platform:** ESGGO 善向永續 V2.0 | **Commander:** OmniAgent | **Soul:** JunAiKey | **Status:** OPERATIONAL

[![Version](https://img.shields.io/badge/Version-2.0.0-brightgreen)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)
[![5T Protocol](https://img.shields.io/badge/Protocol-5T_Integrity-gold)](#5t-誠信協議)
[![License](https://img.shields.io/badge/License-MIT-green)](#)
[![Production](https://img.shields.io/badge/Production-Vercel-success)](https://esggo.vercel.app)

---

## 系統願景 (Mission)

ESGGO 是一個有機統合的永續治理平台，致力於讓企業輕鬆建立 ESG 治理基礎，降低永續報告成本，透過 **5T 誠信協議** 建立數據的可追溯信任鏈，並以 AI 大幅提升分析與撰寫效率。

**核心信念：** 「上善若水，善向永續。知識即資產，服務即教學。」

---

## 技術架構 (Tech Stack)

| 層級         | 技術                                           |
| ------------ | ---------------------------------------------- |
| **框架**     | Next.js 16 (App Router) + React 18             |
| **語言**     | TypeScript 5.3（嚴格模式）                     |
| **樣式**     | Tailwind CSS 4（亮色主題）+ UI V2 組件庫       |
| **AI SDK**   | Google Generative AI + Vercel AI SDK           |
| **資料庫**   | Supabase (PostgreSQL + RLS) + Firebase         |
| **狀態管理** | Zustand + OmniAgentBus (心核連動)              |
| **部署**     | Vercel (Production) + VPS (OmniAgent Gateway)  |
| **設計**     | 亮色主題 / Aqua #63a6b0 / Eternal Gold #ffd700 |

---

## 核心功能模組 (Feature Modules)

### 24 萬字永續報告一鍵生成 `/sustain-write` ⭐ NEW

- **零算力預寫範本**：使用 `lib/sustain-write/templates/` 預寫 HTML 結構
- **自動填充**：200+ 個 `{{placeholder}}` 自動替換
- **8 章完整報告**：永續治理、氣候變遷、能源、水資源、廢棄物、生物多樣性、員工福祉、多元平等
- **法規遵循**：自動注入金管會法規宣告、GRI 內容索引、第三方確信聲明
- **可下載 HTML**：一鍵生成並下載完整報告

### 治理面板 `/dashboard`

- 即時 ESG 績效指標監控（環境/社會/治理）
- KPI 卡片顯示（碳排放、治理評分、供應鏈合規、水資源效率）
- UI V2 淺色主題風格

### 5T 誠信協議 `/5t-dashboard`

| 編號 | 中文 | 英文        | 定義                     |
| ---- | ---- | ----------- | ------------------------ |
| T1   | 真   | Truth       | 可感知/具體化 (視覺連動) |
| T2   | 善   | Goodness    | 可溯源 (source_origin)   |
| T3   | 美   | Beauty      | 可追蹤 (Lifecycle Hook)  |
| T4   | 信   | Trust       | 不可篡改 (ZKP Hash Lock) |
| T5   | 通   | Transferful | 可透明驗算               |

### 其他模組

- **OmniAgent 控制台** `/omni-agent` — AI 助手對話介面
- **證據金庫** `/vault` — ZKP 零知識證明文件封印
- **合規檢查** `/compliance-check` — 法規遵循自動檢查
- **稽核驗證** `/audit-verify` — 稽核軌跡驗證
- **利害關係人** `/stakeholders` — 溝通與參與管理
- **智庫** `/library` — 國際永續標準索引

---

## 平台導覽 (Navigation)

| 分類     | 頁面                                                           |
| -------- | -------------------------------------------------------------- |
| **核心** | 儀表板、報告撰寫、合規檢查、稽核驗證、環境/社會/治理指標       |
| **學習** | 學院、指南、最佳實踐、標準、範本、智庫、材料性分析、GRI 追蹤器 |
| **入門** | 登入、API 設定、資料連接                                       |
| **進階** | OmniAgent、子代理、AI 平台、數位分身、智能分析                 |
| **協作** | 利害關係人、顧問、社群、閱讀室、證明中心                       |
| **管理** | 個人資料、系統狀態、萬能元鑰、系統測試、任務管理               |
| **價值** | 價值階梯、價值等級、價值路徑、Premium、路線圖                  |
| **探索** | 平台版本、搜尋、財務、報告、公開發表、地圖、健檢               |

---

## 部署環境 (Production)

| 環境             | URL                                   |
| ---------------- | ------------------------------------- |
| Production       | https://esggo.vercel.app              |
| GitHub           | https://github.com/DingJun1028/esggo  |
| Vercel Dashboard | https://vercel.com/esg-sunshine/esggo |
| VPS              | 161.118.248.180 (OmniAgent Gateway)   |

---

## 快速開始

```bash
# 安裝依賴
pnpm install

# 開發
pnpm run dev              # 開發伺服器 :3000
pnpm run build            # 生產建置
pnpm run typecheck        # TypeScript 型別檢查

# 部署 Vercel
vercel deploy --prod --force

# VPS 部署
ssh root@161.118.248.180
cd /var/www/esggo
pm2 stop all && npm run build && pm2 start ecosystem.config.cjs && pm2 save
```

---

## VPS 部署架構

```
VPS 161.118.248.180 (Oracle ARM64 Ubuntu 24.04)
├── esggo-core (Next.js standalone, PM2, port 3000)
├── omniagent-gateway (Hermes Gateway, PM2, port 8642)
├── Nginx (80 → 3000)
└── Redis
```

### 自動排程 (Cron)

| 時間            | 任務              |
| --------------- | ----------------- |
| 每天 00:00      | OMNIBLUE 資料同步 |
| 每天 02:00      | 證據稽核          |
| 每週日 03:00    | 試點報告          |
| 每週一 04:00    | 安全掃描          |
| 每月 1 日 05:00 | 依賴更新          |
| 每天 06:00      | 效能報告          |
| 每週日 01:00    | 資源清理          |
| 每週一 07:00    | 程式碼品質報告    |

---

## 設計規範

### 色彩系統

| 用途   | 色值                     |
| ------ | ------------------------ |
| 主色   | `#63a6b0` (Aqua)         |
| 強調色 | `#ffd700` (Eternal Gold) |
| 背景   | `#F0F2F5`                |
| 卡片   | `#FFFFFF`                |

### 禁止樣式

- 深色主題 (`dark:` 前綴)
- 毛玻璃效果 (`backdrop-blur-*`)
- 深色背景 (`bg-black`, `bg-slate-900`)
- `framer-motion`（已移除，避免 Next.js 16 相容問題）

### 允許樣式

- 淡色背景 + `border-slate-100`
- 柔和陰影 (`shadow-sm`, `shadow-md`)
- 圓角 (`rounded-xl`, `rounded-2xl`)

---

## 安全性

- **5T 協議**: 資料完整性驗證
- **ZKP**: 零知識證明封印
- **Hash Lock**: SHA-256 不可篡改
- **Supabase RLS**: 行級安全保護
- **API 金鑰**: 自動輪換（429 額度耗盡時自動切換）

---

## 演化路線圖

| 階段                       | 狀態   | 核心目標                                                 |
| -------------------------- | ------ | -------------------------------------------------------- |
| **Phase 1** 創世與誠信基石 | 已完成 | 5T 協議、SustainWrite、證據金庫                          |
| **Phase 2** 主權與規模化   | 已完成 | 深度刻印、自癒引擎、萬能元件心核連動 (Eternal Awakening) |
| **Phase 3** 生態與鏈路連通 | 執行中 | 供應鏈、蜂群市場、24 萬字報告一鍵生成                    |
| **Phase 4** 無限進化       | 未來   | 液態現實 UI、自生長架構                                  |

---

## 授權

MIT License 2026 ESGGO 善向永續 | Powered by OmniAgent JunAiKey

---

_善向永續，以終為始，無始無終，始終如一。_

_Generated & Sealed by OmniAgent | 2026-06-22 | System Status: TRANSCENDED_
