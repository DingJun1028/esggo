# InfoOne Agent API Design Guide (API 設計指南)

**Version**: v1.1.0-Trinity  
**Strategy**: Integration-Analysis-Presentation Synchronization

---

## 1. 架構端點 (Endpoints)
| 層級 | 路徑片段 | 功能說明 |
| :--- | :--- | :--- |
| **整合層** | `/tasks` | 發起資料收集/擴充作業。回傳 `task_id`。 |
| **解析層** | `/tasks/{task_id}/analysis` | 執行 NLP、關係圖、預測。取得 Overview, Detail, Extension。 |
| **呈現層** | `/tasks/{task_id}/result` | 產出多媒體輸出 (JSON, CSV, PDF)。支援預覽與鑽取。 |

## 2. API 規範 (Standard Specifications)
1. **認證**：使用 `Authorization: ApiKey <key>` 或 OAuth 2.0。
2. **速率限制**：預設 200 req/min (可調整)。超限回傳 429。
3. **回應結構**：所有 JSON 均以 `info_one` 為根元素。
    - `overview`: 卡片式摘要。
    - `detail`: 完整結構化資料。
    - `extension`: 額外指標與預測。

## 3. 範例回應 (Example Response)
```json
{
  "info_one": {
    "request_id": "a1b2c3",
    "status": "completed",
    "overview": {
      "summary": "2023 年 Q1 營收成長 7.3%",
      "sentiment_score": 0.84
    },
    "detail": {
      "entities": [...],
      "relations": [...]
    },
    "extension": {
      "forecast": { "growth_rate_pct": 8.1 },
      "anomaly_detected": false
    }
  }
}
```

## 4. 錯誤代碼 (Error Codes)
| HTTP | 錯誤代碼 | 說明 |
| :--- | :--- | :--- |
| 400 | `INVALID_REQUEST` | 輸入參數不符合預期。 |
| 401 | `UNAUTHORIZED` | 缺少或無效的 API Key。 |
| 429 | `TOO_MANY_REQUESTS` | 超過配額。 |
| 500 | `INTERNAL_ERROR` | 服務暫時不可用。 |

---

## 5. 版本與遷移 (Versioning & Migration)
- **版本控制**：於路徑前置 `/v1.0`。
- **遷移建議**：舊版 `/v0.9` 仍可相容，但建議切換至 `info_one` 根標籤。
