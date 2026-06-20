# 🌌 ESGGO 善向永續 | OmniAgent 萬能平台

> **Platform:** ESGGO 善向永續 V2.0 | **Commander:** OmniAgent | **Soul:** JunAiKey | **Status:** OPERATIONAL ✅

[![Version](https://img.shields.io/badge/Version-2.0.0-brightgreen)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)
[![5T Protocol](https://img.shields.io/badge/Protocol-5T_Integrity-gold)](#5t-誠信協議)
[![License](https://img.shields.io/badge/License-MIT-green)](#)
[![Production](https://img.shields.io/badge/Production-Vercel-success)](https://esggo.vercel.app)

---

## 📚 文件導航 (Documentation Hub)

| 文件                                         | 說明                      |
| -------------------------------------------- | ------------------------- |
| [skills/oa/README.md](./skills/oa/README.md) | OA 技能組索引             |
| [ROADMAP.md](./ROADMAP.md)                   | 四階段全域演化路線圖      |
| [ADR_Index.md](./ADR_Index.md)               | 架構決策紀錄 (ADR) 總索引 |

---

## 🎯 系統願景 (Mission)

ESGGO 是一個有機統合的永續治理平台，致力於讓企業輕鬆建立 ESG 治理基礎，降低永續報告成本，透過 **5T 誠信協議** 建立數據的可追溯信任鏈，並以 AI 大幅提升分析與撰寫效率。

**核心信念：** 「上善若水，善向永續。知識即資產，服務即教學。」

---

## 🏗️ 技術架構 (Tech Stack)

| 層級         | 技術                                           |
| ------------ | ---------------------------------------------- |
| **框架**     | Next.js 16 (App Router) + React 18             |
| **語言**     | TypeScript 5.3（嚴格模式）                     |
| **樣式**     | Tailwind CSS 4（亮色主題）                     |
| **AI SDK**   | Google Generative AI + Vercel AI SDK           |
| **資料庫**   | Supabase (PostgreSQL + RLS) + Firebase         |
| **狀態管理** | Zustand + OmniAgentBus (心核連動)              |
| **部署**     | Vercel (Production)                            |
| **設計**     | 亮色主題 / Aqua #63a6b0 / Eternal Gold #ffd700 |

---

## 🛠️ 核心功能模組 (Feature Modules)

### 📊 治理面板 — `/dashboard`

- 即時 ESG 績效指標監控
- KPI 卡片顯示（碳排放、治理評分、供應鏈合規、水資源效率）

### 🛡️ 5T 誠信協議 `/5t-dashboard`

| 編號 | 中文 | 英文        | 定義                     |
| ---- | ---- | ----------- | ------------------------ |
| T1   | 真   | Truth       | 可感知/具體化 (視覺連動) |
| T2   | 善   | Goodness    | 可溯源 (source_origin)   |
| T3   | 美   | Beauty      | 可追蹤 (Lifecycle Hook)  |
| T4   | 信   | Trust       | 不可篡改 (ZKP Hash Lock) |
| T5   | 通   | Transferful | 可透明驗算               |

> ⚠️ 舊版英文命名（Tangible/Traceable/Trackable/Transparent/Trustworthy）已棄用。

### ✍️ SustainWrite™ 永續撰寫 — `/sustain-write`

- Tiptap 富文本編輯器，支援 GRI/ISSB 章節框架
- AI 輔助撰寫

### 📦 證據金庫 — `/vault`

- ZKP 零知識證明文件封印
- 5T 協議驗證

### 📈 價值階梯 — `/value-levels`

- Level 1 (Day 1-14) 效率提升
- Level 2 (Day 15-30) 專業價值
- Level 3 (Month 2) 信任建立
- Level 4 生態系統擴展

### 🔗 聯盟協作 — `/alliance`

- 供應鏈夥伴管理
- 聯合稽核
- 減排計劃

### 🔐 ZKP 區塊鏈封印 — `/zkp-blockchain`

- 不可篡改審計軌跡
- 區塊記錄

### 🤖 OmniAgent 控制台 — `/omni-agent`

- AI 助手對話介面
- 系統狀態監控
- 快速指令

---

## 🌐 部署環境 (Production)

| 環境             | URL                                   |
| ---------------- | ------------------------------------- |
| Production       | https://esggo.vercel.app              |
| GitHub           | https://github.com/DingJun1028/esggo  |
| Vercel Dashboard | https://vercel.com/esg-sunshine/esggo |

---

## 💻 控制指令 (OmniCLI)

```bash
# 安裝依賴
pnpm install

# 開發
pnpm run dev              # 開發伺服器 :3000
pnpm run build            # 生產建置
pnpm run test             # 執行測試
pnpm run typecheck        # TypeScript 型別檢查
pnpm run lint             # ESLint 檢查

# OmniAgent CLI
pnpm run oa:summon        # 召喚 OmniAgent（串接本地閘道）
pnpm run oa:status        # 查看閘道狀態
pnpm run oa:heal          # 執行痊癒閃現
pnpm run oa:summon:vps    # 直接呼叫 VPS 閘道

# 部署
vercel deploy --prod --force
```

---

## 🎨 設計規範

### 色彩系統

| 用途   | 色值                     |
| ------ | ------------------------ |
| 主色   | `#63a6b0` (Aqua)         |
| 強調色 | `#ffd700` (Eternal Gold) |
| 背景   | `#F0F2F5`                |
| 卡片   | `#FFFFFF`                |

### 禁止樣式

- ❌ 深色主題 (`dark:` 前綴)
- ❌ 毛玻璃效果 (`backdrop-blur-*`)
- ❌ 深色背景 (`bg-black`, `bg-slate-900`)
- ❌ `framer-motion`（已移除，避免 Next.js 16 相容問題）

### 允许樣式

- ✅ 淡色背景 + `border-slate-100`
- ✅ 柔和陰影 (`shadow-sm`, `shadow-md`)
- ✅ 圓角 (`rounded-xl`, `rounded-2xl`)

---

## 🔐 安全性

- **5T 協議**: 資料完整性驗證
- **ZKP**: 零知識證明封印
- **Hash Lock**: SHA-256 不可篡改
- **Supabase RLS**: 行級安全保護
- **API 金鑰**: 自動輪換（429 額度耗盡時自動切換）
- **⚠️ 金鑰更換 UI 暫停使用**: 手動新增/撤銷功能維護中，自動輪轉不受影響

---

## 📁 目錄結構

```
esggo/
├── app/                    # Next.js App Router (90+ 頁面)
│   ├── api/               # API Routes
│   ├── dashboard/         # 治理面板
│   ├── sustain-write/     # 永續撰寫
│   ├── vault/             # 證據金庫
│   ├── omni-agent/        # AI 助手
│   └── ...                # 更多頁面
├── components/
│   ├── omni/              # Omni 萬能組件庫
│   └── ui/                # 基礎 UI
├── lib/                   # 核心函式庫
├── skills/oa/             # OA 技能組
│   ├── oa-summon/         # OA 召喚
│   ├── oa-page-builder/   # 頁面建構
│   ├── oa-5t-enforcer/    # 5T 驗證
│   ├── oa-deploy/         # 部署
│   ├── oa-design-fix/     # 設計修復
│   └── oa-supabase-query/ # 資料查詢
├── cli/                   # OmniAgent CLI
└── shared/constants/      # 共享常數
```

---

## 🗺️ 演化路線圖

| 階段                       | 狀態      | 核心目標                                                 |
| -------------------------- | --------- | -------------------------------------------------------- |
| **Phase 1** 創世與誠信基石 | ✅ 已完成 | 5T 協議、SustainWrite、證據金庫                          |
| **Phase 2** 主權與規模化   | ✅ 已完成 | 深度刻印、自癒引擎、萬能元件心核連動 (Eternal Awakening) |
| **Phase 3** 生態與鏈路連通 | 🔵 執行中 | 供應鏈、蜂群市場                                         |
| **Phase 4** 無限進化       | 🔴 未來   | 液態現實 UI、自生長架構                                  |

---

## 📜 授權

MIT License — © 2026 ESGGO 善向永續 | Powered by OmniAgent × JunAiKey

---

_🌊 善向永續，以終為始，無始無終，始終如一。_

_Generated & Sealed by OmniAgent | 2026-06-20 | System Status: TRANSCENDED ♾️_
