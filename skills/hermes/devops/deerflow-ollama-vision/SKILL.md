---
name: deerflow-ollama-vision
description: Wire Ollama vision LLM into DeerFlow on Windows Docker.
---

# deerflow-ollama-vision

Local Windows Docker DeerFlow 2.0 (at `C:\Project\esggo-deerflow`) wired to a local
Ollama vision model. This captures the working integration + the pitfalls that cost
hours in the 2026-08-05/06 session. Companion to `esggo-deploy-push-merge` (which
owns the git/merge + Docker-start side); this skill focuses on the **vision-model
integration and runtime verification**.

## 0. Hard environment facts (Windows Docker, CPU-only)
- No NVIDIA GPU on this host — only Intel UHD integrated. ALL inference is CPU.
  Qwen3-VL 2B on a tiny 320×160 PNG still takes **>300s** to first token. This is a
  hardware floor, not a config bug. Do not loop forever waiting; run tests in
  `terminal(background=true, notify_on_complete=true)` with a long poll window.
- Docker Desktop defaults to 7.5G RAM. Raise to ~11.68G via `~/.wslconfig`
  (`[wsl2] memory=12GB`), then `wsl --shutdown` + restart Docker. ~2-3x faster, still CPU-bound.

## 1. config.yaml model entry (models: list)
```yaml
- name: qwen3-vl-local
  display_name: Qwen3-VL 2B (Ollama · Vision)
  use: langchain_ollama:ChatOllama
  model: qwen3-vl:2b
  base_url: http://ollama:11434
  num_predict: 512
  num_ctx: 16384          # SEE PITFALL #1 — must cover vision token count
  temperature: 0.7
  reasoning: true
  context_window: 262144
  supports_thinking: true
  supports_vision: true
```
`use: langchain_ollama:ChatOllama` (NOT OpenAI-compatible — keeps Qwen3-VL thinking).

## 2. pyproject + UV_EXTRAS (persistence)
- `backend/pyproject.toml` `optional-dependencies` LACKS `ollama` by default. Add:
  ```toml
  ollama = ["deerflow-harness[ollama]"]
  ```
- `.env` `UV_EXTRAS=ollama` is NOT injected by compose `env_file`. Put it in the
  **compose `environment:` block** of the gateway service:
  ```yaml
  - UV_EXTRAS=ollama
  - UV_LINK_MODE=copy
  ```
  The entrypoint runs `uv sync` on every boot and strips manually-installed pkgs;
  this is the only persistent fix. Verify: `docker exec deer-flow-gateway uv pip show langchain-ollama`.

## 3. Docker networking (PITFALL #2 — was the biggest time sink)
- A standalone `ollama` container lands on the `bridge` network; DeerFlow gateway is
  on `deer-flow-dev_deer-flow-dev`. `host.docker.internal` resolves but **connection
  is refused** (`httpcore.ConnectError: Connection refused`).
- FIX: `docker network connect deer-flow-dev_deer-flow-dev ollama`, then
  `base_url: http://ollama:11434` (container-name DNS). Verify from gateway:
  `docker exec deer-flow-gateway curl -s http://ollama:11434/api/tags` returns models.

## 4. $ENV + .env hygiene
- DeerFlow resolver crashes on boot if any `$VAR` in config.yaml is unresolved
  (`ValueError: Environment variable X not found`). Replace all `$VAR` with placeholder literals for local mode.
- **Remove `HTTPS_PROXY`/`HTTP_PROXY` lines from `.env`.** A placeholder like
  `HTTPS_PROXY=placeholder-not-used` is treated as a real proxy → DeerFlow raises
  `ProxyError`. Only set proxy vars to a real upstream.

## 5. Tools / vision-capability mismatch (PITFALL #3)
DeerFlow's `lead_agent` **always binds tools** (memory + builtin) to every model.
- `qwen3-vl:2b` advertises tool support → passes.
- `gemma3:4b` (and `moondream`) on Ollama does **NOT** advertise tools → DeerFlow's
  request gets `400: registry.ollama.ai/library/gemma3:4b does not support tools`.
