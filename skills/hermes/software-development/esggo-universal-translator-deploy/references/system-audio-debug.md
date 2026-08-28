# 系統音模式（Zoom / 電腦聲音）抓不到音 — 診斷與修法樣板

適用：universal-translator `studio.html` 系統音模式無字幕、音量條不動。

## 根因速查表
| 症狀 | 根因 | 修法 |
|---|---|---|
| 狀態「第 N 輪」但字幕空白、dbg「尚無記錄」 | startSys 停掉 video track → audio track 一併死 → chunks 永遠 0 | 不停 video；用 `new MediaStream(stream.getAudioTracks())` 給 MediaRecorder |
| 點開始後音量條完全不動 | getDisplayMedia 選擇器沒勾「分享音訊」，或選了「此分頁/無聲源」 | 用戶重選：整個螢幕或 Zoom 視窗 + 勾「分享音訊」 |
| dbg 顯示 `chunks=0 bytes=0` | 音源沒進來（上者） | 同上，指引用戶重選來源 |
| dbg 顯示 `chunks>0` 但轉錄空/500 | STT 服務掛掉（見 SKILL.md STT pm2 守護） | `pm2 restart stt` + `ss -tlnp | grep 8791` |

## startSys 正確寫法（不停 video）
```js
async function startSys(){
  try{
    const s=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
    const a=s.getAudioTracks()[0];
    if(!a){ toast('請在分享視窗勾選「分享音訊」'); s.getTracks().forEach(t=>t.stop()); return null; }
    // 不停 video track: Chrome 停 video 會讓 display audio 一併失效
    return s;
  }catch(e){ const m=await startMic(); if(m) toast('系統音失敗，改用麥克風'); return m; }
}
```

## 系統音錄音分支（audio-only + dbg）
```js
stream=await startSys();
if(!stream){ /* 復原 UI */ return; }
startMeter(stream);                              // 音量條診斷
const audioOnly=new MediaStream(stream.getAudioTracks());
const rec=new MediaRecorder(audioOnly,{mimeType:mime});
rec.ondataavailable=e=>{ if(e.data.size>0) chunks.push(e.data); };
rec.onstop=async()=>{
  dbg(`rec.onstop chunks=${chunks.length} bytes=${chunks.reduce((a,c)=>a+c.size,0)}`);
  if(!chunks.length){ if(running) rec.start(4000); return; }
  const buf=await new Blob(chunks,{type:mime}).arrayBuffer();
  dbg(`POST /transcribe bytes=${buf.byteLength}`);
  // ...fetch('/transcribe?lang=auto', {method:'POST', body:buf})...
};
```

## 即時音量條（startMeter / stopMeter）
```js
let audioCtx=null, analyser=null, meterRAF=0;
function startMeter(stream, probeOnly=false){
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    const src=audioCtx.createMediaStreamSource(stream);
    analyser=audioCtx.createAnalyser(); analyser.fftSize=256;
    src.connect(analyser);
    const data=new Uint8Array(analyser.frequencyBinCount);
    const fill=$('#meterFill'), meter=$('#meter');
    meter.classList.add('live');
    const loop=()=>{
      analyser.getByteTimeDomainData(data);
      let peak=0; for(const v of data){ const d=Math.abs(v-128); if(d>peak)peak=d; }
      const vol=Math.min(100, Math.round(peak/128*100*1.6));
      fill.style.width=vol+'%';
      meterRAF=requestAnimationFrame(loop);
    };
    loop();
  }catch(e){ console.warn('meter init failed', e); }
}
function stopMeter(){ if(meterRAF) cancelAnimationFrame(meterRAF); meterRAF=0;
  const meter=$('#meter'); if(meter) meter.classList.remove('live');
  const fill=$('#meterFill'); if(fill) fill.style.width='0%'; }
```
HTML: `<div class="meter" id="meter"><div class="meter-fill" id="meterFill"></div><span class="meter-tip" id="meterTip">音量表（開始後顯示系統音強弱）</span></div>`

## 給用戶的 SOP（開始系統音前）
1. 勾「用系統音（電腦 / Zoom 聲音）」
2. 點開始 → 瀏覽器彈「選擇要分享的內容」
3. 選「整個螢幕」或「Zoom 會議視窗」，**務必勾底部「分享音訊 / Share audio」**
4. 看音量條：會動 = 成功；不動 = 重做步驟 3 並確認有勾音訊
