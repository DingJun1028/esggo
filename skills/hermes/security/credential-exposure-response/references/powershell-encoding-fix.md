# PowerShell 5.1 Encoding Fix Reference

## Problem: UTF-8 BOM Corruption

### Symptom
Chinese characters display as garbled when reading files written by PowerShell.

### Root Cause
PowerShell 5.1 `Out-File -Encoding UTF8` writes **UTF-8 with BOM** (Byte Order Mark).
Some tools/terminals cannot correctly parse BOM-included UTF-8.

### Solution
Use `[System.IO.File]::WriteAllText()` with `UTF8Encoding($false)`:

```powershell
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$TargetDir\.env.example", $content, $utf8NoBom)
```

## Problem: curl Alias Conflict

### Symptom
`curl` commands fail with `Invoke-WebRequest` errors or missing `-Uri` parameter.

### Root Cause
PowerShell 5.1 aliases `curl` → `Invoke-WebRequest`, NOT the actual `curl.exe`.

### Solution
1. Remove the alias:
```powershell
Remove-Item Alias:curl -Force -ErrorAction SilentlyContinue
```

2. Or use full path:
```powershell
curl.exe -s https://example.com
```

## Reference: Encoding Comparison

| Method | Encoding | BOM | Chinese Support |
|--------|----------|-----|-----------------|
| `Out-File -Encoding UTF8` | UTF-8 w/ BOM | ✅ | ❌ 部分工具錯誤 |
| `[File]::WriteAllText(path, content, UTF8($false))` | UTF-8 w/o BOM | ❌ | ✅ 完全支援 |
| `Set-Content -Encoding UTF8` | UTF-8 w/ BOM | ✅ | ❌ 部分工具錯誤 |

## Applied To: ESG-GO v8.0

This fix was applied to the ESG-GO automation framework when Chinese characters in `.env.example` and `README.md` appeared corrupted.