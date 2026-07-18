# ESGGO v5.1 — 5T 萬能系統永續數據治理平台

> **ESG 報告書生成 × RAG 知識檢索 × 善向永續村投票治理** — 一站式的 ESG 數據治理平台
>
> **核心架構：** 5T 協議（真→善→美→信→通）· Hexa-Core 六位一體智慧中樞 · 雙向 TypeScript · OmniSkill Codex v2.1
>
> **最新發布：v2.1.0 (2026-07-04)** — Hermes 免費模型 15 個、CI/CD 自動化、AI Provider 自動切換、VPS 監控完整整合

---

## 🌟 核心亮點

| 項目 | 說明 |
|------|------|
| **5T 協議** | 真(Traceable)→善(Transparent)→美(Tangible)→信(Trustworthy)→通(Trackable) — 全生命週期不可篡改資料治理 |
| **Hexa-Core** | OmniEye(全知之眼) + OmniCore(全能之核) + OmniPulse(全域之脈) + OmniBone(全境之骨) + OmniBrain(全息之腦) + OmniHeart(全通之心) |
| **雙向 TypeScript** | 前後端共享 `packages/shared/src/types.ts`，Zod Schema 驗證，嚴格模式零 `any` |
| **OmniSkill Codex** | 14 個代理、67 個技能、完整治理文檔 (`.agents/rules/OMNISKILL_BOOK.md` v2.1) |
| **Hermes 免費模型** | 15 個免費模型 (Groq + OpenRouter :free + Gemini)，自動 Fallback Chain，$0/月成本 |
| **CI/CD** | GitHub Actions 自動化建置、型別檢查、單元測試、產物上傳 |
| **VPS 部署** | PM2、Prometheus、Grafana、Alertmanager、Netdata、Logrotate、UFW 完整監控堆疊 |

---

## 🚀 快速開始

