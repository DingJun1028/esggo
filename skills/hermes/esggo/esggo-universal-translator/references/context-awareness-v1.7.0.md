# Context Awareness v1.7.0 — cross-utterance memory (verified 2026-08)

## Why
Live subtitles translated each sentence in isolation lose pronoun reference (他/她/它),
tense continuity (昨天/今天), and topic coherence. Context buffer keeps a rolling window
of recent (src→tgt) pairs per room.

## Module contract (`context_buffer.mjs`)
- `recordUtterance({room, src, tgt, from, to})` — push to room buffer.
- `getContext({room, lastN})` — returns prior pairs old→new (excludes current utterance).
- `buildContextHint({room})` — formats last 3 as a string for Gemini system-instruction, e.g.
  `前文 (供連貫參考, 非翻譯對象):\n1. 我昨天去了台北 → I went to Taipei yesterday`.
- `resetRoom(room)`, `contextStatus()`, `isContextEnabled()` (gated `CONTEXT_AWARE`, default 1).

## Wiring
- `translate.mjs` `translateDetailed(text, from, to, ctxHint)`: 4th param flows ONLY into
  `viaGeminiLive35` (key-gated). Free engines ignore it → honest degradation.
- `server.mjs`: `doTranslateAndBroadcast` + `/translate` REST branch both call
  `buildContextHint`, `recordUtterance`, and attach `context` (last 3 prior) to the SSE
  broadcast payload. REST response does NOT include `context` (audience-only via SSE).

## Verified SSE round-trip (the ONLY reliable way to confirm context propagates)
Background `terminal(background=true)` kills node servers in this sandbox. Use an
in-process script that imports the server, opens a raw fetch SSE stream, posts two
translates, and asserts the 2nd event carries `context` with the 1st utterance:

```js
// _ctxcheck.mjs (delete after running)
process.env.PORT='88XX'; process.env.CONTEXT_AWARE='1';
await import('./server.mjs');
await new Promise(r=>setTimeout(r,1500));
const base='http://127.0.0.1:88XX';
const post=(p,b)=>fetch(base+p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
const events=[]; const ctrl=new AbortController();
(async()=>{ const r=await fetch(base+'/stream?room=demo',{signal:ctrl.signal});
  const rd=r.body.getReader(),dec=new TextDecoder(); let buf='';
  while(true){const{done,value}=await rd.read(); if(done)break; buf+=dec.decode(value,{stream:true});
    let i; while((i=buf.indexOf('\n\n'))>=0){const c=buf.slice(0,i);buf=buf.slice(i+2);
      const m=c.match(/^data: (.+)$/m); if(m){try{events.push(JSON.parse(m[1]));}catch{}}}}})();
await new Promise(r=>setTimeout(r,200));
await post('/translate',{text:'我昨天去了台北',from:'zh-TW',to:'en',room:'demo'});
await post('/translate',{text:'那裡的夜市很熱鬧',from:'zh-TW',to:'en',room:'demo'});
await new Promise(r=>setTimeout(r,300)); ctrl.abort();
const t2=events.filter(e=>e.text).find(e=>e.text==='那裡的夜市很熱鬧');
console.log('T2 contextLen=',(t2&&t2.context?t2.context.length:0),'prev=',JSON.stringify(t2&&t2.context?t2.context.map(c=>c.src):[]));
// expect: contextLen=1, prev=["我昨天去了台北"]
process.exit(0);
```
Run: `node _ctxcheck.mjs` then `rm _ctxcheck.mjs`. The trailing `Assertion failed:
!(handle->flags & UV_HANDLE_CLOSING)` on exit is a benign Windows-Node teardown quirk
(exit 0, all output already printed) — NOT a failure.

## Note
`search_files` tool FAILS on `apps/universal-translator/*` (MSYS path quirk, "IO error
os error 3"). Use `terminal` + `grep -n` / `python3` regex for files under that dir.
