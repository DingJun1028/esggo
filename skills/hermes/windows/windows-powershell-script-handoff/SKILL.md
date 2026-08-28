---
name: windows-powershell-script-handoff
description: Generate PowerShell/cmd for the user to run on Windows.
---
# Windows PowerShell Script Handoff

## Trigger
- You produce a PowerShell/cmd snippet the USER will paste and run on Windows (you cannot run it from the sandbox).
- Common cases: SSH to a VPS to restart a service, launch Chrome with flags, copy/verify files.

## Hard rules (each caused a real failure this session)
1. **Never use `$HOST` as a variable.** It is a read-only automatic variable (the PowerShell host object). Assigning it throws `VariableNotWritable` and the value becomes `system.management.automation.internal.host.internalhost` — which ssh then treats as a hostname → "Could not resolve hostname". Use `$RHOST`, `$Srv`, `$Target`.
2. **`curl` in Windows PowerShell is an alias for `Invoke-WebRequest`.** It does NOT accept `-s -o -w --max-time`. Either call the real binary `curl.exe` (note the `.exe`), or use `Invoke-WebRequest -Uri <url> -TimeoutSec 15 -UseBasicParsing -ErrorAction SilentlyContinue` and read `.StatusCode`.
3. **Never emit `@url:` in any command.** The Hermes chat renders URLs with an `@url:` prefix (a UI convention). If the user copies your command, that prefix leaks in and corrupts the argument (Chrome opens `@url:https://...`, ssh gets `@url:http://...`). Strip `@url:` from anything you output as a runnable command, and strip it from user-provided commands before executing. In writing, refer to it as "the at-url prefix" to avoid the literal colon sequence that breaks parsers.
4. **Sandbox cannot SSH to the user's VPS.** The Hermes sandbox only mounts OneDrive + secret-vault; it does NOT mount the user's `.ssh` and has no private key. Any SSH must run from the Windows host. Generate the script, hand it to the user, and read back their output — do not claim you fixed it from the sandbox.

## Reliable patterns
- **Launch Chrome with flags:** `Start-Process chrome -ArgumentList "--load-extension=C:\path\to\dist"` (Chrome must be fully closed, or add `--new-window`).
- **Auto-detect SSH key:** probe candidates `ci_deploy_key`, `id_rsa`, `esggo_original`, `esggo_vps` under `$HOME\.ssh` and use the first that exists (see templates/fix_vps_service.ps1).
- **Verify with real evidence:** after a restart, probe both the VPS localhost port (`ssh ... "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:PORT"`) and the external URL, and report actual HTTP codes — never assume success.

## See also
- `browser-extension-unpacked-load` for the extension-loading half of the Chrome flag launch.
- `esggo-vps-deploy-rescue` is user-owned; the sandbox-SSH gap here complements it.
