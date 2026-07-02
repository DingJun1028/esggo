# ESGGO Error Codes & Functions Reference

## Error Codes Summary Table

| Code | HTTP Status | Message (ZH) | Message (EN) | Description |
|------|-------------|--------------|--------------|-------------|
| ERR_INVALID_PARAMS | 400 | 無效的請求參數 | Invalid request parameters | 請求參數驗證失敗 |
| ERR_UNAUTHORIZED | 401 | 未授權存取 | Unauthorized access | API Key 或認證無效 |
| ERR_FORBIDDEN | 403 | 禁止存取 | Forbidden | 無權限執行此操作 |
| ERR_NOT_FOUND | 404 | 資源不存在 | Resource not found | 請求的資源或資料不存在 |
| ERR_PROJECT_NOT_FOUND | 404 | 專案不存在 | Project not found | Village 專案 ID 不存在 |
| ERR_MEMBER_NOT_FOUND | 404 | 會員不存在 | Member not found | Village 會員 ID 不存在 |
| ERR_INSUFFICIENT_POINTS | 400 | PTS 點數不足 | Insufficient points | 投票所需點數不足 |
| ERR_RATE_LIMITED | 429 | 請求頻率過高 | Rate limited | 超過速率限制 |
| ERR_AI_RATE_LIMITED | 429 | AI 請求頻率過高 | AI rate limited | AI 服務速率限制 |
| ERR_EXTERNAL_SERVICE | 502 | 外部服務錯誤 | External service error | 調用外部 API 時發生錯誤 |
| ERR_BRIDGE_UNREACHABLE | 502 | 橋接服務不可達 | Bridge unreachable | 無法連接到下一代服務 |
| ERR_TASK_NOT_FOUND | 404 | 任務不存在 | Task not found | 請求的任務 ID 不存在 |
| ERR_USER_NOT_FOUND | 404 | 用戶不存在 | User not found | 請求的用戶 ID 不存在 |
| ERR_SKILL_NOT_FOUND | 404 | 技能不存在 | Skill not found | 請求的技能 ID 不存在 |
| ERR_UNKNOWN_TOOL | 400 | 未知的工具呼叫 | Unknown tool call | 不支援的工具類型 |
| ERR_INVALID_ACTION | 400 | 無效的操作 | Invalid action | 請求的操作類型無效 |
| ERR_ALERT_NOT_FOUND | 404 | 警示不存在 | Alert not found | 請求的警示 ID 不存在 |
| ERR_COMPANY_NOT_FOUND | 404 | 公司不存在 | Company not found | 請求的公司 ID 不存在 |
| ERR_SOURCE_NOT_FOUND | 404 | 來源不存在 | Source not found | 爬蟲來源 ID 不存在 |
| ERR_CRAWL_ERROR | 500 | 爬蟲任務失敗 | Crawl failed | ESG 爬蟲過程中發生錯誤 |
| ERR_INTERNAL | 500 | 內部伺服器錯誤 | Internal server error | 未預期的伺服器錯誤 |
| ERR_UNKNOWN | 500 | 未知錯誤 | Unknown error | 發生未預期的錯誤 |
| ERR_API_KEY_MISSING | 400 | 缺少 API 金鑰 | API key missing | 必需的 API 金鑰未設定 |
| ERR_EMBEDDING_FAILED | 500 | 向量生成失敗 | Embedding generation failed | 無法為查詢生成嵌入向量 |
| ERR_RAG_QUERY_FAILED | 500 | 知識檢索失敗 | RAG query failed | RAG 查詢過程中發生錯誤 |
| ERR_WORKFLOW_FAILED | 500 | 工作流程失敗 | Workflow failed | 工作流程執行失敗 |
| ERR_TASK_REQUIRED | 400 | task.id 和 task.taskType 為必填 | task.id and taskType required | 執行任務缺少必要參數 |
| ERR_BRIDGE_FAILURE | 502 | 橋接服務失敗 | Bridge failure | 橋接服務回傳失敗 |
| ERR_FAILURE_REASON_REQUIRED | 400 | failureReason 為必填 | failureReason required | OmniJules 缺少故障原因 |
| ERR_EVENT_REQUIRED | 400 | event body 為必填 | event body required | Swarm 廣播缺少事件資料 |

## Helper Functions Reference

### API Utilities (`@/lib/api-utils.ts`)

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `jsonResponse()` | 建立成功 JSON 回應 | `data`, `status` | `NextResponse` |
| `jsonError()` | 建立錯誤 JSON 回應 | `errorKey`, `customMessage` | `NextResponse` |
| `validateParams()` | 驗證參數完整性 | `params` | `{ valid, missing? }` |
| `validatePositiveNumber()` | 驗證正數值 | `value`, `fieldName` | `{ valid, error? }` |
| `sanitizeString()` | 字串 sanitization | `input`, `maxLength` | `string` |
| `generateId()` | 產生唯一 ID | `prefix` | `string` |
| `computeHash()` | 計算資料雜湊 | `data` | `string` |

