---
name: tencentdb-agent-memory-deploy
description: Deploy TencentDB memory to VPS via Cloudflare Tunnel.
---

# TencentDB Agent Memory — VPS Deployment & esggo Integration

Use when deploying the upstream `TencentDB-Agent-Memory` repo's `deploy/global-images`
one-click stack (MemoryCore + MemoryHub/Panel + Proxy) as a backend service, or wiring
it into the `DingJun1028/esggo` monorepo. Complements `hermes-memory-tencentdb-windows`
(which wires TencentDB into the *local Windows Hermes* agent) — this skill targets the
*VPS / esggo* backend deployment class.

## Architecture
- `memory-core` (gateway `:8420`) — vector store + embedding + session/gateway API
- `memory-hub` (panel `:8125`, knowledge `:8424`) — UI + wiki/knowledge ingest
- `proxy` (`:8096`) — upstream LLM proxy for coding agents
- All three launched by `start-all.sh` (pulls `agentmemory/*:latest` from Docker Hub).
- Needs **two LLM groups** in `.env`: `MEMORY_LLM_*` (internal embed/summarize) and
  `PROXY_UPSTREAM_*` (user-facing upstream). Best practice: use **Groq**
  (`https://api.groq.com/openai/v1`, model `openai/gpt-oss-20b`, protocol `openai`) for both.

## Workflow
1. **Stage in esggo** (do NOT commit real keys):
   - `mkdir -p apps/tencentdb-memory && cp -r TencentDB-Agent-Memory/deploy/global-images/* apps/tencentdb-memory/`
   - Keep `.env.example` (placeholders `REPLACE_ME`) tracked; add `apps/tencentdb-memory/.env`
     to `.gitignore` so the real `.env` never enters git.
   - Write a `deploy.sh` (esggo style: syntax-check → rsync → VPS inject → start → verify).
2. **Push to GitHub**, then sync VPS: `git reset --hard origin/main` (or `git pull`).
   See `esggo-vps-sync-troubleshooting` for VPS git permission/`chown` issues.
3. **Inject `.env` on VPS** (key stays on VPS, never in git):
   ```
   cd /opt/esggo/apps/tencentdb-memory
   sed -e 's#REPLACE_ME#<GROQ_KEY>#g' \
       -e 's#https://api.deepseek.com/v1#https://api.groq.com/openai/v1#g' \
       -e 's#deepseek-chat#openai/gpt-oss-20b#g' \
       .env.example > .env
   echo 'MEMORY_LLM_PROTOCOL=openai' >> .env
   echo 'PROXY_FULL_STACK=1' >> .env
   ```
4. **Start** (see pitfalls — never foreground with a short timeout):
   ```
   chmod +x start-*.sh _lib.sh verify.sh deploy.sh
   sed -i 's/\r$//' .env            # CRITICAL: strip Windows CRLF
   nohup bash start-all.sh > /tmp/tdai-start.log 2>&1 &
   ```
5. **Expose** via Cloudflare Tunnel (see below). Verify:
   `curl localhost:8420/health` → `{"status":"ok"...}`; panel `:8125` → HTML.

## Exposure — Cloudflare Tunnel (NOT open ports, NOT certbot)
Best practice for this VPS: reuse the **already-running `cloudflared` tunnel** and route a
subdomain to nginx `:80` (tunnel terminates TLS at the edge; origin stays plaintext on :80).
- Make an nginx site listening on **`:80` only** (no `listen 443`, no cert):
  `location /gateway/ { proxy_pass http://127.0.0.1:8420/; }` (strips `/gateway/` prefix)
  and `location / { proxy_pass http://127.0.0.1:8125; }` for the Panel.
- Add to `/etc/cloudflared/config.yml` ingress: `- hostname: memory.esggo.co` →
  `service: http://127.0.0.1:80`, then `sudo systemctl restart cloudflared`.
- **Create the DNS CNAME with the tunnel's own credentials** (a Zone-DNS API token often
  lacks perms): `cloudflared tunnel route dns <TUNNEL_ID> memory.esggo.co`
  → "Added CNAME ... which will route to this tunnel".
- Verify: `curl -s -o /dev/null -w "%{http_code}" https://memory.esggo.co/` → `200`,
  and `https://memory.esggo.co/gateway/health` → `{"status":"ok"...}`.

## Ollama self-hosted variant (zero API cost — VPS already has Ollama)
When you want NO Groq/OpenAI key (user hard rule: free-only / self-host), the VPS likely
already runs Ollama (e.g. `gemma4:e4b`, `nomic-embed-text`). Two paths:

