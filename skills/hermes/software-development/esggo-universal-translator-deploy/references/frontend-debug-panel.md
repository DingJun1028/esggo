# 前端靜默失敗 → 加可視化除錯面板（diagnose-first 模式）

適用：用戶回報「XX 沒出現 / 轉錄錯誤字幕沒出現 / 一樣未出現」，但你**看不到用戶瀏覽器 console**，且先前已「修過」卻仍報錯。

## 核心原則（FIRST-CLASS）
用戶說「還是沒出現」時，**不要盲目重寫 UI 再賭一次**。先加**可視化儀表**，把後端原始回應攤在用戶眼前，讓他能直接回報 STT/API 實際回了什麼。這能區分：
- 音源問題（靜音 / 沒授權 / 系統音沒勾「分享音訊」）→ 回空 text
- 後端錯誤（HTTP 500 / JSON 含 error 欄） → 回錯誤
- 模型弱 / 合成音 → 回垃圾內容（如 `1,2,1,2...`）

## 可複製程式碼樣板（studio.html 已部署，universal-translator 可直接抄）

### 1. HTML：可折疊除錯面板（放在主內容區下方）
```html
<details class="gl">
  <summary>🐞 除錯資訊（轉錄異常時展開看 STT 原始回應）</summary>
  <div id="debug" style="font-size:.75rem;color:var(--muted);white-space:pre-wrap;word-break:break-all;max-height:140px;overflow:auto;margin-top:6px">— 尚無記錄 —</div>
</details>
```

### 2. JS：dbg() 輔助函式（放在 setStatus/toast 附近）
```js
function dbg(msg){const d=$('#debug');if(d){const ts=new Date().toLocaleTimeString();d.textContent+=`\n[${ts}] ${msg}`;d.scrollTop=d.scrollHeight;}}
```

### 3. 在每次 fetch 回應後記錄原始回應（transcribe 與診斷鈕都加）
```js
const r=await fetch(API.replace('/translate','/transcribe')+'?lang=auto',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:buf});
const d=await r.json();
dbg(`transcribe HTTP=${r.status} → ${JSON.stringify(d).slice(0,160)}`);   // ← 關鍵：把原始回應攤開
if(d.text&&d.text.trim())onText(d.text.trim());
else if(!r.ok){ const m='轉錄失敗 ('+r.status+')：'+(d.error||'服務異常'); toast(m); showErrorCard(m); }
else { const m='未偵測到語音（請大聲說話 / 系統音模式請勾選「分享音訊」）'; toast(m); showErrorCard(m); }  // ← 空 text 也要 showErrorCard，不能只 toast
```

### 4. 診斷鈕（讓用戶自行區分音源 vs STT）
錄 4 秒 → 轉錄 → 字幕區顯示原始結果（**不推播觀眾端**）。判讀：
- 轉錄出文字但 `clean.length<2`（clean = 去掉數字/符號後） → 紅字「麥克風可能太遠/太吵」
- HTTP 非 2xx → 紅字「轉錄失敗 (status): error」
- 空 text → 紅字「未偵測到語音」

## 配套診斷步驟（agent 端，確認後端健康）
1. **CORS 排除**：`curl -i -X POST 'https://<host>/transcribe?lang=auto' -H 'Origin: https://<host>' --data-binary @<file>` 看回應頭有無 `access-control-allow-origin: *` + 實際 `HTTP/1.1` 狀態。若無 CORS header → 前端 fetch 會被瀏覽器擋（catch 分支報「轉錄錯誤」）。
2. **鏈路分三段驗證**：對外 Cloudflare → node `/transcribe` 代理 → 本地 STT(8791)。分別 curl 確認各段都回 JSON。
3. **模型升級決策**：base 模型對**真實人聲**準確率公認夠用；**不要盲目升 small**（CPU 推論慢 4x，破壞即時性）。只有確認是真實人聲仍轉不準才考慮。

## 教訓（寫進 SKILL.md）
任何後端推播失敗都要**同時顯示在 UI 主區域 + 原始回應日誌**，不能只靠 toast（toast 3.5s 會被忽略）。用戶說「還是沒出現」= 你之前的錯誤回饋不夠可見 → 加儀表，不要重寫。
