# Gateway Bind Address + Healthcheck Fixes

Date: 2026-07-23
Repo: `C:\Project\esggo`
Service: `omniagent-gateway` (`vps-omniagent-gateway:latest`)

## Failure 1: bind to 127.0.0.1 inside container breaks host healthcheck

Symptom:
- `docker exec` internal curl -> `200`
- host curl -> `000_` or `Empty reply from server`
- healthcheck remains `starting`/`unhealthy` forever

Source:
```text
/opt/esggo/vps/Dockerfile.gateway -> /app/omni-server.mjs line 253
const BIND_ADDR = process.env.GATEWAY_BIND_ADDR || '127.0.0.1';
app.listen(port, BIND_ADDR, ...);
```

Fix:
```bash
docker rm -f omniagent-gateway
docker run -d --name omniagent-gateway \
  --network esggo-net -p 127.0.0.1:8642:8642 --restart unless-stopped \
  -e GATEWAY_BIND_ADDR=0.0.0.0 \
  vps-omniagent-gateway:latest
```

Verification:
```bash
curl -sS -o /dev/null -w "%{http_code}" -m 5 http://127.0.0.1:8642/status
# -> 200
```

## Failure 2: wget missing in node:22-alpine breaks healthcheck

Symptom:
- container logs show app running
- `docker ps` shows `health: starting` until retries exhausted
- root cause: wget not installed

Fix: insert into `Dockerfile.gateway` before `HEALTHCHECK`:
```dockerfile
RUN apk add --no-cache wget curl
```

## Env delivery quirk

Some prebuilt images ignore `--env-file` even though alpine baselines accept it.
Workaround: pass secrets as explicit `-e KEY=$(awk -F= '/^KEY=/{print $2}' file) docker run ...`
or bake them into the image via entrypoint if runtime delivery is impossible.
