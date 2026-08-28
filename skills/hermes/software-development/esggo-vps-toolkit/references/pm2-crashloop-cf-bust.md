# PM2 crash loop 拖垮 CI 部署 + Cloudflare 緩存繞過 — 實戰配方

來源：2026-08-14 會話。FTG 3.0 靜態站 SCP 上線後，GitHub Actions `Deploy to Oracle VPS`
(esggo deploy-oracle.yml) 變紅。診斷與修復如下。

## 一、PM2 重複實例 crash loop（CI 變紅的真因）

### 症狀
CI `Deploy to VPS` step exit 1，日誌尾：
```
[PM2][ERROR] Process 15 not found
TypeError: Cannot read properties of undefined (reading 'pm2_env')
    at API.speedList (pm2/lib/API.js:1718:25)
##[error]Process completed with exit code 1.
```

### 診斷（用 gh，不需 VPS 憑證）
```bash
gh run list --limit 10 --json databaseId,name,status,conclusion,headSha
# 找 Deploy to Oracle VPS 的 databaseId
gh run view <run_id> --log-failed | tail -50
```
日誌顯示 pm2 restart 時讀到不存在的 process id → pm2 自身 TypeError。

進 VPS 看真因：
```bash
pm2 list | grep -E "esggo-core|omni|util|stt"
pm2 describe esggo-core        # 看 status / restarts / uptime
sudo tail -30 /var/www/esggo/logs/error.log
sudo lsof -ti:3000            # 看誰佔 port
```
典型發現：`restarts: 1921`, `uptime: 12s`, error.log 滿是
`Error: listen EADDRINUSE: address already in use 127.0.0.1:3000`。
pm2 上有多個同名 esggo-core 實例（id 12/13/15/16/17）搶同一 port。

### 修復（VPS 上執行）
```bash
pm2 delete esggo-core 2>&1 | tail -1     # 清掉所有重複實例
sleep 2
sudo fuser -k 3000/tcp 2>/dev/null || true   # 釋放被舊 next-server 佔用的 port
sleep 2
cd /var/www/esggo && pm2 start ecosystem.config.cjs --only esggo-core
sleep 6
pm2 list | grep -c esggo-core              # 必須 = 1
curl -sS -m6 -o /dev/null -w "%{http_code}" http://localhost:3000/   # 200 或 404 都算活
pm2 save
```
確認單一實例後重跑 CI：
```bash
gh run rerun <run_id> --failed
```
→ conclusion: success。

### 防範（給 CI workflow 的建議，非強制）
在 `pm2 start ecosystem.config.cjs` 前加：
```bash
pm2 delete esggo-core 2>/dev/null || true
```
避免每次 push 累積重複實例。ecosystem.config.cjs 本身只定義一次服務即正確。

## 二、Cloudflare 4h 緩存讓 SCP 部署「看起來沒生效」

### 症狀
改 styles.css → SCP 到 /var/www/ftg-tours/ → 公網 browser 看不到變化；
但 VPS 源站檔案已更新、curl 抓圖全 200。

### 診斷
```bash
curl -sS -I https://ftg.esggo.co/styles.css | grep -i cache-control
# Cache-Control: max-age=14400   ← CF 緩存 4 小時
```
SCP 更新源站，CF 仍送舊版。

### 修復
HTML 引用加版本查詢參數（繞過緩存，不需 CF token）：
```html
<link rel="stylesheet" href="styles.css?v=20260814b" />
```
驗證：
```js
// browser_console
document.querySelector('link[rel=stylesheet]').href   // 必須含 ?v=
```

## 三、圖片卡片 height:0（用 browser_console 驗，別信 vision）

### 症狀
vision：「卡片圖未見 / 破圖」。但 curl 圖全 200。

### 真因
`.card` 是 `display:flex; flex-direction:column`，`.card-pic` 作為 flex item
預設 `flex-shrink:1`，被壓縮到 `offsetHeight:0`（儘管 CSS 寫 `height:180px`）。
vision 截圖只看首屏視口，下方區塊看不到 → 誤判「未顯示」。

