---
name: omnigateway
description: >
  Cloudflare OmniGateway patterns: AI Gateway + AI Crawl Control + Workers VPC bindings +
  semantic cache + multi-provider fallback + origin audit sink + Zero Trust model for an AI edge
  gateway. Use for deploying a Worker-based unified AI gateway, hardening against unauthorized
  AI crawlers, caching prompts/responses, routing to OpenRouter/Groq/Gemini/private VPC models,
  and pushing audit logs to an origin API.
  Trigger keywords: omnigateway, cloudflare ai gateway, ai crawl control, workers vpc,
  semantic cache, fallback router, zero trust gateway, cf-aig-metadata.
triggers:
  - omnigateway
  - cloudflare ai gateway
  - ai crawl control
  - workers vpc
  - semantic cache
  - fallback router
  - zero trust gateway
  - cf-aig-metadata
---

# OmniGateway

Class-level patterns for deploying and operating Cloudflare OmniGateway as the unified AI edge.

## Overview

OmniGateway centralizes AI access across providers and private VPC models. Responsibilities:

1. **Authentication** — Bearer token for protected generation routes.
2. **AI Crawl Control** — deny or rate-limit unauthorized AI crawlers before protected paths.
3. **Semantic Cache** — KV-backed prompt/response cache with TTL.
4. **Fallback Routing** — try providers in priority order until one succeeds.
5. **Audit Sink** — fire-and-forget origin API call for every request.
6. **Alerting** — optional Telegram/Discord webhook transport for spend-cap and rate-limit events.
7. **Workers VPC** — `PRIVATE_API` binding to private models through Tunnel/Mesh.

## Architecture

```
[User / AI Agent / Crawler]
        |
        v
[Cloudflare WAF + Bot Management]
        |
        v
[OmniGateway Worker: auth → crawl control → /status|/v1/chat/completions|/v1/models]
        |
        +-- OpenRouter → chat completions
        +-- Groq → chat completions
        +-- Gemini → generateContent
        +-- PRIVATE_API (VPC service binding) → internal model/api
```

## Worker Code Review Checklist

When reviewing or modifying `worker/src/index.ts`, check for these known issues:

1. **Exposed API Keys**: Authorization headers must use `Bearer ${key}` format, NOT `*** ${key}` template literals that leak keys in source.
2. **cf-aig-metadata Header**: Do NOT include API keys in `x-omni-token` header on upstream requests. This header is for internal auth only.
3. **PRIVATE_API Fallback**: The `fallbackGenerate` function must include `callPrivateModel` as the last candidate, matching the `PRIVATE_API` env binding and `/v1/models` advertisement.
4. **Cache Key Privacy**: Semantic cache keys must hash message content (SHA-256), not embed raw prompts. Raw prompts in cache keys leak user data.

See `references/esggo-worker-bugs.md` for detailed bug descriptions and fixes.

## Deploy layout

Two levels:
- **VPS Edge Gateway**: `omniagent-gateway` Docker container running Express + WebSocket + Telegram bot (existing `apps/gateway/omni-server.mjs`).
- **Cloudflare Edge Gateway**: OmniGateway Worker providing global edge auth, crawl control, cache, and fallback across providers.

## Worker Code Review Checklist

When reviewing or modifying `worker/src/index.ts`, check for these known issues:

1. **Exposed API Keys**: Authorization headers must use `Bearer ${key}` format, NOT `*** ${key}` template literals that leak keys in source.
2. **cf-aig-metadata Header**: Do NOT include API keys in `x-omni-token` header on upstream requests. This header is for internal auth only.
3. **PRIVATE_API Fallback**: The `fallbackGenerate` function must include `callPrivateModel` as the last candidate, matching the `PRIVATE_API` env binding and `/v1/models` advertisement.
4. **Cache Key Privacy**: Semantic cache keys must hash message content (SHA-256), not embed raw prompts. Raw prompts in cache keys leak user data.

See `references/esggo-worker-bugs.md` for detailed bug descriptions and fixes.

## Deploy layout

Two levels:
- **VPS Edge Gateway**: `omniagent-gateway` Docker container running Express + WebSocket + Telegram bot (existing `apps/gateway/omni-server.mjs`).
- **Cloudflare Edge Gateway**: OmniGateway Worker providing global edge auth, crawl control, cache, and fallback across providers.

## Worker Code Review Checklist

When reviewing or modifying `worker/src/index.ts`, check for these known issues:

1. **Exposed API Keys**: Authorization headers must use `Bearer ${key}` format, NOT `*** ${key}` template literals that leak keys in source.
2. **cf-aig-metadata Header**: Do NOT include API keys in `x-omni-token` header on upstream requests. This header is for internal auth only.
3. **PRIVATE_API Fallback**: The `fallbackGenerate` function must include `callPrivateModel` as the last candidate, matching the `PRIVATE_API` env binding and `/v1/models` advertisement.
4. **Cache Key Privacy**: Semantic cache keys must hash message content (SHA-256), not embed raw prompts. Raw prompts in cache keys leak user data.

See `references/esggo-worker-bugs.md` for detailed bug descriptions and fixes.

