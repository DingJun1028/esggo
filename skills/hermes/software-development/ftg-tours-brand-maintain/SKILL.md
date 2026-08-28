---
name: ftg-tours-brand-maintain
description: Maintain FTG 墾趣旅遊 brand assets and CI/CD deploy.
version: 0.2.0
metadata:
  hermes:
    tags: [ftg, seo, brand, cjk, vite, react, ci-cd, vps]
    category: software-development
---

# FTG 墾趣旅遊 Brand Maintenance Skill

## When to use
- Working on the FTG Tours Vite/React SPA at `C:\Users\dingj\ftg-tours-website` (repo: `DingJun1028/ftgtours-esggo-co`, live at `https://ftgtours.esggo.co`).
- Fixing brand character issues, SEO tags, Chinese localization, dropdown positioning, or CI/CD deployment.
- User provides a reference image showing correct brand — extract Unicode codepoint and verify ALL source files match.

## Critical brand contract (VERIFIED from user reference image + standing memory rule)

### Brand character: `墾` (U+587E)
- **Correct**: `墾` → U+587E → "墾趣旅遊 FTG Tours"
- **WRONG (FORBIDDEN — user explicit ban)**: `聖` → U+8056 ("聖趣" must NEVER be used)
- **WRONG (visual confusable)**: `墺` → U+58BA
- **WRONG (visual confusable)**: `墳` → U+58BE
- **WRONG (from old ftg-tools)**: `墧` → U+8FB7

> 墾 (U+587E) vs 聖 (U+8056) render nearly identically at typical web font sizes. The user's standing brand rule (memory) is explicit: **品牌名嚴格為「墾趣旅遊」，禁用「聖趣」**. An earlier version of this skill wrongly named 聖 as correct — that was wrong; 墾 is the brand. The `patch` tool's fuzzy matching can silently substitute one for another. **Always verify Unicode codepoints, not visual inspection.**

### Title format
```
<title>墾趣旅遊 FTG - 走進自然，創造更有意義的旅程</title>
```

### Meta tags
```html
<meta name="description" content="企業員工旅遊、家庭日、ESG 戶外團隊日、員工身心平衡旅程。。走進自然，創造更有意義的旅程。" />
```

### Service names (Chinese)
| English | Chinese | Route |
|---|---|---|
| Corporate Travel | 企業員工旅遊 | `/corporate-travel` |
| Family Day | 企業家庭日 | `/family-day` |
| ESG Team Day | ESG 戶外團隊日 | `/esg-team-day` |
| Wellbeing Retreat | 員工身心平衡旅程 | `/wellbeing-retreat` |
| Executive Retreat | 高階主管共識營 | `/executive-retreat` |
| ESG Impact Note | ESG 影響報告 | `/esg-impact-note` |

## Pitfalls

### P1 — `patch` tool silently swaps CJK characters
**Symptom**: After using `patch` to edit Chinese text, files have visually-identical but wrong Unicode characters.

**Fix**: After any `patch` call that touches Chinese text, run:
```bash
python3 -c "
import os
wrongs = [0x58BA, 0x58BE, 0x8FB7, 0x8056]  # 墺 墳 墧 聖(forbidden)
correct = chr(0x587E)  # 墾
files = ['index.html']
for root, dirs, fs in os.walk('src'):
    for f in fs:
        if f.endswith(('.jsx', '.js')):
            files.append(os.path.join(root, f))
for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    for w in wrongs:
        content = content.replace(chr(w), correct)
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
print('Fixed: replaced all wrong brand chars with 墾 (U+587E)')
"
```

### P2 — VPS IP mismatch in CI/CD
VPS IP is `161.118.248.180` (Oracle ap-singapore-1 A1.Flex 4OCPU/24GB). `.github/workflows/deploy-vps.yml` `vps-host` must match.

### P3 — Duplicate imports after git pull
```bash
grep -rn "import.*ImageCarousel" src/pages/*.jsx
# Each file should have exactly 1 import line
```

### P4 — HashRouter for static hosting
Routes are `https://ftg.esggo.co/#/`, `https://ftg.esggo.co/#/corporate-travel`, etc. All return HTTP 200 (SPA shell).

