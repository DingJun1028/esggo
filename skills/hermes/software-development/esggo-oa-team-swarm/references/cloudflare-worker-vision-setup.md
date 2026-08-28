# Cloudflare Worker Vision Setup — deer-flow

## Architecture

Edge endpoint (`POST /api/v1/vision`) → calls Ollama API at `localhost:11434` → Qwen3-VL-2B-Instruct → returns structured JSON with description, tags, confidence.

## File Layout (`/opt/esggo/deer-flow/`)

| File | Purpose |
|------|---------|
| `wrangler.toml` | Cloudflare Workers config |
| `src/index.ts` | Main Worker entry with vision endpoint + health + OAB EventBus |
| `src/utils/vision.ts` | Qwen3-VL vision model integration via Ollama |
| `src/utils/health.ts` | GET `/health` endpoint |
| `src/utils/oab.ts` | OAB EventBus swarm integration with 5T tags |
| `src/types/index.ts` | TypeScript interfaces (VisionRequest, VisionResponse, OABEvent, WorkerEnv) |
| `package.json` | Dependencies (wrangler, typescript, @cloudflare/workers-types) |
| `README.md` | Setup and deployment instructions |

## Deployment

```bash
cd /opt/esggo/deer-flow
npm install
npx wrangler deploy
```

## Ollama + Qwen3-VL Setup

```bash
winget install Ollama.Ollama
ollama serve
ollama pull qwen3-vl:2b
```

## OAB EventBus Integration

Worker publishes events with 5T tags:
- `Traceable`: source_origin on all outputs
- `Trackable`: lifecycle hooks for data flow
- `Tangible`: structured JSON responses
- `Transparent`: zero-hallucination verification
- `Trustworthy`: Hash Lock on written data

Event types: `vision_request`, `vision_result`, `error`

## 5T Tags for Swarm Communication

All events carry 5T metadata for OA-Team 30 swarm routing via OmniTag.