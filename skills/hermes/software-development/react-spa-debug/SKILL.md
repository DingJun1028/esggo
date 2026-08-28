---
name: react-spa-debug
description: >
  React 19 + React Router 7 SPA 子頁空白/閃爍/水合失效診斷。
  適用：createRoot + BrowserRouter + StrictMode 導致子頁空白、無 console 錯誤、HTTP 200 但 elementCount=0。
  涵蓋：根因模式、診斷步驟、三種修復、Cloudflare 隧道/反向代理環境下的 SPA fallback。
---

# React SPA 子頁空白診斷（React 19 + RR7）

## 觸發時機
- `https://host/subpage` 回傳 HTTP 200，但頁面空白
- `element_count: 0`（browser snapshot）
- Console 無明顯錯誤
- DevTools 中 `<div id="root">` 為空，但 `<script src="...index-xxx.js">` 存在

## 根因模式（優先排查）

### 1. StrictMode double-mount + createRoot conservative mode
React 19 的 `createRoot` conservative mode 與 StrictMode 的 intentionally double-mount + RR7 的 `Routes` conservative 交互，會導致 SPA mount 被自我銷毀。

**特徵：**
- 首頁正常（直接 mount 到 `/`）
- 子頁空白（RR7 conservative 拒絕非 root mount）
- 無 console 錯誤，`document.getElementById('root')` 為空字串

**診斷：**
```js
grep -c 'StrictMode' dist/assets/index-*.js   # > 0 表示 bundle 仍含 StrictMode
grep -c 'createRoot' dist/assets/index-*.js   # 確認 entry point 存在
```

**修復（三選一）：**
1. **移除 StrictMode wrapper**（推薦）
   - `src/main.jsx`: 從 `<React.StrictMode><App /></React.StrictMode>` 改為 `<App />`
   - 這是 production-ready 的正式寫法，嚴格模式只應用於 component 內部狀態管理

2. **改為 HashRouter**（最穩，適合 CDN/Cloudflare/任意 domain）
   - 把 `BrowserRouter` 換成 `HashRouter`
   - 缺點：URL 變為 `/#/subpage`

3. **開啟 React 19 features + 關閉 conservative**
   - 暫時以 `Unsafe_RECREATE_ROOT` workaround：
   ```js
   import { createRoot } from 'react-dom/client';
   const container = document.getElementById('root');
   if (container && !container._reactRoot) {
     container._reactRoot = createRoot(container, { unstable_useStrictMode: false });
     container._reactRoot.render(<App />);
   }
   ```

## 環境診斷流程

```bash
# 1. 確認 HTTP 正常
curl -sI https://host/subpage

# 2. 確認 JS bundle 載入
grep -o 'src="[^"]*\.js"' index.html

# 3. 確認 bundle 內容（遠端 VPS）
ssh ubuntu@host "grep -c 'BrowserRouter' /path/to/assets/index-*.js"

# 4. DevTools 看 root mount
# document.getElementById('root').innerHTML.length
# → 0 or 0-length string = mount failure
```

## Cloudflare Tunnel / Reverse Proxy 的 SPA fallback

Nginx 需正確設定 `try_files`：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

`index.html` 必須包含空 `<div id="root"></div>`，讓 React 在 client-side mount。

