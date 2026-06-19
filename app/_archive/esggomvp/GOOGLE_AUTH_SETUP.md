# 🔑 Google OAuth2 Setup Guide (Google 登入設定指南)

為了啟動 ESG GO 系統的 Google 登入功能，請按照以下步驟在 Google Cloud Console 中進行設定，並更新您的環境變數。

## 1. Google Cloud Console 設定

1.  造訪 [Google Cloud Console](https://console.cloud.google.com/)。
2.  建立一個新專案，例如 `esg-go-auth`。
3.  導航至 **API 與服務 (APIs & Services)** > **OAuth 同意畫面 (OAuth consent screen)**：
    *   選擇 `User Type: External`。
    *   填寫應用程式名稱 (ESG GO) 及支援電子郵件。
4.  導航至 **憑證 (Credentials)** > **建立憑證 (Create Credentials)** > **OAuth 用戶端 ID (OAuth client ID)**：
    *   應用程式類型：`網頁應用程式 (Web application)`。
    *   **已授權的 JavaScript 來源 (Authorized JavaScript origins)**：
        *   `http://localhost:3000` (開發環境)
        *   `https://您的網域.vercel.app` (正式環境)
    *   **已授權的重新導向 URI (Authorized redirect URIs)**：
        *   `http://localhost:3000/api/auth/callback/google`
        *   `https://您的網域.vercel.app/api/auth/callback/google`
5.  建立後，您將獲得 **用戶端 ID (Client ID)** 與 **用戶端密鑰 (Client Secret)**。

## 2. 環境變數設定

請在專案根目錄的 `.env.local` 檔案中加入以下變數：

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=您的用戶端_ID
GOOGLE_CLIENT_SECRET=您的用戶端密鑰

# NextAuth Configuration
AUTH_SECRET=隨機生成的64位元字串 (可以使用 openssl rand -base64 32 生成)
NEXTAUTH_URL=http://localhost:3000
```

## 3. 代碼生效

設定完成後，重啟開發伺服器：
```bash
npm run dev
```

現在，您可以點擊登入頁面的「Google 登入」按鈕進行測試。

> [!IMPORTANT]
> 確保 `NEXTAUTH_URL` 在正式環境中更新為您的實際網域。
