# Windows/MSYS + 原生 gh 執行腳本的實證地雷（session-verified）

本技書在 Windows (MSYS/git-bash) 上把章節命令落成可執行腳本、跑 `gh` CLI 批次時
撞到的坑，已實際修好並驗證（批次封存 46 個 public 長草 repo，ok=46 fail=0）。
任何「跑 gh CLI 批次」的任務都適用——不限於實踐技書。

## 地雷 1：`/tmp` 解析不一致（MSYS python vs 原生 gh）

- 原生 `gh` 是 Windows 二進位，寫 `/tmp/x` 實際落到 `C:\tmp\x`。
- MSYS python 讀 `/tmp/x` 讀的是 MSYS 虛擬 `/tmp`（另一處）。
- 結果：腳本把 `gh` 輸出存 `/tmp/tmp.json`，python 開同一路徑卻 `FileNotFoundError`。
- 修法：暫檔一律寫到目前工作目錄（`.repo-inventory-tmp.json`）——
  native gh 與 MSYS python 對 `PWD` 的解析一致。
  （若用 `mktemp`，MSYS 版輸出還帶 `\r`，見地雷 2，需 `tr -d '\r'`。）

## 地雷 2：CRLF 毒化 gh 參數（最陰，靜默失敗）

- Windows python 以 text mode 寫出的 markdown/清單是 CRLF（`\r\n`）。
- bash `while IFS= read -r r` 以 `\n` 為行尾，`\r` 會留在 `r` 尾。
- 把帶 `\r` 的名稱傳給 `gh repo archive "$r"` → gh 收到末尾有 `\r` 的參數，
  **靜默失敗**（verify 步 `gh repo view ... -q .isArchived` 回空，被當成未封存）。
- 修法（雙重保險）：
  - 產生清單時先 `tr -d '\r' < in.txt > out.lf.txt`（LF 乾淨）。
  - 讀取時：`r="${r%$'\r'}"; r="$(echo "$r" | tr -d '\r')"`。
  - 寫結果 log 時也 `| tr -d '\r'`，避免 `\r` 混進結果檔。
- 症狀判斷：批次全部 `fail=N`、且單獨手動打同一個名字卻成功 → 幾乎必是 `\r` 毒參。

## 可複製的批次骨架（本技書實證 ok=46 fail=0）

```bash
#!/usr/bin/env bash
# 讀 LF 乾淨的 .names.lf.txt（每行一個 owner/repo），逐一 gh 動作並驗證
set -uo pipefail
cd "$(dirname "$0")/.."            # 用工作目錄，避開 /tmp 不一致
LIST=.names.lf.txt
: > .result.log
while IFS= read -r r; do
  r="${r%$'\r'}"; r="$(echo "$r" | tr -d '\r')"   # 雙重去 \r
  [ -z "$r" ] && continue
  gh repo archive "$r" --yes >/dev/null 2>&1
  st=$(gh repo view "$r" --json isArchived -q .isArchived 2>/dev/null | tr -d '\r')
  printf '%s\t%s\n' "$r" "$st" | tr -d '\r' >> .result.log
done < "$LIST"
```

## 驗證姿勢（別只信腳本自己的 stdout）

- 批次動作後，用「單次權威 API 呼叫」復核：
  `gh repo list --json nameWithOwner,isArchived --limit 300`，再比對目標集合是否全中。
- 寫章節命令前，先 `gh <cmd> --help` 確認 flag 存在
  （`gh repo sync` 無 `--dry-run`，曾杜撰 → 改 `git rev-list --left-right --count`）。
- `.gitignore` 收好暫檔（`.names.lf.txt` / `.result.log` / inventory 快照），別進 git。