### 修復
```css
.card-pic { flex: 0 0 180px; height: 180px; ... }
```
驗證（browser_console，比 vision 可靠）：
```js
[...document.querySelectorAll('.card-pic')].map(e=>e.offsetHeight)
// 必須全 180，不是 0；allPicsVisible = heights.every(h=>h>100)
```

### 教訓
圖片顯示 bug：用 `browser_console` 讀 `offsetHeight` 驗證 DOM 實際渲染；
`vision` 截圖範圍有限會誤報「未見」。HTTP 200 ≠ 視覺可見。

## 四、部署解耦 + 版本號遞增規則（本會話補強）

### FTG 靜態站與 monorepo CI 解耦
- FTG 3.0 放在 **`/var/www/ftg-tours/`**（手動 SCP），Cloudflare Tunnel `ftg.esggo.co` 指向此目錄。
- monorepo CI（`deploy-oracle.yml`）部署的是 **`/var/www/esggo`**（git reset --hard + pm2）。
- 兩者**互不相干**：monorepo CI 變紅（如 esggo-core crash loop）**不會**影響 ftg.esggo.co 公網可用性。
- 實戰：esggo-core EADDRINUSE 修復期間，ftg.esggo.co 全程 200。修 CI 時不必擔心 FTG 下线。
- 若 FTG 要納入 CI 自動部署，需在 deploy-oracle.yml 加一段 SCP `apps/ftg-3.0/*` → `/var/www/ftg-tours/`，目前未做（手動 SCP 即可）。

### `?v=` 版本號必須每次遞增
- CF `Cache-Control: max-age=14400`（4h）。僅「首次加 `?v=`」不夠——**每次改 CSS 都要 bump 版本號**，
  否則 CF 仍送舊版（SCP 源站已新，browser 看不到變化）。
- 本會話實際遞增：`?v=20260814b` → `?v=20260814c`（每次 push 前 sed 換號）。
- 驗證：browser_console 讀 `document.querySelector('link[rel=stylesheet]').href` 必須含**當次**版本號。
- 替代方案（有 CF token 時）：`curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache"`，
  但加 `?v=` 最省事、不需憑證。

### 部署閉環檢查清單（FTG 靜態站）
1. 本地改 `apps/ftg-3.0/{index.html,styles.css,app.js,assets/*}`
2. bump `styles.css?v=YYYYMMDDx` 版本號（x 每次 +1）
3. `scp` 到 `ubuntu@161.118.248.180:/var/www/ftg-tours/`（含 assets/）
4. `git add` + commit + push origin main
5. 公網驗證：`curl -w "%{http_code}" https://ftg.esggo.co/` 應 200；圖資源 `https://ftg.esggo.co/assets/<f>.jpg` 應 200
6. 圖片顯示 bug 用 `browser_console` 讀 `offsetHeight` 驗，不信 `vision` 首屏截圖

### 品牌圖資：本地生成、勿換 CDN（用戶硬規則「只用免費算立」）
- FTG 3.0 的 6 張攝影圖用 `image_generate`（FAL/Nous 免費額度）生成 → `curl` 下載到 `apps/ftg-3.0/assets/*.jpg` → 隨站 SCP 部署。
- **不要**把這些圖換成外部 CDN URL（Unsplash/Cloudflare Images 等）。用戶明確「只用免費算立、禁付費 API/私鑰」→ 本地 FAL 圖資 + 隨站部署零外部依賴是合規做法。
- LOGO 同理：自含 SVG（`assets/logo.svg`，綠葉脈 + 金旅遊定點 + 品牌字），`<img src="assets/logo.svg">` 引用，不引外部字體/圖床。
- 若未來要加更多圖，沿用此模式：FAL 生成 → 存 assets/ → 引用相對路徑。
