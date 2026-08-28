# Windows-Specific Queue Operations

## PowerShell Command Syntax

### Command Separators
| Bash | PowerShell |
|------|------------|
| `cmd1 && cmd2` | `cmd1; cmd2` |
| `cmd1 \|\| cmd2` | `cmd1; if (-not $LASTEXITCODE)` |
| `var=value` | `$var = "value"` |

### Example: Queue Healthcheck in PowerShell
```powershell
cd "C:\Project\esggo-learning-center"; npx wrangler queues info esggo-repair-queue; npx wrangler queues info esggo-repair-dlq; npx wrangler queues consumer list esggo-repair-queue --json
```

## wrangler First-Time Installation

### Confirmation Prompt
When running wrangler for the first time, npm may prompt:
```
Ok to proceed? (y) |
```

**Solution**: Type 'y' and press Enter, or auto-confirm:
```powershell
echo "y" | npx wrangler queues info esggo-repair-queue
```

## curl Alias Warning

### PowerShell curl Alias
In PowerShell, `curl` is aliased to `Invoke-WebRequest`, not the actual curl.

**For HTTP requests**:
```powershell
# Option 1: Use curl.exe
curl.exe https://example.com

# Option 2: Use Invoke-RestMethod
Invoke-RestMethod -Uri https://example.com

# Option 3: Use Invoke-WebRequest
Invoke-WebRequest -Uri https://example.com
```

## WSL Installation (Optional)

For full bash compatibility, install WSL:
```powershell
wsl --install
# Restart when prompted
wsl
```

## Environment Variables for wrangler on Windows

```powershell
$env:PYTHONUTF8='1'
$env:NODE_OPTIONS='--max-old-space-size=4096 --icu-data-dir="$env:LOCALAPPDATA\vm\cache\node-icu"'
```

## Cross-Platform Path Handling

| Context | Path Style | Example |
|---------|------------|---------|
| PowerShell | `C:\Users\...` | `C:\Project\esggo` |
| Git Bash / WSL | `/c/Users/...` | `/c/Project/esggo` |
| Node.js (cross-platform) | `path.join()` | `path.join('C:', 'Project', 'esggo')` |

## Script Location Verification

Queue healthcheck scripts may exist in multiple locations:
```powershell
# Check project directory
Get-ChildItem "C:\Project\esggo-learning-center\scripts\queue_healthcheck.sh" -ErrorAction SilentlyContinue

# Check user scripts directory
Get-ChildItem "C:\Users\dingj\AppData\Local\hermes\scripts\queue_healthcheck.sh" -ErrorAction SilentlyContinue

# Find all instances
Get-ChildItem -Path "C:\" -Recurse -Name "queue_healthcheck.sh" -ErrorAction SilentlyContinue | Select-Object -First 10
```