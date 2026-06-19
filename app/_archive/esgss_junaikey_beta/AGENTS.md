# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build / Test / Lint Commands

### Development

```bash
npm run dev          # Start Vite + Express server concurrently
npm run dev:ui       # Start Vite only (port 3000)
npm run dev:server   # Start Express server only
npm run dev:all      # Same as npm run dev
```

### Building

```bash
npm run build        # Vite production build (with pre/post scripts)
npm run build:server # Build Express server
npm run build:all    # Build frontend + all subsystems
```

### Testing

```bash
npm run test         # Run Vitest unit tests
npm run test:ui      # Vitest with UI
npm run test:coverage# Vitest with coverage report
npm run test:e2e     # Playwright E2E tests
npm run test:e2e:ui  # Playwright E2E with UI
npm run test:all     # Run all tests (frontend + backend + api + shanxiang)
```

### Code Quality

```bash
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript type check (no emit)
npm run format       # Prettier format all files
npm run format:check # Check Prettier formatting
```

### Database & System

```bash
npm run db:migrate   # Run database migrations
npm run db:backup    # Backup database
npm run backup       # Backup database (alias)
npm run restore      # Restore database
npm run heal         # Run omni-healer script
```

### Docker & Deployment

```bash
npm run dev:unified           # Docker-compose development
npm run dev:unified:monitoring# Docker with monitoring
npm run prod:deploy           # Production deployment
npm run prod:stop             # Stop production
npm run system:health          # Health check
npm run system:logs            # View logs
npm run system:restart         # Restart system
```

### Utilities

```bash
npm run diary:view       # View latest dev diary
npm run diary:search     # Search dev diary
npm run diary:timeline   # Show diary timeline
npm run verify-all       # Run hardening verification
npm run archive          # Archive system
```

## Core Architecture: 5T Protocol (4可1不可)

All core components MUST implement `IComponentCore` interface with these 5T attributes:

| 5T              | Chinese    | Implementation                                                |
| --------------- | ---------- | ------------------------------------------------------------- |
| **Tangible**    | 可感知     | Convert abstract metrics to concrete UI with `impactMetric`   |
| **Traceable**   | 可溯源     | Every data MUST have `source_origin` field                    |
| **Trackable**   | 可追蹤     | Implement lifecycle hooks, record data flow paths             |
| **Transparent** | 可透明驗算 | Public formulas with ISO standards (e.g., [ISO-14064-1])      |
| **Trustworthy** | 不可篡改   | SHA-256 Hash Lock + `Object.freeze()` - NEVER use "Immutable" |

**4可1不可 State Machine**: 🟢🟢🟢🟢🔴 (4 Yes 1 No)

### Core Interface

- Core Interface: `src/0-domain/contracts/IComponentCore.ts`
- 5T Types: `src/types/core/index.ts`, `src/services/ceremony/types/T5TProtocol.ts`
- Evidence Map: `src/types/esgss_schema.ts`
- Server Routes: `server/routes/`
- Test Setup: `src/test/setup.ts`

## Critical Rules

1. **Hash Lock**: Use `TrustworthyLock` from `src/utils/TrustworthyLock.ts` for SHA-256 hashing
2. **Status Field**: Only `"Trustworthy"` is valid for sealed/locked state
3. **No "Immutable"**: Always use "不可篡改" or "Trustworthy" - the word "Immutable" is forbidden
4. **Evidence Required**: All data mutations must update the `evidence` field with 5T tracking
5. **TypeScript Strict**: All new code must pass `npm run type-check`
6. **Test Coverage**: New features require corresponding unit tests

## Code Style (Bilingual TypeScript)

- **Code**: English variable/function names (e.g., `calculateEfficiency`, `IComponentCore`)
- **Comments/Docs**: Traditional Chinese (繁體中文) for explanations
- **Communication**: All thinking, dialogue, and output MUST use Traditional Chinese

