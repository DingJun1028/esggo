---
uuid: "5a2fe3d8-50ad-4583-acbb-a8447443f863"
version: "1.0.0"
timestamp: "2026-06-04T10:36:12.296Z"
evidence: "VERCEL_ENV_SETUP.md"
---
# ESGGO 善向永續 — Vercel 部署與環境變數設定

請在 Vercel Dashboard → Settings → Environment Variables 設定以下變數，確保前後端雙向資料庫連線以及 AI 原生服務能正常啟動。

## 1. 核心變數 (Core Variables - 必填)

| Variable | Value Source / Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → `anon` public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → API → `service_role` (⚠️ 後端提權與 ZKP 封印用，請設為 Secret) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | esg-sunshine.firebaseapp.com |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | esg-sunshine |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | esg-sunshine.firebasestorage.app |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Cloud Messaging |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Google Analytics ID |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google AI Studio (用於 Firebase AI Logic 與前端調用) |
| `GOOGLE_API_KEY` | 同上 (若與 Gemini 相同可直接複製) |
| `NEXT_PUBLIC_SITE_URL` | https://esggo.vercel.app |
| `NEXT_PUBLIC_APP_URL` | https://esggo.vercel.app |

## 2. 擴充與整合變數 (Integration Variables - 選填)

| Variable | Purpose |
|---|---|
| `NCBDB_BASE_URL` | https://www.nocodebackend.com/ (NCBDB 主權展示層) |
| `NCBDB_PROJECT_ID` | NCBDB 專案 ID |
| `NCBDB_API_TOKEN` | NCBDB API 授權令牌 |
| `NCBDB_WEBHOOK_SECRET` | 用於 Webhook 誠信感測器安全驗證 |
| `NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL` | OmniAgent AI Gateway 位址 (http://127.0.0.1:8642) |
| `OMNIAGENT_API_URL` | OmniAgent API 後端位址 |
| `BROWSER_USE_API_KEY` | Browser Use Cloud V3 瀏覽器代理自動化 |
| `NOTION_API_KEY` / `SPACE_ID` | Notion 整合 |
| `FIRECRAW_API_KEY` | 網路爬蟲代理 |
| `RESEND_API_KEY` | 電子郵件自動化 |
| `OMNITABLE_API_KEY` | 知識聖殿數據基石 |
| `STRAICO_API_KEY` | 代理協調與多模態 |
| `BOOSTSPACE_TOKEN` | 全域同步與 MCP 集成 |

## 🚀 部署後續步驟 (Next Steps)
1. **資料庫 Migration**：確認生產環境的 `evidence_vault` 資料庫表已完成 Migration，包含 `zkp_proof` 與 `hash_lock` 欄位，確保 OmniAgent ZKP 封印能正確運作。
2. **檢視日誌**：進行首次生產建置，並檢視 Vercel / Firebase Logs 確保無 `PageNotFoundError`。

> ⚠️ 請勿將 `.env` 檔案內容直接貼到 Vercel — 請手動逐項輸入。
