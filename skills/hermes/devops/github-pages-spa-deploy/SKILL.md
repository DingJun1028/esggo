---
name: github-pages-spa-deploy
description: Deploy SPA to GitHub Pages; fix stale/404/CF-origin issues.
version: 1.0.0
author: hermes-agent
license: MIT
metadata:
  hermes:
    tags: [github-pages, spa, vite, react, cloudflare, deploy, ci-cd]
    related_skills: [esggo-vps-deploy-rescue, esggo-vps-deploy-verify, vps-push-to-deploy]
---

# GitHub Pages SPA Deploy

## When to use
- Deploying a Vite/React SPA to GitHub Pages (custom domain or `*.github.io`).
- GitHub Pages shows OLD content after a successful push.
- Subpages (React Router paths) return 404 on direct URL visit.
- A custom domain behind Cloudflare returns stale/404 despite green CI.

## Reliable workflow (official Actions Pages deploy)
Use `actions/upload-pages-artifact` + `actions/deploy-pages`, NOT `peaceiris/actions-gh-pages`. See `references/github-pages-spa-workflow.yml` for the known-good YAML.

Key job shape:
- `permissions: pages: write` + `id-token: write` on the deploy job
- `environment: name: github-pages`
- `needs: [build, lint, test]` so deploy only runs after green checks
- build step: `npm ci` + `npm run build`, then **`cp dist/index.html dist/404.html`** for SPA fallback, then upload `dist/`

## Pitfalls (each cost real debugging time)

### 1. peaceiris/actions-gh-pages locks the deployment
Pushing to `gh-pages` does NOT auto-redeploy. GitHub Pages latches onto an old commit; later branch pushes are ignored. Symptom: raw `gh-pages` branch has your new files (verify via `gh api .../contents/...?ref=gh-pages`) but the live site serves an old JS hash / old canonical. Fix: switch to official Actions Pages deploy (above). `gh api POST /repos/{o}/{r}/pages/builds` ("rebuild") does NOT fix a locked legacy deployment.

### 2. SPA 404 on direct subpage URLs — two different fixes, pick by requirement
React `BrowserRouter` paths (`/esg-impact-note`) get 404 from GitHub Pages (no rewrite). The 404 body is still your React app (`<div id="root">` + `/assets/index-*.js`), so in-app navigation works. But there are TWO distinct acceptance bars:

- **404.html fallback** (copy `dist/index.html` → `dist/404.html`): direct URL still returns **HTTP 404 status** (body is the app). In-app nav fine; direct links/SEO get 404. **This user REJECTS this** — "外面看起來要是很正漂亮的正常網頁，直接貼網址也要 200". Treat 404-status-on-direct-URL as a FAILURE for this user.
- **HashRouter** (see "HashRouter hard-200 fix" below): direct URL `domain/#/path` returns **HTTP 200** — a real normal webpage. Use this when the requirement is "direct URL must be 200 / no 404".

NEVER present the 404.html fallback as "done" if the user demanded direct-200. Verify with the hash URL form.

### 3. environment branch-policy rejection
First official-Actions deploy fails: `Branch "main" is not allowed to deploy to github-pages due to environment protection rules.` Fix via API:
gh api -X POST "repos/{o}/{r}/environments/github-pages/deployment-branch-policies" -f name=main

### HashRouter hard-200 fix (when direct-URL 200 is required)
Minimal change, no Link/Route rewrites needed:
- In App.jsx: import HashRouter as Router from react-router-dom (swap BrowserRouter to HashRouter). Route path stays identical.
- In the SEO helper: canonical(path) must emit hash form when path is non-empty, else crawlers point at the 404-prone /path:
  const canonical = (path='') => path ? `${SITE_URL.replace(/\/$/,'')}/#/${path.replace(/^\//,'')}` : `${SITE_URL.replace(/\/$/,'')}/`;
- Real working URLs become domain/#/esg-impact-note -> HTTP 200 (GitHub Pages only ever serves / index.html; hash handled client-side). /esg-impact-note (no #) still 404s - that is EXPECTED; test/verify the # form.

