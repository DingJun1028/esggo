# Float Matrix 雙向同步驗證閘 (2026-08-26)

> 實作案例：OmniLive Beautiful Floating Window — TypeScript ↔ Runtime ↔ HTML 三向驗證

## 檔案對應
- **終 (Canonical)**: `apps/universal-translator/types/float-matrix.ts` — TS 型別契約
- **始 (Runtime)**: `apps/universal-translator/shared/float-matrix.mjs` — ESM 常數
- **驗證閘**: `apps/universal-translator/scripts/verify-float-matrix.mjs` — 5T 驗證
- **前端**: `apps/universal-translator/public/float.html` — HTML 模板

## 5T 驗證項目 (12/12)
1. **Traceable**: CSS_VARS (19), BREAKPOINT_NAMES (4), SUBTITLE_SOURCES (4), AUDIO_SOURCES (4), ROLES (2), VERSIONS (4) — TS ↔ mjs 雙向同步
2. **Trackable**: START_CHAIN 生命週期 + END_STATE 終態
3. **Tangible**: float.html 包含 19 CSS vars + #ffd479 金黃主色
4. **Transparent**: validateEndBeginMatrix + hashLock 存在
5. **Trustworthy**: SHA-256 Hash Lock 实现

## 部署指令
```bash
# 1. 本地驗證
cd /c/Project/esggo/apps/universal-translator
node scripts/verify-float-matrix.mjs

# 2. 部署到 VPS (Deep Penetration: 3-stage verification)
scp server.mjs esggo-vps:/var/www/esggo/apps/universal-translator/
cp /var/www/esggo/.../server.mjs /opt/esggo/.../server.mjs
pm2 restart universal-translator --update-env

# 3. 驗證 (Trackable)
curl -sf https://translate.esggo.co/health
curl -sf https://translate.esggo.co/float | grep "Beautiful Floating Window"

# 4. Hash Lock
# ba7c877c26d926a44fd38ded962f2a824bcebc6ed185eb67877ddee2515f5944
```

## 關鍵 Pitfalls
- ESM `.mjs` cannot use `require()` → use `import`
- `process.cwd()` in Node `--check` → path case mismatch causes "Cannot find module"
- PM2 `exec cwd` wrong → `PUBLIC_DIR` resolves to wrong path
- Regex `},` non-greedy → stops at first nested object boundary
- AI-generated preview images may have garbled text → verify via vision_analyze

## Entropy Score
- Phase 2: 0.08 → Phase 3: 0.04 (↓50%)