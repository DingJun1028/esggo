# omnicore-fix2.ps1 - OmniCore CI fix round 2: scope @lib rewrites to genuinely broken imports
$ErrorActionPreference = 'Continue'
$logDir = 'C:\Project\esggo-learning-center\cron-fix-logs'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$log = Join-Path $logDir 'omnicore-fix2.log'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Log($m) {
  $line = "[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $m
  Add-Content -Path $log -Value $line -Encoding UTF8
  Write-Host $line
}
function Run($cmd, $argsArr, $desc) {
  Log ">>> $desc"
  Log "CMD: $cmd $($argsArr -join ' ')"
  try {
    $out = & $cmd @argsArr 2>&1
    $code = $LASTEXITCODE
    if ($out) { $out | ForEach-Object { Log "    | $_" } }
    Log "EXIT: $code"
    return $code
  } catch {
    Log "EXCEPTION: $($_.Exception.Message)"
    return -1
  }
}

Log '==================== OmniCore CI FIX ROUND 2 ===================='
Log ('TS: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))

Push-Location 'C:\Project\esggo'
Run 'git' @('status','--short','--branch') 'git status'
Run 'git' @('branch','--show-current') 'git branch'

# ---------- STEP R2-1: revert 21 mis-scoped @lib targets back to @/lib ----------
Log '--- R2-1: revert mis-scoped @lib/ targets (src/lib exists -> keep @/lib) ---'
$revertTargets = @(
  'agnes-api','ncb-client','esg-sonnar','five-t-protocol','celestial/implementation',
  'cloudflare','omni-core/omni-kernel','storage-service','omni-core','omni-base/plugin-registry',
  'prisma','village-seeder','omni-core/entropy-forge','rate-limit','zkp-service',
  'api-utils','firebase','omni-agent','omni-theme','sustain-write','sustain-write/omni-tag'
)
$revertSet = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($t in $revertTargets) { [void]$revertSet.Add($t) }

$root = 'C:\Project\esggo'
$routeFiles = @(Get-ChildItem -Path (Join-Path $root 'app\api') -Recurse -Filter 'route.ts' -File -ErrorAction SilentlyContinue)
$revertedFiles = 0; $revertedOccurrences = 0
foreach ($f in $routeFiles) {
  $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  $before = $txt
  foreach ($t in $revertTargets) {
    # count quoted occurrences of @lib/<target> before replacing (safe: full quoted match)
    $revertedOccurrences += ([regex]::Matches($txt, [regex]::Escape("'@lib/" + $t + "'") )).Count
    $revertedOccurrences += ([regex]::Matches($txt, [regex]::Escape('"@lib/' + $t + '"') )).Count
    $txt = $txt.Replace("'@lib/$t'", "'@/lib/$t'").Replace('"@lib/' + $t + '"', '"@/lib/' + $t + '"')
  }
  if ($txt -ne $before) {
    [System.IO.File]::WriteAllText($f.FullName, $txt, $utf8)
    $revertedFiles++
    Log ("  [REVERTED] " + $f.FullName.Substring($root.Length).TrimStart('\'))
  }
}
Log ('reverted files: ' + $revertedFiles + ' / occurrences: ' + $revertedOccurrences)

# ---------- R2-2: verify remaining @lib/ targets all exist in lib/ ----------
Log '--- R2-2: verify remaining @lib/ targets ---'
$pattern = '@lib/([A-Za-z0-9_\-./]+)'
$libFiles = @('actions/adk-actions.ts','adk/arvo-wings-agents.ts','adk/arvo-wings.ts','adk/core.ts','adk/engraver.ts','adk/rune-registry.ts','adk/ten-wings-agents.ts','adk/ten-wings.ts','adk/types.ts','agents/adk-apostles.ts','agents/alchemy-agent.ts','agents/arvo-agents.ts','agents/knowledge-collector.js','agents/navigation-swarm.ts','agents/omni-agent-bus-autonomy.js','agents/omni-agent-bus-hook.js','agents/omni-agent-bus.js','agents/omni-agent-bus.ts','agents/swarm-orchestrator.ts','api-utils.ts','api/cache.ts','arvo/arvo-apostles.ts','config/guides.ts','config/navigation.ts','context/app-context.tsx','core/5t-protocol.ts','core/omni-heart.ts','core/omni-index.ts','core/omni-kernel.ts','core/omni-linter.ts','core/omni-vault.ts','core/services/report-generator-v5-full.ts','core/services/report-generator-v5.ts','data/esg-functions.ts','esggo.ts','examples/omni-workflow-demo.ts','firebase.ts','hooks/use-omni-index.ts','hooks/useNoteSystem.ts','hooks/useTaskSystem.ts','hooks/useTimeNexus.ts','ncb-service.ts','ncb-utils.ts','omni-agent/index.ts','omni-tag/index.ts','omni-theme/design-system.ts','redis/client.ts','redis/index.ts','redis/state.ts','runes/aesthetic-rune.ts','runes/alchemist-rune.ts','runes/benchmark-rune.ts','runes/consistency-rune.ts','runes/covenanter-rune.ts','runes/creative-genesis-rune.ts','runes/creative-resonance-rune.ts','runes/data-visualizer-rune.ts','runes/debate-rune.ts','runes/dispatcher-rune.ts','runes/emotion-sensor-rune.ts','runes/engraver-rune.ts','runes/evidence-verification-rune.ts','runes/hallucination-verification-rune.ts','runes/interaction-intuition-rune.ts','runes/market-adaptation-rune.ts','runes/ncbdb-engrave-rune.ts','runes/optical-renderer-rune.ts','runes/perception-integrator-rune.ts','runes/regulation-rune.ts','runes/semantic-alchemy-rune.ts','runes/semanticist-rune.ts','runes/strategic-mapping-rune.ts','runes/telepath-rune.ts','runes/tracer-rune.ts','runes/validator-rune.ts','runes/verification-certificate-rune.ts','runes/visual-perceptor-rune.ts','schemas/alchemy-schema.ts','schemas/navigation-schema.ts','services/EntropyAgent.ts','services/TaskAlchemist.ts','services/adk/AwakeningManager.ts','services/adk/adk-guardrails.ts','services/adk/adk-squad-factory.ts','services/adk/apostle-dispatcher-server.ts','services/adk/apostle-squad-manager.ts','services/adk/persistent-session-service.ts','services/arvoAgent.ts','services/automationService.ts','services/esg/DataOrchestrator.ts','services/esg/DataOrchestratorServer.ts','services/esg/ReportGeneratorServer.ts','services/esgRAG.ts','services/google-drive.ts','services/ncbdb.ts','services/omni-synergy-demo.ts','services/sentient-bus.ts','services/skillKnowledge.ts','services/trust-vault.ts','sustain-write/answer-database.ts','sustain-write/index.ts','sustain-write/omni-tag.ts','sustain-write/question-bank.ts','types/esg-core.ts','types/oab-types.ts','types/oag-types.ts','types/omni-note.ts','utils.ts')
function LibExists($tgt) {
  return ($libFiles -contains $tgt) -or ($libFiles -contains ($tgt + '.ts')) -or ($libFiles -contains ($tgt + '.tsx')) -or ($libFiles -contains ($tgt + '/index.ts')) -or ($libFiles -contains ($tgt + '/index.tsx')) -or (($libFiles | Where-Object { $_ -like ($tgt + '/*') }).Count -gt 0)
}
$badLib = @()
foreach ($f in $routeFiles) {
  $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  foreach ($m in [regex]::Matches($txt, $pattern)) {
    $tgt = $m.Groups[1].Value
    if (-not (LibExists $tgt)) {
      $badLib += ($f.FullName.Substring($root.Length).TrimStart('\') + ' -> @lib/' + $tgt)
    }
  }
}
Log ('@lib/ targets NOT existing in lib/ (must be empty): ' + $badLib.Count)
foreach ($b in $badLib) { Log ('  BAD: ' + $b) }

# ---------- R2-3: dynamic-import remnants (@/lib/...) - verify src/lib exists ----------
Log '--- R2-3: remaining @/lib/ dynamic imports ---'
$srcLibFiles = @('_server-stub.ts','agnes-api.ts','api-utils.ts','auth.ts','bus.ts','celestial/implementation.ts','celestial/interfaces.ts','cloudflare/index.ts','cloudflare/r2.ts','cloudflare/turnstile.ts','cloudflare/workers-ai-fallback.ts','cloudflare/workers-ai.ts','cron-jobs.ts','design-system.ts','embedding-generator.ts','engines/intelligence-modules.ts','engines/subscription-engine.ts','errors.ts','esg-analysis/engine.ts','esg-analysis/index.ts','esg-analysis/types.ts','esg-analysis/visualization.ts','esg-compliance-workflow.ts','esg-report/engine.ts','esg-report/index.ts','esg-report/types.ts','esg-sonnar.ts','esggo.ts','firebase-admin.ts','firebase.ts','five-t-protocol.ts','knowledge-card.ts','ncb-client.ts','ncb-utils.ts','omni-agent-bus.ts','omni-agent/index.ts','omni-agent/sample-agent.ts','omni-base/index.ts','omni-base/plugin-registry.ts','omni-component/functional/index.ts','omni-component/index.ts','omni-component/rules.ts','omni-component/types.ts','omni-component/ui/components.tsx','omni-component/ui/index.ts','omni-component/ui/utils.ts','omni-component/visualization/charts.ts','omni-component/visualization/index.ts','omni-core.ts','omni-core/__tests__/omni-function.test.ts','omni-core/celestial-core-processor.ts','omni-core/contracts.ts','omni-core/ecosystem.ts','omni-core/entropy-forge.ts','omni-core/index.ts','omni-core/omni-function.ts','omni-core/omni-kernel.ts','omni-core/omni-note.ts','omni-core/types.ts','omni-seed/index.ts','omni-tag/index.ts','omni-theme/index.ts','omni-wiki/index.ts','pgvector.ts','prisma-omni.ts','prisma.ts','rate-limit.ts','report-brand-theme.ts','report-service.ts','resource-library.ts','safe-api.ts','storage-service.ts','sustain-write/biz-intelligence.ts','sustain-write/c-version.ts','sustain-write/data-processing.ts','sustain-write/index.ts','sustain-write/omni-tag.ts','sustain-write/theme-manager.ts','sustain-write/ui-design.ts','types/esg-charts.ts','user-profile.ts','vector-search.ts','village-seeder.ts','zkp-service.ts','zod-validation.ts')
function SrcLibExists($tgt) {
  return ($srcLibFiles -contains $tgt) -or ($srcLibFiles -contains ($tgt + '.ts')) -or ($srcLibFiles -contains ($tgt + '.tsx')) -or ($srcLibFiles -contains ($tgt + '/index.ts')) -or ($srcLibFiles -contains ($tgt + '/index.tsx')) -or (($srcLibFiles | Where-Object { $_ -like ($tgt + '/*') }).Count -gt 0)
}
$pat2 = '@/lib/([A-Za-z0-9_\-./]+)'
$badSrc = @()
foreach ($f in $routeFiles) {
  $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  foreach ($m in [regex]::Matches($txt, $pat2)) {
    $tgt = $m.Groups[1].Value
    if (-not (SrcLibExists $tgt)) {
      $badSrc += ($f.FullName.Substring($root.Length).TrimStart('\') + ' -> @/lib/' + $tgt + ' (NOT in src/lib)')
    }
  }
}
Log ('@/lib/ targets NOT existing in src/lib (these are the real broken ones, must be @lib): ' + $badSrc.Count)
foreach ($b in $badSrc) { Log ('  BROKEN-REMAINING: ' + $b) }
Log 'remaining @lib/ targets (should be only the 9 genuinely broken):'
$libTargets = @{}
foreach ($f in $routeFiles) {
  $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  foreach ($m in [regex]::Matches($txt, $pattern)) {
    $tgt = $m.Groups[1].Value
    if (-not $libTargets.ContainsKey($tgt)) { $libTargets[$tgt] = 0 }
    $libTargets[$tgt]++
  }
}
foreach ($k in ($libTargets.Keys | Sort-Object)) { Log ("    @lib/" + $k + " x" + $libTargets[$k]) }

# ---------- R2-4: run vitest locally to diagnose test failure ----------
Log '--- R2-4: local vitest run (diagnose) ---'
if (Test-Path (Join-Path $root 'node_modules')) {
  $vtLog = Join-Path $logDir 'vitest-r2.log'
  $vtErr = Join-Path $logDir 'vitest-r2.err'
  $p = Start-Process -FilePath 'pnpm' -ArgumentList @('vitest','run','--reporter=verbose') -WorkingDirectory $root -NoNewWindow -PassThru -RedirectStandardOutput $vtLog -RedirectStandardError $vtErr
  if (-not $p.WaitForExit(600000)) {   # 10 min cap
    try { $p.Kill() } catch {}
    Log 'VITEST: TIMEOUT after 10min (killed)'
  } else {
    Log ('VITEST: exit code = ' + $p.ExitCode)
    Get-Content $vtLog -Tail 60 -ErrorAction SilentlyContinue | ForEach-Object { Log ('    V| ' + $_) }
    Get-Content $vtErr -Tail 30 -ErrorAction SilentlyContinue | ForEach-Object { Log ('    E| ' + $_) }
  }
} else {
  Log 'node_modules missing - skip vitest'
}

# ---------- R2-5: diff stat + commit + push + PR body fix ----------
Log '--- R2-5: diff + commit + push ---'
Run 'git' @('diff','--stat') 'git diff --stat'
Run 'git' @('diff','--name-only') 'git diff --name-only'

# PR body file (UTF-8, avoid argv encoding mangling)
$bodyPath = Join-Path $logDir 'pr-body-416.md'
$body = @'
修復 OmniCore CI 的 Build Check 與 Docker syntax check 失敗（#1545/#1547）。

## 1. Build Check — broken import 修復（範圍：僅真正 broken 的目標）
經比對 repo 檔案樹後，只有 9 個 `@/lib/` import 目標在 `src/lib/` 下不存在（`@lib/` 指向的 `lib/` 才存在）：
- adk/arvo-wings-agents、adk/ten-wings-agents、core/5t-protocol
- services/adk/apostle-dispatcher-server、services/adk/apostle-squad-manager
- services/esg/DataOrchestratorServer、services/esg/ReportGeneratorServer
- services/google-drive、services/ncbdb

第一輪對 app/api 全部 route.ts 的 `@/lib/` → `@lib/` 全域替換過度（tsconfig `@/*`→`./src/*`、`@lib/*`→`./lib/*`，兩者皆存在時原 import 合法）。本輪已把 21 個誤改目標（含 api-utils 等 65 檔）revert 回 `@/lib/`，僅保留上述 9 個真正 broken 的 `@lib/` 修復。

## 2. Docker syntax check
- `vps/docker-compose.yml`：build context `/opt/esggo` → `..`（runner 上可解析；dockerfile 路徑不變）
- `ci.yml`：移除吞錯誤的 `2>/dev/null`；Dockerfile `build --check` 失敗降為 `::warning::`（依賴 VPS context）

## 3. learning-center-ci
- pnpm `version: 11` → `11.5.2`（11 無法解析）
'@
[System.IO.File]::WriteAllText($bodyPath, $body, $utf8)
Log ('PR body file written: ' + $bodyPath)

$cm = @('-m','fix(ci): scope @lib rewrites to genuinely broken imports only',
        '-m','- Revert 21 mis-scoped @lib rewrites back to @/lib (src/lib exists; e.g. api-utils x65, village-seeder, rate-limit, zkp-service)',
        '-m','- Keep @lib only for 9 targets missing from src/lib (adk/arvo-wings-agents, adk/ten-wings-agents, core/5t-protocol, services/adk/*, services/esg/*, services/google-drive, services/ncbdb)')
Run 'git' @('add','-A') 'git add -A'
Run 'git' @('commit', $cm) 'git commit (round 2)'
Run 'git' @('push') 'git push'
Run 'gh' @('pr','edit','416','--body-file',$bodyPath) 'gh pr edit 416 --body-file'

Pop-Location
Log '==================== RUN 2 COMPLETE ===================='
