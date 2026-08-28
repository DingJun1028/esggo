---
name: windows-gitbash-fileops
description: Windows Git-Bash 陷阱：大樹複製/遷移、background 服務、殺 port 行程、UTF-8 誤判。
version: v1.0
---

# Windows Git-Bash 大樹檔案操作

Hermes `terminal` Local backend 在 Windows 上實際跑 **Git-Bash**（`/usr/bin/bash`，PWD 顯示如 `/c/Users/dingj`），不是 PowerShell。對含 `node_modules`/`.git`/`.next` 的巨型樹（數萬~十萬檔），常規 Unix 指令會踩坑。

## 致命陷阱 1：tar 管線孤兒子行程（最隱蔽）
```bash
cd /c/Project/src && tar -cf - . | (cd /c/Project/dst && tar -xf -)
```
若你用 `process(kill)` 終止整個 terminal 指令，**pipe 另一端的 tar 子行程（pid 不同）可能仍存活並持續寫入 dst**。症狀：dst 目錄檔案數**異常暴增**（如 27 檔變 2336，node_modules 被灌 1158 檔），且 `rm -rf` / `rmdir /s /q` 反覆清不掉（刪了又被寫回）。

**正確收尾**：
1. `ps aux | grep -i tar` 找出所有殘餘 tar pid
2. `kill -9 <pid1> <pid2>` 全部幹掉
3. **確認 `ps aux | grep tar` 為 NONE** 後再 `rm -rf dst/dir`
4. 重建 `cp -a` 或重新 tar

> 判斷 dst 是否髒：頂層 `ls -A` 正常但 `find -type f` 數爆量 → 深層子目錄被灌重複檔。

## 致命陷阱 2：cp -a 對大樹極慢
`cp -a src/. dst/` 含 `.git` 時，Git-Bash 逐檔 stat 每個 node，10 萬檔可跑 **17 分鐘**且中途無法簡單續傳。避免對大樹用 `cp -a`。

## 致命陷阱 3：robocopy 靜默漏拷
`robocopy SRC DST /MIR /XD .git` 回傳 EXIT=0 卻只拷了約 1/3（如 98911 → 29147 檔），整個 `node_modules`/`rules-tutorial`/`app` 變 0。原因：pnpm `.pnpm` 符號連結 + 超長路徑（>260 字元）被靜默跳過。robocopy 的 0 不代表「全成功」，只代表「已存在的一致檔無需複製」。**不要信 robocopy 的 exit code 當完整性證明**——一定要事後 `find` 比對兩側檔數。

## 致命陷阱 4：rm / rmdir 刪不掉
Git-Bash 的 `rm -rf` 與 `cmd //c "rmdir /s /q ..."` 對長路徑/鎖檔會**靜默失敗**（STILL_THERE）。可靠做法：
- 先確認無殘餘寫入行程（見陷阱 1）
- `rm -rfv dst/dir` 看輸出是否真的 removed

## 致命陷阱 5：find 全樹計數超時
`find /c/Project/bigtree -type f | wc -l` 在樹過大時會 **60s 超時**。改用輕量探針：
- 只查單一目錄：`find dst/subdir -type f | wc -l`
- 比對缺口：`comm -23 <(find src ... | sed 's#src/##' | sort) <(find dst ... | sed 's#dst/##' | sort)`

## 可靠全流程（目錄改名/全量複製，排除 .git 與 node_modules）

`node_modules` 與 `.git` 是可重建/不應搬的（node_modules 用 `npm install` 重建；.git 避免 nested repo 污染主倉）。

```bash
SRC=/c/Project/esggo-learning-center
DST=/c/Project/esggo/esggo-omni-center
mkdir -p "$DST"
# 排除兩者，tar 流式複製（比 cp -a 快、比 robocopy 可靠）
( cd "$SRC" && tar -cf - --exclude='.git' --exclude='node_modules' . ) \
  | ( cd "$DST" && tar -xf - )
# 事後比對（排除同兩項）
find "$SRC" -type f -not -path '*/.git/*' -not -path '*/node_modules/*' | sed "s#$SRC/##" | sort > /tmp/s.txt
find "$DST" -type f -not -path '*/.git/*' -not -path '*/node_modules/*' | sed "s#$DST/##" | sort > /tmp/d.txt
comm -23 /tmp/s.txt /tmp/d.txt    # 缺的補拷：while read f; do mkdir -p "$DST/$(dirname $f)"; cp -a "$SRC/$f" "$DST/$f"; done
```

