# OneRingAI × oa-framework 運行配方（已知良好，實跑驗證）

> 補充 `esggo-oa-framework` §16。所有指令經本機實跑（Node v24.19.0 + 本地 Ollama）。

## 0. 前置
- Node ≥ 22。確認：`node --version`
- 本地 Ollama 活著且有模型：
  ```bash
  curl -s http://localhost:11434/api/tags 2>/dev/null | python3 -c "import sys,json;print([m['name'] for m in json.load(sys.stdin)['models']])"
  ```
  本機可用：`qwen2.5:3b-instruct-q4_K_M` (1.9GB, 快) / `gemma4:latest` (9.6GB) / `gemma4:26b` (18GB, 慢)
- npm registry 可達：`npm ping`

## 1. 安裝
`packages/oa-framework/package.json` 的 `dependencies` 加 `"@everworker/oneringai": "^1.0.0"`（pnpm 解析 1.0.1，相容），
```bash
cd /c/Project/esggo && pnpm install --filter @esggo/oa-framework
ls packages/oa-framework/node_modules/@everworker/oneringai   # 應存在
```
⚠️ `INSTALL_EXIT=1` 常見但無害：多因 `prepare` 鎖 `.git/config` 失敗（另有 git 程序佔用），與套件無關。

## 2. 消費層已知良好程式碼
```ts
import { createOAFrame, verify5T } from '../src/index.js';
import type { OATask } from '../src/core/types.js';

const task: OATask = {
  id: 'app-demo-1', title: 'ESG 永續短句生成',
  prompt: '用一句話說明：為什麼公共交通有助於企業 ESG 碳減量？',
  source: 'external-app://demo', routeTo: ['oneringai'],
  requiredDimensions: ['traceable','trackable','tangible','transparent','trustworthy'],
};
const orch = createOAFrame({                 // ← config，非 task
  llmBaseUrl: 'http://localhost:11434/v1', llmApiKey: 'ollama',
  llmModel: 'qwen2.5:3b-instruct-q4_K_M',   // 必須與 ollama list 完全一致
});
const results = await orch.run(task);        // ← task 傳給 run()
const a = results[0];
console.log(a.output);  // .output（非 .content）
console.log(a.t5);      // .t5（非 .fiveT）
console.log(a.hashLock);
const v = verify5T(a);  // 回傳 {pass:boolean,...}
console.log(v.pass ? 'PASS' : 'FAIL');
```

## 3. 真實錯誤轉錄
| 錯誤 | 根因 | 修法 |
|------|------|------|
| `404 model 'qwen2.5:3b' not found` | OneRingAI OpenAI provider，model tag 與本機不符 | 用 `qwen2.5:3b-instruct-q4_K_M` |
| `TypeError: ...reading 'routeTo'` | `createOAFrame(task).run()` | 改 `createOAFrame().run(task)` |
| `TypeError: ...reading 'content'` / `'fiveT'` | forgeT5 產物欄位名 | 用 `.output` / `.t5` |
| `verify5T(...)` 判斷永遠真 | 回傳物件非 boolean | 取 `.pass` |
| `tsc` 報 `TS6053 test/*.ts not found` | test/ 不在 tsconfig include | 良性，`tsx` 直接跑忽略 |

## 4. 驗證命令
```bash
cd /c/Project/esggo/packages/oa-framework
npx tsc -p tsconfig.json --noEmit              # EXIT=0
npx tsx test/oneringai-real.ts                # REAL_EXIT=0
npx tsx test/app-integration-demo.ts          # DEMO_EXIT=0
```
期望關鍵行：
```
[oneringai] 真實輸出: ...永續發展可以解釋為在考慮環境負擔...
5T 欄位: {"traceable":true,...,"trustworthy":true}
5T 驗證: PASS
```

## 5. 交付
esggo 主倉常多 session 並推 main；push 前 `git fetch` + `git pull --rebase`，再 `git push`。勿強制 push。
