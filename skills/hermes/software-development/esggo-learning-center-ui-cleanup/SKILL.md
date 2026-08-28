---
name: esggo-learning-center-ui-cleanup
title: ESGGO Learning Center UI Cleanup
description: >
  Safe patterns for removing/merging views, cards, and i18n keys in the
  esggo-learning-center React app without leaving broken JSX, undefined
  components, or stale bundle references.
triggers:
  - 移除首頁功能卡、頁面、視角
  - 清理 records/survey/knowledge/role 功能
  - 精簡 App.jsx 回傳區塊
  - 外連 Google Form
pinned: false
---

# ESGGO Learning Center UI Cleanup

## Scope
- `src/App.jsx`
- `src/i18n/translations.js`

## Core workflow
1. 先讀完整 region：`read_file` `offset=...` 確認卡在 `return ...` 的哪一段。
2. 只移除**同層**元素（`<a>` / `<div>`）與其對應的 `setView(...)`；不要在一次 patch 內同時拆到 `return` 結尾。
3. 若 view 仍有 component 回呼（如 `ReplayListView`），先移除 view block，再移除 helper，或整個保留。
4. i18n：若移除 `f4/f5/f6`，同步清理 `t.f4/t.f5/t.f6` 使用點。
5. 外部連結樣式：hero CTA 預設用**文字連結**；除非使用者明確要求卡片/按鈕，否則不要包box。

## Pitfalls
- **`return` block 內的 Partial merge**：只換卡片的字而不關閉前一個 `</a>`，會把下一塊 `view === 'xxx' ...` 吃進卡片內 → 線上 runtime error。每次 patch 後 build 確認。
- **不同步 delete component**：舊 view 刪掉了，但 `const OldComp = ...` 仍存在且被渲染分支引用 → 線上 `ReferenceError`。刪 view block 前先確認該 component 已移除或仍被其他 view 使用。
- **names export 誤用**：`translations.js` 若改成 named export，需在檔尾補 `export default translations;`，`App.jsx` 才有 `default import`。
- **Repo 維護**：`.env`、Google credential / token、bot token 不得出現在 chat 輸出或 git 提交。
- **Drive embed 格式錯誤**：正確格式是 `https://drive.google.com/file/d/<id>/preview`，不是 `https://drive.google.com/file/<id>/preview`。`/d/` 缺少時影片會無法載入。
- **Replay API 欄位誤判**：REPLAY_WEB_APP_URL 可能回傳 `id` 而非 `url`/`driveUrl`。fetch 後先看實際 JSON 欄位，再組 embed，不要假設一定有 `url`。
- **View cleanup half-life**：移除 card UI 時同時要移除對應的 `{view === 'xxx' && (...)}` block，並確認 profile/modal state 不再引用已棄 view。

## Verification sequence
```bash
pnpm run build
firebase deploy --only hosting,firestore:rules
pnpm run build
```

## Home card inventory
當前保留首頁卡片固定為 4 項：
1. 學員資源區
2. 作業上傳
3. 課程回放
4. 滿意度調查

其餘 card/view/helper 必須清除；精簡時可用 `CardLink` / `CardAction` 抽取成小型元件，避免重覆 className。

## Multi-line hero title pattern
當 hero 標題需要強制換行或兩行呈現時，**不要把 `<br>` 放在翻譯字串內**；翻譯物件存的應該是純文字。正確做法：
- 在翻譯檔拆成 `heroTitleLine1` / `heroTitleLine2`
- 使用 `<br className="hidden sm:inline" />` 控制桌面換行
- 行高用 `leading-[1.5]`
- 間距先試 `gap-y-3` / `gap-x-4`；使用者要求「平均分配」時改用 `sm:items-center` + 分隔線
- 分隔符使用 `<span className="hidden sm:inline text-white/50 mx-2 align-middle">|<span className="sm:hidden text-white/50">|</span>`
- 每個 locale 都要同步這組 key，否則 `should have consistent keys across locales` 會失敗
- 若使用者說「效果不好 改回兩行」，優先回復成最乾淨的單 `<br>` 兩行，不要保留多餘分隔線或 span wrapper
- **最終 preferred 格式**：`2026 Berkeley` / `柏克萊國際永續策略人才培育課程學習中心`，無分隔線

## Locale key rename/split rule
任何 rename / split i18n key 時，三個 locale 必須同步更新。優先順序：
1. 先改 `translations.js` 三個 locale
2. 再改 `App.jsx` 使用點
3. 最後改 `content.test.js` 的已知 key 斷言
只改部分 locale 是 CI 失敗的最常見原因。

## Locale policy
- 僅保留 3 種語系：`zh-TW`、`zh-CN`、`en`
- 新增語系時，需同步更新語系選擇器 `<option>`，並把新 locale 對應 key 補齊到所有引用節點
- 英文命名原則：卡片/頁面按功能直譯，保留課程名稱裡既有英文專有名詞，不濫加翻譯
- 英文 locale **只翻當前版本實際顯示的 UI**；為已移除功能保留歷史 key 會造成噪音與維護負擔
- 當 `Object.keys(translations)` 從 2 個變成 3 個時，**必須**同步更新 `src/__tests__/content.test.js` 的 locale count assertion；這是 CI 合規的硬性步驟，不是可選修飾
- `translations.js` 尾段若是手動 patch 產生的多餘 `},` 會導致 Vite 解析失敗；每次加 locale 後先用 `node --check src/i18n/translations.js` 驗證尾段語法

