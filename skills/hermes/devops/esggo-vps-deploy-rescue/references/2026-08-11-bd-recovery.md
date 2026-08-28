# 2026-08-11 B/D Recovery Evidence

## Verified commands and outputs

### B: Agentic Twin live proof
```bash
curl -s -m40 -w '\nHTTP_%{http_code}\n' \
  "https://esggo.co/api/agentic-twin" \
  -X POST -H 'Content-Type: application/json' \
  -d '{"uuid":"live-b-008","reportType":"ISO-14064","previousYearUsage":1000,"currentYearUsage":1200,"gridEmissionFactor":0.495,"evidence":["https://esggo.co/evidence/sample.pdf"],"enterpriseName":"ESGGO","industry":"sustainability","currentEntropy":0.08}'
```
Result: `200` with `llmEnhanced: true` after Ollama env was visible to the running Next process.

### D: Evidence Vault 401 root cause
Live: `401 Missing authorization token`
Cause: `src/middleware.ts` `PROTECTED_API_PREFIXES` contains `/api/evidence`; `/api/evidence-upload` was not in `PUBLIC_ROUTES`, so it fell through to Firebase auth.

### Middleware exact text to edit
File: `/var/www/esggo/src/middleware.ts` (production)
```ts
const PUBLIC_ROUTES: readonly string[] = [
  '/api/evidence-upload',   // MUST be quoted string
  '/api/healthz',
  '/api/health',
  '/api/health/metrics',
  '/_next/',
  '/favicon.ico',
  '/assets/',
  '/public/',
];
```

### Ollama direct probe
```bash
curl -s -m90 http://127.0.0.1:11434/api/chat \
  -d '{"model":"qwen2.5:3b","messages":[{"role":"user","content":"hi"}],"stream":false}'
```
Expected: `200` with `message.content` text. If empty response, Ollama is unhealthy.

### Service recovery sequence
```bash
# 1. Make sure .env exists
sudo bash -c 'cat > /var/www/esggo/.env <<EOF
AGENTIC_TWIN_OLLAMA_URL=http://127.0.0.1:11434
AGENTIC_TWIN_OLLAMA_MODEL=qwen2.5:3b
MINIO_ENDPOINT=127.0.0.1:19001
MINIO_ACCESS_KEY=esggo-minio
MINIO_SECRET_KEY=MinioESGG0!2026
MINIO_BUCKET=evidence-vault
EOF'

# 2. If systemd + pm2 both try to own port 3000, disable systemd:
sudo systemctl disable --now esggo-app.service

# 3. Use pm2 single supervisor
cd /var/www/esggo
pm2 delete esggo-core
pm2 start npm --name esggo-core -- start

# 4. Verify
curl -sf -m10 http://127.0.0.1:3000/omni/reports -o /dev/null && echo LOCAL_UP || echo LOCAL_DOWN
curl -s -o /dev/null -w '%{http_code}' https://esggo.co/omni/reports
```

### pnpm approve-builds in non-interactive deploy
```bash
cd /var/www/esggo
pnpm approve-builds --all
pnpm install --frozen-lockfile
```
Without this, `postinstall` prompts block CI/VPS deploys.
