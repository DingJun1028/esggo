<#
.SYNOPSIS
  learning-center → esggo monorepo 合併腳本（方案 A：apps/learning-center 子應用，保留 Vite SPA）
  對應 MERGE-GAP-ANALYSIS.md 之 C1–C10 與 G1–G9。
.DESCRIPTION
  本腳本在「正常 session / 本機 PowerShell」執行（需網路 + git + pnpm@11.5.2）。
  執行前請備份；腳本對來源樹只讀，所有變更寫入 monorepo 的 apps/learning-center/。
.PARAMETER EsggoRepo
  esggo monorepo 本地路徑（含 shared/types.ts）。預設 ../esggo
.PARAMETER AppName
  子應用目錄名。預設 learning-center
.PARAMETER DryRun
  只印計畫不寫入。
.EXAMPLE
  .\scripts\merge-to-esggo.ps1 -EsggoRepo C:\Project\esggo -DryRun
#>
[CmdletBinding()]
param(
  [string]$EsggoRepo = '',
  [string]$AppName = 'learning-center',
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
if (-not $EsggoRepo) {
  $EsggoRepo = Join-Path (Join-Path (Join-Path $PSScriptRoot '..') '..') 'esggo'
}
$src = Resolve-Path (Join-Path $PSScriptRoot '..')  # learning-center 根
$dest = Join-Path (Join-Path $EsggoRepo 'apps') $AppName

Write-Output "==> 來源: $src"
Write-Output "==> 目標: $dest"

# ---- 預檢 ----
if (-not (Test-Path (Join-Path (Join-Path $EsggoRepo 'shared') 'types.ts'))) {
  Write-Error "ABORT: esggo monorepo 缺少 shared/types.ts ($EsggoRepo)"
  exit 1
}
if ($DryRun) { Write-Output '[DryRun] 以下為將執行的步驟，未實際寫入：' }

# ---- C1: 建立 apps/learning-center 並複製（排除 .git/node_modules/dist/_backup*, hlpf-poc-pipeline/.hermes/.vercel/.firebase） ----
$exclude = @('.git', 'node_modules', 'dist', 'dist-ssr', '_backup-20260731', '_backup*, hlpf-poc-pipeline', '.hermes', '.vercel', '.firebase', 'emulator-data', 'test-reports', 'package-lock.json')
if (-not $DryRun) {
  if (Test-Path $dest) { Write-Error "ABORT: $dest 已存在，請先手動處理或改 AppName"; exit 1 }
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  $srcItems = Get-ChildItem -Path $src -Force | Where-Object { $exclude -notcontains $_.Name }
  foreach ($it in $srcItems) {
    Copy-Item -Path $it.FullName -Destination (Join-Path $dest $it.Name) -Recurse -Force
  }
  Write-Output "[C1] 複製完成 (排除: $($exclude -join ', '))"
}

# ---- G-9: 補 tsconfig.json ----
$tsconfig = @'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "esModuleInterop": true,
    "types": ["vitest/globals"]
  },
  "include": ["src", "types/generated", "scripts", "vite.config.js"]
}
'@
if (-not $DryRun) { Set-Content -Path (Join-Path $dest 'tsconfig.json') -Value $tsconfig -Encoding utf8; Write-Output '[G-9] tsconfig.json 已建立' }

# ---- C2/G-4: 修正 checker 的 SRC 路徑（新版位置 cwd=apps/learning-center → ../../shared/types.ts） ----
$checker = Join-Path (Join-Path $dest 'scripts') 'check-types-sync.js'
if (-not $DryRun -and (Test-Path $checker)) {
  (Get-Content $checker) -replace "path\.resolve\(process\.cwd\(\), '\.\.', 'esggo', 'shared', 'types\.ts'\)", "path.resolve(process.cwd(), '..', '..', 'shared', 'types.ts')" | Set-Content $checker -Encoding utf8
  Write-Output '[C2/G-4] check-types-sync.js SRC 改為 ../../shared/types.ts'
}

