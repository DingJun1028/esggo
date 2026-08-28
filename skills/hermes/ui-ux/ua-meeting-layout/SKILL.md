---
name: ua-meeting-layout
description: UI/UX 最佳實踐：會議/影音免遮擾布局設計
version: "1.0"
author: "Hermes Agent"
---

# UA Meeting Layout Guidelines

> **「使用者偏好：UI/UX 最佳實踐」**

## 類別定位
設計適合正在觀看影片/視訊會議的情境，字幕/介面**必須不遮擾畫面**，採用「懸浮 + 半透明 + 可收起」模式。

---

## 🎯 核心規則：3T
1. **Transparent (透明)** - 介面背景使用 `backdrop-filter: blur()` + `rgba()` 半透明
2. **Tangible (具體)** - 具體的尺寸範圍：`clamp(8px, 2vw, 14px)` 版距，`max-height: 35vh` 字幕盒
3. **Trustworthy (可靠)** - 語言切換器直接「點擊即切」：自動辨識 + 多語並列

---

## 🧩 RWD 必備技巧

```css
/* 版距：隨螢幕自適應 */
--gap: clamp(8px, 2vw, 12px);
--radius: clamp(8px, 2vw, 14px);

/* 字幕盒：不遮擾畫面 */
.subtitle-box {
  position: fixed;
  bottom: 24px; right: 24px;
  max-width: 90vw; max-height: 35vh;
  backdrop-filter: blur(8px);
  background: rgba(20, 27, 41, 0.92);
  z-index: 999;
}

/* 移動端：自適應尺寸 */
@media (max-width: 480px) {
  .subtitle-box { bottom: 12px; left: 12px; right: 12px; }
}
```

---

## 📱 麥克風收音：手動開關 vs 自動啟動

```javascript
// ❌ 自動啟動版（本 session 已棄用）：開頁即辨識，使用者無法停止，且 Safari/Firefox 會直接報錯卡死
window.onload = () => speechRecognition.start();

// ✅ 手動開關版（推薦）：按鈕控制 + onend 自動重啟 + 錯誤 toast
let listening = false, recog = null;
micBtn.onclick = () => listening ? stopRec() : startRec();
function startRec(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ toast('請用 Chrome / Edge'); return; }
  recog = new SR(); recog.lang = sel.value; recog.continuous = true; recog.interimResults = true;
  recog.onresult = e => { /* 取 isFinal 轉錄 */ };
  recog.onend   = () => { if(listening) setTimeout(()=>{try{recog.start();}catch(_){}},200); }; // 自動續接
  recog.onerror = e => { if(e.error==='not-allowed'){ toast('請授權麥克風'); stopRec(); } };
  try{ recog.start(); }catch(e){ toast(e.message); }
}
```
- Web Speech API 僅 Chrome/Edge 支援；Safari/Firefox 不支援 → 必做降級提示（toast），不要靜默失敗。
- 授權是瀏覽器對「真實使用者實體裝置」的請求，agent/headless 無法代勞；本機麥克風測試必須交使用者執行。

---

## 🎙 電腦聲音模式（系統/分頁音訊擷取 + 本地 STT）

需求：轉錄「電腦正在播放的聲音」（YouTube、Zoom、其他 App），而 Web Speech API **只能吃麥克風**，吃不到 `getDisplayMedia` 的音流。解法：擷取音訊 → 本地 Whisper（瀏覽器跑、零 key、免費）→ 文字餵翻譯管線。

```javascript
// 1) 擷取：使用者必須在分享對話框勾選「分享聲音」，否則 audio track 為空
const stream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio:true });
const aTrack = stream.getAudioTracks()[0];
if (!aTrack) { toast('請重新選並勾選「分享聲音」'); stream.getTracks().forEach(t=>t.stop()); return; }
stream.getVideoTracks().forEach(t=>t.stop());   // 只留 audio
// 2) AudioWorklet 分段（每 ~4s 送一段 float32）→ Whisper
const ctx = new AudioContext();
const src = ctx.createMediaStreamSource(new MediaStream([aTrack]));
await ctx.audioWorklet.addModule('data:text/javascript,'+encodeURIComponent(workletSrc));
const node = new AudioWorkletNode(ctx,'rec');
src.connect(node).connect(ctx.destination);
node.port.onmessage = async (e) => { /* 累積 4s → asr(float32) → addUtterance */ };
// 3) 本地 Whisper（已驗證可載，勿用 404 的 Xenova/*）
const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0');
const asr = await pipeline('automatic-speech-recognition','onnx-community/whisper-tiny',
  { dtype:{ encoder_model:'q8', decoder_model:'q8', decoder_model_merged:'q8' } });
const out = await asr(float32, { chunk_length_s:30, stride_length_s:5, language:'chinese' });
```

**已驗證依賴（寫入前先 `curl -sI` 確認可達）**：
- CDN：`@huggingface/transformers@3.0.0` → 200
- 模型：`onnx-community/whisper-tiny/resolve/main/onnx/encoder_model_quantized.onnx` → 302→200（約 10MB）
- **`Xenova/whisper-tiny` 已 404**，勿用。v3 慣例模型在 `onnx/` 子目錄。

**麥克風 / 電腦聲音互斥**：同一時間只跑一種，避免雙重收音。

**headless 限制**：Whisper 的 WASM + 模型下載在 headless/remote browser 會卡住（逾時），但 CDN/模型可達性可用 `curl` 證明；真實跑通交使用者在本地 Chrome/Edge 驗證。

---

## ⚠️ Pitfalls（本 session 實證）

1. **CSS 自定變數未宣告 → 邊框/陰影消失**
   `studio.html` / `stream.html` 原引用 `var(--line)` / `var(--shadow)`，但 `:root` 從未宣告這兩個變數 → 所有 border/shadow 渲染為 invisible。
   **修法**：所有用到的 token 必須在 `:root` 宣告（見下方統一 token 塊），或改用具名色值。改完用真實瀏覽器看，不要用 curl 字串檢查（curl 看不出 CSS 漏宣告）。

2. **靜態檔路由缺失 → 子頁 404**
   若 server 只把 `/` map 到 `index.html`，`/studio.html` 等會 404。改為：任何 `public/*.html` 都依路徑服務；`/studio` `/stream` 等無副檔名別名也補上。

3. **只做 HTTP 字串驗證不夠**
   本 session 前幾輪只用 curl 確認「含某字串」，結果漏掉 CSS 變數缺失這種視覺破綻。正確做法：`browser_navigate` + `browser_snapshot` / `browser_vision` 實際渲染確認，再宣稱 UI 完成。

### 統一 3T token 塊（貼到每個頁面 :root，避免漏宣告）

```css
:root{
  --bg:#0b0f17; --panel:#141b29; --panel2:#0e1623; --accent:#36e0c0;
  --txt:#e8eef7; --muted:#8a97ad;
  --line:rgba(255,255,255,.1);                       /* ← 必須宣告，否則 border 消失 */
  --shadow:0 8px 30px rgba(0,0,0,.35);               /* ← 必須宣告，否則 shadow 消失 */
  --radius:clamp(8px,2vw,14px); --gap:clamp(8px,2vw,12px)
}
html[data-theme="light"]{ --bg:#eef2f7; --panel:#fff; --panel2:#f4f7fb; --txt:#16202e; --muted:#5b687e; --line:rgba(0,0,0,.12); --shadow:0 8px 30px rgba(0,0,0,.08); }
```

---

## 🔗 相關資源
- `references/meeting-subtitle-pattern.md` - 會議字幕設計模式
- `references/qr-room-sharing.md` - QR 房間分享流程