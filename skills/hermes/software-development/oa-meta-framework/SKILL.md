---
name: oa-meta-framework
description: >-
  esggo oa-framework: 9 agent frameworks (7 verified + 2 UNVERIFIED scaffolds) + 5T gate.
triggers:
  - OA 框架
  - oa-framework
  - 萬能分身
  - OmniAgent
  - 整合 ADK / Genkit / Agent0 / CrewAI / Agent Reach / DeerFlow / 騰訊 agent 記憶
  - 5T 閘門
  - packages/oa-framework
---

# OA Meta-Framework (packages/oa-framework)

Class-level playbook for the OA (OmniAgent) TypeScript meta-framework in the esggo
monorepo at `packages/oa-framework`. It is the integration layer that unifies 9 agent
sub-frameworks (7 verified + 2 UNVERIFIED scaffolds) behind one orchestrator + one 5T
verification gate, aligned with the `soul.md` 5T protocol and `@esggo/omni-agent` gates.ts.

## When to use
- User pastes a framework README/doc and wants it integrated into OA.
- Extending `packages/oa-framework` with a new adapter or changing the 5T gate.
- Verifying the package compiles and the 7-framework smoke passes.
- Autonomous mode ("最佳實踐" / "永恆覺醒" / "無作妙德圓通無礙") — build for real,
  no scaffolds left as final state.

## Architecture (verified)
```
packages/oa-framework/
  src/core/
    types.ts        # IComponentCore, ISubFrameAdapter, OAFrameConfig, OATask, OATaskResult, SubFrameId
    t5.ts           # forgeT5 (wraps output in 5T report) + verify5T (double-gate)
    omni-gate.ts    # aligns @esggo/omni-agent/src/gates.ts (verifyAllGates, GATE_*, createAgentHash)
    orchestrator.ts # OAOrchestrator.run -> Promise.all(dispatch) -> forgeT5
    memory.ts       # TencentDB MemoryAsset kinds (chat_memory/skill/wiki/codegraph)
  src/adapters/     # adk, genkit, agent0, crewai, agentreach, deerflow, tencent-mem, openmontage, omniroute
  src/index.ts      # createOAFrame() registers all 9 adapters
  test/smoke.ts     # 9-framework parallel dispatch + 5T verify
```
Sub-framework IDs: `'adk' | 'genkit' | 'agent0' | 'crewai' | 'agentreach' | 'deerflow' | 'tencent-mem' | 'openmontage' | 'omniroute'`.
- `openmontage` (UNVERIFIED: user-pasted repo `RayCodes/RayCodes_OpenMontage` returned 404) — local AI video (Ollama+FFmpeg+HyperFrames); scaffold + graceful.
- `omniroute` (UNVERIFIED: repo `diegosouzapw/OmniRoute` unreachable this session — browser timeout + web_extract quota exhausted) — AI gateway 237+ providers at localhost:20128/v1; scaffold + graceful.

## Adapter contract (the rule)
Every sub-framework implements `ISubFrameAdapter`:
```ts
interface ISubFrameAdapter {
  readonly id: SubFrameId;
  readonly label: string;
  readonly runtime: 'ts' | 'python' | 'docker';
  bootstrap(cfg): Promise<{ok; endpoint?; error?}>;
  dispatch(task: OATask): Promise<{output: string}>;  // raw output ONLY; orchestrator wraps in 5T
  health(): Promise<{status:'ok'|'down'; detail?}>;
}
```
The orchestrator calls `dispatch` (returns only `{output}`) then `forgeT5` wraps it.
Never return a fully-formed `OATaskResult` from an adapter — let the orchestrator own 5T.

## Graceful-degradation rule (MUST — real integration, not stub)
- Optional peer deps (SDKs) → `await import('@google/adk')` dynamic import inside try/catch.
  On failure `health()` returns `down` and `dispatch` returns a `(scaffold: ...)` tagged string.
- For modules tsc flags under Bundler resolution (e.g. `@genkit-ai/google-genai`), use the
  **variable-form** `await import(modName as string)` so tsc does NOT statically resolve it.
  Do NOT add `// @ts-expect-error` — if tsc doesn't flag, the directive itself errors as "unused" (TS2578).
- Upstream CLIs (agent-reach, yt-dlp, gh, opencli, bili, twitter, mcporter) → `execFile` via
  `promisify(execFile)` with `{timeout, encoding:'utf8'}`. Coerce stdout with `String(...)` —
  promisified `child_process` returns `string | Buffer` (Node 20+ NonSharedBuffer) and `.trim()`
  on it is a tsc TS2339 error.
- Bash-joined commands (curl pipes, `mcporter call`) → run via `execFile('bash', ['-lc', cmd])`.

