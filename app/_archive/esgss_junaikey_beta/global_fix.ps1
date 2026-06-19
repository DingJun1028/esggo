$files = Get-ChildItem src/ -Recurse -Include *.ts,*.tsx
foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*") { continue }
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Force alias replacements
    $content = $content -replace '@/omni/infrastructure/', '@infra/'
    $content = $content -replace '@/omni/services/', '@service/'
    $content = $content -replace '@/omni/interaction/visuals/', '@ui/components/omni/'
    $content = $content -replace '@/services/', '@service/'
    
    # Write back
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
}
Write-Host "Aggressive Path Fix Complete."
