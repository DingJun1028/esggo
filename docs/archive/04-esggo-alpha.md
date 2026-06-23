# 記憶碎片：ESG GO Alpha

> **來源**：`C:\Project\esggo_alpha\`（399 files, ~5MB）
> **提取日期**：2026-06-19

---

## 1. 核心內容摘要

ESG GO Alpha 是 **v8.5.0-Alpha** 版本的 ESG 主權平台，定位為「臺北市中小企業永續治理實證系統」。此版本開始引入 **Firebase Data Connect** 作為核心數據層，並建立了完整的 **Report 類型系統** 與 **SustainWrite（永續撰寫）** 功能。

### 與 MVP 的關鍵差異
- Alpha 版本**沒有** MVP 的 `esggo_mvp-main` 子目錄結構，而是直接在根目錄建立 `app/`、`components/`、`lib/` 等目錄
- 引入了 **Data Connect GraphQL Schema**（`dataconnect/.dataconnect/schema/main/query.gql`），定義了完整的數據模型
- 擁有獨立的 **SustainWrite** 元件（`sustain-write-components.tsx`）
- 使用 **Genkit** 進行 AI 編排（`app/actions.ts` 中的 `chatWithESGAssistant`）

---

## 2. 架構/設計說明

### 2.1 數據模型（GraphQL Schema）
Alpha 版本的 Data Connect Schema 定義了以下核心實體：
- `Action` — 系統操作記錄
- `AuditRecord` — 審計記錄（支援 5T 協議）
- `Category` — 分類
- `Challenge` / `ChallengeParticipation` — 挑戰與參與
- `Comment` — 評論
- `Report` / `ReportSection` — 報告與章節
- `IntelligenceModule` / `IntelligenceSource` / `IntelligenceSignal` — 情報模組
- `Company` / `CompanyProfile` — 企業資料
- `Task` — 任務
- `User` — 使用者

### 2.2 Report 類型系統
```typescript
type ReportStatus = "draft" | "department_review" | "committee_approval" 
                  | "legal_review" | "published" | "completed";

interface Report {
    id: string;
    title: string;
    year: number;
    chapters: number;
    progress: number;
    status: ReportStatus;
    trustSeal: "Bronze" | "Silver" | "Gold" | "SECURE_MAX" | "5T_MAX";
    approvals?: ReportApproval[];
}
```

### 2.3 AI 整合
```typescript
// app/actions.ts — Genkit 驅動的 ESG 助手
export async function chatWithESGAssistant(
    messages: { role: 'user' | 'ai' | 'system', content: string }[],
    persona: SpiritType = 'compliance',  // compliance | harmony | innovation
    language: 'zh' | 'en' = 'zh',
    auditMode: boolean = false
)
```

### 2.4 靈魂身份（Spirit Personas）
- **Compliance（合規守衛）**：專注指標對齊與風險控管
- **Harmony（共榮引導）**：提供利害關係人與文化視角
- **Innovation（創新先行）**：探索永續技術與轉型替代方案

---

## 3. 關鍵代碼片段

### 3.1 AppContext 核心類型
```typescript
interface AppContextType {
    activeView: string;
    activeSubView: SustainWriteSubView;  // "home" | "list" | "templates" | "editor" | "preview" | "library" | "ocr" | "integration" | "ai-assist"
    selectedReportId: string | null;
    globalEsgData: GlobalEsgData;
    companyProfile: CompanyProfile;
    reports: Report[];
    addReport: (report: Partial<Report>) => void;
    updateReport: (id: string, updates: Partial<Report>) => void;
    hiddenGoals: {
        systemHarmony: number;
        dataPurity: number;
        governanceWisdom: number;
        ecosystemCoordination: number;
    };
    language: "zh" | "en";
}
```

### 3.2 5T 封印回應格式
```typescript
{
    success: true,
    text: "...",
    traceId: "tr-xxxxxxx",
    integrityCheck: {
        status: "VERIFIED",
        hashId: "ADK-5T-SHA256-XXXXXX",
        signer: "ESGGO AI v8.1",
        timestamp: "2026-...",
        protocol: "V8.1 SEAL"
    }
}
```

---

## 4. 與現有 esggo 項目的關聯

- **Alpha → MVP**：MVP 的 5T 協議、Spirit Personas、Report 系統在 Alpha 中被重構為更具結構化的 Data Connect Schema
- **Alpha → V1.0**：V1.0 繼承了 Alpha 的 Data Connect 基礎，並擴展了 M1-M10 商情偵察中心
- **Alpha → Original**：Original 版本可能是 Alpha 的早期迭代，但 Alpha 擁有更完整的 Genkit 整合
- **核心保留**：`trustSeal` 分級（Bronze → 5T_MAX）、`SustainWrite` 多視圖子系統、`hiddenGoals` 遊戲化機制

---

*提取者：OWL | 批次 2 | 2026-06-19*
