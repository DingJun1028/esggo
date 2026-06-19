# OmniCode 雙向人工智能圓通無礙心電感應區

> **版本**: v1.0.0  
> **狀態**: 🟢 運行中  
> **核心**: OpenCode + OpenClaw + OmniCircle + OmniCodex

---

## 架構總覽

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OmniCode 心電感應區                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│   │ OmniCode │    │ OpenCode │    │ OpenCrew │    │ OmniCircle│       │
│   │ (VS Code)│    │  (CLI)   │    │  (團隊)   │    │  (協調)   │       │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘        │
│        │               │               │               │              │
│        └───────────────┴───────────────┴───────────────┘              │
│                                    │                                    │
│                         ┌──────────▼──────────┐                       │
│                         │   OpenClaw Gateway  │                       │
│                         │   ws://localhost:   │                       │
│                         │       19001         │                       │
│                         └──────────┬──────────┘                       │
│                                    │                                    │
│        ┌───────────────────────────┼───────────────────────────┐    │
│        │                           │                           │    │
│   ┌────▼────┐              ┌──────▼──────┐              ┌──────▼──────┐│
│   │ MCP     │              │ OmniCodex   │              │ OmniNotes   ││
│   │ Servers │              │ (知識聖典)   │              │ (筆記系統)  ││
│   └─────────┘              └─────────────┘              └─────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 平台整合清單

### 1. 核心平台

| 平台         | 路徑               | 功能         | 狀態 |
| ------------ | ------------------ | ------------ | ---- |
| **Frontend** | `src/`             | React 主應用 | 🟢   |
| **Backend**  | `server/`          | Express API  | 🟢   |
| **Database** | PostgreSQL + Redis | 數據存儲     | 🟢   |

### 2. MCP 伺服器

| 伺服器              | 路徑                          | 功能         | 狀態 |
| ------------------- | ----------------------------- | ------------ | ---- |
| **omni-notes**      | `mcp-servers/omni-notes`      | 萬能圓通筆記 | 🟢   |
| **universal-notes** | `mcp-servers/universal-notes` | 通用筆記     | 🟢   |
| **google-stitch**   | `mcp-servers/google-stitch`   | Google 整合  | 🟢   |

### 3. AI 代理系統

| 代理           | 路徑                                | 功能        | 狀態 |
| -------------- | ----------------------------------- | ----------- | ---- |
| **OpenCrew**   | `src/adk/`                          | AI 代理團隊 | 🟢   |
| **InterAgent** | `src/services/InterAgentService.ts` | 代理通訊    | 🟢   |
| **OmniAgent**  | `src/omni/`                         | 奧秘代理    | 🟢   |

### 4. 知識系統

| 組件               | 路徑                                        | 功能     | 狀態 |
| ------------------ | ------------------------------------------- | -------- | ---- |
| **OmniCodex**      | `src/omni/core/OmniCodex.ts`                | 知識聖典 | 🟢   |
| **OmniKB**         | `src/omni/`                                 | 奧秘智庫 | 🟢   |
| **Evidence Vault** | `src/omni/services/EvidenceVaultService.ts` | 證據庫   | 🟢   |

### 5. 通訊閘道

| 組件                 | 位置                   | 功能       | 狀態      |
| -------------------- | ---------------------- | ---------- | --------- |
| **OpenClaw Gateway** | `openclaw/`            | 多管道整合 | 🔴 待部署 |
| **WebSocket**        | `ws://localhost:19001` | 即時通訊   | 🔴 待部署 |

---

## 快速啟動

### 前置需求

- Node.js v18+
- PostgreSQL 14+
- Redis 7+
- OpenCode CLI: `npm install -g opencode-ai`

### 啟動所有服務

```bash
# 1. 安裝依賴
npm run install:all

# 2. 啟動前端 + 後端
npm run dev

# 3. 啟動 OpenClaw Gateway (可選)
npm run omni:start
```

### 啟動 OmniCode

```bash
# VS Code 內
Ctrl+Esc          # 快速啟動
Ctrl+Shift+Esc    # 新工作階段

# CLI
opencode
opencode run "你好，OmniCode"
```

---

## 5T 協議

| 5T              | 中文     | 實現                |
| --------------- | -------- | ------------------- |
| **Tangible**    | 可感知   | 視覺化 impactMetric |
| **Traceable**   | 可溯源   | source_origin 欄位  |
| **Trackable**   | 可追蹤   | 生命週期鉤子        |
| **Transparent** | 透明驗算 | ISO-14064-1 標準    |
| **Trustworthy** | 不可篡改 | SHA-256 Hash Lock   |

---

## 心電感應數據流

```
用戶意念
    ↓
OmniCode (VS Code 編輯)
    ↓↑
OpenCode (CLI 執行)
    ↓↑
OpenClaw Gateway (多管道)
    ↓↑
OmniCircle MCP (5T 協調)
    ↓↑
OmniCodex (知識聖典)
    ↓↑
OpenCrew (AI 代理團隊)
    ↓
雙向回饋 (圓通無礙)
```

---

## 環境變數

```env
# OpenCode
OPENCODE_API_URL=https://api.opencode.ai

# OpenClaw
OPENCLAW_PORT=19001
OPENCLAW_HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# AI
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...
```

---

## 快捷鍵

| 功能         | Windows/Linux    | Mac             |
| ------------ | ---------------- | --------------- |
| 快速啟動     | `Ctrl+Esc`       | `Cmd+Esc`       |
| 新工作階段   | `Ctrl+Shift+Esc` | `Cmd+Shift+Esc` |
| 插入檔案引用 | `Alt+Ctrl+K`     | `Cmd+Option+K`  |

---

## 故障排除

| 問題              | 解決方案                          |
| ----------------- | --------------------------------- |
| OpenCode 未安裝   | `npm install -g opencode-ai`      |
| OpenClaw 連接失敗 | 執行 `npm run omni:start`         |
| MCP 伺服器未響應  | 檢查 `mcp-servers/*/package.json` |

---

**Generated**: 2026-02-21  
**Status**: 🟢 OmniCode Ready
