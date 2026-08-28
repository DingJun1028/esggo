# Vercel + Firebase 部署模式 - ESGGO Learning Center

## 部署前檢查清單

1. **Firebase 設定**
   - [ ] `.env` 檔案包含有效 Firebase 配置
   - [ ] Google OAuth 生產環境域已加入授權域名
   - [ ] `firebase.json` 中的 `hosting.public` 指向 `dist`

2. **Vercel 設定**
   - [ ] 使用 `pnpm` 部署（Vercel 預設 pnpm@9）
   - [ ] `vercel.json` 設置正確的 SPA 路由重寫
   - [ ] 環境變數在 Vercel Dashboard 設定（不要在 vercel.json 內）

## Vercel 部署腳本

```bash
# 首次部署
vercel --prod

# 之後部署
vercel --prod --yes

# 驗證部署
curl -sS https://<your-domain>/ | grep -c "Berkeley"
```

## vercel.json 範本

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 環境變數配置

### 必須的 Vercel Secrets
- `VITE_FB_API_KEY`
- `VITE_FB_AUTH_DOMAIN`
- `VITE_FB_PROJECT_ID`
- `VITE_FB_STORAGE_BUCKET`
- `VITE_FB_MESSAGING_SENDER_ID`
- `VITE_FB_APP_ID`
- `VITE_FB_MEASUREMENT_ID`
- `VITE_GOOGLE_OAUTH_CLIENT_ID`

### 設置方式
```bash
# 使用 Vercel CLI
vercel env add VITE_FB_API_KEY <value> production
vercel env add VITE_FB_PROJECT_ID <value> production

# 或使用 Dashboard: Settings → Environment Variables
```

## Firebase + Vite 整合注意事項

1. **Vite 6 env 存取模式**
   ```js
   // 推薦寫法（Vite 6 相容）
   const config = {
     apiKey: import.meta.env?.VITE_FB_API_KEY || import.meta.env.VITE_FB_API_KEY || '',
     // ...
   };
   ```

2. **Firebase Spark 限制**
   - 無 Cloud Storage → 用 Firestore 存小檔案
   - Firestore 1MB/文件限制 → 附件總大小 < 700KB
   - 無自動快照 → 需要手動備份

3. **Google OAuth 生產環境配置**
   - Authorized domains: `<project-id>.web.app`, `<project-id>.firebaseapp.com`
   - Local dev: `localhost:5173`

## 常見錯誤排查

| 錯誤 | 原因 | 解決方法 |
|------|------|----------|
| `Invalid Firebase config` | env 變數未設定或為 placeholder | 檢查 Vercel Secrets |
| `auth/operation-not-allowed` | Google Sign-in 未啟用 | Firebase Console → Auth → Sign-in method |
| `404 on SPA routes` | vercel.json 缺少 rewrite | 確認 routes 包含 `/(.*)` → `/index.html` |
| `Build timeout` | pnpm install 太慢 | 使用 `vercel.json` 的 `maxDuration` 設定 |