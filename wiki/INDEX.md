# ESGGO Wiki — 系統知識庫

## 目錄

1. [系統概述](#系統概述)
2. [5T 誠信協議](#5t-誠信協議)
3. [頁面索引](#頁面索引)
4. [API 端點](#api-端點)
5. [OA 技能組](#oa-技能組)
6. [部署指南](#部署指南)
7. [故障排除](#故障排除)

---

## 系統概述

ESGGO 善向永續是一個企業級 ESG 治理平台，使用 Next.js 16 + TypeScript 5.3 構建，部署於 Vercel。

### 核心技術
- **前端**: Next.js 16 (App Router) + React 18 + Tailwind CSS 4
- **後端**: Supabase (PostgreSQL) + Firebase
- **AI**: Google Generative AI (Gemini)
- **部署**: Vercel Production
- **設計**: 亮色主題（Berkeley Blue #003262 + Gold #FDB515）

### 生產環境
- **URL**: https://esggo.vercel.app
- **GitHub**: https://github.com/DingJun1028/esggo

---

## 5T 誠信協議

5T 協議是 ESGGO 的核心資料治理框架，確保資料從產生到報告的完整信任鏈。

### 五維定義

| 編號 | 中文 | 英文 | 定義 | 驗證方式 |
|------|------|------|------|----------|
| T1 | 真 | Truth | 可感知/具體化 | 資料有明確數值、單位、時間戳 |
| T2 | 善 | Goodness | 可溯源 | 資料有來源標記 |
| T3 | 美 | Beauty | 可追蹤 | 資料有稽核軌跡 |
| T4 | 信 | Trust | 不可篡改 | 資料有 hash_lock |
| T5 | 通 | Transferful | 可透明驗算 | 資料可通過第三方驗證 |

> ⚠️ 舊版英文命名（Tangible/Traceable/Trackable/Transparent/Trustworthy）已棄用。

### 共享常數
- 檔案：`shared/constants/protocol.ts`
- 元件：`Protocol5TStrip` 顯示 5T 狀態

---

## 頁面索引

### 主要頁面

| 路徑 | 說明 |
|------|------|
| `/` | 首頁（系統入口） |
| `/login` | 登入頁面 |
| `/dashboard` | 治理面板 |
| `/5t-dashboard` | 5T 協議儀表板 |
| `/sustain-write` | 永續撰寫 |
| `/vault` | 證據金庫 |
| `/value-levels` | 價值階梯 |
| `/alliance` | 聯盟協作 |
| `/zkp-blockchain` | ZKP 區塊鏈封印 |
| `/omni-agent` | OmniAgent 控制台 |
| `/admin` | 系統管理 |

### 管理功能

| 路徑 | 說明 |
|------|------|
| `/admin` | 系統管理（用戶、角色、金鑰） |
| `/system-status` | 系統狀態 |
| `/system-test` | 系統測試 |

---

## API 端點

### 核心 API

| 端點 | 方法 | 功能 |
|------|------|------|
| `/api/agent` | POST | AI 代理執行 |
| `/api/omni-agent/chat` | POST | AI 對話 |
| `/api/vault/seal` | POST | 文件封印 |
| `/api/vault/verify` | POST | 驗證封印 |
| `/api/omni-core/[id]` | * | OmniCore 核心 |
| `/api/swarm/ws` | WS | 蜂群通訊 |

### 健康檢查
```bash
curl https://esggo.vercel.app/api/system/health
```

---

## OA 技能組

OA（OmniAgent）技能組位於 `skills/oa/` 目錄。

| 技能 | 觸發詞 | 用途 |
|------|--------|------|
| `oa-summon` | OA、召喚 | 系統啟動、狀態檢查 |
| `oa-page-builder` | 建置、建立頁面 | 根據設計規格建立頁面 |
| `oa-5t-enforcer` | 5T、驗證 | 5T 協議合規驗證 |
| `oa-deploy` | 部署、上線 | 一鍵部署到 Vercel |
| `oa-design-fix` | 顏色跑掉、看不到 | 修復亮色主題問題 |
| `oa-supabase-query` | 查詢、資料 | Supabase 資料查詢 |

### CLI 指令
```bash
npm run oa:summon          # 召喚 OmniAgent（輕量，真實探活 gateway）
npm run oa:summon:core     # 同上 + 實際初始化 OmniCore（--core，約 90s）
esggo status               # 查看系統/閘道健康（CLI 子命令，打 /api/health）
# 註：oa:heal 尚無對外指令；核心具 OmniHealing（seed-vault 修復）但未暴露 CLI/npm 入口
```

---

## 部署指南

### 前置需求
- Node.js 24+
- pnpm 11+

### 安裝
```bash
git clone https://github.com/DingJun1028/esggo.git
cd esggo
pnpm install
```

### 環境變數
複製 `.env.example` 並設定：
```bash
cp .env.example .env
# 編輯 .env 填入必要的 API 金鑰
```

### 本地開發
```bash
pnpm run dev
# http://localhost:3000
```

### 生產部署
```bash
# 建置
pnpm run build

# 部署到 Vercel
vercel deploy --prod --force
```

### 常用指令
```bash
pnpm run build            # 建置
pnpm run test             # 測試
pnpm run typecheck        # 型別檢查
pnpm run lint             # Lint 檢查
```

---

## 故障排除

### Build 失敗

#### framer-motion 錯誤
**症狀**: `Cannot read properties of undefined (reading 'div')`
**原因**: framer-motion 與 Next.js 16 + Turbopack 相容問題
**解決**: 已移除首頁的 framer-motion 依賴

#### pdf-parse 錯誤
**症狀**: `ERR_MODULE_NOT_FOUND: pdf-parse`
**原因**: pdf-parse ESM 相容問題
**解決**: 降級到 pdf-parse@1.1.1

#### ToastContainer 錯誤
**症狀**: `Element type is invalid: expected a string or class/function but got undefined`
**原因**: Tailwind class 拼錯（`shadow-lg -md`）
**解決**: 修復為 `shadow-lg`

### 運行時錯誤

#### 5T 治理保護機制觸發
**症狀**: 顯示「系統發生未預期錯誤」
**原因**: 未捕獲的 JavaScript 錯誤
**解決**: 檢查瀏覽器 Console 取得詳細錯誤訊息

### 金鑰相關

#### API 金鑰額度耗盡
**症狀**: 429 RESOURCE_EXHAUSTED
**解決**: GeminiRotator 會自動切換備用金鑰

#### 金鑰更換功能暫停
**說明**: 手動金鑰更換 UI 暫停使用，自動輪轉不受影響
**位置**: `/admin` → API 金鑰分頁

---

## 更新日誌

### 2026-06-19
- ✅ 首頁完全重作（移除 framer-motion）
- ✅ OmniKpiCard 亮色主題修復
- ✅ ToastContainer 修復
- ✅ 金鑰更換 UI 暫停使用
- ✅ OmniAgent CLI 串接閘道 API
- ✅ OA 技能組建立
- ✅ README 更新
- ✅ WIKI 建立
