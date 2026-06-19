# System Architecture: Omni-Optimization
> **Official Designation**
>
> 奧秘精靈系統優化 (Omni-Optimization: Deepen & Broaden)
- **協議層級**: 核心優化層 (Omni-Core) & 受信證據層 (Trust Ledger)
- **全圖景**: 地心引力 SaaS / 同心圓天球 (Concentric Celestial Sphere)
- **三位一體**: 奧秘大祭司 (Priest), 鑰匙保管者 (KeyKeeper), 雙子星 (Gemini)

---

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer (Bento UI)"
        UI[React UI Components]
        STATE[Zustand State Management]
        ROUTER[Tab-based Routing]
    end

    subgraph "Service Layer (Agency & 5T)"
        GEMINI[Gemini AI Service / Aether]
        LEDGER[Sovereign Impact Ledger]
        VALIDATOR[5T Protocol Validator]
        VAULT[Evidence Vault Service]
    end

    subgraph "Infrastructure Layer (Omni Core)"
        OMNI_ELEMENT[Omni Element / Info-One]
        CRYSTAL[Omni Crystal / Eternal Memory]
        OMNICIRCLE_MCP[OmniCircle MCP / Integration]
        REDIS[Redis Caching / OmniCacheService]
        LOGGER[OmniLogger / 3+1 Protocol]
    end

    subgraph "External Ecosystem"
        GEMINI_API[Google Gemini API]
        BLOCKCHAIN[Blockchain Anchor (Sim)]
    end

    UI --> STATE
    STATE --> GEMINI
    GEMINI --> GEMINI_API

    GEMINI --> LEDGER
    LEDGER --> VALIDATOR
    VALIDATOR --> VAULT

    LEDGER --> OMNI_ELEMENT
    OMNI_ELEMENT --> CRYSTAL

    ALL --> LOGGER
```

## System Layers

本系統架構分為六個核心層級，確保各組件之間的職責分離與系統彈性。

```typescript
interface SystemArchitecture {
  presentation: PresentationLayer; // Bento UI & 多人稱互動
  service: ServiceLayer; // AI 服務、帳本邏輯、業務流程
  trust: TrustLayer; // 5T 協議驗證 (Tangible, Traceable...)
  omni_core: OmniCoreLayer; // 三位一體 (Priest, Key, Gemini) 核心
  hardening: HardeningLayer; // Redis 快取與記憶體韌性層
  infrastructure: InfrastructureLayer; // 日誌、持久化、網路基礎
}
```

### 1. Presentation Layer (Bento UI)
使用「便當盒式」佈局，提供直覺的數據感知體驗。支持多語系 (i18n) 與主題切換。

### 2. Trust Layer (5T Protocol)
核心驗證組件，確保所有數據進入系統前皆符合 5T 標準：
- **Tangible (可感知)**: 數據轉化為視覺回饋。
- **Traceable (可溯源)**: 追蹤數據原始起點。
- **Trackable (可追蹤)**: 紀錄處理路徑。
- **Transparent (透明)**: 運算邏輯公開。
- **Trustworthy (可信)**: 最終數據不可篡改。

### 3. Hardening Layer (OmniCacheService)
基於 Redis 的高性能快取層，提供系統韌性：
- **L1 In-Memory**: 本地記憶體快取。
- **L2 Redis**: 分布式快取。
- **Resilience Fallback**: 當 Redis 離線時自動降級至本地記憶體。

---

## Frontend Technology Stack & Component Architecture

### Core Technologies
- **Framework**: React 18.3+
- **Styling**: Tailwind CSS + Glassmorphism (玻璃擬態)
- **State**: Zustand (輕量級狀態管理)
- **Visualization**: Recharts & D3.js

### Project Structure
- `src/components`: 可複用 UI 元件。
- `src/pages`: 頂層頁面呈現。
- `src/services`: 外部 API 與業務邏輯封裝。
- `src/hooks`: 性能優化的自定義 Hook。

---

## Backend Services & Implementation Patterns

### Backend Stack
- **Runtime**: Node.js 20+ / Python 3.11+
- **Framework**: Express.js & CrewAI
- **Database**: PostgreSQL 15 & Redis 7
- **AI Engine**: Gemini 1.5/2.0 Flash

### Implementation Patterns
- **Service Pattern**: 所有業務邏輯封裝於單一 Service。
- **OmniLogger Protocol**: 標準化日誌紀錄，包含 UUID 追蹤。
- **Error Factory**: 統一錯誤碼處理機制。

---

## Data Flow Architecture

### 1. Security Analysis Flow
用戶發起分析 -> Snyk 執行快速掃描 -> AI 提取關鍵風險 -> 5T 驗證 -> 回饋至儀表板。

### 2. Knowledge Asset Flow
數據採集 -> 語意嵌入 (Embeddings) -> 存入向量數據庫 -> AI 檢索增強 (RAG) -> 導師引導回饋。

---

## Trust Layer & 5T Logic Gate

### Goodward Sustainability Core
本系統的核心目標是建立一個「上善若水」的永續系統，透過 5T Sentinel Protocol 監控所有數據真實性。

#### Core Interfaces
- `IComponentCore`: 實作 5T 基礎屬性的核心介面。
- `OmniKey`: 安全解鎖與驗證數據的密鑰組件。
- `OmniNexus`: 串接各項服務與數據流的中樞系統。

---

---

## Omni-Sovereignty Comprehensive Documentation (2026)

For a detailed breakdown of all 50+ Omni modules and the Grand Unification strategy, refer to the following reports:
- [Omni-Sovereignty Comprehensive Report](file:///c:/Project/esgss_junaikey_beta/docs/reports/2026/omni-sovereignty/OmniSovereignty_Comprehensive_Report.md)
- [Grand Unification Report (ZH)](file:///c:/Project/esgss_junaikey_beta/docs/reports/2026/omni-sovereignty/OmniSovereignty_Grand_Unification_Report_ZH.md)
- [Universal Deployment Protocol](file:///c:/Project/esgss_junaikey_beta/docs/reports/2026/omni-sovereignty/OmniSovereignty_Universal_Deployment_Protocol.md)
- [Mutual Integration Analysis](file:///c:/Project/esgss_junaikey_beta/docs/reports/2026/omni-sovereignty/OmniMutualIntegration_Report.md)

<div align="center">
以終為始，始終如一，善向永續。
ESGss x JunAiKey 2026 Architected for Infinity.
</div>
