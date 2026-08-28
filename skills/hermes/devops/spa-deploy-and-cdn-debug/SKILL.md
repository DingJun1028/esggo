---
name: spa-deploy-and-cdn-debug
description: >
  Deploy and debug SPAs (Vite/React) on VPS behind Cloudflare. Use when:
  - Site goes blank after deploy and console shows Rocket Loader / import.meta errors
  - Cloudflare Dashboard toggle alone doesn't fix the issue
  - Need to verify if SPA is actually rendering despite empty raw HTML
  - Need to inject inline JS patches safely without creating duplicate blocks
---

# SPA Deploy & Cloudflare/CDN Debug

## Trigger
- FTG or any Vite/React SPA returning HTTP 200 with empty `#root`
- Cloudflare Rocket Loader errors after deploy
- Inline JS patch accidentally duplicated in `index.html`
- SPA works locally but blank behind Cloudflare
- **Static HTML/CSS site deployed via SCP to VPS but images/CSS look unchanged in browser despite `curl` 200** — Cloudflare edge cache is serving stale bytes
- **Card/section images show `offsetHeight:0` in browser console** after deploy (flex-column shrink bug)

## Deploy Flow

### Standard deploy
1. Build locally: `pnpm run build` → `dist/`
2. Transfer: `scp -r dist/* ubuntu@<vps>:/var/www/<site>/`
3. Reload: `ssh ubuntu@<vps> 'sudo systemctl reload nginx'`

### Push-to-deploy via GitHub Actions (preferred)
Create `.github/workflows/deploy-vps.yml`:
```yaml
name: Deploy <site> to VPS
on:
  push:
    branches: [main]
    paths:
      - 'dist/**'
      - 'deploy/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    env:
      SSH_PRIVATE_KEY: ${{ secrets.VPS_SSH_PRIVATE_KEY }}
      VPS_HOST: ${{ secrets.VPS_HOST }}
      VPS_USER: ${{ secrets.VPS_USER }}
      REMOTE_DIR: /var/www/<site>
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.VPS_SSH_PRIVATE_KEY }}

      - name: Guard dist before deploy
        run: |
          test -d dist || (echo 'dist/ missing — verify build output dir and scripts/build.js'; exit 1)

      - name: Ensure remote directory exists
        run: |
          ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "sudo mkdir -p $REMOTE_DIR && sudo chown -R $VPS_USER:$VPS_USER $REMOTE_DIR"

      - name: Sync dist to VPS
        run: |
          rsync -az --delete \
            -e 'ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10' \
            dist/ "$VPS_USER@$VPS_HOST:$REMOTE_DIR/"

      - name: Install/Reload nginx site
        run: |
          ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "sudo cp deploy/nginx.conf /etc/nginx/sites-available/<site>.conf || true && sudo ln -sf /etc/nginx/sites-available/<site>.conf /etc/nginx/sites-enabled/<site>.conf && sudo nginx -t && sudo systemctl reload nginx"

      - name: Verify deployment
        run: |
          curl -I --max-time 15 "http://$VPS_HOST" || true
          curl -I --max-time 15 "https://$VPS_HOST" || true
```

Notes:
- Include `workflow_dispatch` so manual re-deploys don’t require a dummy commit.
- If the repo only has `dist/` at root, the simplest sync is `rsync -az --delete dist/ "$VPS_USER@$VPS_HOST:$REMOTE_DIR/"`.
- If the build script places output elsewhere, update `REMOTE_DIR` and the `dist/` guard.
- `deploy/nginx.conf` should be committed in repo so the workflow can install it without ad-hoc file edits.
- YAML caveat: bare `on:` can be parsed as a boolean in some tooling; keep it quoted if needed.
- 5T verification trail: treat the workflow YAML, built `dist/`, and deploy log as evidence for Traceable/Trackable/Trustworthy outcomes.

## Cloudflare Blank-Site Debugging (6-step)

### Step 1: Confirm Rocket Loader is really off
- Dashboard → Speed → Optimization → Rocket Loader → Off
- Caching → Purge Everything
- Wait 60–120 seconds before testing

### Step 2: Rebuild with import.meta patch if needed
When Rocket Loader cannot be fully disabled, inline JS into `index.html` and patch:
```python
import re
from pathlib import Path

html = Path('dist/index.html').read_text()
js = Path('dist/assets/[hash].js').read_text()

for bad, good in [
    ('import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href', 'new URL(e,location.href).href'),
    ('import.meta.url', 'location.href'),
    ('import.meta.resolve', 'function(x){return new URL(x,location.href).href;}'),
]:
    js = js.replace(bad, good)

# Escape </script> so HTML parser doesn't truncate
js = js.replace('</script>', '<\\/script>')

# Inline into first <script> tag
m = re.search(r'(<script[^>]*>)(.*?)(</script>)', html, re.DOTALL)
fixed = html[:m.start()] + m.group(1) + js + m.group(3) + html[m.end():]
Path('dist/index.html').write_text(fixed)
```

**Note**: `data-cf-rl="false"` alone often fails on Free plan. Inline is more reliable, but must be deduped.

### Step 3: Deduplicate inline blocks
Repeated inline patches create duplicate `<script>...</script>` blocks and silently break React mount. After every inline patch, run:
```python
import re
html = open("index.html","r",encoding="utf-8").read()
html = re.sub(r'(?s)(<script crossorigin[^>]*>.*?</script>)\s*(<script crossorigin[^>]*>.*?</script>)+', r'\1', html)
open("index.html","w",encoding="utf-8").write(html)
```

