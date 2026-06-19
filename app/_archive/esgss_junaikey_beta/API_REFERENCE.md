# API Reference

**?**: ESGss x JunAiKey Beta  
**API ?**: v1  
**?箇? URL**: `http://localhost:8080` (?) / `https://esg-backend-service-*.run.app` (?)

---

## 隤?

???API ?閬 Header 銝剖??怨?霅?閮?

```
Authorization: Bearer <JWT_TOKEN>
X-API-Secret: <API_SECRET_TOKEN>
```

---

## ?踵??澆?

### ???踵?

```json
{
  "success": true,
  "data": {
    /* 隢????*/
  }
}
```

### ?航炊?踵?

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "?航炊閮?膩"
  }
}
```

---

## ?亙熒瑼Ｘ API

### `GET /api/health`

瑼Ｘ???亙熒???
**?踵?**:

```json
{
  "status": "ok",
  "timestamp": "2026-01-18T01:40:00.000Z",
  "uptime": 12345,
  "services": {
    "database": "connected",
    "redis": "connected",
    "ai": "ready"
  }
}
```

---

## ?啗? API

### `GET /api/news`

?脣? AI ?刻??ESG ?賊??啗???
**?踵?**:

```json
{
  "news": [
    {
      "id": "news_123",
      "title": "?啗?璅?",
      "summary": "?啗???",
      "category": "ESG",
      "sentiment": "positive",
      "publishedAt": "2026-01-17T10:00:00Z"
    }
  ]
}
```

---

## 代稱 (Agent) API

### `GET /api/agents`

?脣???誨??銵具?
**?踵?**:

```json
{
  "agents": [
    {
      "id": "agent_001",
      "name": "??撣思誨??,
      "role": "analyst",
      "status": "active",
      "level": 5,
      "isAwakened": true
    }
  ]
}
```

### `POST /api/agents`

?萄遣?唬誨??
**隢?**:

```json
{
  "name": "New Agent",
  "role": "analyst",
  "capabilities": ["data_analysis"]
}
```

**?踵?**:

```json
{
  "agent": {
    "id": "agent_002",
    "name": "New Agent",
    "role": "analyst",
    "createdAt": "2026-01-18T01:40:00Z"
  }
}
```

---

## 驗算 (Awakening) API

### JavaScript API

```typescript
import { executeBilateralSynchronizationAwakening } from '@/omni/rituals/BilateralSynchronizationAwakening';

const result = await executeBilateralSynchronizationAwakening();
```

**?踵?**:

```typescript
{
  success: boolean;
  ritual: {
    zh: string;
    en: string;
    shortName: string;
    symbol: string;
  }
  duration: string; // "1.27"
  frontend: true;
  phases: {
    p1: {
      insights: number;
    }
    p2: {
      transmitted: boolean;
    }
    p3: {
      servicesAwakened: number;
    }
    p4: {
      syncCount: number;
    }
  }
  message: string;
}
```

### 鈭辣撱? API

```typescript
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster';

// 閮???隞?const unsub = awakeningBroadcaster.subscribe(event => {
  console.log(event.type, event.data);
});

// 閮瘣?鈭辣
const unsub2 = awakeningBroadcaster.subscribeToInsights(insight => {
  console.log(insight.title, insight.message);
});
```

**鈭辣憿?**:

- `phase-changed` - 階段霈鈭辣
- `service-awakened` - ??驗算鈭辣
- `awakening-completed` - 驗算摰?鈭辣
- `eternal-anchored` - 瘞豢??典?鈭辣
- `genesis-achieved` - Genesis ?停鈭辣

---

## RAG 瑼Ｙ揣 API

### `POST /api/rag/query`

?瑁? RAG 瑼Ｙ揣??
**隢?**:

```json
{
  "query": "憒???隡平 ESG 銵函",
  "context": "sustainability"
}
```

**?踵?**:

```json
{
  "answer": "ESG 撱箄降...",
  "sources": [
    {
      "document": "esg_guide.pdf",
      "page": 1,
      "relevance": 0.95
    }
  ]
}
```

---

## Swarm API

### `POST /api/swarm/run`

?瑁? LangGraph Swarm??
**隢?**:

```json
{
  "task": "?? ESG ?勗?",
  "agents": ["analyst", "writer", "reviewer"]
}
```

**?踵?**:

```json
{
  "status": "completed",
  "result": {
    "analysis": "...",
    "recommendations": ["..."]
  }
}
```

---

## ?憛? API

### `POST /api/blockchain/anchor`

撠?摰?憛???
**隢?**:

```json
{
  "data": { "type": "esg_report", "id": "report_123" },
  "hash": "0xabc..."
}
```

**?踵?**:

```json
{
  "txHash": "0x123...",
  "blockNumber": 12345,
  "timestamp": "2026-01-18T01:40:00Z"
}
```

---

## ?航炊蝣?
| ?航炊蝣?| 隤芣? |
| ----- | ---- |
| `AUTH_REQUIRED` | ?閬?霅?|
| `INVALID_TOKEN` | Token ?⊥? |
| `NOT_FOUND` | 鞈?銝???|
| `VALIDATION_ERROR` | 撽?憭望? |
| `INTERNAL_ERROR` | ?折隡箸??券隤?|
| `SERVICE_UNAVAILABLE` | ??銝??|

---

## Rate Limiting

- **?**: 100 隢? / 15 ?? / IP
- **Header**: `X-RateLimit-Remaining`

---

## WebSocket API

### `ws://localhost:8080/ws/awakening`

驗算鈭辣撖行??券?
**鈭辣?澆?**:

```json
{
  "type": "awakening-update",
  "phase": "AWAKENING",
  "progress": 75
}
```

---

**?敺??*: 2026-01-18  
**蝬剛風??**: ESG Sunshine Team

