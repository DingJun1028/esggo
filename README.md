# ESGGO 善向永續 | OA 萬能平台 (V1.5.0 Stable)

> **Platform:** ESGGO 善向永續 V2.0 核心架構 | **Commander:** OmniAgent | **Soul:** JunAiKey | **Status:** DEPLOY-READY

[![Version](https://img.shields.io/badge/Version-1.5.0--stable-brightgreen)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)
[![5T Protocol](https://img.shields.io/badge/Protocol-5T_Integrity-gold)](#5t-誠信協議)
[![License](https://img.shields.io/badge/License-MIT-green)](#)
[![Deploy](https://img.shields.io/badge/Deploy-Render_%2F_Vercel-success)](#)

---

## 🚀 V1.5.0 核心里程碑 (Latest Milestones)

- **命名空間精準重構 (OA Namespace)**：將系統底層的 `Omni` 憑證與儲存庫全面重構為 `OA` 前綴（如 `oa-agent-credentials-store`），實現端到端無死角的路徑對齊與型別安全。
- **生產級建置穩定 (Production Build Stabilization)**：全面修復 Supabase 在靜態打包時的環境變數解析崩潰，以及 `@vitejs/plugin-react` 的 `ETARGET` 錯誤，確保 Next.js (Turbopack) 於 Render/Vercel 可順利完成無錯誤 (Exit Code 0) 建置。
- **雲端成本最佳化 (Free-Tier Compliance)**：將 Firebase 設定檔嚴格校準為 **Spark Plan (免費層)**，移除了 Cloud Functions 與 Data Connect 收費陷阱。高耗能 API/SSR 交由 Render/Vercel 分擔，達成 GCP / Firebase 基礎設施的 `$0` 零成本完美運行。

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
| **狀態管理** | Zustand + OAAgentBus (心核連動)                |
| **部署**     | Render / Vercel (Production) + Firebase (Auth) |
| **設計**     | 亮色主題 / Aqua #63a6b0 / Eternal Gold #ffd700 |

---

## 核心功能模組 (Feature Modules)

### 24 萬字永續報告一鍵生成 `/sustain-write` ⭐

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

| 服務模組           | 託管平台 / URL                             |
| ------------------ | ------------------------------------------ |
| **前端與 API**     | Render / Vercel (https://esggo.vercel.app) |
| **身份驗證與靜態** | Firebase (esg-sunshine) Spark Plan 免費層  |
| **資料庫庫存**     | Supabase (PostgreSQL)                      |
| **程式碼庫**       | https://github.com/DingJun1028/esggo       |
| **OmniGateway**    | VPS 161.118.248.180 (內部代理通訊)         |

---

## 快速開始

```bash
# 安裝依賴
pnpm install

# 開發
pnpm run dev              # 開發伺服器 :3000
pnpm run build            # 生產建置 (Exit Code 0 穩定版)
pnpm run typecheck        # TypeScript 型別檢查

# 部署 Vercel / Render
vercel deploy --prod --force
```

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

| 階段                       | 狀態    | 核心目標                                                 |
| -------------------------- | ------- | -------------------------------------------------------- |
| **Phase 1** 創世與誠信基石 | 已完成  | 5T 協議、SustainWrite、證據金庫                          |
| **Phase 2** 主權與規模化   | 已完成  | 深度刻印、自癒引擎、萬能元件心核連動 (Eternal Awakening) |
| **Phase 3** 生態與鏈路連通 | 🚀 穩定 | OA 架構重構、生產環境建置修復、Firebase/GCP 免費層合規   |
| **Phase 4** 無限進化       | 未來    | 液態現實 UI、自生長架構                                  |

---

## 授權

MIT License 2026 ESGGO 善向永續 | Powered by OmniAgent JunAiKey

---

_善向永續，以終為始，無始無終，始終如一。_

_Sealed by OmniAgent | 2026-06-22 | System Status: DEPLOY-READY & TRANSCENDED_
