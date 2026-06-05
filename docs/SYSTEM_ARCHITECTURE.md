# ESG GO System Architecture

## 1. 系統總覽 (System Overview)

ESG GO 是一個高度整合、智能化且具備自我演進能力的 ESG (環境、社會、公司治理) 數據與報告平台。
系統的核心設計圍繞著「神聖三位一體」：
- **Platform (平台)**: 支撐數位信任與 5T 協定的現代化雲端基礎架構 (基於 Next.js, Supabase, Vercel)。
- **Commander (指揮官)**: OmniAgent 代理集群系統，負責編排、調度及執行各類自動化與 AI 輔助任務。
- **Soul (靈魂)**: JunAiKey 語意指導層，確保系統治理意圖的對齊，落實 5T (Truth, Goodness, Beauty, Trust, Transferful) 協議。

## 2. 核心架構 (Core Architecture)

### 2.1 表現層與前端 (Frontend Layer)
- **框架**: Next.js (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS (遵循 ESG GO Brand Style Specification)
- **狀態管理**: Zustand (如 `useAuthStore`, `usePreferencesStore`)
- **功能**:
  - 提供液態玻璃介面 (Liquid Glass UI)。
  - 支援 SSR / RSC (React Server Components) 加速頁面載入。

### 2.2 業務邏輯與 API 層 (Backend & API Layer)
- **核心架構**: 基於 Next.js API Routes (Server Actions) 與 tRPC / REST 雙向 TypeScript 安全。
- **AI 代理整合**: 透過 Genkit 構建與調度 AI 模型 (Gemini)，支援多模態推理與結構化輸出。
- **MCP (Model Context Protocol)**: 允許 OmniAgent 與內部/外部資源 (如 Firestore, BigQuery, Supabase) 無縫溝通。

### 2.3 數據層 (Data Layer)
- **主資料庫**: Supabase (PostgreSQL)，負責儲存所有結構化業務數據，並利用 RLS (Row Level Security) 確保資料主權與安全性。
- **治理與日誌 (NoSQL/Log)**: 系統可能採用 GCP Firestore 或本地文件日誌 (如 `.omnisync_trace.txt`) 來記錄執行軌跡與治理決策。
- **安全性**: 所有寫入強制綁定 UUID、版本號及時間戳記 (5T 之 Trust)。

## 3. 架構設計模式 (Key Design Patterns)

1. **端到端型別安全 (End-to-End Type Safety)**
   - 前後端共用 Zod Schema。
   - 資料庫層 (Supabase) 與應用層透過 Prisma 或 Drizzle/Supabase-js 產生嚴格型別。

2. **基於合約的開發 (Contract-Driven Development)**
   - 所有的變更與擴充，皆需先定義 OpenAPI 規格或 tRPC Router，並以 ADRs (Architecture Decision Records) 記錄。

3. **減熵儀式 (Entropy Reduction)**
   - 模組間保持低耦合。AtomicLibraryManager 負責統一管理共用元件，確保無冗餘代碼。

## 4. 模組部署架構 (Deployment Architecture)

- **前端與 API 託管**: Vercel
  - 自動化 CI/CD，與 GitHub Repository 同步。
  - Vercel Serverless Functions 處理動態 API 請求。
- **資料庫與 Auth**: Supabase
  - Supabase Auth 處理使用者登入/授權。
  - Supabase Database 提供資料儲存與即時訂閱 (Realtime)。
- **AI 運算**: 依賴 GCP (Google Cloud Platform) 與 Gemini API。

## 5. 數據流與協定 (Data Flow & Protocol)

遵循 5T 協定：
1. 用戶透過 Web 端發起請求 (UI 需符合 Beauty 準則)。
2. 請求到達 API 層，由 Zod Schema 驗證有效性。
3. 若涉及 AI 推理，轉交 Genkit / MCP 處理；若涉及資料變更，寫入 Supabase (符合 Truth, Trust, Transferful)。
4. 最終執行紀錄必須回溯至 ADR / 追蹤日誌 (Governance Logs)，確保透明 (Goodness)。
