$files = Get-ChildItem src/1-service/*.ts
foreach ($file in $files) {
    Write-Host "Fixing imports in $($file.Name)..."
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace '@/services/', './'
    $content = $content -replace '@/omni/services/', './'
    $content = $content -replace '@/omni/infrastructure/logging/OmniLogger', '@infra/logging/OmniLogger'
    $content = $content -replace '@/omni/infrastructure/broadcast/AwakeningBroadcaster', '@infra/broadcast/AwakeningBroadcaster'
    $content = $content -replace '@/omni/infrastructure/memory/', '@infra/memory/'
    $content = $content -replace '@service/', './' # Safe to replace if already aliased
    Set-Content $file.FullName $content
}
Write-Host "Success!"
