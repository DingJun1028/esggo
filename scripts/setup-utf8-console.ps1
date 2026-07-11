# ESGGO: force UTF-8 console so Traditional Chinese renders without mojibake (亂碼)
$p = $PROFILE
if (-not (Test-Path $p)) {
  New-Item -ItemType File -Path $p -Force | Out-Null
  Write-Host "created profile: $p"
}
$snippet = @"

# ESGGO UTF-8 fix (added by encoding repair)
try { chcp 65001 | Out-Null } catch {}
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
`$OutputEncoding = [System.Text.Encoding]::UTF8
"@
if (-not (Select-String -Pattern 'chcp 65001' -Path $p -Quiet)) {
  Add-Content -Path $p -Value $snippet -Encoding utf8
  Write-Host "APPENDED utf8 setup to profile"
} else {
  Write-Host "profile already has utf8 setup"
}
Write-Host "PROFILE PATH: $p"
