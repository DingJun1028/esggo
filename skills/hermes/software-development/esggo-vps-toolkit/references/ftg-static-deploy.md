# FTG 靜態站 建造→圖片→部署 實戰配方

適用：墾趣旅遊 (FTG) 或任何 OA-Team 品牌靜態網頁（純 HTML/CSS/JS，無框架）。
路徑慣例：`apps/<brand>-X.0/{index.html,styles.css,app.js,assets/}`。

## 1. 建造（本地）
- 品牌色固定：綠 `#3c6e47` / 暖金 `#c9a24b` / 米白 `#f3ede1` / 深藍 `#10243f`
- RWD 痊癒清單（避免常見破版）：
  - 斷點 `1024 / 768 / 480 / 360` px，每個斷點都要實測
  - 標題用 `clamp()` 流式排版，防極小屏溢出
  - 手機抽屜選單（`position:fixed` + 背景模糊 `backdrop-filter:blur` + 動畫），**功能鈕（如語言切換）必須同時存在抽屜內與桌機列**，不可 `display:none` 丟失功能
  - `prefers-reduced-motion` 無障礙支援
  - 觸控無 hover：加 `:active` 回饋

## 2. 豐富圖片（免費算立，無外部 CDN）
- 用 `image_generate`（FAL FLUX 2 Klein 9B，Nous subscription 已啟用）生成主題攝影圖
- 批次並行生成 5–7 張（hero / 各卡片），每張數秒~數十秒
- **下載到本地** `assets/*.jpg`：`curl -sSL -o assets/X.jpg <fal_url>`
  - 理由：靜態站 SCP 部署後不依賴任何 CDN / API key，符合「只用免費算立」
- HTML 引用：卡片頂圖用 `<div class="card-pic" style="background-image:url('assets/X.jpg')">`；Hero 用 `.hero-bg{background-image:url('assets/hero.jpg');opacity:.22}` + `::after` 米色漸層遮罩保文字清晰
- CSS：`.card-pic{height:180px;background-size:cover;background-position:center;margin:-32px -32px 22px;border-radius:var(--radius) var(--radius) 0 0}`（貼齊卡片圓角頂端）

## 3. 瀏覽器驗證（關鍵陷阱）
- `browser_vision` **只看首屏 viewport**，下方區塊與 background-image 卡片圖經常「看不到」→ 誤判破圖
- **正確驗證法**：`browser_console` 執行
  `Array.from(document.querySelectorAll('.card-pic')).map(e=>({bg:getComputedStyle(e).backgroundImage.slice(0,60),h:e.offsetHeight})));`
  → 確認元素數量對、高度 >0、URL 指向正確 `file:///` 路徑即載入成功
- 桌面無破版再用 `browser_vision` 確認整體美感

## 4. 部署（VPS + Cloudflare Tunnel）
- **Pitfall**: `/var/www/ftg-tours/images/` may not exist — create before SCP:
  `ssh -i ~/.ssh/esggo_original root@161.118.248.180 "mkdir -p /var/www/ftg-tours/images/esg-impact-note"`
- SCP files + images directory:
  `scp -i ~/.ssh/esggo_original <files> ubuntu@161.118.248.180:/var/www/ftg-tours/`
  `scp -i ~/.ssh/esggo_original -r images/esg-impact-note/* ubuntu@161.118.248.180:/var/www/ftg-tours/images/esg-impact-note/`
- 路由：Cloudflare Tunnel `ftg.esggo.co` → `/var/www/ftg-tours/`（不需 nginx reload）
- 公網驗證：`curl -sS -m12 -o /dev/null -w "ftg=%{http_code}\n" https://ftg.esggo.co/`（期望 200）

## 5. 提交與推送
- `git add apps/<brand>-X.0/ && git commit -m "feat(ftg): ..."`
- push 遇 `Empty reply from server` / `non-fast-forward`：
  - 空回應 → 重試迴圈 `for i in 1 2 3 4 5; do git push ... && break; sleep 4; done`
  - 領先 → `git pull --rebase origin main` 後再 push（**禁止強制 push**）

## 6. VPS git pull 衝突（常態）
- 現象：`Please move or remove them before you merge. Aborting` + untracked 如 `scripts/oa-vps-keepalive.mjs`
- 解：`mv scripts/<x>.mjs /tmp/<x>.mjs.bak && git pull origin main`
- **只備份擋路 untracked 檔，不動生產配置**（tencentdb-memory/*.sh, docker-compose.prod.yml）
