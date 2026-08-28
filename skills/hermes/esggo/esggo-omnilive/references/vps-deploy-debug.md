# OmniLive VPS 部署與除錯實戰記錄

## 部署路徑與服務
- 公網: `https://omnilive.esggo.co/` (cloudflared Tunnel `esggo-tunnel` → `127.0.0.1:8795`)
- omnilive: `pm2 omnilive` → `server.mjs` 聽 8795 (VPS 路徑 `/opt/esggo/apps/omnilive`)
- STT: `pm2 stt-whisper` → `server.py` 聽 8791 (VPS 路徑 `/var/www/esggo/apps/stt`)
- 本地 `C:\Project\esggo` 含 `apps/omnilive/` 與 `apps/stt/` (兩者修復已於 2026-08-17 commit 7b0740c14 入 git)。但 VPS 的 `/var/www/esggo/apps/stt` 非 git repo → 部署仍需 `scp apps/stt/server.py esggo-vps:/var/www/esggo/apps/stt/server.py` + `pm2 restart stt-whisper --update-env`。完整流程見 `apps/omnilive/DEPLOY.md`

## 常用驗證指令 (本機 Windows git-bash)
```bash
curl -s -o /dev/null -w "%{http_code}\n" --max-time 8 https://omnilive.esggo.co/health
ffmpeg -y -i "$LOCALAPPDATA/Temp/en.mp3" -ar 16000 -ac 1 -c:a pcm_s16le C:/Users/dingj/AppData/Local/Temp/en_test.wav
curl -s -X POST "https://omnilive.esggo.co/api/transcribe?room=T1&vad=1&lang=en" \
  --data-binary @C:/Users/dingj/AppData/Local/Temp/en_test.wav -H "content-type: audio/wav" --max-time 40
ffprobe -v error -show_entries stream=sample_rate,duration -of default=noprint_wrappers=1 file.wav
ffmpeg -i file.wav -af volumedetect -f null /dev/null 2>&1 | grep -iE "mean_volume|max_volume"
```

## VPS 除錯 (ssh esggo-vps)
```bash
pm2 list | grep -iE 'omnilive|stt'
curl -sf --max-time 8 http://127.0.0.1:8795/health
curl -sf --max-time 8 http://127.0.0.1:8791/health
ss -tlnp 2>/dev/null | grep -E '8795|8791'
tail -15 /var/www/esggo/apps/stt/logs/stt-out.log
tail -15 /var/www/esggo/apps/stt/logs/stt-error.log
tail -15 /home/ubuntu/.pm2/logs/omnilive-error.log
( timeout 30 curl -s -N 'http://127.0.0.1:8795/stream?room=X' > /tmp/sse.txt & )
sleep 2; curl -s -X POST 'http://127.0.0.1:8795/api/transcribe?room=X&vad=1&lang=en' \
  --data-binary @/tmp/en_test.wav -H 'content-type: audio/wav' --max-time 60 >/dev/null
sleep 20; grep -E 'event: subtitle' /tmp/sse.txt
```

## 這輪踩過的坑 (根因→修法)
1. 字幕亂猜/幻覺 → AudioContext 48k 當 16k → 強制 `sampleRate:16000`
2. 500 偶發 → server.mjs 硬寫 lang=auto 忽略前端 lang → 透傳 `q.get('lang')`
3. 完全沒字幕 → medium 慢模型永久卡死 inflight → 降 small + inflight 45s 超時
4. 502 → start.mjs 當 pm2 入口, 子程序死父仍 online → 改 `pm2 start server.mjs`
5. STT crash-loop → 手動 setsid 殘留佔 8791 → `fuser -k 8791/tcp` 清場
6. whisper 弱音幻覺 → 加抗幻覺參數 (condition_on_previous_text=False 等)
7. **caster 建立房間後本機無字幕、觀眾有 (終極突破)** → `connectSSE()` 頁面載入時用空 room 連; 建立房間後 `history.replaceState` 換 URL 但 `if(es)return` 擋重連 → caster SSE 掛空房間收不到自己字幕。修法: `connectSSE()` 開頭 `if(es){es.close();es=null;}`; `createRoom` 換 URL 後呼叫 `connectSSE()`。診斷訣竅: 當「一端有字幕一端沒有」時, 先比對兩端 SSE 訂閱的 room 是否一致, 而非懷疑 STT/翻譯 (觀眾有字幕已證明後端全通)。

## 模型選擇
- small: CPU 即時場景, 推理 4-8s/段, 準確度夠 (根因修後聽得對)
- medium: 更準但 20-30s/段, 即時字幕體驗崩壞, 僅作高準度離線用
- 切換: `pm2 set stt-whisper:WHISPER_MODEL small` + `pm2 restart stt-whisper --update-env` + `pm2 save`
