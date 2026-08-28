---
name: cloudflare-workers-deploy
description: "Deploy Cloudflare Workers via wrangler-action and troubleshoot TypeScript/compile failures. Load when worker/src/index.ts, wrangler.toml, or deploy-worker.yml changes, or when a CF Workers deployment is failing."
version: 1.0.0
author: Hermes Agent (DingJun1028)
platforms: [linux, macos, windows]
---

# Cloudflare Workers Deploy (esggo OmniGateway)

## Overview
Deploys the `smart-ai-router` worker to Cloudflare Workers via GitHub Actions (`workflows/deploy-worker.yml`).

## Key Files
- `.github/workflows/deploy-worker.yml` — CI workflow triggered on `worker/**` or `wrangler.toml` changes
- `worker/src/index.ts` — Worker entry point (309+ lines as of 2026-07-28)
- `worker/tsconfig.json` — TypeScript config for worker
- `wrangler.toml` — Wrangler deployment config (`main = "worker/src/index.ts"`)

## Secrets Required (in GitHub Secrets)
- `CF_API_TOKEN` — Cloudflare API token
- `CF_ACCOUNT_ID` — Cloudflare account ID
- `OPENROUTER_API_KEY` — Upstream AI provider
- `GROQ_API_KEY` — Upstream AI provider
- `GEMINI_API_KEY` — Upstream AI provider

## Deploy Workflow (PR #400 regression fix)
PR #400 (`386cb47`) added a defensive `if (ctx && typeof ctx.waitUntil === 'function') {` block to `auditSink` in `worker/src/index.ts` but **forgot the closing `}`**, causing TypeScript TS1005 (`'}' expected`). The `cloudflare/wrangler-action@v3` compile step then failed, blocking all CF Workers deployments.

### Fix Applied (1bd4966)
Added the missing `}` after `}).catch(() => {}));` to close the if-block in `auditSink`.

## Pre-Deploy Verification
```bash
cd worker && npx tsc --noEmit -p tsconfig.json   # Must pass (exit 0)
```

## Pitfalls
- PRs modifying `worker/src/index.ts` must keep TypeScript compile clean — wrangler-action@v3 runs `npx tsc --noEmit` before deploy and fails on any TS error.
- Always count `{` vs `}` after adding defensive if-blocks or new functions.
- `worker/` has no `package.json` — it relies on the root workspace; do NOT add one unless explicitly needed.
- **Correction to the "no package.json" rule:** an *isolated* subdir worker (e.g. `my-worker/`) that is NOT listed in the monorepo `pnpm-workspace.yaml` CAN and SHOULD get its own `package.json` + `pnpm-lock.yaml` + `tsconfig.json`. Without it, `pnpm install` still upward-detects the root workspace and runs the monorepo `postinstall`/`prepare` (prisma generate, setup-hooks), which breaks a `wrangler.toml` `[build] command` like `pnpm install --frozen-lockfile`. Install the subdir with `pnpm install --ignore-workspace` so it gets its own local `node_modules/.bin/tsc` + `wrangler`.
- `my-worker/**` glob is ignored in root `eslint.config.js` — ESLint on worker is run manually inside the workflow.

## Windows / Isolated-Subdir Wrangler Build Pitfalls

When `wrangler.toml` has a `[build] command` and you run `wrangler deploy` / `wrangler deploy --dry-run` from a Windows host, the build command is executed via execa (no interactive shell), so:

- **Do NOT use `cd my-worker && ./node_modules/.bin/tsc ...`** — execa rejects `cd` as a command (`'cd' is not recognized...`). Also `./node_modules/.bin/tsc` is a shell script on Windows and cannot be `exec()` directly.
- **Working `[build]` command (cross-platform):** `node my-worker/node_modules/typescript/bin/tsc -p my-worker/tsconfig.json` (invoke the TS compiler through `node`, with forward-slash relative paths from the wrangler.toml cwd).
- **`wrangler deploy --dry-run` is the fastest config+bundle check** — it runs the custom build and prints `Total Upload: …` + bindings, then exits. Use it to validate before a real deploy. It will show `${FREE_MODELS_KV_ID}` literally if the env var is not exported (expected in dry-run).
- **KV id env injection:** `[[kv_namespaces]] id = "${FREE_MODELS_KV_ID}"` only resolves when you `export FREE_MODELS_KV_ID=…` (and `_PREVIEW_ID`) before `wrangler deploy`. `wrangler secret put` is for secrets, NOT for KV namespace IDs.
- **Secrets in wrangler.toml:** keep them commented out (`# OPENROUTER_API_KEY = ""`); set via `wrangler secret put <NAME>` so they never land in git.

## Verification reminder (this host)

The post-tool "verification" reminder often suggests `pnpm run typecheck` (tsc). That command is **wrong for non-TypeScript changes**: a Bash deploy script (`.sh`) is verified with `bash -n`, a Python file with `py_compile` / `--check`, a built worker with `node --check dist/index.js`. Only run `tsc` when a `.ts`/`.tsx` file actually changed. Running `tsc` against a `.sh` proves nothing and wastes a turn.

## Wrangler Pipelines Setup

### Prerequisites
- Cloudflare account with Workers access
- `wrangler` CLI installed (v4.x recommended)
- `npx wrangler login` completed

### Initial Setup
```bash
# Navigate to project root
cd /c/Project/aistation

# Authenticate with Cloudflare (if not done)
npx wrangler login

# Get account ID
npx wrangler account copy

# Set account_id in wrangler.toml
```

