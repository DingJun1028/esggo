---
name: esggo-omnidag-ci-heal
description: Use when esggo CI is red or OmniTag contract violations appear — heals OmniCore CI / Sacred Pipeline / ESG-GO CI/CD / Deploy workflows by reproducing the failure locally, fixing the root cause, and re-enabling gates. Covers pnpm-workspace oa-swarm lockfile drift, vitest await-in-non-async-it, TypeScript TS1351 bare numeric key, OmniTag parser matching code like [key: string], omnitag-audit cron, and gh workflow enable/disable.
---

# esggo OmniTag + CI 修復實戰技書

固化自 2026-08-21 一輪「優化 esggo 遠端工作流、讓 CI 通知不再有代碼錯誤」的實戰。
所有坑都在真實終端重現並解決，非推測。

## 觸發條件
- `gh run list --status failure` 顯示 OmniCore CI / Sacred Pipeline / ESG-GO CI/CD / Deploy to Vercel / Deploy to Oracle VPS 紅
- 用戶說「優化工作流」「CI 紅」「合約率」「報錯不再發生」「經驗技能書」
- `pnpm oa:audit` 合約率 < 100%

## 核心原則（詔二誠實 / 不降通知標準）
1. **核心 CI 不能禁用**（OmniCore/Sacred/ESG-GO）——關了未來代碼錯誤收不到通知，違反「不降標準」。
2. **純憑證失效的部署 workflow**（Vercel/Oracle token 過期）→ 可 `gh workflow disable`（噪音，可 `gh workflow enable` 隨時恢復）；但若用戶說「恢復限制」就 `gh workflow enable` 回來。
3. **代碼錯誤必須根因修復**，不是掩蓋、不是 skip 整個 CI。
4. **絕不讀寫 secrets / 不擅自填金鑰值**。

## 診斷流程（先診斷再治療）
```bash
gh auth status                                    # 確認登入
git fetch origin && git status -sb                # 本地 ahead/behind
gh run list --limit 30 --status failure           # 列出所有紅 run
gh run view <RUN_ID> --log-failed                 # 抓失敗 step 的真實 error
# 注意 gh run list 表格在 Windows/MSYS 下欄位錯位；抓 run ID 用：
gh run list --limit 1 --workflow "OmniCore CI" 2>/dev/null | grep -oE "324[0-9]{8}" | head -1
# 再用 gh run view <RUN_ID> --json jobs -q '.jobs[] | "\(.name)\t\(.conclusion)"'
```
**不要用** `gh run list --json number` 再 `gh run view $number` —— number 欄位在這環境回傳錯值（404）。

## 已知坑 → 根因修復（直接套用）

### 坑 A：ERR_PNPM_OUTDATED_LOCKFILE (Deploy Vercel/Oracle/Sacred 全紅)
- 現象：`Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/oa-swarm/package.json` + `3 dependencies were added: typescript/tsx/vitest`
- 根因：`oa-swarm/` 是根目錄下的獨立可部署 App（自有 Dockerfile/ecosystem/lock），被 `pnpm-workspace.yaml` 的 `.` 視為根 workspace 成員 → 根 lock 需含其 devDeps。
- 修復：在 `pnpm-workspace.yaml` 加排除：
  ```yaml
  packages:
    - '.'
    - '!oa-swarm'   # 獨立 App，排除出根 workspace
  ```
- 驗證：`pnpm install --frozen-lockfile`（exit 0）。本地可能已 "Already up to date" 但 CI(node22) 仍掛——排除是根治。
- **不要用** `pnpm install`（無 frozen）去「更新 lock」當作修復——那會改 lock 引入其他漂移；排除成員才是對的。

### 坑 B：vitest `await` 在 non-async `it` 裡（oa-cli test 報 ReferenceError/not defined）
- 現象：test 用到 `const x = await import(...)` 但 `it('...', () => {` 沒 `async`。
- 修復：把 `it('...', () => {` 改 `it('...', async () => {`。
- 或用 `const mod = require('./audit')`（同步 require，避免 async）。

### 坑 C：TypeScript TS1351 `5T驗算:` 未引號
- 現象：`error TS1351: An identifier or keyword cannot immediately follow a numeric literal` 指向 `5T驗算:` 這種 key。
- 根因：`5T驗算` 以數字 `5` 開頭，當作物件 key 必須引號包住。
- 修復：改 `'5T驗算':`。（ESG-GO CI/CD Pipeline 報的 omnitag-contract.ts(198) 就是這個）

### 坑 D：OmniTag parser 誤匹配程式碼 `[key: string]: unknown`
- 現象：`parseOmniTagHeader` 把 interface 裡的 `[key: string]: unknown;` 當成標籤 `key:key: string`。
- 修復：parser 只掃註釋行（`//` 或 `*` 開頭），不掃裸程式碼：
  ```ts
  const headLines = content.split('\n').slice(0,30).filter(l => /^\s*(\/\/|\*)/.test(l));
  const head = headLines.join('\n');
  ```