## 致命陷阱 6：background 執行 `cd X && node Y` 直接退出

```bash
terminal(background=true, command="cd /c/Project/app && node server.mjs")
```
行程立刻 exit 1，輸出只有：
```
bash: no job control in this shell
stdin is not a tty
```
Git-Bash 在非互動 background 情境下無 job control，複合指令會被打斷。**症狀容易誤判成
「程式壞了」**——實際上 `node --check` 完全通過。

**可靠做法**：包一層 wrapper，用 `exec` 取代行程：
```bash
# run.sh
#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1
exec node server.mjs
```
```bash
terminal(background=true, command="bash /c/Project/app/run.sh")
```
> env 前綴（`PORT=8799 node ...`）同樣會觸發此問題 → 一併寫進 wrapper 或用 `.env` 檔。

## 致命陷阱 7：殺掉佔用 port 的行程，只有 PowerShell 可靠

Git-Bash 下這兩種寫法**都無效**（`//PID` 被 MSYS 路徑轉換吃掉；`cmd //c` 只印出 banner）：
```bash
taskkill //PID 2300 //F              # 錯誤: 無效的引數/選項 - '//PID'
cmd //c "taskkill /PID 2300 /F"      # 只回 Windows 版本 banner，沒殺到
```
**可靠做法**：
```bash
# 已知 pid
powershell -NoProfile -Command "Stop-Process -Id 2300 -Force"
# 只知 port（推薦，免先查 pid）
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8799 -State Listen -EA SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force }"
```
驗證一定要用**主動探測**而非相信指令回傳：
```bash
curl -s -m 2 http://localhost:8799/healthz >/dev/null && echo STILL_UP || echo PORT_FREE
```

### 衍生：殘留行程造成「假失敗」
舊版行程佔住 port → 新版啟動失敗 → 測試打到**舊服務**，回報一堆 `undefined` FAIL。
凡是「本機起服務再測」的腳本，開頭都要加埠佔用守衛：
```bash
if curl -sf -m 2 http://localhost:$PORT/healthz >/dev/null 2>&1; then
  echo "✗ port $PORT 已被佔用（可能是舊版殘留行程）"; exit 1
fi
# 啟動後再確認起來的是本次版本（healthz 必須含新欄位）
curl -sf -m 3 http://localhost:$PORT/healthz | grep -q '"version"' || { echo "✗ 未正常啟動"; exit 1; }
```

## 致命陷阱 8：`read_file` 誤判 UTF-8 檔為 binary → `patch` 連帶失效

含大量中日文註解的檔案，`read_file` 可能回 `Binary file - cannot display as text`
（`total_lines: 0`），`patch` 隨即報 `Binary file — cannot display as text`，無法編輯。

**先確認檔案本身沒問題**：
```bash
file monitor-server.mjs      # → JavaScript source, Unicode text, UTF-8 text
node --check monitor-server.mjs   # → 通過
```
**繞法**：`write_file` 寫一支一次性 Python 腳本做精確字串替換，跑完即刪。
```python
import io
p = r"C:\path\to\file.mjs"
s = io.open(p, encoding="utf-8").read()
assert s.count(old) == 1, "anchor not unique"
io.open(p, "w", encoding="utf-8", newline="\n").write(s.replace(old, new))
```
- 中文字串一律寫成 `\uXXXX` escape，避免腳本本身的編碼問題。
- 每個 anchor 都加 `assert`，絕不做無聲替換。
- 收尾 `node --check` / `bash -n` 驗證，然後 `rm` 掉腳本。
> `execute_code` 在 cron / 受限 profile 下會被 BLOCKED，所以用 `write_file` + `terminal python` 而非 `execute_code`。

## 致命陷阱 9：/tmp 在 MSYS Git-Bash 下不是你想的那個 /tmp（最隱蔽、會造成「腳本沒跑」假象）

write_file('/tmp/x.sh') 在 Hermes 底下實際落點是 \tmp\x.sh（驅動回報 "resolved to \\tmp\x.sh, OUTSIDE the active workspace"），而 Git-Bash 的 bash /tmp/x.sh 讀的是 MSYS 真 /tmp（通常映射為 C:\Users\<user>\AppData\Local\Temp）。兩者路徑不同，所以：

