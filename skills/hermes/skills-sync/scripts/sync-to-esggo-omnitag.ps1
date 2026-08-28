# sync-to-esggo-omnitag.ps1
# OA-Team 經驗技能書雙向同步 → esggo 倉庫 OmniTag 分支（主機 PowerShell 一鍵執行）
#
# 前置：主機已安裝 git + gh CLI (github.com/cli)，且 gh 已登入 (gh auth login)
# 用法：
#   cd C:\Project\esggo
#   powershell -ExecutionPolicy Bypass -File C:\Users\dingj\AppData\Local\hermes\skills\skills-sync\scripts\sync-to-esggo-omnitag.ps1
#
# 注意：Hermes 技能樹在主機 C:\Users\dingj\AppData\Local\hermes\skills\
#       容器代理人無法代跑 git（架構隔離），此腳本須在主機執行。

$ErrorActionPreference = "Stop"

$ESGG_REPO   = "DingJun1028/esggo"          # 改成您的 owner/repo
$BRANCH      = "OmniTag"
$HERMES_ROOT = "$env:USERPROFILE\AppData\Local\hermes\skills"
$REPO_ROOT   = (Get-Location).Path          # 需在 esggo 倉庫根目錄執行

Write-Host "==> 目標: $ESGG_REPO @ $BRANCH"
Write-Host "==> Hermes 技能樹: $HERMES_ROOT"

# 1. 確認在 git 倉庫
if (-not (Test-Path ".git")) { Write-Error "目前目錄不是 git 倉庫，請先 cd 到 esggo 倉庫根"; exit 1 }

# 2. 切/建 OmniTag 分支
git fetch origin
$existing = git branch --list $BRANCH
if ($existing) { git checkout $BRANCH; git merge origin/$BRANCH --no-edit 2>$null }
else {
    $originExists = git ls-remote --heads origin $BRANCH
    if ($originExists) { git checkout -b $BRANCH origin/$BRANCH }
    else { git checkout -b $BRANCH }
}

# 3. 同步 Hermes 技能樹 → 倉庫 skills/hermes/
$hermesSrc = Join-Path $HERMES_ROOT "*"
$destHermes = Join-Path $REPO_ROOT "skills\hermes"
if (-not (Test-Path $destHermes)) { New-Item -ItemType Directory -Path $destHermes | Out-Null }
robocopy $HERMES_ROOT $destHermes /E /XO /NFL /NDL /NJH /NJS

# 4. 轉換為 OpenCode 格式（skills-sync 腳本）
$conv = Join-Path $HERMES_ROOT "skills-sync\scripts\hermes_to_opencode.py"
$destOpencode = Join-Path $REPO_ROOT "skills\opencode"
python $conv $destHermes $destOpencode

# 5. 寫入雙向映射清單
$manifest = @{
    updated   = [int][double]::Parse((Get-Date -UFormat %s))
    branch    = $BRANCH
    hermes_dir = "skills/hermes"
    opencode_dir = "skills/opencode"
    skills    = @("oa-team-soul-canon", "unagent", "skills-sync", "obsidian:hermes-agent-obsidian-plugin")
}
$manifest | ConvertTo-Json -Depth 3 | Out-File -Encoding utf8 (Join-Path $REPO_ROOT "sync-manifest.json")

# 6. 檢查變更
git status --short

# 7. 約定式提交
$msg = @"
chore(skills): 雙向同步經驗技能書至 OmniTag (Hermes 原生 + OpenCode 雙格式)

- 升級 oa-team-soul-canon 靈魂核心聖典（AI Station/電子報/增量優化/Obsidian 整合/供應商相容免責）
- 新增 unagent 專屬技能（自聖典附錄 B.1 提煉，含 5T 對應與安全邊界）
- 新增 skills-sync 雙向同步契約（Hermes ↔ esggo OmniTag OpenCode）
- 補齊 crew-oa-team.jsonc 與 obsidian-integration 參考
"@
git add -A
$hasChanges = git diff --cached --quiet; if (-not $hasChanges) { Write-Host "==> 無變更，跳過提交"; exit 0 }
git commit -m $msg

# 8. 推送
git push origin $BRANCH

# 9. 開 PR（若 OmniTag 還沒開過 PR 且非 default 分支）
$defaultBranch = (gh repo view $ESGG_REPO --json defaultBranchRef -q .defaultBranchRef.name 2>$null)
if ($defaultBranch -and $BRANCH -ne $defaultBranch) {
    $existingPR = gh pr list --repo $ESGG_REPO --head $BRANCH --state open --json number -q '.[0].number' 2>$null
    if (-not $existingPR) {
        gh pr create --repo $ESGG_REPO --base $defaultBranch --head $BRANCH `
            --title "chore(skills): 雙向同步經驗技能書至 OmniTag" `
            --body "雙向同步 Hermes 技能樹至 esggo@OmniTag，倉庫內同時維護 Hermes 原生與 OpenCode 轉換雙格式。詳見 skills/sync-manifest.json 與 skills-sync 技能。"
        Write-Host "==> PR 已開立"
    } else { Write-Host "==> PR #$existingPR 已存在，略過" }
}
Write-Host "==> 完成：esggo @ $BRANCH 已推送"
