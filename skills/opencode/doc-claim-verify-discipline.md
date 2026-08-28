---
name: doc-claim-verify-discipline
description: 文檔聲稱升級為可重複驗證閉環的寫腳本技法（comment 誤判 + monorepo 掃描超時坑）。
---

# 文檔聲稱 → 可重複驗證閉環 技法

> 核心鐵律：**文檔聲稱不得以文字自證，任何枚舉矩陣 / 單一真相源 / 依賴切換必須配套可重複驗證腳本（EXIT=0 方得宣稱通過）。**
> 本技能是 `oa-gap-remediation-playbook` 的「寫 verify 腳本」技法補強（原技能為 user-owned，此為 curator 可維護副本收納本場新坑）。

## When to use
- 為 soul.md / 聖典 / 規格書的缺口補齊撰寫 `scripts/verify_*.py`
- 要證明「全倉唯一源」「無重複實作」「依賴已從 vendor 副本切到 workspace 權威包」
- 掃描大型 monorepo（18 萬+ .ts）做單一真相源斷言

## Pitfalls（本場實證，必避）

### P0 nested-object regex false-stop (嵌套物件 regex 非貪婪提早停止)
When extracting nested objects from a TypeScript source string using a non-greedy
regex like `\{([\s\S]*?)\}` or `\{\s*([\s\S]*?)\s*\}`, the matcher stops at the
*first* `\},` it encounters — which is typically the inner closing brace of a
nested object (e.g. `mobile: { min: 0, max: 600 },`), not the outer block.

**Verified instance:** Extracting `FLOAT_CANONICAL.breakpoints` from
`types/float-matrix.ts`:
```text
breakpoints: {
    mobile: { min: 0, max: 600 },   ← regex stops HERE (first },)
    tablet: { min: 601, max: 900 },
    desktop: { min: 901, max: 1440 },
    ultrawide: { min: 1441, max: Infinity },
  },
```
The regex `/breakpoints:\s*\{([\s\S]*?)\s*\},/` captured only
`mobile: { min: 0, max: 600` — yielding `['mobile']` instead of all 4 breakpoints.

**Fix:** Anchor the match on the *next sibling property* instead of a bare
`\},\s*`:
```javascript
// Correct: match up to the next top-level key
const bpMatch = body.match(/breakpoints:\s*\{([\s\S]*?)\n\s*\},?\s*\n\s*orientations:/);
```
If the structure has no predictable next key, parse brace depth manually:
```javascript
function extractObject(src, key) {
  const start = src.indexOf(key + ': {');
  let depth = 0, i = src.indexOf('{', start);
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { if (--depth === 0) break; }
  }
  return src.slice(start, i + 1);
}
```

### P1 comment false-positive（註解誤判）

驗證「來源是否切換」時，若用 `if "vendor/incremental" in src` 這類原始子串比對，會把**註解**裡的解釋文字
（如「已移除 src/vendor/incremental 副本」）誤判為仍引用 → 腳本 FAIL，但程式碼其實正確。
**修正：只對 import/export 陳述做比對**，用錨定行首的正則：
```python
import re
src = open("oa-swarm/src/incremental.ts", encoding="utf-8").read()
# 必須命中（權威包 re-export）
assert re.search(r"^\s*(import|export)\b.*['\"]@esggo/incremental['\"]", src, re.M)
# 必須不命中（vendor 副本引用只數 import/export 行，註解不算）
assert not re.search(r"^\s*(import|export)\b.*vendor/incremental", src, re.M)
```
通則：**驗證「來源是否切換」只看陳述句，不看敘述/註解。**

### P2 全倉掃描超時（18 萬 .ts）
`os.walk(ROOT)` 逐檔 `read()` 在大型 monorepo 會爆 400s 超時（實測 183,980 個 .ts）。
**單一真相源掃描改用 `git grep`**（尊重 .gitignore、僅追蹤檔、0.28s）+ `git ls-files --others` 補掃未追蹤檔 + 非 git 環境才 fallback 精簡 walk。
見 `references/monorepo-single-source-verify.md` 可取用完整模板（含 fallback prune 清單）。

## 五步閉環（精簡版）
1. 量化基線：先掃現狀算缺口數字，避免盲目補。
2. MECE 重構：每陣列對 1:1 映射 × 固定組數 + 樞紐配對，結論須可驗。
3. 命名矛盾清零：掃全文修正錯置職稱，同步所有引用章節。
4. 驗證閉環化：寫 `scripts/verify_*.py`，單一真相源 = 矩陣定義，不讀敘述；**實測 EXIT=0 才算完成**。
5. 跨文檔對齊 + 技法固化。

## 配套 pnpm 解析驗證（跨技能）
verify 腳本通過 ≠ 依賴真的可解析。見 `esggo-monorepo-build` Trap 11：
`workspace:*` 要生效須根 `pnpm-workspace.yaml` 含 provider glob（如 `libs/*`），且消費方未被
`!pkg` 排除。`pnpm install` 後用 `node -e "import('@esggo/x').then(m=>console.log(Object.keys(m).length))"`
證明導出可解析——「紙上依賴 ≠ 實際解析」。

## Verification（交付前必跑）
```bash
python scripts/verify_incremental_single_source.py   # 預期：通過 3 / 失敗 0, EXIT=0
node -e "import('@esggo/incremental').then(m=>console.log(Object.keys(m).length))"  # 預期：9
```
If EXIT≠0：區分「文檢錯」改 SKILL/文檔 vs 「腳本錯」改 verify_*.py，勿互掩。

---
另參: `references/ts-matrix-bidirectional-sync.md` (TypeScript ↔ Runtime 雙向同步驗證技法，
含 P0 regex false-stop 修正模板 + Windows ESM `fileURLToPath` 路徑解析技法)。
