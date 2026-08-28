# FTG Tours blank-page Rocket Loader evidence

Site: https://ftg.esggo.co/
Repo: C:\Project\ftg-tours-website
VPS: ubuntu@161.118.252.147:/var/www/ftg-tours/

## Confirmed console error (inline app JS still blank)

```
VM228:9 Uncaught SyntaxError: Failed to execute 'insertBefore' on 'Node': Cannot use 'import.meta' outside a module
    at t.activateScript (rocket-loader.min.js:1:11855)
```

Occurs after:
- `data-cf-rl="false"` was added
- app JS was inlined into `<script crossorigin>...</script>`
- `</script>` inside JS was escaped as `<\\/script>`

Root cause: Vite's built JS contains literal `import.meta.resolve(...)` and `import.meta.url` references. Rocket Loader executes the inline block as a classical script; `import.meta.*` in a classical context throws immediately, killing the bundle before `createRoot` runs.

Verified by remote fetch that inline block length == index-DqXWGH7-.js byte size, but `import.meta` count in deployed HTML > 0.

## Confirmed Free-plan limitations

- Cloudflare zone settings API `PATCH /zones/{id}/settings/rocket_loader` -> `invalid object identifier`
- `data-cf-rl="false"` does not stop rewrite when Rocket Loader is on
- `type="text/javascript"` is still rewritten by Rocket Loader
- Dashboard toggle exists at Speed -> Optimization -> Rocket Loader, but requires user action or plan eligibility

## What eventually cleared blank rendering for this session

1. Patch built JS before inlining:
   - replace `import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href` -> `new URL(e,location.href).href`
   - replace `import.meta.url` -> `location.href`
   - replace `import.meta.resolve` -> `function(x){return new URL(x,location.href).href;}`
2. Verify 0 remaining `import.meta` in deployed HTML.
3. Redeploy + reload nginx.

## Other findings this session

- React 19 + React Router 7 blank subpages: removing StrictMode + switching to HashRouter fixes the mount layer; Rocket Loader is a separate layer on top.
- `gh secret get` does not exist in `gh` 2.96.0; only `gh secret list/set` are available.
- `browser_snapshot` reports `(empty page)` / `element_count: 0` on fully rendered FTG pages due to automation stealth limitations; Treat snapshot as suspicious if other signals (body bg color, React markup in HTML source) indicate render occurred.
