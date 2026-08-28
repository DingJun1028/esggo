# Gateway 502 Debug — Condensed Real Transcript (2026-08, esggo-deerflow)

## Setup
- Repo: `C:\Project\esggo-deerflow` (bytedance/deer-flow 2.0). Docker Desktop on
  Windows, daemon started via `powershell.exe -NoProfile -Command "Start-Process
  'C:\Program Files\Docker\Docker\Docker Desktop.exe'"`.
- `bash ./scripts/docker.sh start` builds images (~150s) and starts
  nginx/gateway/frontend/redis. `:2026` returned HTTP 200.

## Failure chain observed
1. Added `qwen3-vl-local` (langchain_ollama) to config.yaml, restarted gateway.
   `:2026/` = 200 but `/api/chat` and `/api/langgraph/threads` = **502**.
2. `docker exec ... sh -c '(echo > /dev/tcp/127.0.0.1/8001)'` -> CLOSED.
   `docker logs deer-flow-gateway` -> **completely empty**.
3. Real error was in `/app/logs/gateway.log`:
   `ValueError: Environment variable DEEPSEEK_API_KEY not found for config value $DEEPSEEK_API_KEY`
   -> resolver requires every active `$VAR` to be a real shell env var.
4. `.env` already had the key (`grep DEEPSEEK .env` matched) but container env was
   UNSET — compose `env_file` did not inject into the resolver's shell env.
5. Added `langchain-ollama` via `docker exec ... uv pip install langchain-ollama`
   -> installed, but `uv sync` on next restart wiped it (venv rebuilt).
6. Fix that worked: replaced all `$VAR` in config.yaml with `placeholder-*` via
   `references/fix_env_refs.py`; restarted gateway with
   `docker compose -p deer-flow-dev -f docker/docker-compose-dev.yaml restart gateway`.
7. `/app/logs/gateway.log` then showed `Application startup complete.` and
   `LangGraph runtime initialised`. `:2026/api/langgraph/health` -> 401,
   `/api/langgraph/threads` -> `CSRF token missing` (both = gateway ALIVE).

## Key commands that worked
```bash
# real log
docker exec deer-flow-gateway tail -30 /app/logs/gateway.log
# manual probe (different port, survives restart churn)
docker exec -d deer-flow-gateway sh -c 'cd /app/backend && uv run uvicorn app.gateway.app:app --host 0.0.0.0 --port 8006 --reload > /tmp/uv.log 2>&1'
sleep 30; docker exec deer-flow-gateway tail -25 /tmp/uv.log
# correct restart that re-reads compose env_file
docker compose -p deer-flow-dev -f docker/docker-compose-dev.yaml restart gateway
```

## Notes
- `POST /api/chat` does NOT exist in DeerFlow 2.0; use `/api/langgraph/threads`
  then `/api/langgraph/threads/{id}/runs`.
- First-boot admin: `POST /api/auth/initialize`, then `/api/auth/login/local`,
  then read `csrf_token` cookie and send `X-CSRF-Token` on mutating calls.
- Local Ollama preferred over VPS: VPS was 45G full (100%) + no GPU; local Windows
  had 196G free. `ollama/ollama:latest` + `ollama pull qwen3-vl:2b` worked.
