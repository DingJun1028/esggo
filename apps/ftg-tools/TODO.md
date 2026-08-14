# FTG Tools — MECE 最佳實踐審計 TODO

> 依 `mece-best-practices-audit` 技能做 7 支柱審計，所有項目接地於 `apps/ftg-tools/` 實際程式碼。
> 審計日期：2026-08-14 ｜ 審計範圍：`ftg-gen.js` + `ftg-mcp/server.js` + `server.test.mjs`

## 1. 正確性 / Correctness
- ✅ 路徑 bug 修復：`ftg-gen.js` 輸出 `dir` 改 `path.resolve(__dirname,'..','ftg-'+version)`，CLI 直接跑 / MCP cwd=ROOT 兩情境皆產到 `esggo/apps/ftg-{ver}` (f3be3c64e)
- ✅ deploy 前檢查本地產出存在：`server.js` `deploy()` 遍歷 `index.html/styles.css/app.js`，缺失則 reject `本地產出缺失` (本輪)
- 🔲 `ftg-gen.js` 模板字串未轉義用戶輸入版本號：若 version 含特殊字會破壞 HTML（目前 safeVer 只在 MCP 層擋，CLI 層無）

## 2. 安全 / Security
- ✅ 命令注入防護：`server.js` 加 `safeVer/safeHost/safeUser` 白名單（僅 `[a-zA-Z0-9.\-]`），host/user 走 env 預設不接受外部覆寫 (本輪)
- ✅ SSH key 路徑抽 env：`FTG_SSH_KEY` / `FTG_VPS_HOST` / `FTG_VPS_USER`，不再硬編 `~/.ssh/esggo_original` (本輪)
- 🔲 FAL image API 金鑰管理：路徑 C 未接，未來接圖像 API 時需 `FAL_KEY` env 且勿進 git

## 3. 可維護性 / Maintainability
- ✅ `server.js` 重寫為嚴格模式 + 結構化函數（runGen/deploy/safe* 分離），移除舊的 `run()` + `handle()` 混用 (本輪)
- ✅ `package.json` 加 `test` script (`node --test ftg-mcp/server.test.mjs`) (本輪)
- 🔲 `ftg-gen.js` 主題常量化：THEMES 物件內聯在生成器，未獨立成 `themes.json` 便於擴充

## 4. 效能 / Performance
- N/A (checked, nothing found) — 靜態生成器無效能瓶頸，單頁生成 <500ms

## 5. 可擴充性 / Extensibility
- 🔲 主題擴充：`THEMES` 只 stitch-dark/light；`midjourney` 為空殼註解，未實作
- 🔲 路徑 C (FAL API) 未接：`ftg-gen` 複用本地 jpg，未串 FAL image API 自動生成主題圖
- 🔲 多語擴充：lang 只 zh/en，未做 i18n 字典檔

## 6. 可觀測性 / Observability
- ✅ MCP server 啟動寫 stderr `[ftg-mcp] stdio server ready` (本輪保留)
- 🔲 結構化日誌：錯誤僅 return 字串，無 log level / timestamp；建議加 `console.error('[ftg-mcp][err]', ...)`

## 7. 測試 / Testing
- ✅ 最小冒煙測試：`server.test.mjs` 3 測試（CLI 生成 / tools/list / deploy 缺失防護），`node --test` 3/3 passed (本輪)
- 🔲 CI 整合：未接 GitHub Actions，建議加 `apps/ftg-tools` 的 test job
- 🔲 deploy 真實 E2E 測試：依賴 VPS SSH，標為 integration 不進 unit

---

## 本輪已修總結 (commit 待 push)
1. `server.js` 防命令注入 + env 抽離 + 部署前檢查 (安全/正確性/可維護性)
2. `server.test.mjs` 3 測試全過 (測試層)
3. `package.json` 加 test script
4. 本 TODO.md 接地審計

## 外部阻礙 (🔒)
- 🔒 FAL image API 串接：需確認 Nous subscription FAL key 注入方式（路徑 C 完整化）
- 🔒 Hermes MCP 註冊：`~/.hermes/config.yaml` 寫入被保護檔案阻擋（需用戶手動或授權），本輪未強寫