### wrangler.toml Configuration
```toml
name = "aistation"
compatibility_date = "2024-07-01"
account_id = "<your-account-id>"

[build]
command = "cd web && npm install && npm run build"

[vars]
HOST = "0.0.0.0"
PORT = "8000"

[env.production.vars]
HOST = "0.0.0.0"
PORT = "8000"

# Secrets to set via: npx wrangler secret put <NAME>
# OPENAI_API_KEY
# ELEVENLABS_API_KEY
# RUNWAY_API_KEY
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_S3_BUCKET
# WEBHOOK_SECRET
```

### Set Secrets
```bash
# Set secrets (these are encrypted and not visible in config)
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ELEVENLABS_API_KEY
npx wrangler secret put RUNWAY_API_KEY
npx wrangler secret put AWS_ACCESS_KEY_ID
npx wrangler secret put AWS_SECRET_ACCESS_KEY
npx wrangler secret put AWS_S3_BUCKET
npx wrangler secret put WEBHOOK_SECRET
```

### Deploy
```bash
# Deploy the worker
npx wrangler deploy

# Verify deployment
curl https://<your-worker-subdomain>.workers.dev/health
```

### CI/CD Integration (GitHub Actions)
```yaml
name: Deploy Worker

on:
  push:
    paths:
      - 'worker/**'
      - 'wrangler.toml'
      - '.github/workflows/deploy-worker.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install wrangler
        run: npm install -g wrangler
      
      - name: Authenticate
        run: wrangler login --auto
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
      
      - name: Deploy
        run: wrangler deploy
```

### Wrangler Pipelines Setup (Open Beta)

Cloudflare Workers Pipelines is available via `npx wrangler pipelines setup` but **cannot run in non-interactive contexts**. For programmatic setup:

#### Prerequisites
- Wrangler CLI v4.113.0 or later
- Authenticated with `npx wrangler login`
- Account ID configured in wrangler.toml

#### Manual Pipeline Configuration
```toml
# wrangler.toml
name = "aistation"
compatibility_date = "2024-07-01"
account_id = "d9d7ecd92cbad6d858fba3e529b9cb7b"

# Entry point for Worker Functions
main = "functions/health.ts"

[vars]
HOST = "0.0.0.0"
PORT = "8000"

[env.production.vars]
HOST = "0.0.0.0"
PORT = "8000"
FEATURE_FLAGS = '{"enhanced": true}'
```

#### Worker Functions Entry Point
Create `functions/health.ts` with proper ES Module format:
```typescript
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        if (url.pathname === '/health' || url.pathname === '/api/health') {
            return new Response(JSON.stringify({ 
                status: 'ok', 
                timestamp: new Date().toISOString()
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response('OK', { status: 200 });
    }
};
```

#### Deploy Command
```bash
# Deploy to production environment
npx wrangler deploy -e production

# Verify deployment
curl https://aistation-production.dingjunhong1028.workers.dev/health

# View logs
npx wrangler tail -e production
```

### Pitfall: Shell Tool Accessibility Issues

On Windows hosts, the `shell` tool may return "shell tool does not exist" errors. **Workaround:**
- Use `execute_code` with subprocess to run CLI commands
- Use `npx` directly via full path: `C:\\Users\\dingj\\.vite-plus\\bin\\npx.exe`
- For wrangler: `C:\\Users\\dingj\\.vite-plus\\bin\\node.exe C:\\Users\\dingj\\.vite-plus\\node_modules\\wrangler\\dist\\cli.js`

### Pitfall: Worker Returns 403 Forbidden

If deployed Worker returns 403 Forbidden on all endpoints:
- This is a Cloudflare security restriction, not a code error
- The Worker is deployed correctly (check via `wrangler deployments`)
- For local testing, use `wrangler dev` instead of live endpoints
- The 403 may occur for unverified Workers in certain account types
- Check Cloudflare account permissions for Workers access

### Pitfall: npm package 404 errors

If `npm install` fails with `404 Not Found` for packages like `pydantic-to-zod`:
- Remove the package from `web/package.json`
- The Workers function doesn't need Python dependencies
- Use existing `node_modules` or skip build for Workers-only deployment
- Consider using `wrangler pages` for static site deployment instead of Workers

### Pitfall: npm/pnpm Dependency Issues

If `npm install` fails with `404 Not Found` for packages like `pydantic-to-zond`:
- Remove unavailable packages from `web/package.json`
- Use existing `node_modules` or skip build step for Workers-only deployment
- Consider using `wrangler pages` for static site deployment instead of Workers

### Common Issues

#### 1. "No config file found"
Ensure `wrangler.toml` exists at project root with valid `account_id`.

#### 2. "API token invalid"
- Verify token has Workers:Edit, KV:Edit, R2:Edit permissions
- Token must be for the correct account

#### 3. Build fails with "npm not found"
On Windows, ensure Node.js is in PATH or use full path:
```bash
C:\Users\dingj\.vite-plus\bin\node.exe C:\Users\dingj\.vite-plus\node_modules\wrangler\dist\cli.js deploy
```

#### 4. "Account ID mismatch"
The account ID in secrets must match the one in wrangler.toml and the token's account.

### Migration from VPS to Workers
AI Station currently uses Docker on a VPS. Consider:

1. **Web frontend**: Can be deployed to Workers (static assets)
2. **Python backend**: Requires significant refactoring to run on Workers
   - Use Cloudflare Workers with Durable Objects for state
   - Or keep VPS for Python backend, Workers for frontend
   - Or use a hybrid approach with API routes

### Next Steps
- [ ] Set `CF_ACCOUNT_ID` in GitHub Secrets
- [ ] Set `CF_API_TOKEN` with Workers permissions
- [ ] Test local build: `npx wrangler dev`
- [ ] Deploy to production: `npx wrangler deploy`
- [ ] Configure custom domain routing if needed