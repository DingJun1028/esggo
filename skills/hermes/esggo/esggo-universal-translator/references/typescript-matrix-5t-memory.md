# TypeScript 矩陣 & 5T 驗證閘 + 深貫廣通記憶整合 (v2.5)

## 深貫廣通無礪圓通 RWD 雙向同步 TypeScript 矩陣

### 1. 架構總覽

```
Frontend (float.html)          Backend (server.mjs)           VPS (production)
    ↓                              ↓                              ↓
CSS :root vars ─────────────┬───────────────────► validateEndBeginMatrix()
data-* attributes ──────────┼── TypeScript types/float-matrix.ts ─┤
SSE stream ─────────────────┼── shared/float-matrix.mjs ───────┤
QR code ────────────────────┼── verify-float-matrix.mjs ───────┤
Drag/Drop API ──────────────┼── END_STATE + START_CHAIN ───────┤
                              ↓
                        SHA-256 Hash Lock (Trustworthy)
```

### 2. TypeScript 型別矩陣 (types/float-matrix.ts)

單一真諼源 `FLOAT_CANONICAL` 定義所有型別:

- **FloatCSSVars** (19 CSS variables): cap-bg, src, trs, gold, ui, accent, accent2, line, ok, warn, err, bg, panel, panel2, muted, txt, radius, gap, font
- **RWD Breakpoint** (4): mobile (0-600), tablet (601-900), desktop (901-1440), ultrawide (1441+)
- **SubtitleSource** (4): sse, manual, stt, caption
- **AudioSource** (4): mic, system, file, stream
- **Role** (2): caster, viewer
- **ShareConfig**: viewer link, QR code
- **EndState**: 終態驗收條件 (4 breakpoints, 4 subtitle sources, 4 audio sources, 2 roles)
- **StartChain**: 6 步生命週期 [init, detect, capture, translate, render, share]
- **EndBeginningMatrix**: 5T 驗證結構
- **validateFiveT()**: TypeScript 內建驗證函數

### 3. Runtime 對應 (shared/float-matrix.mjs)

與 TypeScript 1:1 雙向同步的 ESM 模組:

- `CSS_VARS` (19 vars matching FloatCSSVars)
- `BREAKPOINT_NAMES` (4 breakpoints matching RWD config)
- `SUBTITLE_SOURCES`, `AUDIO_SOURCES`, `ROLES`
- `END_STATE` / `START_CHAIN` / `VERSIONS`
- `validateEndBeginMatrix()`: 驗證函數 + SHA-256 Hash Lock
- `buildContextHint()`: 建立翻譯前文提示

### 4. 5T 驗證閘 (scripts/verify-float-matrix.mjs)

```
✅ 5T 驗算閘: 全部通過 (12/12)
1. Traceable — TypeScript ↔ Runtime 雙向同步 (6/6 一致)
2. Trackable — 生命週期 Hook (START_CHAIN + END_STATE)
3. Tangible — float.html CSS 變數驗證 (19/19)
4. Transparent — 驗證閘機制 (validateEndBeginMatrix + hashLock)
5. Trustworthy — SHA-256 Hash Lock
```

驗證方法:
- 擷取 TypeScript `FLOAT_CANONICAL` const 物件
- 擷取 mjs `export const` 陣列/物件
- 比對每個 key 的值是否一致
- 驗證 float.html 包含所有 CSS 變數
- 驗證 gold 主色 (#ffd479)
- 驗證驗證閘機制存在
- 驗證 SHA-256 Hash Lock

### 5. 深貫廣通記憶整合 (src/memory-integration.mjs)

```typescript
// 深貫: 每個字幕行 → 共享記憶 (traceable provenance)
// 廣通: 跨房間/跨語言記憶同步
// 無礪: 記憶寫入失敗不影響翻譯流程 (graceful degradation)
// 圓通: 記憶 ↔ 字幕 ↔ 音訊 ↔ RWD 配置 四向同步

export async function storeSubtitleAsMemory(subtitle, roomId, role = 'caster')
export async function retrieveMemoryContext(roomId, limit = 5)
export async function storeFiveTResult(hashLock, score, details)
```

整合點: `server.mjs` 中的 `broadcastTranslation()` 函數會非阻塞呼叫 `storeSubtitleAsMemory()` 將字幕存入 TDAI 共享記憶。

### 6. CI/CD 整合

```yaml
# .github/workflows/ci.yml
- name: 終始矩陣型別守門 (tsc 0-error + 5T 驗證閘)
  run: |
    npx tsc -p tsconfig.ut.json --noEmit
    node scripts/verify-float-matrix.mjs
```

### 7. 部署驗證

```bash
# 部署步驟
scp float.html esggo-vps:/var/www/esggo/apps/universal-translator/public/float.html
scp server.mjs esggo-vps:/opt/esggo/apps/universal-translator/server.mjs
scp src/memory-integration.mjs esggo-vps:/opt/esggo/apps/universal-translator/src/

# 重啟
ssh esggo-vps "pm2 restart universal-translator --update-env"

# 驗證
curl -sf https://translate.esggo.co/float | grep "Beautiful Floating Window"
node scripts/verify-float-matrix.mjs  # EXIT=0
```

### 8. 深貫廣通原則對應 (Deep Penetration Mapping)

| 原則 | 實現 | 驗證 |
|------|------|------|
| 深貫 (Deep) | TypeScript ↔ Runtime ↔ HTML 三層映射 | verify-float-matrix.mjs |
| 廣通 (Broad) | 跨房間/跨語言記憶同步 | storeSubtitleAsMemory + retrieveMemoryContext |
| 無礪 (Unobstructed) | 記憶失敗不阻斷主流程 | try/catch + 3s timeout + .catch() |
| 圓通 (Interpenetrating) | 四向同步: 記憶 ↔ 字幕 ↔ 音訊 ↔ RWD | 共享記憶 ↔ SSE 廣播 ↔ RWD 斷點 |
