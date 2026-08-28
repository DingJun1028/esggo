# 大型 monorepo 單一真相源 verify 技法（soul.md §12 實戰）

> 配套的「全域增量升級」閉環：把規格文檔實作為 `libs/*` 套件，並用 verify 腳本證明「全倉唯一源 + 無洩漏 + 依賴已切換」。

## 場景
文檔聲稱「§12 規格源 = libs/incremental，oa-swarm 已棄 vendor 副本改用 workspace 權威包」。
需寫 `scripts/verify_*.py` 以 EXIT=0 證明，且不能因掃描 18 萬檔超時或註解誤判而假失敗。

## 三斷言（單一真相源 = 掃描結果，不讀敘述）
1. vendor 副本目錄不存在：`os.path.isdir("oa-swarm/src/vendor/incremental")` → False。
2. 消費方依賴權威包：`package.json` 含 `"@esggo/incremental": "workspace:*"`；且 `src/incremental.ts`
   有 `export * from '@esggo/incremental'`。**只比對 import/export 陳述**：
   ```python
   import re
   src = open("oa-swarm/src/incremental.ts", encoding="utf-8").read()
   re.search(r"^\s*(import|export)\b.*['\"]@esggo/incremental['\"]", src, re.M)  # 必須命中
   re.search(r"^\s*(import|export)\b.*vendor/incremental", src, re.M)           # 必須不命中（註解不算）
   ```
3. 全倉 §12 規格源唯一：`git grep -l "5T 合規增量輸出基礎設施" -- "*.ts"` 命中僅 `libs/incremental/...`。

## 斷言3 掃描（秒級，避免 os.walk 超時）
```python
import subprocess, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPEC_MARK = "5T 合規增量輸出基礎設施"
hits = []
# (a) 追蹤檔：git grep（0.28s，尊重 .gitignore）
r = subprocess.run(["git","grep","-l",SPEC_MARK,"--","*.ts"], cwd=ROOT,
                   capture_output=True, text=True, timeout=30)
if r.returncode == 0:
    hits += r.stdout.splitlines()
# (b) 未追蹤 .ts 補掃
r2 = subprocess.run(["git","ls-files","--others","--exclude-standard","--","*.ts"],
                    cwd=ROOT, capture_output=True, text=True, timeout=30)
if r2.returncode == 0:
    for rel in r2.stdout.splitlines():
        if rel.startswith("libs/incremental"):
            continue
        if SPEC_MARK in open(os.path.join(ROOT, rel), encoding="utf-8").read():
            hits.append(rel)
# (c) fallback：非 git 環境才走精簡 walk
if not hits and not os.path.exists(os.path.join(ROOT, ".git")):
    skip = {os.path.join(ROOT,"node_modules"), os.path.join(ROOT,"libs","incremental")}
    for dp, dn, fns in os.walk(ROOT):
        dn[:] = [d for d in dn if os.path.join(dp,d) not in skip
                 and d not in ("dist",".next",".opencode","esggo-omni-center","rules-tutorial")]
        for fn in fns:
            if fn.endswith(".ts") and SPEC_MARK in open(os.path.join(dp,fn), encoding="utf-8").read():
                hits.append(os.path.relpath(os.path.join(dp,fn), ROOT))
leaked = [h for h in hits if not h.startswith("libs/incremental")]
assert not leaked, f"規格源洩漏: {leaked}"
```

## 配套 pnpm 解析（見 esggo-monorepo-build Trap 11）
verify 通過不代表依賴真的可解析。`workspace:*` 要生效須：根 `pnpm-workspace.yaml` 含 `libs/*`，
且消費方 `oa-swarm` 未被 `!oa-swarm` 排除（僅排除 `!apps/oa-swarm` 部署殘留）。`pnpm install`
後用 `node -e "import('@esggo/incremental').then(m=>console.log(Object.keys(m).length))"` 證明
9 個 §12 導出可解析（APIGateway/CacheManager/DeltaTracker/ETLPipeline/ErrorHandler/EventBus/
ServiceOrchestrator/hashLock/generateTraceableId）。

## 實證數據（2026-08-24）
- libs/incremental vitest：3 files / 20 tests passed。
- verify 腳本：3/3 通過，EXIT=0（git grep 0.28s）。
- 修復前：os.walk 全倉 183,980 個 .ts → 400s 超時；註解 "vendor/incremental" 觸發 false FAIL。
