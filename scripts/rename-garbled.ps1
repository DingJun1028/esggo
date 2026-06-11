function Rename-GarbledFiles {
    param([string]$folder)
    Get-ChildItem -Path $folder -Recurse -File | ForEach-Object {
        $original = $_.Name
        $bytes = [System.Text.Encoding]::Default.GetBytes($original)
        $utf8 = [System.Text.Encoding]::UTF8.GetString($bytes)
        $new = $utf8 -replace '[\\/:*?\"<>|]', '_'  # replace illegal chars
        if ($new -ne $original) {
            Rename-Item -LiteralPath $_.FullName -NewName $new -Force
            Write-Host "Renamed: $original -> $new"
        }
    }
}
# Execute on docs folder
Rename-GarbledFiles -folder 'C:\\Project\\esggo\\esggo\\docs'