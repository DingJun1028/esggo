# Oracle Always Free A1 capacity — 2026-06-15 halving + workarounds

## The halving (verified via InfoQ 2026-07-03 + Oracle docs)
Effective **2026-06-15**, Oracle quietly changed Always Free Ampere A1 compute without announcement:
- 4 OCPU / 24 GB RAM → **2 OCPU / 12 GB RAM**
- Monthly quotas: 3,000 OCPU-hr + 18,000 GB-hr → **1,500 OCPU-hr + 9,000 GB-hr**
- **Free-only accounts**: instances exceeding the new limits get **SHUT DOWN** until manually resized.
- **PAYG accounts**: old 4-OCPU configs may silently start incurring overage charges
  (reports conflict on whether PAYG retains free 4/24 — always verify in the OCI Console).
- Region capacity: A1 "Out of capacity" is common (esp. London/UK South, some APAC regions);
  Oracle deliberately limits free-tier capacity. Workarounds: upgrade to PAYG (unlocks more shapes +
  regions), or retry another availability domain / region at off-peak.

## Decision tree for the esggo VPS (161.118.248.180, ap-singapore-1, currently 4 OCPU/24GB)
1. Check account type + instance state in Console FIRST (instance may already be stopped post-6/15).
2. **PAYG upgrade** (binds a card; Always Free allotment stays free) → keep 4/24, unlock capacity/regions,
   optional small overage fees for >2/12. ARM pricing is cheap (single-digit to low-teen USD/mo for 2 OCPU+12GB overage).
3. **Stay Free-only** → resize to 2 OCPU/12GB to avoid shutdown; then only E4B-class models fit.

## Model fit under 2 OCPU/12GB (with esggo Docker stack running)
- Gemma 4 **E4B Q4 (~5GB)** — viable IF `free -h` shows ≥ ~6GB free; check before committing.
- 26B A4B MoE (~15.6GB) and 31B (~19GB) — **no longer fit**; drop them (or Q2 the MoE to ~9GB and still likely fail with the stack).
- Q4→Q3_K_M / IQ2 quantizations shrink ~20–40% at some quality cost if RAM is the binding constraint.

## Alternatives when Oracle capacity is not enough
- **Free LLM APIs** (zero infra, quality > local E4B; fine for async memory extraction):
  - Groq free tier — verified limits in `tencentdb-agent-memory` skill (qwen3-32b 60 RPM/1,000 RPD; gpt-oss-120b 30/1,000).
  - Gemini Flash free tier (AI Studio key); Cloudflare Workers AI (~10k neurons/day; user has CF infra).
  - Wire as `TDAI_LLM_BASE_URL=https://api.groq.com/openai/v1` + model + key.
- **Hugging Face Spaces** CPU basic: ~2 vCPU / 16 GB RAM / 50 GB (free) — can run Ollama E4B,
  but sleeps after ~48h idle (needs a keep-alive ping); specs change — verify against HF pricing page.
- **Gitpod / GitHub Codespaces** free hours: usable for experiments, not for a resident gateway.
- **Local hardware**: user has two Windows machines — a GPU-equipped local box runs 26B faster than the VPS;
  llama.cpp `rpc-server` can also split a model across machines (VPS + local) if the local node has GPU/RAM.
- **Colab free (T4)**: session-limited, not for a persistent gateway.

## Ollama deployment sketch (if self-hosting on the VPS anyway)
```bash
docker run -d --name ollama --restart unless-stopped \
  -v ollama:/root/.ollama -p 127.0.0.1:11434:11434 ollama/ollama   # bind loopback only!
docker exec ollama ollama pull gemma4:e4b
curl -s http://127.0.0.1:11434/v1/chat/completions -d '{...}'      # verify
```
- Ollama has no built-in auth → loopback bind + Cloudflare Tunnel (with Access policy) or
  `TDAI_GATEWAY_API_KEY`-style Bearer in front if exposed.
- If `gemma4:e4b` tag is missing from the official library: `ollama search gemma4` for real tags,
  or import HF GGUF (`gg-hf-gg/gemma-4-E4B-it`) via a Modelfile + `ollama create`.
- TencentDB wiring: `TDAI_LLM_BASE_URL=http://127.0.0.1:11434/v1` when the gateway shares the VPS,
  or the tunnel URL if the gateway is elsewhere; `TDAI_LLM_MODEL=gemma4:e4b`; dummy API key placeholder.
