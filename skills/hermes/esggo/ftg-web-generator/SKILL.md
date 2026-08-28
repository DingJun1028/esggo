---
name: ftg-web-generator
description: Generate & deploy FTG static sites via CLI+MCP; no GUI tools
---

# FTG Web Generator (墾趣旅遊 網頁參數化生成器)

## When to use
- User asks to build / iterate / deploy a 墾趣旅遊 (FTG) web page (any version: 2.0 / 2.5 / 2.7 / 2.8 / 3.0 / 2.9 …).
- User says "use tool X" where X = Google Stitch / Pencil / any GUI-or-cloud design tool **without a public API**.

## Core principle — programmatic, not GUI
User explicitly prefers **CLI / MCP / API** workflows over GUI design tools. When they name a GUI tool:
- **Google Stitch**: cloud tool, needs Google account login, **no public CLI/MCP/API** → cannot be agent-operated. Build an equivalent parametric generator instead.
- **Pencil (Evolus)**: pure desktop GUI, no CLI/MCP/API → same.
- **FAL image API** (Nous subscription active) IS callable → use it to generate hero/card photos programmatically (this is the "API 運用" path).

So: never try to "launch" or "operate" the GUI tool. Build a generator that produces the same visual outcome as deployable HTML/CSS/JS, then verify live.

## Toolkit (lives in repo)
`apps/ftg-tools/`
- `ftg-gen.js` — CLI parametric generator
- `ftg-mcp/server.js` — stdio MCP server (tools: `generate_ftg_page`, `deploy_ftg_page`)
- `fal-images.js` — **Path C (API 運用)**: calls FAL REST API to generate per-theme photos; gracefully falls back to local assets when `FAL_KEY` is absent or the call fails (never breaks generation).
- `fal-images.test.mjs` — 2 tests: no-key fallback + API-failure fallback.
- `server.test.mjs` — 3 tests: CLI gen / tools-list / deploy-precheck.
- `package.json` — `bin: ftg-gen`, `mcpServers.ftg-mcp`, `test` script runs both *.test.mjs.

### Path C — FAL image API (`fal-images.js`)
`generateForTheme(theme, outDir, localAssetsDir)`:
1. If `FAL_KEY` (or `FAL_API_KEY`) env unset → copy local `*.jpg` (hero/stay/eco/craft/market/restore) and return `{source:'local-fallback', reason:'no FAL_KEY'}`. **No network call, no error.**
2. Else `POST https://fal.run/fal-ai/flux/dev` with `Authorization: Key <key>`, body `{prompt, image_size:'landscape', num_images:1}`, then `https.get` the returned `images[0].url` and save to `outDir`.
3. On ANY failure (timeout/non-200/parse) → catch, copy local assets, return `{source:'local-fallback', reason:<err>}`.

`ftg-gen.js` calls `generateForTheme` inside an async IIFE after writing HTML/CSS/JS, so generation **always completes** even offline. Prompts per slot live in `fal-images.js` `PROMPTS`. Override model with `FAL_MODEL` env.

> Reusable lesson: **API-first with mandatory local fallback** is the only safe pattern for agent-driven asset generation — never let a missing key or network blip abort the whole page build.

### CLI
```bash
node apps/ftg-tools/ftg-gen.js --version 2.9 --theme stitch-dark --lang zh
# themes: stitch-dark | light      langs: zh | en
# → writes apps/ftg-{version}/{index.html,styles.css,app.js,assets/*.jpg}
# reuses photos from apps/ftg-3.0/assets if present
```

### MCP (Hermes / Toolport)
Register in `~/.hermes/config.yaml`:
```yaml
mcp_servers:
  ftg-mcp:
    command: node
    args: ["C:/Project/esggo/apps/ftg-tools/ftg-mcp/server.js"]
```
Tools: `generate_ftg_page {version,theme,lang}`, `deploy_ftg_page {version,host,user}`.
Smoke test: `printf '{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n' | node ftg-mcp/server.js`

