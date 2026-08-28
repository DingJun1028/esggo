# PowerShell curl/wget Aliases - Windows Pitfall

## Problem

On Windows PowerShell 5.1, `curl` and `wget` are **built-in aliases** for `Invoke-WebRequest`, not the real executables. This causes confusing errors when using them in scripts.

```powershell
# WRONG - uses Invoke-WebRequest alias
PS> curl https://example.com
curl : Cannot bind argument to parameter 'Uri' because it is null.
```

## Solutions

### Option 1: Use curl.exe explicitly

```powershell
# CORRECT - uses real curl.exe
PS> curl.exe -s https://example.com
```

### Option 2: Remove aliases in session

```powershell
Remove-Item Alias:curl -Force
Remove-Item Alias:wget -Force

# Now curl/wget will use real executables
curl https://example.com
```

### Option 3: Use Invoke-WebRequest explicitly

```powershell
# CORRECT - use Invoke-WebRequest for web requests
PS> Invoke-WebRequest -Uri "https://example.com" -UseBasicParsing
```

## Why This Happens

PowerShell 5.1 includes aliases for common Unix commands:
- `curl` → `Invoke-WebRequest`
- `wget` → `Invoke-WebRequest`
- `cat` → `Get-Content`
- `ls` → `Get-ChildItem`
- `mv` → `Move-Item`
- `rm` → `Remove-Item`

These aliases were added for compatibility but often cause confusion because they don't accept the same arguments as the real Unix tools.

## Detection

Check what curl/wget are aliased to:

```powershell
PS> Get-Alias curl
CommandType  Name          Version  Source
-----------  ----          -------  ------
Alias        curl -> Invoke-WebRequest

PS> Get-Alias wget
CommandType  Name          Version  Source
-----------  ----          -------  ------
Alias        wget -> Invoke-WebRequest
```

## Related Issues

- wrangler deploy commands using curl for API calls
- Script automation that expects curl behavior
- CI/CD pipelines running on Windows agents