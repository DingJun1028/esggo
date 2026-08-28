# OA Adapter Patterns — exact integration per sub-framework

Condensed from official docs (ADK/Genkit/Agent0/TencentDB READMEs, Agent-Reach SKILL.md).
Each adapter in `src/adapters/` follows `ISubFrameAdapter` (dispatch returns `{output}` only).

## adk — Google Agent Development Kit (TS)
- Install: `npm i @google/adk` (peer, optional)
- Real call: `const { LlmAgent } = await import('@google/adk'); const a = new LlmAgent({name, model, instruction, tools}); await a.run({prompt})`
- model default `gemini-2.5-flash`
- graceful: health `down` + `(scaffold: ...)` when not installed

## genkit — Google Genkit (Firebase)
- Install: `npm i genkit @genkit-ai/google-genai` (peer, optional)
- Real call: `const {genkit}=await import('genkit'); const {googleAI}=await import('@genkit-ai/google-genai' as string); const ai=genkit({plugins:[googleAI()]}); const {text}=await ai.generate({model:googleAI.model(m), prompt})`
- NOTE: `@genkit-ai/google-genai` must use the **variable-form** dynamic import or tsc flags TS2307.
- model default `gemini-2.5-flash`

## agent0 — Agent Zero (Docker)
- Run: `docker run -p 127.0.0.1:50001:80 agent0ai/agent-zero`
- Real call: `POST {endpoint}/api/chat` body `{message, stream:false}` → `response|text|message`
- health: `GET {endpoint}/api/health`
- graceful: `down` when docker not up

## crewai — CrewAI 30 swarm (Python/uv)
- Bridges to `packages/crewai-runtime` (load_crew, 30 agents / 5 tasks)
- Needs `CREWAI_API_KEY` or equivalent LLM key; warns if missing
- runtime `python`; see esggo-oa-team-swarm skill for the 30-agent JSON-first build

## agentreach — Panniantong/agent-reach (Python `pip install agent-reach`)
- It is a ROUTER + doctor, not a self-contained search CLI. Real execution delegates to upstream CLIs.
- `agent-reach doctor --json` → shows active_backend per platform
- Routing table (from `agent_reach/skill/SKILL.md`):
  - exa (web search): `mcporter call exa.web_search_exa query="..." numResults=5`
  - jina (web read): `curl -s "https://r.jina.ai/URL"`
  - github: `gh search repos "..." --sort stars --limit 10`
  - youtube: `yt-dlp --write-sub --write-auto-sub --skip-download -o "/tmp/%(id)s" "URL"`
  - bilibili: `bili search "..." --type video -n 5`
  - twitter: `twitter search "..." -n 10` (needs TWITTER_AUTH_TOKEN / TWITTER_CT0)
  - reddit: `opencli reddit search "..." -f yaml` | `rdt search "..." --limit 10`
  - xiaohongshu: `opencli xiaohongshu search "..." -f yaml`
  - facebook: `opencli facebook search "..." -f yaml` / `opencli facebook groups -f yaml`
  - instagram: `opencli instagram search "..." -f yaml` / `opencli instagram user USER -f yaml`
  - v2ex: `curl -s "https://www.v2ex.com/api/topics/hot.json" -H "User-Agent: agent-reach/1.0"`
  - linkedin / xiaoyuzhou / xueqiu / rss: see official references/*.md; exa fallback
- bash-joined commands run via `execFile('bash', ['-lc', cmd])`

## deerflow — research flow (Python FastAPI, esggo-deerflow)
- endpoint default `http://127.0.0.1:8000` (VPS known running)
- Real call: `POST {endpoint}/api/chat` or graph invoke
- supports Ollama local vision (Qwen3-VL verified)

## tencent-mem — TencentDB Agent Memory (Team Memory)
- Deploy: `git clone https://github.com/Tencent/TencentDB-Agent-Memory.git && cd deploy/global-images && cp .env.example .env && ./start-all.sh`
- Endpoints: core `:8420` / hub `:8125` / proxy `:8096`
- 4 asset kinds: `chat_memory`(L0-L3) / `skill` / `wiki` / `codegraph`
- Real APIs: `GET {core}/v3/tools/list`, `POST {core}/v3/tools/call`, `POST {hub}/api/assets`
- `saveAsset` + `callTool` implement Agent Loadout (bind assets per OA-Team agent)
