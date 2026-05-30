# 技術架構與資料設計

## 技術棧
- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Database:** Supabase PostgreSQL
- **Cloud Control:** BlueCC API Bridge + Hybrid Dispatcher
- **AI Engine:** Gemini 2.0 + OmniHermes + Genkit
- **Integrity Layer:** SHA-256 + ZKP + Audit Logs
- **Email / Notification:** Resend API
- **Security Layer:** RLS + API Connectors

## 響應式設計
所有頁面均已透過 `ClientLayout` 支援：
- 行動端底部導航
- 桌面端側邊欄
- Safe Area 優化
- 全域 RWD 適配

## 資料設計原則
1. 以 Supabase PostgreSQL 為正式資料結構映射目標  
2. 前端目前以 TypeScript Interface + Mock Array 作為 SEED  
3. 所有邏輯資料表均對應未來後端關聯式資料表  
4. 所有關鍵數據頁面皆具備 5T 標籤能力  

## 數據一致性策略
- 統一透過 `lib/db.ts` 作為 Supabase 接口層
- 確保全系統欄位與資料來源一致
- 降低前後端映射落差
- 強化模組間的資料同步能力

## 雲端與 AI 設計重點
平台整合 BlueCC Hybrid Control Plane，可根據工作負載進行本地與雲端協同。  
AI 層則透過 Gemini 2.0、OmniHermes 與 Genkit 工作流，提供生成、檢查、分析與輔助能力。

## 安全與可信設計
- 重要紀錄使用 SHA-256 進行加密封印
- 關鍵文件支援 ZKP 驗證狀態
- 所有生命週期變更可寫入審計日誌
- 敏感資料透過 RLS 進行保護