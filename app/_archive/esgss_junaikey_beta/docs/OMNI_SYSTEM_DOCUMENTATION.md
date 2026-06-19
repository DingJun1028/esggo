# Omni System Documentation | 奧秘圓通系統文檔

**系統名稱**: Omni - 奧秘圓通全功能規劃  
**版本**: v1.0.0  
**更新日期**: 2026-02-09  
**核心理念**: 統一、智能、可擴展

---

## 📋 目錄

1. [系統概述](#系統概述)
2. [架構設計](#架構設計)
3. [核心服務](#核心服務)
4. [API 端點](#api-端點)
5. [使用範例](#使用範例)
6. [配置選項](#配置選項)
7. [測試指南](#測試指南)

---

## 系統概述

Omni（奧秘圓通）是 ESGss x JunAiKey Beta 的統一服務層，提供以下核心功能：

- **統一閘道** (OmniGateway): 所有服務的單一入口
- **智能代理** (OmniAgent): 自然語言處理和任務協調
- **監控服務** (OmniMonitor): 系統健康和性能追蹤
- **快取服務** (OmniCache): 高性能記憶體快取
- **任務佇列** (OmniQueue): 可靠的任務排程
- **統一路由** (OmniRoute): RESTful API 端點

---

## 架構設計

```
┌─────────────────────────────────────────────────────────────────┐
│                        OmniRoute (API Layer)                      │
│  /api/omni/health, /api/omni/gateway/*, /api/omni/agent/*       │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OmniOrchestrator                             │
│                 (統一初始化和協調)                                 │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   OmniGateway     │  │   OmniAgent      │  │   OmniMonitor    │
│  (服務閘道)       │  │  (智能代理)       │  │  (監控服務)       │
│                  │  │                  │  │                  │
│ - 服務註冊表      │  │ - 意圖識別        │  │ - 健康檢查       │
│ - 智能路由        │  │ - 任務分解        │  │ - 指標收集       │
│ - 請求分發        │  │ - 會話管理        │  │ - 警報管理       │
│ - 中介軟體        │  │                  │  │ - 性能追蹤       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   OmniCache       │  │   OmniQueue      │  │   Existing       │
│  (快取服務)       │  │  (任務佇列)       │  │   Services       │
│                  │  │                  │  │                  │
│ - LRU/LFU/FIFO   │  │ - 優先級佇列      │  │ - OmniCRMService │
│ - TTL 管理        │  │ - 重試機制        │  │ - OmniTableService│
│ - 持久化          │  │ - 延遲任務        │  │ - OmniNoteService │
│ - 預熱            │  │ - 工作者管理      │  │ - 更多...        │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 核心服務

### 1. OmniGateway（統一閘道）

作為所有 Omni 服務的統一入口，提供智能路由和負載均衡。

**主要功能**:
- 服務註冊和發現
- 請求路由和分發
- 中介軟體鏈
- 錯誤處理

**使用範例**:

```typescript
import { createOmniGateway, createOmniRequest } from './services/OmniGateway.js';

const gateway = createOmniGateway();
await gateway.initialize();

// 創建請求
const request = createOmniRequest(
    'CRM',           // 服務類型
    'contacts',      // 操作
    { prompt: 'Add John Doe' }, // 負載
    { userId: '123' } // 上下文
);

// 處理請求
const response = await gateway.processRequest(request);
```

### 2. OmniAgent（智能代理）

提供自然語言處理能力，能理解用戶意圖並協調多個服務完成任務。

**主要功能**:
- 自然語言理解
- 意圖識別和實體提取
- 任務分解
- 會話管理

**使用範例**:

```typescript
import { createOmniAgent, createNaturalLanguageRequest } from './services/OmniAgent.js';

const agent = createOmniAgent();
await agent.initialize();

// 自然語言請求
const request = createNaturalLanguageRequest(
    'Add a new contact for Alice from Google, email alice@google.com',
    'user_123'
);

// 處理請求
const response = await agent.processNaturalLanguage(request);

console.log(response.metadata.intent);    // 'CREATE_CONTACT'
console.log(response.metadata.confidence); // 0.85
```

**支援的意圖**:
- `CREATE_CONTACT`: 新增聯絡人
- `CREATE_DEAL`: 新增商機
- `BUSINESS_DEVELOPMENT`: 業務開發
- `GENERATE_TABLE`: 生成表格
- `GENERATE_CHART`: 生成圖表
- `GENERATE_DASHBOARD`: 生成儀表板
- `CREATE_NOTE`: 建立筆記
- `ANALYZE`: 分析

### 3. OmniMonitor（監控服務）

提供全面的系統監控和健康檢查功能。

**主要功能**:
- 服務健康檢查
- 指標收集和聚合
- 警報管理
- 性能追蹤

**使用範例**:

```typescript
import { createOmniMonitor } from './services/OmniMonitor.js';

const monitor = createOmniMonitor();
await monitor.initialize();

// 健康檢查
const health = await monitor.getHealth();
console.log(health.overall); // 'HEALTHY', 'DEGRADED', or 'DOWN'

// 獲取指標
const metrics = monitor.getMetrics();
const aggregated = monitor.getAggregatedMetrics();

// 訂閱警報
monitor.subscribeToAlerts(alert => {
    console.log(`[${alert.severity}] ${alert.message}`);
});
```

### 4. OmniCache（快取服務）

提供高性能的記憶體快取，支持多種快取策略。

**主要功能**:
- LRU / LFU / FIFO 策略
- TTL 過期
- 標籤過濾
- 持久化
- 預熱

**使用範例**:

```typescript
import { createOmniCache } from './services/OmniCache.js';

const cache = createOmniCache({
    maxSize: 10000,
    defaultTTL: 3600000, // 1小時
    strategy: 'LRU'
});
await cache.initialize();

// 設置快取
await cache.set('user_123', { name: 'Alice', email: 'alice@test.com' }, 300000);

// 獲取快取
const user = await cache.get('user_123');

// 清除快取
await cache.clear();

// 按標籤刪除
await cache.deleteByTags(['session', 'temp']);

// 獲取統計
const stats = await cache.getStats();
console.log(`Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%`);
```

### 5. OmniQueue（任務佇列）

提供可靠的任務排程和處理系統。

**主要功能**:
- 優先級佇列
- 重試機制
- 延遲任務
- 工作者管理
- 持久化

**使用範例**:

```typescript
import { createOmniQueue, createOmniScheduler } from './services/OmniQueue.js';

const queue = createOmniQueue({
    name: 'tasks',
    maxConcurrent: 10,
    maxRetries: 3
});
await queue.initialize();

// 添加任務
const task = await queue.enqueue(
    'send_email',
    { to: 'alice@test.com', subject: 'Hello' },
    { priority: 'HIGH' }
);

// 批量添加
const tasks = await queue.enqueueBatch([
    { type: 'task_1', payload: { data: 1 }, priority: 'NORMAL' },
    { type: 'task_2', payload: { data: 2 }, priority: 'URGENT' }
]);

// 獲取統計
const stats = await queue.getStats();
console.log(`Pending: ${stats.pending}, Processing: ${stats.processing}`);

// 排程延遲任務
const scheduler = createOmniScheduler();
await scheduler.schedule(
    'cleanup',
    { scope: 'daily' },
    3600000, // 1小時後執行
    { jobId: 'daily_cleanup' }
);
```

### 6. OmniRoute（統一路由）

提供 RESTful API 端點來訪問所有 Omni 功能。

**使用範例**:

```typescript
import { createOmniRoute } from './routes/OmniRoute.js';

const route = createOmniRoute({
    prefix: '/api/omni',
    enableAuth: false
});
await route.initialize();

const router = route.getRouter();
// 將 router 添加到 Express 應用
app.use(route.getPrefix(), router);
```

---

## API 端點

### 健康檢查

```http
GET /api/omni/health
GET /api/omni/health/detailed
```

**回應**:
```json
{
  "success": true,
  "data": {
    "overall": "HEALTHY",
    "services": {
      "OmniCRMService": "HEALTHY",
      "OmniTableService": "HEALTHY"
    },
    "uptime": 1234.56
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": 1234567890,
    "version": "1.0.0"
  }
}
```

### Gateway API

```http
POST /api/omni/gateway/process
Content-Type: application/json

{
  "type": "CRM",
  "action": "contacts",
  "payload": {
    "operation": "create",
    "prompt": "Add John Doe"
  },
  "context": {
    "userId": "user_123"
  }
}
```

### Agent API

```http
POST /api/omni/agent/chat
Content-Type: application/json

{
  "text": "Add a new contact for Alice from Google",
  "userId": "user_123",
  "sessionId": "session_456"
}
```

### Monitor API

```http
GET /api/omni/monitor/metrics
GET /api/omni/monitor/alerts
POST /api/omni/monitor/alerts/:alertId/acknowledge
POST /api/omni/monitor/alerts/:alertId/resolve
```

### Cache API

```http
GET /api/omni/cache/stats
DELETE /api/omni/cache
DELETE /api/omni/cache/by-tags
Content-Type: application/json

{
  "tags": ["session", "temp"]
}
```

### Queue API

```http
GET /api/omni/queue/stats
POST /api/omni/queue/enqueue
POST /api/omni/queue/enqueue-batch
GET /api/omni/queue/pending
GET /api/omni/queue/failed
DELETE /api/omni/queue/tasks/:taskId
POST /api/omni/queue/tasks/:taskId/retry
DELETE /api/omni/queue/clear-failed
```

### Scheduler API

```http
POST /api/omni/scheduler/schedule
DELETE /api/omni/scheduler/jobs/:jobId
```

---

## 使用範例

### 完整初始化

```typescript
import { createOmni } from './services/Omni.js';

const omni = createOmni({
    gateway: {
        prefix: '/api/omni',
        enableAuth: false
    },
    cache: {
        maxSize: 10000,
        defaultTTL: 3600000,
        strategy: 'LRU'
    },
    queue: {
        name: 'main_queue',
        maxConcurrent: 10
    }
});

await omni.initialize();

// 使用各服務
const gateway = omni.getGateway();
const agent = omni.getAgent();
const monitor = omni.getMonitor();
const cache = omni.getCache();
const queue = omni.getQueue();

// 健康檢查
const health = await omni.healthCheck();
console.log(health);
```

### 自然語言處理工作流

```typescript
import { createOmniAgent, createNaturalLanguageRequest } from './services/OmniAgent.js';

const agent = createOmniAgent();
await agent.initialize();

// 處理用戶請求
const requests = [
    'Create a new contact for Bob from Microsoft',
    'Generate a sales chart for Q4',
    'Add a note about the meeting'
];

for (const text of requests) {
    const request = createNaturalLanguageRequest(text, 'user_123');
    const response = await agent.processNaturalLanguage(request);
    
    console.log(`Intent: ${response.metadata.intent}`);
    console.log(`Success: ${response.success}`);
    
    if (response.suggestion) {
        console.log(`Suggestion: ${response.suggestion}`);
    }
}
```

### 快取加速

```typescript
import { createOmniCache } from './services/OmniCache.js';

const cache = createOmniCache({
    maxSize: 5000,
    defaultTTL: 1800000,
    strategy: 'LRU'
});
await cache.initialize();

// 快取用戶會話
async function getCachedUser(userId: string) {
    // 檢查快取
    let user = await cache.get(userId);
    
    if (!user) {
        // 從資料庫獲取
        user = await database.getUser(userId);
        // 存入快取
        await cache.set(userId, user);
    }
    
    return user;
}
```

### 延遲任務處理

```typescript
import { createOmniQueue, createOmniScheduler } from './services/OmniQueue.js';

const queue = createOmniQueue({ name: 'reports' });
const scheduler = createOmniScheduler();
await Promise.all([queue.initialize(), scheduler.initialize()]);

// 排程報告生成
await scheduler.schedule(
    'generate_report',
    {
        type: 'monthly',
        format: 'pdf',
        recipients: ['manager@company.com']
    },
    86400000, // 24小時後
    { jobId: 'monthly_report' }
});

// 處理緊急任務
await queue.enqueue(
    'urgent_notification',
    { message: 'System alert', priority: 'high' },
    { priority: 'URGENT' }
);
```

---

## 配置選項

### Omni 整體配置

```typescript
interface OmniConfig {
    gateway?: {
        prefix?: string;          // API 前綴，預設: '/api/omni'
        enableAuth?: boolean;      // 啟用認證，預設: true
        rateLimit?: number;       // 速率限制，預設: 100
    };
    cache?: {
        maxSize?: number;         // 最大快取大小，預設: 10000
        defaultTTL?: number;      // 預設 TTL (ms)，預設: 3600000
        strategy?: 'LRU' | 'LFU' | 'FIFO';
        enablePersistence?: boolean;
    };
    queue?: {
        name?: string;            // 佇列名稱
        maxConcurrent?: number;   // 最大並發數，預設: 10
        defaultTimeout?: number;  // 預設超時 (ms)
        maxRetries?: number;      // 最大重試次數，預設: 3
        enablePersistence?: boolean;
    };
}
```

### 環境變數

```bash
# 快取配置
OMNI_CACHE_MAX_SIZE=10000
OMNI_CACHE_TTL=3600000
OMNI_CACHE_STRATEGY=LRU

# 佇列配置
OMNI_QUEUE_MAX_CONCURRENT=10
OMNI_QUEUE_MAX_RETRIES=3

# Gateway 配置
OMNI_PREFIX=/api/omni
OMNI_AUTH_ENABLED=false
```

---

## 測試指南

### 運行整合測試

```bash
npx tsx test_omni.ts
```

### 測試覆蓋

- Gateway 初始化和請求處理
- Agent 自然語言理解
- Monitor 健康檢查和指標收集
- Cache 快取操作和統計
- Queue 任務佇列和排程

### 預期輸出

```
🧪 Starting Omni (奧秘圓通) Integration Tests...

✅ Initialize Omni (123ms)
✅ Gateway Health Check (45ms)
✅ Gateway Service Info (12ms)
✅ Gateway Process Request (67ms)
✅ Agent NLP Processing (234ms)
✅ Agent Intent Recognition (89ms)
✅ Monitor Health Check (34ms)
✅ Monitor Metrics (23ms)
✅ Cache Set/Get (56ms)
✅ Cache Stats (12ms)
✅ Queue Enqueue (78ms)
✅ Queue Stats (45ms)
✅ Overall Health Check (23ms)

📊 Test Results Summary:
Total: 13
Passed: 13
Failed: 0
```

---

## 下一步

1. **擴展 Agent 能力**: 整合更多 AI 模型
2. **分布式支援**: 添加 Redis 適配器
3. **GraphQL API**: 可選的 GraphQL 端點
4. **WebSocket 即時**: 添加 WebSocket 支援
5. **Metrics 儀表板**: 整合 Grafana/Prometheus

---

## 聯繫與支援

如需幫助或建議，請聯繫系統管理員或提交 Issue。

---

**文檔版本**: v1.0.0  
**最後更新**: 2026-02-09  
**維護者**: ESGss Team
