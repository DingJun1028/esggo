---
name: windows-hermes-update-troubleshooting
description: "Troubleshooting hermes update failures on Windows, especially when Hermes Desktop app is running."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows]
metadata:
  hermes:
    tags: [windows, troubleshooting, update, hermes]
    related_skills: [hermes-agent]
---

# Windows hermes update Troubleshooting

## Issue: `hermes update` fails with "Other Hermes processes are running"

On Windows, the Hermes Desktop app keeps native `.pyd` extension files locked. The update command will fail:

```
✗ Other Hermes processes are running from this install's venv:
  PID 17648  python.exe ...\venv\Scripts\python.exe -m hermes_cli.main serve --host 127.0.0.1 --por  ← Hermes Desktop backend
```

## Root Cause

On Windows, `.pyd` files (Python extension modules) are locked by the running process. The Hermes Desktop backend keeps these files open, preventing the update from replacing them. This is a Windows-specific behavior - on Linux/macOS, files can be replaced while in use.

## Solutions

### 1. Close the Hermes Desktop App (Recommended)
- Close the Hermes Desktop app completely
- Re-run `hermes update`
- This is the safest approach

### 2. Use `--force-venv` Flag (Use with Caution)
```bash
hermes update --force-venv
```
**Warning:** May leave broken state if interrupted. Only use when Desktop app is confirmed closed.

### 3. Manual Git Update (Most Reliable for Git-Installed Hermes)
```bash
cd "$HERMES_HOME/hermes-agent"
git fetch --depth=1 origin
git reset --hard origin/main
```

### 4. Update Hangs/Times Out
If `hermes update` hangs or times out:
- The automated update may have issues with git state
- Use manual git update (see above)
- Or run in a fresh terminal session with no other Hermes processes

## Issue: "Another git process seems to be running in this repository" (stale index.lock)

Symptom: any git command in `$HERMES_HOME/hermes-agent` fails with "Another git process
seems to be running in this repository, e.g. an editor opened by 'git commit'."

Root Cause: a leftover `.git\index.lock` from a crashed/interrupted git process
(e.g. a previous `hermes update` killed mid-run).

Fix:
```powershell
# 1. Confirm no other git/hermes update process is actually running (Task Manager / Get-Process git)
# 2. Remove the stale lock:
Remove-Item "$env:LOCALAPPDATA\hermes\hermes-agent\.git\index.lock"
# 3. Re-run the update
```

Verification: `git reset --hard origin/main` SUCCEEDING is itself proof the lock is
cleared (reset also needs the index lock). After a successful manual reset, HEAD is at
origin/main but the running Hermes process still uses the OLD code — close the Desktop
app and restart Hermes for the new code to load. If dependencies changed in the update,
follow with `hermes update --force-venv` (Desktop closed) or reinstall the venv.

## Issue: "Unable to create '.git/shallow.lock': File exists" (stale shallow lock)

Symptom: `git fetch --depth=1 origin` fails with
`fatal: Unable to create '.../.git/shallow.lock': File exists` — a stale lock from a
crashed SHALLOW fetch (Hermes installs use `--depth=1` shallow clones).

Diagnosis hint: a *live* concurrent git process (stray `hermes update`, editor, or
another terminal on the same repo) may be the real holder. Evidence of this: two
consecutive `git reset --hard origin/main` yielding DIFFERENT commits with no fetch in
between. Check with:
```powershell
Get-Process | Where-Object { $_.Name -match 'git|update' } | Select-Object Id, Name, StartTime
```

Fix:
```powershell
# kill any real stray git/update process first, then:
Remove-Item "$env:LOCALAPPDATA\hermes\hermes-agent\.git\shallow.lock"
Remove-Item "$env:LOCALAPPDATA\hermes\hermes-agent\.git\index.lock"   # if present
# re-fetch (plain fetch also clears stale shallow refs):
git fetch origin main
git reset --hard origin/main
git status   # expect: On branch main, up to date, working tree clean
```

## Issue: update 被中斷 → venv metadata 損毀（`pip check` 說 not installed 但 import 成功）

**症狀**：`hermes version` 顯示新版且 `Up to date`，看似成功，但實際 venv 是半完成狀態：
```
> venv/Scripts/python.exe -c "import cryptography; print(cryptography.__version__)"
48.0.1                                    # ← import 成功！

> venv/Scripts/python.exe -m pip check
hermes-agent 0.20.0 requires cryptography, which is not installed.   # ← 卻說沒裝
google-api-python-client requires httplib2, which is not installed.
```

**根因**：uv/pip 在 Windows 被 `.pyd` 鎖擋住後中斷，留下三類殘骸：
1. `cryptography-49.0.0.dist-info` 但實際檔案是 **48.0.1** → metadata 與內容不符，
   pip 依 dist-info 判定，故回報「未安裝」
