# 商情偵測中心 API 路由整合說明

## 概述
商情偵測中心的 API 路由和控制器已經完成實作，需要將其整合到主路由系統中。

## 已建立的檔案

### 1. 類型定義
- **檔案路徑**: `src/types/intelligence/index.ts`
- **說明**: 包含所有商情偵測中心相關的 TypeScript 類型定義

### 2. 服務層
- **檔案路徑**: `src/services/IntelligenceDetectionService.ts`
- **說明**: 實作商情偵測中心的業務邏輯，使用單例模式

### 3. 控制器
- **檔案路徑**: `server/src/controllers/IntelligenceController.ts`
- **說明**: 實作所有 14 個 API 端點的控制器邏輯

### 4. 路由
- **檔案路徑**: `server/routes/intelligence.ts`
- **說明**: 定義 14 個 API 端點的路由配置

## 整合步驟

### 步驟 1: 在 server.ts 中加入 import 語句

在 `server/server.ts` 檔案中，找到其他路由的 import 語句（約在第 49 行附近），加入以下 import：

```typescript
import intelligenceRoutes from './routes/intelligence.js';
```

**位置**: 在 `import aiProxyRoutes from './routes/aiProxyRoutes.js';` 之後

### 步驟 2: 在 server.ts 中註冊路由

在 `server/server.ts` 檔案中，找到路由定義區域（約在第 403 行附近），在 `app.use('/api/ai-proxy', aiProxyRoutes);` 之後加入以下程式碼：

```typescript
// ============================================================================
// INTELLIGENCE DETECTION CENTER API
// ============================================================================
app.use('/api/intelligence', intelligenceRoutes);
```

### 完整範例

```typescript
// 在 import 區域（約第 49 行）
import aiProxyRoutes from './routes/aiProxyRoutes.js';
import intelligenceRoutes from './routes/intelligence.js';  // 新增這行

// 在路由定義區域（約第 403 行）
// Secure AI Proxy for Gemini
app.use('/api/ai-proxy', aiProxyRoutes);

// ============================================================================
// INTELLIGENCE DETECTION CENTER API
// ============================================================================
app.use('/api/intelligence', intelligenceRoutes);  // 新增這段

// ============================================================================
// NEWS INTELLIGENCE API - Cached (5 min)
// ============================================================================
```

## API 端點列表

整合完成後，以下 14 個 API 端點將可使用：

### 情報項目管理
1. `GET /api/intelligence/items` - 取得情報項目列表
2. `GET /api/intelligence/items/:id` - 取得單一情報項目
3. `POST /api/intelligence/items` - 建立情報項目
4. `PUT /api/intelligence/items/:id` - 更新情報項目
5. `DELETE /api/intelligence/items/:id` - 刪除情報項目

### 每日簡報管理
6. `GET /api/intelligence/daily-briefs` - 取得每日簡報列表
7. `GET /api/intelligence/daily-briefs/:id` - 取得單一每日簡報
8. `POST /api/intelligence/daily-briefs` - 建立每日簡報

### 趨勢與分析
9. `GET /api/intelligence/trends` - 取得趨勢預測列表
10. `GET /api/intelligence/categories` - 取得類別列表
11. `GET /api/intelligence/sources` - 取得來源列表
12. `GET /api/intelligence/tags` - 取得標籤列表

### 任務轉換
13. `POST /api/intelligence/items/:id/convert-to-task` - 轉換為任務

### 法規更新
14. `GET /api/intelligence/regulation-updates` - 取得法規更新對照表

### 健康檢查
15. `GET /api/intelligence/health` - API 健康檢查

## 認證與授權

- 大部分端點需要 JWT 認證（Bearer Token）
- 部分端點支援選擇性認證（允許匿名訪問）
- 請求標頭格式: `Authorization: Bearer <token>`

## 速率限制

- **讀取操作**: 100 請求 / 15 分鐘
- **寫入操作**: 30 請求 / 15 分鐘
- **分析操作**: 10 請求 / 15 分鐘

## 測試 API

整合完成後，可以使用以下命令測試 API：

```bash
# 健康檢查
curl http://localhost:3000/api/intelligence/health

# 取得情報項目列表（需要認證）
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/intelligence/items

# 取得類別列表（無需認證）
curl http://localhost:3000/api/intelligence/categories
```

## 錯誤處理

所有 API 端點都包含適當的錯誤處理，回應格式如下：

```json
{
  "success": false,
  "error": "錯誤訊息",
  "errorCode": "ERROR_CODE",
  "timestamp": "2026-02-11T08:00:00.000Z"
}
```

## Swagger 文件

路由檔案中包含 Swagger/OpenAPI 文件註解，可以使用 Swagger UI 查看 API 文件。

## 注意事項

1. 確保 Supabase 資料庫連線設定正確
2. 確保 JWT 認證中介軟體已正確設定
3. 確保資料庫遷移腳本已執行（8 個資料表已建立）
4. 建議在測試環境中先測試所有端點

## 完成檢查清單

- [ ] 在 server.ts 中加入 import 語句
- [ ] 在 server.ts 中註冊路由
- [ ] 重啟伺服器
- [ ] 測試健康檢查端點
- [ ] 測試所有 14 個 API 端點
- [ ] 驗證認證機制
- [ ] 驗證速率限制
- [ ] 驗證錯誤處理

## 參考文件

- API 設計: `docs/INTELLIGENCE_DETECTION_CENTER_API_DESIGN.md`
- 類型定義: `src/types/intelligence/index.ts`
- 服務層: `src/services/IntelligenceDetectionService.ts`
- 控制器: `server/src/controllers/IntelligenceController.ts`
- 路由: `server/routes/intelligence.ts`
