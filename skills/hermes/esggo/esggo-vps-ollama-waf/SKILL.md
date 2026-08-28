---
name: esggo-vps-ollama-waf
description: "VPS OOM、Ollama尺寸、Cloudflare WAF 403、speech-to-speech接hub實戰。"
version: 1.0.0
author: Hermes Agent (DingJun1028)
license: MIT
platforms: [linux, windows]
metadata:
  hermes:
    tags: [esggo, vps, ollama, cloudflare, waf, oom, deerflow, speech-to-speech, hub]
---

# esggo VPS / Ollama / Cloudflare WAF 运维实战

本技能收錄 2026-08-08 實戰中誕生的非顯而易見技術，適用於 esggo VPS (161.118.248.180) 上的
OmniBlueprint Hub、DeerFlow 网关、Ollama 部署與 Cloudflare tunnel 呼叫。所有結論來自真實執行。

## 1. VPS 資源硬約束 — Ollama 模型尺寸是地雷

VPS 是 **Oracle ARM aarch64**，總 RAM **5.8G / 可用僅 2.8G**，CPU-only（無 GPU）。

- **致命坑**：拉 `gemma4:e4b`（9.6GB）並推理 → 記憶體耗盡 → **SSH 完全凍結**（banner exchange timeout），系統無法自癒。
  唯一解鎖 = **Oracle Cloud 控制台 Reboot**（VPS 詳情頁 → Reboot，1-2 分鐘）。等系統自行 swap 回復不可行（模型 > 可用 RAM）。
- **正確模型尺寸**：VPS 用 `gemma4:e2b`（~1.5GB）或 `qwen2.5:3b`（~2GB）。`e4b`/`26b`/`31b` 在 VPS 必 OOM。
- **VPS 裝 Ollama**：`curl -fsSL https://ollama.com/install.sh | sh`（ARM 可用）。Oracle 上 systemd 可能不 auto-start →
  `nohup ollama serve > /tmp/ollama_vps.log 2>&1 & disown`，驗證 `curl localhost:11434` + `ollama ps`。
- **降級一鍵腳本**：見 `references/ollama_downgrade.sh`（OOM 恢復後：`ollama rm gemma4:e4b` → 拉 `e2b` → 改 `.env` 的 `OLLAMA_MODEL` → pm2 restart hub）。
  → 參考腳本：`references/ollama_downgrade.sh`（直接 scp 到 VPS 跑，含完整 5 步）。
- **本機 vs VPS 模型**：本機 Windows Ollama 有 `gemma4:latest`（自定義 modelfile, RENDERER gemma4，輸出偶爾異常）— 不等於 VPS 可拉取的
  `gemma4:e2b`。Ollama library 有 `gemma4`/`e2b`/`e4b`/`26b`/`31b` tag（2026-04 Google 發布，非本機自定義）。

## 2. 容器呼叫 Cloudflare 保護端點 — WAF 403 坑

從 Docker 容器（如 DeerFlow gateway）呼叫 `https://gateway.esggo.co/...`（Cloudflare tunnel）時：

- **Python `httpx` / `urllib` → 403 Forbidden**（Cloudflare WAF 擋 TLS fingerprint / UA）。
- **同容器 `curl` → 200**（curl 的 TLS/UA 通過 WAF）。
- DNS 解析正常（`socket.gethostbyname` 成功），所以是 WAF 不是網路。

**解法**：OAB/bridge 類呼叫改用 **`subprocess` 呼叫 `curl`**，不用 httpx。實例：`backend/app/gateway/oab_sync.py`
的 `oab_put/oab_delete` 用 `subprocess.run(['curl','-s','-X','PUT',url,'-H',...,'-d',json])`，
調用端用 `asyncio.get_running_loop().run_in_executor(None, oab_put, ...)`（因函式是同步的，不能 `asyncio.create_task`）。
- 直連 VPS IP `161.118.248.180:8421` 不通（OCI Security List 擋外部 8421，只有 Cloudflare tunnel 能進）。
- 容器內 `nslookup` 不存在 → 用 `python3 -c "import socket;socket.gethostbyname(...)"` 驗證 DNS。

