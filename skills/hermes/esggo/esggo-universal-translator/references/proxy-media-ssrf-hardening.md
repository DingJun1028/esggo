# `/proxy-media` SSRF + streaming hardening (verified 2026-08-13)

`server.mjs` 新增 `/proxy-media?url=<外部影片>` route，解瀏覽器跨域擷音軌限制（player.html 代理載入外部影片）。
初版有 3 個生產級缺陷，已全部修。

## 必做防護（生產級代理）
1. **SSRF**：阻內網/link-local/metadata。正則（去掉結尾 `$` 錨點，只用 `^` 前綴）：
   ```js
   const isPrivate = /^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[::1\]|::1)/.test(host)
     || host.endsWith('.internal') || host.endsWith('.local');
   ```
   ⚠ 初版用 `…$/`（結尾錨點）導致 `169.254.169.254` / `127.0.0.1` 全 match false → 漏擋（實測 500 而非 400）。去掉 `$` 才正確。
2. **協議白名單**：僅 `^https?:$`，否則 `file:///etc/passwd` 可被代理（傳回 400）。
3. **大小上限 + 逾時**：`Buffer.from(await upstream.arrayBuffer())` 會整包載入記憶體 → OOM。改用 `upstream.body.getReader()` 串流轉發 + `MAX_PROXY_BYTES` (50MB) 累計邊界 + `AbortController` 20s 逾時。當 `content-length > MAX` 回 413。

## 驗證（實跑，非推測）
```
(PORT=8802 node server.mjs > /tmp/b.log 2>&1 < /dev/null &) ; sleep 4
curl -s -o NUL -w "%{http_code}" 127.0.0.1:8802/proxy-media?url=http://169.254.169.254/   # 400
curl -s -o NUL -w "%{http_code}" 127.0.0.1:8802/proxy-media?url=http://localhost:22/        # 400
curl -s -o NUL -w "%{http_code}" 127.0.0.1:8802/proxy-media?url=file:///etc/passwd          # 400
curl -s -o NUL -w "%{http_code}" 127.0.0.1:8802/player                                    # 200
```
注意背景 `node server.mjs` 在本沙箱會被 EADDRINUSE（舊 process 佔 port）干擾；若探針回 500 先確認無殘留 process（`pkill -9 -f server.mjs` 後重測）。

## 相關
- `player.html` 加「🌐 代理載入外部影片」按鈕 + 字幕 SRT/VTT 匯出（`captionLog` + `buildSRT/buildVTT`）。
- VPS 實證：git pull + `pm2 reload universal-translator`，`curl 127.0.0.1:8788/proxy-media?url=http://169.254.169.254/` → 400。
