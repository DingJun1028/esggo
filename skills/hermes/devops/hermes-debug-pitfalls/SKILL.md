---
name: hermes-debug-pitfalls
description: Debug output-vs-file mismatch or grep timeout on big repos.
---

# Hermes 除錯陷阱清單（非顯性坑）

適用：在 Hermes/CLI 環境寫檔後，發現「runtime 輸出」與「我寫的程式碼」對不上；
或在大 repo 跑 grep/git 指令莫名逾時。下列 5 項曾耗 20+ 回合才定位。

## 陷阱 1：輸出層機敏遮蔽（最常誤判為程式碼 bug）
- 現象：f-string 寫 `{sb_key[:4]}` 想印 `sbp_`，runtime 卻印 `***`；
  改變變數名（sb_token）、改寫法（先算 visible 變數）、去掉 `***`/`(MASKED)` 都無效。
- 真相：**Hermes 的輸出/顯示層會把匹配機敏模式的字串（sbp_、sk-、key-like hex）
  替換成 `***`**。這是安全層正確行為，不是 write_file 壞掉、也不是 f-string 壞掉。
- 驗證法：用 `read_file` 讀磁碟檔案看真實內容（會看到 `{sb_key[:4]}` 正確在位）；
  別信 terminal `cat` / python `print` 對祕密字串的顯示。
- 結論：處理真實 key 時，輸出被遮蔽 `***` 屬預期，勿反覆改碼。

## 陷阱 2：pnpm monorepo 混用 npm install → prisma 錯位
- 現象：npm run test 報 "Error: @prisma/client did not initialize yet"。
- 原因：repo 是 pnpm-workspace（packageManager: pnpm@x），卻用 npm install；
  postinstall 的 `prisma generate` 把 client 生成到 `.pnpm/@prisma+client.../.prisma/client`
  （pnpm 風格路徑），runtime 在 npm 解析位找不到。
- 解法：`npx prisma generate` 重新生成到 npm 解析位即修；
  正道是用聲明的 `pnpm install && pnpm test`。

## 陷阱 3：vitest CLI 子程序測試偶發 5s timeout
- 現象：omnicli/esggo-cli 測試 intermittent "Test timed out in 5000ms" + DEP0190 shell-escape 警告。
- 真相：child-process spawn 在負載下偶發慢，非真 defect；重跑即綠。
- 處理：連跑 2~3 次確認穩定，勿把 flaky timeout 當 bug 修。

## 陷阱 4：大 repo 上 grep -rl / git ls-files|xargs grep 逾時
- 現象：60s timeout（exit 124），repo 檔案多+symlink 時必現。
- 解法：用 `read_file` 直接讀目標小檔確認內容；
  或用 `search_files`（ripgrep 後端，有上限）。注意 search_files 走 MSYS 路徑
  偶發 "IO error os error 3 系統找不到指定的路徑" → 改用絕對路徑或換 read_file。
- 勿用遞迴 grep 掃整樹。

## 陷阱 5：bash $(reference) 把 case-branch 當指令
- 現象：cmd_integrations 裡 `echo "$(reference)"` 報 "reference: command not found"。
- 原因：reference 是 case 分支名，不是 function；`$()` 會嘗試執行它。
- 解法：用 `${REF}` 變數（REF 已在腳本頂部定義）。

## 通用心法
- 當「寫的」與「跑的」對不上：先懷疑「顯示層遮蔽 / 路徑解析 / pyc 快取 / 環境變數作用域」，
  再用 read_file 看磁碟真值，最後才懷疑邏輯。
- 真實憑證（Supabase key 等）依用戶硬規則：不寫檔、不進 git，僅 session env 注入。
