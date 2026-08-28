# `plugins.enabled` must be a JSON ARRAY — PowerShell `ConvertTo-Json` trap

## Symptom
After running an install script, a `ctx.rest`-backed surface (e.g. ESGGO Hub pane)
shows "後端未啟用" / "backend not enabled", even though
`hermes config get plugins.enabled` appears to succeed and `hermes update` was run.

## Root cause
`hermes config set plugins.enabled <value>` stores the value **verbatim**. The
gateway mounts a plugin's Python backend only when `plugins.enabled` is a JSON
**array** (e.g. `["esggo-hub"]`).

An installer that assembled the value in PowerShell and serialized it with
`ConvertTo-Json` produced the WRONG shape:

| PowerShell expression             | Result written         | Gateway behavior              |
|-----------------------------------|------------------------|-------------------------------|
| `ConvertTo-Json @('esggo-hub')`   | `"esggo-hub"` (string) | silently ignored → no mount   |
| literal `'["esggo-hub"]'`         | `["esggo-hub"]` (array)| mounts backend correctly      |

A string value is treated as an unrecognized/custom key — hence the warning
`⚠ 'plugins.enabled' is not a recognized config key` in the install log, and the
backend never mounts.

## Proof in the log
A malformed run logs:
```
[ok] plugins.enabled = "esggo-hub"
```
Note the **quotes with no square brackets**. A correct run logs:
```
[ok] plugins.enabled = ["esggo-hub"]
```

## Fix
Never round-trip a single-element list through `ConvertTo-Json`. Build the array
string by hand:
```powershell
$merged = @('esggo-hub')
$json = '[' + (($merged | ForEach-Object { '"{0}"' -f $_ }) -join ',') + ']'
& hermes config set plugins.enabled $json
```
Reusable id-parameterized installer: `templates/install-plugin-array-safe.ps1`.

## Verification
1. `hermes config get plugins.enabled` → must print `["esggo-hub"]` (brackets).
2. `hermes update --no-backup --yes` (restart gateway).
3. Ctrl/Cmd+K → Reload desktop plugins.
4. Pane shows real branch/commit data (not "backend not enabled").
5. Optional: `curl http://localhost:8786/api/plugins/esggo-hub/status`.