2. 套件**完全遺失**（本例 `httplib2` 目錄不存在）
3. `site-packages/~aml`、`~ci`、`~ci-*.dist-info` 等 `~` 開頭的損毀目錄
   （pip 改名到一半中斷的產物）
4. repo 根目錄累積 `.hermes-update-staging` 殘留（本例一次中斷 18 個，二次中斷後達 **155 個**；2026-08 實測另含 **5 個目錄型**殘留——中斷的 update 把來源目錄直接 `rename` 成 `xxx.hermes-update-staging` 資料夾）。⚠️ **`del /q` 只刪「檔案型」殘留，刪不掉目錄型**——必須補 `for /d %%D in ("*.hermes-update-staging") do rd /s /q "%%D"` 才能清乾淨，否則下次 update 仍會撞這些目錄。診斷時用 `ls -d *.hermes-update-staging` 才看得到目錄型。

**關鍵**：只跑 `pip install -e ".[all]"` **修不好** —— pip 看到損毀的 dist-info 會誤判已安裝而跳過。
必須先刪 metadata 再強制重裝：

```bat
:: 1. 清 ~ 開頭損毀目錄
for /d %%D in ("venv\Lib\site-packages\~*") do rd /s /q "%%D"
:: 2. 刪掉不一致的 dist-info
for /d %%D in ("venv\Lib\site-packages\cryptography-*.dist-info") do rd /s /q "%%D"
:: 3. 強制重裝（--force-reinstall 繞過快取與誤判）
venv\Scripts\python.exe -m pip install --force-reinstall --no-cache-dir cryptography httplib2
:: 4. 補完整依賴
venv\Scripts\python.exe -m pip install -e ".[all]"
:: 5. 清 staging（檔案型 + 目錄型都要清，del 只刪檔案）
del /q *.hermes-update-staging 2>nul
for /d %%D in ("*.hermes-update-staging") do rd /s /q "%%D" 2>nul
```

**驗證**：`pip check` **無任何輸出**才算修好。`import` 成功不能作為判準。

**診斷順序**（照這個查，別只看 import）：
```bash
ls *.hermes-update-staging | wc -l                      # staging 殘留數
ls -d venv/Lib/site-packages/~*                          # 損毀目錄
ls -d venv/Lib/site-packages/<pkg>-*.dist-info           # 版本是否與實際相符
venv/Scripts/python.exe -m pip check                     # 權威判準
```

## Issue: PowerShell 下的指令語法（agent 常給錯）

Hermes 文件與多數指引給的是 **cmd 語法**，貼到 PowerShell 會失敗：

| cmd（錯在 PS） | PowerShell 正確寫法 |
|---|---|
| `cd /d "C:\path"` | `cd "C:\path"` — `/d` 是 cmd 參數 |
| `"C:\...\python.exe" -m pip install` | `& "C:\...\python.exe" -m pip install` — 帶引號執行檔需 `&` |
| `%LOCALAPPDATA%` | `$env:LOCALAPPDATA` |

實際踩過的錯誤：
```
Set-Location : 找不到接受引數 'C:\Users\...' 的位置參數
運算式或陳述式中有未預期的 '-m' 語彙基元
```
**最穩做法**：寫成 `.bat` 讓使用者雙擊，完全避開 shell 方言差異。

## 診斷速查：別被「看似成功」的訊號騙了

三個各自都會**假陽性**的訊號，必須合看：

| 訊號 | 為何不可信 |
|---|---|
| `hermes version` → `Up to date` | git 已到 origin/main 就這樣顯示，與 venv 狀態無關 |
| `hermes doctor` → 全綠 | doctor 檢查「當前安裝是否自洽」，**不檢查是否為最新版**。實測落後 580 commits 時 doctor 仍全綠 |
| `git rev-list --count HEAD..origin/main` → 0 | 只證明 git 步驟完成；deps 步驟可能已死在 `.pyd` 鎖上 |

**權威判準只有兩個**：`pip check` 無輸出、且 `ls *.hermes-update-staging` 為空。

## `hermes update` 的行程檢查與 flag（實測）

它檢查的是 **`hermes.exe`**（本例列出 7 個 PID），不只是 `python.exe`：
```
✗ Another hermes.exe is running:  PID 8816 / 14792 / 40540 / ...
  Windows blocks REPLACE on a running executable.
  Override with `hermes update --force`
```
覆寫 flag 是 **`--force`**（整體），`--force-venv` 只覆寫 venv 那一項檢查 —— 兩者不同，
遇到 `hermes.exe` 佔用時 `--force-venv` 無效。

