# CPU-Only ARM Throughput Reality + SSH-Tunnel Access to VPS Ollama

## 1. CPU-only ARM inference is unusably slow — regardless of model size

Measured 2026-08-18 against esggo VPS (Oracle ARM aarch64, 4 vCPU, 23GB RAM, no GPU):

| Model | Host | TTFT | tok/s | Verdict |
|---|---|---|---|---|
| qwen2.5:3b (~2GB) | VPS ARM | 2.9s | 0.27 | unusable for chat |
| qwen2.5:3b-instruct-q4_K_M | local Windows (CPU) | 10.6s | 0.19 | unusable |
| gemma4:e4b (8B) | VPS ARM | timeout | — | 30 tokens not done in 120s |

Conclusion: a free ARM / pure-CPU instance is **not viable for interactive LLM use** —
even a 3B model that fits comfortably in RAM runs at <0.3 tok/s, so a single reply takes
minutes. This is a hardware ceiling, NOT a config issue. The only real fixes are a GPU
or cloud inference (e.g. `deepseek-v4-pro` via opencode-go).

Benchmark probe: `scripts/bench_ollama_stream.py` (streaming TTFT + tok/s; <1 tok/s = unusable).

## 2. Reaching VPS Ollama from the local machine — ufw blocks 11434

VPS `ollama` binds `0.0.0.0:11434`, but `ufw` only allows 22/80/443/8420/8096/8424/8421 —
so a direct `curl http://161.118.248.180:11434/api/tags` times out.

Ollama has NO built-in auth, so do NOT `ufw allow 11434` (public exposure = abused for
free inference/mining). The safe route is an SSH tunnel:

```bash
ssh -i ~/.ssh/esggo_original -o StrictHostKeyChecking=no \
    -o ExitOnForwardFailure=yes -N -L 11435:localhost:11434 \
    ubuntu@161.118.248.180
```

Then the local machine reaches VPS Ollama at `http://localhost:11435/v1` (OpenAI-compatible)
and `http://localhost:11435/api/tags`. Run the tunnel with `terminal background=true` and
kill it with `process kill` when done.

## 3. Diagnostic sequence that worked

1. `curl localhost:11434/api/tags` (local) → lists local models.
2. `ssh ... ubuntu@VPS "curl localhost:11434/api/tags"` → lists VPS models (`qwen2.5:3b`, `gemma4:e4b`, `nomic-embed-text`).
3. `sudo ss -tlnp | grep 11434` + `systemctl show ollama | grep Environment` on VPS → confirms `OLLAMA_HOST=0.0.0.0:11434`.
4. Direct `curl http://161.118.248.180:11434` times out → `sudo ufw status` reveals 11434 not allowed → SSH tunnel is the fix.