### P5 — Static meta lives in index.html + Cloudflare cache after deploy
- **Static crawlers read `index.html`, not `seo.js`.** `canonical`, `og:url`, `og:image`, `hreflang` are hardcoded in `index.html` (Vite copies `public/index.html` → `dist/index.html`). `seo.js` only patches runtime `<head>` via `useEffect` and does NOT rewrite the static file. If the canonical still shows the old domain after a deploy, the bug is in `index.html`, not `seo.js`. (Verified 2026-08-28: changing `SITE_URL` in `seo.js` did nothing to the served `<link rel="canonical">`; the value came from `index.html`.)
- **Cloudflare sits in front of `ftgtours.esggo.co`.** After GitHub Pages deploys new `gh-pages` content, Cloudflare keeps serving cached old responses (`cf-cache-status: HIT`, `Server: cloudflare`) — even old 404s. A green CI run is NOT proof the site updated. Purge Cloudflare cache (dashboard → Caching → Purge Everything, or API) before declaring live. Then `curl -sI https://ftgtours.esggo.co/images/<file>.png` should return `200` (not `404`) and `cf-cache-status: MISS` on first hit.

### P6 — Cloudflare purge token-scope trap (verified 2026-08-28)
A token labeled "編輯區域 DNS / Edit zone DNS" carries ONLY `Zone:DNS:Edit`. It CANNOT purge cache:
- `POST /zones/{id}/purge_cache` with that token → `{"success":false,"errors":[{"code":10000,"message":"Authentication error"}]}`.
- It also CANNOT create a new token (no `User:Api Tokens Create`), so you cannot self-upgrade it to a purge token via API.
- **Therefore the agent cannot self-serve a Cloudflare cache purge with a DNS-only token.** The only paths are:
  1. **User creates a Cache Purge token** (dashboard → My Profile → API Tokens → Create Custom Token → `Zone → Cache Purge → Edit`, zone `esggo.co`) and pastes the new `cfut_...` to the agent. Agent then runs the purge (see reference).
  2. **User manually purges** (dashboard → `esggo.co` → Caching → Configuration → Purge Everything, or Custom Purge `ftgtours.esggo.co`), then tells the agent to verify.
- **Any token pasted into chat is considered EXPOSED** — after use, recommend the user rolls/deletes it in the dashboard. Store temporarily in `secret-vault/` with a `ROTATE AFTER USE` note; never leave it in conversation context as if safe.
- **Do NOT claim "live" until `curl` shows the new content.** Green CI + `gh-pages` raw 200 ≠ live, because Cloudflare serves the cached old version. Verify with real `curl` (see `references/ftg-cloudflare-purge.md`).
- Zone constant: `ftgtours.esggo.co` lives under zone **`esggo.co`**, id `8dda3653e490290412f7be84a84e0dc9`.

### P7 — Cloudflare Tunnel origin trap (VERIFIED 2026-08-28, cost hours)
**Symptom**: You rebuild + purge + redeploy GitHub Pages, but the live site NEVER changes — same old JS hash, same old canonical, same 404s. `cf-cache-status: HIT`, `Server: cloudflare`, raw `gh-pages` is 200, yet live is stale.
**Root cause**: `ftgtours.esggo.co` DNS was a **Cloudflare Tunnel** (`CNAME → <uuid>.cfargotunnel.com`, proxied), NOT GitHub Pages. Traffic went to the tunnel origin (an old server serving the old `ftg.esggo.co` build). GitHub Pages changes were 100% invisible.
**Diagnostic (run BEFORE assuming cache)**:
```bash
CF_EMAIL=... CF_KEY=... ZONE=8dda3653e490290412f7be84a84e0dc9
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records?name=ftgtours.esggo.co" \
  -H "X-Auth-Email: $CF_EMAIL" -H "X-Auth-Key: $CF_KEY" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); [print(r['type'],r['name'],'->',r['content'],'| proxied:',r.get('proxied')) for r in d.get('result',[])]"
```
If `content` ends in `cfargotunnel.com` → it's a Tunnel, not Pages. GitHub Pages edits will NOT show. You must either (a) repoint DNS to GitHub Pages, or (b) deploy to the tunnel origin.
**Fix (a) — repoint to GitHub Pages** (validated, site went live):
```bash
RECID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records?name=ftgtours.esggo.co&type=CNAME" -H "X-Auth-Email: $CF_EMAIL" -H "X-Auth-Key: $CF_KEY" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")
curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records/$RECID" -H "X-Auth-Email: $CF_EMAIL" -H "X-Auth-Key: $CF_KEY" -H "Content-Type: application/json" --data '{"type":"CNAME","name":"ftgtours.esggo.co","content":"dingjun1028.github.io","proxied":true}'
```
Then purge Cloudflare and wait ~60s for GitHub Pages to re-verify the custom domain.

