# ESG GO — Vercel 環境變數設定

請在 [Vercel Dashboard → Settings → Environment Variables](https://vercel.com/team_ftbNvUrnTqZ13QWbUwNaIr7W/esggo-original/settings/environment-variables) 設定以下變數：

## 必要 (Production)

| Variable | Value Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → service_role (⚠️ 請保密) |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google AI Studio → API Keys |
| `GOOGLE_API_KEY` | 同上 |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Authentication |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Storage |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Cloud Messaging |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Console → Analytics |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Console → Project Settings → Service Accounts (JSON 字串) |
| `NEXT_PUBLIC_SITE_URL` | `https://esggo-original.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://esggo-original.vercel.app` |

## 選用 (依功能)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_HERMES_GATEWAY_URL` | OmniAgent AI Gateway 位址 |
| `BLUE_CC_API_KEY` | BlueCC 混合運算 |
| `BLUE_CC_TOKEN` | BlueCC Token |
| `NOTION_API_KEY` | Notion 整合 |
| `RESEND_API_KEY` | Email 發送 (Resend) |

> ⚠️ 請勿將 `.env` 檔案內容直接貼到 Vercel — 請手動逐項輸入。  
> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` 與 `FIREBASE_SERVICE_ACCOUNT_KEY` 請設定為 **Secret** (非 Plain Text)。
