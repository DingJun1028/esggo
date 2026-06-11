# ESG GO | Double Encoding Repair Tool
# Fixes files where UTF-8 was accidentally read as Latin-1 and re-saved as UTF-8

param (
    [string]$FilePath = "twse_sample.txt"
)

Write-Host "🛠️ Repairing double encoding for: $FilePath" -ForegroundColor Blue

if (-not (Test-Path $FilePath)) {
    Write-Host "❌ File not found." -ForegroundColor Red
    return
}

# Read bytes
$bytes = [System.IO.File]::ReadAllBytes($FilePath)

# The file is UTF-8 (Double Encoded), so we read it as UTF-8 first to get the "èºç£" string
$utf8 = [System.Text.Encoding]::UTF8
$badString = $utf8.GetString($bytes)

# Convert each character back to a single byte (Latin-1)
$latin1 = [System.Text.Encoding]::GetEncoding("iso-8859-1")
$goodBytes = $latin1.GetBytes($badString)

# Save the good bytes as a fresh UTF-8 file
[System.IO.File]::WriteAllBytes($FilePath, $goodBytes)

Write-Host "✅ Repair complete. File is now valid UTF-8." -ForegroundColor Green