```typescript
/**
 * 計算熵減效率 (Entropy Reduction Efficiency)
 * @param input 原始輸入值
 * @returns 經過 5T 驗證後的淨值
 */
function calculateEfficiency(input: number): number { ... }
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile`, `DashboardPanel`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`, `useFetch`)
- **Utils**: PascalCase with purpose suffix (e.g., `DateUtils`, `ValidationUtils`)
- **Types/Interfaces**: PascalCase with descriptive suffix (e.g., `UserProfile`, `IComponentCore`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`, `API_BASE_URL`)
- **Files**: kebab-case (e.g., `user-profile.tsx`, `api-client.ts`)

## Testing Strategy

### Unit Tests (Vitest)

- Location: Same directory as source file with `.test.ts` suffix
- Naming: `{filename}.test.ts` or `{filename}.spec.ts`
- Run: `npm run test` or `npm run test:ui` for visual testing

### E2E Tests (Playwright)

- Location: `e2e/` directory
- Run: `npm run test:e2e` or `npm run test:e2e:ui`

### Test Best Practices

1. Use descriptive test names in Traditional Chinese
2. Follow AAA pattern: Arrange, Act, Assert
3. Mock external dependencies
4. Keep tests isolated and independent
5. Aim for meaningful coverage, not just quantity

## UI Design System

- **Primary Color**: `#D4AF37` (帝國金)
- **Background**: `#0B0C10` (深空黑)
- **Style**: Liquid Glass (液態玻璃) with glassmorphism effects
- **Animation**: Use `framer-motion` for transitions
- **Icons**: Use `lucide-react` consistently
- **Framework**: React 19 + TypeScript
- **State Management**: Zustand
- **Form Validation**: Zod + React Hook Form

## OmniClaw AI Operating System

OpenClaw 是本系統的核心 AI 操作系統，提供以下功能：

### 核心功能

- **多管道整合**: WhatsApp、Telegram、Discord、Slack、Signal 等
- **AI 代理**: main、coder、researcher 三種專門代理
- **工具調用**: 網頁搜索、代碼執行、文件處理、Shell 命令
- **記憶系統**: SQLite 長期記憶 + 對話上下文
- **MCP 服務**: OmniCrew、Omni-Knowledge、Omni-File

### 配置文件位置

- 主配置: `~/.openclaw/openclaw.json` (或 `openclaw/openclaw.json`)
- 環境變數: `openclaw/.env`
- 代理配置: 支援自定義 agents.list
- 擴展目錄: `openclaw/extensions/`

### 啟動方式

```bash
# 方式1: 使用 npm 指令
cd openclaw
node openclaw.mjs gateway run --bind 0.0.0.0 --port 19001

# 方式2: 使用環境變數
set OPENCLAW_SKIP_CHANNELS=1
cd openclaw && node scripts/run-node.mjs gateway
```

### 對話端點

- **WebSocket**: `ws://localhost:19001/gateway/v1`
- **HTTP API**: `http://localhost:19001/gateway/v1/chat`
- **健康檢查**: `ws://localhost:19001/gateway/v1/health`

### API 使用範例

```javascript
// WebSocket 連接
const ws = new WebSocket('ws://localhost:19001/gateway/v1');

// 發送訊息
ws.send(
  JSON.stringify({
    type: 'chat',
    agentId: 'main',
    message: '你好，OmniCore AI',
  })
);
```

### 狀態檢查

```bash
# 檢查 Gateway 狀態
curl -v ws://localhost:19001/gateway/v1/health
```

## OmniOne 生態系統術語

### 術語定義

| 術語                       | 定義                                               |
| -------------------------- | -------------------------------------------------- |
| **OmniOne / InfoOne**      | 萬能資訊一體，系統核心心臟                         |
| **OmniCircle** (奧秘圓通)  | 編排引擎，串聯 Tag + Memory + Crystal 進入 5T 閉環 |
| **OmniAgent** (奧秘代理)   | AI 代理程式，執行 5T 協議                          |
| **OmniClaw** (奧秘爪)      | 社交團隊/社群單位                                  |
| **OpenClaw**               | 開源多管道 AI 閘道                                 |
| **OmniESGcell / Omnicell** | InfoOne 的 ESG 專用細胞單元                        |
| **OmniGennie** (奧秘精靈)  | JunAiKey 的 AI 助手人格                            |

