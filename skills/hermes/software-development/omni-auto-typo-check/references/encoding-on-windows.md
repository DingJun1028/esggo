# encoding-on-windows

中文檔名/路徑在 Windows Git + curl + PowerShell 下的穩定寫法。

1. Python `urllib.request.urlretrieve(url, str(out))` 寫入 `docs/*.png` 比 curl/PowerShell 可靠。
2. Git 中文檔名衝突時先 `git reset HEAD`，再用正確檔名重新 `git add`。
3. `.gitattributes` 中加：
   ```text
   *.md text working-tree-encoding=UTF-8
   *.sh text eol=lf
   ```
