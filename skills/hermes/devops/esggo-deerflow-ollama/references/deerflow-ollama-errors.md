# DeerFlow + Ollama integration — error transcripts & fixes (2026-08-05)

All errors observed while wiring Qwen3-VL (local Ollama, Windows Docker) into DeerFlow 2.0 at `C:\Project\esggo-deerflow`.

## 1. Gateway 502 / uvicorn crash on boot
- **Symptom**: `curl :2026` → 502; gateway container `Up` but `:8001` closed; `docker logs` empty.
- **Root cause**: `config.yaml` had `$DEEPSEEK_API_KEY` (and 40+ `$VAR` refs). DeerFlow's `AppConfig.resolve_env_variables` raises `ValueError: Environment variable X not found` → uvicorn exits.
- **Fix**: replace all `$VAR` in config.yaml with `placeholder-var` literals. Or set real env. Gateway log path is `/app/logs/gateway.log` (NOT `docker logs` — entrypoint redirects stdout there).

## 2. langchain-ollama not installed after restart
- **Symptom**: gateway up but run fails `ModuleNotFoundError: No module named 'langchain_ollama'`.
- **Root cause**: `dev-entrypoint.sh` runs `uv sync --all-packages` on every boot, stripping manually `uv pip install`ed pkgs. Also `backend/pyproject.toml` lacked `ollama` extra.
- **Fix**: (a) add `ollama = ["deerflow-harness[ollama]"]` to pyproject `optional-dependencies`; (b) add `UV_EXTRAS=ollama` + `UV_LINK_MODE=copy` to `docker/docker-compose-dev.yaml` gateway `environment:` block (`.env` UV_EXTRAS is NOT injected by compose env_file).

## 3. llama-server OOM-killed (signal: killed, 500)
- **Symptom**: run fails `llama-server process has terminated: signal: killed (status code: 500)`.
- **Root cause**: `num_ctx: 262144` needs ~15GB RAM; Docker Desktop default is 7.5G.
- **Fix**: set `num_ctx: 16384` in config.yaml model entry (enough for ~11k-token image + reply).

## 4. CSRF token missing (403)
- **Symptom**: POST to `/api/auth/initialize` or `/api/threads` → `403 CSRF token missing`.
- **Fix**: (a) auth endpoints are `/api/v1/auth/*` (not `/api/auth/*`); (b) threads are `/api/threads` (not `/api/v1/threads`); (c) login via form-urlencoded, grab `csrf_token` from Set-Cookie, send `X-CSRF-Token` header on every POST.

## 5. Agent directory not found
- **Symptom**: run fails `FileNotFoundError: Agent directory not found: .../agents/default`.
- **Root cause**: manual `uvicorn` restart skipped normal bootstrap; per-user default agent dir missing.
- **Fix**: create `/app/backend/.deer-flow/users/{user_id}/agents/default/config.yaml` (name/model) + `SOUL.md`.

## 6. Image "File does not exist"
- **Symptom**: run fails `ValueError: File https://...png does not exist` or `File C:/Users/...png does not exist`.
- **Root cause**: DeerFlow view_image treats `image_url.url` as a LOCAL path, not a remote URL.
- **Fix**: upload via `POST /api/threads/{tid}/uploads` (multipart, field `files`); use returned container `path` in the message.

## 7. ProxyError on placeholder proxy (CRITICAL)
- **Symptom**: gateway log `ProxyError: Failed to resolve 'placeholder-not-used'` during tiktoken BPE download.
- **Root cause**: bulk-filling `.env` with `HTTPS_PROXY=placeholder-not-used`; DeerFlow exports `.env` proxy vars into container → bad proxy.
- **Fix**: remove all `*PROXY*` lines from `.env`. In fill scripts, skip `HTTPS_PROXY/HTTP_PROXY/ALL_PROXY/NO_PROXY`.

## 8. context size exceeded (400)
- **Symptom**: `request (11165 tokens) exceeds available context size (4096 tokens)`.
- **Root cause**: Ollama default num_ctx 4096 < image token count.
- **Fix**: set `num_ctx: 16384` (see #3).
