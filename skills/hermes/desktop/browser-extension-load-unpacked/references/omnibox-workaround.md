# Omnibox workaround — computer_use cannot type chrome:// URLs

## Symptom
In a multi-tab Chrome session, driving the address bar with `computer_use` keystrokes
(Ctrl+L, Alt+D, F6, Ctrl+T then type, even `delivery_mode:"foreground"`) consistently
lands the text in a **page search box**, not the omnibox. Result: address bar shows
`google.com/search?q=chrome%3A%2F%2Fextensions` and the page never navigates.

Observed across the `DingJun1028/hermes-browser-extension` install attempt (session 2026-08-22).

## Workaround A — launch from the Windows host (preferred)
The Hermes sandbox is a Linux container; it cannot call `cmd.exe`/`powershell.exe`.
Run on the user's Windows machine:
```powershell
Start-Process chrome -ArgumentList '--new-window','chrome://extensions'
```
This opens a clean `chrome://extensions` window with no tab race.

## Workaround B — drive the native file dialog
Native file pickers are handled far more reliably than the omnibox by cua-driver.
1. Ask the user to open `chrome://extensions` (via Workaround A or manually) and screenshot it.
2. You click "Load unpacked" → a native folder picker appears.
3. Navigate the picker to the built folder, e.g.
   `C:\Users\dingj\OneDrive\Documents\Default Project\hermes-browser-extension\dist`.

## Workaround C — typed browser route (if available)
If `cua_browser_*` (typed page) can bind this Chrome instance exactly
(`binding_quality:'exact'`), omnibox entry via the DOM route may work where
synthetic Win32 keystrokes fail. Not confirmed this session; try only if A/B unavailable.
