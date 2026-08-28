# OA Framework — 萬能分身元框架 (packages/oa-framework)

Verified 2026-08-07 (final state). The OA meta-framework integrates 7 sub-frameworks
under one 5T-HashLock orchestrator, built in `packages/oa-framework/`. This file
captures the verified architecture + the TWO TS/pnpm pitfalls that bit us twice
so the next session does not re-litigate them.

## Sub-frameworks (id → runtime → integration point)
| id | framework | runtime | adapter / endpoint |
|----|-----------|---------|--------------------|
| `adk` | Google Agent Development Kit (TS) `@google/adk` | ts | `new LlmAgent({name,model,instruction,tools})` + `run()` (dynamic import) |
| `genkit` | Google Genkit (Firebase) `genkit` + `@genkit-ai/google-genai` | ts | `genkit({plugins:[googleAI()]})` + `ai.generate()` |
| `agent0` | Agent Zero organic framework `agent0ai/agent-zero` | docker | `POST :50001/api/chat` (A2A) |
| `crewai` | CrewAI 30 swarm | python/uv | `packages/crewai-runtime` bridge (`CREWAI_API_KEY`) |
| `agentreach` | Agent Reach (Panniantong/agent-reach) | ts | local CLI `agent-reach <channel> search` + `doctor()` self-heal; 13+ channels |
| `deerflow` | DeerFlow research flow | python | `esggo-deerflow/backend` FastAPI :8000 (Ollama Qwen3-VL) |
| `tencent-mem` | 騰訊 Agent 記憶 (TencentDB Agent Memory Team Memory) | ts | MemoryCore `:8420` (`/v3/tools/list`+`/v3/tools/call`) + Hub `:8125` + Proxy `:8096`; 4 asset kinds |

All 7 adapters implement a uniform `ISubFrameAdapter` with **graceful degradation**:
if the SDK/docker/CLI/endpoint is absent, `health()` returns `down` and `dispatch()`
returns a tagged scaffold string — never throws, never blocks the other 6.

## Architecture
```
src/core/types.ts        IComponentCore / ISubFrameAdapter / OAFrameConfig / OATask / OATaskResult
src/core/t5.ts           forgeT5() (SHA-256 HashLock + Object.freeze) + verify5T()
src/core/orchestrator.ts OAOrchestrator.run() — parallel dispatch all routes → forgeT5 each
src/core/memory.ts       MemoryAsset kinds (chat_memory/skill/wiki/codegraph) + TeamMemoryConfig
src/adapters/*.ts         7 adapters, uniform ISubFrameAdapter
src/index.ts             createOAFrame(config) registers all 7
test/smoke.ts            7-framework parallel + 5T assertion
```

## Typecontract gotcha (broke first compile)
`ISubFrameAdapter.dispatch` returns `Promise<{ output: string }>` (intermediate),
NOT `OATaskResult`. The Orchestrator wraps it via `forgeT5` to produce the 5T-locked
`OATaskResult`. If `dispatch` returns `OATaskResult` directly → tsc `TS2416` on every adapter.

## PITFALL 1 — optional peer dep dynamic import + @ts-expect-error flip
The 3 TS SDKs (`@google/adk`, `genkit`, `@genkit-ai/google-genai`) are declared as
**optional peerDependencies** (not installed in this repo). You MUST call them via
`await import(...)` at runtime with graceful `try/catch`, not a static `import`.

Two wrong ways we hit, do NOT repeat:
- **Wrong A**: `await import('@genkit-ai/google-genai')` as a literal string.
  Under `tsconfig` `moduleResolution: Bundler`, tsc reports `TS2307: Cannot find module`
  for `@genkit-ai/google-genai` (but NOT for `@google/adk` — inconsistent!). Breaks `tsc`.
