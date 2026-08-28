# TypeScript ↔ Runtime 雙向同步驗證技法 (TS-JSS Bridge Verify)

> 配套 `oa-gap-remediation-playbook` §P0 (nested-object regex false-stop) + `doc-claim-verify-discipline`

## 場景
文檔聲稱「TypeScript 型別 (types/float-matrix.ts) 與 Runtime 對應 (shared/float-matrix.mjs) 雙向同步」。
需寫 `scripts/verify-float-matrix.mjs` 以 EXIT=0 證明，不能因 regex 非貪婪提早停止或 Windows 路徑解析錯誤而假失敗。

## 三斷言 (TypeScript ↔ Runtime 1:1 對應)
1. **TypeScript FLOAT_CANONICAL** 擷取: `breakpoints`, `subtitleSources`, `audioSources`, `roles`, `versions` 5 組
2. **Runtime 對應 consts**: `BREAKPOINT_NAMES`, `SUBTITLE_SOURCES`, `AUDIO_SOURCES`, `ROLES`, `VERSIONS`
3. **CSS 變數同步**: TypeScript `FloatCSSVars` interface (19 個 `--var`) ↔ Runtime `CSS_VARS` (19 個) ↔ `float.html` `:root` (19 個)

## regex 修正 (P0 nested-object false-stop)
```javascript
// ❌ 錯誤: non-greedy stops at inner },
const bpRegex = /breakpoints:\s*\{([\s\S]*?)\s*\},/;

// ✅ 正確: anchor on next sibling property
const bpRegex = /breakpoints:\s*\{([\s\S]*?)\n\s*\},?\s*\n\s*orientations:/;
```

## Windows ESM 路徑 (Pattern 5)
```javascript
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const __filename = fileURLToPath(import.meta.url);  // NOT new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename);
```

## 驗證腳本 (scripts/verify-float-matrix.mjs)
```bash
node scripts/verify-float-matrix.mjs
# 預期: ✅ 5T 驗算閘: 全部通過 (12/12), Score: 1/1
```