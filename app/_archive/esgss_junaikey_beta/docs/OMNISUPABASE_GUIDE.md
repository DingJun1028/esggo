# OmniSupabase Guide
# 奧秘 Supabase 服務指南

## 📋 概述

OmniSupabase 是奧秘 Supabase 服務，它繼承了 Supabase 的所有功能，並通過迭代永續進化與 OmniSpace、OmniTable 以及奧秘智庫相互加成。

## 🌌 核心特性

### 1. 繼承迭代永續進化
- **版本控制**: 通過版本追蹤實現增量更新
- **自動進化**: 定期執行進化迭代，優化系統性能
- **歷史記錄**: 保存所有進化歷史，支持回滾

### 2. OmniSpace 集成
- **實體持久化**: 將 OmniSpace 實體保存到 Supabase
- **雙向同步**: 支持實體的雙向同步
- **版本管理**: 追蹤實體的版本變更

### 3. OmniTable 集成
- **表格數據存儲**: 將 OmniTable 數據結構化存儲
- **關聯管理**: 管理表格與晶體、知識的關聯
- **查詢優化**: 利用 Supabase 的查詢能力

### 4. 奧秘智庫集成
- **知識同步**: 與奧秘智庫雙向同步
- **智能關聯**: 自動關聯晶體與知識
- **增強搜索**: 利用 Supabase 的全文搜索

## 🔧 配置選項

```typescript
interface OmniSupabaseConfig {
  enableAutoSync: boolean;        // 啟用自動同步
  syncInterval: number;           // 同步間隔（毫秒）
  enableEvolution: boolean;       // 啟用進化迭代
  enableKnowledgeIntegration: boolean; // 啟用知識集成
}
```

## 🚀 使用方法

### 導入
```typescript
import { omniSupabase } from '@/services/OmniSupabase';
```

### 保存 OmniSpace 實體
```typescript
const entityId = await omniSupabase.saveOmniSpaceEntity({
  id: 'entity_123',
  type: 'crystal',
  data: crystalData,
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  },
});
```

### 保存 OmniTable 行
```typescript
const rowId = await omniSupabase.saveOmniTableRow({
  id: 'row_123',
  tableId: 'table_456',
  data: rowData,
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    crystalId: 'crystal_789',
  },
});
```

### 同步知識到奧秘智庫
```typescript
const status = await omniSupabase.syncKnowledgeToBase('knowledge_123');
console.log(status.synced); // true
```

### 從奧秘智庫同步知識
```typescript
await omniSupabase.syncKnowledgeFromBase('knowledge_123');
```

### 創建晶體並同步
```typescript
const crystalId = await omniSupabase.createAndSyncCrystal(crystalDNA);
```

### 獲取統計信息
```typescript
const stats = await omniSupabase.getStats();
console.log(stats);
// {
//   omniSpaceEntities: 100,
//   omniTableRows: 500,
//   knowledgeSynced: 50,
//   evolutionVersion: 5
// }
```

### 更新配置
```typescript
omniSupabase.updateConfig({
  enableAutoSync: false,
  syncInterval: 120000,
});
```

## 📊 數據結構

### OmniSpace 實體表
```sql
CREATE TABLE omni_space_entities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  synced_at TIMESTAMP,
  version INTEGER NOT NULL
);
```

### OmniTable 行表
```sql
CREATE TABLE omni_table_rows (
  id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  crystal_id TEXT,
  knowledge_id TEXT
);
```

### 知識同步狀態表
```sql
CREATE TABLE knowledge_sync_status (
  knowledge_id TEXT PRIMARY KEY,
  synced BOOLEAN NOT NULL,
  last_sync_at TIMESTAMP,
  error TEXT
);
```

### 晶體知識映射表
```sql
CREATE TABLE crystal_knowledge_mapping (
  id TEXT PRIMARY KEY,
  crystal_id TEXT NOT NULL,
  knowledge_id TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);
```

### 進化日誌表
```sql
CREATE TABLE omni_evolution_log (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  changes JSONB NOT NULL
);
```

## 🔄 同步流程

### 自動同步流程
```
1. 同步 OmniSpace 實體
   ↓
2. 同步 OmniTable 數據
   ↓
3. 同步奧秘智庫
   ↓
4. 執行進化迭代
   ↓
5. 記錄同步結果
```

### 晶體創建流程
```
1. 創建晶體 DNA
   ↓
2. 保存到 OmniSpace
   ↓
3. 創建關聯知識
   ↓
4. 同步到奧秘智庫
   ↓
5. 建立映射關係
```

## 🧬 進化迭代

### 進化類型
1. **自動進化**: 定期執行的優化
2. **手動進化**: 用戶觸發的優化
3. **觸發進化**: 基於條件的優化

### 進化內容
- 數據結構優化
- 索引優化
- 查詢優化
- 同步策略優化

## 📝 最佳實踐

1. **錯誤處理**: 始終使用 try-catch 包裝調用
2. **日誌記錄**: 使用 omniLogger 記錄重要操作
3. **配置管理**: 根據需求調整配置
4. **監控同步**: 定期檢查同步狀態
5. **性能優化**: 合理設置同步間隔

## 🧪 測試

```typescript
import { omniSupabase } from '@/services/OmniSupabase';

describe('OmniSupabase', () => {
  it('should save OmniSpace entity', async () => {
    const entityId = await omniSupabase.saveOmniSpaceEntity({
      id: 'test_entity',
      type: 'crystal',
      data: { test: 'data' },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      },
    });
    expect(entityId).toBe('test_entity');
  });

  it('should sync knowledge to base', async () => {
    const status = await omniSupabase.syncKnowledgeToBase('test_knowledge');
    expect(status.synced).toBe(true);
  });
});
```

## 🔗 相關文檔

- [OmniCircle 核心文檔](../src/core/OmniCircle.ts)
- [OmniKnowledgeBase 文檔](../src/services/OmniKnowledgeBase.ts)
- [OmniSyncService 文檔](../src/services/OmniSyncService.ts)
- [Supabase 配置](../server/config/supabase.ts)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 許可證

MIT License

---

**OmniSupabase** - 讓數據永續進化！
