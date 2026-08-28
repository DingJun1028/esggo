---
name: hermes-desktop-plugin-all-surfaces
description: Scaffold a single Hermes desktop plugin that registers ALL FOUR UI surfaces at once (status-bar chip, layout pane, ⌘K command, full page + sidebar nav). Includes the mandatory pre-write export check and the usePluginI18n pitfall.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [desktop, plugins, ui, statusbar, pane, palette, route]
    category: desktop
    related_skills: [hermes-desktop-plugins]
---

# Hermes Desktop Plugin — All Four Surfaces

Build ONE plugin that contributes every UI surface (status-bar chip, layout
pane, ⌘K command, full page route + sidebar nav) in a single
`desktop-plugins/<id>/plugin.js` file. Drop the file, then ⌘K → **Reload
desktop plugins**.

Companion to `hermes-desktop-plugins` (the general skill). Use this when the
user wants the full spread, or as a copy-paste scaffold for any plugin.

## Why a pre-write export check is mandatory

The disk file is loaded **uncompiled** by the desktop app. A bad import
(e.g. a constant that doesn't exist) throws a load-time `ReferenceError` and
the plugin never loads — and you usually can't runtime-test it on the machine
you're authoring on (the desktop app may not be installed there). So you must
confirm every identifier against the authoritative source BEFORE writing.

### Verify exports (do this first, every time)

1. Fetch the canonical reference:
   `web_extract` → `https://hermes-agent.nousresearch.com/docs/developer-guide/desktop-plugin-sdk`
   (cache it; the page is stable).
2. Cross-check the **"SDK exports at a glance"** table. The constants you will
   typically use:
   - Areas: `PANES_AREA` (`'panes'`), `ROUTES_AREA`, `SIDEBAR_NAV_AREA`,
     `STATUSBAR_AREAS` (`.left`/`.right`), `PALETTE_AREA`, `KEYBINDS_AREA`,
     `TITLEBAR_AREAS`, `THEMES_AREA`, `COMPOSER_AREAS`.
   - React/state: `useValue`, `atom`, `computed`, `useQuery`, `useMutation`,
     `useQueryClient`, `queryClient`, `Contribute`.
   - UI kit: `Button`, `Tip`, `Codicon`, `Badge`, `cn`, `StatusDot`, …
   - Helpers: `host`, `haptic`, `icons`, `relativeTime`, `fmtDateTime`, …
3. **Only** the import specifiers `@hermes/plugin-sdk`, `react`, and
   `react/jsx-runtime` resolve. Anything else fails to load on purpose.

## PITFALL — the `usePluginI18n` / `ctx.i18n` trap

The `hermes-desktop-plugins` template uses `usePluginI18n(ID)` and
`ctx.i18n.register(...)`. **These are NOT in the official SDK export list.**
The docs list `useI18n` (a hook for the app's own copy) — there is no
`usePluginI18n` and no `ctx.i18n` documented. If the template's i18n import is
left in, the plugin can throw at load.

Safe default: skip i18n entirely; write literal strings (Traditional Chinese
if that's the user's preference) directly in `jsx()` calls. Note in the
deliverable how to add i18n later via the documented `useI18n` hook, and do NOT
import `usePluginI18n`/`ctx.i18n`.

## Scaffold (all four surfaces)

Save as `<hermes home>/desktop-plugins/<id>/plugin.js` (folder name == `id`).

```javascript
import {
  host, haptic, useValue,
  STATUSBAR_AREAS, PANES_AREA, ROUTES_AREA,
  SIDEBAR_NAV_AREA, PALETTE_AREA, Tip, cn, Button
} from '@hermes/plugin-sdk'
import { jsx, jsxs } from 'react/jsx-runtime'

const ID = 'esggo-hub'
const PAGE_PATH = '/esggo-hub'

function HubChip() {
  const gateway = useValue(host.state.gateway)
  const dot = gateway === 'open' ? 'var(--ui-accent)' : 'var(--ui-text-quaternary)'
  return jsx(Tip, {
    label: `gateway: ${gateway} — 點擊查看詳情`,
    children: jsx('button', {
      type: 'button',
      className: cn(
        'inline-flex h-full items-center gap-1 px-1.5 text-[0.6875rem] transition-colors',
        'text-(--ui-text-tertiary) hover:bg-(--ui-stroke-secondary) hover:text-foreground'
      ),
      onClick: () => {
        haptic('tap')
        host.notify({ kind: 'info', title: 'ESGGO Hub',
          message: `gateway: ${gateway}\nmodel: ${host.state.model.get()}\ncwd: ${host.state.cwd.get()}` })
      },
      children: [jsx('span', { className: 'h-1.5 w-1.5 rounded-full', style: { background: dot } }), 'ESGGO']
    })
  })
}

function HubPane() {
  const gateway = useValue(host.state.gateway)
  const model = useValue(host.state.model)
  const cwd = useValue(host.state.cwd)
  const session = useValue(host.state.activeSessionId)
  return jsxs('div', {
    className: 'flex h-full flex-col gap-2 p-3 text-sm',
    children: [
      jsx('div', { className: 'font-medium', children: 'ESGGO Hub' }),
      jsx('div', { className: 'text-(--ui-text-quaternary)', children: `gateway: ${gateway}` }),
      jsx('div', { className: 'text-(--ui-text-quaternary)', children: `model: ${model}` }),
      jsx('div', { className: 'text-(--ui-text-quaternary)', children: `session: ${session ?? '—'}` }),
      jsx('div', { className: 'text-(--ui-text-quaternary)', children: `cwd: ${cwd}` }),
    ]
  })
}

function HubPage() {
  const model = useValue(host.state.model)
  return jsxs('div', {
    className: 'flex h-full flex-col gap-4 p-6',
    children: [
      jsx('div', { className: 'text-lg font-semibold', children: 'ESGGO Hub' }),
      jsx('div', { className: 'text-(--ui-text-tertiary)', children: `model: ${model}` }),
      jsx(Button, { onClick: () => host.notify({ kind: 'info', message: 'hi' }), children: '動作' })
    ]
  })
}

export default {
  id: ID,
  name: 'ESGGO Hub',
  register(ctx) {
    ctx.registerMany([
      { id: 'chip', area: STATUSBAR_AREAS.right, order: 130, render: () => jsx(HubChip, {}) },
      { id: 'pane', area: PANES_AREA, title: 'esggo hub',
        data: { placement: 'right', width: '260px' }, render: () => jsx(HubPane, {}) },
      { id: 'page', area: ROUTES_AREA, data: { path: PAGE_PATH }, render: () => jsx(HubPage, {}) },
      { id: 'nav', area: SIDEBAR_NAV_AREA, data: { path: PAGE_PATH, label: 'ESGGO Hub', codicon: 'dashboard' } },
      { id: 'open', area: PALETTE_AREA, data: {
        id: 'esggo-hub.open', label: 'Open ESGGO Hub',
        keywords: ['esggo', 'hub', '柏克萊'], run: () => host.navigate(PAGE_PATH) } }
    ])
  }
}
```

## How to run / deliver

1. Write the file to `$HERMES_HOME/desktop-plugins/<id>/plugin.js`.
   - Default home: `~/.hermes` → `C:\Users\<user>\AppData\Local\hermes\desktop-plugins\`.
   - Under a named profile: `~/.hermes/profiles/<name>/desktop-plugins/<id>/`.
2. Tell the user to run **Reload desktop plugins** from ⌘K. The app watches the
   dir and hot-reloads every save.
3. If loading fails, the app shows a toast naming the error — fix the file and
   save again.

## Verification (without the desktop app installed)

- `node --check <path>` to confirm valid ESM syntax. NOTE: the agent harness's
  auto-linter may mangle Windows paths and try to *execute* the file — ignore a
  `MODULE_NOT_FOUND` / `C:\c\Users\...` style error; run `node --check`
  yourself on the real path.
- Re-read the import list against the docs table from step 1 — every identifier
  in a `jsx()` call must be imported.
- State honestly that you could NOT runtime-reload (desktop app absent): ask
  the user for any error toast text if loading fails.

## Adding a Python backend (ctx.rest / ctx.socket)

When the plugin needs server-side data, ship a backend under a **regular**
Hermes plugin dir (NOT the desktop-plugins dir) and reach it via `ctx.rest`.

```
~/.hermes/plugins/<id>/dashboard/
├── manifest.json        # { "name": "<id>", "api": "plugin_api.py" }
└── plugin_api.py        # exports `router = APIRouter()`
```

`plugin_api.py` (FastAPI `APIRouter`, routes mount under `/api/plugins/<id>/`):
```python
from fastapi import APIRouter
router = APIRouter()
@router.get("/status")
async def status():
    return {"ok": True}
```
Frontend call (namespace-relative, auto-scoped to `/api/plugins/<id>`):
```javascript
const { data } = useQuery({ queryKey: [ID, 'status'], queryFn: () => ctx.rest('/status'), refetchInterval: 15000 })
```

### The Python backend is a SEPARATE gate from the desktop enable toggle

- Enabling the plugin in **Settings → Plugins** (desktop app) is renderer-side
  and does NOT import Python.
- The backend mounts only if the plugin id is in `plugins.enabled` in
  `config.yaml` (security boundary GHSA-mcfc-hp25-cjv7). With it off,
  `ctx.rest(...)` rejects → the UI should show a friendly "backend not enabled"
  state (handle `isError` in the query).
- **The agent harness REFUSES to edit `config.yaml` directly** (security). Use
  the CLI instead:
  `hermes config set plugins.enabled '["esggo-hub"]'`
  then verify with `hermes config get plugins.enabled` and **restart the
  gateway** (backend routes mount at startup). Tail `~/.hermes/logs/errors.log`
  for `Failed to load plugin <id> API routes`.
- Project plugins (`./.hermes/`) never auto-import Python.

### Runtime-verify the backend WITHOUT the desktop app

You can fully exercise the backend headlessly, because the gateway runs in its
own venv (system `python3` usually lacks `fastapi`):
```bash
V="$LOCALAPPDATA/hermes/hermes-agent/venv/Scripts/python.exe"   # windows
"$V" - <<'PY'
import importlib.util, asyncio
spec = importlib.util.spec_from_file_location("api", r"~/.hermes/plugins/<id>/dashboard/plugin_api.py")
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
print([getattr(r,'path',None) for r in m.router.routes])
print(asyncio.run(m.status()))
PY
```
Do NOT read secrets: expose only booleans/metadata (e.g. `env_present: (p/'.env').exists()`),
never the secret values. For Firebase data you need a service account JSON +
`firebase-admin` — ask the user for it; never read their `.env`.

### Pitfall: harness auto-linter mangles Windows paths

`write_file` on a `.js` may report a false `MODULE_NOT_FOUND` with a doubled
path like `C:\c\Users\...` — it tried to *execute* the file instead of
syntax-checking. Always re-verify with `node --check <real-path>` yourself.

## Extra surfaces (keybind, titlebar control)

Both shapes are confirmed in the SDK docs:

Keybind — registered once, user-rebindable in settings (`defaults` is just the
initial binding):
```javascript
ctx.register({
  id: 'refresh', area: KEYBINDS_AREA,
  data: { id: '<id>.refresh', label: 'Refresh …', category: '…',
    defaults: ['mod+shift+r'], run: () => queryClient.invalidateQueries({ queryKey: STATUS_KEY }) }
})
```

Titlebar control that lives/dies with a page — render `<Contribute>` INSIDE
the page component (not `ctx.register`, which is permanent):
```javascript
import { Contribute, TITLEBAR_AREAS, Button } from '@hermes/plugin-sdk'
jsx(Contribute, {
  area: TITLEBAR_AREAS.center, id: '<id>:ctrl',
  children: jsx(Button, { variant: 'ghost', size: 'sm', onClick: () => … }, …)
})
```
NOTE: `Button` prop names (`variant`, `size`) are NOT documented in the SDK
reference — they come from UI-kit convention and degrade gracefully (unknown
props are ignored, not fatal). If a surface misbehaves, that's the first thing
to drop.

## DO NOT guess: THEMES_AREA / DesktopTheme

The SDK doc only shows `ctx.register({ id, area: THEMES_AREA, data: myDesktopTheme })`
with NO field list. The only public "skin schema" (joeynyc/hermes-skins,
28 color keys) is the **CLI/TUI skin** YAML — a DIFFERENT object from the
desktop `DesktopTheme` (CSS-var based). Do not feed the CLI schema to
`THEMES_AREA`; it will likely fail to load or render wrong. Skip theme
contributions until the real `DesktopTheme` shape is confirmed from
`apps/desktop/src/sdk/index.ts` or a bundled-theme example. Report it as
skipped with this reason rather than fabricating colors.

## Best-practice checklist (verified against SDK pitfalls)

- [ ] Only imports `@hermes/plugin-sdk`, `react`, `react/jsx-runtime`.
- [ ] No hardcoded colors — only `var(--ui-*)`.
- [ ] UI via `jsx()` calls, not JSX syntax.
- [ ] Handlers read state imperatively (`atom.get()`), never from render closure.
- [ ] `useValue` only in the leaf that renders the value.
- [ ] Loading state uses `Skeleton`, not hand-rolled "loading…" text.
- [ ] For `ctx.rest` polling with no retry-on-disable, set `retry: false`
      (avoid noisy repeated failed retries); keep a polling fallback when using
      `ctx.socket` (no-op on OAuth remotes).
- [ ] Toasts: short `message` + multi-line `detail`; don't cram `\n` into message.
- [ ] Split permanent chrome (`ctx.register`) vs mount-scoped (`<Contribute>`).
- [ ] No `usePluginI18n`/`ctx.i18n` (not in export list) — use literal strings.

## Other pitfalls (from the docs)

- No JSX syntax — only `jsx()` / `jsxs()` from `react/jsx-runtime`.
- Never hardcode colors; use `var(--ui-text-*)`, `var(--ui-stroke-*)`,
  `var(--ui-accent)`. Panes already sit on the editor bg — leave it alone.
- Read state imperatively (`atom.get()`) in handlers, not from render closures.
- Subscribe (`useValue`) only in the leaf that renders the value.
- Don't poll `host.request` faster than a few seconds; prefer `host.onEvent` /
  `ctx.socket` + React Query dedup. `ctx.socket` is a no-op on OAuth remotes —
  always keep a polling fallback.

## 操作手冊（下一步）

### 啟用與驗證

```bash
# 1. 確認插件已開啟
hermes config get plugins.enabled
# 若回傳 ["esggo-hub"] 則 OK；若不是：
hermes config set plugins.enabled '["esggo-hub"]'

# 2. 重啟 gateway 掛載 Python 後端
hermes update --no-backup --yes

# 3. 測試後端 API
curl -s http://localhost:8786/api/plugins/esggo-hub/status | python3 -m json.tool
# 成功看到 {"ok":true,"branch":"main",...} 則後端啟用成功

# 4. 檢查錯誤 log
tail -f ~/AppData/Local/hermes/logs/errors.log | grep -i esggo-hub
```

### 桌面 app 內操作

- `⌘K` → `Reload desktop plugins`
- 右側 pane → 確認顯示 branch/dist 等資料
- `⌘K` → `Open ESGGO Hub` → 頁面開啟
- `mod+shift+r` → 刷新
- 點擊狀態列 ESGGO chip → toast 彈出

### 相關檔案

| 位置 | 目的 |
|------|------|
| `desktop-plugins/esggo-hub/plugin.js` | 前端插件（4 種 UI） |
| `plugins/esggo-hub/dashboard/plugin_api.py` | Python 後端（REST + WS） |
| `plugins/esggo-hub/dashboard/manifest.json` | 後端掛載 manifest |
| `scripts/verify-and-troubleshoot.sh` | 驗證 & 排錯腳本 |
| `references/checklist.md` | 完整檢查清單 |

## Theme contribution（DesktopTheme）

The SDK docs only show `ctx.register({ id, area: THEMES_AREA, data: myDesktopTheme })` without the full shape. The real `DesktopTheme` type lives at `apps/desktop/src/themes/types.ts` in the hermes-agent repo:

```typescript
export interface DesktopTheme {
  name: string              // filename-safe slug
  label: string             // display name in theme picker
  description: string       // tooltip
  colors: {
    background, foreground, card, cardForeground, muted, mutedForeground,
    popover, popoverForeground, primary, primaryForeground, secondary,
    secondaryForeground, accent, accentForeground, border, input,
    ring, destructive, destructiveForeground,
    sidebarBackground?, sidebarBorder?, userBubble?, userBubbleBorder?
  }
  darkColors?: { ...same as colors... }   // omit = reuse colors for dark
  typography?: { fontSans, fontMono, fontUrl? }
  terminal?: { foreground?, cursor?, selectionBackground?, ansi colors... }
  darkTerminal?: { ...same as terminal... }
}
```

### Example theme contribution

```javascript
import { THEMES_AREA } from '@hermes/plugin-sdk'

ctx.register({
  id: 'my-theme',
  area: THEMES_AREA,
  data: {
    name: 'my-theme',
    label: 'My Theme',
    description: 'A custom theme',
    colors: {
      background: '#0a0f1f',
      foreground: '#f5f5f5',
      card: '#151a30',
      cardForeground: '#e0e0e0',
      muted: '#7a7a9a',
      mutedForeground: '#b0b0b0',
      popover: '#151a30',
      popoverForeground: '#e0e0e0',
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
      secondary: '#64748b',
      secondaryForeground: '#f8fafc',
      accent: '#10b981',
      accentForeground: '#ffffff',
      border: '#252b44',
      input: '#252b44',
      ring: '#3b82f6',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      sidebarBackground: '#0a0f1f',
      sidebarBorder: '#252b44',
      userBubble: '#e0e0e0',
      userBubbleBorder: '#64748b'
    },
    // darkColors omitted = reuse colors for dark mode
  }
})
```

### Pitfalls

- **Never use CLI skin YAML** (joeynyc/hermes-skins) — that's for the terminal emulator, not the desktop app.
- **No hardcoded colors** in JSX (e.g., `style={{ background: '#0a0f1f' }}`) — use the CSS vars (`var(--ui-background)`) instead.
- The theme appears in **Settings → Appearance → Theme picker** and can be switched live.
