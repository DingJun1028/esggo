# Windows PowerShell Pitfalls for Cloudflare Workers Development

## curl Alias Conflict

On Windows PowerShell 5.1, `curl` is a built-in alias for `Invoke-WebRequest`, not the real `curl.exe`. `Invoke-WebRequest` requires a `-Uri` parameter, so bare `curl https://...` fails with "Missing mandatory parameter: Uri".

**Error Message:**
```
Unable to parse commandline: Missing mandatory parameter: Uri
```

**Verification:**
```powershell
PS> Get-Alias curl
CommandType  Name          Version  Source
-----------  ----          -------  ------
Alias        curl -> Invoke-WebRequest
```

**Fix Options:**

1. Use `curl.exe` explicitly:
```powershell
curl.exe -s https://example.com
```

2. Remove the alias in the session:
```powershell
Remove-Item Alias:curl -Force
```

3. Use PowerShell's native Invoke-RestMethod:
```powershell
Invoke-RestMethod -Uri "https://example.com"
```

## Related Aliases

Similarly, `wget` and `cat` are aliases that shadow the real executables:
```powershell
PS> Get-Alias wget, cat
CommandType  Name          Version  Source
-----------  ----          -------  ------
Alias        wget -> Invoke-WebRequest
Alias        cat -> Get-Content
```

## Impact on wrangler

This affects wrangler commands that use curl internally. Always use `curl.exe` or run commands in Git Bash / WSL for consistent behavior.

**Example fix for wrangler update:**
```bash
# Instead of: curl https://api.wrangler.cloudflare.com/...
# Use:
curl.exe -s https://api.wrangler.cloudflare.com/...
```