## 常見誤判
- **瀏覽器空白 ≠ 伺服器問題**：HTTP 200 + JS bundle 存在 => 一定是前端 runtime/hydration 問題
- **無 console 錯誤 ≠ 沒錯誤**：React internal mount failure 可能不噴 error
- **Cloudflare Rocket Loader  silently break SPA**：Console 完全乾淨、畫面全白，CDN 把 `<script type="module" src="...">` 的 type 改得很怪（例如 `type="<hash>-module"`），瀏覽器直接忽略不執行。遠端 HTML 撈出來的 script tag 會長得像：`<script type="987a3de3d2331ae6c5f1e792-module" crossorigin src="/assets/index-xxx.js">`。確認方式：curl 看 HTML 中 app JS 的 type 是否還是 `module`。
- **Free plan vs Pro plan**：`data-cf-rl="false"` 在 Pro/Business/Enterprise 可用來排除單一 script；Free plan 上這個屬性無效，只能進 Cloudflare Dashboard → Speed → Optimization → Rocket Loader → Off。
- **`import { HashRouter as Router }` + JSX 仍用 `<BrowserRouter>`**：`import { HashRouter as Router }` 只改別名；JSX 若仍寫 `<BrowserRouter>`，bundle 仍會包含 `BrowserRouter` 且路由行為不變。修改時必須同時確認 import 與 JSX 是一致的。
- **Vite incremental build 快取不刷新**：即使修改 `src/`，`pnpm run build` 可能 incremental 復用舊 chunk，導致 dist 時間戳不變、新內容未進 bundle。解法：`pnpm run build -- --force`，並用 `execute_code` 或 `grep` 對 **built JS** 做字串計數驗證。
- **Cloudflare Rocket Loader 無差別 rewrite `text/javascript`**：即使改成 `type="text/javascript"`，Rocket Loader 仍會 rewrite 為 `type="<hash>-text/javascript"`。根因確認方式：`curl -sS <url> | grep -oE '<script[^>]*src="[^"]+\.js"[^>]*>'`；若看到 type 含 hash 前綴，代表被 rewrite。此功能在 Free plan 無可關閉開關，完全無法用 HTML 屬性排除。
- **`data-cf-rl="false"` 在 Free plan 無效**：實際驗證證明即使加在 `<script>` 上，Rocket Loader 仍 rewrite。Pro/Business/Enterprise 可能有效，但 Free plan 上不存在這個開關。切記不要依賴此屬性為救命解方。
- **`import { HashRouter as Router }` + JSX 仍用 `<BrowserRouter>`**：`import { HashRouter as Router }` 只改別名；JSX 若仍寫 `<BrowserRouter>`，bundle 仍會包含 `BrowserRouter` 且路由行為不變。修改時必須同時確認 import 與 JSX 是一致的。
- **唯一可靠的 Free plan 解法**：把 app JS 內容 inline 到 `<script>...</script>`（不用外部 `src`），使 Rocket Loader 無 script-external 可吃。缺點是 HTML 變大，需確認 Cloudflare 不壓縮 HTML 中已有正確大小限制；優點是 0 block 於 JS。
- **Inline JS 的第二層陷阱**：即使改成 inline，若應用程式的打包 JS 本身包含字串 `</script>`（React 的 component 常包含），Cloudflare Rocket Loader 會在中途把這個字串當成真正的 script 結尾，從此後面的程式碼被丟棄或 split，應用仍舊 blank。修復：inline 前先把 JS 裡的 `</script>` 轉義為 `<\\/script>`。驗證方式：線上抓下 HTML，確認 inline block 的長度等於 `index-*.js` 的 byte 大小。
- **Dashboard 關閉 Rocket Loader 是最終解**：Free plan 的 Rocket Loader 沒有 API 可關，也不吃 `data-cf-rl="false"`；唯一可靠做法是 HTML inline + escape `</script>`，或者請使用者到 Cloudflare Dashboard → Speed → Optimization → Rocket Loader → Off。
- **API 關閉失敗時的診斷**：Cloudflare PATCH `/zones/{id}/settings/rocket_loader` 回 `invalid object identifier`，代表這個 account 層級沒有這個設定項目，不要重試 API，改走 inline 或手動 Dashboard。
- **檢測 rocket-loader rewrite 的穩定命令**：`curl -sS <url> | grep -oE '<script[^>]*src="[^"]*\\.js[^"]*"[^>]*>'`；若看到 `type="<hash>-module"` 或 `type="<hash>-text/javascript"`，代表被 rewrite。注意 `grep 'text/javascript'` 對 inline JS 無意義；inline 後沒有 external JS `src="...</assets/index-*.js>"`。

## HashRouter 專屬診斷陷阱（ftg.esggo.co 實戰）

當 App 使用 `HashRouter`（`import { HashRouter, Routes, Route } from 'react-router-dom'`）時，有兩個極易誤判的點：

### 陷阱 1：測試子頁忘記加 `#` 前綴 → 誤判「路由壞了」
- **錯誤做法**：browser 開 `https://host/corporate-travel`，看到首頁內容，下結論「所有子頁都回退首頁 / 路由設定有問題」。
- **真相**：HashRouter 的正確網址是 `https://host/#/corporate-travel`。`/corporate-travel`（無 `#`）在 HashRouter 下會被忽略、直接匹配 `/`，**靜默顯示首頁**，console 完全乾淨、無錯誤。這不是 bug，是 HashRouter 特性。
- **正確診斷**：永遠用 `#/` 前綴測試 HashRouter 站。開 `https://ftg.esggo.co/#/corporate-travel` 才會真正命中子頁路由。若用無 `#` 的網址測出「子頁全顯首頁」，先懷疑網址格式，不要急著改路由代碼。