## 5T double-gate (the "無礙" gate)
`verify5T(result)` is TWO layers:
1. **Field-level**: `t5` 5 booleans + Hash Lock recompute (SHA-256, frozen).
2. **Content-level**: `omni-gate.verifyAllGates(output, createAgentHash(...))` — mirrors
   `omni-agent/gates.ts` length minimums (traceable 100 / transparent 150 / tangible 200 /
   trustworthy 120 / trackable 80) + quality regexes (GRI|ISO for traceable, % for transparent,
   完成|建立 for tangible, hash|audit for trustworthy, 202[5-9]|monitor for trackable).
`forgeT5` wraps the raw `output` in a 5T quality report (來源/揭露/量化/封印/追蹤 lines) so
scaffold-short strings FAIL the content gate instead of slipping through. Pass bar: smoke shows
`field=PASS CONTENT_OK` for all 9.

`omni-gate.ts` is a STANDALONE copy of gates.ts logic (not a workspace import) — `@esggo/omni-agent`
ships no `dist`, and importing it re-triggers the pnpm workspace gate. Keep the copy in sync
if gates.ts logic changes.

## Verification (real, local)
`pnpm run typecheck` / `pnpm run test` are BLOCKED by pnpm 11.5.2 `runDepsStatusCheck` (it fails on
other unbuilt workspace packages, unrelated to oa-framework). Verify directly:
```bash
cd packages/oa-framework
npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck   # expect TSC_EXIT=0
npx --no-install tsx test/smoke.ts                              # expect ALL_FRAMEWORKS_OK (9)
```
Do NOT report "verified" on `pnpm run test` alone — it exits 1 for env reasons, not code errors.

## Real integration specs (condensed)
See `references/adapter-patterns.md` for exact SDK calls / CLI commands per framework
(extracted from official docs). `references/verification.md` has the full command set.
`templates/adapter.ts.txt` is a starter adapter to copy.

## Pitfalls
- `package.json` must NOT declare `@esggo/shared` / `@esggo/errors` as deps unless imported AND
  built — they trigger the pnpm deps-status gate. oa-framework imports neither (confirmed).
- `execFileP` stdout `.trim()` → TS2339 (Buffer). Use `String(stdout)`.
- `@ts-expect-error` on a dynamic import tsc doesn't flag → TS2578 unused-directive error.
- Don't leave `// TODO: spec pending` as final state when the user has since provided the spec —
  wire the real commands (see Agent Reach history in conversation).

## UNVERIFIED-scaffold pattern (user-pasted unverifiable repos)
Users paste framework READMEs from YouTube/trendshift. Before trusting, VERIFY the repo
exists: `browser_navigate` the GitHub URL, or `web_extract` the raw README. If GitHub
returns 404 / browser times out / web tools are quota-exhausted → mark the adapter
`UNVERIFIED` in a header comment + `dispatch()` returns a `(scaffold: …)` tagged string
with the real commands PRE-BURIED (so a future session upgrades in one edit). NEVER fabricate
a successful real call. `health()` returns `down` with `UNVERIFIED repo` detail. When the
user later supplies a valid URL, upgrade to real integration (like Agent Reach, whose
`agent-reach` CLI was verified and wired for real). OpenMontage (404) and OmniRoute
(unreachable) are the two current UNVERIFIED scaffolds.

## Real-framework execution notes
- **CrewAI** is VERIFIED (`crewAIInc/crewAI`, MIT, PyPI `crewai`). Real execution needs
  `uv python install 3.13.14` (base Python 3.14.6 is INCOMPATIBLE — CrewAI requires
  <3.14). Build a venv: `uv venv --python 3.13.14 .venv-crewai`, then
  `.venv-crewai/Scripts/python.exe -m pip install 'crewai'`. `Crew.kickoff()` needs an
  LLM key (OPENAI_API_KEY etc.) — without one only import + Agent/Task/Crew object
  construction is verifiable (see `verify_crewai.py`). Don't claim multi-agent output ran.
- **stale-verification discipline**: after editing `oa-framework` (consumed by
  `omni-agent-bus` via `import('@esggo/oa-framework')`), ALSO run `omni-agent-bus`'s
  `pnpm run test` (or `npx --no-install tsx test/oa-bridge.smoke.ts`) — a green oa-framework
  check alone is STALE if the consumer now fails to resolve/import it.

## Overlap note
Related but distinct: `oa-components` (OA UI component stack) and `esggo-oa-team-swarm` /
`oa-team-swarm-ultra` (CrewAI 30-agent swarm). This skill covers the TS orchestration layer.
The background curator may consolidate if overlap grows.