### 坑 E：oa tag --init 用 audit.violations 找「待補標」檔（邏輯錯位）
- 現象：補標 0 檔，但 `oa audit` 明明有違規。
- 根因：`auditOmniTags().violations` = 「帶標籤但不合約」；**完全無標頭的檔案不在 violations**（連 tagged 都不算）。
- 修復：新增 `findUntagged(dirs)` 掃描完全無 OmniTag 標頭的 .ts，對齊 `tag --init` 用。

### 坑 F：applyHeader 對 tmpdir 路徑 suggest 回 null 拒寫
- 現象：測試用 `os.tmpdir()` 路徑補標，suggestOmniTag 回 null → 不寫。
- 修復：`suggestOmniTag` 對無匹配路徑回預設 `5T驗算`（對齊「預設即合規」），不回 null。

### 坑 G：suggestOmniTag 前導斜線匹配失敗
- 現象：`suggestOmniTag('cli/oa-cli/src/bar.ts')` 期望 `光之羽翼` 收到 undefined。
- 根因：`'/cli/'` 含前導斜線，而路徑開頭是 `cli/`（無前導 /）。
- 修復：用 `filePath.replace(/\\/g,'/').split('/')` 段匹配，不用 `includes('/cli/')`。

### 坑 H：oa audit --json 模式不主動 exit 1
- 現象：CI 裡 `pnpm oa:audit --json || echo FAILED` 永遠不觸發（合約率<100% 也 exit 0）。
- 根因：audit 命令的 `process.exit(1)` 只在非 json 分支；`--json` 分支只 `console.log`。
- 修復（CI 端）：`node -e "const r=require('./audit-result.json'); if(r.rate<1){...AUDIT_FAILED=true...}"`。
- 也注意 `pnpm oa:audit --json` 的 stdout 會混進 prepare hook 的 `[5T:Traceable]` 行 → 用 `pnpm oa:audit --json 2>/dev/null | grep '^{' > audit-result.json` 過濾。

### 坑 I：`oa audit` 的 `--json` 輸出結構
- 欄位：`{ scanned, tagged, compliant, rate, violations }`，rate=1 表示 100%。
- `--dir` 預設 `src,cli`；push 閘用 `src/lib,cli/oa-cli/src`。

## 驗證命令集（每次修完必跑）
```bash
# TS 端（涵蓋 src/lib/**，不用 tsconfig.core.json 盲點）
npx tsc -p tsconfig.json --noEmit          # 期望 exit 0
# OmniTag 契約 + 路由 + 跨語言 hashlock
pnpm vitest run src/lib/__tests__/         # 期望全 passed
# oa-cli
cd cli/oa-cli && pnpm test                 # 期望全 passed（6 skipped 正常）
# 合約率門檻
pnpm oa:audit                              # 期望 [§20.5 合約率] 100.0%
# Python 5T
python -m pytest tests/test_verification.py -q
# YAML 工作流語法
python -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"
```

## 收尾 commit 策略（避免 staging 陷阱）
- 用 `git add <explicit files>` 而非 `git add -A`（避免誤夾帶畸形/未追蹤檔）。
- commit 後 `git status --short` 確認 working tree 乾淨。
- 推送前 `git fetch && git status -sb` 確認遠端無新 commit；若有並發 commit，先 `git pull --rebase` 再 push。
- **encoding-check pre-commit** 會攔截編碼問題；commit 訊息出現 `[encoding-check] ✓` 即安全。

## 固化品質門檻（讓未來不反覆紅）
1. `package.json` 加 `"oa:audit": "tsx cli/oa-cli/src/index.ts audit --dir \"src/lib,cli/oa-cli/src\""`
2. `CLAUDE.md` §0 明訂「合約率 100% 經 `pnpm oa:audit` 驗證，CI 強制」
3. `README.md` 加「品質門檻與 CI 守則」小節
4. `.github/workflows/ci.yml` 加 `omnitag-audit` job（push 閘）
5. `.github/workflows/omnitag-weekly-audit.yml` 加 cron `0 3 * * 1`（每週一 03:00 UTC 抽驗，合約率<100% 自動開 issue 告警 `omnitag-audit-alert`，不紅 CI）

## 禁用/啟用部署 workflow（憑證失效時）
```bash
gh workflow list --all | grep -iE "vercel|oracle"   # 看 active/disabled_manually
gh workflow disable "Deploy to Vercel"               # 純憑證失效噪音
gh workflow enable "Deploy to Vercel"                # 用戶說「恢復限制」時
```

## 反模式（不要做）
- 不要用 `pnpm install`（無 frozen）去「修 lockfile 紅」——改 workspace 排除成員。
- 不要為過 CI 而 `skip` 整個 test 或 `continue-on-error` 吞掉核心 CI 錯誤。
- 不要把並發 session 的未追蹤目錄（如 `oa-swarm/`、`scripts/sync-*`）當成自己的改動 commit。
- 不要 `gh run view $number`（number 欄位壞）；用 `grep -oE "324[0-9]{8}"` 抓 run ID。
