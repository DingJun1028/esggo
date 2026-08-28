# FTG 多版本留存 + 子路徑部署 — 實戰配方

來源：2026-08-14 會話。用戶要求「將不同版本號的每一頁都保存下來」，並「用 Google Stitch 生成
全部網頁」。本檔記錄版本留存模式 + 子路徑部署陷阱 + GUI-only SaaS 工具的替代交付法。

## 一、版本留存模式（git + 線上雙重留存）

### 目錄慣例
```
apps/ftg-2.0/{index.html,styles.css,app.js}
apps/ftg-2.5/{index.html,styles.css,app.js,assets/*.jpg}
apps/ftg-3.0/{index.html,styles.css,app.js,assets/*.jpg,assets/logo.svg}
```
每個版本是**獨立目錄**、獨立視覺語言，不互相覆寫。

### 圖資跨版本複用（省 FAL 額度）
```bash
mkdir -p ftg-2.5/assets && cp ftg-3.0/assets/*.jpg ftg-2.5/assets/
```
同主題攝影圖不必重生成；舊版直接複用。

### git 留存
```bash
git add apps/ftg-2.0 apps/ftg-2.5 apps/ftg-3.0
git commit -m "feat(ftg): 留存 FTG 全版本 (2.0/2.5/3.0) 每一頁"
git push origin main   # 遇空回應/領先 → 重試迴圈 / git pull --rebase（禁強推）
```
三版本各自頁面全部永久留存（22 檔 tracked）。

## 二、子路徑部署（同一 Tunnel 根下放多版）

### 目標位址
- 3.0 正式：`https://ftg.esggo.co/`（Tunnel 指向 `/var/www/ftg-tours/`）
- 2.5 归档：`https://ftg.esggo.co/2.5/`
- 2.0 归档：`https://ftg.esggo.co/2.0/`

### 部署步驟（2.5 範例）
```bash
# 1) VPS 建子目錄（/var/www 是 root 建 → 需 sudo + chown）
ssh ubuntu@161.118.248.180 'sudo mkdir -p /var/www/ftg-2.5/assets && sudo chown -R ubuntu:ubuntu /var/www/ftg-2.5'
# 2) SCP 該版全部檔（含 assets/）
scp -i ~/.ssh/esggo_original ftg-2.5/{index.html,styles.css,app.js} ubuntu@161.118.248.180:/var/www/ftg-2.5/
scp -i ~/.ssh/esggo_original ftg-2.5/assets/*.jpg ubuntu@161.118.248.180:/var/www/ftg-2.5/assets/
```
若想要 `ftg.esggo.co/2.5/` 與主站同 Tunnel，最省事是把版本目錄**複製進 Tunnel 根目錄**：
```bash
ssh ubuntu@161.118.248.180 'sudo cp -r /var/www/ftg-2.5 /var/www/ftg-tours/2.5 && sudo chown -R ubuntu:ubuntu /var/www/ftg-tours/2.5'
```

### ⚠️ 子路徑回退陷阱（必驗 title，不只 http code）
Cloudflare Tunnel / nginx 對**不存在的子路徑**會回退到根 `index.html`：
- `curl -w "%{http_code}" https://ftg.esggo.co/2.0/` → **200**，但回的是 3.0 的 `<title>`！
- 這會讓你誤以為 2.0 已部署，其實只是根頁回退。
- **正確驗法**：抓 title 比對
  ```bash
  curl -sS https://ftg.esggo.co/2.0/ | grep -o "<title>[^<]*</title>"
  # 必須出現 "FTG 2.0 ..."，不是 "FTG 3.0 ..."
  ```
- 修復：先把 2.0 實際 SCP 進 `ftg-tours/2.0/`，再驗 title。

## 三、GUI-only SaaS 工具（無 API/MCP）→ 等價手刻交付

### 場景
用戶：「請使用 Google Stitch 工具生成全部網頁」。
- Stitch 是 Google 圖形介面設計工具（stitch.withgoogle.com），需 Google 登入 + 手動操作。
- 環境**無 Stitch 的 MCP / skill / API**，也無用戶 Google 憑證 → 無法「呼叫它生成」。

### 做法（勿失敗、勿說工具壞）
1. 誠實說明：無法直接呼叫該 GUI 工具。
2. **交付等價結果**：手刻該工具的視覺美學。
   - Stitch 美學 = 現代編輯風、大留白、極簡導覽、乾淨網格。
   - 本會話做「FTG 2.5 午夜梯田暗色編輯版」：深墨綠底 `#0e1512` + 綠字 `#7bb38a` +
     暖金 `#e3c987`；字體 Space Grotesk + Noto Sans TC；區塊 `sec-no`（01—理念）編排；
     IntersectionObserver 淡入 + 數字滾動。與 3.0 亮色系明顯區隔，滿足「特別版本」訴求。
3. 告訴用戶：這是手刻的 Stitch 風格等價版，若他要真 Stitch 輸出需自行在 stitch.withgoogle.com 操作。

### 原則（避免負面聲稱）
- 不寫「Stitch 不能用 / 工具壞」。改寫：「無 API 接入，已用手刻等價美學交付」。
- 未來類似（用戶點名某 GUI SaaS 工具名）→ 同樣：說明限制 + 手刻等價 + 標註差異。

## 四、版本切換器（可選增強）
若要在首頁讓用戶切版本，加一組連結：
```html
<nav><a href="/">3.0</a><a href="/2.5/">2.5</a><a href="/2.0/">2.0</a></nav>
```
（本會話未做，僅記模式備用。）

## 五、留存閉環檢查清單（多版本）
1. 每版 `apps/ftg-X.0/` 含 index/styles/app + assets，獨立目錄
2. 圖資可跨版 `cp`（同主題不重生）
3. VPS：`sudo mkdir` + `chown ubuntu` 建子目錄 → SCP 該版全部檔
4. 若要同 Tunnel：複製進 `ftg-tours/X.0/`
5. 驗：**抓 title** 確認非根頁回退（非只看 http code）
6. git add + commit + push（重試迴圈 / --rebase 處理網路與領先）
