
# OmniSupabase vs. Supabase

此文件定義 **OmniSupabase** 與標準 **Supabase** 之間的功能差異與架構關係。

## 1. 定義 (Definition)

- **Supabase**: 
  - 基礎設施層 (Infrastructure Layer)。
  - 提供原生的 PostgreSQL 資料庫、Authentication、Edge Functions、Realtime 訂閱與 Storage。
  - 使用 `supabase-js` 客戶端進行標準 API 調用。

- **OmniSupabase**:
  - 奧秘服務層 (Omni Service Layer)。
  - 一個 **Wrapper (封裝器)** 與 **Singleton (單例)** 服務，核心繼承自 Supabase Client。
  - 負責將 Supabase 的基礎功能與 **InfoOne 5T 協議** 及 **奧秘架構 (OmniArchitecture)** 整合。

## 2. 功能差異矩陣 (Analysis Model)

| 特性 | Supabase (Standard) | OmniSupabase (Custom) |
| :--- | :--- | :--- |
| **角色** | 基礎後端服務 (BaaS) | 奧秘生態系數據中樞 (Hub) |
| **存取方式** | 直接 `createClient()` | 透過 `OmniSupabase.getInstance()` |
| **數據同步** | 單純讀寫 | **雙向同步 (Bidirectional Sync)**：與 OmniSpace、OmniTable 連動 |
| **實體管理** | 無 (Raw JSON/Rows) | **實體持久化**: 追蹤 Crystal/Knowledge 實體版本 |
| **演化機制** | 無 | **進化迭代 (Evolution)**: 自動優化數據結構與同步策略 |
| **日誌系統** | 無 (需自行實作) | 內建 `omniLogger`，分類記錄系統操作 |
| **知識整合** | 無 | 自動關聯 **奧秘智庫 (OmniKnowledgeBase)** |

## 3. 核心價值 (Core Value)

**OmniSupabase** 不僅僅是資料庫連線，它是 **「數據的靈魂容器」**。
它確保所有進入 Supabase 的數據都符合：
1.  **Traceable**: 可溯源 (Source Origin)。
2.  **Trackable**: 可追蹤 (Evolution Log)。
3.  **Transparent**: 與知識庫關聯，邏輯透明。
4.  **Trustworthy**: 透過版本控制確保數據完整性。

## 4. 代碼對照

### Supabase (Raw)
```typescript
const supabase = createClient(url, key);
const { data } = await supabase.from('users').select('*');
```

### OmniSupabase (Evolved)
```typescript
import { omniSupabase } from '@/services/OmniSupabase';

// 自動處理同步、版本控制與日誌
await omniSupabase.saveOmniSpaceEntity({
  id: 'crystal_001',
  type: 'crystal',
  data: { ... },
  metadata: { version: 1 }
});
```
