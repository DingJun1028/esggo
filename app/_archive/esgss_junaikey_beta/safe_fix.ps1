$files = Get-ChildItem src/1-service/*.ts
foreach ($file in $files) {
    if ($file.Name -eq "index.ts") { continue }
    # Read as UTF8
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Perform replacements
    $content = $content.Replace("@/services/", "./")
    $content = $content.Replace("@/omni/services/", "./")
    $content = $content.Replace("@/omni/infrastructure/logging/OmniLogger", "@infra/logging/OmniLogger")
    $content = $content.Replace("@/omni/infrastructure/broadcast/AwakeningBroadcaster", "@infra/broadcast/AwakeningBroadcaster")
    $content = $content.Replace("@/omni/infrastructure/memory/", "@infra/memory/")
    $content = $content.Replace("../omni/infrastructure/logging/OmniLogger", "@infra/logging/OmniLogger")
    $content = $content.Replace("../omni/infrastructure/broadcast/AwakeningBroadcaster", "@infra/broadcast/AwakeningBroadcaster")
    $content = $content.Replace("../types", "@/types")
    
    # Write back as UTF8 (No BOM)
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
    Write-Host "Processed: $($file.Name)"
}
Write-Host "Standardization Complete."