### 三大營運中心

| 中心             | 路徑                 | 功能                                                            |
| ---------------- | -------------------- | --------------------------------------------------------------- |
| **永續報告中心** | `/esg-report-center` | GRI/SASB/TCFD 報告生成、AI 分析、缺口分析                       |
| **商業偵情中心** | `/esg-intelligence`  | 企業分析、風險雷達、市場情報                                    |
| **萬能圓通筆記** | `/omni-notes`        | 筆記管理、標籤系統、5T 追蹤                                     |
| **OmniBackend**  | `/omni-backend`      | 統一資料庫、MDM、主數據管理、ESG資料庫、法規庫、RAG零幻覺資料庫 |

### 數據流

```
用戶訊息 → OpenClaw Gateway → OmniCircle MCP → OmniCircle/OmniAgent → OmniClaw (團隊)
```

### 相關文檔

- 使用者指南: `docs/OMNIONE_USER_GUIDE.md`
- API 參考: `docs/INFOONE_API_GUIDE.md`

## OmniCode 雙向人工智能圓通無礙心電感應區

本專案已整合 OpenCode VS Code 擴充功能，結合 OpenClaw/OpenCrew/OmniCircle 等系統，打造「雙向人工智能圓通無礙心電感應區」。

### 核心架構

| 組件           | 功能                            | 角色     |
| -------------- | ------------------------------- | -------- |
| **OmniCode**   | 代碼顯化、VS Code AI 輔助       | 編輯界面 |
| **OpenCode**   | CLI AI 助手、終端集成           | 執行核心 |
| **OpenClaw**   | 多管道通訊閘道 (WA/TG/DC/Slack) | 通訊樞紐 |
| **OpenCrew**   | AI 代理團隊系統                 | 任務執行 |
| **OmniCircle** | 編排引擎、5T 閉環協調           | 邏輯樞軸 |
| **OmniCodex**  | 知識聖典、零幻覺資料庫          | 記憶存儲 |

### 心電感應數據流

```
用戶意念 → OmniCode (編輯) ⇄ OpenCode (終端)
                ↓↑
         OpenClaw Gateway (多管道)
                ↓↑
         OmniCircle MCP (5T 協調)
                ↓↑
         OmniCodex (知識聖典)
                ↓↑
         OpenCrew (AI 代理團隊)
                ↓↑
         雙向回饋 (圓通無礙)
```

### 安裝

1. 安裝 OpenCode VS Code 擴充功能 ( marketplace: `sst.opencode` )
2. 重載 VS Code 視窗
3. 啟動 OpenClaw Gateway: `npm run omni:start`

### 快捷鍵

| 功能         | Windows/Linux    | Mac             |
| ------------ | ---------------- | --------------- |
| 快速啟動     | `Ctrl+Esc`       | `Cmd+Esc`       |
| 新工作階段   | `Ctrl+Shift+Esc` | `Cmd+Shift+Esc` |
| 插入檔案引用 | `Alt+Ctrl+K`     | `Cmd+Option+K`  |

### 使用方式

- **快速啟動**: 按下 `Ctrl+Esc` 在分割終端中開啟 OpenCode
- **新工作階段**: 按下 `Ctrl+Shift+Esc` 開始新的 OpenCode 工作階段
- **檔案引用**: 選取程式碼後按 `Alt+Ctrl+K` 插入檔案引用 (如 `@File#L37-42`)
- **OmniCircle 協調**: 所有 AI 請求都會經過 5T 驗證確保零幻覺
- **知識查詢**: 透過 OmniCodex 實現「心電感應」般的知識直連
