# Hermes WebUI Docker on Windows/MSYS — fixes from real deployment

Reproduced on: 2026-08-18
Repo/path: `C:\Users\dingj\hermes-webui`
Compose: `docker-compose.yml` mounts `${HOME}/.hermes` + `${HOME}/workspace`, binds `127.0.0.1:8787:8787`
Entrypoint: `/hermeswebui_init.bash` (root) -> su to `hermeswebui` -> `python server.py`

## Failure 1: health_probe CRLF -> container unhealthy

Symptom: `docker compose ps` shows `Up ... (health: starting)` then `(unhealthy)` with:
```
/apptoo/scripts/lib/health_probe.sh: line 29: $'\\r': command not found
/apptoo/scripts/lib/health_probe.sh: line 38: syntax error near unexpected token `$'{\\r}''
```
Root cause: Windows checkout preserved `\r\n` in `.sh`/`.bash` files; copied into image unchanged.

Fix:
```bash
cd C:/Users/dingj/hermes-webui
sed -i 's/\r$//' docker_init.bash
find scripts -type f \( -name '*.sh' -o -name '*.bash' \) -print0 | xargs -0 sed -i 's/\r$//'
bash -n scripts/lib/health_probe.sh && echo OK
docker compose build && docker compose up -d
```

## Failure 2: /app empty after init -> port 8787 closed

Symptom: container logs stop at `Running as root for one-time container init; will switch to hermeswebui`,
no process listening, `curl http://localhost:8787/health` fails.
`docker exec <svc> ls -la /app` shows empty; `/apptoo` has files.

Workaround:
```bash
docker exec -u root hermes-webui-hermes-webui-1 bash -lc \
  'cp -a /apptoo/. /app/ && chown -R hermeswebui:hermeswebui /app'
```
Then ensure runtime deps:
```bash
docker exec -u root hermes-webui-hermes-webui-1 bash -lc \
  'chown -R hermeswebui:hermeswebui /home/hermeswebui /app /uv_cache &&
   mkdir -p /home/hermeswebui/.cache/uv /uv_cache &&
   su -s /bin/bash -c "export UV_CACHE_DIR=/uv_cache && cd /app && uv venv venv" hermeswebui &&
   su -s /bin/bash -c "export UV_CACHE_DIR=/uv_cache && source /app/venv/bin/activate && uv pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org" hermeswebui &&
   touch /app/venv/.deps_installed'
```

## Failure 3: uv Permission denied on /home/hermeswebui/.cache/uv

Symptom:
```
error: Failed to initialize cache at `/home/hermeswebui/.cache/uv`
Caused by: failed to create directory `/home/hermeswebui/.cache/uv`: Permission denied
```
Fix: ensure `/home/hermeswebui` is owned by the runtime user, or set `UV_CACHE_DIR=/uv_cache`.

## Verification checklist

```bash
docker compose ps
docker compose logs --tail=120 hermes-webui
docker exec hermes-webui-hermes-webui-1 bash -lc 'ls -la /app | head -20'
docker exec hermes-webui-hermes-webui-1 bash -lc 'curl -sS -o /dev/null -w "%{http_code}" http://localhost:8787/health'
```
Healthy end state: status `Up ... (healthy)` and `/health` returns 200.
