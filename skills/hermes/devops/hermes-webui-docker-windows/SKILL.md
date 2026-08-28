---
name: hermes-webui-docker-windows
description: "Build/run hermes-webui Docker on Windows/MSYS."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows]
metadata:
  hermes:
    tags: [docker, windows, hermes-webui, msys, compose]
---

# Hermes WebUI Docker on Windows/MSYS

## Trigger
Build/run `hermes-webui` containers from a Windows checkout using Docker Compose, especially when entrypoints/health probes fail with CRLF errors or `/app` is empty after init.

## Critical facts
1. **Python, not Node.** Launched via `bootstrap.py` (creates venv, pip-installs, execs `server.py`/uvicorn). `package.json` has no deps — ignore it.
2. **CRLF in entrypoint/health probes** — copied scripts keep `\r\n` line endings inside the image. Bash then reports `$'\r': command not found` or `no such file or directory` for scripts that exist.
3. **Empty `/app` after init** — init script rsync/copies source into `/app`; on constrained runtimes the copy can silently no-op. Container is "Up" but nothing listens.
4. **uv permission errors** — first-run `uv venv` can fail with `Permission denied` under the runtime user; use `UV_CACHE_DIR=/uv_cache` and pre-create/own the cache dir.
5. **Background-first compose** — foreground `docker compose up -d` from this tool can return `exit -1` with "starts a long-lived server/watch process". Use `background=true` + `notify_on_complete=true`, then verify with `docker compose ps` / `logs`.

## Procedure

### Normalize line endings BEFORE building
```bash
cd C:/Users/dingj/hermes-webui
sed -i 's/\r$//' docker_init.bash
find scripts -type f \( -name '*.sh' -o -name '*.bash' \) -print0 | xargs -0 sed -i 's/\r$//'
bash -n scripts/lib/health_probe.sh && echo OK
```

### Build and start
```bash
docker compose build
# Use background=true for long-lived containers
```

### Recover empty /app without rebuilding
```bash
docker exec -u root <svc> bash -lc 'cp -a /apptoo/. /app/ && chown -R hermeswebui:hermeswebui /app'
```

### Ensure venv + deps inside container
```bash
docker exec -u root <svc> bash -lc \
  'chown -R hermeswebui:hermeswebui /home/hermeswebui /app /uv_cache &&
   mkdir -p /home/hermeswebui/.cache/uv /uv_cache &&
   su -s /bin/bash -c "export UV_CACHE_DIR=/uv_cache && cd /app && uv venv venv" hermeswebui &&
   su -s /bin/bash -c "export UV_CACHE_DIR=/uv_cache && source /app/venv/bin/activate && uv pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org" hermeswebui &&
   touch /app/venv/.deps_installed'
```

## Verification checklist
```bash
docker compose ps
docker compose logs --tail=120 hermes-webui
docker exec <svc> bash -lc 'ls -la /app | head -20'
docker exec <svc> bash -lc 'curl -sS -o /dev/null -w "%{http_code}" http://localhost:8787/health'
```
Healthy end state: `Up ... (healthy)` and `/health` returns 200.
