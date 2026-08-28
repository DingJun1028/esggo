# Vercel Deploy Notes for Vite + pnpm Projects

## First deploy
```bash
vercel --yes
```
This creates/link a Vercel project and attaches the GitHub repo automatically.

## Secret reference failure
If deploy fails with **"Environment Variable ... references Secret ... which does not exist"**:
1. Remove the `env` block from `vercel.json`.
2. Set secrets via `vercel env add` or dashboard.
3. Re-run deploy.

## Lockfile mismatch
Vercel may auto-detect pnpm@10.x for lockfileVersion 9 while local uses pnpm@9.
Opt-in to local pnpm via Corepack:
```bash
corepack enable && corepack prepare pnpm@9.15.4 --activate
```

## SPA routing
`vercel.json` must include rewrites:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## Production URL pattern
After deploy, Vercel may assign `*.vercel.app` and optionally an aliased production domain.
