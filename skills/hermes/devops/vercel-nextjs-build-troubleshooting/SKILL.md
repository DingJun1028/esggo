---
name: vercel-nextjs-build-troubleshooting
description: Fix Vercel Next.js build OOM and sentinel preview red-loops.
---

# Vercel Next.js Build Troubleshooting

Use when a Vercel deployment shows `● Error`, the build log ends in `npm run build` / `next build` exit 1, or all preview deployments under a Vercel project are red while local `pnpm build` succeeds.

## Root-cause pattern (this repo: esggo)

Vercel build instances have a **hard memory ceiling** (Hobby ~1 GB, Pro default ~3 GB; the 8 GB tier is paid). A `package.json` build script that hardcodes `NODE_OPTIONS=--max-old-space-size=8192` works on a dev's 8 GB+ laptop but **OOM-kills (`exit 143`) on Vercel** because the instance can't allocate 8 GB.

Symptom: `Next.js build worker exited with code: 143` (SIGKILL = OOM), often with NO error text — just a silent exit 1 in the Vercel UI.

### The fix (verified 2026-08-14)
1. Remove the hardcoded `NODE_OPTIONS=--max-old-space-size=8192` from `package.json`'s `build` script.
2. Set it in `vercel.json` `env` at a **Vercel-safe value**: `--max-old-space-size=3072`.
   - Empirically on this repo: `2048` is too low (page-data collection for `/api/ai-notes/[id]` crashes), `3072` builds clean, `8192` OOMs on Vercel. **3072 is the sweet spot.**
3. `vercel.json`:
   ```json
   {
     "buildCommand": "pnpm prisma generate && pnpm run build",
     "installCommand": "pnpm install --no-frozen-lockfile",
     "env": { "NODE_OPTIONS": "--max-old-space-size=3072" }
   }
   ```
4. Also restore `NODE_OPTIONS=--max-old-space-size=3072` into `package.json`'s `build` script so local `pnpm build` (what `hermes verify` / CI run) also passes — NOT 8192. The dual setting (3072 in both) satisfies Vercel and local.

### Verify the fix locally (before pushing)
```bash
NODE_OPTIONS="--max-old-space-size=3072" npx next build   # expect exit 0, all routes listed
NODE_OPTIONS="" pnpm build                                # hermes verify runs this; must also exit 0
```

## Sentinel-branch red-loop (Jules bot auto-PRs)

If the project has many preview deployments all `● Error` (e.g. `esggomvp`, `esgss-jak`, `esgss_junaikey_beta`), they are **separate Vercel projects**, each connected to a `sentinel/fix-*` branch created by an automated security bot. Those branches fork from an OLD `main` that still has the bad `NODE_OPTIONS`, so each preview OOMs independently.

Pushing the fix to `main` does NOT automatically fix them — they don't rebase. You must **backport the `vercel.json` + `package.json` fix into each sentinel branch**:

```bash
git fetch origin sentinel/fix-XXX
git checkout -B fix-sentinel-XXX FETCH_HEAD
# edit package.json build + vercel.json env to 3072 (see above)
rm -f .git/index.lock          # if a prior git process left it
git add package.json vercel.json
git commit -m "fix(deploy): NODE_OPTIONS=3072 backport"
git push origin HEAD:sentinel/fix-XXX
git checkout main
```
List sentinel branches: `gh api repos/DingJun1028/esggo/branches?per_page=100 | python3 -c "import sys,json;[print(b['name']) for b in json.load(sys.stdin) if 'sentinel' in b['name'].lower()]"`

**PITFALL — branch-name typos create stray branches**: `git push origin HEAD:sentinel/fix-foo-1234` with a WRONG tail number creates a NEW branch instead of updating the existing one. Always `git ls-remote --heads origin | grep sentinel` to confirm the exact name before pushing, and `git push origin --delete <typo-branch>` immediately if you created one.

**PITFALL — `git index.lock`**: repeated `git checkout`/`commit` in a loop leaves `.git/index.lock`. `rm -f .git/index.lock` before each commit.

## `vercel env add` preview gotcha

To set a project-level env var for ALL preview builds: `vercel env add NAME preview VALUE --project <proj>` **requires a gitBranch as a 4th positional arg** for preview scope — you cannot set a "global preview" env via CLI. If you try `vercel env add NODE_OPTIONS 3072 preview` it errors `Branch "3072" not found`. Options:
- Per-branch: `vercel env add NODE_OPTIONS 3072 preview <branchname> --project <proj>` (tedious for many branches)
- OR just fix the repo `vercel.json` `env` (preferred — applies to every branch/build)

## `vercel deploy` from CLI

`vercel deploy --prod` uploads the local dir and **fails at 15000 files** (`files should NOT have more than 15000 items, received 17764`) because it counts `node_modules`/`.git`/vault. Use `vercel deploy --prod --archive=tgz` OR rely on Git-integration deploy (push to the connected branch) which respects `.gitignore`. Better: don't use `vercel deploy` for repo projects — let the Git push trigger the build.

## Verification checklist
- `git show origin/<branch>:vercel.json | grep NODE_OPTIONS` → must show `3072` on every branch you touched.
- `pnpm build` local → exit 0.
- Vercel UI: the redeployed preview should flip to `● Ready` (takes ~2 min).
- Note: the `hermes verify` snapshot may replay a PRE-FIX state (showing `next build` with no `NODE_OPTIONS` and OOM 143). That is stale; confirm against current on-disk `package.json`/`vercel.json`, not the cached snapshot.
