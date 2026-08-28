---
name: cf-rocket-loader-spa-fix
description: Fix Cloudflare Rocket Loader breaking Vite/React SPAs on free plan. Use when site blank, console shows 'Cannot use import.meta outside a module', or script type is rewritten to dynamic nonce.
---

# Cloudflare Rocket Loader + Vite SPA Fix

## Trigger
- FTG/SPA 白畫面
- Console error: `Cannot use 'import.meta' outside a module` at `rocket-loader.min.js`
- `<script type="module">` rewritten to dynamic nonce type by Cloudflare

## Root Cause
Cloudflare Rocket Loader (Free plan) rewrites `<script type="module">` to classical-script injection, losing module context. Vite bundles contain `import.meta` which crashes in classical script context.

## Fix Steps (pick one)

### Option A: Disable Rocket Loader (preferred)
1. Cloudflare Dashboard → Speed → Optimization → Rocket Loader → **Off**
2. Caching → Purge Everything
3. If still blank after purge: rebuild with Option B

### Option B: Inline JS + patch import.meta
When Rocket Loader cannot be disabled, inline entire JS into index.html and patch `import.meta`:

```python
import re
from pathlib import Path

html = Path('dist/index.html').read_text()
js = Path('dist/assets/[hash].js').read_text()

# 1. Fix import.meta for classical script context
for bad, good in [
    ('import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href', 'new URL(e,location.href).href'),
    ('import.meta.url', 'location.href'),
    ('import.meta.resolve', 'function(x){return new URL(x,location.href).href;}'),
]:
    js = js.replace(bad, good)

# 2. Escape </script> so HTML parser doesn't truncate
js = js.replace('</script>', '<\\/script>')

# 3. Inline into first <script> tag
m = re.search(r'(<script[^>]*>)(.*?)(</script>)', html, re.DOTALL)
fixed = html[:m.start()] + m.group(1) + js + m.group(3) + html[m.end():]

Path('dist/index.html').write_text(fixed)
```

**Note**: `data-cf-rl="false"` often fails on Free plan. Inline is more reliable.

### Vite config (future prevention)
Add to `vite.config.js` to remove `import.meta` at build time:
```js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // ensure no import.meta in bundle
      }
    }
  }
})
```

## Necessary Cloudflare Settings
- Disable Rocket Loader for the zone
- Add `Cache-Control: no-store` to nginx to prevent stale HTML serving
- Purge everything after deploy

## Platform Notes
- Use `[hash]` actual JS filename from `dist/assets/`
- Deploy via scp to VPS `/var/www/ftg-tours/` (or project root)
- Run `sudo systemctl reload nginx` after deploy
- Verify with browser screenshot, not just HTML curl (SPA root is empty until JS executes)
