# QR Code 同源自帶（不走 CDN）—「QR 沒出來」根因與修法

## 根因（2026-08-08 實證）
- 舊實作：`studio.html` 用 `import('https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js')` 動態載入 QR 庫。
- **中國網路環境下 `cdn.jsdelivr.net` 常被牆**（DNS 污染/連線重置）。`import()` 失敗 → 靜默 → QR 區只可能有純文字 fallback（甚至連文字都因錯誤處理被吞）。用戶實際看到「QR code 沒出來」。
- 這與 Cloudflare 無關（`translate.esggo.co` 本身可達），純是第三方 CDN 被牆。

## 修法：把 QR 庫下載到 `public/` 同源部署
1. **本機下載**（Windows 有網，VPS 離線）：
   ```bash
   cd apps/universal-translator/public
   curl -sS -L -o qrcode.min.js "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"
   # size 應 ~19KB, 開頭應為: var QRCode;!function(){...
   ```
2. **server.mjs 靜態路由**必須能服務 `.js`（舊路由只放行 `.html`）：
   ```js
   else if (/^\/(qrcode\.min\.js|esggo-shared\.d\.ts)$/.test(urlPath)) {
     file = urlPath; ctype = 'application/javascript; charset=utf-8';
   }
   ```
3. **studio.html** 改用同源 `<script src="./qrcode.min.js"></script>`（頁面 `<head>` 同步載入），呼叫：
   ```js
   new QRCode($('#qrBox'), {text:url, width:140, height:140,
     colorDark:'#000', colorLight:'#fff', correctLevel:QRCode.CorrectLevel.M});
   ```
   fallback：`catch(e){ qrBox.innerHTML='<code>'+url+'</code>'; }`（仍保底顯示連結）。

## 驗證
- 對外：`curl -sS -o /dev/null -w "HTTP=%{http_code}" https://translate.esggo.co/qrcode.min.js` → 必須 `HTTP=200`。
- 瀏覽器開 `https://translate.esggo.co/studio` → snapshot 應含 `image` 節點（QR 已渲染）+ 「觀眾掃碼」文字 + 房間碼。

## 關聯教訓
- **任何前端第三方 CDN 依賴（jsdelivr/unpkg/cdnjs）在中國環境都可能被牆**。線上服務要「自帶」庫（下載進 `public/` 同源服務），不要用動態 `import()` 從 CDN 載。
- `qrcode.min.js`（qrcodejs 1.0.0）是純瀏覽器 UMD，無 npm 相依，適合直接放 `public/` 同源。
