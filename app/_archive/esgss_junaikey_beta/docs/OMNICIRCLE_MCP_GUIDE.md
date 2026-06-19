# OmniCircle MCP Integration Guide
# 奧秘圓通 MCP 集成指南

## Overview
### 📋 概述

OmniCircle MCP 是奧秘圓通（OmniCircle）的 Model Context Protocol (MCP) 集成層，提供標準化的工具接口，讓外部系統可以通過 MCP 協議訪問 OmniCircle 的核心功能。

## OmniCircle Core Concepts
### 🌀 OmniCircle 核心概念

### 奧秘圓通 (OmniCircle)
- **定義**: 數據無礙流轉的核心引擎
- **功能**: 串聯奧秘標籤（Tag）、奧秘永憶（Memory）與奧秘晶體（Crystal）
- **哲學**: 無通自通，將錯誤轉化為學習資產

### 三位一體架構
1. **OmniPriest (天秤)**: 平衡與協調
2. **OmniKey Keeper (元鑰)**: 密鑰管理
3. **OmniGemini (雙星)**: 雙向同步

## MCP Tools List
### 🔧 MCP 工具列表

### 1. orchestrate_sentience
編排覺醒奧義，串聯 Tag、Memory、Crystal 進入 5T 閉環。

**參數**:
- `intent` (string): 意圖描述
- `domain` (string): 領域（SENTIENCE/ENVIRONMENT/GOVERNANCE/SOCIAL）
- `narrative` (string): 敘述內容
- `resonance` (number): 共振值（0-100）
- `markers` (array): DNA 標記
- `noteOptions` (object): 筆記自定義選項 (可選)
  - `tags` (string[]): 筆記標籤
  - `logId` (string): 關連的日誌 ID
  - `isInvestigating` (boolean): 是否進入調查狀態

**返回**: ICrystalDNA

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('orchestrate_sentience', {
  intent: '提升用戶體驗',
  domain: 'SENTIENCE',
  narrative: '通過優化界面設計提升用戶滿意度',
  resonance: 85,
  markers: ['UX', 'Design', 'Optimization']
});
```

### 2. infuse_crystal
注入晶體 DNA，創建新的奧秘晶體。

**參數**:
- `nature` (object): 晶體本質
  - `intent` (string): 意圖
  - `domain` (string): 領域
  - `dnaMarkers` (array): DNA 標記
- `payload` (object): 晶體載荷
  - `narrative` (string): 敘述
  - `quantitative` (number): 數量值
  - `evidenceVault` (string): 證據庫

**返回**: ICrystalDNA

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('infuse_crystal', {
  nature: {
    intent: '性能優化',
    domain: 'TECHNICAL',
    dnaMarkers: ['Performance', 'Optimization']
  },
  payload: {
    narrative: '優化數據庫查詢性能',
    quantitative: 90,
    evidenceVault: '{"source": "performance_test", "improvement": "30%"}'
  }
});
```

### 3. create_knowledge
創建知識條目並同步至奧秘智庫。

**參數**:
- `title` (string): 知識標題
- `content` (string): 知識內容
- `category` (string): 知識類別（INSIGHT/ESG/TECHNICAL/BUSINESS）
- `tags` (array): 標籤列表
- `authorId` (string): 作者 ID

**返回**: Knowledge

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('create_knowledge', {
  title: 'React 性能優化技巧',
  content: '詳細的 React 性能優化指南...',
  category: 'TECHNICAL',
  tags: ['React', 'Performance', 'Optimization'],
  authorId: 'user_123'
});
```

### 4. query_knowledge
查詢奧秘智庫中的知識。

**參數**:
- `category` (string): 知識類別（INSIGHT/ESG/TECHNICAL/BUSINESS/ALL）
- `tags` (array): 標籤過濾
- `limit` (number): 返回數量限制

**返回**: Knowledge[]

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('query_knowledge', {
  category: 'TECHNICAL',
  tags: ['React'],
  limit: 10
});
```

### 5. sync_entity
同步實體到外部平台。

**參數**:
- `platform` (string): 目標平台（omni_space/boost_space/ai_table/omni_note/omni_table）
- `entityType` (string): 實體類型（insight/knowledge/crystal/tag/memory）
- `entityId` (string): 實體 ID

**返回**: SyncResult

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('sync_entity', {
  platform: 'omni_space',
  entityType: 'insight',
  entityId: 'insight_123'
});
```

### 6. get_resonance_field
獲取共振場狀態。

**參數**:
- `crystalId` (string): 晶體 ID

**返回**: ResonanceField

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('get_resonance_field', {
  crystalId: 'crystal_123'
});
```

### 7. format_label
格式化展示標籤（OmniLabel 核心邏輯）。

