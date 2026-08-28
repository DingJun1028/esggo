---
name: esggo-deerflow-ollama
description: Wire Ollama vision into DeerFlow 2.0 on Windows Docker.
---

# esggo-deerflow-ollama

Use this skill when integrating a local Ollama model (especially a vision/VL model
like Qwen3-VL) into the DeerFlow 2.0 gateway running via Docker on Windows
(`C:\Project\esggo-deerflow`). Covers the end-to-end path that actually worked
2026-08-05, including the non-obvious traps.

## Architecture
- DeerFlow runs in Docker: `nginx`(:2026) → `gateway`(:8001, internal) → models.
- Ollama runs on the HOST Windows Docker (`ollama` container, :11434), NOT inside the gateway container.
- Gateway reaches Ollama via `http://host.docker.internal:11434` (NOT `localhost` — localhost is the gateway container itself).

## Step-by-step working flow
1. **Start Ollama on host**: `docker run -d --name ollama -p 11434:11434 --restart unless-stopped -v ollama_data:/root/.ollama ollama/ollama:latest`, then `docker exec ollama ollama pull qwen3-vl:2b`.
2. **config.yaml model entry** (under `models:`):
   ```yaml
   - name: qwen3-vl-local
     display_name: Qwen3-VL 2B (Ollama · Vision)
     use: langchain_ollama:ChatOllama
     model: qwen3-vl:2b
     base_url: http://host.docker.internal:11434
     num_predict: 4096
     num_ctx: 16384          # 262144 OOM-kills llama-server on 7.5G Docker Desktop RAM
     temperature: 0.7
     reasoning: true
     context_window: 262144
     supports_thinking: true
     supports_vision: true
   ```
3. **Resolve `$ENV` in config.yaml**: DeerFlow crashes on boot if any `$VAR` ref is unresolved (`ValueError: Environment variable X not found`). Replace all `$VAR` with `placeholder-var` literals — BUT **exclude proxy vars** (see trap).
4. **pyproject ollama extra**: `backend/pyproject.toml` `optional-dependencies` lacks `ollama` by default. Add `ollama = ["deerflow-harness[ollama]"]`.
5. **Persist UV_EXTRAS**: `.env` `UV_EXTRAS=ollama` is NOT injected by compose `env_file`. Add `UV_EXTRAS=ollama` + `UV_LINK_MODE=copy` directly in `docker/docker-compose-dev.yaml` gateway `environment:` block. Entrypoint runs `uv sync` every boot and strips manual `uv pip install` — this is the only durable fix.
6. **Default agent dir** (if manual uvicorn restart): create `/app/backend/.deer-flow/users/{user_id}/agents/default/` with `config.yaml` (name/model) + `SOUL.md`.
7. **Restart gateway**: `docker compose -p deer-flow-dev -f docker/docker-compose-dev.yaml restart gateway`. Verify `docker exec deer-flow-gateway uv pip show langchain-ollama` → 1.1.0.

## Vision request flow (auth + upload + run)
- Auth API is `/api/v1/auth/*` (NOT `/api/auth/*`). Login = `POST /api/v1/auth/login/local` with form-urlencoded `username`+`password`. Grab `csrf_token` + `access_token` from `Set-Cookie`.
- Threads API is `/api/threads` (NOT `/api/v1/threads`).
- Every POST needs header `X-CSRF-Token: <csrf_token>`.
- Images: `POST /api/threads/{tid}/uploads` (multipart, field `files`) → use returned container `path` in message `image_url.url`. Remote URLs are treated as LOCAL paths and fail.
- Run: `POST /api/threads/{tid}/runs` with `assistant_id:"default"`, `config.configurable.model_name:"qwen3-vl-local"`. Poll `GET /api/threads/{tid}/state` for the AI reply.

## Critical trap: proxy placeholder
Bulk-filling `.env` with `HTTPS_PROXY=placeholder-not-used` makes DeerFlow export it as a real proxy → `ProxyError: Failed to resolve 'placeholder-not-used'`. **Never set `*PROXY=placeholder-not-used`**; remove all `*PROXY*` lines from `.env` after bulk-fill.

## Verification
- Gateway: `curl :2026/api/health` → 401 (auth wall = alive). `:2026/` → 200.
- Ollama: `curl localhost:11434/api/tags` → model listed.
- Vision: run the end-to-end test (background, 2-4 min for CPU 2B VL) → expect Traditional Chinese OCR of the image.

## Pitfalls index
- Docker Desktop daemon not auto-started on Windows → `powershell Start-Process` Docker Desktop.exe.
- `num_ctx: 262144` → OOM-kill; use 16384.
- `localhost` in gateway config = gateway container, not host Ollama → use `host.docker.internal`.
- CSRF: `/api/v1/auth/*` + `/api/threads`; login form-data; send `X-CSRF-Token`.
- Image URL ≠ remote URL; upload first, use returned path.
- Proxy placeholder in `.env` → ProxyError; strip `*PROXY*` lines.
- CPU inference slow → run vision test in background, poll ≤5 min.

## Support files
- `references/deerflow-ollama-errors.md` — 8 error transcripts with fixes (env crash, OOM, CSRF, agent-dir, image-path, proxy, context).