### Error Handling Functions (`@/lib/errors.ts`)

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `createError()` | 建立錯誤回應 | `key`, `customMessage` | `Response` |
| `createSuccessResponse()` | 建立成功回應 | `data`, `message` | `Response` |

## Feature-Specific Helper Functions

### Village Module
| Function | Description |
|----------|-------------|
| `VILLAGE_HELPERS.validateVoteParams()` | 驗證投票參數 |

### User Module
| Function | Description |
|----------|-------------|
| `USER_HELPERS.validateUserId()` | 驗證用戶 ID |
| `USER_HELPERS.validateTaskParams()` | 驗證任務參數 |

### Sonnar Module
| Function | Description |
|----------|-------------|
| `SONAR_HELPERS.validateSourceId()` | 驗證來源 ID |

### RAG Module
| Function | Description |
|----------|-------------|
| `RAG_HELPERS.validateQuery()` | 驗證查詢參數 |

### Nexus Module
| Function | Description |
|----------|-------------|
| `NEXUS_HELPERS.validateToolCall()` | 驗證工具呼叫 |

### Cron Module
| Function | Description |
|----------|-------------|
| `CRON_HELPERS.validateJobName()` | 驗證工作名稱 |

### Gateway Module (`apps/gateway/errors.js`)
| Function | Description |
|----------|-------------|
| `jsonError()` | 建立錯誤 JSON 回應 |
| `jsonSuccess()` | 建立成功 JSON 回應 |

## Gateway Error Codes

| Code | HTTP Status | Message (ZH) | Message (EN) | Description |
|------|-------------|--------------|--------------|-------------|
| ERR_INVALID_PARAMS | 400 | 無效的請求參數 | Invalid request parameters | 請求參數驗證失敗 |
| ERR_UNAUTHORIZED | 401 | 未授權存取 | Unauthorized access | API Key 或認證無效 |
| ERR_NOT_FOUND | 404 | 資源不存在 | Resource not found | 請求的資源不存在 |
| ERR_SKILL_NOT_FOUND | 404 | 技能不存在 | Skill not found | 請求的技能 ID 不存在 |
| ERR_TASK_REQUIRED | 400 | task.id 和 task.taskType 為必填 | task.id and taskType required | 執行任務缺少必要參數 |
| ERR_FAILURE_REASON_REQUIRED | 400 | failureReason 為必填 | failureReason required | OmniJules 缺少故障原因 |
| ERR_EVENT_REQUIRED | 400 | event body 為必填 | event body required | Swarm 廣播缺少事件資料 |
| ERR_BRIDGE_FAILURE | 502 | 橋接服務失敗 | Bridge failure | 橋接服務回傳失敗 |
| ERR_BRIDGE_UNREACHABLE | 502 | 橋接服務不可達 | Bridge unreachable | 無法連接到下一代服務 |
| ERR_INTERNAL | 500 | 內部伺服器錯誤 | Internal server error | 未預期的伺服器錯誤 |

## Usage Examples
```typescript
import { jsonError, validateParams } from '@/lib/api-utils';

export async function POST(req: Request) {
  const { projectId, userId } = await req.json();
  
  const validation = validateParams({ projectId, userId });
  if (!validation.valid) {
    return jsonError('INVALID_PARAMS', `缺少參數: ${validation.missing}`);
  }
  
  // ... business logic
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "錯誤訊息",
  "code": "ERR_CODE"
}
```

### Success Response Format
```json
{
  "success": true,
  "message": "成功訊息",
  "data": {}
}
```

## HTTP Status Code Reference

| Status | Description |
|--------|-------------|
| 200 | OK - 成功 |
| 201 | Created - 已建立 |
| 202 | Accepted - 已接受 |
| 204 | No Content - 無內容 |
| 400 | Bad Request - 錯誤請求 |
| 401 | Unauthorized - 未授權 |
| 403 | Forbidden - 禁止 |
| 404 | Not Found - 不存在 |
| 405 | Method Not Allowed - 方法不允許 |
| 409 | Conflict - 衝突 |
| 422 | Unprocessable Entity - 無法處理的實體 |
| 429 | Too Many Requests - 請求過多 |
| 500 | Internal Server Error - 內部伺服器錯誤 |
| 502 | Bad Gateway - 錯誤閘道 |
| 503 | Service Unavailable - 服務不可用 |
| 504 | Gateway Timeout - 閘道超時 |