**參數**:
- `text` (string): 要格式化的文本
- `language` (string): 語言（zh-TW/en）

**返回**: FormattedLabel

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('format_label', {
  text: '用戶體驗優化',
  language: 'zh-TW'
});
```

### 9. manage_omni_note
管理與 OmniCircle 關連的奧秘筆記（Omni Note）。

**參數**:
- `action` (string): 操作類型 (`create`/`update`/`link_log`/`mark_knowledge`/`delete`)
- `contextId` (string): 上下文 ID (通常為 Crystal UUID 或 Log ID)
- `content` (string): 筆記內容 (create/update 時必填)
- `logId` (string): 要關連的日誌 ID (link_log 時必填)
- `metadata` (object): 額外元數據 (可選)

**返回**: NoteData

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('manage_omni_note', {
  action: 'create',
  contextId: 'crystal_123',
  content: '發現潛在的性能瓶頸，建議進行深入調查。',
  metadata: { priority: 'high', tags: ['performance', 'investigation'] }
});
```

### 10. get_system_status
獲取 OmniCircle 系統狀態，包含性能統計與 5T 指標。

**參數**: 無

**返回**: SystemStatus
- `status` (string): 運行狀態
- `version` (string): 版本
- `uptime` (number): 運行時間
- `performance` (object): 性能統計
  - `totalRequests`: 總請求數
  - `averageDuration`: 平均耗時
  - `errorRate`: 錯誤率
  - `cacheHitRate`: 快取命中率

**示例**:
```typescript
const result = await omniCircleMCP.executeTool('get_system_status', {});
```

## Performance & Caching
### ⚡ 性能增強與快取

OmniCircle MCP 內置了高性能快取與監控機制：

### 1. 智能快取 (Cache Layer)
- **Redis & In-Memory**: 優先使用 Redis，無連接時自動降級至記憶體。
- **高頻優化**: 知識查詢 (`query_knowledge`) 與共振場 (`get_resonance_field`) 已高度優化。
- **5T 追蹤**: 每個快取項目都包含 `source_origin` 標記。

### 2. 性能監控 (Monitoring)
- **自動包裝**: 使用 `withMonitoring` 追蹤每個工具的健康狀況。
- **即時日誌**: 回應時間與成功率會自動記錄在 `PerformanceMonitor`。

## 5T Protocol (Standard 2026)
### 📊 5T 閉環協議 (Standard 2026)

遵循 OmniCircle 核心 5T 標準：

1. **Tangible (可感知)**: 🟢 透過視覺化指標與格式化標籤，使數據具象。
2. **Traceable (可溯源)**: 🟢 記錄所有操作的來源 (`source_origin`)。
3. **Trackable (可追蹤)**: 🟢 實作生命週期 Hook，追蹤數據流轉。
4. **Transparent (可驗算)**: 🟢 算法公開透明，支持零幻覺驗算。
5. **Trustworthy (不可篡改)**: 🔴 執行 Hash Lock，將數據轉化為永久資產。

## Integrated Platforms
### 🔗 集成平台

OmniCircle 支持與以下平台集成：

- **OmniSpace**: 基礎平台
- **Boost.Space**: 數據同步平台
- **AITable**: 表格數據平台
- **OmniNote**: 筆記平台
- **OmniTable**: 表格平台

## Best Practices
### 📝 最佳實踐

1. **利用快取**: 相同的頻繁查詢應依賴快取，避免重複計算。
2. **性能監測**: 定期調用 `get_system_status` 查看 `errorRate`。
3. **5T 標註**: 在調用工具時，儘量提供豐富的 `markers` 以增強溯源能力。
4. **錯誤處理**: 系統已內置自動重試與日誌記録，但客戶端仍應進行 UI 級別的降級處理。

## Testing
### 🧪 測試

```typescript
import { omniCircleMCP } from '@/integrations/omnicircle';

describe('OmniCircle MCP', () => {
  it('should orchestrate sentience', async () => {
    const result = await omniCircleMCP.executeTool('orchestrate_sentience', {
      intent: '測試意圖',
      domain: 'SENTIENCE',
      narrative: '測試敘述',
      resonance: 50,
      markers: ['test']
    });
    expect(result).toBeDefined();
    expect(result.crystalId).toBeDefined();
  });
});
```

## Related Documents
### 📚 相關文檔

- [OmniCircle 核心文檔](../src/core/OmniCircle.ts)
- [OmniKnowledgeBase 文檔](../src/services/OmniKnowledgeBase.ts)
- [OmniSyncService 文檔](../src/services/OmniSyncService.ts)

## Contribution
### 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## License
### 📄 許可證

MIT License

---

**OmniCircle MCP** - 讓數據無礙流轉！
