# SSE broadcast + subtitle features (2026-08-07 session)

Concrete patterns added to `apps/universal-translator` for the "real-time speech -> video-style
subtitles" goal. All FREE, no paid API. External URL: `https://translate.esggo.co`.

## 1. SSE broadcast fix (the real bug)

**Symptom:** `/stream` returned the `stream.html` HTML body instead of an SSE stream, so the
audience page never received subtitles. Root cause: the static-route block in the main
`http.createServer` callback matched `urlPath === '/stream'` -> `page = '/stream.html'` and
`res.end()`'d the HTML BEFORE the secondary `server.on('request')` SSE listener could run. Two
listeners also raced on the same `res`.

**Fix — handle SSE FIRST, inside the main callback, and `return`:**
```js
// defined BEFORE server creation (avoids TDZ; shared by WS handler)
const sseClients = new Set();
function broadcastTranslation(payload) {
  const data = `event: translation\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const c of sseClients) {
    try { c.res.write(data); } catch { sseClients.delete(c); }
  }
}

const server = http.createServer(async (req, res) => {
  // ... CORS, /health ...

  // SSE must come BEFORE the static-route block
  if (req.url.startsWith('/stream') && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache', 'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    const client = { res, id: Date.now() + Math.random() };
    sseClients.add(client);
    res.write(`id: ${client.id}\nevent: heartbeat\n\n`);
    req.on('close', () => sseClients.delete(client));
    return; // critical: don't fall through to static route
  }

  // static UI route (now '/stream' is excluded; only '/stream.html' serves the page)
  if (req.method === 'GET') {
    // ... keep '/stream.html' (page) but NOT '/stream' (SSE) ...
  }
});

// WS handler calls broadcastTranslation on every message
wss.on('connection', (ws) => {
  ws.on('message', async (msg) => {
    const { text, from = 'auto', to = 'zh', targets } = JSON.parse(msg.toString());
    if (!text) return;
    const trace = hashOf(text).slice(0, 16);
    if (Array.isArray(targets) && targets.length) {
      const r = await translateToMany(text, from, targets);
      broadcastTranslation({ text, translations: r.translations, engines: r.engines, trace });
      ws.send(JSON.stringify({ text: Object.values(r.translations)[0] || '', engine: Object.values(r.engines)[0] || 'n/a', cached: false, version: APP_VERSION, trace }));
    } else {
      const rec = await translateDetailed(text, from, to);
      broadcastTranslation({ text, translations: { [to]: rec.text }, engine: rec.engine, cached: rec.cached, trace });
      ws.send(JSON.stringify({ text: rec.text, engine: rec.engine, cached: rec.cached, version: APP_VERSION, trace }));
    }
  });
});
```

**Verification (VPS localhost, bypasses Cloudflare Tunnel firewall on 8788):**
```js
// _verify.mjs run on VPS in /opt/esggo/apps/universal-translator
import { WebSocket } from 'ws';
import { request } from 'node:http';
const sse = request({host:'127.0.0.1',port:8788,path:'/stream?src=studio',headers:{Accept:'text/event-stream'}});
let raw='',got=null;
sse.on('response',res=>{res.setEncoding('utf8');res.on('data',d=>{raw+=d;const i=raw.indexOf('event: translation');if(i>=0&&!got){const j=raw.indexOf('data: ',i);const k=raw.indexOf('\n',j);try{got=JSON.parse(raw.slice(j+6,k));}catch(_){}}});});
sse.end();
await new Promise(r=>setTimeout(r,1200));
const ws=new WebSocket('ws://127.0.0.1:8788/ws');
ws.on('open',()=>ws.send(JSON.stringify({text:'test',from:'en',to:'zh-TW'})));
await new Promise(r=>setTimeout(r,4000));
console.log('SSE:', got? 'PASS':'FAIL', JSON.stringify(got));
```
Pass criterion: `got.translations['zh-TW']` present. NOTE: `curl`/direct-connect to
`161.118.248.180:8788` from OUTSIDE the VPS is blocked by firewall — test from VPS localhost
or through `https://translate.esggo.co` via browser.

