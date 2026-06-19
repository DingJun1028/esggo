# OmniSupabase Universal Optimization Plan (v8.3.0-Universal)
> **UUID**: `OMNI-SUPABASE-OPT-PLAN-2026`
> **Version**: 1.0.0
> **Status**: Planning

此文件詳細說明 **OmniSupabase (奧秘數據庫)** 的全方位優化計畫，旨在將現有的基礎 Wrapper 升級為符合 **5T 協議** 與 **奧秘架構** 的核心數據中樞。

## 1. Executive Summary (執行摘要)

目前的 `OmniSupabase.ts` 僅提供了基礎的 Client 單例封裝，尚未實作 `OMNISUPABASE_GUIDE.md` 中定義的高階功能（如：實體持久化、雙向同步、自動進化、知識整合）。本次優化將落實 **「萬能優化 (Universal Optimization)」**，使其成為真正的奧秘生態系數據心核。

**核心目標**：
1.  **5T 協議實作**：確保所有數據寫入符合 Traceable, Trackable, Transparent, Tangible, Trustworthy 標準。
2.  **OmniSpace/Table 整合**：建立專屬的 Adapter 與 Sync 機制，實現實體與表格數據的無縫同步。
3.  **自動進化 (Evolution)**：實作版本控制與自動遷移機制，讓資料庫結構能隨需求動態演化。

---

## 2. Gap Analysis (差距分析)

| 功能模組 | 現況 (Current) | 目標 (Target) | 差距 (Gap) |
| :--- | :--- | :--- | :--- |
| **Client Management** | 單例模式，基礎初始化 | 單例模式，具備健康檢查與重連機制 | 低 |
| **Entity Persistence** | 無 (Raw Supabase Calls) | `saveOmniSpaceEntity`, `saveOmniTableRow` 專用方法 | **高 (Critical)** |
| **5T Implementation** | 無 | 寫入時自動生成 `uuid`, `hash`, `timestamp` 並驗證 | **高 (Critical)** |
| **Knowledge Sync** | 無 | `syncKnowledgeToBase` 雙向同步機制 | **高 (Critical)** |
| **Evolution System** | 無 | `OmniEvolutionLog` 追蹤與自動遷移 | **中 (High)** |
| **Type Definitions** | 散落在各處或缺失 | 集中於 `src/types/omni/supabase.ts` | 中 |

---

## 3. Technical Architecture (技術架構)

### 3.1 Type System Definition (`src/types/omni/supabase.ts`)
將建立統一的型別定義，確保前後端與資料庫結構的一致性。

```typescript
export interface IOmniSpaceEntity {
    id: string;
    type: 'crystal' | 'knowledge' | 'nexus';
    data: any;
    metadata: {
        version: number;
        created_at: string;
        updated_at: string;
        hash: string; // T5-Trustworthy
        source_origin: string; // T2-Traceable
    };
}
```

### 3.2 OmniSupabase Service Upgrade (`server/services/OmniSupabase.ts`)
擴充 `OmniSupabase` 類別，實作以下介面：

1.  **saveOmniSpaceEntity(entity)**: 處理實體的版本檢查、Hash 計算與儲存。
2.  **saveOmniTableRow(row)**: 處理表格數據的結構化儲存與關聯。
3.  **syncKnowledge(knowledgeId)**: 觸發與 OmniKnowledgeBase 的同步。
4.  **evolution()**: 檢查版本日誌，執行必要的 SQL 遷移或數據轉換。

---

## 4. Implementation Roadmap (實作路線)

### Phase 1: Foundation & Types (基礎與型別)
- [ ] 建立 `src/types/omni/supabase.ts`，定義核心介面。
- [ ] 升級 `server/services/OmniSupabase.ts`，加入基礎的配置與初始化選項。

### Phase 2: Core Persistence & 5T (持久化與 5T)
- [ ] 實作 `saveOmniSpaceEntity` 方法，包含 Hash 計算與版本控制。
- [ ] 實作 `saveOmniTableRow` 方法。
- [ ] 建立 `scripts/setup_omni_supabase.ts`，用於初始化 Omni 專屬資料表。

### Phase 3: Advanced Features (進階功能)
- [ ] 實作 `syncKnowledgeToBase` 與 `OmniKnowledgeBase` 整合。
- [ ] 實作 `evolution` 機制，建立 `omni_evolution_log` 表。

### Phase 4: Verification (驗證)
- [ ] 建立 `scripts/verify_omni_supabase.ts`，測試 CRUD、同步與 5T 驗證流程。

---

## 5. Report Conclusion (結語)

本次優化將填補文件與實作之間的巨大鴻溝，將 OmniSupabase 從一個單純的連線工具，昇華為具備 **自我演化** 與 **誠信驗證** 能力的智慧數據中樞。

**狀態**：`PROPOSED` -> `READY_FOR_DEV`