## Worker Code Review Checklist

When reviewing or modifying `worker/src/index.ts`, check for these known issues:

1. **Exposed API Keys**: Authorization headers must use `Bearer ${key}` format, NOT `*** ${key}` template literals that leak keys in source.
2. **cf-aig-metadata Header**: Do NOT include API keys in `x-omni-token` header on upstream requests. This header is for internal auth only.
3. **PRIVATE_API Fallback**: The `fallbackGenerate` function must include `callPrivateModel` as the last candidate, matching the `PRIVATE_API` env binding and `/v1/models` advertisement.
4. **Cache Key Privacy**: Semantic cache keys must hash message content (SHA-256), not embed raw prompts. Raw prompts in cache keys leak user data.

See `references/esggo-worker-bugs.md` for detailed bug descriptions and fixes.

## Deploy layout

Two levels:
- **VPS Edge Gateway**: `omniagent-gateway` Docker container running Express + WebSocket + Telegram bot (existing `apps/gateway/omni-server.mjs`).
- **Cloudflare Edge Gateway**: OmniGateway Worker providing global edge auth, crawl control, cache, and fallback across providers.

## Worker Code Review Checklist

When reviewing or modifying `worker/src/index.ts`, check for these known issues:

1. **Exposed API Keys**: Authorization headers must use `Bearer ${key}` format, NOT `*** ${key}` template literals that leak keys in source.
2. **cf-aig-metadata Header**: Do NOT include API keys in `x-omni-token` header on upstream requests. This header is for internal auth only.
3. **PRIVATE_API Fallback**: The `fallbackGenerate` function must include `callPrivateModel` as the last candidate, matching the `PRIVATE_API` env binding and `/v1/models` advertisement.
4. **Cache Key Privacy**: Semantic cache keys must hash message content (SHA-256), not embed raw prompts. Raw prompts in cache keys leak user data.

See `references/esggo-worker-bugs.md` for detailed bug descriptions and fixes.

## Deploy layout

Two levels:
- **VPS Edge Gateway**: `omniagent-gateway` Docker container running Express + WebSocket + Telegram bot (existing `apps/gateway/omni-server.mjs`).
- **Cloudflare Edge Gateway**: OmniGateway Worker providing global edge auth, crawl control, cache, and fallback across providers.

## Worker Code Review Checklist

When reviewing or modifying `worker/src/index.ts`, check for these known issues:

1. **Exposed API Keys**: Authorization headers must use `Bearer ${key}` format, NOT `*** ${key}` template literals that leak keys in source.
2. **cf-aig-metadata Header**: Do NOT include API keys in `x-omni-token` header on upstream requests. This header is for internal auth only.
3. **PRIVATE_API Fallback**: The `fallbackGenerate` function must include `callPrivateModel` as the last candidate, matching the `PRIVATE_API` env binding and `/v1/models` advertisement.
4. **Cache Key Privacy**: Semantic cache keys must hash message content (SHA-256), not embed raw prompts. Raw prompts in cache keys leak user data.

See `references/esggo-worker-bugs.md` for detailed bug descriptions and fixes.

## Worker contract

### Env bindings

| Binding | Purpose |
|---|---|
| `OMNI_GATEWAY_KEY` | Bearer token for protected routes |
| `OPENROUTER_API_KEY` | Upstream provider |
| `GROQ_API_KEY` | Upstream provider |
| `GEMINI_API_KEY` | Upstream provider |
| `OMNI_KV` | Semantic cache namespace |
| `PRIVATE_API` | VPC service binding to private model |
| `AI_CRAWL_CONTROL` | `strict` \| `moderate` \| `off` |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Alert transport |
| `DISCORD_ALERT_WEBHOOK_ID` / `DISCORD_ALERT_WEBHOOK_TOKEN` | Alert transport |

### Routes

- `GET /status`, `/health`
- `GET /v1/models`
- `POST /v1/chat/completions`

### Response shape

Success:
```json
{ "data": <provider response> }
```

Cached:
```json
{ "cached": true, "data": <cached response> }
```

Error:
```json
{ "error": "all_fallback_providers_failed" }
```

## AI Crawl Control

Reject unauthorized AI crawlers before protected routes.

- Deny dangerous suffixes immediately in `strict` mode.
- Block known AI bot UA prefixes: `gptbot`, `chatgpt`, `oai-search`, `perplexitybot`, `claudebot`, `googlebot`, `bingbot`, `baiduspider`, `yandexbot`, `headless`, `puppeteer`, `playwright`, `selenium`.
- In `moderate` mode, allow but rate-limit by `clientIp + path` using KV.
- Always allow signed bearers (`Authorization: Bearer` or `x-omni-token` matching `OMNI_GATEWAY_KEY`).

## Semantic cache

Use KV with short TTL (default `1800s`). Cache key is the stabilized request identifier; do not cache errors. If KV is unavailable, the route still functions without cache.

## Fallback routing

Run providers sequentially until one succeeds:

1. OpenRouter (with `cf-aig-metadata`)
2. Groq
3. Gemini
4. PRIVATE_API

