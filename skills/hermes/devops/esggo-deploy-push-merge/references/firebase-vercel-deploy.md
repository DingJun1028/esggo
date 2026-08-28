# Firebase Hosting + Vercel 部署實證 Recipe (esggo)

來源：2026-08-06 實際部署回合。所有指令均已真實執行通過。

## A. Firebase Hosting 靜態部署

前提：`firebase` CLI 已登入（`firebase login:list` 顯示 dingjunhong1028@gmail.com）。
專案：`esggo-504004`（web app `1:1048542533112:web:531e88acf84ce8c5fc320d`）。

1. 確認 site 存在
   ```bash
   firebase hosting:sites:list --project esggo-504004
   # → Site ID: esggo-504004, Default URL: https://esggo-504004.web.app
   ```
2. 建 `firebase.json`（靜態托管 public/）
   ```json
   { "hosting": { "public": "public", "ignore": ["firebase.json","**/.*","**/node_modules/**","**/.git/**"] } }
   ```
3. 部署（帶 --project，不改 .firebaserc）
   ```bash
   firebase deploy --only hosting --project esggo-504004
   # → Deploy complete! Hosting URL: https://esggo-504004.web.app
   ```
4. public/ 至少含 index.html（否則 hosting 無內容）。

## B. 取真實 Firebase Web 配置

```bash
firebase apps:sdkconfig web --project esggo-504004
```
輸出 JSON 範例：
```json
{ "projectId":"esggo-504004",
  "appId":"1:1048542533112:web:531e88acf84ce8c5fc320d",
  "storageBucket":"esggo-504004.firebasestorage.app",
  "apiKey":"AIzaSy...xdSY",
  "authDomain":"esggo-504004.firebaseapp.com",
  "messagingSenderId":"1048542533112",
  "measurementId":"G-M8WC2E3K85" }
```
`apiKey` 的 `AIzaSy` 前綴是 Firebase 公開 Web Key 的正常樣式，非占位符。

## C. Vercel 無頭登入 + 設環境變數

1. Device flow 登入（無瀏覽器也可）
   ```bash
   vercel login --github
   # 終端印出 user_code（如 WTLH-WSLJ）→ 別處 OAuth 完成 → "Congratulations!"
   vercel whoami   # → dingjun1028
   ```
2. 更新 6 個 production 變數（先 rm 再 add，因 Vercel 禁止同名 overwrite）
   ```bash
   for V in NEXT_PUBLIC_FIREBASE_API_KEY NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
            NEXT_PUBLIC_FIREBASE_PROJECT_ID NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
            NEXT_PUBLIC_FIREBASE_APP_ID NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; do
     vercel env rm "$V" production -y >/dev/null
   done
   printf 'AIzaSy...xdSY\n'      | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
   printf 'esggo-504004.firebaseapp.com\n' | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
   printf 'esggo-504004\n'        | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
   printf 'esggo-504004.firebasestorage.app\n' | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
   printf '1:1048542533112:web:531e88acf84ce8c5fc320d\n' | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
   printf 'G-M8WC2E3K85\n'        | vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production
   ```
3. 驗證
   ```bash
   vercel env ls production | grep FIREBASE
   # → 6 行 Encrypted + 時間戳
   ```

## D. 注意事項
- Vercel project 連結在 `.vercel/project.json`（projectId `prj_chfQRaoQnAYiegt5PVjz9QfkwwBC`, name `esggo`, team `esggo`）。
- GitHub Secrets 已有 `VERCEL_TOKEN` / `VERCEL_API_KEY`，但本機讀不到其值；優先用 `vercel login --github` 建立本機憑證。
- Firebase 專案 `esg-sunshine`（.firebaserc 預設）與 `esggo-504004` 皆有 web app；部署目標以計畫為準，用 `--project` 切換，勿改 .firebaserc 以免影響其他 pipeline。
