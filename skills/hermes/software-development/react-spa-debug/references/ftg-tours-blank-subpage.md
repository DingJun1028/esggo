# Vite + React 19 + React Router 7 SPA blank subpage + Cloudflare Rocket Loader

## Session date
2026-07-23

## Symptoms seen
- `/subpage` → HTTP 200, but browser snapshot shows `(empty page)`, `element_count: 0`
- Console: completely empty (no JS errors)
- `<div id="root">` exists and stays empty after JS execution

## True root cause (verified)
Cloudflare **Rocket Loader** silently rewrites `<script type="module" src="...">` to
`<script type="<hash>-module" crossorigin src="...">`.
That rewritten script type causes browsers to skip execution. Because Rocket Loader
itself does not report an error, React never mounts, console stays clean, and the
result is a white page.

## Confirmations
- Local bundle contained `HashRouter`, `HashRouter` alias, `createRoot`, routes —
  no `BrowserRouter`, no `React.StrictMode`.
- Remote HTML obtained via curl showed script tag as:
  `<script type="04e6986da726629b1ce028c8-module" crossorigin src="/assets/index-xxx.js">`
- Cloudflare Dashboard → Speed → Optimization → Rocket Loader was enabled.

## Failed (`data-cf-rl`) to work
- Adding `data-cf-rl="false"` on the `<script>` tag did not prevent rewrite.
- Switching the script tag to `type="text/javascript"` did **not** prevent rewrite;
  Rocket Loader rewritten the tag to `type="<hash>-text/javascript"`.

## Free plan limitation
- Rocket Loader cannot be fully disabled on Cloudflare Free plan via settings API
  in this project's setup path; changing Rocket Loader state via the API
  (`/zones/{zone_id}/settings/rocket_loader`) failed with invalid identifier in
  this environment.

## Reliable workaround
Inline the app JS into `index.html` as a plain `<script>` with no external `src`:
- Rocket Loader has no external JS asset to rewrite/load.
- There are no script-type changes, so browser executes the bundle normally.

## Caveats of inline workaround
- Increases `index.html` size with the full React bundle.
- Ensure Cloudflare compression (Brotli/gzip) still applies to HTML; otherwise use
  `text/javascript` + `defer` as fallback and verify Rocket Loader behavior on
  your specific plan.

## Minimal reproduction / checklist
1. Build: `pnpm run build`
2. Inline built JS into `dist/index.html` script tag.
3. Deploy to VPS; confirm remote `index.html` has no `<script src="...">` for app code.
4. Visit page: should render even with Rocket Loader still enabled.

## Inline script snippet
```python
import re
html = open('dist/index.html').read()
js = open('dist/assets/index-<hash>.js').read()
html = re.sub(r'<script[^>]*src="[^"]*\.js"[^>]*></script>', f'<script crossorigin>{js}</script>', html)
open('dist/index.html','w').write(html)
```