### P8 — GitHub Pages deploy mode + SPA 404 fallback (VERIFIED 2026-08-28)
**Legacy `peaceiris/actions-gh-pages` locks to an OLD deployment.** Even after pushing new `gh-pages` content, live served a stale commit (old JS hash / canonical). `gh api POST /repos/X/pages/builds` + purge did not help (because live wasn't Pages at all — see P7 — but the lock is real for legacy mode too).
**Switch to official Actions Pages deploy** (validated):
```yaml
permissions: { contents: read }
# build job:
      - name: Build
        run: npm run build
      - name: SPA fallback
        run: cp dist/index.html dist/404.html   # GitHub Pages serves 404.html for unknown paths -> React Router takes over
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist/ }
# deploy job:
  deploy:
    needs: [build, lint, test]
    if: github.event_name == 'push'
    permissions: { pages: write, id-token: write }
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
**Environment protection error**: `Branch "main" is not allowed to deploy to github-pages due to environment protection rules` → fix by adding `main` to the `github-pages` environment deployment-branch-policy:
```bash
gh api -X POST "repos/DingJun1028/ftgtours-esggo-co/environments/github-pages/deployment-branch-policies" -f name="main"
```
- **SPA 404 note**: after this, subpages (e.g. `/esg-impact-note`) return **HTTP 404 with the full React app body** (curl shows `<div id="root">` + `/assets/index-*.js`). Browsers render correctly from in-app navigation; only direct-URL hits get a 404 status (SEO/suboptimal but functional). To get HTTP 200 on direct hits, switch `BrowserRouter` → `HashRouter` (URLs become `/#/esg-impact-note`). User accepted 404-fallback for ftgtours; ask before changing router.

## Navbar dropdown positioning
```jsx
<div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[480px] ... group-hover:mt-8 transition-all">
```
Remove `-translate-y-1/2` if present; use `mt-6`→`mt-8` for downward offset.

## Deploy & Verify workflow
```bash
npm run build   # lockfile is pnpm-lock.yaml -> pnpm build; npm ci also works via package-lock.json
python3 -c "..." # verify brand char in built output
git add -A && git commit -m 'fix: ...' && git push origin main
# GitHub Pages via peaceiris/actions-gh-pages -> gh-pages branch (deploy job needs permissions: contents:write, pages:write)
sleep 50
curl -sS https://ftgtours.esggo.co/ | grep -oE '<title>[^<]+</title>'
```
> **STATIC META LIVES IN `index.html`, NOT `seo.js`.** Canonical / `og:url` / `og:image` are hardcoded in `public/index.html` (Vite copies it to `dist/index.html`) and that is what crawlers read. `src/utils/seo.js` only patches runtime `<head>` via `useEffect` — editing `SITE_URL` there does NOT change the served `<link rel="canonical">`. To change the canonical domain, edit `index.html` directly.
> **CLOUDFLARE CACHE (verified 2026-08-28):** `ftgtours.esggo.co` sits behind Cloudflare (orange-cloud). After a GitHub Pages deploy, stale responses — including old 404s — persist with `cf-cache-status: HIT` (`Server: cloudflare`). A green CI run is NOT proof the site updated. You must **Purge Everything** in the Cloudflare dashboard (or call the Cache Purge API) before `curl` shows new content. Verify: `curl -sI https://ftgtours.esggo.co/images/<file>.png` → `200` + `cf-cache-status: MISS` on first hit.

## References
- `references/ftg-brand-verify.md` — exact Unicode verification commands and session history
- `references/cicd-ftg-workflow.md` — workflow file contents and deploy verification recipe
- `references/ftg-cloudflare-purge.md` — Cloudflare purge token-scope trap + working purge/verify recipe (verified 2026-08-28)
- `references/ftg-pages-deploy-recipe.md` — full end-to-end GitHub Pages deploy sequence (init→push→enable Pages→Actions deploy→env policy→repoint DNS→purge→verify), verified 2026-08-28

## See also
- `frontend-seo-for-spa` — broader SEO patterns (NOTE: documents WRONG brand char; this skill overrides)
- `esggo-vps-toolkit` — VPS + Cloudflare Tunnel deploy patterns
- `vps-push-to-deploy` — GitHub Actions SSH deploy to VPS
