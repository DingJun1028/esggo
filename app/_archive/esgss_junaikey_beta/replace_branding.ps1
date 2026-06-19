$baseDir = "c:\Project\esgss_junaikey_beta\esgss_junaikey_beta"
$pattern = "萬能"
$replacement = "奧秘"

function Invoke-ProcessFile($filePath) {
    try {
        $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
        if ($content.Contains($pattern)) {
            $newContent = $content.Replace($pattern, $replacement)
            [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Updated: $filePath" -ForegroundColor Green
        }
    }
    catch {
        # Fallback if UTF8 fails or file is binary
    }
}

Get-ChildItem -Path $baseDir -Recurse -File | Where-Object { 
    $_.FullName -notmatch "node_modules|\.git|dist|\.next|artifacts|brain" -and 
    $_.Extension -match "\.(ts|tsx|js|jsx|md|json|sql|html)$" 
} | ForEach-Object {
    Invoke-ProcessFile $_.FullName
}
