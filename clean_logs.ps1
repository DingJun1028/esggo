$logPaths = @(
  'C:\Project\esggo\esggo\.next\standalone\debug-storybook.log',
  'C:\Project\esggo\esggo\.next\standalone\omniagent-gateway\logs\error.log',
  'C:\Project\esggo\esggo\.next\standalone\omniagent-gateway\logs\out.log',
  'C:\Project\esggo\esggo\.playwright-mcp\console-2026-06-15T07-57-00-109Z.log',
  'C:\Project\esggo\esggo\.playwright-mcp\console-2026-06-17T00-00-10-107Z.log',
  'C:\Project\esggo\esggo\.playwright-mcp\console-2026-06-17T07-23-37-566Z.log'
)

foreach ($path in $logPaths) {
  if (Test-Path $path) {
    $content = Get-Content $path -Raw
    $clean = $content -replace '\x1b\[[0-?]*[ -/]*[@-~]', ''
    Set-Content $path -Value $clean -Encoding UTF8 -NoNewline
  }
}