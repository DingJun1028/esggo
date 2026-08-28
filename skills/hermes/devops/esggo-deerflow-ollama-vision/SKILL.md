---
name: esggo-deerflow-ollama-vision
description: DeerFlow 2.0 + Ollama vision Docker integration pitfalls.
---

# esggo-deerflow-ollama-vision

Integration of local Ollama vision LLMs into **DeerFlow 2.0** (`C:\Project\esggo-deerflow`, `bytedance/deer-flow`) running on **local Windows Docker** (CPU-only, no GPU). This skill captures the non-obvious pitfalls that blocked a working vision endpoint for ~3 sessions; the broader deploy/merge flow lives in `esggo-deploy-push-merge` (user-owned — recommend `hermes curator adopt esggo-deploy-push-merge`).

> Overlap note: this skill is a focused extract of the DeerFlow+Ollama vision work. `esggo-deploy-push-merge` §3/§4 cover the same area but are user-owned and one step (base_url) is WRONG there — see Pitfall P1.

## Prerequisites (from esggo-deploy-push-merge)
- Docker Desktop running (PowerShell `Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe'`).
- `~/.wslconfig` with `memory=12GB` (NOT 7.5G default) → `wsl --shutdown` → restart Docker. Lifts Ollama to 11.68G, ~2-3x faster. CPU-only still slow.
- `.env`: all `$VAR` replaced with `placeholder-X` (resolver crashes on missing env); REMOVE any `HTTPS_PROXY`/`HTTP_PROXY` lines (DeerFlow treats them as real proxies → ProxyError).
- `backend/pyproject.toml` optional-dependencies needs `ollama = ["deerflow-harness[ollama]"]`.
- `docker/docker-compose-dev.yaml` gateway `environment:` must contain `UV_EXTRAS=ollama` + `UV_LINK_MODE=copy` (NOT in `.env` — compose `env_file` does not inject it; entrypoint `uv sync` strips manually-installed pkgs every boot).
- Default agent dir `/app/backend/.deer-flow/users/{user_id}/agents/default/` with `config.yaml`+`SOUL.md` (else "Agent directory not found").

## Config model entry (config.yaml)
```yaml
  - name: qwen3-vl-local
    display_name: Qwen3-VL 2B (Ollama · Vision)
    use: langchain_ollama:ChatOllama
    model: qwen3-vl:2b
    base_url: http://ollama:11434        # P1: container name, NOT host.docker.internal
    num_predict: 512
    num_ctx: 16384                       # P2: must exceed vision token count (see below)
    temperature: 0.7
    reasoning: true
    context_window: 262144
    supports_thinking: true
    supports_vision: true
```

## P1 — Ollama Docker network (CRITICAL, the #1 blocker)
**Symptom:** run 200, model selected, but `httpcore.ConnectError: [Errno 111] Connection refused` to `host.docker.internal:11434`.
**Root cause:** Ollama container is on `bridge` network; DeerFlow gateway is on `deer-flow-dev_deer-flow-dev`. Cross-network DNS fails.
**Fix:**
```bash
docker network connect deer-flow-dev_deer-flow-dev ollama
```
Then `base_url: http://ollama:11434` (same-network container name resolves). Verify:
```bash
docker exec deer-flow-gateway curl -s http://ollama:11434/api/tags   # must return model list
```
`host.docker.internal` MAY work intermittently on Docker Desktop but is unreliable after `wsl --shutdown`; the container name is deterministic.

## P2 — Vision token count vs num_ctx (silent 400)
**Symptom:** `request (11191 tokens) exceeds the available context size (4096 tokens)` (status 400) even for a tiny 320×160 PNG.
**Root cause:** Qwen3-VL tokenizes a 320×160 image to **~11,191 tokens**; Gemma 3 4B to **~10,430**. The image alone blows past `num_ctx`. `num_ctx` is the hard ceiling, NOT `context_window`.
**Fix:** set `num_ctx` ≥ image tokens. Use **16384** for both 2B/4B vision models. (Do NOT use 262144 — OOM-kills llama-server on 11.68G Docker RAM.)