### Step 4: Debug silent React mount failures
If site is still blank but no console errors, wrap mount with try-catch to expose hidden errors:
```
var dr=document.getElementById(`root`);
if(dr){
  try{ $n.createRoot(dr).render(x.createElement(ur,null)); }
  catch(e){ console.error("[FTG-MOUNT-ERR]",e); dr.innerHTML="<pre style=\\"color:red;padding:2rem\\">"+JSON.stringify(e&&e.message||String(e))+"</pre>"; }
}
```
This renders the error message directly on the page.

### Step 5: Verify rendering correctly
Raw HTML curl always shows empty `<div id="root">` for SPAs (that's normal). Verify with:
- Browser screenshot showing actual rendered content
- Browser console: `document.getElementById('root').innerHTML.length` should be > 0
- Check delivered HTML has no `rocket-loader.min.js`
- Check inline `<script>` does not contain `import.meta`

### Step 6: Nginx cache hygiene
Add to site config to prevent stale serving:
```
location / { add_header Cache-Control "no-store" always; }
```

## Pitfalls
- `data-cf-rl="false"` does NOT consistently override Rocket Loader on Free plan
- Dashboard Off toggle does NOT take effect until Purge Everything completes
- Duplicate inline `<script>` blocks don't throw errors; they just render nothing
- Browser console eval may return `about:blank` in sandboxed environments; verify with screenshot + manual inspection instead
- SSH heredocs are fragile with Python; prefer `execute_code` or write-then-run scripts over inline heredoc with quotes
- **Cloudflare Tunnel edge cache masks SCP updates**: after `scp` of a static file, `curl https://site/styles.css` still returns OLD bytes because CF caches with `Cache-Control: max-age=14400` (4h). Symptom: VPS origin file is correct (verify via `ssh … md5sum / wc -c`), but the public URL serves stale content. Fix: append a version query to the asset link in HTML (`<link href="styles.css?v=20260814b">`) — the query string busts the edge cache and forces a fresh origin fetch. Do NOT rely on Dashboard "Purge Everything" when you can just bump the query string.
- **flex-column parent shrinks image child to height:0**: a card with `display:flex; flex-direction:column` will flex-shrink a child that only has `height:180px` down to `offsetHeight:0` (invisible). The child disappears from layout and vision screenshots. Fix: give the image `flex:0 0 180px` (no grow, no shrink, fixed basis). Always verify with `browser_console` measuring `el.offsetHeight`, not by eyeballing.
- **Vite builds without error but produces no JS bundle**: This happens when `index.html` lacks the `<script type="module" src="/src/main.jsx">` entry tag. Vite sees no entry point, builds "successfully" (with just 2 modules — the HTML template itself), and produces a `dist/index.html` with no `<script src>` tags and no `dist/assets/` directory. The site goes live with an empty `<div id="root">` and no JS to render it. **Diagnosis**: check the build output — if it says "✓ 2 modules transformed" (instead of 30+), or if `dist/assets/` doesn't exist after `npm run build`, the entry script tag is missing. **Fix**: add `<script type="module" src="/src/main.jsx"></script>` before the closing `</body>` tag in `index.html`. This pitfall is especially dangerous because `npm run build` reports success with exit code 0 and no error messages.

## Verify rendering / image display correctly (static sites too)
- **`curl` 200 on an image/CSS is NOT proof it renders.** It only proves the bytes are reachable. Real checks:
  - Browser console: `document.querySelectorAll('.card-pic').length` and `.map(e=>e.offsetHeight)` — every visible image must be `> 0`. (`offsetHeight:0` = not rendered even if HTTP 200.)
  - Browser console: `getComputedStyle(el).backgroundImage` must contain the real `https://…/assets/x.jpg` URL (not `none`).
  - Hero background `opacity` must not be near-0 hiding the image under an overlay.
- **Vision screenshot only captures the viewport top.** It will report "no card images" for below-fold sections (Story/Experiences) even when `offsetHeight` proves they render. Trust `browser_console` `offsetHeight` over the vision model's "I don't see it" when the model only saw the hero.
- For a full end-to-end check use the browser tool against the LIVE URL (`https://ftg.esggo.co/`), not just `file://` — `file://` skips Cloudflare cache and can hide stale-cache bugs.

## Static (non-SPA) deploy via Cloudflare Tunnel
FTG 3.0 is a plain static site (no build step). Deploy:
1. `scp -i ~/.ssh/esggo_original index.html styles.css app.js ubuntu@161.118.248.180:/var/www/ftg-tours/`
2. `scp … assets/*.jpg ubuntu@161.118.248.180:/var/www/ftg-tours/assets/`
3. **Bump the asset version query** in `index.html` (`styles.css?v=<date>` / `app.js?v=<date>`) on every CSS/JS change so CF edge cache re-fetches.
4. Verify: `curl -I https://ftg.esggo.co/styles.css?v=<date>` → 200, then `browser_console` `offsetHeight` check on the live URL.
- No nginx reload needed: the Cloudflare Tunnel (`/etc/cloudflared/config.yml`, hostname `ftg.esggo.co`) serves `/var/www/ftg-tours/` directly.
- VPS origin sanity check (bypass CF): `ssh ubuntu@161.118.248.180 'md5sum /var/www/ftg-tours/styles.css'` — compare against `md5sum` of the local file you SCP'd.

## Platform Notes
- Deploy via scp to VPS `/var/www/ftg-tours/`
- Run `sudo systemctl reload nginx` after deploy
- VPS IP: 161.118.252.147, user: ubuntu, SSH key: read directly from local file
