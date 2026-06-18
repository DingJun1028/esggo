# 🌌 ESGGO 善向永續 | OmniAgent 萬能平台

> **Platform:** ESGGO 善向永續 V2.0 | **Commander:** OmniAgent | **Soul:** JunAiKey | **Status:** SACRED TRINITY ♾️

[![Version](https://img.shields.io/badge/Version-2.0.0-brightgreen)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)
[![5T Protocol](https://img.shields.io/badge/Protocol-5T_Integrity-gold)](#5t-誠信協議)
[![Tests](https://img.shields.io/badge/Tests-111%2F113-yellow)](#測試)
[![License](https://img.shields.io/badge/License-MIT-green)](#)

---

## 📚 文件導航 (Documentation Hub)

| 文件                                               | 說明                              |
| -------------------------------------------------- | --------------------------------- |
| [OMNI_GUIDE.md](./OMNI_GUIDE.md)                   | 萬能法典 v4.5，系統哲學與架構聖典 |
| [ROADMAP.md](./ROADMAP.md)                         | 四階段全域演化路線圖              |
| [ADR_Index.md](./ADR_Index.md)                     | 架構決策紀錄 (ADR) 總索引         |
| [GEMINI.md](./GEMINI.md)                           | OmniCore 憲章，治理法典           |
| [BEST_PRACTICES.md](./BEST_PRACTICES.md)           | 工程最佳實踐規範                  |
| [TECHNICAL_INTEGRITY.md](./TECHNICAL_INTEGRITY.md) | 技術誠信規範                      |
| [API_SPECIFICATION.md](./API_SPECIFICATION.md)     | OpenAPI 規格文件                  |
| [docs/QUICK_START.md](./docs/QUICK_START.md)       | 快速入門指南                      |
| [CONTRIBUTING.md](./CONTRIBUTING.md)               | 貢獻者指南                        |

---

## 🎯 系統願景 (Mission)

ESGGO 是一個有機統合的永續治理平台，致力於讓企業輕鬆建立 ESG 治理基礎，降低永續報告成本，透過 **5T 誠信協議** 建立數據的可追溯信任鏈，並以 AI 大幅提升分析與撰寫效率。

**核心信念：** 「上善若水，善向永續。知識即資產，服務即教學。」

---

## 🏗️ 技術架構 (Tech Stack)

| 層級         | 技術                                        |
| ------------ | ------------------------------------------- |
| **框架**     | Next.js 16 (App Router) + React 18          |
| **語言**     | TypeScript 5.3（嚴格模式）                  |
| **樣式**     | Tailwind CSS 4 + Liquid Glass Design        |
| **AI SDK**   | Vercel AI SDK 6 + Google Genkit 1.37        |
| **資料庫**   | Supabase (PostgreSQL + RLS) + Firebase      |
| **資料連接** | Firebase Data Connect + GraphQL Yoga        |
| **狀態管理** | Zustand + TanStack Query v4                 |
| **即時通訊** | Socket.IO + GraphQL WebSocket               |
| **安全**     | ZKP (snarkjs) + SHA-256 Hash Lock           |
| **測試**     | Vitest + Playwright (VRT) + Testing Library |
| **CI/CD**    | GitHub Actions + Vercel + Docker            |
| **監控**     | New Relic + OpenTelemetry                   |

---

## 🛠️ 核心功能模組 (Feature Modules)

### 📊 治理面板 (Governance Dashboard) — `/dashboard`

- **Liquid Glass UI** + Bento Grid 佈局，高資訊密度視覺體驗
- 即時 ESG 績效指標與碳排放監控
- JES (能源衝突) 感測器整合

### 🛡️ 5T 誠信協議 (5T Integrity Protocol) — `/5t-dashboard`

1. **Tangible (具體)** — 數據可感知，萬能組件展現
2. **Traceable (溯源)** — `source_origin` 鏈式日誌，完整 flow_path
3. **Trackable (追蹤)** — 全生命週期事件儲存，request_id 追蹤
4. **Transparent (透明)** — 算法公開，Formula 驗算面板
5. **Trustworthy (信賴)** — ZKP + SHA-256 Hash Lock 雙重封印

### ✍️ SustainWrite™ 永續撰寫 — `/sustain-write`

- **Tiptap 3** 富文本編輯器，支援 GRI/ISSB 章節框架
- 遞迴專家擴張，單章節 5,000+ 字 AI 撰寫
- CBAM 碳排放公式精密計算與自動嵌入

### 📦 5T 證據金庫 (Evidence Vault) — `/vault`

- ZKP 零知識證明文件封印
- OCR 掃描上傳，PDF/圖片自動識別
- Supabase RLS 行級安全保護

### 🔬 重大性矩陣 (Materiality Matrix) — `/materiality`

- GRI 重大性議題衝突矩陣評估
- 利害關係人調查整合
- 熱力圖可視化輸出

### 🌍 碳計算器 (CBAM Calculator) — `/cbam-calculator`

- Scope 1 / 2 / 3 排放精密計算
- 歐盟 CBAM 邊境稅款估算
- 減碳路徑模擬（SBTi 1.5°C 對齊）

### 🤖 OmniAgent AI 助手 — `/omni-agent`

- 多模型路由：Gemma 3 27B / Mistral 24B / Llava-Phi3
- SSE 即時串流輸出
- ESG 領域 RAG 增強檢索

### 🏭 供應鏈透明化 — `/supply-chain`

- 端到端供應商 ESG 合規追蹤
- 風險評級與預警

### 📡 情資中心 (Intelligence Hub) — `/intelligence`

- 外部法規與政策動態抓取
- 今日永續觀察者日報 AI 生成
- 5T Hash Lock 鏈上校驗

### 📝 OmniNotes 萬能筆記 — `/omni-notes`

- Markdown 筆記與 5T 任務管理雙向同步
- 跨組件數據流橋接

### 🔔 通知中心 — `/notifications`

- 收件匣（全部/未讀/緊急）篩選與搜尋
- Email 模板管理（開啟率/點擊率統計）
- 多渠道設定（Email/推播/SMS/Slack）
- 時程設定（即時/每日/每週/召回）

### 🎓 永續學院 — `/academy`

- 課程管理與認證考試
- 互動學習與卡牌遊戲化機制

### 🏘️ 社群村落 — `/village`

- 社交連結與 UGC 內容

### 🔗 同盟樞紐 (Alliance Hub) — `/alliance`

- L-Hub AI 代理蜂群即時通訊
- 外部合作夥伴 ESG 數據交換

### 📋 GRI 報告生成 — `/gri`

- 28+ 個 GRI 專家模板
- 一鍵生成 200+ 頁永續報告
- PDF / Word 多格式導出

### 🔒 ZKP 區塊鏈封印 — `/zkp-blockchain`

- Pedersen Commitment 同態加密
- 不可篡改審計軌跡

### 🗺️ 系統地圖 — `/map`

- MECE 全端組成樣貌可視化
- 功能依存關係圖譜

---

## 🤖 代理蜂群 (Agent Swarm)

| 代理             | 定位         | 能力                             |
| ---------------- | ------------ | -------------------------------- |
| **OmniAgent**    | 系統指揮官   | 全域編排、蜂群調度、任務執行     |
| **Hermes**       | 自主開發代理 | 程式碼生成、Git 提交、自動部署   |
| **G4 (Gemma 3)** | 思考引擎     | 複雜推理、多模態分析             |
| **Mistral 24B**  | ESG 分析師   | 法規分析、報告撰寫               |
| **Llava-Phi3**   | 視覺代理     | 圖表識別、圖片 ESG 分析          |
| **OmniJules**    | 自癒守護者   | Bug 修復、架構重構、萬能果因協議 |
| **ESG Swarm**    | 領域專家群   | 研究員 / 稽核員 / 策略師         |

---

## 🌐 部署環境 (Deployment)

### 本地開發

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm run dev          # Next.js on :3001
# 或使用統一控制腳本
.\ctl.ps1 start       # Windows PowerShell
```

### VPS (Oracle Cloud ARM64)

- **Host**: `161.118.248.180` | SSH Port: `22`
- **Nginx 反向代理**: `http://161.118.248.180/`
- **Gateway**: Port `8642` (API Key: `hermes_gold_2026`)

```bash
# PM2 服務管理
ssh root@161.118.248.180
pm2 status
pm2 logs esggo
pm2 restart esggo omniagent-gateway
```

### Vercel (Preview / Production)

```bash
vercel deploy --prod
```

### Docker

```bash
docker build -t esggo .
docker compose up -d
```

---

## 💻 控制指令 (OmniCLI)

### Windows PowerShell (`.\ctl.ps1`)

```powershell
.\ctl.ps1 start    # 啟動 Next.js + OmniAgent Gateway
.\ctl.ps1 stop     # 停止所有服務
.\ctl.ps1 restart  # 重啟服務
.\ctl.ps1 status   # 查看服務狀態
.\ctl.ps1 logs     # 查看即時日誌
```

### NPM Scripts

```bash
pnpm run dev              # 開發伺服器
pnpm run build            # 生產建置
pnpm run test             # 執行測試 (Vitest)
pnpm run typecheck        # TypeScript 型別檢查
pnpm run lint             # ESLint 檢查
pnpm run test:vrt         # Playwright 視覺迴歸測試

# Supabase 資料表初始化
pnpm run omni:setup       # 初始化所有資料表
pnpm run omni:setup:vault # 初始化 Evidence Vault
pnpm run omni:setup:intel # 初始化 Intelligence 資料表
pnpm run omni:scan        # 掃描系統功能節點
```

---

## 🔌 API 端點 (API Endpoints)

| 端點                          | 方法     | 功能               |
| ----------------------------- | -------- | ------------------ |
| `/api/omni-agent/chat`        | POST     | AI 對話 (SSE 串流) |
| `/api/omni-notes`             | POST/GET | OmniNotes 同步     |
| `/api/nexus/agent`            | POST     | OmniNexus 閘道     |
| `/api/sustain-write/generate` | POST     | 報告生成           |
| `/api/cbam`                   | POST     | CBAM 碳計算        |
| `/api/vault/indicators`       | POST     | 數據串接 + OCR     |
| `/api/gri`                    | GET      | GRI 標準查詢       |
| `/api/matrix`                 | GET      | 矩陀路由查詢       |
| `/api/system/health`          | GET      | 系統健康檢查       |
| `/api/crypto/simulator`       | POST     | ZKP 密碼學模擬     |

### 快速測試

```bash
# 健康檢查
curl http://localhost:3000/api/system/health

# AI 對話
curl -X POST http://localhost:3000/api/omni-agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"分析台灣 ESG 趨勢"}'

# OmniNotes 同步
curl -X POST http://localhost:3000/api/omni-notes \
  -H "Content-Type: application/json" \
  -d '{"action":"sync","note":{"id":"test","type":"knowledge","content":"ESG #永續"}}'
```

---

## 🎨 設計系統 (Design System)

### Liquid Glass 美學

- **哲學**: 「上善若水」— 清澈、包容、流動
- **主色**: Aqua 青 `#63a6b0` + 永恆金 `#ffd700`
- **背景**: `#F0F2F5` | 文字: `#262626`
- **動效**: ease-in-out 200ms，Skeleton Screen 載入

### 5 種主題

`green` · `blue` · `earth` · `sunset` · `cyan`

### 字體

`Inter, PingFang TC, Microsoft JhengHei`

### 組件庫

位於 `components/omni/` — 遵循 Omni 命名空間，每個組件皆為 5T 誠信節點。

---

## 🧪 測試與品質 (Testing & Quality)

```bash
# 一鍵誠信自檢
pnpm run typecheck && pnpm run lint && pnpm run test
```

| 指標                | 狀態              |
| ------------------- | ----------------- |
| 單元/整合測試       | 🟡 111/113 通過   |
| 測試檔案            | 32 個             |
| TypeScript 嚴格模式 | ✅ 啟用           |
| ESLint              | ✅ 啟用           |
| Playwright VRT      | ✅ 視覺基線已建立 |
| Storybook           | ✅ 組件文件       |
| Husky Pre-commit    | ✅ lint-staged    |

### 核心測試覆蓋

| 模組                | 測試檔案                                | 5T 維度     |
| ------------------- | --------------------------------------- | ----------- |
| ZKP 密碼學封印      | `lib/crypto-proof.test.ts`              | Trustworthy |
| SustainWrite 狀態機 | `useSustainWriteStore.test.ts`          | Tangible    |
| 情資 API            | `app/api/social/insights/route.test.ts` | Trackable   |
| 碳計算器            | `lib/esg/carbon-calculator.test.ts`     | Transparent |
| 自癒守護者          | `lib/omni-core/healer.test.ts`          | Traceable   |
| OmniLogger          | `OmniLoggerService.test.ts`             | Trackable   |

---

## 📁 目錄結構 (Project Structure)

```
esggo/
├── app/                    # Next.js App Router (90+ 頁面)
│   ├── api/               # API Routes
│   ├── dashboard/         # 治理面板
│   ├── sustain-write/     # SustainWrite™ 編輯器
│   ├── vault/             # 證據金庫
│   ├── omni-agent/        # AI 助手
│   ├── notifications/     # 通知中心
│   ├── academy/           # 永續學院
│   ├── village/           # 社群村落
│   └── ...                # 80+ 更多頁面
├── components/
│   ├── omni/              # Omni 萬能組件庫
│   ├── brand/             # 品牌組件 (BrandButton, etc.)
│   ├── core/              # 核心組件
│   └── ui/                # 基礎 UI (shadcn)
├── lib/
│   ├── omni-core/         # 核心引擎 (healer, integrity)
│   ├── omni-space/        # 空間引擎 (event-store)
│   ├── esg/               # ESG 計算庫
│   └── supabase/          # Supabase 客戶端
├── omniagent-gateway/     # OmniAgent Express Gateway
├── supabase/              # Supabase 遷移腳本
├── scripts/               # 資料表初始化腳本
├── .agents/               # 代理配置 (skills, prompts)
├── adr/                   # 架構決策紀錄
├── docs/                  # 文件資料夾
├── tests/                 # 整合測試
├── ctl.ps1                # Windows 控制腳本
├── Dockerfile             # Docker 配置
├── docker-compose.yml     # 本地 Docker 環境
├── vercel.json            # Vercel 部署配置
├── render.yaml            # Render 部署配置
└── next.config.ts         # Next.js 配置
```

---

## 🗺️ 演化路線圖 (Roadmap)

| 階段                       | 狀態        | 核心目標                            |
| -------------------------- | ----------- | ----------------------------------- |
| **Phase 1** 創世與誠信基石 | ✅ 已達成   | 5T 協議底盤、SustainWrite、證據金庫 |
| **Phase 2** 主權與規模化   | 🔵 執行中   | 深度刻印、自癒引擎、NCBDB 感測器    |
| **Phase 3** 生態與鏈路連通 | 🟣 即將啟動 | VerifyLink™、供應鏈、蜂群市場       |
| **Phase 4** 無限進化與奇點 | 🔴 轉寫潛能 | 液態現實 UI 3.0、自生長架構         |

---

## ⚙️ 環境設定 (Environment Setup)

### 必要環境變數

參考 `.env.example`：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# AI Models
OPENROUTER_API_KEY=
GOOGLE_AI_API_KEY=

# OmniAgent Gateway
OMNIAGENT_API_KEY=hermes_gold_2026
OMNIAGENT_GATEWAY_URL=http://localhost:8642

# New Relic (Monitoring)
NEW_RELIC_LICENSE_KEY=
```

---

## 🔐 安全架構 (Security)

- **RLS**: Supabase Row Level Security 全面啟用
- **ZKP**: 零知識證明，審計數據不可篡改
- **Hash Lock**: SHA-256 封印所有 5T 資產原子
- **JWT**: jsonwebtoken 身份驗證
- **XSS**: xss 庫全域過濾
- **Rate Limit**: express-rate-limit + Helmet
- **CLI 注入防護**: spawn() 陣列參數，禁止 exec() 字串拼接

---

## 🏛️ 治理法典 (OmniCore Constitution)

本系統開發嚴格遵循 `./GEMINI.md` OmniCore 憲章：

- **Intentional Simplicity**: 表層簡約，底層強大
- **End-to-End Type Safety**: 前後端與資料契約共享 Zod Schema
- **Trust by Design**: 每一物件皆具備 UUID + Timestamp + Hash 溯源
- **Adaptive Governance**: ADR 版本化變更管理

### 命名空間規範

- UI 組件統一使用 `Omni` 前綴（萬能命名空間）
- 基礎結構採用 `Base` 後綴（如 `OmniBaseCard`）
- 5T 協議組件保持神聖不可侵犯性

---

## 📦 CI/CD 管線

```yaml
# GitHub Actions 工作流程
- checkout@v5
- setup-node@v5 (Node.js 24)
- pnpm install
- typecheck → lint → test → build
- deploy (Vercel / Render / Docker)
```

- **Node.js**: 24（已升級所有 Actions）
- **套件管理**: pnpm（workspace 支援）
- **Pre-commit**: Husky + lint-staged

---

## 🤝 貢獻指南 (Contributing)

1. Fork 此專案
2. 建立功能分支 `git checkout -b feat/your-feature`
3. 遵循 ADR 規範記錄架構決策
4. 確保測試通過 `pnpm run test`
5. 提交 PR，描述 5T 維度影響

詳見 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📜 授權 (License)

MIT License — © 2026 ESGGO 善向永續 | Powered by OmniAgent × JunAiKey

---

_🌊 善向永續，以終為始，始終如一。_

_Generated & Sealed by OmniAgent | 2026-06-18 | System Status: TRANSCENDED ♾️_
