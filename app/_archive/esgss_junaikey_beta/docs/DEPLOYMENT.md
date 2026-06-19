# InfoOne v8.1.0 - Vercel 部署指南 (Deployment Guide)

本指南引導您將 InfoOne 平台部署至生產環境，確保 5T 協議數據完整性與 AI 功能正常運行。

## 🚀 部署流程

### 1. Supabase 資料庫設定
1. 在 [Supabase](https://supabase.com) 建立專案。
2. 在 SQL Editor 執行 `supabase/migrations/20260215_schema_v8_1_0.sql` 中的腳本。
3. 取得 `URL`, `anon public` key, 與 `service_role` key。

### 2. 環境變數配置
在 Vercel 或本地 `.env.local` 設定以下變數：
- `NEXT_PUBLIC_SUPABASE_URL`: 專案網址
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 公開金鑰
- `SUPABASE_SERVICE_ROLE_KEY`: 管理金鑰 (加密存儲)
- `GEMINI_API_KEY`: Google AI Studio 產出的 API Key

### 3. Vercel 部署步驟
1. 連結 GitHub 儲存庫。
2. 匯入環境變數。
3. 執行 `npm run build`。

## 🛡️ 安全性檢查
- [ ] 啟用 Supabase RLS。
- [ ] 確認 `service_role` 金鑰未洩漏。
- [ ] 驗證 SHA-256 鎖定觸發器正常運作。

---
**負責人**: DingJun Hong
**版本**: v8.1.0
