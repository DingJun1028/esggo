# ESG GO | Omni_Terminal

**臺北市中小企業永續治理實證系統 v8.5.0-Alpha**

---

## 📄 系統平台規格白皮書：全方位永續治理架構

### 0. 執行摘要 (Executive Summary)

ESG GO 是一款專為中小企業設計的次世代永續（ESG）治理平台。本平台透過整合
**Google Cloud AI**、**Firebase Data Connect** 與 **零知識證明 (ZKP)**
技術，實踐了「數據真實性」與「商業隱私」的完美平衡。本白皮書旨在詳述系統的核心架構、技術規格及治理協議，為應對
**GRI 2025** 與 **ISSA 5000** 等國際確信標準提供技術基座。

---

### 1. 核心治理框架：5T 誠信協議 (5T Integrity Protocol)

ESG GO 的每一筆數據皆受基於密碼學的「5T 數據信託封印」保護：

- **T1: 可溯源 (Traceable)** - 每一項 ESG 數據皆與 **Evidence Vault**
  中的原始憑證精確關聯。
- **T2: 透明 (Transparent)** - 符合國際標準的透明度檢查，主動掃描「綠標/綠漂
  (Greenwashing)」風險。
- **T3: 可感知 (Tangible)** - 抽象數據轉化為具體的治理指標，並結合 **Skeleton
  Loader** 提升用戶感知效能。
- **T4: 不可篡改 (Trustworthy)** - 核心數據套用 SHA-256 哈希鎖定，並具備 **ADK
  Integrity Proof** 雜湊證明。
- **T5: 可追蹤 (Trackable)** - 利用 Firebase Data Connect 記錄每一筆
  `AuditRecord` 的編輯軌跡。

---

### 2. 技術架構規格 (Technical Architecture)

#### 2.1 前端視圖層 (Frontend Layer)

- **底層框架**: Next.js 15 + React 19。
- **設計系統**: Vanilla CSS (現代美學) + Tailwind v4 (工具類輔助)，採玻璃擬態
  (Glassmorphism) 與高級暗色模式。
- **輔助技術**: 完整整合 **WAI-ARIA** 標籤與角色，確保系統符合 Web 無障礙標準
  (Accessibility)。

#### 2.2 後端與數據層 (Backend & Data Layer)

- **數據中心**: **Firebase Data Connect (FDC)**。
- **關聯式數據庫**: PostgreSQL。
- **通訊協議**: 全類型安全 (Type-Safe) 的 GraphQL 介面，並自動生成 TypeScript
  SDK。
- **審計架構**: 獨立的 `AuditRecord` 架構，支持證據關聯、元數據儲存與校驗雜湊。

#### 2.3 AI 編排層 (AI Orchestration)

- **AI 核心**: Google Cloud Vertex AI (Gemini API)。
- **模型開發**: 基於 **Firebase Genkit** 與 **ADK (Agent Development Kit)**。
- **人格化代理 (Spirit Personas)**:
  - **合規守衛 (Compliance)**: 專注指標對齊與風險控管。
  - **共榮引導 (Harmony)**: 提供利害關係人與文化視角。
  - **創新先行 (Innovation)**: 探索永續技術與轉型替代方案。

---

### 3. 安全與信任機制 (Security & Trust)

#### 3.1 零知識證明 (ZKP) 整合

系統在 **Evidence Vault** 中部署了互動式 ZKP
驗證，允許企業在不披露商業機密數據的前提下，向審計師證明數據計算的邏輯正確性。狀態轉換（From
`Pending` to `Verified`）由後端哈希校驗驅動。

#### 3.2 誠信證明 (Integrity Proof)

AI 生成的每份報告內容均包含：

- **GCP Trace ID**: 全程追蹤 AI 請求路徑。
- **Integrity Hash**: 對生成的變體內容進行防偽鎖定。

---

### 4. 核心功能模組 (Feature Modules)

1. **儀表板 (Dashboard)**: 結合 Data Connect 與 Firestore
   即時同步機制，提供零延遲的系統活動日誌與關鍵指標監控。
2. **企業管理 (Profile)**: 內建公司基本資料與治理目標管理的編輯介面
   (Modal)，有效維護企業上下文。
3. **專家諮詢 (Advisory)**: 結合 `chatWithESGAssistant`，透過 AI
   驅動提供即時治理策略與精準策略媒合建議。
4. **商情中心 (Intelligence Hub)**: 動態載入 ESG 模組進度，並即時計算總合規率。
5. **永續撰寫 (SustainWrite)**: AI 協作助手，支持證據鏈結與三種風格的內容改寫。
6. **證據金庫 (Evidence Vault)**: 集中化數據存證中心，支持標籤關聯與 ZKP
   狀態追蹤。
7. **永續智庫 (SustainLibrary)**: 整合 GRI/SASB 等國際標準文檔的一鍵式參考資源。

---

### 5. 開發與部署指南 (Development Guide)

#### 前置要求

- Node.js v18.0.0+
- Firebase CLI (需具備 Data Connect 權限)

#### 安裝步驟

```bash
npm install
# 啟動開發伺服器
npm run dev
```

#### 測試與驗證

```bash
# 執行單元測試
npm test
# 生成 Data Connect SDK
npx firebase dataconnect:sdk:generate
```

#### 生產部署

```bash
npm run build
npm run start
```

---

_Created & Maintained by Antigravity AI_ | _Last Updated: 2026-04-28_
