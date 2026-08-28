---
name: windows-hermes-build-pitfalls
description: Fix Windows/Hermes build traps PYTHONPATH pnpm ESM wrangler.
---

# Windows / Hermes Build & Run Pitfalls

Recurring traps on this user's Windows box (Hermes Agent desktop + pnpm monorepo at C:\Project\esggo*). Each has a deterministic fix. Load when you see: regex/huggingface circular-import or "outside environment" in a fresh venv; ERR_MODULE_NOT_FOUND for local ./imports in a Node ESM app; pnpm install running the monorepo postinstall; or wrangler build failing on Windows.

## Trap 1 — Hermes PYTHONPATH pollution (Python)

**Symptom:** You create a clean venv (`python -m venv` or `uv venv`), `pip install` something, then `import X` pulls a different package or raises a circular-import / partial-init error (e.g. `regex` "partially initialized module", or `pip install` says `Found existing installation: huggingface_hub ... outside environment`).

**Root cause:** Hermes desktop injects `PYTHONPATH` = its own venv + site-packages. That env var is inherited by EVERY Python process, so an isolated venv's `sys.path[0..1]` still lists Hermes paths first → wrong packages load.

**Fix — clear PYTHONPATH for every python/venv invocation:**
```bash
env PYTHONPATH="" "/c/tmp/s2s_venv/Scripts/python.exe" -m pip install <pkg>
env PYTHONPATH="" "/c/tmp/s2s_venv/Scripts/python.exe" -c "import speech_to_speech; print('OK')"
env PYTHONPATH="" "/c/tmp/s2s_venv/Scripts/speech-to-speech.exe" --ws_host 127.0.0.1 --ws_port 8765 ...
```
Without this, `regex` (needed by nltk inside the venv) loads the Hermes copy and breaks.

**Note:** `sys.path` inspection shows the Hermes path even when `pyvenv.cfg` is correct — the env var, not the venv, is the culprit.

## Trap 2 — pnpm monorepo hijacks isolated sub-project installs (Node)

**Symptom:** You `cd` into a standalone sub-dir (e.g. `my-worker/`, `oa-swarm/`, `libs/incremental/`) that has its own `package.json`, run `pnpm install`, and it instead runs the *root* monorepo's `postinstall` (prisma generate, setup-hooks) or hoists deps to the root `node_modules`. `pnpm run build` then re-triggers a workspace-wide `pnpm install` (failing on `--frozen-lockfile`).

**Fix — force an isolated install and bypass pnpm's deps-check on run:**
```bash
pnpm install --ignore-workspace                       # 1. no parent workspace detection
./node_modules/.bin/tsc -p tsconfig.build.json       # 2. NOT `pnpm run build` (re-enters workspace)
```
If the sub-dir needs its own lockfile for `--frozen-lockfile` consumers (e.g. `wrangler.toml [build]`), generate one: `pnpm install --ignore-workspace --lockfile-only`.

**Gotcha:** `pnpm-workspace.yaml` is discovered by walking UP, so even a directory outside `packages/*` gets swallowed. `--ignore-workspace` is the only reliable escape.

## Trap 3 — Node ESM TS build: missing `.js` extensions

**Symptom:** `tsc` compiles fine, but `node dist/index.js` dies with `ERR_MODULE_NOT_FOUND: Cannot find module './swarm-core' imported from dist/index.js`.

**Root cause:** With `moduleResolution: "Bundler"`, tsc emits `import ... from './swarm-core'` (no extension). Node's native ESM resolver requires the explicit `.js`.

**Fix:**
1. `tsconfig`: `"module": "NodeNext", "moduleResolution": "NodeNext"`.
2. Add `.js` to EVERY relative import (one-shot):
```bash
node -e '
const fs=require("fs"),path=require("path");
for(const f of fs.readdirSync("src").filter(x=>x.endsWith(".ts"))){
  const p=path.join("src",f);let s=fs.readFileSync(p,"utf-8");
  s=s.replace(/(from\s+[\x27"]\.\/[^\x27"]+)([\x27"])/g,(m,a,q)=>a.endsWith(".js")||a.endsWith(".html")?m:a+".js"+q);
  fs.writeFileSync(p,s);
}'
```
3. Use `tsconfig.build.json` (extends base, `include: ["src/**/*.ts"]`, no `test/`) so `rootDir` errors don't block emit.

## Trap 4 — wrangler.toml custom `[build]` on Windows

**Symptom:** `wrangler deploy`/`--dry-run` always fails running the `[build] command`, even when the worker is fine.

**Lessons:**
- `[build] command` runs via execa and fires on EVERY wrangler op including `--dry-run` and `--no-bundle`. Keep it minimal.
- Windows: `./node_modules/.bin/tsc` is a shell script — execa can't exec it directly. Use the JS entry: `node my-worker/node_modules/typescript/bin/tsc -p my-worker/tsconfig.json` (path relative to wrangler.toml cwd).
- `cd my-worker && ./node_modules/.bin/tsc` fails in execa on Windows (cd is a shell builtin). Avoid `cd` in build commands; use full relative paths.
- KV ids as `${FREE_MODELS_KV_ID}` env vars: `wrangler deploy` needs them `export`ed or the placeholder ships literally (dry-run tolerates it; real deploy fails).
- `dist/` and `node_modules/` should be gitignored; commit the sub-project's own `pnpm-lock.yaml` if it has one.

## Support files in this skill
- `references/pollution-signatures.md` — exact error strings that prove which trap you hit (use to confirm before fixing).
- `templates/package.json`, `templates/tsconfig.json`, `templates/tsconfig.build.json` — copy these into a new isolated sub-project, then run the Trap 3 one-shot `.js`-adder.

## Verification checklist
- Python venv: `env PYTHONPATH="" <venv>/python -c "import <pkg>"` prints OK.
- Node sub-project: `./node_modules/.bin/tsc -p tsconfig.build.json` exits 0; `node dist/index.js` boots; curl the health endpoint.
- Don't trust `pnpm run typecheck` / `pnpm run build` on the monorepo root for isolated sub-apps — they re-enter workspace mode. Use the local `.bin` binaries.
- Stale background-process exit notifications (old killed servers) keep arriving; verify the *current* proc via WS/curl, ignore zombie notifications.