**agent 絕不可自行執行 `--force`**：其中一個 PID 就是承載當前 agent session 的 Desktop
backend，執行等同自殺，且會在寫入中途中斷 → 製造出更嚴重的半完成狀態
（本例第二次中斷後 staging 檔從 18 個暴增到 155 個）。正確做法是產出 `.bat` 交給使用者。

## 先判斷是否真的需要重建 venv

```bash
git diff --stat HEAD origin/main -- pyproject.toml uv.lock
```
- **無輸出** → 純程式碼變更，`git reset --hard origin/main` + 重啟即可，不必碰 venv
- **有輸出** → 依賴變了，git reset 只會造成「新程式碼配舊套件」的錯配，**必須**重建 venv

本例輸出 `pyproject.toml | 16 +++---` 與 `uv.lock | 9 ++--`，故必須走 venv 重建路徑。

## `hermes doctor --fix` 修不了 npm 弱點

實測 `doctor --fix` 跑完，三個 workspace 的 npm 弱點原封不動：
```
1. Browser tools (agent-browser) has 2 npm vulnerabilities
2. web workspace has 3 npm vulnerabilities
3. ui-tui workspace has 1 npm vulnerability
```
原因是這些都需要**破壞性降版**才修得掉，`--fix` 不會替你決定：
- `brace-expansion` / `minimatch`：`npm audit fix` 跑完仍在，無相容修補版
- `undici`：需 `npm audit fix --force` 降到 6.28.0，**超出宣告依賴範圍**，不要在沒確認影響前執行

doctor 自己也標註這些是 `build-tool advisory`（建置期工具，非 runtime）。
**建議順序：先把版本更新完，再看 npm 弱點** —— 落後數百個 commit 時，多數弱點在新版早已修掉，
先修 npm 等於白做工。

## Prevention

- Always close the Desktop app before updating
- Consider using the CLI (`hermes`) for updates when possible
- For git-installed Hermes, prefer manual git updates for better control

## `hermes verify` / `hermes doctor` 也會觸發中斷 update 自修復迴圈（新觸發源，2026-08 實測）

不只 `hermes update` 會撞 venv 半完成狀態。**`hermes verify --json` 與 `hermes doctor` 在啟動時也會先嘗試「finish the interrupted install」**，然後在同一個損毀的 `pyyaml==6.0.3` metadata 上失敗：

```
⚠ A previous `hermes update` was interrupted mid-install — finishing dependency installation now...
  × Failed to read `pyyaml==6.0.3`
  └─▶ failed to open file `...pyyaml-6.0.3.dist-info/METADATA`: 系統找不到指定的檔案。 (os error 2)
✗ Could not auto-recover the interrupted install.
```

- 這與本文件「update 被中斷 → venv metadata 損毀」是**同一類**損壞，只是觸發指令不同（此例 `pyyaml` 是具體受害者套件）。
- 修復方式相同：清 `~*` 損毀目錄 + 刪不一致 dist-info + `--force-reinstall` + `pip check` 無輸出為準（見上文「update 被中斷」章節）。官方給的修復指令：
  ```
  cd /d "C:\Users\dingj\AppData\Local\hermes\hermes-agent"
  "C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe" -m pip install -e ".[all]"
  ```
  但需先關閉 Desktop app（否則 `.pyd` 鎖擋）；且 agent 絕不可自跑 `--force`。

### ⚠️ 重要：勿用 `hermes verify --json` 驗證非 Hermes 程式碼

`hermes verify --json` **只驗證 Hermes 自身的安裝/依賴**，完全不碰您的工作專案（OA framework、DeerFlow、esggo 等）。實測用它來「驗證 OA 套件」會：
1. 觸發上面的 pyyaml 自修復迴圈（環境損壞時），耗時且失敗；
2. 給出的結果與 OA/DeerFlow 程式碼正確性**無關**。

**正確做法**：OA/DeerFlow 的驗證用各自套件的測試命令（`pnpm run test`、`docker ps` + `curl :2026` HTTP 200、`docker exec ... /health`），不要用 `hermes verify`。對齊 `deerflow-windows-docker-setup` 技能內的「驗證（分層）」章節。

## Related

- **`scripts/repair-hermes-deps.bat`** — 一鍵修復「update 被中斷」的 venv 半完成狀態。
  自動：擋下仍在執行的 hermes.exe → 清 `~*` 損毀目錄 → 刪不一致的 dist-info →
  `--force-reinstall` 關鍵套件 → 補 `.[all]` → 清 staging → 以 `pip check` 驗證。
  交付方式：複製到使用者桌面請他關閉 Desktop 後雙擊（避開 PowerShell/cmd 方言問題）。
- See `hermes-agent` skill for general Hermes troubleshooting
- Windows-specific quirks are documented in the `hermes-agent` skill under "Windows-Specific Quirks" section