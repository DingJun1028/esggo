---
name: deerflow-gateway-debug
description: Debug DeerFlow gateway 502/crash, CSRF, Ollama vision setup.
---

# deerflow-gateway-debug

Debug the DeerFlow 2.0 gateway when `http://127.0.0.1:2026/` returns HTTP 200 but
`/api/*` returns **502 Bad Gateway**, or the gateway container is `running` yet port
8001 is closed. Covers the env-var resolver crash, `/app/logs/gateway.log` vs
`docker logs`, `uv sync` venv reset, correct LangGraph API paths, CSRF+first-boot
auth flow, and local Ollama Qwen3-VL vision injection.

## Symptom → root cause map
- `:2026/` = 200, `/api/*` = 502 → nginx alive, gateway(8001) dead.
- Container `running`, 8001 CLOSED, `docker logs` EMPTY → uvicorn crashed at import;
  output went to `/app/logs/gateway.log` (entrypoint does `exec >/app/logs/gateway.log`).
- `/api/langgraph/threads` → `CSRF token missing` / 401 → gateway is ALIVE (security
  working), you just need auth. Not a crash.
- `POST /api/chat` → 502 → wrong path. DeerFlow 2.0 uses `/api/langgraph/*`, not `/api/chat`.

## 1. Read the REAL log (not docker logs)
```bash
docker exec deer-flow-gateway tail -30 /app/logs/gateway.log
docker exec deer-flow-gateway grep -c "Application startup complete." /app/logs/gateway.log
```
If "Application startup complete." is absent, gateway never booted.

## 2. Env-var resolver crash (most common, fatal)
DeerFlow's config resolver requires every `$VAR` in config.yaml to resolve to a shell
env var at startup, else `ValueError: Environment variable X not found for config value $X`
→ uvicorn dies. Active (non-commented) model entries with `api_key: $FOO` trigger this.

Fix for local/ollama mode: replace all `$VAR` in config.yaml with literal placeholders
(`placeholder-deepseek_api_key`). Script: `references/fix_env_refs.py`.
Do NOT rely on `.env` injection — compose has `env_file: ../.env` but the resolver reads
shell env, and container `DEEPSEEK_API_KEY` stays UNSET despite `.env` existing.

## 3. uv sync resets the venv (but manual installs can survive)
`dev-entrypoint.sh` runs `uv sync --all-packages` on every start, rebuilding `.venv` and
**removing manually `uv pip install`ed packages in the venv**. So `docker exec ... uv pip install
langchain-ollama` (into venv) is wiped on next restart → gateway crashes on import.

BUT: `uv pip install --system <pkg>` writes to the system site-packages
(`/usr/local/lib/python3.x/site-packages`) which `uv sync` does NOT touch — only the
project venv (`backend/.venv`) is rebuilt. Field test (2026-08-25 session): installed
`langchain-ollama` via `uv pip install --system`, restarted gateway container, package
survived and `langchain_ollama` imports succeeded. Use `--system` flag for debug installs
that must outlive restarts without an image rebuild.

Fix: add the dep to `backend/pyproject.toml` extra (e.g. `deerflow-harness[ollama]`) and
rebuild the image (`docker compose ... up --build`), OR accept it's debug-only.

## 4. Restart the right way
`docker restart gateway` does NOT re-read compose `env_file`. After editing `.env`:
```bash
docker compose -p deer-flow-dev -f docker/docker-compose-dev.yaml restart gateway
# or stop+start for a clean re-inject
```

## 5. Manual foreground probe (catch import errors)
```bash
docker exec -d deer-flow-gateway sh -c 'cd /app/backend && uv run uvicorn app.gateway.app:app --host 0.0.0.0 --port 8006 --reload > /tmp/uv.log 2>&1'
sleep 30; docker exec deer-flow-gateway tail -25 /tmp/uv.log
```

## 6. Auth + CSRF (401/403 = alive, not broken)
```bash
rm -f /tmp/cj.txt
curl -s -c /tmp/cj.txt -X POST http://127.0.0.1:2026/api/auth/initialize \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@esggo.local","password":"OmniBee2026!","display_name":"OmniAdmin"}'
curl -s -c /tmp/cj.txt -b /tmp/cj.txt -X POST http://127.0.0.1:2026/api/auth/login/local \
  -H "Content-Type: application/json" -d '{"email":"admin@esggo.local","password":"OmniBee2026!"}'
CSRF=$(grep csrf_token /tmp/cj.txt | awk '{print $7}')
curl -s -b /tmp/cj.txt -H "X-CSRF-Token: $CSRF" -X POST http://127.0.0.1:2026/api/langgraph/threads
```

## 7. Local Ollama + Qwen3-VL vision model
Prefer local Windows Docker (196G free) over a small VPS (45G full, no GPU).
```bash
docker run -d --name ollama -p 11434:11434 -v ollama_data:/root/.ollama ollama/ollama:latest
docker exec ollama ollama pull qwen3-vl:2b
```
config.yaml model entry (native provider preserves thinking; OpenAI-compat `/v1` drops it):
```yaml
- name: qwen3-vl-local
  display_name: Qwen3-VL 2B (Ollama · Vision)
  use: langchain_ollama:ChatOllama
  model: qwen3-vl:2b
  base_url: http://localhost:11434     # no /v1
  reasoning: true
  context_window: 262144
  supports_thinking: true
  supports_vision: true
```

**NOTE on base_url**: Inside Docker containers, `localhost` refers to the container itself, not
the host. Use `http://host.docker.internal:11434` when Ollama runs on the Windows host.
Field test (2026-08-25): `gemma4-local` model entry used `base_url: http://host.docker.internal:11434`
and the gateway's `uv pip install --system langchain-ollama` survived container restart.

Then rebuild image (dep must be in pyproject, see §3) and restart gateway.
Verify vision: send a message with `image_url` via `/api/langgraph/threads/{id}/runs`.

## 8. Verify
- `grep "Application startup complete." /app/logs/gateway.log` → 1
- `POST /api/langgraph/threads` with CSRF+cookie → 200 (not 502)