## Deploy target (VPS) — VERIFIED 2026-08-26
- Cloudflare Tunnel routes `ftg.esggo.co` → `/var/www/ftgtours/` (**no hyphen** — it is `ftgtours`, NOT `ftg-tours`).
- Root `ftg.esggo.co/` = FTG 3.0, served from `/var/www/ftgtours/index.html` (flat layout: `index.html`, `styles.css`, `app.js`, `assets/`, `images/`, `subpage-images/`, `logos/`).
- Versioned dirs (`ftg-2.0` … `ftg-3.0`) exist as siblings but the LIVE ROOT is the flat 3.0 tree above — do not scp a version subdir expecting it to become the homepage.
- SCP needs `sudo mkdir -p` + `chown ubuntu:ubuntu` (VPS /var/www is root-owned; plain scp gets Permission denied). For a full **pull** snapshot: `scp -r ubuntu@161.118.248.180:/var/www/ftgtours/ <local>` — note scp adds an extra `ftgtours/` wrapper, so real files land in `<local>/ftgtours/`.

## Pitfalls (real, learned this session)

**P10 — Missing component imports in Vite/React SPA pages.** When building a multi-page Vite+React SPA for FTG, service page components (e.g. `ImageCarousel`) are used in JSX but the `import` statement is omitted. Vite/Rollup fails at build time with `X is not defined`. Fix: add `import ImageCarousel from '../components/ImageCarousel'` to every service page that uses it. Verify by `grep -c ImageCarousel src/pages/*.jsx` — expect 2 (import+usage) for all service pages, 0 for Home.

**P11 — External image URLs break offline/reliability.** Hero sections that reference Unsplash or remote URLs fail when network is unavailable or the URL changes. Always replace external image URLs with local assets under `public/subpage-images/` and add `loading="eager" decoding="async"`.

**P12 — CSS component classes defined in index.css must be imported.** Pages reference reusable classes (`.btn-primary`, `.card-elevated`, `.section-title`, etc.) defined in `src/index.css` `@layer components`. If `index.css` is not imported in `src/main.jsx`, Tailwind won't generate these classes and UI breaks silently.

**P13 — HashRouter avoids server-side routing config.** For static VPS hosting (nginx serving `dist/`), use `HashRouter` instead of `BrowserRouter` to avoid 404s on page refresh. Routes are `/#/`, `/#/corporate-travel`, etc.

See also: `references/vite-react-spa-pattern.md` — full build/verify checklist for the Vite+React+Tailwind FTG SPA pattern.

**P1 — Cloudflare cache hides CSS/JS edits.** CF caches `max-age=14400`. After editing styles.css the browser still gets old bytes. Fix: reference with version query `styles.css?v=20260814c` (bump each deploy). Proof chain: `curl` live URL shows new bytes, but `browser_vision` alone may miss it because it reads cached CSS. Always confirm via console/DOM probe, not just screenshot.
**P2 — esggo-core EADDRINUSE crash loop breaks CI.** Symptom: GitHub Action "Deploy to Oracle VPS" exits 1 with `pm2 speedList TypeError: Cannot read properties of undefined (reading 'pm2_env')`. Root: multiple `esggo-core` PM2 instances fight for port 3000 (EADDRINUSE, 1900+ restarts). Fix on VPS: `pm2 delete esggo-core; sudo fuser -k 3000/tcp; sleep 2; pm2 start ecosystem.config.cjs --only esggo-core; pm2 save`. Then rerun the failed Actions run (gh run rerun <id>).
**P3 — `path.resolve` double `apps/`.** In ftg-gen.js never do `path.resolve(out)` where `out` default already contains `apps/ftg-X` while cwd/`__dirname` also points into `apps/`. Use `path.resolve(__dirname, '..', 'ftg-' + version)` so output is always `esggo/apps/ftg-{version}` regardless of cwd. (MCP sets cwd=ROOT; CLI run from anywhere must also land correctly.)
**P4 — MCP stdio must await Promises.** `handle()` returns a Promise for `tools/call`; the `rl.on('line')` writer must `Promise.resolve(r).then(...)` before `JSON.stringify`, else it serializes `{}` and the call looks empty.
**P5 — `hermes verify` false-negative on this repo.** It fails at monorepo `pnpm install` postinstall → `prisma generate` EPERM (AV lock on query_engine dll). Unrelated to static FTG files. Verify with targeted checks instead (see below).

