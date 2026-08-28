# FTG 官網 `https://ftg.esggo.co/` 回 526（CF 產生錯誤）快速診斷流程

## 現象

用戶/Dev 反應 `https://ftg.esggo.co/` 空白、或 `curl` 返回 526（Cloudflare 產生錯誤）。其他 FTG 版本頁面（如 `/2.8/`）可能正常，唯獨 root 或某版本有問題。

**526 的意義**：CF 代理找不到可用的 upstream origin。這通常是 VPS 的 nginx 沒有正確 listen 到 `ftg.esggo.co` 這個 host，或該 server block 未被啟用。

## 診斷路徑（依序）

### 1. 確認遠端版本資料夾真的存在

```bash
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  'ls -la /var/www/ftg-tours/'
```

**要點**：`/var/www/ftg-tours/` 下應該有 `2.0/`, `2.5/`, `2.7/`, `2.8/`, `3.0/` 這些版本資料夾，且每個資料夾裡要有 `index.html`、`styles.css`、`app.js`、`assets/`。若某個資料夾缺了（例如本 session 發現 `2.7/` 與 `3.0/` 不見），那就是佈署不完整，不是 nginx 設定問題。

附註：若 `3.0/` 資料夾不存在但根目錄 `/var/www/ftg-tours/index.html` 的 byte 與本端 `apps/ftg-3.0/index.html` 吻合，代表 3.0 是散放在根目錄而非放進 `/3.0/` 資料夾。這種散放狀態會讓 `/3.0/` URL 回 404（除非 nginx 有特別 alias）。若要 `/3.0/` 這種清潔 URL 正常，應該佈署進 `/var/www/ftg-tours/3.0/` 資料夾裡。

### 2. 確認全站 nginx server_name 正確

```bash
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  'grep -n "server_name" /etc/nginx/sites-available/ftg-esggo'
```

**正常值**應該包含 `ftg.esggo.co`。若 `server_name` 寫的是 `esggo.co www.esggo.co`，就是跟本 session 一樣的錯：`ftg.esggo.co` 的請求進不了這個 server block。

**進階**：順便確認 `.bak` 裡有沒有正確設定而被遺忘：

```bash
ssh ... 'grep -n "server_name" /etc/nginx/sites-available/ftg-esggo.bak'
```

若 `.bak` 裡有 `server_name ftg.esggo.co` 卻沒被 `sites-enabled` 啟用，就是設定遺失。

### 3. 確認 `.bak` 是否被啟用

```bash
ssh ... 'ls -la /etc/nginx/sites-enabled/ | grep ftg-esggo'
```

正常：應該有 `ftg-esggo -> /etc/nginx/sites-available/ftg-esggo`。若只有`.bak`相關檔案但沒被 symlink 啟用，就是未啟用。

### 4. 語法檢查 + reload

修完設定後：

```bash
ssh ... 'sudo nginx -t 2>&1 && sudo nginx -s reload'
```

語法通過才能 reload。

### 5. 對外驗證（繞過「只是 HTTP 200 on HTML」的陷阱）

```bash
# a) 根目錄與各版本頁面 HTTP 200 + title 吻合
for v in 2.0 2.5 2.7 2.8 3.0; do
  curl -sS -m10 -o /dev/null -w "https://ftg.esggo.co/$v/ -> HTTP=%{http_code}\n" "https://ftg.esggo.co/$v/"
done

# b) 六張 assets 圖是否真的回 200（不只是「頁面 HTTP 200」而已）
for v in 2.5 2.7 2.8 3.0; do
  for f in hero stay eco craft market restore; do
    curl -sS -m10 -o /dev/null -w "$v/$f.jpg -> HTTP=%{http_code}\n" "https://ftg.esggo.co/$v/assets/$f.jpg"
  done
done
```

**2.0 的 assets 預期是 404**（本端 ftg-2.0/ 就沒 assets/，是早期原型行為），不要誤判為缺口。

### 6. 更底層：直接查 VPS IP 的回覆（繞過 CF 代理）

有時 CF 代理回 526，但 VPS 本身的 nginx 其實已正常 serve。用直連 IP 確認：

```bash
for v in 2.0 2.5 2.7 2.8 3.0; do
  curl -sS -m10 -o /dev/null -w "http://161.118.248.180/$v/ -> HTTP=%{http_code}\n" "http://161.118.248.180/$v/"
done
curl -sS -m10 "http://161.118.248.180/" | grep -o '<title>[^<]*</title>'
```

若 VPS IP 回的是 esggo-core 的 AI Station 頁（title 為 "AI Station — ..."），表示 `/` 路徑被 proxy 給 3000 了，不是 FTG 靜態頁面。FTG 的靜態頁面應該是要透過 `ftg.esggo.co` 這個 host 來 serve，而不是 VPS IP 的 `/`。

## 典型錯誤模式（從本 session 學來）

| 徵兆 | 可能原因 | 查法 |
|---|---|---|
| `ftg.esggo.co/` 526，其餘版本正常 | nginx 的 `ftg-esggo` server_name 寫錯（缺 `ftg.esggo.co`） | `grep server_name /etc/nginx/sites-available/ftg-esggo` |
| 某版本頁面 404，但資料夾本應存在 | 遠端 `/var/www/ftg-tours/{version}/` 資料夾缺失 | `ls /var/www/ftg-tours/` |
| 3.0 根目錄正常、`/3.0/` 404 | 3.0 是散放在根目錄、未放進 `/3.0/` 資料夾 | 比對 `/var/www/ftg-tours/index.html` byte 與本端 ftg-3.0/index.html |
| 頁面 HTTP 200 但圖片不顯示 | 可能是 CF cache 或 nginx asset 路徑問題，需實際 curl assets | 掃六張 assets.jpg HTTP code |

## 修復示例（本 session 實際做法）

把正確的 `ftg.esggo.co` server block 寫進 `/etc/nginx/sites-available/ftg-esggo`，包含：

- 80 port: `if ($host = ftg.esggo.co) { return 301 https://$host$request_uri; }`
- 443 port: `server_name ftg.esggo.co; root /var/www/ftg-tours; index index.html; location / { try_files $uri $uri/ /index.html; }`
- 保留原本 esggo.co 的 3000 proxy 段落不受影響

寫入時注意 **$ 符號不要被吞** — 若用 Python 產生設定，確保 `proxy_set_header Host $host;` 中的 `$host` 不被 Python 當成 escape 處理。可改用 raw string 或直接寫純文字避免此問題。本 session 是 Python 惡手導致 `proxy_set_header Host ;` 空參數，語法檢查噴 `[emerg] invalid number of arguments in "proxy_set_header" directive`。重寫才恢復。

## 驗證標準

真正的「正常上限」是：

- `https://ftg.esggo.co/{version}/` HTTP 200
- title 與本端 index.html 吻合
- 六張 assets 圖 HTTP 200（2.0 除外，因設計原型無圖）
- Cloudflare 代理不回 526
