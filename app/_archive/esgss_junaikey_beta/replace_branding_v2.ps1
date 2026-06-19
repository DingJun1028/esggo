$baseDir = "C:\Project\esgss_junaikey_beta\esgss_junaikey_beta"
$pattern = "奧秘"
$replacement = "奧秘"
$exclude = "node_modules|\.git|dist|\.next|artifacts|brain|\.jpg|\.png|\.ico|\.pdf|\.zip|\.exe"

$files = Get-ChildItem -Path $baseDir -Recurse -File | Where-Object { $_.FullName -notmatch $exclude }

foreach ($f in $files) {
    try {
        # Check if file is text by looking at first 1024 bytes for null character
        $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
        if ($bytes.Length -gt 0 -and $bytes.Contains(0)) {
            continue
        }

        $c = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
        if ($c -and $c -match $pattern) {
            $updated = $c -replace $pattern, $replacement
            Set-Content -Path $f.FullName -Value $updated -Encoding utf8
            Write-Host "Updated: $($f.FullName)"
        }
    }
    catch {
        Write-Host "Error: $($f.FullName)"
    }
}