## translations.js 編輯守則
- 檔尾必須是 `export default translations;`。若使用 named export，`App.jsx` 也要搭配正確 import。
- 在 Windows/MSYS 終端下，`patch` 對 `translations.js` 的 closure match 很容易誤觸非唯一段落；優先用 `read_file` + 精確 `patch`，失敗時立刻切換成 `write_file` 全文覆寫，避免同一段重試 3 次以上。
- `translations.js` 內若有重複的尾段樣式（如多重 `},`），Windows 環境的 lint 插件可能誤報 `Cannot find module 'C:\\\\c\\\\...'`；這是已知環境誤報，不要被它誤導。直接跑 `pnpm run build` 判斷語法是否正確。

## Verification sequence
```bash
pnpm run build
firebase deploy --only hosting,firestore:rules
pnpm run build
```
- 由 `v.id` 組 embed：`https://drive.google.com/file/d/<id>/preview`
- 切勿漏掉 `/d/`；缺少時會進入 placeholder。

## Card/action component extraction
調整卡片數量或樣式時，優先抽取：
- `CardLink({href, icon, title})`
- `CardAction({onClick, icon, title})`

減少 inline className 複製，也避免重複補元件定義。

## Header cleanup
- 移除角色視角時，一併移除 header 內相關 select / role badge / admin button / claims 引用
- 若只移除 select 的 option，仍會留下空 select 殘留；要整個移除該 dropdown 區塊

## Hero CTA 偏好
- 目前 hero 區域**不保留外部課程連結**；除非使用者明確要求，否則不要把官方課程按鈕加回來。
- 刪掉 hero CTA 後，记得同步清掉 `heroCta` 的顯示點，避免無意義翻译保留。

## Vite 6 env access pitfall
- In Vite 6, direct access like `import.meta.env.SOME_VAR` for custom/non-VITE-prefixed vars can fail with `Invalid 'process.env'` during build.
- Fix pattern: `import.meta.env?.VAR || import.meta.env.VAR || fallback`
- This applies to any env read in `App.jsx` or client components; verify with `pnpm run build` after changing env access.

## Pitfalls
- **`return` block 內的 Partial merge**：只換卡片的字而不關閉前一個 `</a>`，會把下一塊 `view === 'xxx' ...` 吃進卡片內 → 線上 runtime error。每次 patch 後 build 確認。
- **不同步 delete component**：舊 view 刪掉了，但 `const OldComp = ...` 仍存在且被渲染分支引用 → 線上 `ReferenceError`。刪 view block 前先確認該 component 已移除或仍被其他 view 使用。
- **names export 誤用**：`translations.js` 若改成 named export，需在檔尾補 `export default translations;`，`App.jsx` 才有 `default import`。
- **Repo 維護**：`.env`、Google credential / token、bot token 不得出現在 chat 輸出或 git 提交。
- **Drive embed 格式錯誤**：正確格式是 `https://drive.google.com/file/d/<id>/preview`，不是 `https://drive.google.com/file/<id>/preview`。`/d/` 缺少時影片會無法載入。
- **Replay API 欄位誤判**：REPLAY_WEB_APP_URL 可能回傳 `id` 而非 `url`/`driveUrl`。fetch 後先看實際 JSON 欄位，再組 embed，不要假設一定有 `url`。
- **View cleanup half-life**：移除 card UI 時同時要移除對應的 `{view === 'xxx' && (...)}` block，並確認 profile/modal state 不再引用已棄 view。
- **Component extraction 遺漏定義**：抽出 `CardLink` / `CardAction` 後，要在元件頂端補回定義；否則首次上線會 `ReferenceError`。
- **Header role 殘留**：只移除角色 select 的 options / 外層 select 標籤時，若未清乾淨，HTML 仍可能殘留 option 或相關 admin/profile menu 參照。

## Deployment verification

### 完整部署流程
```bash
# 1. 本地建置驗證
pnpm run build

# 2. 測試驗證
pnpm run test

# 3. 部署到 Firebase Hosting
firebase deploy --only hosting,firestore:rules

# 4. 驗證已部署
pnpm run build  # 二次建置確認無新變更
curl -sS https://esggo-learning-center.web.app | grep -c "Berkeley"
```

### Vercel 部署（如使用 Vercel）
```bash
# 首次部署
vercel --prod

# 後續部署
vercel --prod --yes

# 驗證 SPA 路由
curl -sS -o /dev/null -w "%{http_code}" https://<your-domain>/replay
curl -sS -o /dev/null -w "%{http_code}" https://<your-domain>/knowledge
```

### VPS Docker 部署
```bash
# 1. 建置 Docker 映像
docker build -t esggo-learning-center .

# 2. 推到 VPS
scp -i ~/.ssh/id_rsa_esggo_real -o StrictHostKeyChecking=accept-new \
  -r dist ubuntu@161.118.252.147:/opt/esggo/

# 3. 重啟服務
ssh -i ~/.ssh/id_rsa_esggo_real ubuntu@161.118.252.147 \
  "sudo systemctl restart esggo-app"

# 4. 驗證
curl -sS http://127.0.0.1:3000 | grep -c "Berkeley"
```

## After cleanup
- 確認線上版不再保留舊 view block、舊卡片。
- 確認首頁卡片文案/功能符合使用者指定縮寫/全名。