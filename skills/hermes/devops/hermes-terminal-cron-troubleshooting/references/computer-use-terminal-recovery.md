# computer_use terminal recovery (verified 2026-08-07)

When the agent `terminal` tool is wedged on `getsockname failed: Not a socket`
(SSH backend dead) and you cannot run `hermes config set` through it, recover via
the Hermes **desktop app's embedded TERMINAL pane** driven by `computer_use`.

The embedded pane is a LOCAL Windows shell, independent of the agent's SSH-backed
`terminal` tool, so it is not wedged.

## Exact working sequence

1. Locate the pane:
   `computer_use(action='capture', app='Hermes.exe', mode='som')`
   → the TERMINAL input box appeared around element index 352 (bounds ~ [312, 963]).
     (The SOM tree is huge because the whole app is included; the terminal input
      is the Edit/TextBox near the bottom labeled "Terminal input".)

2. Type with FOREGROUND delivery (background input is silently dropped on
   `Chrome_WidgetWin_1`):
   `computer_use(action='type', element=352, delivery_mode='foreground',
                 text='hermes config set terminal.backend local')`

3. Press enter (foreground):
   `computer_use(action='key', keys='enter', delivery_mode='foreground')`

4. Confirm: the pane shows `computer_hermes config set terminal.backend local 0.1s`
   (success, no error). Or run `hermes config get terminal.backend` in the same pane.

5. User MUST fully restart Hermes (close app → reopen) for `backend: local` to
   reload into the agent `terminal` tool. Until then, `read_file`/`search_files`/
   `terminal` stay SSH-wedged.

## Pitfalls confirmed this session
- Background `type`/`key` → `background_unavailable` on Hermes.exe. Always foreground.
- Global hotkeys (Win+R / Win+D) unreliable: background = unverifiable; foreground
  rejected for lack of UIAccess. Do NOT use them to open a terminal.
- The embedded terminal does NOT keep child processes alive: `node server.mjs &`,
  `Start-Process -NoNewWindow`, and `Start-Process` (new window) all died when the
  launching command returned. For a persistent local server, have the USER run it in
  their own Windows Terminal / PowerShell (foreground) — that survives.
- `browser_navigate('http://localhost:PORT')` runs in a sandboxed remote browser, so
  ERR_CONNECTION_REFUSED there is NOT proof the user's local server is down. Verify a
  user-local server via the user's `WindowsTerminal.exe` (visible in list_windows)
  or the embedded pane with `curl`/`Invoke-WebRequest`. Public URLs (e.g.
  https://translate.esggo.co/health) DO resolve from the browser tool.
