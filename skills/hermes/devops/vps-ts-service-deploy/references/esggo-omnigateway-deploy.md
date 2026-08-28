# ESGGO OmniGateway Deployment Reference

## Identity (OA naming convention)
- OC = OmniCore 萬能心核 → syncStore + 5T envelope (`meta.node`)
- OA = OmniAgent / OmniAvata / OmniAssistant (multi-meaning by context)
- OA-LOCAL = 萬能蜂王 (local Hermes + CLI)
- OA-VPS = 萬能蜂后 (VPS :8421 OmniGateway)
- OAB = OmniAgentBus (`/sync/stream` SSE + RWED)
- OA-TWINS = 萬能雙生 (OA-LOCAL ↔ OA-VPS mirror)

## OmniGateway specifics
- Service dir: `/opt/esggo/vps/omnigateway/`
- Entry: `server.ts` (runs via `node --import tsx server.ts`, port 8421)
- External: `https://gateway.esggo.co` (Cloudflare tunnel `esggo-tunnel`)
- cloudflared ingress: `gateway.esggo.co → http://127.0.0.1:8421`
- Local CLI config: `~/.esggo/gateway.json` → `{"url":"https://gateway.esggo.co","token":""}`

## VPS access
- Host: `161.118.248.180` (Oracle ARM aarch64)
- SSH: `ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180`
  (config `Host esggo-vps` points at `~/.ssh/esggo_original`, which EXISTS on this machine)
- Other containers on VPS: omniagent-gateway (:8642, docker), tdai-memory-core (:8420), aistation-core (:8000), hermes-webui (:8790)

## 5T envelope spec (ESG GO API v1.2 alignment)
All routes return:
```json
{ "status":"success", "t5_tag":"T1|T2|T3|T4|T5",
  "data":{...}, "hash_lock":"sha256:...",
  "meta":{"node":"omni-gateway-edge-01","timestamp":...,"version":"1.3.0"} }
```
- T1=建立溯源(201-T1), T4=Hash Lock(200-T4), T5=查詢(200-T5)
- Bilingual `zh`/`en` fields embedded in `data`
- ZKP: currently Hash Lock SHA-256 (T4); ZKP Range Proof is spec target (honest: not faked)

## Routes
GET /health /status /gateway/status /oa/status /oa/agents /auth/verify /routes /oab/status /matrix
POST /oa/task/dispatch
GET|POST /data/:key
RWED /sync/:key  (Read/Write/Edit/Delete + hashLock)
GET /sync/stream (SSE broadcast)

## Restart command (verified)
```bash
PID=$(ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "pgrep -f 'server.ts' | head -1")
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "kill -9 $PID; sleep 2; cd /opt/esggo/vps/omnigateway; setsid node --import tsx server.ts >logs.out 2>&1 </dev/null & disown"
```