**Path A — Docker `start-all.sh` with Ollama URLs (LLM works, embedding stays OFF):**
Replace `REPLACE_ME` with the *host-reachable* Ollama base URL and a local model:
```bash
cd /opt/esggo/apps/tencentdb-memory
sed -e 's#REPLACE_ME#ollama-local#g' \
    -e 's#https://api.deepseek.com/v1#http://host.docker.internal:11434/v1#g' \
    -e 's#deepseek-chat#gemma4:e4b#g' \
    .env.example > .env
# container→host Ollama MUST use host.docker.internal, never localhost
# AND start-memory-core.sh's `docker run` needs --add-host=host.docker.internal:host-gateway
sed -i 's/\r$//' .env && chmod +x start-*.sh _lib.sh
nohup bash start-all.sh > /tmp/tdai-ollama.log 2>&1 &
```
LLM (chat/extract) works against `gemma4:e4b`. **But see embedding trap below** — this
script path will NOT enable semantic embeddings.

**Path B — proven embedding-enabled local launch (node, not Docker):**
The Docker `start-memory-core.sh` hard-codes a **top-level `embedding:` block that the
gateway IGNORES** (it must be nested under `memory.embedding:`), so `embeddingService`
stays `false` / `dimensions=0, embedding=disabled` no matter what Ollama model you pull.
For a working embedded store, use the node-launch recipe in `tdai-gateway-manual-windows`
§1–2 with this yaml shape:
```yaml
memory:
  embedding:
    provider: openai          # yes, "openai" — Ollama is OpenAI-compat
    baseUrl: "http://127.0.0.1:11434/v1"
    apiKey: "ollama-local"
    model: "nomic-embed-text"
    dimensions: 768
llm:
  baseUrl: "http://127.0.0.1:11434/v1"
  apiKey: "ollama-local"
  model: "gemma4:e4b"
```
Verified log markers (from `tdai-gateway-manual-windows` §5):
`Store created: ... embedding=enabled, dimensions=768` and
`[L0-vec-index-bg] Background embedding complete` = vectors written.

> **2026-08-09 session note:** tried Path A with `embedding.provider: ollama` + `nomic-embed-text`
> pulled + volume purged — `embeddingService` STILL `false` (dimensions=0). Root cause =
> top-level `embedding:` ignored by gateway. Path B is the working alternative; do NOT
> report Path A's embedding edit as "fixed".

## Pitfalls (durable — hit every time)
- **CRLF in `.env`**: Windows git checkouts write CRLF; `start-all.sh` `source`s `.env` and
  bash errors with `$'\r': command not found`, exit 127. Fix: `sed -i 's/\r$//' .env` BEFORE
  running start-all. (Apply to any file the shell `source`s.)
- **Embedding trap (Docker path)**: `start-memory-core.sh`'s generated config puts
  `embedding:` at top level → gateway logs `embedding=none` and disables it. To get
  semantic embeddings you must launch via node with `memory.embedding:` nested (Path B
  above / `tdai-gateway-manual-windows`). Don't waste a session re-discovering this.
- **Scripts not executable** after `git checkout`/reset on VPS: `start-*.sh` run with
  `Permission denied` (exit 126). Fix: `chmod +x start-*.sh _lib.sh verify.sh`.
- **`docker pull` timeout**: `memory-hub` image is large; a foreground `start-all.sh` with
  a 180s terminal timeout gets killed mid-pull (exit 124) even though step 1 succeeded.
  Always launch start-all with `nohup ... &` in background, then poll
  `docker ps` / `/tmp/tdai-start.log`.
- **certbot fails for new subdomain**: `certbot certonly` errors `no valid A records found`
  because the subdomain has no DNS yet. Do NOT go down the certbot path for tunnel-routed
  hosts — the tunnel provides TLS at the edge. Use `cloudflared tunnel route dns` instead.
- **Local `nslookup` lags**: after `route dns`, your local resolver may still return the
  router IP for ~60s. Verify from the public edge with `curl https://<sub>.esggo.co/`
  (Cloudflare resolves it), not local `nslookup`.

## Verification checklist
- [ ] VPS `docker ps` shows `tdai-memory-core/hub/proxy` all `healthy`
- [ ] `curl localhost:8420/health` returns `{"status":"ok"...}`
- [ ] `curl localhost:8125/` returns Panel HTML
- [ ] `.env` has 0 `REPLACE_ME` left; `.env` is git-ignored
- [ ] `https://<sub>.esggo.co/` → 200 and `/gateway/health` → ok (via tunnel)

See `references/recipe.md` for the exact command transcript.