**P6 — flex column card image collapses to height:0 (public-hidden, HTTP still 200).** A `.card` using `display:flex; flex-direction:column` lets `.card-pic` get squashed to `height:0` on the public site even though the asset HTTP is 200 and `browser_vision` may not catch it. Fix: add `flex: 0 0 180px;` to `.card-pic` so it keeps a fixed height. Verify in browser console: `document.querySelectorAll('.card-pic').length` and read `offsetHeight` — expect `180` on all six, not `0`. (Confirmed on ftg.esggo.co after the fix.)

**P7 — git-bash + node `execFileSync`/`execFile` with absolute `\` path → MODULE_NOT_FOUND.** In tests or spawned child processes, `node 'C:\\Project\\...\\server.js'` fails under git-bash (MSYS path mangling). Use relative paths (`'./ftg-mcp/server.js'`) or `path.resolve(__dirname, ...)`. Same class as P3 — keep paths relative-to-script, never cwd-dependent.

**P8 — MCP tool params must be whitelisted before shell use.** `deploy_ftg_page` builds shell strings from `version/host/user`. Without sanitising, an external caller can inject. Harden: `safeVer/safeHost/safeUser` regex `^[a-zA-Z0-9.\-]+$`, and pull SSH key / VPS host / user from env (`FTG_SSH_KEY` / `FTG_VPS_HOST` / `FTG_VPS_USER`) with safe defaults — never hard-code `~/.ssh/esggo_original` or the IP in the command string. Also add a **deploy precheck**: verify `index.html/styles.css/app.js` exist locally before scp; reject with `本地產出缺失` instead of letting scp fail opaquely. (Added in MECE best-practice pass — covered by `server.test.mjs` test 3.)

**P9 — Asset generation must be API-first with mandatory local fallback (Path C).** `fal-images.js` never aborts the page build: with no `FAL_KEY` it copies local `apps/ftg-3.0/assets/*.jpg`; with a key it calls FAL and on any error catches and falls back. `ftg-gen.js` writes HTML/CSS/JS FIRST, then runs `generateForTheme` inside an async IIFE — so even if image fetch hangs/fails, the page files already exist. Verify the chosen path by checking the log line `[ftg-gen] images source=<fal-api|local-fallback>`. Never make image fetching a blocking, non-fallible step in a generator.

**P14 — Broken-image audit: generation completes but upload is skipped → silent 404s.** A recurring failure mode: the image-gen step downloads/saves assets to a local tmp dir (e.g. `C:/Users/dingj/tmp/ftg-assets/`) but the upload-to-VPS step never runs (session ended, tool error, forgot). The HTML references `assets/logo.svg`, `assets/hero.jpg`, `assets/market.jpg`, `assets/eco.jpg`, `assets/craft.jpg`, `assets/stay.jpg` — all return **HTTP 404** while the page HTML itself is 200, so the homepage looks "built" but is fully broken-image. Fix/verify: after ANY FTG deploy, run a `curl` HTTP-status probe against every asset URL the HTML references (loop in `references/ftg-live-snapshot-audit.md`). If any 404, the asset was generated but NOT uploaded — re-run the upload step, don't re-generate. Never claim "site live" on a 200 of the HTML alone.

**P15 — Brand residual: old `望趣旅遊 FTG Tours` pages survive a 3.0 deploy.** Deploying FTG 3.0 to the root does NOT overwrite the older enterprise pages (`features.html`, `services.html`, `process.html`, `contact.html`, `thank-you.html`, `layout.html`) — they keep the legacy brand `望趣旅遊 FTG Tours` (contact `02-7752-7689`, `hello@fgtours.com`, 台北松山, © 2025). This conflicts with the homepage's correct `墾趣旅遊 FTG 3.0`. **Brand rule (hard): the name is strictly `墾趣旅遊`; never `聖趣` / `望趣` / `創價`.** After a 3.0 deploy, grep the deployed tree for `望趣|聖趣|創價` and rewrite/remove those pages so the whole site is consistent. `feedback.html` (ESG 旅程回饋) is the 3.0-style page — keep it.

## Verify before claiming done
1. `node --check ftg-gen.js && node --check ftg-mcp/server.js` (use file-path form, not piped — git-bash prints `stdin is not a tty` noise but still checks).
2. MCP: `printf '...tools/list...\\n' > /tmp/t.txt; node ftg-mcp/server.js < /tmp/t.txt | grep name`
3. Tests: `cd apps/ftg-tools && node --test ftg-mcp/server.test.mjs fal-images.test.mjs` — **5/5 pass** (CLI gen / tools-list / deploy-precheck / FAL no-key fallback / FAL API-fail fallback). This is the repo's `npm test` and the correct "fresh evidence" command (see P5 — do NOT substitute `hermes verify`).
4. Live: `curl -sS -m10 -o /dev/null -w '%{http_code}' https://ftg.esggo.co/{version}/` must be 200, and `grep '<title>'` matches expected version.
5. Images actually render: browser console `cardPicHeights` / per-asset HTTP 200 — a 200 on the HTML does NOT mean images load (flex-height:0 bug hid them while HTTP was 200).
6. **Broken-image probe (P14):** extract every `assets/...` and `images/...` URL referenced in `index.html` and `curl -o /dev/null -w '%{http_code}'` each one — expect 200 on all. Any 404 = asset generated-but-not-uploaded; re-upload, don't regenerate. Recipe in `references/ftg-live-snapshot-audit.md`.
7. **Brand check (P15):** `grep -rl '望趣\|聖趣\|創價' .` over the deployed tree must return nothing. Any hit = residual old-brand page to rewrite.

## MECE best-practice pass (when user says 最佳實踐 / 繼續 / 最佳實踐化整體補強)
Treat that as an auto-execute signal: audit the code with a 7-pillar MECE lens (Correctness / Security / Maintainability / Performance / Extensibility / Observability / Testing), fix REAL defects found in the actual files (not invented ones), add a `TODO.md` grounded in the code, then commit+push. Concrete fixes applied this session on `ftg-tools`:
- Security: command-injection whitelist + env extraction (P8).
- Correctness: deploy-precheck before scp (P8).
- Testing: added `server.test.mjs` (3 tests) + `test` script in package.json.
- Do NOT run `hermes verify` for this repo — it dies on prisma EPERM (P5). Run `node --test` instead and report that as the verification.

## See also
|- `references/recipes.md` — exact gen/deploy/verify command sequences.
|- `references/fal-api.md` — FAL REST shape, fallback contract, slot prompts for Path C.
|- `references/vite-react-spa-pattern.md` — Vite+React+Tailwind SPA build pattern with pitfalls P10–P13.
|- `references/ftg-attachment-out-of-workspace.md` — Hermes 附件路徑超出工作區的處理模式（FTG 製作情境）
|- `references/ftg-526-diagnosis.md` — `https://ftg.esggo.co/` 回 526 快速診斷流程與典型錯誤模式
|- `references/ftg-nginx-server-name-troubleshooting.md` — 526錯誤診斷與 server_name 修復步驟（vps nginx 配置錯配模式）。
|- `references/ftg-live-snapshot-audit.md` — 完整網站快照拉取 + 破圖 404 審計 + 品牌殘留檢查的實測指令（2026-08-26 驗證）。
|- `esggo-vps-toolkit` — broader VPS deploy + Cloudflare Tunnel patterns (consolidation candidate for P1/P2).