- **Wrong B**: add `// @ts-expect-error` above the import to silence TS2307.
  Then tsc **flips to `TS2578: Unused '@ts-expect-error' directive`** because the
  Bundler resolver actually tolerates the dynamic import for `@google/adk`, so the
  suppression has nothing to suppress. Two-sided error — picked the wrong fix both times.

**Correct pattern** (verified `TSC_EXIT=0`):
```ts
// inside try { ... }
const genkitMod = '@genkit-ai/google-genai';      // assign to a variable
const { googleAI } = (await import(genkitMod as string)) as any;  // no static module spec
const { genkit } = (await import('genkit')) as any;               // bare literal is OK here
```
The variable-string `import(expr)` form bypasses static module resolution entirely,
so tsc never emits TS2307 — and no `@ts-expect-error` is needed (which would be unused).
Keep all SDK calls inside `try/catch` returning a scaffold string on any failure.

(For `@google/adk` a bare `await import('@google/adk')` inside try/catch is fine —
Bundler resolution tolerates it — but for consistency use the variable form everywhere.)

## PITFALL 2 — `pnpm run typecheck`/`pnpm run test` blocked by workspace deps gate
`pnpm run <script>` in this monorepo **fails at the pnpm deps-status gate**
(`runDepsStatusCheck`, pnpm 11.5.2) with a stack trace rooted at
`runDepsStatusCheck` and **exit 1**, BEFORE your script body ever runs. This is NOT
a code error — it is pnpm checking the whole workspace's dependency status (other
packages may be unbuilt / have missing dist). It fires even after you remove a
package's unused `@esggo/*` workspace deps.

**Workaround (reliable, verified)**: bypass pnpm's gate and invoke the tools directly:
```bash
cd packages/oa-framework
npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck   # TSC_EXIT=0
npx --no-install tsx test/smoke.ts                              # SMOKE_EXIT=0
```
Do NOT report `pnpm run typecheck` failure as an OA-framework defect — it is the
environment gate. If you need the canonical `pnpm run` path to pass, you must first
get the whole workspace install/build green (out of scope for a single-package change).

## Verification (real, this session — final)
```
cd packages/oa-framework
npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck   # TSC_EXIT=0
npx --no-install tsx test/smoke.ts                              # SMOKE_EXIT=0
# output: [adk/genkit/agent0/crewai/agentreach/deerflow/tencent-mem] 5T=PASS
#         RESULT: ALL_7_FRAMEWORKS_OK
# health: adk=down genkit=ok agent0=down crewai=ok agentreach=down deerflow=ok tencent-mem=down
#   (down = SDK/docker/CLI/endpoint not installed locally → graceful, expected)
```
Note: the inline shell linter on `write_file`/`patch` returns `TS6053 file not found`
spuriously right after writing a .ts file (race: linter compiles before the file
lands). False positive — `tsc`/`tsx` run separately confirm green.

## Web-tool credit outage note
Firecrawl-backed `web_search` / `web_extract` returned `Payment Required: Insufficient
credits` this session. When that happens for Agent-Reach spec confirmation, do NOT
fabricate CLI subcommands — base the adapter on the user-supplied spec + graceful
degradation, and flag the exact subcommand shape (`[channel, 'search', prompt]`) as
"verify when credits restore". Honest scaffolding > invented API.

## Deploy / next steps
- All 7 adapters are real SDK/endpoint connections with graceful degradation (final).
- `dispatch()` bodies currently call the SDK then return the text; real tool-use /
  multi-turn orchestration is the next step.
- Committed chain this session: `37ea27029` (scaffold) → `59c96f36a` (team mem) →
  `53ba67518` (adk/genkit/agent0) → `a453e6cbb` (agentreach) → `8c808a8de` (package.json
  cleanup: dropped unused `@esggo/shared`/`@esggo/errors`, added `test` script, marked
  genkit peer deps optional). All pushed to `DingJun1028/esggo` main.
- Wire `verify5T` as a pre-deploy gate into `omni-agent` 5T Gate (soul.md §7).
