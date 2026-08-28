# export-shared-types.js — 已知 bug 與修復 (2026-08-08 實證)

全域雙向 TS 矩陣的 generator `scripts/export-shared-types.js` 在本次 universal-translator 接入時暴露三個真實 bug，均已修復。下次擴充 consumer 或 map 時直接複用這些修法。

## Bug A: SRC 路徑依賴 cwd 解析錯誤
原碼：`const ROOT = path.resolve(process.cwd(), '..'); const SRC = path.join(ROOT, 'esggo', 'shared', 'types.ts');`
問題：從 `apps/universal-translator` 跑 → 解析成 `apps/esggo/shared/types.ts`（錯）。generator 原本只給「與 esggo 同層」的 consumer 用。
修法：scripts/ 在 monorepo 根，故以 `__dirname` 為基準：
```js
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'shared', 'types.ts');
```
DEST 仍為 `path.join(process.cwd(), 'types', 'generated', 'esggo-shared.d.ts')`（由 caller cwd 決定，保持不變）。

## Bug B: ESM 下 `__dirname` 未定義
repo 根 `package.json` 有 `"type": "module"`，node 把 `.js` 當 ESM 跑 → `ReferenceError: __dirname is not defined in ES module scope`。
修法：見 Bug A 的 `fileURLToPath(import.meta.url)` 片段（修 A 同時解決 B）。

## Bug C: 多行 `type` union 被截斷
原 `findExportBlock` 只對 `enum`/`interface` 做大括號配對；`type X = \n  | 'a'\n  | 'b';` 首行 body 為空，導致生成的 `.d.ts` 在該行斷裂（報 TS1005）。
修法：對 `kind === 'type'` 且不含 `{` 的，以 `;` 結尾掃描：
```js
if (start === -1 && (l.startsWith(head) || l.startsWith(headPlain) || l.startsWith('export type ' + name + ' '))) {
  start = i;
  if (kind === 'type' && !l.includes('{')) {
    if (l.endsWith(';')) return lines.slice(start, i + 1).join('\n');
    continue;
  }
}
if (start !== -1) {
  if (kind === 'type' && !l.includes('{') && lines[start].trim().startsWith('export type') && l.endsWith(';')) {
    return lines.slice(start, i + 1).join('\n');
  }
  // ... 原大括號配對邏輯
}
```

## 擴充 map 的慣例
`const map = [['Name', 'enum'|'interface'|'type'], ...]`。新增領域型別時：
1. 在 `shared/types.ts` canonical 源加 `export` 區塊
2. 在此 map 加 `['TypeName', 'kind']`
3. 從 consumer 目錄跑 `node ../../scripts/export-shared-types.js` 重新生成
4. `npx --no-install tsc -p tsconfig.ut.json --noEmit` 驗證 0 error