### Cloudflare transient after purge (server not found)
Right after purge_everything, GitHub Pages may be mid-swap to the new deployment -> brief server-not-found/connection errors for a few seconds. Not a real failure. Re-test after ~10s; if it persists >1 min, re-check origin (pitfall 4) and that the Actions deploy actually completed (gh run watch).

### 4. THE BIG ONE — Cloudflare origin/DNS mismatch
If the custom domain sits behind Cloudflare, verify WHAT it points at BEFORE debugging the deploy pipeline. `cf-cache-status: HIT` on a 404, or a live `canonical` that never changes no matter what you deploy, means traffic isn't reaching GitHub Pages at all. Check:
`gh api zones/{ZONE}/dns_records?name=DOMAIN` — if `content` is `*.cfargotunnel.com` (Cloudflare Tunnel) or some other origin, your GitHub Pages work is invisible. Fix: change the DNS record to `CNAME -> <user>.github.io` (proxied or not). Only after the origin is correct will deploys/purges matter.

### 5. Cloudflare purge permission model
A "Edit zone DNS" API token CANNOT purge cache (`Authentication error` on `purge_cache`). You need either (a) a token with `Zone: Cache Purge: Edit`, or (b) the **Global API Key** (`X-Auth-Email` + `X-Auth-Key` headers) to `POST zones/{ZONE}/purge_cache {"purge_everything":true}`. After fixing the origin (pitfall 4), purge to flush stale 404s.

### 6. static index.html canonical ≠ runtime seo.js
If `canonical`/`og:url` are wrong on the live site, editing `seo.js` `SITE_URL` may do NOTHING — those tags are hardcoded in the `index.html` SOURCE (Vite copies it verbatim; `seo.js` only sets meta at runtime via `useEffect`). Edit `index.html` directly, then redeploy.

### 7. Windows/MSYS CRLF + command limits
Git commits show `LF will be replaced by CRLF` warnings — harmless. Long one-liner commands with many `curl`s get hard-blocked by the parser ("unparseable inline command payload") — break into a Python script or background terminal, or use `write_file` instead of `cp` for single-file copies.

## Strict content-ordering rule (this user's asset-folder deployments)
When the user provides folders of images/assets and states the order/content is fixed by company rule:
- Use **original filenames VERBATIM** (even Chinese), in the folder's raw listing order (`search_files (target='files')` order = Explorer order).
- NEVER rename to ASCII slugs, NEVER re-categorize, NEVER invent groupings (e.g. don't split "可帶來什麼/可留下什麼" if the folder doesn't).
- In JSX, build an array of the exact filenames in order; render `<img src={"/images/dir/" + encodeURIComponent(name)}>`. `encodeURIComponent` makes Chinese URLs work on GitHub Pages.
- Verify count matches the folder exactly (a missing group = a missed folder section).

## Verification (do this before claiming done)
1. `gh run watch` until deploy job green.
2. If Cloudflare: purge cache (Global Key) + optionally Dev Mode ON to bypass cache while testing.
3. `curl -s -o /dev/null -w '%{http_code}'` each asset with `urllib.parse.quote(name)` encoding — expect 200 for ALL.
4. `curl` each subpage; grep body for `<div id="root">` + `/assets/index-*.js` (confirms React app served despite 404 status).
4b. **Direct-URL 200 check (this user's bar)**: if the user demanded "direct URL must be a normal 200 webpage", test the **hash form** `domain/#/path` with `curl -s -o /dev/null -w '%{http_code}'` → must be 200. `/path` (no `#`) staying 404 is EXPECTED under HashRouter; do NOT report it as a failure. Report the hash URL as the canonical shareable link.
5. Confirm `canonical` matches the intended domain (and, under HashRouter, contains `/#/path` for subpages).

See `references/cloudflare-purge.md` for the purge/permission diagnostic, and `references/github-pages-spa-workflow.yml` for the full CI YAML.
