---
name: omni-auto-typo-check
description: 錯字檢查工具 - 防止「萮能」「蜑群」等常見錯別字在 OmniAuto 專案中重複出現
tags:
  - typo
  - verification
  - omni-auto
triggers:
  - "檢查錯別字"
  - "萮能"
  - "蜑群"
  - "萬能"
  - "蜂群"
  - "check_typo"
related_skills:
  - software-development/omni-auto
  - productivity/esggo-style
---

# OmniAuto 錯字檢查工具

## 什麼是「萮能」錯別字
「萮能」是「萬能」的常見錯別字，發音相似但字形不同。

## 什麼是「蜑群」統稱錯誤
專案統一用「**蜂群**」作為群體名稱；「蜑群」為錯誤字，需視為同一級別錯誤一起攔截。

## 檔案
- `scripts/check_typo.sh` - Bash 腳本，用於檢查 markdown 及文字檔案中是否包含錯別字
- `references/check_typo.md` - 使用說明
- `references/encoding-on-windows.md` - Windows 中文檔名/Git/下載路徑對策
- `references/bee-catalog-checklist.md` - 蜂民清冊內容完整性檢查

## 用法
```bash
# 檢查單個檔案
./scripts/check_typo.sh 蜂民清冊.md

# 檢查多個檔案
./scripts/check_typo.sh file1.md file2.md

# 內容完整性：確認清冊 10 類蜂民規格齊全
python scripts/bee_colony_demo.py
grep -E "^## [0-9]+\. 萬能" 蜂民清冊.md
```

## 功能
- 搜索錯別字「萮能」「蜑群」（應為「萬能」「蜂群」）
- 自動排除註解/備註行中的引用文字
- 返回退出碼 0 = clean，1 = 發現錯別字

## 禁語詞
在 OmniAuto / 萬能蜂民系列文件中，不要使用：
- 「萮能」
- 「蜑群」

---

## 活動圖資產放置規則
* 流程圖/示意圖統一放 `docs/`
* Markdown 中優先用真實圖片，不要長期保留 ASCII 流程圖作為唯一版本
* Windows 寫入 `docs/` 影像時，優先用 Python `urllib.request.urlretrieve()` 或 `requests`, 不要只依賴 PowerShell / curl

---

## 建立時間
2026-07-28 - 用於避免「萮能」「蜑群」等錯別字重複出現

## 提交前最佳實踐檢查清單
```bash
# 1. typo guard
./check_typo.sh 蜂民清冊.md

# 2. bee colony tooling still importable/runnable
python3 scripts/bee_colony_demo.py >/dev/null

# 3. smoke tests pass
python -m pytest tests/test_bee_colony_demo.py -q

# 4. docs assets present
python -c "import os; print('docs:', sorted(os.listdir('docs')))"
```

## CI 自動攔截
- `.github/workflows/typos.yml`：push/PR 到 `main` 時會掃描 `*.md,*.py,*.txt,*.sh`；發現 `萮能` 立即 fail，避免歷史錯字重入。

## 常見根因與修復

### 1. Windows Git 中文檔名編碼衝突
**問題**：Windows Git 預設使用系統語系編碼（GBK）處理中文檔名，與 UTF-8 內容衝突。
**症狀**：提交時檔名被錯誤編碼為亂碼；`git ls-files` 看到 escaped bytes；`git add path` 對某些中文檔回傳 `pathspec did not match`。
**解決方案**：
- 建立 `.gitattributes` 設定檔：
  ```
  *.md text working-tree-encoding=UTF-8
  *.sh text eol=lf
  ```
- 提交前先 `git add .gitattributes` 確保編碼設定
- 必要時用 `git rm --cached <file>` 重新整理 index 後再 add

### 2. Markdown 中的流程圖策略
**做法**：優先使用本機 `docs/` 目錄存放 PNG，並在 Markdown 中以圖片嵌入，避免倉庫被大量臨時檔污染。
```
專案根目冊/
└── docs/
    └── <流程圖>.png
```
Markdown 嵌入：
```markdown
## 流程圖
![萬能蜂群錯別字最佳實踐流程圖](docs/bee_typo_best_practices.png)
```

### 3. Windows 下載圖片到 `docs/` 的可靠方法
**問題**：PowerShell `Invoke-WebRequest` 在 Git Bash/curl 路徑下會寫到錯誤位置；`curl -o docs/x.png` 可能顯示成功但 dir 為空。
**解法**：用 Python 下載再放進 `docs/`：
```python
import urllib.request
from pathlib import Path
out = Path('docs/xxx.png')
out.parent.mkdir(exist_ok=True)
urllib.request.urlretrieve(url, str(out))
```

## 使用建議
- 每次變更清冊內容後：
  ```bash
  grep -R "蜑群\|萮能" 蜂民清冊.md README.md scripts/ 2>/dev/null || true
  ./check_typo.sh 蜂民清冊.md
  ```
- git commit 前再跑一次：
  ```bash
  ./check_typo.sh 蜂民清冊.md
  python -c "import os; print('docs:', sorted(os.listdir('docs')))"
  ```

## accrued repo session notes
- Windows + Git host:
  - 中文檔名在 Git index/status 可能出現 bytes-filename/escaped-name，即便 shell ls 看起來正常。
  - `git rm --cached <file>` 若設定錯誤會得到 No match，此時先 `git reset HEAD`，再重新 `git add <正確中文檔名>` 是可行 resume 路徑。
  - PowerShell Invoke-WebRequest 寫檔到 docs/ 可能有路徑遞迴問題；Python `urllib.request.urlretrieve` + `Path.mkdir(parents=True)` 更可靠。
- cursor-style tools on this repo path:
  - 路徑工具對這類 worktree/主機工具只有讀取允許；write/save 會被阻擋。不要反覆重試同一 write_file 路徑。
- Premake:
  - PremakeBuild 在本機環境下配置會失敗，先視為阻塞。
  - `assets.assetmanifest` 已被編輯過。
- scene 問題：
  - 有個 demo 顯示場景內容會擴展/波動，觀察到「scenes expanding」。

## 相關檔案
- `references/check_typo.md` - 使用說明
- `references/git-encoding-fix.md` - Windows Git 編碼衝突處理
- `references/encoding-on-windows.md` - 中文路徑/下載/檔名 workaround
- `references/bee-catalog-checklist.md` - 蜂民清冊內容完整性檢查
- `scripts/check_typo.sh` - 腳本實體檔案
- `.gitattributes` - UTF-8 編碼設定檔
- `C:\\Project\\esggo-omniauto\\蜂民清冊.md` - 目標檢查檔案