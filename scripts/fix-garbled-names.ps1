function renameGarbledFiles {
  $folder = 'C:\\Project\\esggo\\esggo\\docs'
  Get-ChildItem -Path $folder -Recurse -File | ForEach-Object {
    $originalName = $_.Name
    $reportName = @()
    try {
      # First try decoding as UTF-8 directly
      $decodedName = [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::Default.GetBytes($originalName))
      $newName = $decodedName -replace '\\/[\/:*?\"<>|]', '_'
      
      # If no change needed, return early
      if ($newName -eq $originalName) { return }
      
      # Fallback to codepage detection if UTF-8 fails
      $bytes = [System.Text.Encoding]::Default.GetBytes($originalName)
      $embeddingNames = @(
        [System.Text.Encoding]::ASCII.GetString($bytes),
        [System.Text.Encoding]::Unicode.GetString($bytes),
        [System.Text.Encoding]::BigFive.GetString($bytes),
        [System.Text.Encoding]::Big5.GetString($bytes),
        [System.Text.Encoding]::GB18030.GetString($bytes),
        [System.Text.Encoding]::GB2312.GetString($bytes)
      )
      $candidates = ($embeddingNames | Where-Object { $_ -match '\p{S}' }) + @($decodedName)
    }
    catch {
      $reportName += "Error processing ${originalName}: $_`nm"}
      continue
    }
    
    $finalName = ($candidates | ForEach-Object { $_.replace('[斜杠/]*', '_')) } | Select-Object -First 1
    if (@($newName)) {
      # Handle names with consecutive underscores
      $newName = $newName -replace '__+', '_'
      Rename-Item -LiteralPath $_.FullName -NewName $newName -ErrorAction SilentlyContinue
      $reportName += "${originalName} -> $newName`nm"}
    }
  }
  return $reportName -join '
'</reportName>
} renameGarbledFiles