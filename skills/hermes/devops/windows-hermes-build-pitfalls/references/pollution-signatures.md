# Pollution Signatures — exact error strings

These strings mean you are hitting Trap 1 (Hermes PYTHONPATH pollution) or Trap 2 (pnpm workspace hijack). Do NOT try to "fix the package" — clear the env var / use --ignore-workspace.

## Python — Hermes PYTHONPATH pollution
- `import regex` → `AttributeError: partially initialized module 'regex' ...`
- `pip install X` → `Found existing installation: huggingface_hub 1.27.0 ... outside environment C:\tmp\s2s_venv2`  (the path after "outside environment" is Hermes' venv, proving the env var leak)
- `sys.path[1]` contains `C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Lib\site-packages` even in a fresh uv venv
- `speech-to-speech.exe --help` dies with `regex ... partially initialized` right after launch

**Fix:** prefix every invocation with `env PYTHONPATH=""` (git-bash/MSYS) or `PYTHONPATH=` (cmd). For uv venvs, `uv venv` alone is NOT enough — the env var still leaks.

## Node — pnpm workspace hijack
- `pnpm install` in a sub-dir prints `.. postinstall: prisma generate` / `.. prepare$ node scripts/setup-hooks.mjs` (these are the ROOT monorepo's lifecycle scripts)
- `pnpm run build` re-runs `pnpm install` and fails on `--frozen-lockfile` (no lockfile in sub-dir) or on `tesseract.js` ignored-builds
- `wrangler deploy` always fails the `[build] command` with `X [ERROR] Running custom build ... failed`

**Fix:** `pnpm install --ignore-workspace`; call `./node_modules/.bin/tsc` directly, never `pnpm run build`.

## Node — ESM missing .js
- `node dist/index.js` → `Error [ERR_MODULE_NOT_FOUND]: Cannot find module './swarm-core' imported from .../dist/index.js`
- Compiled `import { X } from './swarm-core'` (no `.js`) under `moduleResolution: Bundler`

**Fix:** switch to NodeNext + add `.js` to all relative imports (see body Trap 3 one-shot node script).

## wrangler on Windows
- `[build] command = "cd my-worker && ./node_modules/.bin/tsc ..."` → execa error `'my-worker' is not recognized ...` (cd is a shell builtin, execa can't run it)
- `[build] command = "npx --yes pnpm install --frozen-lockfile && pnpm run build"` → runs monorepo postinstall, fails
- `[build] command = "./node_modules/.bin/tsc ..."` → execa can't exec the `.bin/tsc` shell script on Windows

**Fix:** `node my-worker/node_modules/typescript/bin/tsc -p my-worker/tsconfig.json` (full relative path, JS entry, no cd).
