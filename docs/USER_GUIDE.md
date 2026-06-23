# ESGGO 使用指引

## 5T 協議不可篡改報告流程

### 步驟 1: 填寫數據單據

```
POST /api/esg/submission
{
  "griCode": "GRI 302-1",
  "values": { "ENERGY_TYPE": "電力", "CONSUMPTION": 1000 }
}
```

### 步驟 2: 提交報告 (生成 ZKP 證明)

```
POST /api/sustain-write
{
  "action": "generate",
  "userId": "uuid",
  "companyName": "公司名稱",
  "year": 2025
}
```

系統會：

1. 生成 Pedersen Commitment
2. 計算 Hash Lock
3. 儲存報告版本 (version=1)

### 步驟 3: 5T 合規驗證

```
GET /api/sustain-write/validate?reportId=uuid
```

驗證項目：

- Tangible (95 分): 數據具體且可見
- Traceable (90 分): 可追溯來源
- Trackable (85 分): 變更可追蹤
- Transparent (90 分): 透明公開
- Trustworthy (95 分): 經批準

### 步驟 4: 修改報告 (申請副本)

```
POST /api/sustain-write/modify
{
  "originalReportId": "uuid",
  "modifications": { "field": "newValue" }
}
```

系統會：

1. 克隆為新版本 (version+1)
2. 保留原始版本不可篡改
3. 新增歷史記錄

## API 端點總覽

| 端點                   | 方法     | 說明            |
| ---------------------- | -------- | --------------- |
| `/api/matrix`          | GET      | 矩陀路由查詢    |
| `/api/gri`             | GET/POST | GRI 標準與樣板  |
| `/api/cbam`            | GET/POST | CBAM 碳邊境計算 |
| `/api/sustain-write`   | GET/POST | 報告生成與修改  |
| `/api/data/integrator` | GET/POST | 數據串接與 OCR  |

## 部署選項

- **Supabase**: 無伺服器，自動擴展
- **Render**: VPS 容器化部署
- **Docker**: 自行建置
