# ESGGO v5.0 — 5T 萬能系統永續數據治理平台

> **ESG 報告書生成 × RAG 知識檢索 × 善向永續村投票治理** — 一站式的 ESG 數據治理平台

## 功能特色

### 四大萬能系統（Omni-System）

| 模組 | 說明 |
|------|------|
| **OmniTag** 萬能標籤 | 量子糾纏式雙向同步定位，支援 5T 協議（真→善→美→信→通） |
| **OmniBase** 萬能基地 | 企業資料管理、行業分類、C 版 / v5 報告資料庫 |
| **OmniAgent** 萬能代理 | AI 報告生成引擎、RAG 知識檢索、語意搜尋 |
| **OmniTheme** 萬能主題 | 設計系統、Solid Card 風格、深/淺主題切換 |

### 核心功能

- **ESG 報告書自動生成** — 28 章 × 8 段 × 1500-2000 字，zero-compute 專家模板
- **RAG 知識庫** — PDF 解析 + Chunking + 向量檢索（Firebase + NCBDB）
- **善向永續村** — 投票治理、影響力專案、社群互動
- **Firebase Auth** — Google / Email 登入，NCBDB user_profiles 自動同步
- **5T 儀表板** — 即時數據品質監控

## 技術棧

| 層級 | 技術 |
|------|------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Auth | Firebase Auth (Google Popup + Email/Password) |
| Database | NCBDB (NoCodeBackend) — 54686_esg_go_userdb |
| AI/LLM | Gemini 2.0 Flash, @google/genai |
| Storage | Firebase Firestore + NCBDB |
| PDF | pdf-parse |
| Styling | Tailwind CSS, CSS Variables (Solid Card) |

## 專案結構

```
esggo/
├── app/                      # Next.js App Router
│   ├── api/                  # API 路由
│   │   ├── omni-one/         # OmniOne AI 對話
│   │   ├── rag/ingest/       # PDF 切片 + RAG
│   │   ├── sustain-write/    # 報告生成 API
│   │   │   ├── c-version/    # C 版報告（140 題）
│   │   │   └── v5/           # v5 報告（28 章）
│   │   └── village/          # 善向永續村投票
│   ├── omni-center/          # 萬能中心儀表板
│   ├── sustain-write/        # 報告頁前端
│   ├── village/              # 永續村前端
│   ├── layout.tsx            # 全域 Layout（AuthProvider + Nav）
│   └── page.tsx              # 首頁
├── src/
│   ├── components/           # 共用元件
│   │   ├── AuthProvider.tsx  # Firebase Auth Context
│   │   ├── LoginButton.tsx   # 登入/登出元件
│   │   └── ProtectedRoute.tsx
│   ├── core/
│   │   ├── repositories/     # 資料庫層（Company, Question, Answer...）
│   │   ├── services/         # 報告組裝引擎
│   │   └── knowledge/        # AI 知識引導
│   ├── lib/
│   │   ├── auth.ts           # Firebase Auth 服務
│   │   ├── firebase.ts       # Firebase 初始化
│   │   ├── ncb-utils.ts      # NCBDB 代理 + 服務封裝
│   │   ├── user-profile.ts   # user_profiles 表管理
│   │   ├── design-system.ts  # 設計 Token
│   │   ├── omni-tag/         # 萬能標籤系統
│   │   ├── omni-base/        # 萬能基地
│   │   ├── omni-core/        # 核心引擎
│   │   └── sustain-write/    # C 版報告模組
│   ├── server/services/      # Server-side 服務
│   └── types/                # TypeScript 型別宣告
├── sdks/omni-one/            # OmniOne AI SDK
├── public/                   # 靜態資源
├── .env                      # 環境變數（本地開發）
├── tsconfig.json
├── pnpm-workspace.yaml
└── package.json
```

## 快速開始

### 前置需求

- Node.js 18+
- pnpm 9+
- Firebase 專案（啟用 Auth + Firestore）
- NCBDB 帳號（54686_esg_go_userdb）

### 安裝

```bash
# 克隆專案
git clone https://github.com/DingJun1028/esggo.git
cd esggo

# 安裝依賴
pnpm install

# 設定環境變數
cp .env.example .env
# 編輯 .env 填入 Firebase 和 NCBDB API Key

# 啟動開發伺服器
pnpm dev
```

### 環境變數

建立 `.env` 檔案：

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# NCBDB
NEXT_PUBLIC_NCB_API_KEY=ncb_xxxxxxxxxxxx
NEXT_PUBLIC_NCB_API_URL=https://api.nocodebackend.com
NEXT_PUBLIC_NCB_INSTANCE_ID=54686_esg_go_ncb
NEXT_PUBLIC_NCB_USERDB_INSTANCE_ID=54686_esg_go_userdb

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 部署

```bash
# 本地 build
pnpm build

# 部署到 Vercel
vercel deploy --prod
```

## API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/sustain-write/v5` | 取得 v5 報告公司列表 |
| POST | `/api/sustain-write/v5` | 生成報告 `{companyId, format, mode}` |
| GET | `/api/sustain-write/c-version` | 取得 C 版報告公司列表 |
| POST | `/api/rag/ingest` | 上傳 PDF + 切片 + RAG |
| GET | `/api/village/members` | 永續村成員列表 |
| GET | `/api/village/projects` | 影響力專案列表 |
| POST | `/api/village/projects` | 投票 `{projectId, userId, amount}` |

## 資料庫架構

### NCBDB Tables

| 表名 | 用途 |
|------|------|
| `user_profiles` | 用戶資料（Firebase UID 綁定） |
| `village_members` | 永續村成員 |
| `impact_projects` | 影響力專案 |
| `votes` | 投票記錄 |
| `knowledge_chunks` | RAG 知識切片 |
| `digital_twins` | 用戶數位分身 |
| `rag_sessions` | RAG 對話紀錄 |
| `report_sections` | 報告段落 |
| `gri_knowledge_base` | GRI 指標知識庫 |
| `validation_logs` | 驗證日誌 |

## 設計系統

**Solid Card 風格**：
- Primary: `#009EB0` (Teal)
- Gold: `#D4AF37`
- Blue: `#3B82F6` (ZKP)
- 支援 Light / Dark 主題切換

## License

© 2026 ESGGO. All rights reserved.