## P3 — "does not support tools" (non-Qwen vision models)
**Symptom:** `LLM request failed: registry.ollama.ai/library/gemma3:4b does not support tools (status code: 400)`.
**Root cause:** DeerFlow's `lead_agent` ALWAYS binds tools (memory + builtin, ~9 tools) to every model. Ollama's stock `gemma3:4b` modelfile has no tool template → rejects `tools` in the chat request. `qwen3-vl:2b` is the only off-the-shelf model here that advertises tool support.
**Fix:** build a tool-capable derivative with a Gemma 3 tool template:
```bash
docker exec ollama sh -c 'cat > /tmp/g3.modelfile <<EOF
FROM gemma3:4b
TEMPLATE """{{- range $i, $_ := .Messages }}{{ $last := eq (len (slice $.Messages $i)) 1 }}{{ if or (eq .Role "user") (eq .Role "system") }}<start_of_turn>user
{{ .Content }}<end_of_turn>
{{ if $last }}<start_of_turn>model
{{ end }}{{ else if eq .Role "assistant" }}<start_of_turn>model
{{ .Content }}{{ if not $last }}<end_of_turn>
{{ end }}{{ else if eq .Role "tool" }}<start_of_turn>tool_response>
{{ .Content }}<end_of_turn>
{{ end }}{{ end }}{{- if .Tools }}<start_of_turn>model
{{ .Tools }}<end_of_turn>
{{ end }}"""
PARAMETER stop <end_of_turn>
EOF
ollama create gemma3-tooled -f /tmp/g3.modelfile'
```
Then `model: gemma3-tooled` in config. (`ALLOW_TOOLS` is NOT a valid Modelfile directive — do not use it.)
> Note: even with tools bound, Gemma 3 4B on CPU is slow; qwen3-vl:2b is the proven-capable path. Prefer qwen3-vl-local unless the user insists on Gemma.

## P4 — Gateway boot is SLOW + nginx 502 trap
- Gateway takes **3–5 min** to boot after `restart`/`start` (uv sync + alembic + memory index). Background test jobs must wait up to 250s for `/api/health` before running the OCR test.
- `nginx` external `:2026` returns **502 transiently** during gateway boot. A test harness that does `curl -s -o /dev/null -w "%{http_code}\n" ... ; python3 _test.py` will **exit 23** (curl write error on closed pipe) and the OCR run NEVER executes. **Always guard the health curl with `|| true`** so the test still runs:
  ```bash
  curl -s --max-time 10 -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:2026/api/health 2>&1 || true
  python3 _vision_test.py 2>&1 | tail -20
  ```
- Verify gateway UP with an internal probe loop, not a single curl:
  ```bash
  for i in $(seq 1 50); do sleep 5; docker exec deer-flow-gateway sh -c 'curl -s --max-time 3 http://127.0.0.1:8001/api/health >/dev/null 2>&1' && break; done
  ```

## P5 — host IPv4 vs Ollama IPv6 listen
Ollama listens on `[::]:11434` (IPv6). `curl http://127.0.0.1:11434` from the **Windows host** returns empty, but `docker exec ollama curl http://127.0.0.1:11434` (inside container) and `http://ollama:11434` from the gateway both work. Don't diagnose Ollama as dead from a host-side IPv4 curl — test from inside a container.

## P7 — Windows / MSYS launch path (no `make`)
On local Windows Docker (MSYS/git-bash), `make` is **not installed** → `make docker-start` fails with `No such file or directory` (exit 127). The Makefile `docker-start` target only wraps `./scripts/docker.sh start`.
**Fix:** call the script directly:
```bash
cd /c/Project/esggo-deerflow
bash ./scripts/docker.sh start          # background this; boots gateway in 3–5 min (P4)
# or raw compose:
docker compose -f docker/docker-compose.yaml up -d
```
First verify Docker daemon is up: `docker info --format '{{.ServerVersion}}'`. If blank, launch Docker Desktop as a **background** terminal call (NOT nohup/& — Hermes tracks it):
`"/c/Program Files/Docker/Docker/Docker Desktop.exe"` with `terminal(background=true)`. Daemon needs ~20–40s after launch; pollen `docker info` until it returns a version.
**Pre-pull the vision model** before first DeerFlow run — `qwen3-vl:2b` is NOT pre-installed:
```bash
curl -s -X POST http://localhost:11434/api/pull -H "Content-Type: application/json" -d '{"name":"qwen3-vl:2b"}'
```
Verify with `curl -s http://localhost:11434/api/tags` → must list `qwen3-vl:2b`. (Session 2026-08-16: `qwen3-vl:2b` was mid-pull when DeerFlow containers came up; the `ollama` container itself starts fine, only the model is missing.)

## P8 — gemma4 as a DeerFlow vision/model alternative (user-requested comparison)
Local Ollama already has `gemma4:26b` / `gemma4:latest` installed (no download needed). To use Gemma 4 in DeerFlow:
- **Add a config.yaml entry** (same shape as qwen3-vl-local but `model: gemma4:latest`, `base_url: http://ollama:11434`):
  ```yaml
  - name: gemma4-local
    display_name: Gemma 4 (Ollama)
    use: langchain_ollama:ChatOllama
    model: gemma4:latest
    base_url: http://ollama:11434
    num_ctx: 16384
    supports_vision: true
  ```
