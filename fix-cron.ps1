# 複製這段代碼到固定檔案 fix-cron.ps1
$content = Get-Content "vercel.json" -Raw
$newContent = $content -replace "0 */3 * * *", "0 0 * * *"
Set-Content "vercel.json" $newContent