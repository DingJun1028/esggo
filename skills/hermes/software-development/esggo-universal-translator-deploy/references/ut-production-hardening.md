# UT 生產級企業化 — 實戰清單與坑 (2026-08-10, 2026-08-26 更新)

目標：把 `apps/universal-translator` 從「功能完整」推到「企業可部署」。四項（A-D）全部在 commit `727507504` 落地並實測。

## A. 安全加固 (server.mjs)
- **請求體上限**：`readBodyRaw(req, maxBytes)` 第二參數 `MAX_AUDIO_BYTES`(10MB)/`MAX_JSON_BYTES`(1MB)。超過 → `req.destroy()` + throw `PAYLOAD_TOO_LARGE`（防 DoS 內存耗盡）。
- **安全標頭**（回應頭全域注入）：
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(self), geolocation=()
  Content-Security-Policy: default-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'
  ```
- **CORS 白名單**：`ALLOWED_ORIGINS` env（預設 `https://translate.esggo.co,https://esggo.co,https://*.esggo.co`）。匹配邏輯：`*` 全通 / 完全相等 / `*.esggo.co` 後綴匹配。未匹配回落第一個允許源（**非 `*`**）。

## B. 自動化測試 (零依賴 node:test)
- 檔：`apps/universal-translator/test/ut.test.mjs`
- 跑：`node --test test/ut.test.mjs`（**勿引 vitest** — UT 不在 pnpm monorepo vitest 範圍，引 vitest 會因 workspace 爬蟲失敗）。
- 涵蓋：
  1. `lang-matrix.mjs`：`toCanonical` / `toEngineLang` 碼規範（zh-TW→zh-TW, mymemory→zh-CN, libretranslate→zh ...）
  2. `translate.mjs` 引擎鏈：雙向翻譯（zh↔en）回 `engine: google-gtx` + 5T 溯源標頭；`translateToMany` 多語平行；空文字回 `passthrough`（不拋錯）。
- 本地必須 **6/6 pass** 才 commit。

## C. STT 指標端點 (server.py)
- `GET /metrics` → `{service, model, device, status, uptime}`。UT 本身未加 `/metrics`（server.mjs 的 /health 已含 stats），但 STT 微服務補了。

## D. CI job (ci.yml)
```yaml
ut-tests:
  name: UT API Tests (node --test)
  runs-on: ubuntu-latest
  timeout-minutes: 10
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: ${{ env.NODE_VERSION }} }
    - name: Run UT test suite
      working-directory: apps/universal-translator
      run: node --test test/ut.test.mjs
      env: { NODE_ENV: test }
```
加在 `test` job 之後、`build` job 之前。

## STT/faster-whisper 部署坑（同 commit 修）
1. **缺 `requests`**：`faster-whisper` 1.0.3 間接需 `requests`，但 `requirements.txt` 沒列。venv 裝完跑 server 報 `ModuleNotFoundError: No module named 'requests'` → transcribe 回 `faster_whisper not installed`。修：requirements 加 `requests` 或部署後 `.venv/bin/pip install requests`。
2. **`vad_filter=True` 濾空短語音**：對 espeak 合成音/Zoom 短片語回空 segments。生產設 `vad_filter=False`，否則 `/speech-to-subtitle` 端到端辨識不到（HTTP 200 但 `text:""`）。

## ESM + require() 衝突陷阱 (2026-08-26 實證)

**`server.mjs` / `*.mjs` 是 ESM**，不能用 `require('fs')`。Node.js v22+ 會直接拋 `ReferenceError: require is not defined in ES module scope`.

### 現象
```bash
SyntaxError: Missing initializer in const declaration
    at compileSourceTextModule (...)
```
或者：
```bash
ReferenceError: require is not defined in ES module scope
```

### 根因
新添入的 `.mjs` 文件（如 `src/memory-integration.mjs`）在函數體內使用 `require('fs')`，但 ESM 模式下 `require` 不存在。

### 修法 (三選一)
**A. 頭部 import (推薦)**：
```js
import fs from 'node:fs';
import { createHash } from 'node:crypto';
```
函數體直接用 `fs.readFileSync(...)` / `createHash(...)`.

**B. 動態 import (適用條件式引入)**：
```js
const crypto = await import('node:crypto');
const hash = crypto.createHash('sha256').update(data).digest('hex');
```

**C. 驗證守門** — 部署前必驗證：
```bash
# 在 VPS 上驗證
node --check /opt/esggo/apps/universal-translator/server.mjs
node --check /opt/esggo/apps/universal-translator/src/memory-integration.mjs
# 在本地驗證
node --check apps/universal-translator/src/memory-integration.mjs
# 或直接跑
node --input-type=module -e "import './apps/universal-translator/src/memory-integration.mjs'"
```

### 部署驗證序列 (必驗)
```bash
# 1. 部署檔案到 VPS
scp src/memory-integration.mjs esggo-vps:/tmp/
ssh esggo-vps "cp /tmp/memory-integration.mjs /opt/esggo/apps/universal-translator/src/ && node --check /opt/esggo/apps/universal-translator/src/memory-integration.mjs && echo Syntax\ OK"

# 2. Restart
pm2 restart universal-translator

# 3. 驗證
curl -sf https://translate.esggo.co/float | head -5
curl -sf https://translate.esggo.co/health
```

### 提醒
- `.mjs` 文件中**永遠不要**使用 `require()`，即使是函數內部。
- `node --check` 是最快的語法驗證，部署前務必跑過。
- PM2 錯誤日誌可能顯示 `SyntaxError: Missing initializer` 但不顯示行號細節，請直接 `node --check` 定位。

---


## CI 卡 pending 誠實通報（重要）

GitHub Actions runner 擁塞時 ci.yml run 可能長期 `pending`，`ut-tests` 根本沒執行完。此時不可宣稱「CI 綠」。可靠驗證三件套：(1) 本機 `node --test` 6/6；(2) VPS 實測 `/health`+`/translate`+`/speech-to-subtitle`；(3) `git show HEAD:.github/workflows/ci.yml | grep ut-tests`。三項過了即使 ci.yml pending 也誠實標註「CI 因 runner 隊列未取得 green/red」。查詢：`gh run list --repo DingJun1028/esggo --json databaseId,workflowName,headSha,status | grep <sha>`；區分 `ESG-GO CI/CD Pipeline`（含 ut-tests）與 `OA-TWINS Auto-Repair`（wrapper，不含 ut-tests，同名 headSha 會誤導）。
