# ESGGO 善向永續綜合文件書 / ESGGO Comprehensive Documentation Book v1.5.0

## 目錄 / Table of Contents

- [平台總覽 / Platform Overview](#platform-overview-平台總覽)
- [5T 誠信協議 / 5T Integrity Protocol](#5t-integrity-protocol-5t-誠信協議)
- [系統架構矩陣 / System Architecture Matrix](#system-architecture-matrix-系統架構矩陣)
- [AI 代理人工作流 / AI Agent Workflows](#ai-agent-workflows-ai-代理人工作流)
- [CLI 設置步驟 / CLI Setup Steps](#cli-setup-steps-cli-設置步驟)
- [開發工作流程 / Development Workflow](#development-workflow-開發工作流程)
- [技術架構 / Technical Architecture](#technical-architecture-技術架構)
- [編譯報告 / Compilation Report](#compilation-report-編譯報告)

---

## Platform Overview / 平台總覽

### Platform Positioning / 平台定位

OmniHermes + ESGGO 是一個專注於 **企業永續治理、ESG 數據管理、AI 協作、可驗證稽核與混合雲智能控制** 的整合平台。  
OmniHermes + ESGGO is an integrated platform focused on **enterprise sustainability governance, ESG data management, AI collaboration, verifiable auditing, and hybrid cloud intelligence control**.

### Platform Goals / 平台目標

1. 讓企業更容易建立 ESG 治理基礎 / Make it easier for enterprises to establish ESG governance foundations
2. 降低永續報告撰寫與資料整理成本 / Reduce costs of sustainability reporting and data compilation
3. 建立數據與佐證的可追溯鏈 / Establish traceable chains for evidence and data
4. 透過 AI 提升分析與撰寫效率 / Enhance analysis and writing efficiency through AI
5. 使治理狀態可視化、可查核、可持續優化 / Make governance status visualizable, auditable, and continuously optimizable

### Platform Features / 平台特色

- **5T 誠信協議** / **5T Integrity Protocol** - 資料完整性保護 / Data integrity protection
- **GRI/ISSB 對應能力** / **GRI/ISSB Compliance** - 標準對應 / Standards mapping
- **Omni-Agent 智能調度** / **Omni-Agent Intelligence** - 智能調度 / Smart scheduling
- **BlueCC 混合雲中控** / **BlueCC Hybrid Control** - 雲端編排 / Cloud orchestration
- **ZKP + SHA-256** - 數位封印 / Digital sealing
- **全域 RWD** / **Global RWD** - 響應式設計 / Responsive design
- **統一品牌原子元件庫** / **Unified Brand Component Library**

---

### 5T Integrity Protocol / 5T 誠信協議

1. **Tangible (具體)** - 將抽象的淨零承諾具體化為 SBTi 1.5°C 趨勢線與明確年度減碳百分比 / Concrete visualization of net-zero commitments as SBTi 1.5°C trend lines and clear annual reduction percentages
2. **Traceable (溯源)** - 所有數據點皆夾帶 `source_origin` 與完整 `flow_path` / All data points carry `source_origin` and complete `flow_path`
3. **Trackable (追蹤)** - 完整生命週期日誌，`request_id` 全程追蹤 / Complete lifecycle logs with `request_id` tracking
4. **Transparent (透明)** - 演算法透明，杜絕 AI 幻覺，具備 `Formula` 驗算面板 / Algorithms transparent, no AI hallucinations, with `Formula` verification panel
5. **Trustworthy (信賴)** - 主權封印，不可篡改，整合 ZKP 密封技術 / Sovereign sealed, tamper-proof, integrated with ZKP sealing technology

---

### System Architecture Matrix / 系統架構矩陣

#### Navigation Map / 導覽地圖

```
首頁 → 功能模組 → 數據管理 → 智能分析 → 報告生成 → 驗證稽核 → 分享匯出
Home → Feature Modules → Data Management → Intelligence → Report → Verification → Share
```

#### Function Navigation / 功能導覽

- **ESG 大宗性評估** `/materiality`
- **碳熱力圖** `/carbon-heatmap`
- **CBAM 計算器** `/cbam-calculator`
- **供應鏈追溯** `/supply-chain`
- **數位雙生** `/digital-twin`
- **合規檢核** `/compliance-check`
- **審計驗證** `/audit-verify`
- **AI 智能顧問** `/advisory`
- **代理人協作** `/agents`
- **首頁儀表板** `/`

---

### AI Agent Workflows / AI 代理人工作流

1. **定位** - ESG AI Agents 作為企業永續報告的智慧協作夥伴 / ESG AI Agents serve as intelligent collaborators for enterprise sustainability reporting
2. **客戶旅程** - PM 點擊「召喚 Agent」→ 選擇分析任務 → 接收洞察 → 匯出至 SustainWrite / PM clicks "召喚 Agent" → selects analysis task → receives insights → exports to SustainWrite
3. **核心技術** - React Query + WebSocket/SSE 即時串流，Python 後端整合 Pandas / React Query + WebSocket/SSE for real-time streaming, Python backends with Pandas
4. **5T 實踐** - T3 Trackable：所有分析均記錄觸發；T4 Transparent：清晰數據來源與模型版本 / T3 Trackable: All analyses logged with triggers; T4 Transparent: Clear data sources and model versions

---

### CLI Setup Steps / CLI 設置步驟

From `package.json` / 來自 `package.json`:

```json
"build": "next build && node scripts/copy-standalone-assets.js",
"start": "node -r dotenv/config .next/standalone/server.js",
"dev": "ts-node server.ts",
"dev:ui": "next dev -p 3001",
"lint": "eslint .",
"test": "vitest",
"typecheck": "tsc --noEmit",
"omni:setup": "npx tsx scripts/setup_all_tables.ts",
"omni:setup:dry": "npx tsx scripts/setup_all_tables.ts --dry-run",
"omni:scan": "npx tsx scripts/fnns-scanner.ts",
"omni:health": "curl http://localhost:3001/api/health"
```

Recommended startup sequence / 建議啟動順序:

1. `npm install` - 安裝依賴
2. `npm run omni:setup` - 設定資料庫表格
3. `npm run dev:ui` - 啟動 Next.js 前端
4. Verify with `npm run omni:health` - 驗證健康狀態

---

## Development Workflow / 開發工作流程

### 4-Stage Development Process / 4 階段開發流程

**Stage I: Soul & Intent / 階段 I：靈魂與意圖**

- 定義需求 (JunAiKey 負責) / Define requirements (JunAiKey lead)
- 建立 WIKI 憲法文件 / Create WIKI constitutional documents
- 矩陣命名 (kebab-case 路徑) / Matrix naming (kebab-case paths)

**Stage II: 5T & Integrity Design / 階段 II：5T 與誠信設計**

- 對應 5T 協定 / Map 5T protocols (True, Traceable, Transparent, Trustworthy, Tangible)
- 矩陣依賴分析 / Matrix dependency analysis
- 液態玻璃 UI 設計 / Liquid Glass UI design
- NCBDB 結構刻印 / NCBDB schema stamping

**Stage III: Bidirectional Execution / 階段 III：雙向執行**

- WIKI 驅動開發 / WIKI-driven development
- TypeScript 全端開發 / TypeScript full-stack development
- 元件註冊 / Component registration

**Stage IV: Validation & Trace / 階段 IV：驗證與追溯**

- 紅線自動化測試 / Red-line automated testing
- 熵減驗證 / Entropy reduction verification
- 全域發佈與監控 / Global publishing with monitoring

---

## Technical Architecture / 技術架構

### Tech Stack / 技術棧

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Database**: Supabase PostgreSQL
- **Cloud Control**: BlueCC Hybrid Dispatcher
- **AI Engine**: Gemini 2.0 + OmniHermes + Genkit
- **Integrity Layer**: SHA-256 + ZKP + Audit Logs
- **Email/Notification**: Resend API
- **Security**: RLS + API Connectors

### Security & Trust Design / 安全與信任設計

- SHA-256 加密封印用於關鍵紀錄 / SHA-256 encryption sealing for critical records
- ZKP 驗證狀態用於關鍵文件 / ZKP verification status for key documents
- 所有生命週期變更寫入審計日誌 / All lifecycle changes written to audit logs
- 敏感資料透過 RLS 保護 / Sensitive data protected by RLS

---

### Compilation Report / 編譯報告

**Document Sources Processed:**

- README.md (v1.5.0)
- docs/平台總覽.md
- docs/功能總覽.md
- docs/技術架構與資料設計.md
- docs/QUICK_START.md
- docs/wiki/Roadmap.md
- docs/wiki/System-Core-Architecture.md
- docs/wiki/Development-Workflow.md
- docs/wiki/5T-Protocol.md
- docs/wiki/Agents.md
- docs/wiki/OMNI_COMPONENT_MATRIX.md

**Status:** ✅ Compiled successfully (80 lines → 165 lines)
**Evidence Seal:** Generated from `docs/wiki/` with 5T compliance
**License:** ESGGO 善向永續 | SACRED TRINITY | 2026