## 2. rolling caption (stream.html)

Keep last N captions; newest highlighted, older faded — like video subtitles.
```css
.subtitle-box .cap{margin:0 0 4px;padding:3px 0;border-bottom:1px solid var(--line)}
.subtitle-box .cap.fresh{color:var(--accent);font-weight:600}
.subtitle-box .cap.old{opacity:.45}
```
```js
const MAX_CAPS = 6;
function pushCaption(lines){
  [...body.querySelectorAll('.cap.fresh')].forEach(c=>{c.classList.remove('fresh');c.classList.add('old');});
  const cap=document.createElement('div');cap.className='cap fresh';
  cap.innerHTML=lines.map(l=>l).join('<br>');
  body.appendChild(cap);
  const caps=body.querySelectorAll('.cap');
  if(caps.length>MAX_CAPS)caps[0].remove();
  body.scrollTop=body.scrollHeight;
}
es.addEventListener('translation',e=>{
  const d=JSON.parse(e.data);const lines=[];
  if(d.translations){for(const[code,txt]of Object.entries(d.translations))lines.push('<span class="lang">'+code+':</span> '+txt);}
  else if(d.text)lines.push(d.text);
  pushCaption(lines);
});
```

## 3. glossary (studio.html — frontend-only, free)

```html
<details class="glossary">
  <summary>📖 詞彙表（提升字幕精確度 · 選用）</summary>
  <textarea id="glossary" placeholder="每行一組：原文=譯文&#10;例：ESGGO=ESG-GO"></textarea>
</details>
```
```js
function parseGlossary(){
  const raw=document.getElementById('glossary').value||'';const map=[];
  for(const line of raw.split('\n')){const i=line.indexOf('=');
    if(i>0){const k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if(k)map.push([k,v]);}}
  return map;
}
function applyGlossary(text){
  let t=text;
  for(const [k,v] of parseGlossary()){if(k){const re=new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g');t=t.replace(re,v);}}
  return t;
}
// then wrap the translated text: applyGlossary(t) before inserting into DOM
```

## 4. QR distribution (studio.html — CDN with fallback)

```html
<button id="qrBtn">🔳 產生觀眾端 QR</button>
<div id="qrBox" class="qrbox" style="display:none"></div>
```
```js
const qrBtn=document.getElementById('qrBtn'),qrBox=document.getElementById('qrBox');
qrBtn.onclick=()=>{
  const room=Math.random().toString(36).slice(2,8);
  const url=location.origin+'/stream.html?src=studio&room='+room;
  qrBox.style.display='flex';qrBox.innerHTML='';
  const p=document.createElement('div');
  const tip=document.createElement('div');tip.className='modehint';tip.style.maxWidth='180px';
  tip.innerHTML='觀眾掃碼 -> 即時字幕<br><code>'+url+'</code>';
  qrBox.appendChild(p);qrBox.appendChild(tip);
  import('https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js').then(()=>{
    try{new QRCode(p,{text:url,width:128,height:128,colorDark:'#000',colorLight:'#fff'});}catch(e){p.innerHTML='<code>'+url+'</code>';}
  }).catch(()=>{p.innerHTML='<code style="word-break:break-all">'+url+'</code>';});
};
```
Headless browser may block the CDN import -> fallback shows the raw URL (still scannable by
pasting). Real Chrome/Edge loads the QR image.

## 5. Computer-audio STT (🎙 電腦聲音 mode, studio.html)

`getDisplayMedia({video:true,audio:true})` -> take audio track -> AudioWorklet captures 4s chunks
-> local Whisper (`onnx-community/whisper-tiny`, transformers.js v3) transcribes -> `addUtterance`.
**Verified deps (curl):** `@huggingface/transformers@3.0.0` CDN 200; `onnx-community/whisper-tiny`
`/onnx/encoder_model_quantized.onnx` -> 302->200 (10.1MB). `Xenova/*` + transformers v2 is DEAD (404).
Headless browser cannot run the WASM load — user must test locally. See `references/system-audio-whisper.md`.
