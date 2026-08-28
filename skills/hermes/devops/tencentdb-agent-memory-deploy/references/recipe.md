# TencentDB Agent Memory — VPS Deploy Recipe (verified 2026-08-06)

## Prereqs
- VPS `ubuntu@161.118.248.180`, Docker 29.7.1 + Compose v5.3.1, ~3.5GB free RAM, 1 vCPU.
- `cloudflared` tunnel already running (`esggo-tunnel`, id `d821f09e-91ec-4c38-85da-89451a5a8983`),
  ingress pattern `ftg.esggo.co -> 127.0.0.1:80` (TLS terminated at Cloudflare edge).
- Groq key injected at runtime (never committed).

## Step-by-step (actual commands run this session)

### 1. Stage in esggo (Windows Git-Bash)
```
cp -r /c/Project/TencentDB-Agent-Memory/deploy/global-images/* apps/tencentdb-memory/
echo "apps/tencentdb-memory/.env" >> .gitignore
# commit + push: feat(m1): TencentDB Agent Memory full integration scaffolding
```

### 2. Sync VPS (had permission + drift errors first; fixed by:)
```
ssh ubuntu@161.118.248.180 'sudo chown -R ubuntu:ubuntu /opt/esggo'   # fix Permission denied on .git/objects
cd /opt/esggo && GIT_SSH_COMMAND="ssh -i ~/.ssh/vps_deploy_key" git fetch origin
git reset --hard origin/main          # discards VPS local drift (esggo-omni-center etc.)
```
Note: `vps_deploy_key` is the Deploy Key added to GitHub repo; its pubkey was added via
`gh api -X POST repos/DingJun1028/esggo/keys -f title=vps-deploy-dingjun -f key="$PUB"`.

### 3. Inject `.env` on VPS (after scp'ing `.env.example` which was gitignored on VPS)
```
cd /opt/esggo/apps/tencentdb-memory
sed -e 's#REPLACE_ME#<GROQ_KEY>#g' \
    -e 's#https://api.deepseek.com/v1#https://api.groq.com/openai/v1#g' \
    -e 's#deepseek-chat#openai/gpt-oss-20b#g' .env.example > .env
echo 'MEMORY_LLM_PROTOCOL=openai' >> .env
echo 'PROXY_FULL_STACK=1' >> .env
sed -i 's/\r$//' .env            # CRITICAL: CRLF from Windows git checkout
grep -c REPLACE_ME .env          # must be 0
chmod +x start-*.sh _lib.sh verify.sh deploy.sh
```

### 4. Start (background — docker pull of memory-hub is slow, 180s foreground times out)
```
nohup bash start-all.sh > /tmp/tdai-start.log 2>&1 &
# after ~3 min:
docker ps --format "{{.Names}} {{.Status}}" | grep tdai
# tdai-memory-core Up ... healthy / tdai-memory-hub ... healthy / tdai-proxy ... healthy
```

### 5. Expose via tunnel (no open ports, no certbot)
```
# nginx site :80 only:
server { server_name memory.esggo.co;
  location /gateway/ { proxy_pass http://127.0.0.1:8420/; ... }
  location / { proxy_pass http://127.0.0.1:8125; ... }
  listen 80; }
sudo ln -s /etc/nginx/sites-available/memory.esggo.co.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

# tunnel ingress:
sudo tee /etc/cloudflared/config.yml <<EOF
tunnel: d821f09e-91ec-4c38-85da-89451a5a8983
credentials-file: /home/ubuntu/.cloudflared/d821f09e-91ec-4c38-85da-89451a5a8983.json
ingress:
  - hostname: esggo.co
    service: http://127.0.0.1:3000
  - hostname: ftg.esggo.co
    service: http://127.0.0.1:80
  - hostname: memory.esggo.co
    service: http://127.0.0.1:80
  - service: http_status:404
EOF
sudo systemctl restart cloudflared

# DNS CNAME via tunnel creds (Zone-DNS API token gave 9109 Invalid access token):
cloudflared tunnel route dns d821f09e-91ec-4c38-85da-89451a5a8983 memory.esggo.co
# -> "Added CNAME memory.esggo.co which will route to this tunnel"
```

### 6. Verify (public edge)
```
curl -s -o /dev/null -w "%{http_code}" https://memory.esggo.co/          # 200
curl -s https://memory.esggo.co/gateway/health                          # {"status":"ok",...}
```
Local nslookup may lag ~60s; verify with curl to the public host, not nslookup.

## Error transcript -> fix map
| Symptom | Cause | Fix |
|---|---|---|
| `$'\r': command not found` (exit 127) | CRLF in `.env` | `sed -i 's/\r$//' .env` |
| `start-memory-core.sh: Permission denied` (126) | no +x after git reset | `chmod +x start-*.sh _lib.sh` |
| `Command timed out after 180s` (124) | docker pull memory-hub slow | `nohup ... &` background |
| `certbot: no valid A records found` | subdomain DNS missing | use `cloudflared tunnel route dns` |
| `insufficient permission .git/objects` | root-owned subdirs | `sudo chown -R ubuntu:ubuntu /opt/esggo` |
| Cloudflare API `9109 Invalid access token` | token lacks Zone:DNS | use `cloudflared tunnel route dns` |
