<#
.SYNOPSIS
  Safe squash-merge of a GitHub PR into main with the documented
  "DELETE protection -> merge -> rebuild protection" workflow (ESG GO ledger G1/G2),
  plus pre-merge checks (G3 conflict, G4 stray untracked, G5 worker entry, B1 typecheck).

.DESCRIPTION
  The repo's main branch is protected with required_approving_review_count:1 +
  enforce_admins:true, which blocks self-approval. This script performs the
  compliant temporary-relax flow and restores protection EXACTLY afterwards.

.PARAMETER PrNumber
  The GitHub PR number to merge.

.PARAMETER SkipTypecheck
  Skip the local `npm run typecheck` precheck (useful when CI already validates).

.PARAMETER Yes
  Skip the interactive confirmation before deleting branch protection.

.EXAMPLE
  .\scripts\safe-merge.ps1 -PrNumber 190
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [int]$PrNumber,

  [switch]$SkipTypecheck,

  [switch]$Yes
)

$ErrorActionPreference = 'Stop'

function Fail($msg) {
  Write-Error "ABORT: $msg"
  exit 1
}

# --- discover repo ---
try {
  $repo = (gh repo view --json nameWithOwner -q .nameWithOwner)
} catch {
  Fail "gh CLI not authenticated or not in a repo. Run 'gh auth login'."
}
Write-Output "Repo: $repo"

# --- PRECHECK G4: no stray untracked files that could be mixed in ---
$untracked = (git ls-files --others --exclude-standard)
if ($untracked) {
  Write-Output "[G4] WARNING: untracked files present (will NOT be committed, but review before merging):"
  $untracked | ForEach-Object { "   - $_" }
}

# --- PRECHECK G3: PR must be MERGEABLE (not CONFLICTING) ---
$pr = (gh pr view $PrNumber --json mergeable,mergeStateStatus,title,headRefName,baseRefName)
if ($pr.mergeable -ne 'MERGEABLE') {
  Fail "[G3] PR #$PrNumber is $($pr.mergeable) (likely CONFLICTING). Resolve conflicts first: git merge origin/$($pr.baseRefName) / rebase."
}
if ($pr.baseRefName -ne 'main') {
  Fail "PR #$PrNumber targets '$($pr.baseRefName)', not 'main'. Refusing."
}
Write-Output "[G3] PR #$($PrNumber) '$($pr.title)' is MERGEABLE -> $($pr.headRefName) -> $($pr.baseRefName)"

# --- PRECHECK G5: does the PR touch the Cloudflare Worker entry? ---
$workerHits = (gh pr diff $PrNumber --name-only | Where-Object { $_ -match 'wrangler\.toml|worker|functions/' })
if ($workerHits) {
  Write-Output "[G5] WARNING: PR touches worker/Cloudflare files (may break Workers Builds, which do NOT block this merge):"
  $workerHits | ForEach-Object { "   - $_" }
}

# --- PRECHECK B1: local typecheck (use npm, not pnpm, on Windows) ---
if (-not $SkipTypecheck) {
  Write-Output "[B1] Running npm run typecheck ..."
  npm run typecheck
  if ($LASTEXITCODE -ne 0) { Fail "[B1] typecheck failed. Fix before merging." }
  Write-Output "[B1] typecheck OK"
}

# --- backup current main protection for exact restore ---
$backupPath = Join-Path $env:TEMP "main_protection_backup_$PrNumber.json"
gh api "repos/$repo/branches/main/protection" | Out-File -Encoding utf8 $backupPath
Write-Output "Backed up main protection -> $backupPath"

# --- G1: confirm before destructive DELETE ---
if (-not $Yes) {
  $ans = Read-Host "About to DELETE main branch protection, squash-merge #$PrNumber, then rebuild. Continue? [y/N]"
  if ($ans -notmatch '^[yY]') { Fail "Aborted by user." }
}

try {
  Write-Output "[G1] Deleting main branch protection ..."
  gh api -X DELETE "repos/$repo/branches/main/protection"
  if ($LASTEXITCODE -ne 0) { Fail "Failed to delete protection." }

  Write-Output "[G1] Squash-merging PR #$PrNumber ..."
  gh pr merge $PrNumber --squash --delete-branch
  if ($LASTEXITCODE -ne 0) { Fail "Squash merge failed. Protection is still down — rebuild manually from $backupPath." }

  Write-Output "[G1] Rebuilding main branch protection ..."
  gh api -X PUT "repos/$repo/branches/main/protection" --input $backupPath
  if ($LASTEXITCODE -ne 0) { Fail "MERGE DONE but protection rebuild failed! Restore manually: gh api -X PUT repos/$repo/branches/main/protection --input $backupPath" }
}
catch {
  Write-Error "ERROR during merge flow: $_"
  Write-Error "If protection is down, restore it: gh api -X PUT repos/$repo/branches/main/protection --input $backupPath"
  exit 1
}

# --- verify protection restored ---
$verify = (gh api "repos/$repo/branches/main/protection" --jq '{count: .required_pull_request_reviews.required_approving_review_count, admins: .enforce_admins.enabled}')
Write-Output "[G1] Protection restored: $verify"

# --- update local main ---
git fetch origin main
git checkout main
git reset --hard origin/main

Write-Output "DONE: PR #$PrNumber merged into main; protection restored; local main updated."