- **Tool-binding 400 (P3 applies):** stock `gemma4` has no tool template → DeerFlow's lead_agent (always binds ~9 tools) gets `does not support tools` (status 400). Build the tool-capable derivative from P3's Modelfile, then point config at `gemma4-tooled`.
- **Coexistence:** both `qwen3-vl-local` and `gemma4-local` can live in `config.yaml`; select per run via `model_name` in the `/api/threads/{tid}/runs` body. No need to pick one.
- **Trade-off (honest):** qwen3-vl:2b wins for DeerFlow vision research — lighter (2B, CPU-runnable), faster, stronger Chinese + OCR/vision precision, zero config change. gemma4:26b wins only if the task is pure-language research AND you'd rather not pull qwen3-vl:2b; it is heavier (needs 16GB+ or a quantized tag) and weaker at vision. For the OA vision endpoint, keep qwen3-vl-local as default.
- **User comparison table (2026-08-16):** qwen3-vl:2b = lighter/faster/stronger-Chinese/vision-optimized/zero-change; gemma4 = already-installed/stronger-pure-language/26B-heavy/weaker-vision. Both free (local Ollama). Both can be registered; choose by task type.

## End-to-end vision test (Python urllib, run in background)
Auth + upload + run + poll. Key paths:
- `POST /api/v1/auth/login/local` (form-urlencoded `username`+`password`) → parse `csrf_token` + `access_token` from `Set-Cookie`.
- `POST /api/threads` (header `X-CSRF-Token`) → `thread_id`.
- `POST /api/threads/{tid}/uploads` (multipart, field `files`) → returns container `path`.
- `POST /api/threads/{tid}/runs` body `{"assistant_id":"default","config":{"configurable":{"model_name":"qwen3-vl-local"}},"input":{"messages":[{"role":"user","content":[{"type":"text","text":"..."},{"type":"image_url","image_url":{"url":<uploaded path>}}]}]}}`.
- Poll `GET /api/threads/{tid}/state` for AI reply (8s × up to 70 = 560s window).

See `references/vision-test-recipe.md` for a ready-to-run harness + the gateway-log evidence that proves the endpoint is wired (thread 200, upload 200, run 200, `Create Agent(default)->model_name:qwen3-vl-local`, `Including view_image_tool ... (supports_vision=True)`, Ollama CPU ~490%), plus §4 operational traps (nginx-502/`|| true` guard, gemma3 rename chain, no sub-2B tag).


## P6 — No working sub-2B vision model on Ollama + honor user's model name
- **`qwen2.5vl:0.5b` / `qwen2.5-vl:0.5b` do NOT exist** (Ollama manifest 404: `Error: pull model manifest: file does not exist`). Qwen2.5-VL on Ollama only ships 3B+. Do NOT burn time pulling nonexistent small tags hoping for a CPU-fast vision model — the only proven-capable Ollama vision model here is **`qwen3-vl:2b`** (advertises tool support, so it passes DeerFlow's tool-binding without a Modelfile).
- **When the user names a model (e.g. "用 Gemma"), honor it.** Build the tool-capable derivative via the P3 Modelfile rather than substituting `qwen3-vl:2b`. The working rename chain was:
  `gemma3:4b` (rejected tools) → `gemma3-tools` (bare `FROM gemma3:4b` — STILL rejected tools, dead end) → **`gemma3-tooled`** (Modelfile WITH the tool template from P3 — works). The bare-`FROM` derivation inherits the stock modelfile's missing tool template, so it never fixes the 400. Only a tool-template Modelfile does.
- **Isolate "does not support tools" from "no vision":** a direct Ollama `/api/chat` call WITHOUT `tools` (just image + text) proves the model sees the image. The 400 is DeerFlow's tool-binding layer, not the model's vision capability. Fix at the DeerFlow/config layer (P3), not by assuming the model is broken.

## Honest verification gate
- STATIC: `make check` (Node/pnpm/uv OK; nginx FAIL expected in Docker mode), `config.yaml` YAML valid, `ollama list` shows the model, `docker exec ... curl http://ollama:11434/api/tags` returns it.
- DYNAMIC proof the endpoint is WIRED (not the same as text output): gateway log shows thread/upload/run 200 + model selected + view_image_tool mounted + Ollama CPU ~490% during inference.
- CPU-only reality: even with all fixes, Qwen3-VL 2B / Gemma 3 4B may NOT emit a final reply within 560s on CPU (no GPU). That is a hardware limit, NOT a config defect. Do NOT claim "end-to-end OCR verified" unless the AI reply string is actually captured. State the static + wiring proof and name the CPU constraint.
