# 電腦聲音模式 — getDisplayMedia + 本地 Whisper STT（免費、零 key）

適用：universal-translator `public/studio.html` 要擷取「電腦播放的聲音」（YouTube / Zoom / 其他 App）並即時轉錄翻譯。

Web Speech API 只能吃麥克風，抓不到系統/分頁音 → 必須換架構。本方案沿用 §2 免費原則：STT 跑在瀏覽器本地，不經任何付費 API。

## ⚠️ 2026-08-07 實證修正（重要）
**舊組合 `@xenova/transformers@2.17.2` + `Xenova/whisper-tiny` 已失效** —— `curl` 實測：
- `cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2` → 200（CDN 在）
- 但 `Xenova/whisper-tiny/resolve/main/encoder_model.onnx` → **404**（模型檔名/路徑已不存在）
- 所有 `Xenova/*` 的 `encoder_model.onnx` / `encoder_model_quantized.onnx` / `model.onnx` 均 404
- `onnx-community/*` 的模型放在 `onnx/` 子目錄下（v3 慣例），且 `Xenova/` 的 README 也是 307 空轉

**已驗證可用組合（寫死進 studio.html，勿回退）**：
- CDN：`https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0` → 200 OK
- 模型：`onnx-community/whisper-tiny`（多語，tiny 最快；或 `.en` 純英文更小）
  - 實際權重量化路徑：`onnx/encoder_model_quantized.onnx` → 302→**200 OK，10.1MB**（curl 實證）
- 載入：`pipeline('automatic-speech-recognition','onnx-community/whisper-tiny',{dtype:{encoder_model:'q8',decoder_model:'q8',decoder_model_merged:'q8'}})`

## 流程
1. 擷取：`navigator.mediaDevices.getDisplayMedia({video:true, audio:true})` → 使用者勾選「分享聲音」。
   - 只要 audio track：`sysStream.getVideoTracks().forEach(t=>t.stop())`。
   - 未勾選 → `getAudioTracks()[0]` 為空 → toast 提示重選。
2. STT：動態 `import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0')`
   → `pipeline('automatic-speech-recognition','onnx-community/whisper-tiny',{dtype:{encoder_model:'q8',decoder_model:'q8',decoder_model_merged:'q8'}})`。首載 ~30-50MB，後續快取。
3. 分段：AudioWorklet 累積 float32（每 ~4 秒送一段）→ `asr(chunk,{chunk_length_s:30,stride_length_s:5,language:langToWhisper(l)})`。
4. 轉錄→翻譯：複用 `addUtterance(text)` → `/translate` 多語管線。

## 關鍵細節
- 麥克風 / 電腦聲音互斥（`micListening` / `sysActive` flag），避免雙重收音。
- 語言對映（Whisper code，非 ISO）：`zh-TW→chinese`, `en→english`, `ja→japanese`, `es→spanish`, `fr→french`。
- AudioWorklet 注入用 `audioWorklet.addModule('data:text/javascript,'+encodeURIComponent(...))` 避免額外檔案。
- 模型可換（仍用 `onnx-community/` 命名空間，勿用 `Xenova/`）：`whisper-base` 更準但較大；`.en` 版純英文更小更快。載入都帶 `dtype:{...:'q8'}` 量化。
- Safari/Firefox 的 `getDisplayMedia` 音訊規格差異 → `try/catch` 包住，失敗 toast。

## 測試責任分界
- agent 可驗證：外部 `https://translate.esggo.co/studio.html` 含 `🎙 電腦聲音` 鈕（browser 快照 + 視覺截圖）。
- 使用者本機驗證：點鈕 → 分享對話框勾選「分享聲音」→ 播 YouTube → 看轉錄區。headless 瀏覽器無麥克風/系統音硬體，且 `getDisplayMedia` 需真實使用者手勢授權，agent 無法代勞。

## 最小可用 AudioWorklet processor（data: URI 注入）
```js
class Rec extends AudioWorkletProcessor{
  constructor(){super();this.buf=[];}
  process(inputs){const inp=inputs[0][0];if(inp){this.buf.push(new Float32Array(inp));
    if(this.buf.length>=25){const chunk=this.buf;this.buf=[];let len=0;chunk.forEach(c=>len+=c.length);
      const all=new Float32Array(len);let o=0;chunk.forEach(c=>{all.set(c,o);o+=c.length;});
      this.port.postMessage(all);}}return true;}
}
registerProcessor('rec',Rec);
```
