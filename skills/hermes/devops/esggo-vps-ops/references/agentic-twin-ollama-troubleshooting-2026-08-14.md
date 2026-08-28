# Agentic Twin True-LLM Path Troubleshooting (2026-08-14)

## Context
Stabilize `/api/agentic-twin` B endpoint to consistently enter true LLM path (`llmEnhanced: true`) by calling local Ollama (`127.0.0.1:11434`).

## Verified working pattern

### 1. Write payload on VPS filesystem, not through SSH quoting
SSH `-d '{"a":1}'` repeatedly corrupts JSON body bytes; endpoint returns:
```
Expected property name or '}' in JSON at position 1
```

Fixed by writing to VPS disk first:
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  "python3 -c \"import json; json.dump({'reportType':'ISO-14064'}, open('/tmp/twin.json','w'))\""
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  "curl -s -X POST http://127.0.0.1:3000/api/agentic-twin \
     -H 'Content-Type: application/json' \
     --data-binary @/tmp/twin.json"
```

### 2. `req.text()` fallback in `route.ts` is not a silent win
Changing from `req.json()` to `req.text()` + `JSON.parse` made bad client JSON return `400 Invalid JSON body` instead of `500`, but did not enable true LLM path. Success for JSON fix ≠ success for LLM enablement.

### 3. Source edits to `app/api/agentic-twin/route.ts` can be silently reverted by `git checkout`
When running `git checkout -- app/api/agentic-twin/route.ts` (or a global revert), custom patches are lost. Confirm after any git cleanup:
```bash
grep 'req.text()' /var/www/esggo/app/api/agentic-twin/route.ts || echo 'reverted'
```

### 4. Partial route rebuilds leave stale `.next/server/app/api/...` artifacts
`next build app/api/agentic-twin/route.ts` runs, but compiled server artifacts in `.next/server/app/api/agentic-twin/route.js` can retain old logic (timestamp unchanged). **Always** delete the compiled route directory before rebuild:
```bash
rm -rf /var/www/esggo/.next/server/app/api/agentic-twin
cd /var/www/esggo && next build
```

### 5. Full rebuild is the reliable way to guarantee middleware/routes take effect
```bash
pm2 delete esggo-core
rm -rf /var/www/esggo/.next/server/app/api/agentic-twin
cd /var/www/esggo && timeout 240 node_modules/.bin/next build
pm2 start npm --name esggo-core -- start
sleep 5
curl --data-binary @/tmp/twin.json http://127.0.0.1:3000/api/agentic-twin
```

### 6. Local `curl -m240` against HTTPS `esggo.co` times out at 60s, while localhost succeeds fast
External HTTPS requests stall; localhost `127.0.0.1:3000` responds in <1s for the same payload. Use localhost for debugging; HTTPS timeout likely involves Cloudflare Tunnel latency or nginx buffer behavior, not endpoint logic.

### 7. Why `llmEnhanced` stays `false` even after fixing body parsing
The code path for LLM call is:
1. `AGENTIC_TWIN_OLLAMA_URL` must be set in `.env` and loaded by the `next start` process.
2. `fetch()` to `${OLLAMA_URL}/api/chat` must return HTTP 200 with `json.message.content`.
3. The returned `content` must pass `JSON.parse` after stripping ```json fences.
4. The parsed object must have `title` and `insight`.

Any single failure silently sets `llmEnhanced: false`. Confirm step 1 first via `/proc/<pid>/environ`; if the URL is loaded, enable debug logging in `route.ts` to see raw `llmRaw`:
```ts
console.log('[agentic-twin] raw llm:', String(llmRaw).slice(0,200));
```
Rebuild only the changed route directory after patching:
```bash
rm -rf /var/www/esggo/.next/server/app/api/agentic-twin
cd /var/www/esggo && next build app/api/agentic-twin/route.ts
```

### 8. OCI/DB creds integration pattern
User provides credentials in a session; append them to `/var/www/esggo/.env` with backups and redaction-friendly comments. Do **not** upload private key material unless explicitly requested; create only the config entries (`OCI_*`, `DB_PASSWORD`). Verify env loaded:
```bash
grep -E '^(OCI_USER_OCID|OCI_TENANCY_OCID|DB_PASSWORD)=' /var/www/esggo/.env | sed 's/=.*$/=[REDACTED]/'
/usr/lib/node_modules/pm2/bin/pm2 restart esggo-core --update-env
```
If `/usr/bin/pm2` is missing, use the absolute binary path.

### 9. ENABLEMENT checklist for true-LLM path
- [ ] `.env` contains `AGENTIC_TWIN_OLLAMA_URL=http://127.0.0.1:11434` and model key is present.
- [ ] `/proc/<pid>/environ` contains those vars (not blank).
- [ ] `curl http://127.0.0.1:11434/api/chat` returns 200 with non-empty `message.content`.
- [ ] `route.ts` is clean (no debug-only req.text patch unless intentional).
- [ ] `.next/server/app/api/agentic-twin/route.js` mtime is newer than route.ts mtime.
- [ ] POST with binary payload returns HTTP 200 and `llmEnhanced: true`.

### 10. Full `.next` deletion is the reliable rebuild, not partial route removal
Even after removing `.next/server/app/api/agentic-twin`, Turbopack can reuse stale chunks that mask source changes. **Reliable pattern**:
```bash
pm2 stop esggo-core
rm -rf /var/www/esggo/.next
cd /var/www/esggo && timeout 240 node_modules/.bin/next build
pm2 start npm --name esggo-core -- start --update-env
sleep 6
```

### 11. nginx `proxy_read_timeout` blocks LLM responses at 30s
Default nginx config times out long Ollama calls. Add a dedicated location **before** the generic `/api/` catch-all:
```
location /api/agentic-twin {
    proxy_pass http://127.0.0.1:3000/api/agentic-twin;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_connect_timeout 10s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
}
```
Then `sudo nginx -t && sudo systemctl reload nginx`. Without this, HTTPS returns 500/502 while localhost:3000 succeeds.

### 12. Successful probe payload that triggers `llmEnhanced:true`
Verified 2026-08-15: this payload returns HTTP 200 + `llmEnhanced:true` via HTTPS:
```json
{
  "reportType": "ISO-14064",
  "previousYearUsage": 1000,
  "currentYearUsage": 800,
  "gridEmissionFactor": 0.495,
  "evidence": ["https://esggo.co/evidence/sample.pdf"],
  "enterpriseName": "ESGGO",
  "industry": "sustainability",
  "currentEntropy": 0.08
}
```
Key difference from failing payloads: `currentYearUsage` lower than previous, plus `evidence` array. The heuristic engine rejects anomalous increases (`1200 > 1000`) with `CRITICAL_INTERVENTION` before Ollama is consulted; decreases pass through to LLM enhancement.
```bash
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  "python3 - <<'PY'
import json
print(json.dumps({
  'reportType':'ISO-14064',
  'previousYearUsage':1000,
  'currentYearUsage':1200,
  'gridEmissionFactor':0.495,
  'evidence':['https://esggo.co/evidence/sample.pdf'],
  'enterpriseName':'ESGGO',
  'industry':'sustainability',
  'currentEntropy':0.08
}))
" > /tmp/twin_probe.json

ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  "curl -s -m240 -w '\nHTTP_%{http_code}\n' \
     -X POST http://127.0.0.1:3000/api/agentic-twin \
     -H 'Content-Type: application/json' \
     --data-binary @/tmp/twin_probe.json"
```

Expected output if true-LLM is active: HTTP 200 + `"llmEnhanced":true`.
