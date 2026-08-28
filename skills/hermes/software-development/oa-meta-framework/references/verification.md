# OA Framework Verification

## Local (the only reliable path)
`pnpm run typecheck` / `pnpm run test` are BLOCKED by pnpm 11.5.2 `runDepsStatusCheck`
(workspace-wide gate fails on other unbuilt packages; unrelated to oa-framework).

Use npx directly:
```bash
cd packages/oa-framework
npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck   # TSC_EXIT=0
npx --no-install tsx test/smoke.ts                              # ALL_7_FRAMEWORKS_OK
```
Smoke output meaning:
`[adk] hash=... field=PASS CONTENT_OK` → both 5T layers passed.
`field=FAIL CONTENT_FAIL:content:traceable,...` → content-level gate caught a too-short/scaffold output.

## What the double-gate checks
1. Field-level: `t5` 5 booleans (all true) + Hash Lock recompute matches (no tamper).
2. Content-level (`omni-gate.verifyAllGates`, mirrors omni-agent/gates.ts):
   - traceable ≥100 chars + /GRI|ISO|來源|引用/
   - transparent ≥150 chars + /%|百分比|比率|公開|揭露/
   - tangible   ≥200 chars + /完成|達成|實現|推動|建立|導入|數量|金額/
   - trustworthy≥120 chars + /ZKP|hash|sha|封印|驗證|審計|audit/
   - trackable  ≥80  chars + /202[5-9]|年度|期間|日期|追蹤|monitor/
`forgeT5` pre-wraps every output in a 5T quality report so scaffold strings fail loudly.

## CI note
The repo-root `.github/workflows/crewai-run.yml` is a separate CrewAI pipeline; oa-framework
has no CI of its own yet. If adding one, use `npx tsc` + `npx tsx`, NOT `pnpm run`, to avoid
the workspace gate in GitHub Actions too.
