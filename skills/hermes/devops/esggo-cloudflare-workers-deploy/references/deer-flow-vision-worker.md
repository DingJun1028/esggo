# Deer Flow Vision Worker — Cloudflare Worker + Qwen3-VL Integration

## Overview

Deer Flow vision worker deploys a Cloudflare Worker that serves as the edge endpoint for Qwen3-VL image analysis, integrated with the OA-Team 30 swarm via OAB EventBus.

## Architecture

```
Client → POST /api/v1/vision → Cloudflare Worker → Ollama/Qwen3-VL → JSON response
```

## Setup

### 1. Ollama + Qwen3-VL on VPS (Ubuntu — NOT Windows)

> The VPS runs Ubuntu 24.04 aarch64. `winget` is Windows-only and does NOT exist on
> the VPS. Use the Linux install path below.

```bash
# Install Ollama (Linux) — NOT `winget install Ollama.Ollama`
curl -fsSL https://ollama.com/install.sh | sh

# Start service as a systemd unit (do NOT run `ollama serve` bare — it blocks the SSH session)
sudo systemctl enable --now ollama

# Pull vision model
ollama pull qwen3-vl:2b
```

> Edge-worker reachability: a Cloudflare Worker cannot reach the VPS's
> `localhost:11434`. Point `QWEN3_VL_API_URL` at the VPS's reachable address
> (public IP `http://161.118.248.180:11434` behind firewall/tunnel, or a secure tunnel).

### 2. Worker Configuration

- `wrangler.toml`: name `deer-flow-vision`, main `src/index.ts`
- `src/index.ts`: POST `/api/vision` endpoint, GET `/health`
- `src/utils/vision.ts`: Qwen3-VL integration via Ollama API
- `src/utils/oab.ts`: OAB EventBus integration with 5T tags
- `src/types/index.ts`: TypeScript interfaces

### 3. Deployment

```bash
cd /opt/esggo/deer-flow
npm install
npx wrangler deploy
```

### 4. Secrets

| Secret | Purpose |
|---|---|
| `QWEN3_VL_API_URL` | Ollama API endpoint — VPS reachable address, e.g. `http://161.118.248.180:11434` (NOT `localhost:11434`; the Worker runs on Cloudflare's edge) |
| `QWEN3_VL_API_KEY` | API key for Qwen3-VL (if auth enabled) |
| `OAB_EVENTBUS_URL` | OAB EventBus endpoint for swarm integration |

## Key Patterns

- Vision endpoint accepts `image_url` or `base64` image data
- Returns structured JSON: `{description, tags, confidence}`
- OAB EventBus integration for OA-Team 30 swarm communication
- 5T tags on all events for traceability
- Error isolation with circuit breakers
- L1/L2/L3 data grading for vision results