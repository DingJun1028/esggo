# ARM-free Ollama: correct throughput numbers + the benchmark pitfall

Corrected 2026-08-18. Supersedes the "unusable" verdict in
`cpu-only-throughput-and-ssh-tunnel.md`.

## Correct numbers (accurate benchmark: non-stream, max_tokens=200, real prompt)

| Model | 生成 tok | tok/s | Verdict |
|---|---|---|---|
| qwen2.5:3b (~2GB) | 83 | **3.0** | usable for batch/offline/self-host |
| gemma4:e4b (8B) | 200 (maxed) | 1.5 | works but slow; thinking model eats token budget |

ARM free 自託管 Ollama 是「可用」的 — 3B 模型 3.0 tok/s，一段短文約 30 秒。只是不適合
流暢互動（多段回答數分鐘）。用戶判斷「ARM free 可用」是正確的。

## The benchmark pitfall that caused a wrong "unusable" verdict

第一版測量報 qwen2.5:3b = 0.27 tok/s 並誤判「不可用」。那是壞測量，不是事實。兩個錯誤：

1. **`max_tokens=30` + 瑣碎 prompt**（「你好，一句話回應」）→ 模型只回 1-2 token，
   拿 2 token 除以 ~7 秒 = 0.27 tok/s 假數據，差 10 倍。吞吐量在 <30 生成 token 下無意義。
2. **timeout 太短**（120s）→ 8B thinking 模型（gemma4:e4b）還在生成就被砍，誤報「超時/跑不動」。

**規則：禁止用 <30 token 樣本宣判模型不可用。** 用 `max_tokens ≥ 200` + 多句 prompt（如
「寫 100 字短文介紹 AI」），thinking 模型給 ≥300s，用完整生成 token 數算 tok/s。

## thinking 模型會把 token 預算燒在推理 token

`max_tokens=200` 時 gemma4:e4b 回空 body — 200 token 全進 chain-of-thought。要可視輸出
給 `max_tokens ≥ 1000`，或關閉 thinking（`think: false` / 模型 disable-thinking 旗標）。

## SSH tunnel keep-alive（Windows 本機 → VPS Ollama）

無 `autossh` 也可用 `while true` 循環 + `ServerAliveInterval` 做自動重連：

```bash
#!/bin/bash
# localhost:11435 -> VPS:11434, 斷線重連, 日誌 ~/ollama_tunnel.log
while true; do
  ssh -i "$HOME/.ssh/esggo_original" \
      -o StrictHostKeyChecking=no \
      -o ServerAliveInterval=30 -o ServerAliveCountMax=3 \
      -o ExitOnForwardFailure=yes \
      -N -L "127.0.0.1:11435:localhost:11434" ubuntu@161.118.248.180
  echo "[$(date)] tunnel 斷線，5 秒後重連" >> "$HOME/ollama_tunnel.log"
  sleep 5
done
```

`bash ~/ollama_tunnel.sh`（`terminal background=true`）。Windows 上重開機/Hermes 重啟會斷，
非 24/7 保證 — 那是 Cloudflare Tunnel 的用途。

## 11434 被兩層防火牆擋

`ufw allow 11434` 不夠 — Oracle Cloud 有第二層（OCI security list / NSG）也擋 11434。
Ollama 無內建認證，**別公網暴露 11434**（會被偷用免費算力）。安全路徑 = SSH tunnel
或 Cloudflare Tunnel + Zero Trust Access。