### 陷阱 2：Footer / 內部連結用 `<a href="/path">` 而非 `<Link>`
- **症狀**：Navbar 的 `<Link to="/corporate-travel">` 導航正常（SPA 內跳轉），但 Footer 用 `<a href="/corporate-travel">` —— 點擊會觸發**整頁刷新**到 `/corporate-travel`，在 HashRouter 下該路徑無對應資源，變成死鏈 / 回退首頁，破壞 SPA 體驗且行為異常。
- **修復**：所有內部連結統一改用 react-router 的 `<Link to="/path">`（記得 `import { Link } from 'react-router-dom'`）。隱私政策 / 服務條款等也是 `<Link to="/privacy-policy">`，不要用 `href="#"` 死鏈。
- **驗證**：在 Footer 組件 grep `<a href="/` 與 `href="#"` 全部換成 `<Link>`。

### 快速辨識 HashRouter vs BrowserRouter
```bash
grep -E 'HashRouter|BrowserRouter' src/App.jsx   # 看 import 與 JSX 用的是哪個
# 網址列出現 /#/ 即 HashRouter；出現 /subpage 即 BrowserRouter
```

## 再現與修復流程（本 session 實戰版）

```bash
# 1. 確認 VPS 吃到最新 JS
ssh ubuntu@host "grep -o 'src=\"[^\"]*\.js\"' /var/www/ftg-tours/index.html"

# 2. 直接查該檔內容，不要只看 src/
ssh ubuntu@host "grep -cE 'HashRouter|BrowserRouter|React\\.StrictMode' /var/www/ftg-tours/assets/index-<檔名>.js"

# 3. 若 Vite 快取懷疑過期：
cd project && pnpm run build
# 觀察是否有新檔名輸出，如 index-<newhash>.js

# 4. 清除舊 assets（可選但建議）
ssh ubuntu@host "find /var/www/ftg-tours/assets -name 'index-*.js' -mtime +1 -delete"

# 5. Deploy -> reload nginx
```

## 修復優先順序（本 session 驗證有效）

1. **移除 StrictMode wrapper**（最穩、最簡單）
   - `src/main.jsx`: 直接 render `<App />`，不要包 `<React.StrictMode>`
2. **若仍有空白，改用 HashRouter**
   - `import { HashRouter } from 'react-router-dom'`
   - 缺點：URL 變為 `/#/subpage`
3. **Inprod 觀察用技巧**
   - `browser_console` + `document.getElementById('root').innerHTML.length` 要 0
   - 若 `element_count: 0` 且 `<div id="root">` 為空，= React 未 mount

## 速查表

| 現象 | 最可能原因 | 修復 |
|---|---|---|
| 首頁正常，子頁空白 | StrictMode + createRoot + RR7 conservative | 移除 StrictMode wrapper |
| 首頁正常，路徑刷新空白 | nginx `try_files` 欄位 | 確認 fallback to `/index.html` |
| HashRouter 可用但 BrowserRouter 空白 | Cloudflare 代理/double-href | 改 HashRouter |
| 所有頁空白，含首頁 | React 未 mount（entry point 錯誤） | 確認 `createRoot` 在 bundle 中 |
| 修改了 src/ 但 still blank | Vite 增量快取沒過 | 強制 rebuild + 查 built JS 實際內容 |
| 修改 deploy 後仍舊 | VPS assets 堆積舊 JS | 清掉 `assets/index-*.js` 舊檔，reload nginx |
| HashRouter 站子頁顯首頁、console 乾淨 | 測試網址漏 `#` 前綴（非 bug，是特性） | 改用 `https://host/#/subpage` 測試 |
| Navbar 跳轉正常但 Footer 連結死/刷新 | Footer 用 `<a href="/path">` 非 `<Link>` | 全部改 `<Link to="/path">`，勿用 `href="#"` |

## Rocket Loader Free-plan workaround

When all of the following are true, stop modifying `main.jsx` / App.jsx, and apply this sequence:

1. Cloudflare Rocket Loader is active on the domain.
2. `<script type="module" src="...index-xxx.js">` is being rewritten by Cloudflare to `type="<hash>-module"` or `type="<hash>-text/javascript"`.
3. `data-cf-rl="false"` does not stop the rewrite.

**Confirmed limitations**:
- Cloudflare zone settings API: `PATCH /zones/{id}/settings/rocket_loader` returns `invalid object identifier` on Free plan. Do not retry.
- Dashboard-only control: the toggle exists at `Speed → Optimization → Rocket Loader`, but requires plan upgrade or manual action.
- Changing `type="module"` to `type="text/javascript"` does not help on Free plan; Rocket Loader still rewrites.

**Working fix on Free plan**: inline the built JS into `index.html` and escape any `</script>` sequences.

