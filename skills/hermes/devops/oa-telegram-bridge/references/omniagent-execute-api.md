# OmniAgent Gateway `/execute` API 合約

來源：`/var/www/esggo/apps/gateway/omni-server.mjs` L588-665

## 路由
```
POST /execute
Headers: X-Omni-Token / X-Api-Key / Authorization: Bearer <key>
```

## 認證
`requireAuth` 中間件：
```js
const token = (req.headers['x-omni-token'] || req.headers['x-api-key'] || req.headers['authorization'] || '').replace('Bearer ', '');
if (!GATEWAY_KEY || !token || token !== GATEWAY_KEY) {
  return res.status(401).json({ error: 'Unauthorized: Invalid API Key', hint: 'Set X-Omni-Token header' });
}
```

## Body 格式（關鍵）
**錯誤（會 400）**：
```json
{"prompt": "hjhi4j4", "stream": false}
```
回應：`HTTP 400 {"error":"task.id and task.taskType required"}`

**正確**：
```json
{
  "task": {
    "id": "tg-1692960000",
    "taskType": "general",
    "prompt": "使用者訊息",
    "title": "前50字"
  },
  "skillId": "optional-override"
}
```

Gateway 檢查（L589）：
```js
const { task, skillId } = req.body;
if (!task?.id || !task?.taskType) return res.status(400).json({ error: 'task.id and taskType required' });
```

## 成功回應結構
```json
{
  "execution": { "id": "exec-xxx", "taskId": "...", "status": "completed", ... },
  "artifact": { "id": "art-xxx", "taskId": "...", "content": "<AI 回應>", "hashLock": "..." }
}
```
Bridge 應取 `artifact.content`。

## taskType 特例
- `esg-report` / `sustain-write` → 轉發 Next.js `/api/sustain-write/v5/async`（需 SITE_URL 環境變數）
- 其他 → `dispatchAI(task, resolved)` 本地/雲端模型推理

## 呼叫範例（Python）
```python
import urllib.request, json
req = urllib.request.Request(
    "http://127.0.0.1:8642/execute",
    data=json.dumps({"task": {"id": "tg-1", "taskType": "general", "prompt": "hi", "title": "hi"}}).encode(),
    method="POST",
    headers={"Content-Type": "application/json", "X-Omni-Token": GATEWAY_API_KEY}
)
r = json.loads(urllib.request.urlopen(req, timeout=60).read())
print(r["artifact"]["content"])
```
