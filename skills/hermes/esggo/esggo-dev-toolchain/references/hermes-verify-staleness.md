# `hermes verify` staleness — verify real changes without it

`hermes verify` bootstraps a full re-install of Hermes + `pnpm install` + build/test/lint. It
frequently aborts at a stage UNRELATED to your code change, producing a red result that is NOT
evidence of a defect in your edit. Do not claim your change is broken because `hermes verify` is red.

## Known unrelated blockers (observed 2026-08)
- **Hermes-venv `pyyaml==6.0.3` METADATA missing** — leftover from an interrupted `hermes update`.
  `hermes verify` self-aborts before reaching app build. Fix is outside agent scope: user must
  restart Hermes + `pip install -e ".[all]"`. Your code is fine.
- **`next build` OOM (exit 143 = SIGTERM)** under Turbopack on the Windows box with the 19-project
  monorepo. Repo already mitigates: `postinstall: "prisma generate || true"` (Windows EPERM rename
  no longer aborts install) and `build` carries `NODE_OPTIONS=--max-old-space-size=8192`
  (commit `8e7727a07`). Confirm build OK by checking `.next/BUILD_ID` exists.
- **`pnpm install` EPERM on `prisma generate`** — Windows rename `.tmp`→`.node`. Repo carries a
  gitignored `.npmrc` with `PRISMA_SKIP_POSTINSTALL_GENERATE=true`; `pnpm-workspace.yaml`
  `onlyBuiltDependencies` no longer lists `prisma`. If a fresh clone still hits it, set that env.

## Produce fresh, relevant evidence instead
The verification gate trusts real output, not the stale snapshot.

```bash
# typecheck / tests via npx (bypasses pnpm deps-status-check, see SKILL §2)
pnpm run typecheck          # == npx tsc -p tsconfig.core.json (exit 0 == clean)
npx vitest run              # or `node --test` for one app

# server route change: boot in ONE process and probe (background launcher kills node)
(PORT=8799 node server.mjs > /tmp/boot.log 2>&1 < /dev/null &) ; sleep 4
curl -s -o NUL -w "%{http_code}\n" 127.0.0.1:8799/your-route

# VPS-deployed code: SSH + curl the live pm2 port (local bg server unreliable here)
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  'curl -sf -m5 http://127.0.0.1:8788/your-route -o /dev/null && echo OK'
```

Always state: "this `hermes verify` snapshot is stale/blocked by <X>, unrelated to my change;
fresh evidence above shows the change is green." Then run the relevant check.

## Concrete session case — `apps/ftg-tools` (pure-Node package)

Change set was `ftg-gen.js` + `ftg-mcp/server.js` + `fal-images.js` + `*.test.mjs` + `ci.yml` +
`.env.example` (all Node, no Prisma/React/TS). `hermes verify` injected red with
`EPERM: rename query_engine-windows.dll.node.tmp` — environment AV lock on the monorepo
Prisma postinstall, zero relation to the change.

**Relevant verification (NOT pnpm, NOT hermes verify):**
```bash
cd apps/ftg-tools
node --test ftg-mcp/server.test.mjs fal-images.test.mjs ftg-gen.test.mjs
# → 7/7 pass, exit 0
```
- `pnpm run test` from the package dir ALSO hangs (~60s timeout) because pnpm still resolves the
  workspace before running the script. Run the `node --test ...` body directly.
- For the `ci.yml` / `.env.example` config change: confirm with
  `node -e "const y=require('fs').readFileSync('.github/workflows/ci.yml','utf8'); console.log(y.includes('ftg-gen.test.mjs'))"`
  (no pnpm, no prisma).
- Report: "hermes verify blocked by Prisma EPERM (env AV lock), unrelated; node --test 7/7 green."

## MCP stdio server must flush async results

A `tools/call` handler that returns `run(...)` (a Promise) — if the stdio loop does
`process.stdout.write(JSON.stringify(r))` synchronously, the Promise serializes to `{}` and the
client gets an empty result even though the work ran. Fix:
```js
rl.on('line', line => {
  const r = handle(JSON.parse(line));
  Promise.resolve(r).then(res => process.stdout.write(JSON.stringify(res) + '\n'));
});
```