- 腳本寫到 \tmp\，bash 卻去 C:\...\Temp\tmp\ 找 → No such file or directory → 腳本根本沒執行。
- 症狀極易誤判：你以為 env 沒繼承 / node 沒讀到 key，實際是啟動腳本從來沒被執行過。本機曾因此繞了 6+ 輪才定位（設定 TencentDB memory gateway 的 TDAI_LLM_API_KEY 一直報無 key，最後發現是 wrapper 腳本根本沒跑）。

判斷與修復：
```bash
# 1) 確認 write_file 落點 vs bash 看到的 /tmp 是否同一處
ls -la /tmp/x.sh          # bash 側
# 若檔案不存在但 write_file 說成功 → 落點在 \tmp\（別名錯位）
# 2) 一律用 Windows 絕對路徑寫與讀，不要依賴 /tmp 別名
W="$LOCALAPPDATA"         # C:\Users\dingj\AppData\Local（Git-Bash 已展開）
python3 -c "open(r'$W/x.sh','w').write('...')"   # 寫
bash "$W/x.sh"                                # 讀（同一路徑）
```

衍生經驗：要驗證「環境變數是否真的進到子進程（如 node gateway）」，用這招從 Windows 層反向讀取，比反覆猜測快十倍：
```powershell
# 抓佔 port 的 pid
$PID=(Get-NetTCPConnection -LocalPort 8420 -State Listen).OwningProcess
# 反向 dump 該進程環境，確認 TDAI_* 是否在裡面
$p=Get-CimInstance Win32_Process -Filter "ProcessId=$PID"
$p.Environment -split "`n" | Where-Object { $_ -match 'TDAI_LLM' }
# 有輸出 = 繼承成功；NO TDAI = 變數根本沒進去（先懷疑腳本路徑錯位，不是 key 無效）
```

## 致命陷阱 10：Hermes 背景 terminal 的 env 不跨調用繼承，且 setx 寫入也不保證被背景 spawn 繼承

- 每一條 terminal() 調用是獨立 shell session，前條的 export 不會保留到下一條、也不會自動傳給 background=true 啟動的子進程。
- setx VAR val 寫入使用者環境後，需要新開的進程才看得到；Hermes 既有的 background spawn 可能用啟動時快照環境，照樣讀不到。
- 可靠做法：把 export + 目標程式放在同一條命令（inline 或同一個寫入正確路徑的 wrapper 腳本）裡，確保 exec 同 shell 啟動。例如：
  ```bash
  # wrapper.sh（務必用 $LOCALAPPDATA 真實路徑，見陷阱 9）
  source "$LOCALAPPDATA/mykeys.sh"   # 或直接在這裡 export
  exec node --import tsx/esm src/gateway/server.ts
  ```
  並用陷阱 9 的 PowerShell 反向驗證進程 env，不要靠 health 報錯 = key 無效 來推論（報錯也可能是腳本沒跑）。

## 致命陷阱 11：經 SSH 送 VPS 含中文/反引號的檔案，heredoc 必炸 → 改用 base64 傳輸

本地 Git-Bash 透過 SSH 傳 Python/TS 腳本到 VPS，若內容含中文或 template literal（`` `${...}` ``），`ssh ... "python3 - <<'PYEOF' ... PYEOF"` 會把反引號當命令替換、中文跳脫錯亂。典型症狀：`萬能蜂: command not found`、`SyntaxWarning: invalid escape sequence '\\s'`、檔案被截斷或寫入空行。

**可靠做法：本地 base64 編碼 → SSH 解碼寫檔（esggo VPS 實戰驗證）**
```bash
# 本地（Windows Git-Bash，C:/Project/esggo-learning-center/_tmp）
python3 -c "import base64;open('server.ts.b64','w').write(base64.b64encode(open('server.ts','rb').read()).decode())"
B64=$(cat server.ts.b64)
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  "echo '$B64' | base64 -d > /opt/esggo/vps/omnigateway/server.ts && node --check /opt/esggo/vps/omnigateway/server.ts && echo SYNTAX_OK"
```
- base64 字元集 `[A-Za-z0-9+/=]` 不含單引號，外層 `echo '$B64'` 安全。
- 改 VPS 已存在檔案的局部：heredoc 內**勿寫 template literal**；改用 `re.sub(r"raw pattern", new, src)`（pattern 用普通字串不用反引號），或從本地算好整檔 base64 覆寫。
- 實戰曾因 heredoc 破壞 `name: '萬能${names[i]}蜂'` 導致 `SyntaxError: Unexpected token '}'`，改用 Python `name:'萬能'+names[i]+'蜂'` 拼接修復。
- 若 `$B64` 內容有風險（理論上不會，base64 純 ASCII），改用 `cat file.b64 | ssh ... 'base64 -d > ...'` 避免單引號包住。

## 致命陷阱 12：MSYS 路徑餵給 Windows 原生 binary（python.exe）會被誤譯成 `C:\c\...`

Git-Bash 的 `/c/Users/...` 只對 bash 內建工具（cp/ls/tar）與 MSYS 版 binary 有效。把 MSYS 路徑直接當參數傳給 **Windows 原生** python.exe（如 hermes venv 的 `venv/Scripts/python.exe`），它會把 `/c/...` 拆成 `C:\c\...`：

```bash
/c/Users/dingj/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe /c/Users/dingj/check_plugin_api.py
# → can't open file 'C:\c\Users\dingj\...\check_plugin_api.py': No such file or directory
```
`exit=2`、`C:\c\` 前綴 = MSYS→Windows 路徑誤譯的鐵證。

**可靠做法**：
- `cd` 進目標目錄再用相對路徑：`cd "$LOCALAPPDATA/hermes/hermes-agent" && ./venv/Scripts/python.exe script.py`；或
- 用原生 `C:/Users/...`（正斜線）給 Windows binary：`python.exe "C:/Users/dingj/.../script.py"`。
- `python -c` 內嵌字串路徑也用 `C:/...` 或 `r'...'` 原生形式，不要用 `/c/...`。

## 致命陷阱 13：MSYS `ln -s` 用絕對 MSYS 路徑建 symlink → 原生 node 把目標誤譯成 `C:\\c\\...`

為讓 `@esggo/x` 被原生 node 解析，你會建 workspace 符號連結：
```bash
ln -sf /c/Project/esggo/libs/incremental node_modules/@esggo/incremental
```
但 symlink 儲存的目標字串是 `/c/Project/...`，當**原生 Windows node** 沿 symlink 讀取時，
MSYS 路徑轉換把它變成 `C:\c\Project\...`（雙重 `c` 前綴）→ `ERR_MODULE_NOT_FOUND`。
同樣 `cmd //c "mklink /D C:\Project\... C:\Project\..."` 會被 MSYS 路徑轉換破壞、且 `cmd //c`
會切到子目錄導致後續指令失效。

