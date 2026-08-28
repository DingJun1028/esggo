---
name: esggo-omni-blueprint-hub
description: Omni-Blueprint Hub 5T plugin dev (apps/omni-blueprint-hub).
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
metadata:
  hermes:
    tags: [esggo, omni-blueprint-hub, hub-plugin, 5T, typescript, plugin-system]
    related_skills: [esggo-oa-framework, esggo-omni-blueprint-monitor, esggo-vps-sync-troubleshooting]
---

# ESG-GO Omni-Blueprint Hub — Plugin System Dev

Extend `apps/omni-blueprint-hub` (the self-hosted live multi-lingual translation
broadcast hub at `live.esggo.co`). This app is DISTINCT from the `packages/`
OA framework — it is a standalone Node app, NOT a pnpm workspace package, so the
`esggo-oa-framework` pnpm-gate recipes do NOT apply here. Use this skill for Hub
source work; use `esggo-omni-blueprint-monitor` for runtime monitoring of the
deployed hub.

## When to use
- Adding a new Hub plugin (a class implementing `HubPlugin`)
- Editing `hub-engine.ts` (the `OmniBlueprintHub` core engine)
- Editing `core-types.ts` (`IComponentCore` / `Blueprint*`)
- Running `npm run test:plugins` or `hub-demo.ts` plugin section
- Wiring `monitor-server.mjs` broadcast events to plugin hooks

## Architecture (v0.6 core + v0.7 plugin system)
```
apps/omni-blueprint-hub/
  hub-engine.ts        OmniBlueprintHub: createBlueprint → manifestToProduct → pushBroadcastPayload (5T hashLock + single table)
  core-types.ts        IComponentCore (uuid/version/timestamp/evidence[]/hashLock?) + Blueprint*/UnifiedBlueprintEntity
  plugin-types.ts      PluginManifest / HubPlugin / PluginContext / HubHook  (NEW in v0.7)
  plugin-registry.ts   PluginRegistry: register/enable/disable/unload + 5T Gate + emit(hook)  (NEW)
  plugins/             entropy-reducer.ts · conduit-bridge.ts · soul-canon-verifier.ts  (demo plugins)
  hub-demo.ts          execution demo — has a plugin-system demo section at the tail
  monitor-server.mjs   SSE broadcast hub; `broadcast(src, event)` is the natural hook sink
  test-plugins.ts      regression: 7 assertions (5T Gate + lifecycle + 3 demos)
  package.json         scripts: test:plugins
```

### HubPlugin contract (plugin-types.ts)
```ts
interface HubPlugin {
  manifest: PluginManifest;            // extends IComponentCore + pluginId/name/version/hooks[]/fiveT{}
  enable(ctx: PluginContext): boolean | Promise<boolean>;
  disable(): boolean | Promise<boolean>;
  onHook?(hook: HubHook, payload: unknown, ctx: PluginContext): void | Promise<void>;
  health?(): { ok: boolean; detail: string };
}
```
`PluginContext` gives the plugin `hub`, `broadcast(src,event)`, `log(level,msg)`,
`getUnifiedTable()`. `HubHook` ∈ {onBlueprintCreated, onProductManifested,
onBroadcastPushed, onTranslation, onCaption, onSnapshot, onHealthCheck}.

### 5T Gate (PluginRegistry.passes5TGate)
A manifest MUST declare all 5 `fiveT` true AND a non-empty `hooks[]`, else:
- **strict mode** (`new PluginRegistry({strict:true})`): `register()` returns `false` (結界阻斷)
- **loose mode** (Hub default, `strict:false`): still registers but marks

### Lifecycle
`registered → enabled → disabled → unloaded`. `enable()` failure sets `errored`
and does NOT throw (無作). `emit()` skips errored/filtered hooks and isolates
per-plugin errors (單外掛錯不中斷整體 — 無礙).

## Steps to add a new plugin
1. Create `plugins/<name>.ts` implementing `HubPlugin`. Use `crypto.randomUUID()`
   for `manifest.uuid` (import `crypto` — see Pitfalls). Declare `ownedBy` = the
   30-swarm agent number (e.g. `'06'`).
2. `hub-engine.ts` already emits hooks at the 3 lifecycle points; `bindPluginContext`
   lets `monitor-server.mjs` inject real `broadcast`/`log`. No engine change needed
   unless you add a NEW hook type (then add to `HubHook` union + emit at the site).
3. Register + enable from `hub-demo.ts` or a bootstrap, then `npm run test:plugins`.

