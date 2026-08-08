#!/usr/bin/env bash
# VPS 恢復後一鍵執行：Ollama 降級 + HUB /generate 驗證 + s2s 安裝 + HUB /voice/bridge + nginx 反代
# 用法：ssh 登入後 bash /tmp/deploy_voice_agent.sh
set -e

echo "====== [0/6] 環境確認 ======"
free -m | head -2
which ollama && ollama --version || echo "NO_OLLAMA"

echo "====== [1/6] Ollama 降級 gemma4:e4b -> e2b ======"
pkill -9 ollama 2>/dev/null || true
sleep 3
ollama rm gemma4:e4b 2>&1 || echo "(e4b 可能已不在)"
nohup ollama serve > /tmp/ollama_vps.log 2>&1 &
disown
sleep 5
curl -s -m5 -o /dev/null -w "ollama_http=%{http_code}\n" http://localhost:11434/ || echo "OLLAMA_DOWN"
ollama pull gemma4:e2b 2>&1 | tail -3

echo "====== [2/6] 驗證 HUB /generate (gemma4:e2b) ======"
ENV=/opt/esggo/apps/omni-blueprint-hub/.env
sed -i 's/^OLLAMA_MODEL=.*/OLLAMA_MODEL=gemma4:e2b/' "$ENV" 2>/dev/null || echo "OLLAMA_MODEL=gemma4:e2b" >> "$ENV"
cd /opt/esggo/apps/omni-blueprint-hub && pm2 restart omni-blueprint-hub 2>&1 | tail -2
sleep 4
echo "--- /generate test ---"
curl -s -m90 -X POST http://localhost:8787/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"用一句話說明 ESG 永續發展的重要性","max_tokens":128}' | head -c 500
echo ""

echo "====== [3/6] 安裝 speech-to-speech ======"
pip install "speech-to-speech[kokoro]" 2>&1 | tail -3 || pip install speech-to-speech 2>&1 | tail -3

echo "====== [4/6] 啟動 s2s (LLM 直接用 transformers 載 gemma4:e2b, 不走 Ollama 省 RAM) ======"
# RAM 保護: VPS 2.8G 可用, s2s 全管線需 ~2.6G, 與 Ollama 常駐衝突
# 方案: s2s 用 --llm_backend transformers 直接載模型 (不依賴 Ollama 常駐), 釋放 Ollama 佔用
FREE_MEM=$(free -m | awk 'NR==2{print $7}')
echo "可用 RAM: ${FREE_MEM}MB"
if [ "$FREE_MEM" -lt 2500 ]; then
  echo "WARN: 可用 RAM < 2.5G, s2s 全管線可能 OOM。先停 Ollama 釋放空間"
  pkill -9 ollama 2>/dev/null || true
  sleep 3
fi
nohup speech-to-speech serve \
  --host 0.0.0.0 --port 8765 \
  --stt parakeet-tdt \
  --llm_backend transformers \
  --model_name "gemma4:e2b" \
  --tts kokoro \
  --enable_live_transcription \
  > /tmp/s2s.log 2>&1 &
disown
sleep 20
echo "--- s2s health (port check) ---"
curl -s -m5 -o /dev/null -w "s2s_http=%{http_code}\n" http://localhost:8765/v1/realtime || echo "S2S_NOT_UP_YET"

echo "====== [5/6] HUB 加 /voice/bridge 端點 ======"
# 用 python patch monitor-server.mjs（在 /speak 區塊後插入 /voice/bridge）
HUB_JS=/opt/esggo/apps/omni-blueprint-hub/monitor-server.mjs
python3 - <<'PYEOF'
p = "/opt/esggo/apps/omni-blueprint-hub/monitor-server.mjs"
s = open(p, encoding="utf-8").read()
anchor = "  // 靜態檔：白名單制 (只公開前端資產，不外洩原始碼/設定)\n"
bridge = '''  // ── 語音代理橋接 (s2s 文本 -> 多語翻譯 SSE) ──
  if (path === '/voice/bridge' && req.method === 'POST') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e5) req.destroy(); });
    req.on('end', async () => {
      try {
        const cap = JSON.parse(body);
        const text = (cap.text || '').trim();
        const role = cap.role || 'agent';
        if (!text) { res.writeHead(400); res.end(JSON.stringify({ ok:false, error:'empty' })); return; }
        const { translations, engines } = await translateToMany(text, LANG_DEFAULT, LANG_TARGETS);
        const payload = {
          ok: true, src: 'voice-agent', sourceOrigin: 's2s:' + role,
          from: LANG_DEFAULT, text, translations, engines,
          hash: hashOf(text), timestamp: new Date().toISOString()
        };
        broadcast('voice-agent', { type: 'translation', data: payload });
        res.writeHead(200, { 'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type':'application/json' });
        res.end(JSON.stringify({ ok:false, error: String(e) }));
      }
    });
    return;
  }

'''
if anchor in s and "/voice/bridge" not in s:
    s = s.replace(anchor, bridge + anchor, 1)
    open(p, "w", encoding="utf-8").write(s)
    print("VOICE_BRIDGE_INSERTED")
else:
    print("SKIP (anchor missing or already present)")
PYEOF
# 語法檢查 + 重啟 HUB
node --check "$HUB_JS" && echo "HUB_SYNTAX_OK"
cd /opt/esggo/apps/omni-blueprint-hub && pm2 restart omni-blueprint-hub 2>&1 | tail -2
sleep 3

echo "====== [6/6] 反代 s2s WebSocket (nginx 或 cloudflared) ======"
# 偵測實際反代配置
NGINX_CONF=""
for c in /etc/nginx/sites-enabled/live.esggo.co /etc/nginx/conf.d/live.esggo.co.conf /etc/nginx/nginx.conf; do
  [ -f "$c" ] && NGINX_CONF="$c" && break
done
if [ -n "$NGINX_CONF" ]; then
  grep -q "voice/ws" "$NGINX_CONF" || cat >> "$NGINX_CONF" <<'NGEOL'

    # Speech-to-Speech WebSocket 反代 (OmniBlueprint Hub 語音代理)
    location /voice/ws {
        proxy_pass http://127.0.0.1:8765/v1/realtime;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 3600s;
    }
NGEOL
  nginx -t 2>&1 | tail -2 && (systemctl reload nginx 2>&1 | tail -1 || service nginx reload 2>&1 | tail -1)
  echo "NGINX_UPDATED: $NGINX_CONF"
else
  echo "NGINX_CONF_NOT_FOUND (VPS 可能用 cloudflared 反代)"
  echo "若用 cloudflared: 在 /etc/cloudflared/config.yml 加 ingress: voice.esggo.co -> http://localhost:8765"
  echo "或將 s2s 直接暴露於 8765 並經 cloudflared tunnel 暴露"
fi

echo "====== DONE ======"
echo "驗證: curl -s -m90 -X POST http://localhost:8787/voice/bridge -H 'Content-Type: application/json' -d '{\"text\":\"測試語音代理\",\"role\":\"user\"}'"
