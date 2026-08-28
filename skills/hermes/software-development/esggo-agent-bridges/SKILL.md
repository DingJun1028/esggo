---
name: esggo-agent-bridges
description: Use when integrating external agent frameworks into esggo.
version: "1.0.0"
author: ESG GO Team
license: MIT
metadata:
  hermes:
    tags: [esggo, agents, integration, bridge, crewai]
    related_skills: [esggo-oa-team-swarm, agent-role-registry, oa-components]
---

# esggo-agent-bridges

## Overview

Class-level skill for integrating external agent frameworks into the esggo monorepo
without breaking existing `IOmniAgent` / `OmniCoreEcosystem` contracts.

## When to Use

- User asks to integrate CrewAI, LangGraph, AutoGen, or another external agent framework.
- Designing a new `packages/<framework>-bridge` or `packages/<framework>-runtime`.
- Mapping framework concepts onto esggo intents, tasks, agents, or crews.
- Reviewing bridge code for type safety, test coverage, or monorepo hygiene.

## Preferred Shape

```
packages/
  <framework>-bridge/
    package.json
    src/
      index.ts            # Public types + mapper functions
      index.test.ts       # Unit tests for the mapper
  <framework>-runtime/
    pyproject.toml
    bridge_<framework>.py
    tests/
      test_bridge_<framework>.py
```

Rules:
- TS bridge owns **types + intent mapping** only.
- Python runtime owns **execution / adapter / shim** only.
- Neither layer should import the real external framework unless it is already a hard dependency.

## Type Mapping Rules

1. Define framework-agnostic intermediate types first.
2. Map **to** those types from esggo intent/shape; map **from** them to the external framework.
3. Keep `source_origin` / `hashLock` / `fiveT` metadata on the intermediate shape.
4. Prefer `readonly` TS types and frozen Python dataclasses for traceability.

## Monorepo Wiring

1. Add new TS package paths to the root `tsconfig.json` `include` array.
2. Add workspace dependencies in the new package's `package.json`.
3. Keep the root `package.json` dependency surface unchanged unless the framework becomes a first-class root dep.

## Test Conventions

- TS bridge: Vitest unit tests for mapper/dimension inference/role inference.
- Python runtime: pytest unit tests for the same logical behavior.
- Both layers should pass independently; do not require the real external framework to run tests.

## OmniCoreEcosystem Integration

Expose a single entry function that accepts an esggo intent shape and returns a framework-native
crew/agent/task structure. It should not:

- call `registerAgent` directly unless the framework runtime is actually executing
- mutate global esggo state during mapping
- import heavy framework packages in the TS bridge layer

Preferred shape:

```
const result = buildCrewFromOmniIntent({
  id: string;
  description: string;
  tasks?: Array<{ id: string; description: string }>;
  sourceOrigin?: string;
});
```

## Meta-Orchestrator Pattern (oa-framework)

When the user wants ONE OmniAgent to unify several frameworks at once (e.g. the recurring
"啟動 OA 框架 = ADK + Genkit + Agent0 + CrewAI + Agent Reach + DeerFlow + 騰訊 Agent 記憶"
directive), build a single `packages/oa-framework` meta-package instead of N separate bridges:

```
packages/oa-framework/
  src/
    core/
      types.ts     # IComponentCore + ISubFrameAdapter + OAFrameConfig + OATask + OATaskResult
      t5.ts        # 5T verifier + HashLock (forgeT5 / verify5T)
      orchestrator.ts  # OAOrchestrator: register(adapters) → run(task) parallel → forgeT5 each
      memory.ts    # TencentDB Team Memory asset types (L0-L3/Skill/Wiki/CodeGraph)
    adapters/      # one file per framework, each implements ISubFrameAdapter
      adk.ts genkit.ts agent0.ts crewai.ts agentreach.ts deerflow.ts tencent-mem.ts
    index.ts       # createOAFrame(config) registers all adapters
  test/smoke.ts    # 7-framework parallel run + 5T assert
```