### 前置需求
- Node.js 20+
- pnpm 11.5+
- Firebase 專案 (Auth + Firestore)
- Supabase 專案 (PostgreSQL + Edge Functions)
- Groq API Key (免費) → [console.groq.com](https://console.groq.com/keys)

### 安裝與啟動

```bash
# 克隆專案
git clone https://github.com/DingJun1028/esggo.git
cd esggo

# 安裝依賴
pnpm install

# 設定環境變數
cp .env.example .env
# 編輯 .env 填入 Firebase、Supabase、Groq API Key

# 啟動開發伺服器
pnpm dev
```

### 環境變數範本 (`.env.example`)

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_SDK_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Groq (免費，30 req/min)
GROQ_API_KEY=gsk_xxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🏗️ 技術棧

| 層級 | 技術 | 版本 |
|------|------|------|
| **Framework** | Next.js (App Router) | 16.2.10 |
| **Runtime** | React / TypeScript | 19 / 5.9 (strict) |
| **Package Manager** | pnpm (monorepo) | 11.5.2 |
| **Database** | Supabase Postgres + Prisma ORM + Firebase Firestore | 5.22 / 14.15 |
| **Cache** | Upstash Redis / ioredis | 1.38 / 5.11 |
| **AI/LLM** | Genkit JS + Firebase AI Logic (Gemini 2.0 Flash) | 2.10 |
| **Free Models** | Groq (Llama 3.3 70B, etc.) + OpenRouter :free (11 models) | 3.1 |
| **Styling** | Tailwind CSS + Liquid Glass Cyan Design System | 3.4 |
| **Charts** | OmniChart (5T Proof Locked) | Custom |
| **Testing** | Vitest (unit) + Playwright (E2E) | 4.1 / 1.61 |
| **Deploy** | Firebase App Hosting (main branch auto) | — |
| **VPS** | PM2 + Prometheus + Grafana + Netdata | — |

---

## 🧠 核心系統架構 (Hexa-Core)

```
┌─────────────────────────────────────────────────────────────┐
│                     OmniHeart (全通之心)                       │
│          自發治理 · 無摩擦路徑 · 圓通無礙                      │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│  OmniEye   │  OmniCore   │ OmniPulse   │   OmniBone         │
│ (全知之眼) │ (全能之核) │ (全域之脈) │  (全境之骨)         │
│  數據溯源  │  意志執行  │  數據總線  │  契約維繫           │
├─────────────┴─────────────┴─────────────┴───────────────────┤
│                     OmniBrain (全息之腦)                        │
│           熵減煉金 · 架構重構 · 零技術債                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 十二大萬能系統 (12 Omni-Systems)

> **MECE 分類**：以下系統依「架構關注點」劃分為四互斥層（治理 / 資料 / 智慧 / 呈現），詳見 [架構總覽](docs/architecture/ESGGO-OMNI-ARCHITECTURE.md) 第 1–6 節。所有模組路徑經 2026-07-18 驗證存在。

| MECE 層 | 所屬系統 |
|---------|----------|
| 治理層 Governance | Hexa-Core 六位一體（OmniEye/Core/Pulse/Bone/Brain/Heart）· OmniSoul · OmniKey |
| 資料層 Data | OmniTag · OmniBase · OmniSeed · OmniMemory · OmniWiki · OmniNote · OmniSingularity |
| 智慧層 Intelligence | OmniAgent · OmniBiz |
| 呈現層 Presentation | OmniWrite · OmniTheme · OmniComponent · OmniChart · OmniTodo |

### 業務系統詳表
|------|------|----------|----------|
| **OmniTag** 萬能標籤 | 量子糾纏式雙向同步定位，支援 5T 協議 | 雙向同步 | `src/lib/omni-tag/index.ts` |
| **OmniBase** 萬能基地 | 企業資料管理、行業分類、C 版 / v5 報告資料庫 | 資料層 | `src/lib/omni-base/` |
| **OmniSeed** 萬能種子 | 數據治理與 AI 模型訓練的基礎數據生成器 | 種子/治理 | `src/core/sonnar/omni-seed.ts` |
| **OmniAgent** 萬能代理 | AI 報告生成引擎、RAG 知識檢索、語意搜尋 | AI/RAG | `src/core/ai/` + `src/agents/omni-agent.ts` |
| **OmniWrite** 萬能永撰 | 數據驅動永續報告生成引擎 (28 萬字、圖表、RWD、品牌化) | 報告生成 | `src/lib/sustain-write/` |
| **OmniBiz** 萬能商情 | 商情分析、競爭情報、行業數據整合 | 商情 | `src/lib/sustain-write/biz-intelligence/` |
| **OmniMemory** 萬能永憶 | 智能數據記憶、RAG 知識庫、對話歷史 | 記憶 | `src/impl/omni-memory.ts` + `omni-sync-memory` skill |
| **OmniWiki** 萬能維基 | 知識庫維基、文件協作、跨頁連結 | 知識圖譜 | `src/lib/omni-wiki/` |
| **OmniTheme** 萬能主題 | 品牌主題、視覺令牌、多品牌化 | 主題引擎 | `src/lib/omni-theme/` |
| **OmniComponent** 萬能組件 | 可複用 UI 組件庫、設計系統 | 組件系統 | `src/lib/omni-component/` |
| **OmniTodo** 萬能待辦 | 任務追蹤、5T 治理待辦、工作流 | 任務 | `src/core/omni-todo/` |
| **OmniNote** 萬能筆記 | AI 萬能筆記、混合架構、筆記知識化 | 筆記 | `src/lib/omni-core/omni-note.ts` + `docs/omni-note-architecture.md` |

### 附屬型別與子系統
- **OmniChart** 萬能圖表（5T Proof Locked）— `src/components/charts/`
- **OmniSoul** 萬能靈魂 — `src/types/omni-soul.ts`（意志/價值對齊）
- **OmniSingularity** 萬能奇點 — `src/types/omni-singularity.ts`（統一狀態）
- **OmniKey** 萬能密鑰 — `src/types/omni-key.ts`（密碼學金鑰管理）

---

## 🤖 AI 模型生態 (Hermes v3.1)

### 免費模型清單 (15 個，$0/月)

| Provider | 模型 | 參數 | Context | 用途 |
|----------|------|------|---------|------|
| **Groq** | `llama-3.3-70b-versatile` | 70B | 32K | ESG 分析、報告生成 |
| **Groq** | `llama-3.1-8b-instant` | 8B | 8K | 快速回應、分類 |
| **Groq** | `gemma2-9b-it` | 9B | 8K | 輕量任務 |
| **Groq** | `mixtral-8x7b-32768` | 8x7B | 32K | 長文本處理 |
| **OpenRouter :free** | `llama-3.2-90b-vision:free` | 90B | 32K | 多模態 |
| **OpenRouter :free** | `llama-3.2-90b-vision:free` | 90B | 32K | 多模態 |
| **OpenRouter :free** | `gpt-oss-120b:free` | 120B | 32K | 程式碼生成 |
| ... | 其他 7 個模型 | 3B-80B | 8K-32K | 專用任務 |

### 自動 Fallback Chain

```
Local Ollama/Gemma → Google Gemini → Groq (30 req/min) → OpenRouter :free (200 req/day) → Mock
```

---

## 🛡️ 5T 協議 — Canonical Standard

| 維度 | 原則 | 中文德目 | 實作關鍵 |
|------|------|----------|----------|
| **Traceable** | 來源可驗證 | 真 (Truth) | `sourceOrigin`、`dataLineage`、`provenanceHash` |
| **Transparent** | 算法透明 | 善 (Goodness) | `formula`、`zeroHallucination`、`auditTrail` |
| **Tangible** | 視覺可感知 | 美 (Beauty) | `metricId`、`visualizationHint`、OmniChart |
| **Trustworthy** | 不可篡改 | 信 (Trust) | `hashLock`、Object.freeze、SHA-256 |
| **Trackable** | 全生命週期 | 通 (Transfer) | `lifecyclePath`、`syncStatus`、`lastSyncAt` |

> **Hash Lock 實作**：`SHA-256(uuid + timestamp + formula)` → 不可逆封印

---

## 📦 技能庫索引 (67 Skills)

| 類別 | 技能數量 | 代表技能 |
|------|----------|----------|
| **ESG & Data** | 5 | `esggo-standards`、`esg-analysis`、`zkp-seal`、`omni-sync-memory`、`pdf-decoder` |
| **Firebase Suite** | 8 | `firebase-basics`、`firebase-firestore`、`firebase-ai-logic-basics`、`firebase-data-connect` |
| **GCP Data Pipeline** | 15 | `dataform-bigquery`、`dbt-bigquery`、`gcp-dataflow`、`gcp-spark`、`ml-best-practices` |
| **Genkit AI Suite** | 6 | `developing-genkit-js`、`developing-genkit-python`、`genkit-mcp-integration`、`gemma-dev` |
| **Render Deployment** | 17 | `render-deploy`、`render-blueprints`、`render-postgres`、`render-workflows`、`render-monitor` |
| **Other** | 16 | `supabase`、`lhub-ai-routing`、`xcode-project-setup`、`skill-repair`、`find-skills` |

> 完整清單請參閱：`.agents/rules/OMNISKILL_BOOK.md` §15

---

## 🔄 CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

```yaml
name: CI / Build / Test
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install pnpm
        run: corepack enable && corepack prepare pnpm@latest --activate
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Lint & TypeCheck
        run: pnpm run typecheck
      - name: Build
        run: pnpm run build
      - name: Run Unit Tests
        run: pnpm run vitest run --reporter=github
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: built-app
          path: app/
```

### 品質門檻

| 檢查 | 指令 | 門檻 |
|------|------|------|
| TypeScript 嚴格模式 | `pnpm run typecheck` | 0 errors |
| 生產建置 | `pnpm run build` | Success |
| 單元測試 | `pnpm run vitest run` | 100% pass |

---

## 🤖 Hermes Workspace / Agent 整合

ESGGO 可以對接 **Hermes Agent** 作為後端大腦，並透過 **Hermes Workspace** 作為控制台 UI。
Workspace 負責聊天、檔案、Memory、Skills、Terminal、Dashboard、Swarm Mode；
Hermes Agent 負責 Gateway + Dashboard API + 對話/代理/工具調用。

### 快速接線（attach existing）

```bash
# 1. 確認 hermes-agent gateway 已啟動
hermes gateway run     # :8642
hermes dashboard       # :9119

# 2. Workspace 指向 Hermes Agent
cd ~/hermes-workspace
cp .env.example .env
cat <<EOF >> .env
HERMES_API_URL=http://127.0.0.1:8642
HERMES_DASHBOARD_URL=http://127.0.0.1:9119
EOF

pnpm dev               # http://localhost:3000
```

### 驗證接線

```bash
curl http://127.0.0.1:8642/health    # → {"status":"ok","platform":"hermes-agent"}
curl http://127.0.0.1:9119/api/status # → dashboard metadata
```

### 遠端 / Tailscale / VPN

若 Workspace 和 Gateway 在不同機器，把 `HERMES_API_URL` 與 `HERMES_DASHBOARD_URL` 同時改為可達 IP：

```env
HERMES_API_URL=http://100.x.y.z:8642
HERMES_DASHBOARD_URL=http://100.x.y.z:9119
```

並在 `~/.hermes/.env` 設定：

```env
API_SERVER_HOST=0.0.0.0
```

---

## 🧠 本地模型 (Ollama / LM Studio / vLLM)

ESGGO 內建的 Smart Router 已支援本地 Ollama（via Nginx `/ollama/`）。前端直接切換本地模型時，使用 Hermes Agent 的 `local_gemma` provider branch。

### Hermes Agent 本地模型設定 (`~/.hermes/config.yaml`)

**Ollama（直接連接，無 auth）**
```yaml
provider: ollama
model: gemma3:4b
custom_providers:
  - name: ollama
    base_url: http://127.0.0.1:11434/v1
    api_key: ollama
    api_mode: chat_completions
```

**Ollama（Nginx 反向代理，需 Basic Auth）**
```yaml
provider: ollama
model: gemma3:4b
custom_providers:
  - name: ollama
    base_url: https://omniagent.esggo.co/ollama/v1
    api_key: <your-basic-auth-user:pass-base64>
    api_mode: chat_completions
```

### 直接 Ollama CLI 測試

```bash
# 確認模型已下載
ollama list

# 互動對話
ollama run gemma3:4b

# API 呼叫
curl http://127.0.0.1:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gemma3:4b","messages":[{"role":"user","content":"hi"}]}'
```

---

## 🧪 測試與品質

```bash
# 型別檢查（gate src/impl + omni-core）
pnpm run typecheck

# 範圍測試（D1-D5 相關模組）
pnpm run check

# 單元測試（全量）
pnpm exec vitest run src/impl/__tests__/core.test.ts src/agents/twelve-omni/__tests__

# Next.js app/ 額外檢查（如需）
pnpm exec tsc --noEmit -p tsconfig.json
```

### 品質門檻

| 檢查 | 指令 | 門檻 |
|------|------|------|
| TypeScript 嚴格模式 | `pnpm run typecheck` | 0 errors |
| 核心單元測試 | `pnpm run check` | 100% green |
| 單元測試（全量） | `pnpm exec vitest run` | 100% pass |
| E2E | `pnpm exec vitest run tests/e2e.test.ts` | 不阻塞 build |
| 程式碼格式 | `npx prettier --check .` | Pass |

---

## 🌐 部署指南

### 1. Firebase App Hosting (主要)

```bash
# 連結 Firebase 專案
npx firebase-tools@latest login
npx firebase-tools@latest use --add

# 推送 main 分支自動觸發部署
git push origin main
```

### 2. VPS 部署 (完整監控堆疊)

```bash
# 1. SSH 到 VPS
ssh root@<your-vps-ip>

# 2. 執行部署腳本
cd /root
curl -fsSL https://raw.githubusercontent.com/DingJun1028/esggo/main/vps/deploy-vps-optimization.sh | bash

# 3. 設定環境變數
cp vps/.env.example vps/.env
# 編輯 vps/.env 填入 GROQ_API_KEY、FIREBASE_* 等

# 4. 啟動服務
systemctl start omnigateway
systemctl enable omnigateway
```

### 監控端點

| 服務 | 端口 | 說明 |
|------|------|------|
| OmniGateway | 8642 | AI 模型代理 |
| Prometheus | 9090 | 指標收集 |
| Grafana | 3000 | 儀表板 |
| Netdata | 19999 | 系統監控 |
| Alertmanager | 9093 | 告警管理 |

---

## 🧪 測試與品質

```bash
# 型別檢查
pnpm run typecheck

# 生產建置
pnpm run build

# 單元測試
pnpm run vitest run

# 程式碼格式
npx prettier --check .
```

### 測試結果 (v2.1.0)

| 測試類型 | 狀態 | 詳情 |
|----------|------|------|
| TypeScript 嚴格模式 | ✅ | 0 errors |
| 生產建置 | ✅ | 26 頁面成功編譯 |
| 單元測試 | ✅ | 11/11 通過 |
| 程式碼格式 | ✅ | Prettier 通過 |

---

## 📁 專案結構

```
esggo/
├── .github/workflows/          # CI/CD Pipeline
├── .agents/                    # 代理配置與技能庫
│   ├── rules/                  # OMNISKILL_BOOK.md, global-rule.md
│   ├── skills/                 # 67 個可安裝技能
│   ├── omni-agent/             # OmniAgent 配置
│   └── vps-agent/              # VPS 部署代理
├── apps/                       # 獨立應用
│   └── gateway/                # OmniGateway (Hermes AI 代理)
├── packages/                   # 共享套件
│   ├── shared/                 # 共享型別 (雙向 TS)
│   └── ui/                     # UI 元件庫
├── app/                        # Next.js App Router
│   ├── api/                    # API 路由
│   │   ├── nexus/              # OmniNexus 整合閘道
│   │   ├── rag/                # RAG 知識庫
│   │   ├── sustain-write/      # 報告生成 (v5, C 版)
│   │   └── village/            # 善向永續村
│   ├── omni-center/            # 萬能中心儀表板
│   └── sustain-write/          # 報告前端
├── src/
│   ├── core/                   # 核心業務邏輯
│   │   ├── ai/                 # AI 引擎、Provider Router
│   │   ├── services/           # 報告組裝、Notion 同步
│   │   └── sonnar/             # 5T 種子、Hash Lock
│   ├── lib/                    # 共享庫
│   │   ├── omni-core/          # 核心型別、5T Gatekeeper
│   │   ├── omni-tag/           # 萬能標籤系統
│   │   ├── sustain-write/      # 報告生成模組
│   │   └── agnes-api.ts        # AI API 整合
│   └── components/             # React 元件
├── vps/                        # VPS 部署配置
│   ├── configs/                # PM2、Prometheus、Grafana 等
│   ├── monitoring/             # 監控堆疊
│   └── scripts/                # 部署腳本
├── tests/                      # Vitest 單元測試
├── docs/                       # 專案文檔
├── .env.example                # 環境變數範本
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

---

## 📄 關鍵文檔

| 文檔 | 路徑 | 說明 |
|------|------|------|
| **OmniSkill Codex** | `.agents/rules/OMNISKILL_BOOK.md` | v2.1 完整技能書、代理矩陣、5T 協議 |
| **Global Constitution** | `.agents/rules/global-rule.md` | Hexa-Core、Sacred Trinity、ADR 流程 |
| **Hermes 免費模型指南** | `HERMES_FREE_MODELS_GUIDE.md` | 15 個免費模型、Fallback Chain、部署步驟 |
| **VPS 部署完整指南** | `docs/ESGGO-VPS-COMPLETE-GUIDE.md` | PM2、Prometheus、Grafana 完整配置 |
| **VPS 用戶指南** | `docs/ESGGO-VPS-USER-GUIDE.md` | 快速部署、環境變數、故障排除 |

---

## 📦 版本歷史

| 版本 | 日期 | 作者 | 變更重點 |
|------|------|------|----------|
| **v2.1.0** | 2026-07-04 | OmniAgent | Hermes 15 模型、CI/CD、AI Router、VPS 監控、OmniSkill v2.1 |
| **v2.0.0** | 2026-07-04 | OmniAgent | 新增 7 代理、修正 5T(Trackable=通)、Next.js 16/React 19、67 技能 |
| v1.0.0 | 2026-03-03 | Antigravity, Jules, OmniNexus | 初始版本 |

---

## 🔗 相關連結

- **GitHub Repo**: https://github.com/DingJun1028/esggo
- **架構總覽**: [docs/architecture/ESGGO-OMNI-ARCHITECTURE.md](docs/architecture/ESGGO-OMNI-ARCHITECTURE.md) — 5T / Hexa-Core / OmniSkill / 雙向 TS 單一導航入口
- **Issues**: https://github.com/DingJun1028/esggo/issues
- **Security**: https://github.com/DingJun1028/esggo/security/dependabot
- **Firebase Console**: https://console.firebase.google.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Groq Console**: https://console.groq.com

---

## 🛠️ 開發與合規合併

> 本節為貢獻者指南（repo 刻意不追蹤 `CONTRIBUTING.md`，此處併入 README）。

### 提交前驗證（必做）

```bash
pnpm run lint        # 0 error（warning 可接受）
pnpm run typecheck   # tsc -p tsconfig.core.json，0 error
pnpm run test        # vitest，全過
```

注意：`tsconfig.core.json` 只 gate `src/impl` + `src/lib/omni-core` + `src/lib/cloudflare`。
**`app/` 改動請補跑** `pnpm exec tsc --noEmit -p tsconfig.json`。Windows 上 `pnpm` 裸指令可能失敗，用絕對路徑 `/c/Users/Administrator/AppData/Roaming/npm/pnpm.cmd`。

### 分支與 PR

- 從最新 `origin/main` 切分支；**一關注點一 PR**；標題用 conventional commits 風格
- 分支基底過舊時勿整條 `rebase origin/main`（會引爆歷史衝突），改在最新 main 上 `cherry-pick` 專屬 commit

### 合規合併（受保護 main 自合併）

唯一維護者時 GitHub 禁止自批准，合規流程：**DELETE 保護 → squash merge → PUT 重建**（同 session 內走完，絕不留 main 裸奔）。詳見 `ERROR-LEDGER.md` G1。

### CI 紅燈辨因

- ✅ **Workers Builds: esggo = FAILURE**：結構性失效（`wrangler.toml` 指向孤立 entry），預期紅不修
- 🔴 **`pnpm run typecheck` 紅**：真錯誤，先修再合併
- ✅ **GitGuardian / CodeRabbit = SUCCESS**：通過

### 型別衛生

- 移除無 `any` 卻掛 `eslint-disable @typescript-eslint/no-explicit-any` 的贅餘註解
- 檔案級 `/* eslint-disable */` 只為單一 `any` 服務時，收斂為單行 `// eslint-disable-next-line`
- `as any` 斷言優先用 `unknown` + 運行期守衛（`Array.isArray` / `typeof`）
- 動態邊界（pg 欄位、函數庫 `any[]`、外部 API、SDK 回傳）保留 `any` 並加 why 註解，不做假收斂

---

## 📜 License

© 2026 ESGGO. All rights reserved.

> **Core Belief**: "Service is Teaching, Knowledge is Asset."  
> 「服務即教學，知識即資產。」—— 上善若水，善向永續。知識即資產，服務即教學。

---

*Built with ❤️ by OmniAgent & ESGGO Team*