If all fail, return `502` with explicit error body.

## Audit sink

Every request streams an audit record to the origin with:
- `ts`, `method`, `path`, `clientIp`, `userAgent`, `requestId`, response `status`

Use `ctx.waitUntil( fetch().catch(()=>{}) )` so audit failures never break the user-facing response.

## Alert transport

Optional transport for spend-cap and rate-limit events:

1. Telegram Bot API
2. Discord webhook
3. syslog fallback

## Workers VPC pattern

For private model access:

1. Cloudflare Tunnel → registers private target.
2. Create VPC Service binding pointing to that target.
3. Bind as `PRIVATE_API` env in `wrangler.toml`.
4. Inside Worker: `await env.PRIVATE_API.fetch(new Request("http://internal-api/...", { method, headers, body }))`.

## Deploy

### Bootstrap Worker TS project
- Create `worker/src/index.ts` and `worker/tsconfig.json`.
- Set `"moduleResolution": "bundler"`, `"isolatedModules": true`, `"noEmit": true`.
- If `@cloudflare/workers-types` is unavailable, use ambient module declarations for `cloudflare:workers` and declare type aliases for `KVNamespace`, `Fetcher`, and `ExecutionContext`. Do not block deployment on missing type packages.

### VPS-side gateway container runtime
For the Express/WebSocket gateway container on Docker:
- Default bind address may be `127.0.0.1`; when the container's published-port healthcheck fails from the host while internal curl succeeds, start the container with `-e GATEWAY_BIND_ADDR=0.0.0.0`.
- Alpine Node images need `wget`/`curl` installed before any `HEALTHCHECK` that calls `wget`; add `RUN apk add --no-cache wget curl` to `Dockerfile`.
- Some prebuilt images appear to ignore `--env-file` at runtime even though alpine baselines accept it; if `docker inspect` shows empty `.Config.Env` after `--env-file`, pass secrets as explicit `-e KEY=$(awk -F= '/^KEY=/{print $2}' file) ...` arguments or bake via entrypoint.
- Verify order: container `Up` → internal `curl` to `/status` → host `curl` to `127.0.0.1:<published-port>/status`.
- Set `"moduleResolution": "bundler"`, `"isolatedModules": true`, `"noEmit": true`.

### Wrangler config
```toml
name = "<worker-name>"
main = "worker/src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"
```

### Secrets via wrangler
```bash
wrangler secret put OMNI_GATEWAY_KEY
wrangler secret put OPENROUTER_API_KEY
wrangler secret put GROQ_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put AI_CRAWL_CONTROL
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
wrangler secret put DISCORD_ALERT_WEBHOOK_ID
wrangler secret put DISCORD_ALERT_WEBHOOK_TOKEN
```

### Deploy
```bash
pnpm exec wrangler deploy --config wrangler.toml
```

## Observability

- Origin audit sink: `POST /api/audit` every request.
- Worker `requestId` propagated via `x-request-id` / `cf-aig-metadata`.
- Optional KV-based metrics: `metrics:{provider}:{hour}` counters.

## Auth contract for services

Internal services call:
```
Authorization: Bearer <OMNI_GATEWAY_KEY>
```

or:

```
x-omni-token: <OMNI_GATEWAY_KEY>
```

Public docs endpoint (`/status`, `/v1/models`) is unauthenticated.

## OA-TWINS bridge: server-side calls to OmniGateway from a container

When a Docker-hosted service (e.g. DeerFlow gateway) needs to push/pull to
OmniGateway (`https://gateway.esggo.co`, Cloudflare-fronted), **do NOT use
Python `httpx`/`urllib` from inside the container** — Cloudflare WAF returns
**HTTP 403** to the default Python TLS fingerprint even though `curl` from the
same container gets 200. Verified 2026-08: `docker exec <c> python3 -c
"urllib.request.urlopen('https://gateway.esggo.co/health')"` → 403; `docker
exec <c> curl -s https://gateway.esggo.co/health` → 200.

**Fix:** shell out to `curl` via `subprocess` (or `run_in_executor`) instead of
an HTTP client library. Pattern that worked in `app/gateway/oab_sync.py`:
```python
import subprocess, json
def oab_put(key, value):
    payload = json.dumps({"key": key, "value": value}).encode()
    r = subprocess.run(
        ["curl", "-s", "-m", "15", "-X", "PUT",
         f"https://gateway.esggo.co/sync/{key}",
         "-H", "Content-Type: application/json",
         "--data-binary", "@-"],
        input=payload, capture_output=True, text=True)
    return '"ok":true' in r.stdout
```
The bridge wraps this in `asyncio.get_running_loop().run_in_executor(None, oab_put, ...)`
from a FastAPI endpoint (not `asyncio.create_task` on a sync fn — that raises
"a coroutine was expected"). OAB key namespace `deerflow:{user_id}:*` preserves
per-user isolation (aligned with AI-native Memory single-user-LPM principle).
DNS resolves fine inside the container (`socket.gethostbyname` → Cloudflare edge
IP); only the TLS fingerprint is the problem, and curl sidesteps it.
