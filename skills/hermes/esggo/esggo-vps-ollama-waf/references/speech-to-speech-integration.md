# Speech-to-Speech × OmniBlueprint Hub 整合（完整架構）

> 來源：HuggingFace `speech-to-speech` README（VAD→STT→LLM→TTS，OpenAI Realtime-compatible WebSocket）

## 架構

```
講者麥克風 / 觀眾語音
  → s2s (VPS :8765, OpenAI Realtime 相容)
      VAD (Silero) → STT (Parakeet) → LLM (gemma4:e2b) → TTS (Qwen3)
  → 文本事件 (transcript / response)
  → HUB /voice/bridge → /speak → 多語翻譯 SSE /stream
觀眾 → stream.html 字幕 + s2s 音訊流
```

## VPS 部署（Oracle ARM, 2.8G RAM, CPU-only）

資源預算：Parakeet STT ~600MB + gemma4:e2b ~1.5GB + Qwen3-TTS ~400MB ≈ 2.6GB（逼近上限）。
吃緊時 TTS 改 `--tts kokoro` 或 STT 改 `whisper tiny`。

```bash
pip install speech-to-speech   # PyPI 0.2.12 可用
# 啟動 s2s，LLM 槽指本機 Ollama
speech-to-speech serve \
  --host 0.0.0.0 --port 8765 \
  --stt parakeet-tdt \
  --llm_backend chat-completions \
  --model_name "gemma4:e2b" \
  --responses_api_base_url "http://localhost:11434/v1" \
  --responses_api_api_key "" \
  --tts qwen3 \
  --enable_live_transcription
```

## nginx 反代（live.esggo.co 現有 conf 加）

```nginx
location /voice/ws {
  proxy_pass http://127.0.0.1:8765/v1/realtime;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_read_timeout 3600s;
}
```

## HUB /voice/bridge 端點（monitor-server.mjs 插入 /speak 之後）

```js
if (path === '/voice/bridge' && req.method === 'POST') {
  let body = '';
  req.on('data', c => { body += c; if (body.length > 1e5) req.destroy(); });
  req.on('end', async () => {
    try {
      const { text, role } = JSON.parse(body); // role: 'user' | 'agent'
      if (!text) { res.writeHead(400); res.end(JSON.stringify({ok:false})); return; }
      const { translations, engines } = await translateToMany(text, LANG_DEFAULT, LANG_TARGETS);
      const payload = {
        ok: true, src: 'voice-agent', sourceOrigin: 's2s:' + role,
        from: LANG_DEFAULT, text, translations, engines,
        hash: hashOf(text), timestamp: new Date().toISOString()
      };
      broadcast('voice-agent', { type: 'translation', data: payload });
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok:false, error: String(e) }));
    }
  });
  return;
}
```

## 5T 對齊

| 5T | 實作 |
|---|---|
| 真 (Traceable) | `sourceOrigin: 's2s:user' / 's2s:agent'` |
| 善 (Transparent) | 模型名寫入事件 meta |
| 美 (Tangible) | stream.html 液態玻璃字幕卡 |
| 信 (Trustworthy) | `hash: hashOf(text)` |
| 通 (Trackable) | SSE 事件帶 `timestamp` |
