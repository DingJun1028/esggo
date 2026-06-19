$files = Get-ChildItem src/1-service/*.ts -Exclude index.ts
$lines = $files | ForEach-Object { "export * from './$($_.BaseName)';" }
$lines | Set-Content src/1-service/index.ts -Encoding UTF8
Write-Host "Index generated with $($lines.Count) exports."
