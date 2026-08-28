# SSE route shadowing fix (`/stream` vs `/stream.html`)

## Symptom
On the public proxy (translate.esggo.co), `GET /stream.html` returned the SSE
heartbeat instead of the audience HTML page. Root cause: the SSE handler
matched `url.startsWith('/stream')`, which also catches `/stream.html`
(prefix match), so the static-file route (which maps `/stream.html →
/stream.html`) never ran.

## Fix (commit `1dbedc075`, server.mjs ~line 218)
```js
// BEFORE
if (url.startsWith('/stream') && req.method === 'GET') {
// AFTER
if ((url === '/stream' || url.startsWith('/stream?')) && req.method === 'GET') {
```
Exact match for the SSE endpoint + query-param variant. `/stream.html`
now falls through to the static route (line ~241: `else if (urlPath === '/stream' || urlPath === '/stream.html') file = '/stream.html';`).

## Verification (no background server — in-process boot+probe)
```js
// temp _routefix.mjs, rm -f after
import http from 'http';
process.env.PORT='8812';
await import('./server.mjs');
await new Promise(r=>setTimeout(r,1500));
function get(p, t=1200){return new Promise(res=>{const req=http.get('http://127.0.0.1:8812'+p,r=>{let d='';let done=false;r.on('data',c=>{d+=c;if(!done){done=true;req.destroy();res({status:r.statusCode,ctype:r.headers['content-type'],body:d});}});r.on('end',()=>{if(!done)res({status:r.statusCode,ctype:r.headers['content-type'],body:d});});});req.on('error',()=>res({status:0}));setTimeout(()=>{if(!done){req.destroy();res({status:0});}},t);});}
const sse=await get('/stream');
const page=await get('/stream.html');
const pass = sse.status===200 && (sse.ctype||'').includes('event-stream') && page.status===200 && page.body.includes('capCtx');
console.log('ROUTE_FIX:', pass?'PASS':'FAIL', sse.ctype, page.body.includes('capCtx'));
process.exit(pass?0:1);
```
NOTE: the SSE `GET /stream` connection stays OPEN (streaming) — the probe
MUST `req.destroy()` on first `data` chunk or it hangs 180s.
Expect: `ROUTE_FIX: PASS text/event-stream true`.

## Live check after deploy
```bash
curl -s --max-time 12 "https://translate.esggo.co/stream.html?cb=$(date +%s)" | grep -c 'capCtx'   # expect 2
curl -s --max-time 4 "https://translate.esggo.co/stream?room=demo" | grep -c 'event: heartbeat'   # expect 1
```
