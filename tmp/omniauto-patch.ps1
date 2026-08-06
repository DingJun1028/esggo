$ErrorActionPreference = 'Continue'
$log = Join-Path $PSScriptRoot 'omniauto-output-patch.log'
"=== OmniAuto output-spec patch $(Get-Date -Format o) ===" | Out-File -FilePath $log -Encoding utf8

$root = 'C:\Project\esggo-omniauto'
$cfg  = Join-Path $root 'src\config.py'
$ren  = Join-Path $root 'src\renderer.py'

"TARGET_ROOT=$root" | Out-File $log -Append -Encoding utf8
"cfg exists: $(Test-Path $cfg)" | Out-File $log -Append -Encoding utf8
"ren exists: $(Test-Path $ren)" | Out-File $log -Append -Encoding utf8

if (-not (Test-Path $cfg) -or -not (Test-Path $ren)) {
    "CANDIDATES under C:\Project:" | Out-File $log -Append -Encoding utf8
    Get-ChildItem 'C:\Project' -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        "  $($_.FullName)" | Out-File $log -Append -Encoding utf8
    }
    "FATAL: target files missing - patch NOT applied" | Out-File $log -Append -Encoding utf8
    exit 1
}

# backup
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
Copy-Item $cfg "$cfg.bak-$stamp" -ErrorAction SilentlyContinue
Copy-Item $ren "$ren.bak-$stamp" -ErrorAction SilentlyContinue
"backup: $cfg.bak-$stamp + $ren.bak-$stamp" | Out-File $log -Append -Encoding utf8

$enc = New-Object System.Text.UTF8Encoding($false)
$u8  = [System.Text.Encoding]::UTF8

# ---- config.py: resolution 1280x720 -> 1920x1080 (env defaults) ----
$c  = [System.IO.File]::ReadAllText($cfg, $u8)
$c2 = $c -replace 'VIDEO_WIDTH = int\(os\.getenv\("VIDEO_WIDTH", "1280"\)\)',
                  'VIDEO_WIDTH = int(os.getenv("VIDEO_WIDTH", "1920"))'
$c2 = $c2 -replace 'VIDEO_HEIGHT = int\(os\.getenv\("VIDEO_HEIGHT", "720"\)\)',
                    'VIDEO_HEIGHT = int(os.getenv("VIDEO_HEIGHT", "1080"))'
$cfgChanged = ($c2 -ne $c)
"config.py resolution changed: $cfgChanged" | Out-File $log -Append -Encoding utf8
[System.IO.File]::WriteAllText($cfg, $c2, $enc)

# ---- renderer.py: audio 48000 (3 sites) ----
$r  = [System.IO.File]::ReadAllText($ren, $u8)
$r2 = $r -replace '"-c:a", "aac", "-b:a", "192k",', '"-c:a", "aac", "-ar", "48000", "-b:a", "192k",'
$r2 = $r2 -replace 'anullsrc=r=44100:cl=stereo', 'anullsrc=r=48000:cl=stereo'
$r2 = $r2 -replace '"-c:a", "aac", "-shortest", str\(out\),', '"-c:a", "aac", "-ar", "48000", "-shortest", str(out),'
$renChanged = ($r2 -ne $r)
"renderer.py changed: $renChanged" | Out-File $log -Append -Encoding utf8
[System.IO.File]::WriteAllText($ren, $r2, $enc)

# ---- verify ----
"--- config.py relevant lines ---" | Out-File $log -Append -Encoding utf8
Select-String -Path $cfg -Pattern 'VIDEO_(WIDTH|HEIGHT) =' | ForEach-Object {
    "  $($_.Line.Trim())" | Out-File $log -Append -Encoding utf8
}
"--- renderer.py '-ar', '48000' sites ---" | Out-File $log -Append -Encoding utf8
$n48 = (Select-String -Path $ren -Pattern '"-ar", "48000"').Count
"  48000 sites: $n48" | Out-File $log -Append -Encoding utf8
"--- renderer.py anullsrc line ---" | Out-File $log -Append -Encoding utf8
Select-String -Path $ren -Pattern 'anullsrc' | ForEach-Object {
    "  $($_.Line.Trim())" | Out-File $log -Append -Encoding utf8
}
"--- renderer.py remaining 44100 ---" | Out-File $log -Append -Encoding utf8
$n44 = (Select-String -Path $ren -Pattern '44100').Count
"  44100 remaining: $n44" | Out-File $log -Append -Encoding utf8

"RESULT: cfg=$cfgChanged ren=$renChanged sites48000=$n48 rem44100=$n44" | Out-File $log -Append -Encoding utf8
"EXITCODE=0" | Out-File $log -Append -Encoding utf8
