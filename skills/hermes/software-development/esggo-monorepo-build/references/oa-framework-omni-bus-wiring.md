# Reference: Wiring @esggo/oa-framework into a consumer package

Concrete recipe from the OA-framework / OmniAgentBus integration (session 2026-08-07).

## Packages involved
- `packages/oa-framework` — meta-framework, 8 subframe adapters (adk, genkit, agent0, crewai,
  agentreach, deerflow, tencent-mem, openmontage). Entry: `createOAFrame(config)` → `oa.run(task)`.
- `packages/omni-agent-bus` — event backbone + 5T deploy-gate. Wants to import oa-framework.

## Steps that worked (end-to-end)
1. `packages/oa-framework/tsconfig.json`: standalone (NOT extends root), `module/moduleResolution: NodeNext`,
   `noEmit: false`. Root tsconfig has `noEmit:true` and a narrow `include` that excludes the package src.
2. Build: `cd packages/oa-framework && rm -rf dist && npx --no-install tsc -p tsconfig.json`
   → verify `dist/index.js` imports show `./core/orchestrator.js` (with `.js`).
3. `packages/omni-agent-bus/package.json`: add `"dependencies": { "@esggo/oa-framework": "workspace:*" }`.
4. `pnpm install --frozen-lockfile=false` → creates symlink
   `packages/omni-agent-bus/node_modules/@esggo/oa-framework` → `packages/oa-framework`.
5. In `omni-agent-bus/src/oa-bridge.ts`:
   ```ts
   const pkg = '@esggo/oa-framework';
   const mod = await import(pkg as string);   // variable form → no TS2307
   const oa = mod as { createOAFrame: (c?: any) => { run: (t: any) => Promise<any[]> } };
   ```
   Wrap in try/catch; return `{ available: false, reason }` on failure (graceful, no fabrication).
6. Verify: `cd packages/omni-agent-bus && npx --no-install tsx test/oa-bridge.smoke.ts`
   → prints `oa-framework 載入: AVAILABLE` and `OA_PIPELINE_OK (N 個子框架全過閘部署)`.

## Gotchas hit this session
- `oa-framework` tsconfig originally `extends ../../tsconfig.json` → `tsc` exited 0 but produced
  only `dist/core/types.js` + `dist/index.js`; `orchestrator.js`/`t5.js` missing → consumer import
  threw `ERR_MODULE_NOT_FOUND: .../dist/core/orchestrator.js`. Fixed by standalone tsconfig.
- `moduleResolution: Bundler` emitted imports WITHOUT `.js` → Node ESM failed to resolve even after
  dist existed. Switched to `NodeNext`.
- `routeTo` in OATask lets smoke tests skip network-touching adapters (agentreach/adk/agent0) to
  avoid 80s hangs; use `routeTo:['crewai','genkit','deerflow','tencent-mem','openmontage']` for fast CI.
- `pnpm run test` at the OAB package level passed once symlinks existed; the workspace gate only
  blocked when oa-framework dist was absent or tsconfig was broken.
