# 萬能即時翻譯平台 × Speech-to-Speech 語音代理整合

> 將 HuggingFace `speech-to-speech`（VAD→STT→LLM→TTS 語音代理管線）整合進 OmniBlueprint Hub（live.esggo.co 萬能即時翻譯中樞）

## 1. 整合定位

| 層 | 現狀 | 整合後 |
|---|---|---|
| OmniBlueprint Hub | 文字轉錄 + 多語翻譯 SSE 廣播（studio.html → /speak → /stream） | 保留，作為**文字中樞** |
| Speech-to-Speech | 未部署 | 新增**語音代理層**（語音進 → LLM → 語音出） |

**關係**：s2s 處理語音雙向對話；其產生的文本（STT 結果 + LLM 回應）回灌 HUB `/speak` 做多語翻譯 SSE 廣播，觀眾同時看到字幕（HUB）與聽到語音（s2s）。

## 2. 架構

```
┌─────────────────────────────────────────────────────────┐
│ 講者麥克風 / 觀眾語音                                       │
└────────────┬──────────────────────────────────────────────┘
             │ (WebRTC / WebSocket)
             ▼
┌─────────────────────────────────────────────────────────┐
│ Speech-to-Speech (VPS :8765, OpenAI Realtime 相容)        │
│   VAD (Silero) → STT (Parakeet) → LLM (gemma4:e2b) → TTS │
└────────────┬──────────────────────────────────────────────┘
             │ 文本事件 (transcript / response)
             ▼
┌─────────────────────────────────────────────────────────┐
│ OmniBlueprint Hub (/speak) → 多語翻譯 → SSE /stream      │
│   觀眾端 stream.html 收字幕 + 5T 溯源                      │
└─────────────────────────────────────────────────────────┘
```

## 3. VPS 部署（Oracle ARM, 2.8G 可用 RAM, CPU-only）

### 3.1 資源預算

| 元件 | 記憶體 | 說明 |
|---|---|---|
| Ollama gemma4:e2b | ~1.5 GB | 降級自 e4b（9.6GB 會 OOM） |
| s2s STT (Parakeet) | ~600 MB | CPU 推理 |
| s2s TTS (Qwen3-TTS GGML) | ~400 MB | 或系統 espeak 降載 |
| HUB (Node) | ~85 MB | 現有 |
| **總計** | **~2.6 GB** | 逼近上限，需關閉非必要服務 |

### 3.2 安裝 s2s

```bash
# VPS (Ubuntu ARM)
pip install speech-to-speech
# 或從源（uv）
git clone https://github.com/huggingface/speech-to-speech.git
cd speech-to-speech && uv sync
```

### 3.3 啟動 s2s（LLM 指本機 Ollama gemma4:e2b）

```bash
# Ollama 已起 (gemma4:e2b) → :11434
# s2s serve，LLM 槽經 OpenAI-compatible 指 Ollama
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

> 若 VPS RAM 吃緊：TTS 改用 `--tts kokoro`（更小）或 `--stt whisper --stt_model_name tiny`。

### 3.4 反向代理（nginx）

`live.esggo.co` 現有 nginx 反代 HUB :8787。加 s2s :8765：

```nginx
location /voice/ws {
  proxy_pass http://127.0.0.1:8765/v1/realtime;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_read_timeout 3600s;
}
```

## 4. HUB 整合端點

在 `monitor-server.mjs` 加 `/voice/bridge`：接收 s2s 文本事件，轉發 `/speak` 做翻譯廣播。

```js
// /voice/bridge: s2s 文本 → HUB 多語翻譯 SSE
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

## 5. 5T 對齊

| 5T | 實作 |
|---|---|
| 真 (Traceable) | `sourceOrigin: 's2s:user' / 's2s:agent'` |
| 善 (Transparent) | 演算法透明：STT/LLM/TTS 模型名寫入事件 meta |
| 美 (Tangible) | stream.html 液態玻璃字幕卡 |
| 信 (Trustworthy) | `hash: hashOf(text)` 不可篡改 |
| 通 (Trackable) | SSE 事件帶 `timestamp`，全生命週期追蹤 |

## 6. 當前狀態（2026-08-08）

- ⏸️ VPS OOM 卡死（gemma4:e4b 9.6GB 超 2.8G RAM），SSH 不可達
- ✅ GEMINI.md 已裝（OmniCore 憲章）
- ✅ HUB `/generate` 端點已寫（待 VPS 恢復 + 降級 gemma4:e2b 後活體驗證）
- ⏸️ s2s 整合待 VPS 恢復後執行（本文件為實作藍圖）

## 7. 執行順序（VPS 恢復後）

1. Oracle 控制台 Reboot VPS
2. 跑 `ollama_downgrade.sh`（e4b→e2b + 改 .env + 重啟 HUB）
3. 驗證 `/generate` 活體
4. 裝 s2s + 啟動 :8765 + nginx 反代
5. HUB 加 `/voice/bridge` 端點
6. 端到端驗證：語音 → s2s → HUB → SSE 字幕
