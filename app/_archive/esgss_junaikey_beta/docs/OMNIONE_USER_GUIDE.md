# OmniOne 使用者操作指南 (OmniOne User Guide)

**版本**: v11.2.0-omni  
**更新日期**: 2026-02-19  
**系統**: ESGss JunAiKey InfoOne System

---

## 目錄

1. [系統概述](#1-系統概述)
2. [核心概念](#2-核心概念)
3. [功能架構](#3-功能架構)
4. [快速開始](#4-快速開始)
5. [日常操作](#5-日常操作)
6. [故障排除](#6-故障排除)

---

<a name="1-系統概述"></a>

## 1. 系統概述

### 1.1 什麼是 OmniOne？

**OmniOne**（萬能資訊一體）是 ESGss JunAiKey 生態系統的核心心臟，它將所有離散的服務聚合成一個無縫的、以使用者為中心的整體。

> **核心理念**: 「服務即教學，知識即資產」
>
> **系統口號**: InfoOne - All in One | One is One | All is One

### 1.2 系統願景

- **永續經營**: 將 ESG 知識轉化為可持續的數位資產
- **共創共贏**: 社交驅動的持續成長機制
- **無通自通**: 數據無礙流轉的全域共振

---

<a name="2-核心概念"></a>

## 2. 核心概念

### 2.1 術語定義表

| 術語                      | 定義                                                     | 類型      |
| ------------------------- | -------------------------------------------------------- | --------- |
| **OmniOne**               | 萬能資訊一體，系統核心心臟                               | 核心架構  |
| **InfoOne**               | OmniOne 的另一名稱，強調資訊一體化                       | 核心架構  |
| **OmniCircle** (奧秘圓通) | 編排引擎，串聯 Tag + Memory + Crystal 進入 5T 閉環       | 業務邏輯  |
| **OmniAgent** (奧秘代理)  | AI 代理程式，執行 5T 協議的封印與記錄                    | AI 執行層 |
| **OmniClaw** (奧秘爪)     | 社交團隊/社群單位，可綁定 OmniAgent                      | 社交功能  |
| **OpenClaw**              | 開源多管道 AI 閘道，支援 WhatsApp/Telegram/Discord/Slack | 訊息基礎  |
| **OmniESGcell**           | InfoOne 的 ESG 專用細胞單元                              | 細胞單元  |
| **Omnicell**              | OmniESGcell 的簡稱                                       | 細胞單元  |
| **OmniGennie** (奧秘精靈) | JunAiKey 的 AI 助手人格                                  | AI 人格   |

### 2.2 概念關係圖

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        OmniOne 生態系統架構                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐     │
│   │                      OmniOne / InfoOne                            │     │
│   │                    (萬能資訊一體 / 心核)                          │     │
│   └─────────────────────────────────────────────────────────────────┘     │
│                                    │                                       │
│          ┌────────────────────────┼────────────────────────┐             │
│          ▼                        ▼                        ▼              │
│   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐        │
│   │ OmniCircle  │        │ OmniAgent   │        │ OmniCell    │        │
│   │ 奧秘圓通    │        │ 奧秘代理    │        │ 細胞單元    │        │
│   │ 編排引擎    │        │ AI 執行層   │        │ ESG 專用    │        │
│   └─────────────┘        └─────────────┘        └─────────────┘        │
│          │                        │                        │              │
│          ▼                        ▼                        ▼              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                       OpenClaw Gateway                          │   │
│   │              (ws://localhost:19001 訊息閘道)                     │   │
│   │         WhatsApp / Telegram / Discord / Slack / Signal          │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 5T 協議

系統遵循 **5T 協議**（4可1不可）：

| 5T              | 中文       | 實現方式                                  |
| --------------- | ---------- | ----------------------------------------- |
| **Tangible**    | 可感知     | 透過 impactMetric 將抽象指標轉化為具體 UI |
| **Traceable**   | 可溯源     | 每筆資料必須有 source_origin 欄位         |
| **Trackable**   | 可追蹤     | 實作生命週期 Hook，記錄數據流轉路徑       |
| **Transparent** | 可透明驗算 | 公開公式，遵循 ISO 標準（如 ISO-14064-1） |
| **Trustworthy** | 不可篡改   | SHA-256 Hash Lock + Object.freeze()       |

---

<a name="3-功能架構"></a>

## 3. 功能架構

### 3.1 服務矩陣 (MECE 24 項)

| 類別         | 服務           | 狀態 |
| ------------ | -------------- | ---- |
| **環境永續** | 碳盤存管理     | ✅   |
|              | 綠色融資對接   | ✅   |
|              | 水資源管理     | ✅   |
| **社會責任** | 全人評測系統   | ✅   |
|              | 影響力地圖     | ✅   |
|              | 奧秘圓通社交   | ✅   |
| **公司治理** | 自動化報告生成 | ✅   |
|              | 不可篡改證據庫 | ✅   |
|              | 合規監控系統   | ✅   |

### 3.2 核心服務

| 服務名稱            | 功能描述           | 位置                                           |
| ------------------- | ------------------ | ---------------------------------------------- |
| **OmniCircle**      | 數據編排與 5T 閉環 | `src/core/OmniCircle.ts`                       |
| **OmniCircleMCP**   | MCP 協議介面       | `src/integrations/omnicircle/OmniCircleMCP.ts` |
| **OmniAgent**       | AI 代理執行        | `src/0-core/trinity/OmniAgent.ts`              |
| **InfoOneCore**     | 核心心臟           | `src/omni/core/InfoOneCore.ts`                 |
| **OpenClawGateway** | 訊息閘道           | `openclaw/`                                    |
| **EvidenceVault**   | 5T 證據庫          | `server/services/EvidenceVaultService.ts`      |

### 3.3 三大營運中心

系統包含三大核心營運中心：

#### 3.3.1 永續報告中心 (Sustainability Report Center)

| 功能           | 說明                                     |
| -------------- | ---------------------------------------- |
| 報告生成       | 支持 GRI、SASB、TCFD 等國際標準          |
| AI 分析        | 智能分析報告內容，提供改進建議           |
| 圖表庫         | 多功能圖表支援（漏斗圖、甘特圖、熱力圖） |
| 缺口分析       | 自動識別報告缺口                         |
| **Typst 排版** | **一鍵排版成書，支援 PDF/印刷品質輸出**  |

**Typst 高品質排版功能**：

- 紙張尺寸：A4 / A5 / Letter
- 裝訂方式：精裝 / 平裝 / 騎馬釘
- 語言：繁體中文 / English / 中英對照
- 自動目錄生成
- 專業書籍排版（書眉、頁碼、注釋）
- 印刷品質輸出（CMYK）

- **路由**: `/esg-report-center` → 選擇「Typst 排版」標籤
- **服務**: `SustainabilityReportService`, `TypstService`
- **位置**: `server/services/TypstService.ts`

#### 3.3.2 商業偵情中心 (Business Intelligence Center)

| 功能     | 說明                   |
| -------- | ---------------------- |
| 企業分析 | 深度企業分析與風險評估 |
| 市場情報 | 即時市場趨勢與競爭情報 |
| ESG 雷達 | ESG 風險掃描與預警     |
| 智能報告 | AI 驅動的商業洞察報告  |

- **路由**: `/esg-intelligence`
- **服務**: `BusinessIntelligenceService`
- **位置**: `src/1-service/BusinessIntelligenceService.ts`

#### 3.3.3 萬能圓通筆記 (OmniNotes)

| 功能     | 說明                          |
| -------- | ----------------------------- |
| 筆記管理 | 創建、編輯、刪除筆記          |
| 標籤系統 | 結合 OmniCircle 標籤管理      |
| 知識同步 | 與 OmniKnowledgeBase 雙向同步 |
| 5T 追蹤  | 所有筆記遵循 5T 協議          |

- **路由**: `/omni-notes`
- **Store**: `useNoteSystem`
- **位置**: `src/store/useNoteSystem.ts`

### 3.4 OmniBackend 統一資料庫

OmniBackend 是系統的中央資料庫，提供單一真相來源 (SSOT)。

| 功能                 | 說明                                             |
| -------------------- | ------------------------------------------------ |
| 主數據管理 (MDM)     | 跨平台 ESG 數據整合                              |
| **ESG 資料庫**       | 碳排放、能源、水資源、廢棄物、社會責任、公司治理 |
| **法規庫**           | GRI、TCFD、SASB、ISO、EU、TW、US 法規            |
| **RAG 零幻覺資料庫** | 檢索增強生成知識庫，確保 AI 輸出準確性           |
| 用戶成長資料庫       | RAG 驅動的用戶分析                               |
| 實時同步             | 與 OmniSpace 引擎雙向同步                        |
| 全域洞察             | 彙整後的全局數據分析                             |
| 數據權威化           | 確保數據一致性與可追溯性                         |

- **路由**: `/omni-backend`
- **服務**: `OmniDataCenterService`
- **位置**: `src/1-service/OmniDataCenterService.ts`

### 3.5 數據流架構

```
┌─────────────────────────────────────────────────────────────────┐
│                        OmniOne 心核                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐      │
│   │ 永續報告中心  │   │ 商業偵情中心 │   │ 萬能圓通筆記 │      │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘      │
│          │                   │                   │               │
│          └───────────────────┼───────────────────┘              │
│                              ▼                                    │
│   ┌────────────────────────────────────────────────────────┐   │
│   │                    OmniBackend (統一資料庫)               │   │
│   │            OmniDataCenterService / OmniSpace            │   │
│   │                 (SSOT 單一真相來源)                      │   │
│   └────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌────────────────────────────────────────────────────────┐   │
│   │               OmniCircle (編排引擎)                      │   │
│   │         Tag + Memory + Crystal → 5T 閉環                 │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

<a name="4-快速開始"></a>

## 4. 快速開始

### 4.1 環境要求

- Node.js 22+
- PostgreSQL 14+
- Redis 7+
- npm 或 pnpm

### 4.2 安裝步驟

```bash
# 1. 克隆專案
git clone https://github.com/your-repo/esgss_junaikey_beta.git
cd esgss_junaikey_beta

# 2. 安裝依賴
npm install

# 3. 設置環境變數
cp .env.example .env
# 編輯 .env 填入必要變數

# 4. 啟動資料庫
docker-compose up -d postgres redis

# 5. 啟動開發伺服器
npm run dev
```

### 4.3 啟動 OpenClaw Gateway（可選）

```bash
# 啟動 OmniClaw 訊息閘道
cd openclaw
node openclaw.mjs gateway run --bind 0.0.0.0 --port 19001
```

### 4.4 訪問系統

| 服務             | URL                   |
| ---------------- | --------------------- |
| 主系統           | http://localhost:3000 |
| API              | http://localhost:3001 |
| OpenClaw Gateway | ws://localhost:19001  |

---

<a name="5-日常操作"></a>

## 5. 日常操作

### 5.1 常用指令

```bash
# 開發
npm run dev              # 啟動 Vite + Express
npm run dev:ui           # 僅啟動 Vite
npm run dev:server       # 僅啟動 Express

# 測試
npm run test             # Vitest 單元測試
npm run test:e2e         # Playwright E2E 測試
npm run test:all         # 全部測試

# 程式碼品質
npm run lint             # ESLint 檢查
npm run lint:fix         # ESLint 自動修復
npm run type-check       # TypeScript 類型檢查
npm run format           # Prettier 格式化

# OpenClaw
npm run omni:start       # 啟動 OpenClaw Gateway
npm run omni:status      # 檢查狀態

# 資料庫
npm run db:migrate       # 資料庫遷移
npm run db:backup        # 備份資料庫
npm run restore          # 還原資料庫

# Docker
npm run dev:unified      # Docker Compose 開發環境
npm run prod:deploy      # 生產部署
```

### 5.2 創建 InfoOne 代理

```typescript
import { InfoOneCore } from './src/omni/core/InfoOneCore';

const agent = new InfoOneCore({
  name: 'MyFirstAgent',
  level: 1,
  archetype: 'SENTIENCE',
});

// 啟動代理
await agent.activate();

// 獲取 InfoOne 標識
console.log(agent.asInfoOne().uid);
```

### 5.3 使用 OmniCircle 編排

```typescript
import { omniCircle } from './src/core/OmniCircle';

const crystal = await omniCircle.orchestrateSentience({
  intent: 'Carbon Analysis',
  domain: 'ENVIRONMENT',
  narrative: '分析企業碳排放數據',
  resonance: 85,
  markers: ['ESG', 'CARBON', 'ANALYSIS'],
});
```

### 5.4 連接 OpenClaw Gateway

```javascript
// WebSocket 連接
const ws = new WebSocket('ws://localhost:19001/gateway/v1');

// 發送訊息
ws.send(
  JSON.stringify({
    type: 'chat',
    agentId: 'main',
    message: '你好，OmniOne',
  })
);

// 接收回應
ws.onmessage = event => {
  console.log(JSON.parse(event.data));
};
```

---

<a name="6-故障排除"></a>

## 6. 故障排除

### 6.1 常見問題

| 問題              | 解決方案                                 |
| ----------------- | ---------------------------------------- |
| 端口被佔用        | 執行 `lsof -i :3000` 查找程序並終止      |
| TypeScript 錯誤   | 執行 `npm run type-check` 查看詳細錯誤   |
| OpenClaw 連接失敗 | 確認 Gateway 已啟動 `npm run omni:start` |
| 資料庫連接失敗    | 檢查 `.env` 中的 `DATABASE_URL`          |
| Redis 連接失敗    | 確認 Redis 服務正在運行                  |

### 6.2 日誌位置

| 服務     | 日誌路徑            |
| -------- | ------------------- |
| 主系統   | `logs/`             |
| OpenClaw | `~/.openclaw/logs/` |
| Server   | `server/server.log` |

### 6.3 健康檢查

```bash
# 檢查系統健康狀態
curl http://localhost:3000/health

# 檢查 OpenClaw Gateway
curl -v ws://localhost:19001/gateway/v1/health

# 檢查 Docker 容器
docker ps
```

---

## 附錄

### A. 環境變數參考

```env
# 資料庫
DATABASE_URL=postgresql://user:pass@localhost:5432/esg_db

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# OpenClaw
OPENCLAW_URL=ws://localhost:19001
```

### B. 檔案結構

```
esgss_junaikey_beta/
├── src/                    # 前端 React 原始碼
│   ├── 0-core/            # 核心領域邏輯
│   ├── 1-service/         # 服務層
│   ├── components/        # React 元件
│   ├── pages/            # 頁面元件
│   ├── omni/             # Omni 核心模組
│   └── core/             # 系統核心
├── server/                # Express 後端伺服器
├── openclaw/             # OpenClaw 閘道服務
├── docs/                 # 系統文檔
├── scripts/              # 自動化腳本
└── tests/               # 測試檔案
```

---

**文檔維護**: 本指南由 ESGss JunAiKey 團隊維護  
**授權**: MIT License  
**聯繫**: 請通過系統內建的反饋渠道提交問題