## Pitfalls (hit this session — read before debugging)
- **Node strip-types CANNOT run `.ts` that imports `.js` siblings with no emitted
  `.js`.** `node --experimental-strip-types test-plugins.mjs` dies with
  `ERR_MODULE_NOT_FOUND: hub-engine.js`. The app has no build step emitting `.js`.
  **Working recipe: compile to a temp dir then run the compiled JS:**
  ```bash
  npx tsc --module nodenext --target es2022 --skipLibCheck --outDir .compiled \
    hub-engine.ts plugin-registry.ts plugin-types.ts hub-demo.ts \
    plugins/entropy-reducer.ts plugins/conduit-bridge.ts plugins/soul-canon-verifier.ts test-plugins.ts \
    && node .compiled/test-plugins.js
  ```
  Add `.compiled/` to `.gitignore` (already done). This is the exact `test:plugins`
  script.
- **MSYS does NOT expand `plugins/*.ts` in the tsc CLI arg list** (exit TS6053
  "File 'plugins/*.ts' not found"). List every plugin file EXPLICITLY in the
  `package.json` script — globs are not shell-expanded under git-bash here.
- **`IComponentCore.evidence` type widening (pre-existing hub-engine break).** The
  original `core-types.ts` typed `evidence` as a single structured object
  `{originCause, processTrace, finalEffect}` — but `hub-engine.ts` populates it with
  `{event, source_origin, iso_standard}` style objects, so `hub-engine.ts` was NEVER
  tsc-clean. To make BOTH the engine's `event/source_origin` style AND plugins'
  `originCause/processTrace/finalEffect` style typecheck, widen to
  `evidence: Array<Record<string, any>>` and add `hashLock?: string` to
  `IComponentCore`. After ANY `core-types.ts` interface edit, re-run the strict
  `tsc` compile (above) — a `--noEmit --skipLibCheck` pass hides the break.
- **`read_file` misdetects Chinese `.ts` as BINARY.** Several Hub `.ts` files return
  "Binary file - cannot display as text" from `read_file`. Bypass with
  `terminal`: `python3 -c "print(open('hub-engine.ts',encoding='utf-8',errors='replace').read())"`
  or `cat -v file | sed 's/\^@//g'`. Do NOT trust the binary flag — the file is valid UTF-8 TS.
- **`search_files` + backslash `C:\` paths fail (os error 3) on this MSYS host** even
  for existing files. Use `terminal` + `grep -rnE 'pat' --include=*.ts path` with
  forward-slash paths. (Same artifact as the omni-agent-bus lint guard.)
- **Plugin `manifest` needs `import crypto from 'crypto'`** if you call
  `crypto.randomUUID()` in the constructor — a missing import compiles-fails with
  TS2304. The demo plugins all import it.
- **`PluginRegistry.enable/disable` reference `entry.plugin`, NOT `plugin`.** A bare
  `plugin.enable()` inside `enable(pluginId)` is a TS2552 ("Cannot find name
  'plugin'") — use `entry.plugin.enable(this.ctx)`.

## Verification (the working recipe)
```bash
cd apps/omni-blueprint-hub
npx tsc --noEmit --module nodenext --target es2022 --skipLibCheck \
  hub-engine.ts plugin-registry.ts plugin-types.ts hub-demo.ts \
  plugins/entropy-reducer.ts plugins/conduit-bridge.ts plugins/soul-canon-verifier.ts test-plugins.ts
# expect: EXIT=0, no errors
npm run test:plugins
# expect: "=== Plugin 結果: 7 passed, 0 failed ===" + "✅ Hub Plugin System 全測試通過"
node .compiled/hub-demo.js   # confirms entropy-reducer converges to <0.1 on first broadcast
```
A green `test:plugins` (7/0) is the proof; do NOT require a full app e2e for a
plugin change.

## VPS deploy note (honest state, 2026-08-12)
`omni-blueprint-hub` is NOT a pm2-managed service on the VPS
(`161.118.248.180`): `pm2 status` shows NO `blueprint`/`hub`/`live` entry and port
8787 has no listener. So "sync to VPS" via `git pull` lands the source but does NOT
auto-restart a running hub. Before assuming `pm2 reload omni-blueprint-hub` works,
run `pm2 status` + `ss -ltnp | grep 8787` to confirm the service exists. If absent,
the hub is started ad-hoc (see `run.sh` / `deploy.sh` in the app dir), not via the
shared pm2 broker. This is operational state, not a code bug — verify before
claiming a deploy.
