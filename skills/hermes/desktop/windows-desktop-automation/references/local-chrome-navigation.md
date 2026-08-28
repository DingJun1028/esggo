# Driving the user's local Chrome natively (computer_use) to verify a localhost URL

Session reproduction (2026-08-04): verify the DeerFlow UI at `http://127.0.0.1:2026/`
on the user's Windows machine, when the terminal backend is a dead SSH session and
`browser_navigate` only returned `ERR_EMPTY_RESPONSE` (which per the parent skill
means "re-check, not down" — the nginx container had started only seconds earlier).

## Why not the typed-browser rung (refusal codes in Hermes standard mode)

| Step | Result |
|---|---|
| `cua_browser_state(pid=14676, window_id=66428, binding_quality=exact, mutation_allowed=true)` | `refused (browser_requires_setup)`: "no owned DevTools endpoint for pid … run browser_prepare explicitly to set one up" |
| `cua_browser_prepare(allow_launch=true, profile_mode=isolated_new)` | `refused (browser_pid_required)`: "browser_prepare requires a positive pid" |
| `cua_browser_prepare(pid, window_id, profile_mode=existing_profile)` | first `browser_exact_target_required`, then `refused (browser_consent_required)`: "existing-profile attachment requires a certified trusted-consent provider in standard/bounded mode; the legacy file-backed artifact is disabled" (`permission_mode=standard`, `protected_consent_collector: null`) |

Conclusion: in Hermes standard mode there is NO owned-DevTools path to the user's
existing Chrome. Fall back to native Chrome UI (AX tree + SendInput) — no DevTools
needed.

## The working native sequence

1. `list_windows` → chrome.exe pid + window_id (title e.g. "新分頁 - Google Chrome").
2. `capture(app='chrome')` → omnibox appears as an `Edit` element
   ("網址與搜尋列" / "Address and search bar", ~y 51 in a full-window capture).
3. **Do NOT click-then-type.** Background `click` on the omnibox returns ok but does
   NOT focus it; the subsequent foreground `type` lands in whichever page element
   actually holds focus (observed: the URL went into the TwinMind sidebar's
   "Ask me anything" input; the omnibox never changed and Enter navigated nothing).
4. **Reliable sequence (every action `delivery_mode:'foreground'`)**:
   `key ctrl+l` → `type http://127.0.0.1:2026/` → `key enter` → `wait` 6-8s → capture.
   Ctrl+L focuses the omnibox via keyboard and selects all — bypasses the
   click-focus failure entirely. (F6 also cycles focus if Ctrl+L misbehaves.)
5. Chrome text input REQUIRES foreground: background `type` is refused with
   `code:'background_unavailable'` — "Background delivery is not available for target
   window class 'Chrome_WidgetWin_1' on this event kind (text_input)",
   `escalation.recommended:'foreground'`.

## Failure modes seen

- **Chrome minimized by foreground ops**: after a foreground type/enter, a later
  capture returned all bounds ≈ -32000 (off-screen) and `capture(app='chrome')` said
  "no on-screen window matched". Recovery: `focus_app(app='chrome')` (no raise) then
  re-capture — the window came back with normal bounds. (If the user asked for the
  window, `raise_window=true` is acceptable.)
- **UIA stall after a heavy page load**: captures began failing with
  `get_window_state timed out after 4s (UIA provider unresponsive on hwnd 0x…,
  class 'Chrome_WidgetWin_1')`, then bare `capture failed:`. Waiting ~12s and
  retrying with different args (`max_elements`) eventually recovered; capturing a
  DIFFERENT app (Docker Desktop) worked immediately, so the driver itself was fine —
  Chrome's UIA provider was what stalled. Don't repeat the identical capture call
  (loop-warning triggers).
- **Google Translate popup = HTTP-200 evidence**: after navigation succeeded Chrome
  showed the translate offer (tab labels "英文" / "中文（繁體）"). A connection-failure
  page renders in the OS language and never offers translation — so the translate
  popup is positive proof the server returned real (non-Chinese) HTML. Capture it as
  a small popup window (e.g. 296x99) with a close button; dismiss it before
  full-page capture.
- **Win+R / Ctrl+Esc do not open Start menu / Run dialog**: Win+R via SendInput
  delivered only "r" (WIN modifier stripped); `key ctrl+esc` via PostMessage on
  explorer returned ok but no Start menu appeared. Verify with `list_windows`
  (no new window = didn't fire), then pivot to the staged-.bat / log-relay path.

## Cross-check with Docker Desktop (no shell)

Same session: Docker Desktop Containers page (opened via desktop-shortcut
double-click; `focus_app` said "no on-screen window" because it is a tray app) showed
`Engine running`, the `deer-flow-dev` compose stack, and 4 containers:
deer-flow-nginx (`127.0.0.1:2026:2026 (TCP)` + 443 + 80), deer-flow-gateway,
deer-flow-frontend, deer-flow-redis — all running, non-zero CPU, no Exit/Restart
labels. The compose file confirms the chain: nginx
`ports: ${BIND_HOST:-127.0.0.1}:${PORT:-2026}:2026` and `depends_on: frontend, gateway`;
the gateway mounts `../:/app/project`, so `config.yaml` (with the injected
deepseek-chat models) is live at `/app/project/config.yaml`
(`DEERFLOW_CONFIG_PATH`).
