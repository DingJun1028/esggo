# 完全代主自行 - 效能優化指南

## 概述

本文檔說明完全代主自行系統的效能優化策略與實現。

## 優化策略

### 1. 快取策略

#### LRU 快取
- **用途**: 快速存取常用資料
- **實現**: 基於 Least Recently Used 演算法
- **配置**:
  ```typescript
  const cache = new LRUCache({
    maxSize: 1000,  // 最大容量
    ttl: 5 * 60 * 1000,  // 5 分鐘過期
  });
  ```

#### 授權快取
- **授權快取**: 快取授權資料，避免重複查詢
  - 容量: 500 筆
  - TTL: 10 分鐘
- **驗證快取**: 快取驗證結果，加速授權檢查
  - 容量: 1000 筆
  - TTL: 2 分鐘
- **決策快取**: 快取決策結果，避免重複計算
  - 容量: 200 筆
  - TTL: 5 分鐘

### 2. 批次處理

#### 批次處理器
- **用途**: 將多個小請求合併為批次處理
- **配置**:
  ```typescript
  const processor = new BatchProcessor(
    async (items) => processItems(items),
    {
      batchSize: 10,  // 每批處理數量
      batchDelay: 100,  // 批次延遲 (ms)
    }
  );
  ```
- **優勢**:
  - 減少資料庫查詢次數
  - 降低網路負擔
  - 提高吞吐量

### 3. 連線池

#### 連線池管理
- **用途**: 管理資料庫/外部服務連線
- **配置**:
  ```typescript
  const pool = new ConnectionPool(
    () => createConnection(),
    (conn) => conn.close(),
    {
      minSize: 5,  // 最小連線數
      maxSize: 20,  // 最大連線數
    }
  );
  ```
- **優勢**:
  - 重用連線，減少建立/關閉開銷
  - 控制並發連線數
  - 防止連線耗盡

### 4. 效能監控

#### 效能監控器
- **用途**: 追蹤系統效能指標
- **功能**:
  - 記錄操作執行時間
  - 計算平均/最小/最大時間
  - 生成效能報告

## 使用範例

### 建立快取

```typescript
import { LRUCache, cacheManager } from './performance-optimizer';

// 建立自訂快取
const customCache = new LRUCache({
  maxSize: 500,
  ttl: 2 * 60 * 1000,
});

// 使用全域快取管理器
const delegation = cacheManager.getDelegation('delegation-id');
```

### 批次處理

```typescript
import { BatchProcessor } from './performance-optimizer';

const processor = new BatchProcessor(
  async (items) => {
    // 批量處理資料庫查詢
    return db.query('SELECT * FROM items WHERE id IN (?)', [items]);
  },
  { batchSize: 10 }
);

// 添加項目到批次
const result = await processor.add(itemId);
```

### 連線池

```typescript
import { ConnectionPool } from './performance-optimizer';

const pool = new ConnectionPool(
  () => createDatabaseConnection(),
  (conn) => conn.end(),
  { minSize: 5, maxSize: 20 }
);

// 獲取連線
const conn = await pool.acquire();
try {
  await conn.query('SELECT * FROM users');
} finally {
  pool.release(conn);
}
```

### 效能監控

```typescript
import { performanceMonitor } from './performance-optimizer';

// 記錄操作時間
const start = Date.now();
await performOperation();
performanceMonitor.record('operation', Date.now() - start);

// 獲取統計
const stats = performanceMonitor.getStats('operation');
console.log(`平均時間: ${stats.avgTime}ms`);

// 生成報告
const report = performanceMonitor.generateReport();
console.log(report);
```

## 效能指標

### 快取效率
- **命中率**: 快取命中次數 / 總查詢次數
- **目標**: > 80%

### 批次處理
- **批次大小**: 每批處理的項目數
- **批處理時間**: 批次處理的延遲時間
- **吞吐量**: 每秒處理的項目數

### 連線池
- **可用連線**: 池中可用的連線數
- **使用中連線**: 正在使用的連線數
- **等待時間**: 等待連線的時間

## 監控與告警

### Prometheus 指標

```yaml
# delegation_cache_hits_total
# delegation_cache_misses_total
# delegation_batch_size
# delegation_connection_pool_size
# delegation_operation_duration_seconds
```

### 告警規則

```yaml
groups:
  - name: delegation_performance
    rules:
      - alert: LowCacheHitRate
        expr: delegation_cache_hits_total / (delegation_cache_hits_total + delegation_cache_misses_total) < 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "快取命中率低於 80%"
```

## 最佳實踐

1. **選擇合適的快取大小**
   - 根據可用記憶體和資料量調整
   - 避免過大導致記憶體不足

2. **設定合理的 TTL**
   - 根據資料更新頻率調整
   - 平衡新鮮度和效能

3. **監控快取效率**
   - 定期檢查命中率
   - 根據結果調整配置

4. **使用批次處理**
   - 將多個小請求合併
   - 減少資料庫壓力

5. **管理連線池**
   - 根據並發需求調整大小
   - 避免連線耗盡

## トラブルシューティング

### 快取未命中率高
- 檢查快取大小是否足夠
- 檢查 TTL 是否過短
- 檢查快取鍵是否一致

### 批次處理延遲
- 檢查批次大小設定
- 檢查處理器執行時間
- 調整批次延遲參數

### 連線池耗盡
- 增加最大連線數
- 優化查詢執行時間
- 檢查連線釋放邏輯
