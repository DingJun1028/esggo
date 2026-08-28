# export-shared-types.js 生成器實證 bug 與修法（2026-08）

> 來源：universal-translator 接入雙向 TS 矩陣時實測。generator 原寫給 `esggo-learning-center`（與 esggo 同層）用，從 monorepo `apps/<app>` 跑會爆三個 bug。

## Bug 1：ESM 下 `__dirname` 未定義
**症狀**：`ReferenceError: __dirname is not defined in ES module scope`（repo 有 `type: module`）
**修法**：
```js
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

## Bug 2：SRC 路徑錯誤（從 apps/<app> 跑）
**原碼**：`const SRC = path.resolve(process.cwd(), '..', 'esggo', 'shared', 'types.ts');`
**實際解析**（cwd=`apps/universal-translator`）：`apps/esggo/shared/types.ts` ❌
**修法**（以 scripts 位置為基準，與 caller cwd 無關）：
```js
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'shared', 'types.ts');
```

## Bug 3：type 多行 union 截斷
**症狀**：生成檔斷裂 → `error TS1005: ';' expected`（如 `LanguageCode` 區塊只截到第一行空 body）
**原因**：`findExportBlock` 對所有 kind 都用大括號 `{ }` 配對；但 `type X = \n  | 'a' \n  | 'b';` 沒有大括號，配對邏輯直接把第一行（空 body）當區塊尾截出。
**修法**：`findExportBlock` 對 `kind==='type'` 且該行不含 `{` 時，改以 `;` 結尾偵測：
```js
if (start !== -1) {
  if (kind === 'type' && !l.includes('{') && lines[start].trim().startsWith('export type') && l.endsWith(';')) {
    return lines.slice(start, i + 1).join('\n');
  }
  braces += (l.match(/{/g) || []).length;
  braces -= (l.match(/}/g) || []).length;
  if (braces <= 0) return lines.slice(start, i + 1).join('\n');
}
```

## 驗證
```bash
cd apps/universal-translator
node ../../scripts/export-shared-types.js
# 期望: OK types/generated/esggo-shared.d.ts
# grep -c "TranslateEngine\|LanguageCode\|ISseTranslationEvent" types/generated/esggo-shared.d.ts  → 應 >0 且無 TS 語法錯
```
