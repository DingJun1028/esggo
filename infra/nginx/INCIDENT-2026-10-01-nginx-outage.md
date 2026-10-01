# 事故記錄：2026-10-01 nginx 全站 outage

> 狀態：**已恢復**（`systemctl is-active nginx` = active，`nginx -t` = test is successful）
> 影響期間：`2026-10-01 06:31:09` UTC 停止 → `2026-10-01 07:41:57` UTC 啟動，約 70 分鐘
> 本檔為 VPS 實際設定的**可版本控制來源**，重開機或 config sync 後以此為準。

---

## 1. 症狀

VPS `161.118.248.180` 的 80／443 無任何 listener，**所有**由 nginx 提供的站點同時失效：

| 主機 | 事故前 | 恢復後 |
|---|---|---|
| `esggo.co` | 000 | 200 |
| `ftgtours.esggo.co` | 000 | 200 |
| `journey.ftgtours.esggo.co` | 000 | 200 |
| `htb.esggo.co` | 000 | 200 |
| `translate.esggo.co` | 000 | 200 |
| `aistation.esggo.co` | 000 | 200 |
| `oa.esggo.co` | 000 | 301 |

journal 錯誤（決定性證據）：

```
2026/10/01 06:31:09 [emerg] could not build map_hash,
  you should increase map_hash_bucket_size: 64
```

---

## 2. 根因（有兩個獨立的缺陷，缺一不會出事）

### 根因 A — map key 長度超出 bucket（直接觸發者）

`/etc/nginx/sites-available/ollama.esggo.co.conf` 用 Bearer token 當 map key：

```nginx
map $http_authorization $ollama_auth_ok {
    default 0;
    include /etc/ollama-gateway/auth.map;
}
```

`/etc/ollama-gateway/auth.map` 實測：**1 個 key，最長行 52 bytes**（檔案 53 bytes 含換行）。

nginx 的 `map` 會把 key 塞進 hash bucket，預設 `map_hash_bucket_size 64`。
52 bytes 的 key 加上 nginx 內部結構開銷後，**無法在 64-byte bucket 內建表**。
這讓 nginx **連設定檔載入階段就失敗** → `-t` 過不了 → 服務完全無法啟動。

### 根因 B — Ollama 站點憑證不存在（潛在的同型阻斷）

該 vhost 引用 `/etc/letsencrypt/live/ollama.esggo.co/fullchain.pem`，該檔**不存在**。
即使 map 問題修好，只要憑證缺失被載入，nginx 同樣會拒絕啟動。

certbot webroot 重簽也失敗：

```
The Certificate Authority reported these problems:
  Domain: ollama.esggo.co
  Type: unauthorized
```

Let's Encrypt 經 Cloudflare 的 IPv6 轉發 ACME challenge 時收到 `404`
（`http://ollama.esggo.co/.well-known/acme-challenge/...`）。
→ **webroot 驗證在此架構下不可用**，必須改用 DNS-01。

---

## 3. 已套用的修復

### 3.1 提高 map bucket（保留）

`/etc/nginx/nginx.conf` 第 23 行，`http {` block 內：

```nginx
map_hash_bucket_size 256;
```

- 原檔備份：`/etc/nginx/nginx.conf.bak.opsreview-20261001`
- 驗證：`nginx -t` → `syntax is ok` / `test is successful`

### 3.2 隔離 Ollama vhost（保留，待憑證）

```
sites-enabled/ollama.esggo.co.conf
  → /etc/nginx/sites-available/ollama.esggo.co.conf      # 原始檔保留未動
  → /etc/nginx/ollama.esggo.co.conf.pending-cert        # 符號連結，nginx 不再 include
```

結果：`ollama.esggo.co` 目前回 404（無 vhost 匹配，落到 default）。
**未簽發憑證前不要把這個連結放回 `sites-enabled/`。**

---

## 4. 尚未解決（阻塞中）

| # | 項目 | 現況 | 需要的動作 |
|---|---|---|---|
| 1 | `ollama.esggo.co` 憑證 | 隔離中 | 改用 **DNS-01**（Cloudflare API token），webroot 在此架構已被證實不可行 |
| 2 | `ollama.esggo.co` 復原 | 404 | 憑證到位後恢復 vhost，再驗 `/api/tags` |
| 3 | `11434/tcp` 暴露 | UFW 對全網 ALLOW，外部實測 HTTP=000（實際擋下） | 規則本身過寬，應收斂為僅 127.0.0.1 |
| 4 | `journey.esggo.co` TLS | vhost 只有 `listen 80`，無 `ssl_certificate` | 決定 canonical host 後補 TLS |
| 5 | `journey` / `journey-api` 雙站並存 | 兩者都 enabled | 合併，避免路由漂移 |

---

## 5. 未修的既存警告（本次未動，因為會改變線上路由）

`nginx -t` 目前仍回 10 個 warn，其中這兩個是**真實的設定漂移**：

```
[warn] conflicting server name "translate.esggo.co" on 0.0.0.0:80,  ignored
[warn] conflicting server name "translate.esggo.co" on 0.0.0.0:443, ignored
[warn] conflicting server name "deerflow.esggo.co" on 0.0.0.0:80,  ignored
[warn] conflicting server name "deerflow.esggo.co" on 0.0.0.0:443, ignored
```

原因：`sites-enabled/` 裡同時存在**正式檔與 .bak 檔**，而 nginx 的
`include /etc/nginx/sites-enabled/*;` 會把 `.bak` 也當設定載入：

```
translate.esggo.co.conf.bak          ← 應移出
deerflow.esggo.co.conf.bak-20260927  ← 應移出
deer-flow.conf                      ← 與 deerflow.esggo.co.conf 疑似重複
```

誰勝出取決於 include 順序（字典序）＝**隱性行為**。
把 .bak 移出 `sites-enabled/` 會**改變這兩個 host 的實際路由**，屬於行為變更，需先裁決。

建議（待核准後執行）：

```bash
sudo mkdir -p /etc/nginx/disabled-backups
sudo mv /etc/nginx/sites-enabled/translate.esggo.co.conf.bak \
        /etc/nginx/disabled-backups/
sudo mv /etc/nginx/sites-enabled/deerflow.esggo.co.conf.bak-20260927 \
        /etc/nginx/disabled-backups/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. 重演防護

- [ ] 把 `map_hash_bucket_size 256;` 納入 VPS 重置腳本（`scripts/setup-vps.sh` 或 `infra/scripts/setup-vps.sh`）
- [ ] 任何以 token／長字串當 nginx `map` key 的設定，改用 `map_hash_max_size` + 雜湊化，或改走 `auth_request`
- [ ] 加入開機後自檢：`systemctl is-active nginx` 失敗即告警
- [ ] ACME 驗證全面改 DNS-01，不再依賴 webroot