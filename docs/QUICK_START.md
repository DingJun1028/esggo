# ESGGO 快速入門指南

## 歡迎使用 ESGGO 善向永續

### 系統概覽

- **OmniAgent**: 智能代理系統
- **5T 協議**: 資料完整性保護 (Tangible, Traceable, Trackable, Transparent, Trustworthy)
- **OmniMatrix**: 萬能矩陀路由系統 (55 核心路由)
- **GRI 標準**: 28 個專家模板，一鍵生成報告
- **品牌客製化**: 报告樣式自動適配品牌色系
- **數據串接**: OCR、API、ERP、人資、財務系統整合

### 快速開始

1. **註冊/登入**

   - 前往 `/login` 使用 Google 帳號或電子郵件
   - 系統會自動建立品牌設定

2. **設定品牌與樣式**

   - 前往 `/profile` 設定品牌色系與報告樣式
   - 系統提供 classic、modern、executive 三種模板

3. **數據輸入**

   - 前往 `/dashboard/matrix` 觀看矩陀路由
   - 前往 `/data-sources` 串接企業數據 (ERP/HR/Finance)
   - 或使用 `/vault` 上傳佐證文件 (支援 OCR)

4. **生成永續報告**
   - 前往 `/sustain-write` 選擇 GRI 標準
   - 前往 `/cbam-calculator` 計算碳邊境稅款
   - 系統自動生成 200+ 頁永續報告
   - 前往 `/publish` 預覽與下載

### 功能列表

| 功能      | 說明          | 位置                        |
| --------- | ------------- | --------------------------- |
| 儀表板    | 績效總覽      | /dashboard                  |
| 矩陀路由  | 55 核心功能   | /dashboard/matrix           |
| GRI 標準  | 28 個專家模板 | /gri                        |
| CBAM 計算 | 歐盟碳邊境    | /cbam-calculator            |
| 萬能典藏  | 加密文件儲存  | /vault                      |
| 萬能書櫃  | 閱讀室與新聞  | /reading-room               |
| 永續撰寫  | 報告草稿      | /sustain-write              |
| 數據串接  | OCR/API 串接  | /data-sources               |
| 報告生成  | 200 頁報告    | /api/sustain-write/generate |

### API 端點

```bash
GET  /api/matrix              # 矩陀路由查詢
GET  /api/gri                 # GRI 標準
POST /api/sustain-write/generate # 生成永續報告
POST /api/cbam                 # CBAM 計算
POST /api/vault/indicators     # 數據串接與 OCR
```

### 支援的模型

- **文字模型**: gpt-3.5-turbo (OpenRouter)
- **圖片模型**: llava-phi3 (本地 Ollama)
- **備用**: gemini-pro-vision

### 聯繫支援

- 電子郵件: dingjunhong1028@gmail.com
- GitHub: https://github.com/esggo