Steps:
1. Rebuild locally: `pnpm run build`
2. Copy exact dist `index.html` + `assets/index-*.js` byte sizes to VPS.
3. Use `python3 -c "..."` to read both files, replace the main `<script ... src="/assets/index-xxx.js"></script>` with `<script crossorigin>` + JS + `</script>`, and escape `</script>` inside the JS as `<\/script>`.
4. Verify: `wget -O - <url> | wc -c` must equal the `index-xxx.js` byte size.
5. Reload nginx; if using Cloudflare, purge cache in Dashboard and force no-store on `/`:
   - nginx `location / { try_files ...; add_header Cache-Control "no-store" always; }`

**If it's still blank after inline succeeds**: Check the FIRST console error stack. Two known post-inline failure modes exist:

1. `Cannot use 'import.meta' outside a module` from `rocket-loader.min.js`
   - Cause: inline JS executes as classical script, but the Vite bundle contains literal `import.meta.resolve` / `import.meta.url` references. These throw in non-module context.
   - Verify: `curl -sS <url> | grep -o 'import\.meta' | wc -l` must be `0`.
   - Patch the built JS before inlining:
     ```
     js = js.replace("import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href", "new URL(e,location.href).href")
     js = js.replace("import.meta.url", "location.href")
     js = js.replace("import.meta.resolve", "function(x){return new URL(x,location.href).href;}")
     ```
   - Rebuild the inline HTML with the patched JS, verify 0 `import.meta` remain, then redeploy.

2. React runtime error inside the app itself
   - Cause: a component throws during mount, hiding behind the Rocket Loader noise.
   - Fix: open DevTools Console directly on the live page, read the first red error stack, and patch the offending component.

**If it's still blank after inline + import.meta fix succeeds**: that is a real React runtime error inside the app. Switch to a real browser, open DevTools Console, and report the first red error stack.

**Browser-tool unreliability on some Windows hosts**: `browser_console` can fail with `Failed to execute C:\Users\dingj\.vite-plus\js_runtime\node\npx.cmd: batch file arguments are invalid`, or keep navigating to `about:blank`. Do not trust browser snapshot/console alone on such hosts. Use `curl` / `urllib` against the production URL as the authoritative source for script tag shape, inline JS content, and bundle markers.

**Verifying client-side React state without a browser (preferred when browser capture is flaky):** When the feature under test is a *conditional render driven by component state* (e.g. a validation-error banner, a feature panel, a Dr. Thoth side-drawer), a remote browser over a Turbopack dev server is doubly unreliable — hot-reload may not push edits to the persistent Browserbase context, and a killed dev server can leave a zombie PID holding the port (git-bash `kill` cannot reach native Windows PIDs; use `cmd.exe /c "taskkill /PID <pid> /F"`). The screenshot/AX-snapshot then shows "no change" even though the logic is correct, sending you chasing a phantom bug.

Reliable alternative: **extract the state derivation into a pure, exported function and unit-test the exact value the UI conditional reads.**
```ts
// Extract instead of inlining in handleSubmit
export function computeFeedback(payload): FeedbackState {
  const result = validateESGData(payload);
  return result.success
    ? { status: 'success', message: result.message }
    : { status: 'error', message: result.message, errors: result.errors };
}
// Component: setFeedback(computeFeedback(payload))
```
Then a Vitest test asserts the derived state for the exact inputs that should flip the UI conditional (`feedback.status === 'error'`). This proves the value the banner's `{feedback.status === 'error' && <Banner/>}` reads — deterministic, in-process, no port/hot-reload. `next build` success is the authoritative proof the JSX compiles. A `try/catch` inside the handler that surfaces a thrown exception as a banner is a fine debug probe, but remove it once the unit test proves the pure function — keep production code clean. This pattern is more trustworthy than a remote-browser capture when the dev server's module graph is stale.

**Post-Rocket-Loader-off blank-page diagnostic**: after the user disables Rocket Loader and purges cache, run:
```bash
curl -sS -H 'Accept-Encoding: identity' -H 'User-Agent: Mozilla/5.0' https://ftg.esggo.co/ > /tmp/ftg-online.html
python3 -c "import re; h=open('/tmp/ftg-online.html').read(); print('root_len', len(re.search(r'<div id=\"root\">(.*?)</div>', h, re.DOTALL).group(1).strip())); print('has_rocket', 'rocket-loader.min.js' in h); print('script_count', h.count('<script'))"
```
If `has_rocket` is False but `root_len` is 0, the remaining failure is a React runtime error inside the app, not Cloudflare.

**Verify user manual Rocket Loader disable actually took effect**: even after the user toggles it off, their browser may still see the old Cloudflare edge cache. Ask them to do `Caching -> Purge Everything`, then force `Cache-Control: no-store` on `/` in nginx so next fetch bypasses cache.