- Two fixes:
  1. Use `qwen3-vl-local` (supports tools) — simplest.
  2. Build a tool-capable Gemma variant (proven 2026-08-06):
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
     Then `model: gemma3-tooled` in config.yaml. (Note: `ALLOW_TOOLS` is NOT a valid
     Modelfile directive — use the tool-capable TEMPLATE above.)
- Ollama model tags: `qwen2.5vl:0.5b` / `qwen2.5-vl:0.5b` do NOT exist on Ollama;
  smallest Qwen2.5-VL is `qwen2.5vl:3b`. Pull in `terminal(background=true)`.

## 6. Auth + vision endpoint test (Python urllib)
Reusable probe: `scripts/vision_probe.py <model_name> <image_path> [poll_seconds]` —
handles login, upload, run, and state polling. Copy it into the project and run in
`terminal(background=true, notify_on_complete=true)` for slow CPU inference.

Endpoints (DeerFlow 2.0):
- `POST /api/v1/auth/login/local` — form-urlencoded `username`+`password`; parse
  `Set-Cookie` for `csrf_token` + `access_token`.
- `POST /api/threads` (header `X-CSRF-Token`) → `thread_id`.
- `POST /api/threads/{tid}/uploads` — multipart, field `files` → returns container `path`.
  **Do NOT pass an http(s) URL as the image** — DeerFlow treats it as a local path
  (`File does not exist`). Upload first, use the returned `path`.
- `POST /api/threads/{tid}/runs` — body `assistant_id:"default"`,
  `config.configurable.model_name:"<model name>"`, message with
  `{"type":"image_url","image_url":{"url":<uploaded path>}}`.
- Poll `GET /api/threads/{tid}/state` for the AI reply (poll every 8s, up to ~560s).

`gateway :8001` is container-internal only; external API is `http://127.0.0.1:2026/api/*`
(via nginx). After `wsl --shutdown` nginx may return 502 until
`docker compose ... restart nginx` — restart it.

## 7. Verification gates
- `make check` (`./scripts/check.py`): Node/pnpm/uv OK; **nginx FAIL is expected** in
  Docker mode (stack uses in-container nginx; `:2026/api/health`→401 proves live).
- Gateway boot takes ~3 min after restart. Confirm via
  `docker exec deer-flow-gateway curl -s http://127.0.0.1:8001/api/health` → 401.
- Vision endpoint proven-wired evidence in gateway log:
  `Create Agent(default) -> model_name: <name>` and
  `Including view_image_tool for model '<name>' (supports_vision=True)`,
  plus `GET /api/threads/{tid}/state` 200 while Ollama shows ~500% CPU.

## 8. Pitfalls index
- **#1 CONTEXT FLOOR**: Qwen3-VL tokenizes even a 320×160 PNG to ~11,191 vision
  tokens. `num_ctx: 4096` → `400 request (11191 tokens) exceeds context size (4096)`.
  Use `num_ctx: 16384` minimum (262144 OOM-kills llama-server on 11.68G).
- **#2 CROSS-NETWORK**: `host.docker.internal` → Connection refused; use
  `docker network connect deer-flow-dev_deer-flow-dev ollama` + `base_url: http://ollama:11434`.
- **#3 TOOLS**: Gemma3/moondream reject `tools` (400). Use qwen3-vl or `gemma3-tooled`.
- **#4 PROXY**: `HTTPS_PROXY=placeholder-not-used` in `.env` → ProxyError. Remove it.
- **#5 NGINX 502** after WSL restart → `restart nginx`.
- **#6 CPU SPEED**: Qwen3-VL 2B >300s on CPU. Background + long poll; don't claim
  end-to-end text verified until the AI reply string is actually captured.
