# Universal Translator · 終始矩陣驗證與債務清單 (2026-08)

實證產出，補 `esggo-ts-matrix-onboard` SKILL.md 的 Pitfalls。非環境偶發，可重複。

## 1. tsc 型別守門債務清單 (截至 2026-08)

`npx tsc -p tsconfig.ut.json --noEmit` 當前 ~65 errors，**全在 prior-turn 累積，非本次變更引入**：

| 檔案 | 錯誤性質 | 例 |
|---|---|---|
| `context_buffer.mjs` | implicit-any + 物件字面量多欄位 | `Parameter 'room' implicitly has an 'any' type`；`lastN does not exist on type '{ room?: string }'` |
| `s2s_gemini_live.mjs` | 聯合型收窄 | `Argument of type 'string \| undefined' is not assignable to ...`；`url does not exist in type '{ ws; sessionId }'` |
| `translate.mjs` | implicit-any + 路徑引用 | `Parameter 't' implicitly has an 'any' type`；`File '.../lang-matrix.d.ts' not found` |
| `server.mjs` | 索引型別 + 未同步欄位 | `Expression of type 'LanguageCode' can't be used to index type '{}'`；`context does not exist in type ISseTranslationEvent` (v1.7 補 context 後已解) |

**處置原則**：你的新契約（Zoom/Player/context）須 regen 後不「新增」錯誤即過關；完整 0-error 是獨立修繕，可標註但不阻塞功能 push。

## 2. Payload ↔ 型別同步範例 (ISseTranslationEvent.context)

v1.7 在 `server.mjs` 廣播 `context` 欄位，初漏 canonical 型別 → tsc 報 `context does not exist`。修法：
1. `shared/types.ts` 的 `ISseTranslationEvent` 加 `context?: Array<{ src: string; tgt?: string }>;`
2. generator map 已有 `['ISseTranslationEvent','interface']`（擴欄毋須加 map 條目）
3. `node ../../scripts/export-shared-types.js` → 生成檔含 `context`
4. `npx tsc -p tsconfig.ut.json --noEmit` 該錯消失

**規律**：任何 `.mjs` 對既有的 interface payload 增欄 → 必走「canonical 加欄 + regen」雙步，否則破窗。

## 3. 部署驗證 recipe (VPS + Cloudflare)

```bash
# VPS 拉最新 + 重啟
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  'cd /opt/esggo && git pull --ff-only origin main && pm2 restart universal-translator --update-env'
sleep 3
# 確認新靜態頁上線 (cache-bust 必要)
curl -s "https://translate.esggo.co/player.html?cb=$(date +%s)" | grep -o 'id="zoomBtn"\|async function startZoom\|esggo-shared.d.ts'
# 健康 + 功能端點
curl -s https://translate.esggo.co/health
curl -s https://translate.esggo.co/context/status
```

注意：`/stream.html` 在公網曾被 SSE 路由前綴遮蔽（`url.startsWith('/stream')` 已修為精確匹配 `/stream` 或 `/stream?`），修後 `/stream.html` 才正確回傳 audience 頁。

## 4. git push 被 unstaged 擋住 → 只 stash Jules 檔

`git pull --rebase` 報 "unstaged changes" 但 `git status --short | grep -vE "^??"` 看不出——實為 Jules AI agent 生成的追蹤修改：`.Jules/palette.md`、`.jules/palette.md`、`apps/ftg-2.0/{app.js,index.html,styles.css}`。

```bash
git stash push ".Jules/palette.md" ".jules/palette.md" "apps/ftg-2.0/app.js" "apps/ftg-2.0/index.html" "apps/ftg-2.0/styles.css"
git pull --rebase origin main
git push origin main
git stash pop
```

> 僅 stash 這些 Jules 檔，勿 `git stash -u`（會連 node_modules/untracked 全收，危險）。
