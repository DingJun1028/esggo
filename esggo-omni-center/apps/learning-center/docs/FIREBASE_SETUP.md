# Firebase 設定與部署（純 Spark 免費層，絕不產生費用）

本文件說明如何把「柏克萊 ESG 學習中心」接上 Firebase，讓學員提交的作業、提問、
問卷**永久儲存在雲端（Firestore）**，並能在「管理後台」跨裝置真實查閱、篩選、匯出、刪除。

> ⚠️ **本專案刻意不使用 Cloud Storage for Firebase。**
> Firebase 自 2024-09 起，Spark（免費）方案**不再提供任何 Cloud Storage 存取**，
> 呼叫會回傳 402/403 錯誤；Cloud Storage 僅 Blaze（需綁定信用卡的計費方案）可用。
> 為遵守「只用免費層、不產生費用」，附件一律在**前端讀成 base64 後內嵌進 Firestore 文件**，
> 完全不經 Cloud Storage。Firestore 單文件上限 1MB，故附件總量在 client 端被限制在 700KB。
>
> 若未完成下列 Firebase 設定，應用會自動**降級為 localStorage（僅本機、單機）**，
> 畫面右下角會顯示「本機暫存模式（未連接 Firebase）」作為提示，功能不會壞。

---

## 一、建立 Firebase 專案（Spark 免費方案）

1. 前往 https://console.firebase.google.com → 「新增專案」 → 命名（如 `esggo-learning-center`）。
   **不要**綁定付款方式，維持預設的 **Spark（No-cost）** 方案。
2. 專案建立後進入 **Build → Firestore Database** → 「建立資料庫」→ 選「正式環境」或「測試模式」。
   > 本專案**不需要** Build → Storage（我們不用 Cloud Storage）。
3. 進入 **Build → Authentication** → 「開始使用」→ **Sign-in method** → 啟用 **匿名（Anonymous）**。

---

## 二、註冊 Web 應用程式

1. 專案首頁點齒輪 → **專案設定 → 你的應用程式 → 網頁應用程式（</> 圖示）**。
2. 命名（如 `web-client`），**不要**勾選 Firebase Hosting，註冊。
3. 複製產生的 `firebaseConfig`（如下範例）：
   ```js
   const firebaseConfig = {
     apiKey: ***
     authDomain: "esggo-learning-center.firebaseapp.com",
     projectId: "esggo-learning-center",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef123456"
   };
   ```

---

## 三、寫入本機 .env

