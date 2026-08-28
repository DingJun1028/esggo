# Aistation Core Port-Conflict + Cloudflared Route Recovery

## Symptom
`docker compose up -d aistation` fails with:
```
failed to bind host port 127.0.0.1:8000/tcp: address already in use
```
Then after changing the host port, Compose fails again with:
```
container ... is not connected to the network vps_esggo-net
failed to set up container networking
```

## Verified Recovery Sequence
1. Inspect the stale container:
   ```bash
   docker inspect aistation-core --format '{{json .NetworkSettings.Networks}}'
   # {} means detached from all networks
   ```
2. Remove the stale container:
   ```bash
   docker rm -f aistation-core
   ```
3. Change only the host side of the port mapping in `docker-compose.yml`:
   ```yaml
   ports:
     - "127.0.0.1:8001:8000"
   ```
   Do NOT change the container side; healthcheck and internal app config keep using `8000`.
4. Recreate:
   ```bash
   docker compose up -d --force-recreate aistation
   ```
5. Verify container health:
   ```bash
   docker ps --filter name=aistation
   curl -sS http://127.0.0.1:8001/api/health
   ```
6. Update cloudflared ingress to route the subdomain to the new host port:
   ```bash
   sudo tee /etc/cloudflared/config.yml <<'EOF'
   ...
   - hostname: aistation.esggo.co
     service: http://127.0.0.1:8001
   EOF
   sudo systemctl restart cloudflared
   ```
7. Verify public route:
   ```bash
   curl -sS https://aistation.esggo.co/api/health
   ```

## Pitfalls
- `docker compose down` plus `up -d` can fail if the stale container is already detached from the compose-managed network; `docker rm -f <container>` is the reliable escape hatch.
- Editing `/etc/cloudflared/config.yml` requires root. Test `sudo -n true` first; otherwise use `sudo tee` or `sudo cp` plus `sudo systemctl restart cloudflared`. Do NOT use `sed -i` directly unless you can write to the file.
- `aistation-core` is the compose container name even though the service is `aistation`; use the container name for `docker rm`/`docker inspect`.

## 5T Mapping
- Traceable: image digest match between local and VPS (`docker images --format '{{.Digest}}'`).
- Trackable: job lifecycle via `/api/jobs/{id}` and `/api/metrics`.
- Tangible: public `https://aistation.esggo.co/api/health` returns JSON.
- Transparent: cloudflared config shows exact backend host:port.
- Trustworthy: webhook auth via `X-AI-Station-Key` + HMAC constant-time compare.
