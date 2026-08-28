# VPS SSH key & self-hosted OSS (verified 2026-08-11)

## SSH key — esggo_original is DEAD
`~/.ssh/esggo_original` now returns `Permission denied (publickey)`. The ONLY working key is **`ci_deploy_key`** (`~/.ssh/ci_deploy_key`). Others (`gh_deploy_key`, `id_rsa_esggo*`, `vps_deploy_key`) also fail. Connect:
```bash
ssh -o StrictHostKeyChecking=no -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 '...'
```
(Update the SKILL.md SSH section — it still says `esggo_original`; that text is STALE.)

## Self-hosted free OSS on VPS (4 OCPU / 24 GB, ~18 GB free)
### Port避讓 (critical)
`:9000` = portainer, `:9090` also taken. Use `:19000` (SonarQube), `:19001`/`:19090` (MinIO). Check first:
```bash
for p in 19000 19001 19090; do curl -sf -m3 http://localhost:$p >/dev/null 2>&1 && echo "$p USED" || echo "$p FREE"; done
```

### SonarQube CE (`/opt/sonarqube/docker-compose.yml`)
- postgres + `sonarqube:community`, publish `19000:9000`.
- First boot: admin pw `admin` → change needs `previousPassword` param:
  `curl -X POST .../api/users/change_password -u admin:admin --data-urlencode previousPassword=admin --data-urlencode password=<new>`
- Token: `curl -X POST .../api/user_tokens/generate -u admin:<new> --data-urlencode name=esggo-ut-ci` → `squ_...` (44 chars).
- **CE has NO agentic auto-remediation** (SonarCloud/Enterprise paid). Static analysis only — satisfies free-compute.
- Scan FROM VPS localhost (OCI security list may not open 19000 to internet; SSH tunnel from local often fails on MSYS/Windows firewall). Copy code via `scp -i ci_deploy_key -r . ubuntu@...:/tmp/ut-scan`, then on VPS: `cd /tmp/ut-scan && npx sonarqube-scanner -Dsonar.host.url=http://localhost:19000 -Dsonar.token=<tok> -Dsonar.projectKey=universal-translator -Dsonar.sources=server.mjs,translate.mjs,stt_client.mjs` → ANALYSIS SUCCESSFUL.

### MinIO (`/opt/minio/docker-compose.yml`)
- `minio/minio:latest`, `server /data --console-address ':19090'`, publish `19001:9000` + `19090:19090`, env `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD`.
- After up: `docker exec minio mc alias set local http://localhost:9000 <user> <pass> && docker exec minio mc mb local/evidence-vault`.
- S3-compatible → app route handlers use `@aws-sdk/client-s3` (presigned PUT or server-side upload); never expose root creds to frontend.

### Ollama
Already on VPS `:11434` (gemma4:26b, qwen2.5:3b-instruct, nomic-embed-text). Next.js routes call `http://localhost:11434/api/chat` directly via env `AGENTIC_TWIN_OLLAMA_URL` — no tunnel needed.