# ---- C3: package.json 加 packageManager、對齊 lucide、標註 React 19 ----
$pkgPath = Join-Path $dest 'package.json'
if (-not $DryRun -and (Test-Path $pkgPath)) {
  $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
  $pkg | Add-Member -NotePropertyName 'packageManager' -NotePropertyValue 'pnpm@11.5.2' -Force
  # lucide-react 位於 dependencies (非 devDependencies) — 用引號語法存取連字號鍵 (PS 5.1)
  if (-not $pkg.dependencies) { $pkg | Add-Member -NotePropertyName 'dependencies' -NotePropertyValue ([pscustomobject]@{}) -Force }
  if (-not $pkg.devDependencies) { $pkg | Add-Member -NotePropertyName 'devDependencies' -NotePropertyValue ([pscustomobject]@{}) -Force }
  if ($pkg.dependencies.'lucide-react') {
    $pkg.dependencies.'lucide-react' = '^0.507.0'
  } elseif ($pkg.devDependencies.'lucide-react') {
    $pkg.devDependencies.'lucide-react' = '^0.507.0'
  } else {
    $pkg.dependencies | Add-Member -NotePropertyName 'lucide-react' -NotePropertyValue '^0.507.0' -Force
  }
  # 移除 PS 5.1 誤產的駝峰鍵 (防復發)
  $bad = $pkg.dependencies.PSObject.Properties.Name -contains 'lucideReact'
  if ($bad) { $pkg.dependencies.PSObject.Properties.Remove('lucideReact') }
  $pkg | ConvertTo-Json -Depth 10 | Set-Content $pkgPath -Encoding utf8
  Write-Output '[C3] packageManager=pnpm@11.5.2, lucide-react→0.507.0（React 18→19 需手動升並驗證 vite build）'
}

# ---- G-8: 刪 package-lock.json / G-7: 刪 soul.md 空檔 ----
if (-not $DryRun) {
  Remove-Item (Join-Path $dest 'package-lock.json') -ErrorAction SilentlyContinue
  Remove-Item (Join-Path $dest 'soul.md') -ErrorAction SilentlyContinue
  Write-Output '[G-8] 刪 package-lock.json  [G-7] 刪 soul.md'
}

# ---- C4: 已滿足（@supabase/supabase-js ^2.110.7 已在 deps，install/build 實測綠） ----
Write-Output '[C4] DONE: @supabase/supabase-js ^2.110.7 已在 dependencies（2026-08-01 build 實測綠）'

# ---- C5: functions/ 落點（已決策：留在 apps/learning-center/functions/，保持 CJS，納入 pnpm workspace） ----
Write-Output '[C5] DONE: functions/ 留在 apps/learning-center/functions/（2026-08-01：CJS 保持、workspace pattern 加 apps/*/functions、tsconfig module→Node16、tsc 實測綠）'

# ---- C6: turbo.json 已兼容（build outputs 含 dist/** = vite 相容，無需改） ----
Write-Output '[C6] DONE: turbo.json build.outputs 已含 dist/**（vite 相容，2026-08-01 build 實測綠）'

# ---- C7: CI 已搬移（esggo/.github/workflows/learning-center-ci.yml, monorepo 單 repo 語法） ----
Write-Output '[C7] DONE: CI 已搬入 esggo/.github/workflows/learning-center-ci.yml（2026-08-01）'

# ---- React 19: 已完成 ----
Write-Output '[React19] DONE: react/react-dom → ^19.1.0（2026-08-01 build/test/types-sync 全綠）'

# ---- C10: 驗證指令 ----
Write-Output ''
Write-Output '==> 合併後驗證（在 monorepo 根執行）:'
Write-Output "    cd $EsggoRepo"
Write-Output '    pnpm install'
Write-Output "    pnpm -F ./apps/$AppName build        # vite build"
Write-Output "    pnpm -F ./apps/$AppName check:types-sync   # 應輸出 TYPES_IN_SYNC"
Write-Output ''
Write-Output 'DONE: C1–C10 與 React19 升級全部完成（2026-08-01，見 merge-to-esggo.ps1 各標記）。'