**可靠做法：用相對路徑當 symlink 目標**（從 esggo 根目錄執行，相對路徑在 MSYS 下不被絕對化）：
```bash
cd /c/Project/esggo
mkdir -p node_modules/@esggo
ln -s ../../libs/incremental node_modules/@esggo/incremental
# 驗證：node -e "import('@esggo/incremental').then(m=>console.log('keys',Object.keys(m).length))"
```
相對目標 `../../libs/incremental` 不含 MSYS 絕對前綴，原生 node 沿 symlink 解析時不會被誤譯。
（esggo 專案見 `esggo-monorepo-build` 的 Trap 4 手動 symlink 回退；本技巧也適用任何需讓
Windows 原生 binary 讀取的 symlink。）

## 路徑與環境提示
- C:\\Project 是本機磁碟，與 OneDrive 雲端無關聯（即使 Documents 下有 OneDrive 子樹，互不影響）。
- write_file 的相對/別名路徑（如 /tmp/...）在 Windows 上會被解析到 \tmp\...，與 Git-Bash 的 /tmp 不是同一處。寫腳本與讀腳本都用 $LOCALAPPDATA 或 C:/Users/... 絕對路徑，避免靜默錯位（曾導致整批啟動腳本沒被執行，誤判為 env 問題）。
- Git-Bash cmd //c 的引號串接不穩，必要時改用 .bat 檔原生執行。
- cp -a 遇到 Windows junction/symlink 會把連結解析成實體檔堆積 → 大樹複製優先用 tar 並 --exclude='node_modules'。