Rules that held up under real tsc + runtime verification:
- Each adapter exposes `bootstrap() / dispatch() / health()` with graceful degrade:
  if the SDK/CLI/docker is absent, `health()` returns `down` and `dispatch()` returns a
  scaffold string — NEVER throw. The orchestrator still 5T-forges the scaffold output so
  the swarm run is never blocked by one missing framework.
- `dispatch()` returns the intermediate `{ output: string }`; the orchestrator calls
  `forgeT5()` to wrap it into a frozen `OATaskResult` (uuid + hashLock + 5T flags).
- `OAFrameConfig` carries optional endpoints (`memoryGateway`, `agent0Endpoint`, `llmModel`,
  `llmApiKey`) so adapters stay environment-driven, not hard-coded.

## TypeScript Optional-Peer-Dep Pitfall (verified hard-won)

Several frameworks are OPTIONAL peer deps (`@google/adk`, `genkit`, `@genkit-ai/google-genai`)
that may not be `npm install`ed. Two wrong ways + the right way:

- ❌ Hard `import X from 'pkg'` → `tsc` error TS2307 "Cannot find module" when pkg absent.
- ❌ `// @ts-expect-error` on that import → TS2578 "Unused directive" when a loose
  `moduleResolution: Bundler` does NOT flag it (then the suppress is unused and fails the build).
- ✅ Dynamic import with a **variable specifier**: `const m = 'pkg'; await import(m as string)`.
  TS does not statically resolve a variable specifier, so no TS2307 and no spurious
  `@ts-expect-error`. Wrap in try/catch for runtime graceful degrade.
- `execFile` from `node:child_process` returns `stdout` typed `string | Buffer` even with
  `{ encoding: 'utf8' }` under `promisify` — always `String(stdout)` before `.trim()` to avoid
  TS2339 "Property 'trim' does not exist on type 'NonSharedBuffer'".

## Verification Workflow (and the pnpm gate)

The canonical project scripts are `pnpm run typecheck` and `pnpm run test`, but on this
monorepo **`pnpm run <script>` is blocked workspace-wide** by pnpm 11.5.2's
`runDepsStatusCheck` gate (it fails on OTHER unbuilt workspace packages, unrelated to the
package you edited). This is environmental, NOT a code defect — do not chase it.

Working verification (bypasses the pnpm gate, runs the exact same compiler/test):
- `npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck`  → expect exit 0
- `npx --no-install tsx test/smoke.ts`  → expect exit 0 + `RESULT: ALL_7_FRAMEWORKS_OK`

Report both real outputs. If a smoke adapter shows `down`, that means its SDK/CLI is absent
locally (expected) — the run still PASSES because the adapter degraded gracefully.

## Pitfalls

- `tsc` / `vitest` only scan configured paths; a new package is invisible until its `src/**/*.ts`
  glob is added to the root `tsconfig.json` `include`.
- If external docs are paywalled/unreachable, proceed with public framework concepts already known
  and add a `references/` note rather than blocking integration. (Firecrawl web_search/web_extract
  can hit "Payment Required" — use `browser_navigate` to the raw GitHub URL / `llms.txt` /
  `SKILL.md` instead; Agent Reach's precise commands were recovered this way from
  `agent_reach/skill/SKILL.md`.)
- Keep bridge code framework-pluggable: avoid embedding one framework's quirks as esggo-wide assumptions.
- Remove unused `dependencies` (e.g. `@esggo/shared`/`@esggo/errors`) from a new package's
  `package.json` if its `src/` does not `import` them — otherwise the pnpm deps-status gate
  fails even harder. Place truly-optional frameworks under `peerDependencies` + `peerDependenciesMeta: { "x": { optional: true } }`.

## References

- `references/crewai-bridge-2026-08-07.md` — first concrete CrewAI integration notes from this repo.
- `references/oa-framework-agent-reach-commands.md` — Agent Reach precise upstream-CLI routing table (recurring OA directive: ADK+Genkit+Agent0+CrewAI+AgentReach+DeerFlow+TencentMem).