## 3. DeerFlow 网关接 OAB 雙向同步（實戰驗收）

- 非侵入式橋接：`backend/app/gateway/oab_sync.py`（curl subprocess 調 OAB）+ 在 `routers/memory.py` 的
  `create_fact`/`update`/`clear_memory` 路由層 fire-and-forget 廣播（try 區塊**之後**、return 之前，非 try 內部，
  否則 Python 解析報 IndentationError — 多行 call 的 `)` 是 call 內部續行，廣播碼插在 `)` 後會跑出 try）。
- 調用寫法：`asyncio.get_running_loop().run_in_executor(None, oab_put, uid, fact_id, {...})`（同步函式）。
- `start_oab_bridge()` 掛在 gateway `lifespan(app)` 的 `yield` 之前（gateway 啟動完成、服務開始前）。
- 驗收：`docker cp` 在 Windows 路徑解析有坑（git-bash 雙重轉義）→ 改用容器內 `cat > /tmp/x.py <<'EOF'` heredoc 寫檔，
  再用 venv python 跑（`/app/backend/.venv/bin/python`）。
- 記憶隔離：OAB key 命名空間 `deerflow:{user_id}:*`（對齊 AI-native Memory 論文每用戶獨立 LPM 精神）。

## 4. Speech-to-Speech (HuggingFace) 語音代理整合

將 `speech-to-speech`（VAD→STT→LLM→TTS，OpenAI Realtime-compatible WebSocket `ws://host:8765/v1/realtime`）
接入 OmniBlueprint Hub 作為**語音代理層**。完整架構見 `references/speech-to-speech-integration.md`（同倉 `esggo-learning-center/SPEECH_TO_SPEECH_INTEGRATION.md` 為完整版）。
  → 參考文件：`references/speech-to-speech-integration.md`（架構/nginx/HUB 端點/5T 對齊全收錄）。

要點：
- s2s 全管線在 VPS 約 2.6GB（Parakeet STT 600MB + gemma4:e2b 1.5GB + Qwen3-TTS 400MB），**逼近 2.8G 上限**；
  吃緊時 TTS 改 `--tts kokoro` 或 STT 改 `whisper tiny`。
- s2s 的 LLM 槽指本機 Ollama：`--llm_backend chat-completions --responses_api_base_url http://localhost:11434/v1 --responses_api_api_key ""`。
- HUB 加 `/voice/bridge` 端點：收 s2s 文本事件 → 轉發 `/speak` 做多語翻譯 SSE 廣播（保留 5T: sourceOrigin/hash/timestamp）。
- nginx 反代 :8765 需 WebSocket upgrade 頭。

## 5. 誠實運維原則

- VPS SSH timeout = 系統凍結信號，不要連續 retry 加重負載；直接請用戶 Oracle 控制台 Reboot。
- 模型 > 可用 RAM 的部署在 VPS 必敗，先算記憶體預算再 pull。
- WAF 403 優先用 curl subprocess 繞，不要硬調 httpx TLS（Cloudflare 可能仍擋 httpcore fingerprint）。
- 所有「完成」需真實輸出：Ollama `ollama ps` 列出模型、HUB `/healthz` ok、容器內 curl 回 200。

## Self-audit
- [ ] VPS 模型尺寸 ≤ 2GB（避 OOM 凍結）
- [ ] OOB Cloudflare 呼叫用 curl subprocess 非 httpx
- [ ] DeerFlow 廣播碼在 try 之後、return 之前
- [ ] 容器內寫測試檔用 heredoc 非 docker cp（Windows 路徑坑）
- [ ] SSH timeout 即請用戶 Reboot，不空轉 retry