在專案根目錄複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env      # Windows: copy .env.example .env
```

把上面的 `firebaseConfig` 欄位對應填入 `.env`（變數名稱為 `VITE_FB_*`）：

```
VITE_FB_API_KEY=AIzaSyD...
VITE_FB_AUTH_DOMAIN=esggo-learning-center.firebaseapp.com
VITE_FB_PROJECT_ID=esggo-learning-center
VITE_FB_MESSAGING_SENDER_ID=1234567890
VITE_FB_APP_ID=1:1234567890:web:abcdef123456
VITE_FB_APP_ID_SLUG=esggo-learning-center
VITE_ADMIN_PASS=你的管理員密碼
```

> `.env` 已在 `.gitignore` 中，不會進版控。Vite 只會注入 `VITE_` 開頭的變數。

---

## 三之一、啟用 Google 登入（OAuth）

若需要讓學員用 Google 帳號登入（取代或搭配匿名登入）：

1. 在 Firebase Console → **Authentication → Sign-in method** → 點選 **Google** → 啟用。
2. 設定「專案支援信箱」（通常選你自己的 Gmail）。
3. 儲存後，前往 [GCP Console → APIs & Services → OAuth 同意畫面](https://console.cloud.google.com/apis/credentials/consent)：
   - 確認已設定 App 名稱、Support email。
   - **Authorized domains**：加入將要部署的網域（如 `your-app.web.app`）。
4. 回到 GCP Console → **Credentials** → 找到自動建立的 **Web client** OAuth 2.0 用戶端 ID，複製它。
5. 將該 Client ID 填入 `.env`：
   ```
   VITE_GOOGLE_OAUTH_CLIENT_ID=123456789-xxxxxxxx.apps.googleusercontent.com
   ```
6. 重新啟動開發伺服器（`npm run dev`），Google 登入按鈕即會出現。

> 💡 若只需匿名登入，可跳過此步驟；Google 登入為選配功能。

---

## 四、套用 Firestore 安全規則

本倉庫已附規則檔：`firestore.rules`、`firebase.json`（**已移除 storage 區塊**）。

若已安裝 Firebase CLI：
```bash
npm install -g firebase-tools
firebase login
firebase use --add        # 選擇你的專案
firebase deploy --only firestore:rules
```

也可在 Console 手動貼上內容：
- **Firestore Database → 規則** 貼 `firestore.rules`。

規則重點：
- 僅**已登入（匿名）**使用者可讀寫。
- Firestore 單文件 ≤ 1MB（規則內硬上限 1MB）；附件為 base64 內嵌，**總量限制 700KB**，
  由前端 `src/App.jsx` 的 `MAX_TOTAL_BYTES` 把關，單檔 ≤ 5MB。

---

## 五、部署前端（任意免費靜態主機）

```bash
npm install        # 確保依賴齊全（含 firebase）
npm run build      # 產出 dist/
# 部署 dist/ 到任意免費靜態主機（推薦 Firebase Hosting 免費層 / Vercel / Netlify / GitHub Pages）
```

> 若用 **Firebase Hosting**（同帳號 Spark 免費額度內），在 `firebase.json` 加回 `hosting` 區塊並執行
> `firebase deploy`。目前 `firebase.json` 只含 `firestore`，便於把靜態檔案部署到任何免費主機。
>
> 注意：匿名登入在 `localhost` 與你設定的正式網域都可用。
> 若正式網域報錯，請到 Authentication → Settings → Authorized domains 加入該網域。

---

## 六、資料結構

- 提交：`/artifacts/{appId}/public/data/submissions/{docId}`
  `{ docId: id, userId, type, data: {...}, createdAt: serverTimestamp() }`
  - `type` ∈ `upload | booking | question | survey`
  - `data.attachments` 存 `[{ name, type, size, url }]`，其中 `url` 就是 base64 data URL（下載用）。
    附件內嵌在文件內，**刪除文件即連帶刪除附件**，不需要也不會用到 Cloud Storage。
- 附件大小：前端限制單檔 ≤ 5MB、單筆總量 ≤ 700KB（對應 Firestore 1MB/文件上限）。

> 課程回放影片走 **Google Drive + Google Apps Script**（見 `docs/REPLAY_AUTOMATION.md`），
> 完全不經 Firebase，因此**零 Firebase 成本**。

---

## 七、管理後台使用

1. 右上角角色下拉切到「🛡️ 管理員視角」→ 輸入 `VITE_ADMIN_PASS` 進入。
2. 工具列可：依**類型**篩選、**關鍵字**搜尋（學員ID/內容）、依**日期區間**過濾、**重設**。
3. 每筆點擊**展開**查看類型化明細（作業備註/附件、預約時段、提問內容、問卷評分與回饋）。
4. 管理員可**刪除**單筆（附件隨文件一併刪除）、**匯出 CSV**（含所有欄位與附件連結）。

---

## 八、常見問題

- **畫面顯示「本機暫存模式」**：代表 `.env` 沒填或 Firebase 初始化失敗，請檢查 `.env` 欄位與是否誤用 `xxxx` 範例值。
- **匿名登入報錯**：到 Authentication → Sign-in method 確認已啟用 Anonymous，且網域已加入 Authorized domains。
- **附件上傳失敗 / 寫入報 quota 錯誤**：Firestore 單文件上限 1MB；若附件總量過大會溢位。
  請依前端提示（單檔 ≤ 5MB、總量 ≤ 700KB）縮小附件。我們**不使用 Cloud Storage**，故不會有 402/403 計費錯誤。
- **無法寫入**：Firestore 規則部署了嗎？未部署則預設拒絕寫入。
- **為什麼不用 Cloud Storage？** Spark 免費方案自 2024-09 起已停用 Cloud Storage，需 Blaze 計費帳戶。
  本專案為維持 $0 成本，附件改以 base64 內嵌 Firestore。
